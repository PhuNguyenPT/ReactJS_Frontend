import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type { NinthFormNavigationState } from "../../type/interface/navigationTypes";
import type { OcrResultItem } from "../../type/interface/ocrTypes";
import {
  NationalExamSubjects,
  getNationalExamSubjectTranslationKey,
  isValidSubjectKey,
  type NationalExamSubjectTranslationKey,
} from "../../type/enum/national-exam-subject";
import { useNinthForm } from "../../contexts/ScoreBoardData/useScoreBoardContext";

export type SubjectScores = Record<string, string>;
export type GradeScores = Record<string, SubjectScores>;

export interface GradeInfo {
  key: string;
  grade: string;
  semester: string;
}

export const useNinthFormLogic = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const navigationState = location.state as
    | NinthFormNavigationState
    | undefined;

  const [showAlert, setShowAlert] = useState(false);

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
        NationalExamSubjects.TOAN,
        NationalExamSubjects.NGU_VAN,
        NationalExamSubjects.TIENG_ANH,
        NationalExamSubjects.LICH_SU,
      ] as NationalExamSubjectTranslationKey[],
    [],
  );

  // Optional subjects using translation keys
  const optionalSubjects = useMemo(
    () =>
      [
        NationalExamSubjects.DIA_LY,
        NationalExamSubjects.GDKT_PL,
        NationalExamSubjects.VAT_LY,
        NationalExamSubjects.HOA_HOC,
        NationalExamSubjects.SINH_HOC,
        NationalExamSubjects.CONG_NGHE,
        NationalExamSubjects.TIN_HOC,
      ] as NationalExamSubjectTranslationKey[],
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
   * Process OCR data and load into context
   */
  const processOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        // Filter out results without scores
        const validResults = ocrResults.filter(
          (result) => result.scores && result.scores.length > 0,
        );

        if (validResults.length === 0) {
          console.log("[NinthForm] No valid OCR data to load");
          return;
        }

        console.log(
          `[NinthForm] Loading ${String(validResults.length)} OCR results`,
        );

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

        validResults.forEach((result, index) => {
          if (index >= gradeKeys.length) {
            console.warn(
              `[NinthForm] Extra OCR result at index ${String(index)} - only 6 semesters supported`,
            );
            return;
          }

          const gradeKey = gradeKeys[index];
          console.log(
            `[NinthForm] Processing ${gradeKey} (index ${String(index)}):`,
            String(result.scores?.length),
            "subjects",
          );

          if (!result.scores) {
            console.warn(`[NinthForm] No scores for ${gradeKey}`);
            return;
          }

          newScores[gradeKey] = {};
          const optionalSubjectsForGrade: (string | null)[] = [];

          result.scores.forEach((scoreItem) => {
            const subjectNameVietnamese = scoreItem.name;
            const scoreValue = scoreItem.score.toString();
            const subjectTranslationKey = getNationalExamSubjectTranslationKey(
              subjectNameVietnamese,
            );

            console.log(
              `[NinthForm] ${gradeKey} - Processing: "${subjectNameVietnamese}" -> "${subjectTranslationKey}" = ${scoreValue}`,
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
                console.log(
                  `[NinthForm] Fixed subject stored: ${subjectTranslationKey} = ${scoreValue}`,
                );
              } else if (isOptionalSubject) {
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
                console.log(
                  `[NinthForm] Optional subject stored: ${subjectTranslationKey} = ${scoreValue}`,
                );
              } else {
                console.warn(
                  `[NinthForm] Valid subject key but not in lists: ${subjectTranslationKey}`,
                );
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
              }
            } else {
              console.warn(
                `[NinthForm] Unknown subject from OCR: "${subjectNameVietnamese}" (key: "${subjectTranslationKey}")`,
              );
              newScores[gradeKey][subjectTranslationKey] = scoreValue;
              optionalSubjectsForGrade.push(subjectTranslationKey);
            }
          });

          while (optionalSubjectsForGrade.length < 4) {
            optionalSubjectsForGrade.push(null);
          }

          newSelectedSubjects[gradeKey] = optionalSubjectsForGrade;

          console.log(
            `[NinthForm] ${gradeKey} - Scores stored:`,
            newScores[gradeKey],
          );
          console.log(
            `[NinthForm] ${gradeKey} - Optional subjects:`,
            optionalSubjectsForGrade,
          );
        });

        const processedSemesters = Object.keys(newScores).filter(
          (key) => Object.keys(newScores[key]).length > 0,
        );
        console.log(
          `[NinthForm] Processed ${String(processedSemesters.length)}/6 semesters:`,
          processedSemesters,
        );

        if (processedSemesters.length < 6) {
          console.warn(
            `[NinthForm] Only ${String(processedSemesters.length)} out of 6 semesters have data`,
          );
        }

        loadOcrData(newScores, newSelectedSubjects);
        setShowAlert(true);
        console.log("[NinthForm] OCR data loaded successfully");
      } catch (error) {
        console.error("[NinthForm] Error loading OCR data:", error);
      }
    },
    [fixedSubjects, optionalSubjects, loadOcrData],
  );

  // Load OCR data on component mount if available
  useEffect(() => {
    if (
      navigationState?.ocrProcessed &&
      navigationState.ocrResults &&
      !hasOcrData
    ) {
      console.log("[NinthForm] Processing OCR data from navigation state...");
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
      // Validate score format (optional)
      const isValidScore = /^\d*\.?\d*$/.test(value);
      if (isValidScore || value === "") {
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
