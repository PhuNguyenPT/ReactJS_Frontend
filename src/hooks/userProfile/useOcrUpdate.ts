import { useCallback } from "react";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import {
  updateOcrData,
  type SubjectScorePayload,
  type OcrUpdatePayload,
} from "../../services/fileUpload/OcrUpdateService";
import { getVietnameseSubjectName } from "../../utils/scoreBoardSubjectHelper";
import type { ScordBoardSubjectTranslationKey } from "../../type/enum/score-board-subject";

export interface UseOcrUpdateResult {
  updateOcrScores: (
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  updateSingleGrade: (
    gradeKey: string,
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  transformScoreBoardToPayload: (gradeKey: string) => OcrUpdatePayload;
}

/**
 * Hook to handle OCR updates with multiple OCR IDs (one per grade/semester)
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

      // gradeScores always exists in the default state, so this check is valid
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

          // Only add valid scores
          if (!isNaN(numericScore) && numericScore >= 0 && numericScore <= 10) {
            subjectScores.push({
              name: vietnameseName,
              score: numericScore,
            });
          }
        }
      });

      // Also check selected subjects to ensure they're included
      // gradeSelectedSubjects always exists in the default state
      gradeSelectedSubjects.forEach((subjectKey) => {
        if (subjectKey) {
          const scoreValue = gradeScores[subjectKey];
          const vietnameseName = getVietnameseSubjectName(
            subjectKey as ScordBoardSubjectTranslationKey,
          );

          // Check if this subject is already added
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
   * Update OCR scores for all grade/semesters that have OCR IDs
   */
  const updateOcrScores = useCallback(
    async (
      isAuthenticated: boolean,
    ): Promise<{ success: boolean; message?: string }> => {
      try {
        // Check if OCR ID mapping has any entries
        if (Object.keys(ocrIdMapping).length === 0) {
          console.warn("[useOcrUpdate] No OCR ID mapping found in context");
          return {
            success: false,
            message: "No OCR data found. Please upload your transcript first.",
          };
        }

        console.log("[useOcrUpdate] OCR ID mapping:", ocrIdMapping);

        // Update each grade/semester that has an OCR ID
        const gradeKeys = Object.keys(ocrIdMapping);

        const updatePromises = gradeKeys.map(async (gradeKey) => {
          const ocrId = ocrIdMapping[gradeKey];
          const payload = transformScoreBoardToPayload(gradeKey);

          // Only update if there are scores to send
          if (payload.subjectScores.length === 0) {
            console.log(`[useOcrUpdate] Skipping ${gradeKey} - no scores`);
            return { success: true, gradeKey, skipped: true };
          }

          console.log(
            `[useOcrUpdate] Updating ${gradeKey} (OCR ID: ${ocrId}) with payload:`,
            JSON.stringify(payload, null, 2),
          );

          const result = await updateOcrData(ocrId, payload, isAuthenticated);

          return {
            success: result.success,
            gradeKey,
            message: result.message,
            skipped: false,
          };
        });

        // Wait for all updates to complete
        const results = await Promise.all(updatePromises);

        // Check if all updates were successful
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
          `[useOcrUpdate] OCR update successful: ${String(succeeded.length)} updated, ${String(skipped.length)} skipped`,
        );

        return {
          success: true,
          message: `Successfully updated ${String(succeeded.length)} grade/semester(s)`,
        };
      } catch (error) {
        console.error("[useOcrUpdate] Error updating OCR scores:", error);
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

  /**
   * Update OCR scores for a single grade/semester
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
            message: `No OCR data found for ${gradeKey}. Please upload your transcript first.`,
          };
        }

        const payload = transformScoreBoardToPayload(gradeKey);

        // Only update if there are scores to send
        if (payload.subjectScores.length === 0) {
          console.log(`[useOcrUpdate] No scores to update for ${gradeKey}`);
          return {
            success: false,
            message: `No scores to update for ${gradeKey}`,
          };
        }

        console.log(
          `[useOcrUpdate] Updating ${gradeKey} (OCR ID: ${ocrId}) with payload:`,
          JSON.stringify(payload, null, 2),
        );

        const result = await updateOcrData(ocrId, payload, isAuthenticated);

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

  return {
    updateOcrScores,
    updateSingleGrade,
    transformScoreBoardToPayload,
  };
};
