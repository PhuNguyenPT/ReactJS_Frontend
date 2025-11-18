import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NinthFormNavigationState } from "../../type/interface/navigationTypes";
import type { OcrResultItem } from "../../type/interface/ocrTypes";
import {
  ScoreBoardSubjects,
  getNationalExamSubjectTranslationKey,
  isValidSubjectKey,
  type ScordBoardSubjectTranslationKey,
} from "../../type/enum/score-board-subject";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";

export type SubjectScores = Record<string, string>;
export type GradeScores = Record<string, SubjectScores>;

export interface GradeInfo {
  key: string;
  grade: string;
  semester: string;
}

export interface RetryAlertState {
  show: boolean;
  type: "warning" | "info" | "error";
  message: string;
}

const mapOcrResultsToGradeSemesters = (
  ocrResults: OcrResultItem[],
): Record<string, OcrResultItem | null> => {
  const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];

  // Initialize with all positions as null
  const gradeMap: Record<string, OcrResultItem | null> = {
    "10-1": null,
    "10-2": null,
    "11-1": null,
    "11-2": null,
    "12-1": null,
    "12-2": null,
  };

  ocrResults.forEach((result, index) => {
    if (index < gradeKeys.length) {
      const gradeKey = gradeKeys[index];
      gradeMap[gradeKey] = result;
    }
  });

  return gradeMap;
};

export const useNinthFormLogic = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigationState = location.state as
    | NinthFormNavigationState
    | undefined;

  const [showAlert, setShowAlert] = useState(false);
  const [retryAlert, setRetryAlert] = useState<RetryAlertState>({
    show: false,
    type: "info",
    message: "",
  });

  // Use the context hook
  const {
    scores,
    selectedSubjects,
    hasOcrData,
    updateScore,
    updateSelectedSubject,
    removeSubjectScore,
    loadOcrData,
  } = useNinthForm();

  // Fixed subjects using translation keys
  const fixedSubjects = useMemo(
    () =>
      [
        ScoreBoardSubjects.TOAN,
        ScoreBoardSubjects.NGU_VAN,
        ScoreBoardSubjects.TIENG_ANH,
        ScoreBoardSubjects.LICH_SU,
      ] as ScordBoardSubjectTranslationKey[],
    [],
  );

  // Optional subjects using translation keys
  const optionalSubjects = useMemo(
    () =>
      [
        ScoreBoardSubjects.DIA_LY,
        ScoreBoardSubjects.GDKTPL,
        ScoreBoardSubjects.VAT_LY,
        ScoreBoardSubjects.HOA_HOC,
        ScoreBoardSubjects.SINH_HOC,
        ScoreBoardSubjects.CONG_NGHE_CONG_NGHIEP,
        ScoreBoardSubjects.CONG_NGHE_NONG_NGHIEP,
        ScoreBoardSubjects.TIN_HOC,
      ] as ScordBoardSubjectTranslationKey[],
    [],
  );

  // Grades and semesters configuration
  const grades = useMemo(() => ["10", "11", "12"], []);
  const semesters = useMemo(
    () => [t("ninthForm.semester1"), t("ninthForm.semester2")],
    [t],
  );

  // Generate grade info for each accordion
  const gradeInfoList = useMemo((): GradeInfo[] => {
    const list: GradeInfo[] = [];
    grades.forEach((grade) => {
      [0, 1].forEach((semesterIndex) => {
        list.push({
          key: `${grade}-${String(semesterIndex + 1)}`,
          grade,
          semester: semesters[semesterIndex],
        });
      });
    });
    return list;
  }, [grades, semesters]);

  /**
   * FIXED: Process OCR data with proper position mapping
   * This ensures null scores stay in their correct grade/semester
   */
  const processOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        // STEP 1: Map results to their correct positions (DO NOT FILTER!)
        const gradeSemesterMap = mapOcrResultsToGradeSemesters(ocrResults);

        // STEP 2: Initialize empty structures for all grades
        const newScores: GradeScores = {
          "10-1": {},
          "10-2": {},
          "11-1": {},
          "11-2": {},
          "12-1": {},
          "12-2": {},
        };

        const newSelectedSubjects: Record<string, (string | null)[]> = {
          "10-1": [null, null, null, null],
          "10-2": [null, null, null, null],
          "11-1": [null, null, null, null],
          "11-2": [null, null, null, null],
          "12-1": [null, null, null, null],
          "12-2": [null, null, null, null],
        };

        const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];
        let processedCount = 0;

        // STEP 3: Process each grade/semester from the mapped positions
        gradeKeys.forEach((gradeKey) => {
          const result = gradeSemesterMap[gradeKey];

          // Handle missing result
          if (!result) {
            console.log(`${gradeKey}: ⚠️  No result object`);
            return;
          }

          // Handle null/empty scores
          if (!result.scores || result.scores.length === 0) {
            console.log(`${gradeKey}: ⚠️  NULL or empty scores`);
            return;
          }

          processedCount++;
          newScores[gradeKey] = {};
          const optionalSubjectsForGrade: (string | null)[] = [];

          result.scores.forEach((scoreItem) => {
            const subjectNameVietnamese = scoreItem.name;
            const scoreValue = scoreItem.score.toString();
            const subjectTranslationKey = getNationalExamSubjectTranslationKey(
              subjectNameVietnamese,
            );

            if (isValidSubjectKey(subjectTranslationKey)) {
              const isFixedSubject = fixedSubjects.includes(
                subjectTranslationKey,
              );
              const isOptionalSubject = optionalSubjects.includes(
                subjectTranslationKey,
              );

              if (isFixedSubject) {
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
              } else if (isOptionalSubject) {
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
              } else {
                // Valid key but not in our lists
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
              }
            } else {
              // Unknown subject - still store it
              console.warn(
                `  ⚠️  Unknown subject: "${subjectNameVietnamese}" -> "${subjectTranslationKey}"`,
              );
              newScores[gradeKey][subjectTranslationKey] = scoreValue;
              optionalSubjectsForGrade.push(subjectTranslationKey);
            }
          });

          // Ensure exactly 4 slots for optional subjects
          while (optionalSubjectsForGrade.length < 4) {
            optionalSubjectsForGrade.push(null);
          }

          newSelectedSubjects[gradeKey] = optionalSubjectsForGrade;
        });

        // STEP 4: Load into context
        loadOcrData(newScores, newSelectedSubjects);
        setShowAlert(true);

        // Show warning if partial results
        if (processedCount < 6 && processedCount > 0) {
          setRetryAlert({
            show: true,
            type: "warning",
            message: t("ninthForm.partialResults", {
              processed: processedCount,
              total: 6,
            }),
          });
        }
      } catch (error) {
        console.error("[NinthForm] ✗ Error loading OCR data:", error);
        setRetryAlert({
          show: true,
          type: "error",
          message: t("ninthForm.ocrLoadError"),
        });
      }
    },
    [fixedSubjects, optionalSubjects, loadOcrData, t],
  );

  // Load OCR data on component mount if available
  useEffect(() => {
    if (
      navigationState?.ocrProcessed &&
      navigationState.ocrResults &&
      !hasOcrData
    ) {
      processOcrData(navigationState.ocrResults);
    }
  }, [
    navigationState?.ocrProcessed,
    navigationState?.ocrResults,
    hasOcrData,
    processOcrData,
  ]);

  // Show alert when OCR data is loaded
  useEffect(() => {
    if (hasOcrData) {
      setShowAlert(true);
    }
  }, [hasOcrData]);

  // Handlers
  const handleScoreChange = useCallback(
    (gradeKey: string, subject: string, value: string) => {
      // Validate score format (0-10 with optional decimal)
      const isValidScore = /^\d{0,2}(\.\d{0,2})?$/.test(value);
      const numValue = parseFloat(value);

      if (
        value === "" ||
        (isValidScore && (isNaN(numValue) || (numValue >= 0 && numValue <= 10)))
      ) {
        updateScore(gradeKey, subject, value);
      }
    },
    [updateScore],
  );

  const handleSubjectSelect = useCallback(
    (gradeKey: string, index: number, newSubject: string | null) => {
      const oldSubject = selectedSubjects[gradeKey][index];

      // If changing subject, remove old subject's score
      if (oldSubject && oldSubject !== newSubject) {
        removeSubjectScore(gradeKey, oldSubject);
      }

      updateSelectedSubject(gradeKey, index, newSubject);
    },
    [selectedSubjects, removeSubjectScore, updateSelectedSubject],
  );

  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleCloseRetryAlert = useCallback(() => {
    setRetryAlert((prev) => ({ ...prev, show: false }));
  }, []);

  // Utility functions
  const getSubjectLabel = useCallback(
    (subjectKey: string) => {
      return t(subjectKey);
    },
    [t],
  );

  const isScoreHighlighted = useCallback(
    (gradeKey: string, subjectKey: string) => {
      return hasOcrData && Boolean(scores[gradeKey][subjectKey]);
    },
    [hasOcrData, scores],
  );

  const isSubjectHighlighted = useCallback(
    (_gradeKey: string, subjectKey: string | null) => {
      return hasOcrData && Boolean(subjectKey);
    },
    [hasOcrData],
  );

  // Validation
  const validateGradeScores = useCallback(
    (gradeKey: string): boolean => {
      // Check if all fixed subjects have scores
      for (const subjectKey of fixedSubjects) {
        if (!scores[gradeKey][subjectKey]) {
          return false;
        }
      }

      // Check if selected optional subjects have scores
      for (const subjectKey of selectedSubjects[gradeKey]) {
        if (subjectKey && !scores[gradeKey][subjectKey]) {
          return false;
        }
      }

      return true;
    },
    [fixedSubjects, scores, selectedSubjects],
  );

  const validateAllScores = useCallback((): boolean => {
    const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];
    return gradeKeys.every((gradeKey) => validateGradeScores(gradeKey));
  }, [validateGradeScores]);

  // Get completion status
  const getCompletionStatus = useCallback(() => {
    const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];
    const completed = gradeKeys.filter(validateGradeScores);
    return {
      completedCount: completed.length,
      totalCount: gradeKeys.length,
      completedGrades: completed,
      incompleteGrades: gradeKeys.filter((key) => !completed.includes(key)),
    };
  }, [validateGradeScores]);

  return {
    // State
    showAlert,
    retryAlert,
    scores,
    selectedSubjects,
    hasOcrData,

    // Configuration
    fixedSubjects,
    optionalSubjects,
    grades,
    semesters,
    gradeInfoList,

    // Handlers
    handleScoreChange,
    handleSubjectSelect,
    handleCloseAlert,
    handleCloseRetryAlert,

    // Utilities
    getSubjectLabel,
    isScoreHighlighted,
    isSubjectHighlighted,

    // Validation
    validateGradeScores,
    validateAllScores,
    getCompletionStatus,

    // Translations
    translations: {
      grade: t("ninthForm.grade"),
      semester1: t("ninthForm.semester1"),
      semester2: t("ninthForm.semester2"),
      score: t("ninthForm.score"),
      chooseSubject: t("ninthForm.chooseSubject"),
      scoreBoardDataLoaded: t("ninthForm.scoreBoardDataLoaded"),
    },
  };
};
