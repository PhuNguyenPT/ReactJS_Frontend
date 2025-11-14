import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  NationalExamSubjects,
  getSelectableSubjects,
  isTechnologySubject,
  getOtherTechnologySubject,
} from "../../type/enum/national-exam-subject";
import {
  validateNationalExamScore,
  formatNationalExamScoreOnBlur,
  getNationalExamScorePlaceholder,
  getNationalExamScoreRangeInfo,
} from "../../config/national-exam-score-config";

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

  // Validate and sanitize score input using config
  const handleScoreChange = (value: string): string => {
    return validateNationalExamScore(value);
  };

  // Format score on blur using config
  const handleScoreBlur = (value: string): string => {
    return formatNationalExamScoreOnBlur(value);
  };

  // Handle math score change
  const handleMathScoreChange = (value: string) => {
    const validatedValue = handleScoreChange(value);
    setMathScore(validatedValue);
    setHasError(false);
  };

  // Handle math score blur
  const handleMathScoreBlur = () => {
    const formattedValue = handleScoreBlur(mathScore);
    if (formattedValue !== mathScore) {
      setMathScore(formattedValue);
    }
  };

  // Handle literature score change
  const handleLiteratureScoreChange = (value: string) => {
    const validatedValue = handleScoreChange(value);
    setLiteratureScore(validatedValue);
    setHasError(false);
  };

  // Handle literature score blur
  const handleLiteratureScoreBlur = () => {
    const formattedValue = handleScoreBlur(literatureScore);
    if (formattedValue !== literatureScore) {
      setLiteratureScore(formattedValue);
    }
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

  // Handle chosen subject score blur
  const handleChosenScoreBlur = (index: number) => {
    const formattedValue = handleScoreBlur(chosenScores[index]);
    if (formattedValue !== chosenScores[index]) {
      const updated = [...chosenScores];
      updated[index] = formattedValue;
      setChosenScores(updated);
    }
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
  // AND exclude the other technology subject if one is already selected
  const getAvailableSubjects = (currentIndex: number): string[] => {
    // Get the other slot's selected subject
    const otherIndex = currentIndex === 0 ? 1 : 0;
    const otherSelectedSubject = chosenSubjects[otherIndex];

    return selectableSubjects.filter((subject) => {
      // Exclude if already selected in the other slot
      const isSelectedInOtherSlot = otherSelectedSubject === subject;
      if (isSelectedInOtherSlot) return false;

      // If the other slot has a technology subject selected,
      // exclude the other technology subject from this slot's options
      if (otherSelectedSubject && isTechnologySubject(otherSelectedSubject)) {
        const otherTechSubject =
          getOtherTechnologySubject(otherSelectedSubject);
        if (subject === otherTechSubject) {
          return false;
        }
      }

      return true;
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

  // Get placeholder text for score input
  const getScorePlaceholder = (): string => {
    return getNationalExamScorePlaceholder();
  };

  // Get score range info for display
  const getScoreRangeInfo = (): string => {
    return getNationalExamScoreRangeInfo();
  };

  return {
    // Data
    mathScore,
    literatureScore,
    chosenSubjects,
    chosenScores,

    // Handlers
    handleMathScoreChange,
    handleMathScoreBlur,
    handleLiteratureScoreChange,
    handleLiteratureScoreBlur,
    handleChosenSubjectChange,
    handleChosenScoreChange,
    handleChosenScoreBlur,

    // Helper functions
    getOptionalSubjectData,
    shouldShowMathError,
    shouldShowLiteratureError,
    getScorePlaceholder,
    getScoreRangeInfo,

    // Constants
    mandatorySubjects: {
      math: t(NationalExamSubjects.TOAN),
      literature: t(NationalExamSubjects.NGU_VAN),
    },

    // Translation function
    t,
  };
};
