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

  // Log final mapping
  console.log("\n[Mapping] Final Grade/Semester Map:");
  gradeKeys.forEach((key) => {
    const result = gradeMap[key];
    const status = !result
      ? "No data"
      : !result.scores || result.scores.length === 0
        ? "NULL scores"
        : `${String(result.scores.length)} subjects`;
    console.log(`  ${key}: ${status}`);
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
   * FIXED: Process OCR data with proper position mapping
   * This ensures null scores stay in their correct grade/semester
   */
  const processOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        console.log("\n" + "=".repeat(60));
        console.log("[NinthForm] Starting OCR data processing");
        console.log("=".repeat(60));
        console.log(`Total OCR results: ${String(ocrResults.length)}`);

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

        console.log("\n[NinthForm] Processing each grade/semester:");
        console.log("-".repeat(60));

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

          // Process valid scores
          console.log(
            `${gradeKey}: ✓ Processing ${String(result.scores.length)} subjects`,
          );
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

        console.log("-".repeat(60));
        console.log(
          `\n[NinthForm] ✓ Successfully processed ${String(processedCount)}/6 semesters\n`,
        );

        // STEP 4: Log final summary
        console.log("Final Summary:");
        gradeKeys.forEach((key) => {
          const scoreCount = Object.keys(newScores[key]).length;
          const status =
            scoreCount > 0 ? `✓ ${String(scoreCount)} subjects` : "✗ Empty";
          console.log(`  ${key}: ${status}`);
        });
        console.log("=".repeat(60) + "\n");

        // STEP 5: Load into context
        loadOcrData(newScores, newSelectedSubjects);
        setShowAlert(true);
        console.log("[NinthForm] ✓ OCR data loaded successfully into context");
      } catch (error) {
        console.error("[NinthForm] ✗ Error loading OCR data:", error);
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
      console.log("\n[NinthForm] OCR data detected in navigation state");
      console.log(
        `[NinthForm] Results count: ${String(navigationState.ocrResults.length)}`,
      );
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
