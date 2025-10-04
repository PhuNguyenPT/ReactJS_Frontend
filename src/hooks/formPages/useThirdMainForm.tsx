import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  NationalExamSubjects,
  getSelectableSubjects,
} from "../../type/enum/national-exam-subject";

interface SubjectOption {
  key: string;
  label: string;
}

interface UseThirdMainFormProps {
  mathScore: string;
  setMathScore: (value: string) => void;
  literatureScore: string;
  setLiteratureScore: (value: string) => void;
  chosenSubjects: (string | null)[];
  setChosenSubjects: (value: (string | null)[]) => void;
  chosenScores: string[];
  setChosenScores: (value: string[]) => void;
  hasError: boolean;
  setHasError: (value: boolean) => void;
}

export const useThirdMainForm = ({
  mathScore,
  setMathScore,
  literatureScore,
  setLiteratureScore,
  chosenSubjects,
  setChosenSubjects,
  chosenScores,
  setChosenScores,
  hasError,
  setHasError,
}: UseThirdMainFormProps) => {
  const { t } = useTranslation();

  // Get selectable subjects (excluding mandatory TOAN and VAN)
  const selectableSubjects = useMemo(() => getSelectableSubjects(), []);

  // Validate and sanitize score input
  const handleScoreChange = (value: string): string => {
    // Allow empty string
    if (value === "") return "";

    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) return value.slice(0, -1);

    // Convert to number and validate range
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    // If greater than 10, return "10"
    if (numValue > 10) return "10";

    // If less than 0, return "0"
    if (numValue < 0) return "0";

    return value;
  };

  // Handle math score change
  const handleMathScoreChange = (value: string) => {
    const validatedValue = handleScoreChange(value);
    setMathScore(validatedValue);
    setHasError(false);
  };

  // Handle literature score change
  const handleLiteratureScoreChange = (value: string) => {
    const validatedValue = handleScoreChange(value);
    setLiteratureScore(validatedValue);
    setHasError(false);
  };

  // Handle chosen subject change
  const handleChosenSubjectChange = (
    index: number,
    translationKey: string | null,
  ) => {
    const updated = [...chosenSubjects];
    updated[index] = translationKey;
    setChosenSubjects(updated);
    setHasError(false);
  };

  // Handle chosen subject score change
  const handleChosenScoreChange = (index: number, value: string) => {
    const validatedValue = handleScoreChange(value);
    const updated = [...chosenScores];
    updated[index] = validatedValue;
    setChosenScores(updated);
    setHasError(false);
  };

  // Convert translation keys to display options for subjects
  const getTranslatedSubjectOptions = (
    availableOptions: string[],
  ): SubjectOption[] => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected subject value as an option object
  const getSelectedSubjectValue = (
    translationKey: string | null,
  ): SubjectOption | null => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Filter available subjects to exclude already selected ones
  const getAvailableSubjects = (currentIndex: number): string[] => {
    return selectableSubjects.filter((subject) => {
      return !chosenSubjects.some(
        (selected, index) => index !== currentIndex && selected === subject,
      );
    });
  };

  // Check if math field should show error
  const shouldShowMathError = (): boolean => {
    return hasError && mathScore === "";
  };

  // Check if literature field should show error
  const shouldShowLiteratureError = (): boolean => {
    return hasError && literatureScore === "";
  };

  // Check if chosen subject field should show error
  const shouldShowChosenSubjectError = (index: number): boolean => {
    return hasError && !chosenSubjects[index];
  };

  // Check if chosen score field should show error
  const shouldShowChosenScoreError = (index: number): boolean => {
    return hasError && chosenScores[index] === "";
  };

  // Check if chosen row should show error helper text
  const shouldShowChosenRowError = (index: number): boolean => {
    return hasError && (!chosenSubjects[index] || chosenScores[index] === "");
  };

  // Get dropdown data for optional subjects
  const getOptionalSubjectData = (index: number) => {
    const availableSubjects = getAvailableSubjects(index);
    const translatedSubjectOptions =
      getTranslatedSubjectOptions(availableSubjects);
    const selectedSubjectValue = getSelectedSubjectValue(chosenSubjects[index]);

    return {
      translatedSubjectOptions,
      selectedSubjectValue,
      showSubjectError: shouldShowChosenSubjectError(index),
      showScoreError: shouldShowChosenScoreError(index),
      showRowError: shouldShowChosenRowError(index),
    };
  };

  return {
    // Data
    mathScore,
    literatureScore,
    chosenSubjects,
    chosenScores,

    // Handlers
    handleMathScoreChange,
    handleLiteratureScoreChange,
    handleChosenSubjectChange,
    handleChosenScoreChange,

    // Helper functions
    getOptionalSubjectData,
    shouldShowMathError,
    shouldShowLiteratureError,

    // Constants
    mandatorySubjects: {
      math: t(NationalExamSubjects.TOAN),
      literature: t(NationalExamSubjects.NGU_VAN),
    },

    // Translation function
    t,
  };
};
