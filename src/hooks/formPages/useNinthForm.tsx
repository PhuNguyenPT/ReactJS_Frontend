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
import { useOcrManager } from "../userProfile/useOcrManager";
import useAuth from "../auth/useAuth";

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
  const { isAuthenticated } = useAuth();

  const { saveOrUpdateGrade, getOperationType } = useOcrManager();

  const navigationState = location.state as
    | NinthFormNavigationState
    | undefined;

  const [showAlert, setShowAlert] = useState(false);
  const [retryAlert, setRetryAlert] = useState<RetryAlertState>({
    show: false,
    type: "info",
    message: "",
  });

  const [isGradeUpdating, setIsGradeUpdating] = useState<
    Record<string, boolean>
  >({
    "10-1": false,
    "10-2": false,
    "11-1": false,
    "11-2": false,
    "12-1": false,
    "12-2": false,
  });

  const [gradeUpdateStatus, setGradeUpdateStatus] = useState<
    Record<string, "idle" | "success" | "error">
  >({
    "10-1": "idle",
    "10-2": "idle",
    "11-1": "idle",
    "11-2": "idle",
    "12-1": "idle",
    "12-2": "idle",
  });

  const {
    scores,
    selectedSubjects,
    hasOcrData,
    updateScore,
    updateSelectedSubject,
    removeSubjectScore,
    loadOcrData,
    clearAllData,
  } = useNinthForm();

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

  const optionalSubjects = useMemo(
    () =>
      [
        ScoreBoardSubjects.DIA_LY,
        ScoreBoardSubjects.GDKTPL,
        ScoreBoardSubjects.VAT_LY,
        ScoreBoardSubjects.HOA_HOC,
        ScoreBoardSubjects.SINH_HOC,
        ScoreBoardSubjects.CONG_NGHE,
        ScoreBoardSubjects.TIN_HOC,
      ] as ScordBoardSubjectTranslationKey[],
    [],
  );

  const grades = useMemo(() => ["10", "11", "12"], []);
  const semesters = useMemo(
    () => [t("ninthForm.semester1"), t("ninthForm.semester2")],
    [t],
  );

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

  // ✅ SIMPLIFIED: Only clear if there's existing data AND no new OCR data coming
  useEffect(() => {
    const hasNavigatedWithOcr = Boolean(
      navigationState?.ocrProcessed && navigationState.ocrResults,
    );

    // Only clear if we have old data but no new OCR data is coming
    if (hasOcrData && !hasNavigatedWithOcr) {
      console.log("[NinthForm] Detected stale data without new OCR - clearing");
      clearAllData();
    }
  }, [clearAllData, hasOcrData, navigationState]);

  const processOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        const gradeSemesterMap = mapOcrResultsToGradeSemesters(ocrResults);

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

        const ocrIdMapping: Record<string, string> = {};

        const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];
        let processedCount = 0;

        gradeKeys.forEach((gradeKey) => {
          const result = gradeSemesterMap[gradeKey];

          if (!result) {
            console.log(`${gradeKey}: ⚠️  No result object`);
            return;
          }

          // Check if subjectScores array is empty
          if (result.subjectScores.length === 0) {
            console.log(`${gradeKey}: ⚠️  Empty subjectScores`);
            return;
          }

          if (result.id) {
            ocrIdMapping[gradeKey] = result.id;
          }

          processedCount++;
          newScores[gradeKey] = {};
          const optionalSubjectsForGrade: (string | null)[] = [];

          result.subjectScores.forEach((scoreItem) => {
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
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
              }
            } else {
              console.warn(
                `  ⚠️  Unknown subject: "${subjectNameVietnamese}" -> "${subjectTranslationKey}"`,
              );
              newScores[gradeKey][subjectTranslationKey] = scoreValue;
              optionalSubjectsForGrade.push(subjectTranslationKey);
            }
          });

          while (optionalSubjectsForGrade.length < 4) {
            optionalSubjectsForGrade.push(null);
          }

          newSelectedSubjects[gradeKey] = optionalSubjectsForGrade;
        });

        loadOcrData(newScores, newSelectedSubjects, ocrIdMapping);
        setShowAlert(true);

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
      const isValidScore = /^\d{0,2}(\.\d{0,2})?$/.test(value);
      const numValue = parseFloat(value);

      if (
        value === "" ||
        (isValidScore && (isNaN(numValue) || (numValue >= 0 && numValue <= 10)))
      ) {
        updateScore(gradeKey, subject, value);
        setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "idle" }));
      }
    },
    [updateScore],
  );

  const handleSubjectSelect = useCallback(
    (gradeKey: string, index: number, newSubject: string | null) => {
      const oldSubject = selectedSubjects[gradeKey][index];

      if (oldSubject && oldSubject !== newSubject) {
        removeSubjectScore(gradeKey, oldSubject);
      }

      updateSelectedSubject(gradeKey, index, newSubject);
      setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "idle" }));
    },
    [selectedSubjects, removeSubjectScore, updateSelectedSubject],
  );

  const handleSaveOrUpdateGrade = useCallback(
    async (gradeKey: string) => {
      const operationType = getOperationType(gradeKey);

      setIsGradeUpdating((prev) => ({ ...prev, [gradeKey]: true }));
      setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "idle" }));

      try {
        const result = await saveOrUpdateGrade(gradeKey, isAuthenticated);

        if (result.success) {
          setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "success" }));

          setTimeout(() => {
            setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "idle" }));
          }, 3000);
        } else {
          console.error(
            `[NinthForm] Failed to ${operationType === "create" ? "create" : "update"} ${gradeKey}:`,
            result.message,
          );
          setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "error" }));
        }
      } catch (error) {
        console.error(
          `[NinthForm] Error ${operationType === "create" ? "creating" : "updating"} ${gradeKey}:`,
          error,
        );
        setGradeUpdateStatus((prev) => ({ ...prev, [gradeKey]: "error" }));
      } finally {
        setIsGradeUpdating((prev) => ({ ...prev, [gradeKey]: false }));
      }
    },
    [saveOrUpdateGrade, isAuthenticated, getOperationType],
  );

  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const handleCloseRetryAlert = useCallback(() => {
    setRetryAlert((prev) => ({ ...prev, show: false }));
  }, []);

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

  const getAvailableSubjects = useCallback(
    (
      gradeKey: string,
      currentIndex: number,
    ): ScordBoardSubjectTranslationKey[] => {
      const currentlySelected = selectedSubjects[gradeKey];
      const currentSubject = currentlySelected[currentIndex];

      return optionalSubjects.filter((subject) => {
        if (subject === currentSubject) return true;
        return !currentlySelected.includes(subject);
      });
    },
    [optionalSubjects, selectedSubjects],
  );

  const getButtonText = useCallback(
    (gradeKey: string) => {
      const operationType = getOperationType(gradeKey);

      if (operationType === "create") {
        return t("ninthForm.saveScoreBoard");
      } else if (operationType === "update") {
        return t("ninthForm.updateGrade");
      } else {
        return t("ninthForm.updateGrade");
      }
    },
    [getOperationType, t],
  );

  const validateGradeScores = useCallback(
    (gradeKey: string): boolean => {
      for (const subjectKey of fixedSubjects) {
        if (!scores[gradeKey][subjectKey]) {
          return false;
        }
      }

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
    showAlert,
    retryAlert,
    scores,
    selectedSubjects,
    hasOcrData,
    isGradeUpdating,
    gradeUpdateStatus,
    fixedSubjects,
    optionalSubjects,
    grades,
    semesters,
    gradeInfoList,
    handleScoreChange,
    handleSubjectSelect,
    handleSaveOrUpdateGrade,
    handleCloseAlert,
    handleCloseRetryAlert,
    getSubjectLabel,
    isScoreHighlighted,
    isSubjectHighlighted,
    getAvailableSubjects,
    getButtonText,
    getOperationType,
    validateGradeScores,
    validateAllScores,
    getCompletionStatus,
    translations: {
      grade: t("ninthForm.grade"),
      semester1: t("ninthForm.semester1"),
      semester2: t("ninthForm.semester2"),
      score: t("ninthForm.score"),
      chooseSubject: t("ninthForm.chooseSubject"),
      scoreBoardDataLoaded: t("ninthForm.scoreBoardDataLoaded"),
      updateGrade: t("ninthForm.updateGrade"),
      saveScoreBoard: t("ninthForm.saveScoreBoard"),
      updating: t("ninthForm.updating"),
      updateSuccess: t("ninthForm.updateSuccess"),
      updateError: t("ninthForm.updateError"),
    },
  };
};
