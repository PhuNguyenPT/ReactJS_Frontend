import { useCallback } from "react";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import {
  createOcrData,
  type OcrCreatePayload,
  type OcrCreateResponse,
} from "../../services/fileUpload/ocrCreateService"; // CHANGED
import { getVietnameseSubjectName } from "../../utils/scoreBoardSubjectHelper";
import type { ScordBoardSubjectTranslationKey } from "../../type/enum/score-board-subject";
import type { SubjectScorePayload } from "../../type/interface/ocrServiceTypes";

export interface UseOcrCreateResult {
  createSingleGrade: (
    gradeKey: string,
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string; ocrId?: string }>;
  transformScoreBoardToPayload: (gradeKey: string) => OcrCreatePayload;
}

/**
 * Helper function to get studentId from localStorage
 */
const getStudentIdFromStorage = (): string | null => {
  try {
    const studentId = localStorage.getItem("studentId");
    if (!studentId) {
      console.warn("[useOcrCreate] No studentId found in localStorage");
    }
    return studentId;
  } catch (error) {
    console.error(
      "[useOcrCreate] Error reading studentId from localStorage:",
      error,
    );
    return null;
  }
};

/**
 * Hook to handle OCR creation (POST) for manually entered scores
 */
export const useOcrCreate = (): UseOcrCreateResult => {
  const { scores, selectedSubjects, updateOcrId } = useNinthForm();

  /**
   * Transform score board data for a specific grade/semester to API payload
   * @param gradeKey - The grade/semester key (e.g., "10-1", "11-2")
   */
  const transformScoreBoardToPayload = useCallback(
    (gradeKey: string): OcrCreatePayload => {
      const subjectScores: SubjectScorePayload[] = [];
      const gradeScores = scores[gradeKey];
      const gradeSelectedSubjects = selectedSubjects[gradeKey];

      if (Object.keys(gradeScores).length === 0) {
        console.warn(`[useOcrCreate] No scores found for grade ${gradeKey}`);
        return { subjectScores: [] };
      }

      // Process all subjects that have scores
      Object.entries(gradeScores).forEach(([subjectKey, scoreValue]) => {
        if (scoreValue && scoreValue.trim() !== "") {
          const vietnameseName = getVietnameseSubjectName(
            subjectKey as ScordBoardSubjectTranslationKey,
          );
          const numericScore = parseFloat(scoreValue);

          if (!isNaN(numericScore) && numericScore >= 0 && numericScore <= 10) {
            subjectScores.push({
              name: vietnameseName,
              score: numericScore,
            });
          }
        }
      });

      // Also check selected subjects to ensure they're included
      gradeSelectedSubjects.forEach((subjectKey) => {
        if (subjectKey) {
          const scoreValue = gradeScores[subjectKey];
          const vietnameseName = getVietnameseSubjectName(
            subjectKey as ScordBoardSubjectTranslationKey,
          );

          const alreadyAdded = subjectScores.some(
            (s) => s.name === vietnameseName,
          );

          if (!alreadyAdded && scoreValue && scoreValue.trim() !== "") {
            const numericScore = parseFloat(scoreValue);
            if (
              !isNaN(numericScore) &&
              numericScore >= 0 &&
              numericScore <= 10
            ) {
              subjectScores.push({
                name: vietnameseName,
                score: numericScore,
              });
            }
          }
        }
      });

      return { subjectScores };
    },
    [scores, selectedSubjects],
  );

  /**
   * Create new OCR transcript for a single grade/semester
   * POST /ocr/{studentId} or POST /ocr/guest/{studentId}
   */
  const createSingleGrade = useCallback(
    async (
      gradeKey: string,
      isAuthenticated: boolean,
    ): Promise<{ success: boolean; message?: string; ocrId?: string }> => {
      try {
        // Get studentId from localStorage
        const studentId = getStudentIdFromStorage();

        if (!studentId) {
          console.error("[useOcrCreate] No studentId found in localStorage");
          return {
            success: false,
            message:
              "Student ID not found. Please complete previous steps first.",
          };
        }

        // Transform scores to payload
        const payload = transformScoreBoardToPayload(gradeKey);

        // Validate payload
        if (payload.subjectScores.length === 0) {
          console.log(`[useOcrCreate] No scores to save for ${gradeKey}`);
          return {
            success: false,
            message: `No scores to save for ${gradeKey}. Please enter at least one subject score.`,
          };
        }

        console.log(
          `[useOcrCreate] Creating new OCR for ${gradeKey} (Student ID: ${studentId})`,
        );
        console.log(
          `[useOcrCreate] Payload:`,
          JSON.stringify(payload, null, 2),
        );

        // Call create API
        const result: OcrCreateResponse = await createOcrData(
          studentId,
          payload,
          isAuthenticated,
        );

        if (result.success && result.ocrId) {
          updateOcrId(gradeKey, result.ocrId);
          console.log(
            `[useOcrCreate] Successfully created ${gradeKey} with OCR ID: ${result.ocrId}`,
          );

          return {
            success: true,
            message: `Successfully created grade record for ${gradeKey}`,
            ocrId: result.ocrId,
          };
        } else {
          console.error(
            `[useOcrCreate] Failed to create ${gradeKey}:`,
            result.message,
          );
          return {
            success: false,
            message: result.message ?? `Failed to create ${gradeKey}`,
          };
        }
      } catch (error) {
        console.error(`[useOcrCreate] Error creating ${gradeKey}:`, error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : `Failed to create ${gradeKey}`,
        };
      }
    },
    [transformScoreBoardToPayload, updateOcrId],
  );

  return {
    createSingleGrade,
    transformScoreBoardToPayload,
  };
};
