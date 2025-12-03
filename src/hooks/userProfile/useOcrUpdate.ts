import { useCallback } from "react";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import {
  updateOcrData,
  type OcrUpdatePayload,
  type OcrUpdateResponse,
} from "../../services/fileUpload/ocrUpdateService"; // CHANGED
import { getVietnameseSubjectName } from "../../utils/scoreBoardSubjectHelper";
import type { ScordBoardSubjectTranslationKey } from "../../type/enum/score-board-subject";
import type { SubjectScorePayload } from "../../type/interface/ocrServiceTypes";

export interface UseOcrUpdateResult {
  updateSingleGrade: (
    gradeKey: string,
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  updateAllGrades: (
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  transformScoreBoardToPayload: (gradeKey: string) => OcrUpdatePayload;
}

/**
 * Hook to handle OCR updates (PATCH) for existing OCR transcripts
 */
export const useOcrUpdate = (): UseOcrUpdateResult => {
  const { scores, selectedSubjects, ocrIdMapping } = useNinthForm();

  /**
   * Transform score board data for a specific grade/semester to API payload
   * @param gradeKey - The grade/semester key (e.g., "10-1", "11-2")
   */
  const transformScoreBoardToPayload = useCallback(
    (gradeKey: string): OcrUpdatePayload => {
      const subjectScores: SubjectScorePayload[] = [];
      const gradeScores = scores[gradeKey];
      const gradeSelectedSubjects = selectedSubjects[gradeKey];

      if (Object.keys(gradeScores).length === 0) {
        console.warn(`[useOcrUpdate] No scores found for grade ${gradeKey}`);
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
   * Update existing OCR transcript for a single grade/semester
   * PATCH /ocr/{id} or PATCH /ocr/guest/{id}
   */
  const updateSingleGrade = useCallback(
    async (
      gradeKey: string,
      isAuthenticated: boolean,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        // Check if OCR ID exists for this grade
        const ocrId = ocrIdMapping[gradeKey];

        if (!ocrId) {
          console.warn(`[useOcrUpdate] No OCR ID found for ${gradeKey}`);
          return {
            success: false,
            message: `No existing record found for ${gradeKey}. Please create a new record first.`,
          };
        }

        // Transform scores to payload
        const payload = transformScoreBoardToPayload(gradeKey);

        // Validate payload
        if (payload.subjectScores.length === 0) {
          console.log(`[useOcrUpdate] No scores to update for ${gradeKey}`);
          return {
            success: false,
            message: `No scores to update for ${gradeKey}`,
          };
        }

        console.log(`[useOcrUpdate] Updating ${gradeKey} (OCR ID: ${ocrId})`);
        console.log(
          `[useOcrUpdate] Payload:`,
          JSON.stringify(payload, null, 2),
        );

        // Call update API
        const result: OcrUpdateResponse = await updateOcrData(
          ocrId,
          payload,
          isAuthenticated,
        );

        if (result.success) {
          console.log(`[useOcrUpdate] Successfully updated ${gradeKey}`);
        } else {
          console.error(
            `[useOcrUpdate] Failed to update ${gradeKey}:`,
            result.message,
          );
        }

        return result;
      } catch (error) {
        console.error(`[useOcrUpdate] Error updating ${gradeKey}:`, error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : `Failed to update ${gradeKey}`,
        };
      }
    },
    [ocrIdMapping, transformScoreBoardToPayload],
  );

  /**
   * Update all grade/semesters that have OCR IDs
   * Useful for bulk updates
   */
  const updateAllGrades = useCallback(
    async (
      isAuthenticated: boolean,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        if (Object.keys(ocrIdMapping).length === 0) {
          console.warn("[useOcrUpdate] No OCR ID mapping found in context");
          return {
            success: false,
            message: "No OCR data found. Please create records first.",
          };
        }

        console.log("[useOcrUpdate] Starting bulk update for all grades");
        console.log("[useOcrUpdate] OCR ID mapping:", ocrIdMapping);

        const gradeKeys = Object.keys(ocrIdMapping);

        const updatePromises = gradeKeys.map(async (gradeKey) => {
          const ocrId = ocrIdMapping[gradeKey];
          const payload = transformScoreBoardToPayload(gradeKey);

          if (payload.subjectScores.length === 0) {
            console.log(`[useOcrUpdate] Skipping ${gradeKey} - no scores`);
            return { success: true, gradeKey, skipped: true };
          }

          console.log(`[useOcrUpdate] Updating ${gradeKey} (OCR ID: ${ocrId})`);

          const result = await updateOcrData(ocrId, payload, isAuthenticated);

          return {
            success: result.success,
            gradeKey,
            message: result.message,
            skipped: false,
          };
        });

        const results = await Promise.all(updatePromises);

        const failed = results.filter((r) => !r.success && !r.skipped);
        const succeeded = results.filter((r) => r.success && !r.skipped);
        const skipped = results.filter((r) => r.skipped);

        if (failed.length > 0) {
          console.error(
            "[useOcrUpdate] Some OCR updates failed:",
            failed.map((f) => f.gradeKey),
          );
          return {
            success: false,
            message: `Failed to update ${String(failed.length)} grade/semester(s): ${failed.map((f) => f.gradeKey).join(", ")}`,
          };
        }

        console.log(
          `[useOcrUpdate] Bulk update complete: ${String(succeeded.length)} updated, ${String(skipped.length)} skipped`,
        );

        return {
          success: true,
          message: `Successfully updated ${String(succeeded.length)} grade/semester(s)`,
        };
      } catch (error) {
        console.error("[useOcrUpdate] Error in bulk update:", error);
        return {
          success: false,
          message:
            error instanceof Error
              ? error.message
              : "Failed to update OCR scores",
        };
      }
    },
    [ocrIdMapping, transformScoreBoardToPayload],
  );

  return {
    updateSingleGrade,
    updateAllGrades,
    transformScoreBoardToPayload,
  };
};
