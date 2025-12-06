import { useCallback } from "react";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";
import { useOcrCreate } from "./useOcrCreate";
import { useOcrUpdate } from "./useOcrUpdate";

export interface UseOcrManagerResult {
  saveOrUpdateGrade: (
    gradeKey: string,
    isAuthenticated: boolean,
  ) => Promise<{ success: boolean; message?: string }>;
  hasOcrId: (gradeKey: string) => boolean;
  getOperationType: (gradeKey: string) => "create" | "update" | "none";
}

/**
 * Orchestrator hook that manages both CREATE and UPDATE operations
 * Automatically determines which operation to use based on OCR ID existence
 */
export const useOcrManager = (): UseOcrManagerResult => {
  const { ocrIdMapping, scores } = useNinthForm();
  const { createSingleGrade } = useOcrCreate();
  const { updateSingleGrade } = useOcrUpdate();

  /**
   * Check if a grade/semester has an existing OCR ID
   */
  const hasOcrId = useCallback(
    (gradeKey: string): boolean => {
      return Boolean(ocrIdMapping[gradeKey]);
    },
    [ocrIdMapping],
  );

  /**
   * Determine operation type for a grade/semester
   */
  const getOperationType = useCallback(
    (gradeKey: string): "create" | "update" | "none" => {
      const hasScores = Object.keys(scores[gradeKey] ?? {}).length > 0;
      const hasId = hasOcrId(gradeKey);

      if (!hasScores) {
        return "none";
      }

      return hasId ? "update" : "create";
    },
    [scores, hasOcrId],
  );

  /**
   * Smart save/update function that automatically chooses the right operation
   * - If OCR ID exists → UPDATE (PATCH)
   * - If no OCR ID exists → CREATE (POST)
   */
  const saveOrUpdateGrade = useCallback(
    async (
      gradeKey: string,
      isAuthenticated: boolean,
    ): Promise<{ success: boolean; message?: string }> => {
      const operationType = getOperationType(gradeKey);

      if (operationType === "none") {
        return {
          success: false,
          message: `No scores found for ${gradeKey}. Please enter at least one subject score.`,
        };
      }

      if (operationType === "create") {
        return createSingleGrade(gradeKey, isAuthenticated);
      } else {
        return updateSingleGrade(gradeKey, isAuthenticated);
      }
    },
    [getOperationType, createSingleGrade, updateSingleGrade],
  );

  return {
    saveOrUpdateGrade,
    hasOcrId,
    getOperationType,
  };
};
