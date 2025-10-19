import { useTranslation } from "react-i18next";
import { AcademicPerformance } from "../../type/enum/academic-performance";
import { Conduct } from "../../type/enum/conduct";
import { useFormData } from "../../contexts/FormData/useFormData";
import type { GradeKey } from "../../contexts/FormData/FormDataContext";

export interface TranslatedOption {
  key: string;
  label: string;
}

export interface GradeOption {
  key: GradeKey;
  label: string;
}

export interface ValidationState {
  conduct: boolean;
  academicPerformance: boolean;
}

interface UseSeventhFormProps {
  shouldValidate?: boolean;
}

export const useSeventhForm = ({
  shouldValidate = false,
}: UseSeventhFormProps = {}) => {
  const { t } = useTranslation();
  const { formData, updateSeventhFormGrade } = useFormData();

  // Get form values
  const values = formData.seventhForm.grades;

  // Define options
  const conductOptions = Object.values(Conduct);
  const academicPerformanceOptions = Object.values(AcademicPerformance);

  // Convert translation keys to display options
  const getTranslatedOptions = (options: string[]): TranslatedOption[] => {
    return options.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get selected value as option object
  const getSelectedValue = (
    translationKey: string | null,
  ): TranslatedOption | null => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Prepare translated options
  const translatedConductOptions = getTranslatedOptions(conductOptions);
  const translatedAcademicPerformanceOptions = getTranslatedOptions(
    academicPerformanceOptions,
  );

  // Define grades
  const grades: GradeOption[] = [
    { key: "10" as GradeKey, label: t("seventhForm.subTitle10") },
    { key: "11" as GradeKey, label: t("seventhForm.subTitle11") },
    { key: "12" as GradeKey, label: t("seventhForm.subTitle12") },
  ];

  // Handle conduct change
  const handleConductChange = (
    gradeKey: GradeKey,
    newValue: TranslatedOption | null,
  ) => {
    const translationKey = newValue?.key ?? "";
    updateSeventhFormGrade(gradeKey, "conduct", translationKey);
  };

  // Handle academic performance change
  const handleAcademicPerformanceChange = (
    gradeKey: GradeKey,
    newValue: TranslatedOption | null,
  ) => {
    const translationKey = newValue?.key ?? "";
    updateSeventhFormGrade(gradeKey, "academicPerformance", translationKey);
  };

  // Get validation state for a specific grade
  const getValidationState = (gradeKey: GradeKey): ValidationState => {
    return {
      conduct: shouldValidate && values[gradeKey].conduct === "",
      academicPerformance:
        shouldValidate && values[gradeKey].academicPerformance === "",
    };
  };

  // Get selected values for a specific grade
  const getGradeValues = (gradeKey: GradeKey) => {
    return {
      conduct: getSelectedValue(values[gradeKey].conduct || null),
      academicPerformance: getSelectedValue(
        values[gradeKey].academicPerformance || null,
      ),
    };
  };

  // Validate all grades
  const validate = (): boolean => {
    for (const grade of grades) {
      const gradeData = values[grade.key];
      if (!gradeData.conduct || !gradeData.academicPerformance) {
        return false;
      }
    }
    return true;
  };

  // Check if a specific grade is complete
  const isGradeComplete = (gradeKey: GradeKey): boolean => {
    const gradeData = values[gradeKey];
    return !!(gradeData.conduct && gradeData.academicPerformance);
  };

  // Get all incomplete grades
  const getIncompleteGrades = (): GradeKey[] => {
    return grades.map((g) => g.key).filter((key) => !isGradeComplete(key));
  };

  // Clear a specific grade's data
  const clearGrade = (gradeKey: GradeKey) => {
    updateSeventhFormGrade(gradeKey, "conduct", "");
    updateSeventhFormGrade(gradeKey, "academicPerformance", "");
  };

  // Clear all grades
  const clearAllGrades = () => {
    grades.forEach((grade) => {
      clearGrade(grade.key);
    });
  };

  return {
    // Data
    grades,
    translatedConductOptions,
    translatedAcademicPerformanceOptions,
    values,

    // Handlers
    handleConductChange,
    handleAcademicPerformanceChange,
    clearGrade,
    clearAllGrades,

    // Utilities
    getValidationState,
    getGradeValues,
    validate,
    isGradeComplete,
    getIncompleteGrades,

    // Translations
    placeholders: {
      practiceResults: t("seventhForm.practiceResults"),
      academicScore: t("seventhForm.academicScore"),
    },
    errors: {
      conductError: t("seventhForm.errorWarning2"),
      performanceError: t("seventhForm.errorWarning1"),
    },
  };
};
