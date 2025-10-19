import { useTranslation } from "react-i18next";
import {
  getOptionalCategorySubjects,
  getCategoryTranslationKey,
} from "../../type/enum/combineUtil";

interface OptionalScore {
  id: string;
  subject: string;
  subjectOther?: string;
  score: string;
}

interface CategoryData {
  id: string;
  name: string;
  scores: OptionalScore[];
  isExpanded: boolean;
}

interface SubjectOption {
  key: string;
  label: string;
}

interface UseThirdOptionalFormProps {
  categories: CategoryData[];
  setCategories: (categories: CategoryData[]) => void;
}

// Score limits configuration
const SCORE_LIMITS = {
  DGNL: {
    maxEntries: 3,
    subjects: {
      "examTypes.hsa": { min: 0, max: 150 },
      "examTypes.tsa": { min: 0, max: 100 },
      "examTypes.vnuhcm": { min: 0, max: 1200 },
    },
  },
  VSAT: {
    min: 0,
    max: 150,
    minRequiredEntries: 3,
  },
  TALENT: {
    min: 0,
    max: 10,
  },
} as const;

export const useThirdOptionalForm = ({
  categories,
  setCategories,
}: UseThirdOptionalFormProps) => {
  const { t } = useTranslation();

  // Get score limits based on category and subject
  const getScoreLimits = (categoryName: string, subject?: string) => {
    switch (categoryName) {
      case "ĐGNL":
        if (
          subject &&
          // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
          SCORE_LIMITS.DGNL.subjects[
            subject as keyof typeof SCORE_LIMITS.DGNL.subjects
          ]
        ) {
          return SCORE_LIMITS.DGNL.subjects[
            subject as keyof typeof SCORE_LIMITS.DGNL.subjects
          ];
        }
        return { min: 0, max: 100 }; // Default for DGNL
      case "V-SAT":
        return { min: SCORE_LIMITS.VSAT.min, max: SCORE_LIMITS.VSAT.max };
      case "Năng khiếu":
        return { min: SCORE_LIMITS.TALENT.min, max: SCORE_LIMITS.TALENT.max };
      default:
        return { min: 0, max: 100 };
    }
  };

  // Validate score value against limits
  const validateScoreValue = (
    categoryName: string,
    subject: string,
    scoreValue: string,
  ): string | null => {
    if (!scoreValue) return null; // Empty is valid

    const numericScore = parseFloat(scoreValue);
    if (isNaN(numericScore)) {
      return t("thirdForm.invalidNumber");
    }

    const limits = getScoreLimits(categoryName, subject);

    if (numericScore < limits.min) {
      return t("thirdForm.scoreTooLow", { min: limits.min });
    }

    if (numericScore > limits.max) {
      return t("thirdForm.scoreTooHigh", { max: limits.max });
    }

    return null; // Valid
  };

  // Check if a specific score row has validation errors
  const getScoreRowErrors = (
    categoryName: string,
    score: OptionalScore,
  ): string[] => {
    const errors: string[] = [];

    // If subject is selected but score is empty
    if (score.subject && !score.score) {
      errors.push(t("thirdForm.errorWarning"));
    }

    // Validate score value against limits
    if (score.subject && score.score) {
      const scoreError = validateScoreValue(
        categoryName,
        score.subject,
        score.score,
      );
      if (scoreError) {
        errors.push(scoreError);
      }
    }

    return errors;
  };

  // Check if a category has validation errors
  const getCategoryErrors = (category: CategoryData): string[] => {
    const errors: string[] = [];

    // ĐGNL specific validation - max 3 entries
    if (category.name === "ĐGNL") {
      const filledScores = category.scores.filter(
        (score) => score.subject && score.score,
      );

      if (filledScores.length > SCORE_LIMITS.DGNL.maxEntries) {
        errors.push(
          t("thirdForm.dgnlMaxEntriesError", {
            max: SCORE_LIMITS.DGNL.maxEntries,
          }),
        );
      }
    }

    // V-SAT specific validation - minimum 3 entries if started
    if (category.name === "V-SAT") {
      const filledScores = category.scores.filter(
        (score) => score.subject && score.score,
      );

      // If user has started filling V-SAT but has less than 3 complete entries
      if (
        filledScores.length > 0 &&
        filledScores.length < SCORE_LIMITS.VSAT.minRequiredEntries
      ) {
        errors.push(t("thirdForm.vsatMinimumError"));
      }
    }

    return errors;
  };

  // Validate all categories and return validation status
  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const allErrors: string[] = [];

    categories.forEach((category) => {
      // Add category-level errors
      allErrors.push(...getCategoryErrors(category));

      // Add score row errors
      category.scores.forEach((score) => {
        allErrors.push(...getScoreRowErrors(category.name, score));
      });
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  };

  // Generate unique ID for new scores
  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  // Validate and sanitize score input with category-specific limits
  const handleScoreValidation = (
    value: string,
    categoryName: string,
    subject: string,
  ): string => {
    // Allow empty string
    if (value === "") return "";

    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) return value.slice(0, -1);

    // Check if the value exceeds the maximum allowed
    const numericValue = parseFloat(value);
    if (!isNaN(numericValue)) {
      const limits = getScoreLimits(categoryName, subject);

      // Prevent typing values that exceed the maximum
      if (numericValue > limits.max) {
        return limits.max.toString();
      }
    }

    return value;
  };

  // Check if can add more scores to a category
  const canAddScore = (categoryName: string): boolean => {
    if (categoryName === "ĐGNL") {
      const category = categories.find((cat) => cat.name === categoryName);
      if (category) {
        const filledScores = category.scores.filter(
          (score) => score.subject && score.score,
        );
        return filledScores.length < SCORE_LIMITS.DGNL.maxEntries;
      }
    }
    return true; // No restriction for other categories
  };

  // Add a new score row to a category
  const handleAddScore = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // Check if we can add more scores for ĐGNL category
    if (!canAddScore(category.name)) {
      // Optionally, you can show an alert or notification here
      console.warn(
        t("thirdForm.dgnlMaxEntriesReached", {
          max: SCORE_LIMITS.DGNL.maxEntries,
        }),
      );
      return;
    }

    const updated = categories.map((cat) => {
      if (cat.id === categoryId) {
        return {
          ...cat,
          scores: [
            ...cat.scores,
            { id: generateId(), subject: "", subjectOther: "", score: "" },
          ],
          isExpanded: true,
        };
      }
      return cat;
    });
    setCategories(updated);
  };

  // Remove a score row from a category
  const handleRemoveScore = (categoryId: string, scoreId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        const newScores = category.scores.filter(
          (score) => score.id !== scoreId,
        );
        return {
          ...category,
          scores: newScores,
          isExpanded: newScores.length > 0,
        };
      }
      return category;
    });
    setCategories(updated);
  };

  // Update a specific field in a score
  const handleScoreChange = (
    categoryId: string,
    scoreId: string,
    field: "subject" | "subjectOther" | "score",
    value: string,
  ) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          scores: category.scores.map((score) => {
            if (score.id === scoreId) {
              return { ...score, [field]: value };
            }
            return score;
          }),
        };
      }
      return category;
    });
    setCategories(updated);
  };

  // Handle subject change with validation
  const handleSubjectChange = (
    categoryId: string,
    scoreId: string,
    translationKey: string,
  ) => {
    handleScoreChange(categoryId, scoreId, "subject", translationKey);
  };

  // Handle score value change with validation
  const handleScoreValueChange = (
    categoryId: string,
    scoreId: string,
    value: string,
  ) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const score = category.scores.find((s) => s.id === scoreId);
    if (!score) return;

    const validatedValue = handleScoreValidation(
      value,
      category.name,
      score.subject,
    );
    handleScoreChange(categoryId, scoreId, "score", validatedValue);
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

  // Get available subjects for a specific category and exclude already selected ones
  const getAvailableSubjects = (
    categoryName: string,
    currentScoreId: string,
  ): string[] => {
    const category = categories.find((cat) => cat.name === categoryName);
    const allSubjects = getOptionalCategorySubjects(categoryName);

    if (!category) return allSubjects;

    // Filter out subjects that are already selected in this category
    const selectedSubjects = category.scores
      .filter((score) => score.id !== currentScoreId && score.subject)
      .map((score) => score.subject);

    return allSubjects.filter((subject) => !selectedSubjects.includes(subject));
  };

  // Get translated category name
  const getTranslatedCategoryName = (categoryName: string): string => {
    const translationKey = getCategoryTranslationKey(categoryName);
    return t(translationKey);
  };

  // Get score row data for rendering
  const getScoreRowData = (categoryName: string, score: OptionalScore) => {
    const availableSubjects = getAvailableSubjects(categoryName, score.id);
    const translatedSubjectOptions =
      getTranslatedSubjectOptions(availableSubjects);
    const selectedSubjectValue = getSelectedSubjectValue(score.subject || null);

    return {
      translatedSubjectOptions,
      selectedSubjectValue,
    };
  };

  // Get display text for score limits
  const getScoreLimitText = (
    categoryName: string,
    subject?: string,
  ): string => {
    const limits = getScoreLimits(categoryName, subject);
    return t("thirdForm.scoreLimitHint", { min: limits.min, max: limits.max });
  };

  return {
    // Data
    categories,

    // Handlers
    handleAddScore,
    handleRemoveScore,
    handleSubjectChange,
    handleScoreValueChange,

    // Helper functions
    getTranslatedCategoryName,
    getScoreRowData,
    getScoreLimitText,
    canAddScore,

    // Validation functions
    validateForm,
    getCategoryErrors,
    getScoreRowErrors,
    validateScoreValue,

    // Score limits
    getScoreLimits,

    // Translation function
    t,
  };
};
