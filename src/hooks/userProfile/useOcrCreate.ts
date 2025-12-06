import { useCallback } from "react";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import {
  createOcrData,
  type OcrCreatePayload,
  type OcrCreateResponse,
} from "../../services/fileUpload/ocrCreateService";
import { getVietnameseSubjectName } from "../../utils/scoreBoardSubjectHelper";
import type { ScordBoardSubjectTranslationKey } from "../../type/enum/score-board-subject";
import type { SubjectScorePayload } from "../../type/interface/ocrServiceTypes";

export interface UseOcrCreateResult {
  createSingleGrade: (
    gradeKey: string,
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string; ocrId?: string }>;
  transformScoreBoardToPayload: (gradeKey: string) => OcrCreatePayload | null;
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
 * Parse gradeKey to extract grade and semester
 * @param gradeKey - Format: "10-1", "11-2", "12-1", etc.
 * @returns Object with grade and semester numbers, or null if invalid
 */
const parseGradeKey = (
  gradeKey: string,
): { grade: number; semester: number } | null => {
  try {
    const parts = gradeKey.split("-");
    if (parts.length !== 2) {
      console.error(`[useOcrCreate] Invalid gradeKey format: ${gradeKey}`);
      return null;
    }

    const grade = parseInt(parts[0], 10);
    const semester = parseInt(parts[1], 10);

    if (isNaN(grade) || isNaN(semester)) {
      console.error(`[useOcrCreate] Invalid grade or semester in: ${gradeKey}`);
      return null;
    }

    // Validate grade range (10-12) and semester range (1-2)
    if (grade < 10 || grade > 12 || semester < 1 || semester > 2) {
      console.error(
        `[useOcrCreate] Grade or semester out of valid range: ${gradeKey}`,
      );
      return null;
    }

    return { grade, semester };
  } catch (error) {
    console.error(`[useOcrCreate] Error parsing gradeKey ${gradeKey}:`, error);
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
   * @returns Payload with grade, semester, and subject scores, or null if invalid
   */
  const transformScoreBoardToPayload = useCallback(
    (gradeKey: string): OcrCreatePayload | null => {
      // Parse grade and semester from gradeKey
      const parsedGrade = parseGradeKey(gradeKey);
      if (!parsedGrade) {
        console.error(`[useOcrCreate] Failed to parse gradeKey: ${gradeKey}`);
        return null;
      }

      const { grade, semester } = parsedGrade;
      const subjectScores: SubjectScorePayload[] = [];
      const gradeScores = scores[gradeKey];
      const gradeSelectedSubjects = selectedSubjects[gradeKey];

      // Process all subjects that have scores
      const scoreEntries = Object.entries(gradeScores);
      if (scoreEntries.length > 0) {
        scoreEntries.forEach(([subjectKey, scoreValue]) => {
          if (scoreValue && scoreValue.trim() !== "") {
            const vietnameseName = getVietnameseSubjectName(
              subjectKey as ScordBoardSubjectTranslationKey,
            );
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
            } else {
              console.warn(
                `[useOcrCreate] Invalid score for ${subjectKey}: ${scoreValue}`,
              );
            }
          }
        });
      } else {
        console.warn(`[useOcrCreate] No scores found for grade ${gradeKey}`);
      }

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

      return {
        grade,
        semester,
        subjectScores,
      };
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
        if (!payload) {
          console.error(
            `[useOcrCreate] Failed to transform payload for ${gradeKey}`,
          );
          return {
            success: false,
            message: `Invalid grade/semester format: ${gradeKey}`,
          };
        }

        if (payload.subjectScores.length === 0) {
          console.log(`[useOcrCreate] No scores to save for ${gradeKey}`);
          return {
            success: false,
            message: `No scores to save for Grade ${String(payload.grade)} - Semester ${String(payload.semester)}. Please enter at least one subject score.`,
          };
        }

        // Call create API
        const result: OcrCreateResponse = await createOcrData(
          studentId,
          payload,
          isAuthenticated,
        );

        if (result.success && result.ocrId) {
          updateOcrId(gradeKey, result.ocrId);

          return {
            success: true,
            message: `Successfully created record for Grade ${String(payload.grade)} - Semester ${String(payload.semester)}`,
            ocrId: result.ocrId,
          };
        } else {
          console.error(
            `[useOcrCreate] Failed to create ${gradeKey}:`,
            result.message,
          );
          return {
            success: false,
            message:
              result.message ??
              `Failed to create record for Grade ${String(payload.grade)} - Semester ${String(payload.semester)}`,
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
