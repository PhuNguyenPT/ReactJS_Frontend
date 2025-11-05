import { useTranslation } from "react-i18next";
import {
  getOptionalCategorySubjects,
  getCategoryTranslationKey,
} from "../../type/enum/combineUtil";
import {
  validateOptionalExamScore,
  formatOptionalExamScoreOnBlur,
  getScoreLimits,
  getMaxEntries,
  getMinRequiredEntries,
  canAddEntry,
  getRemainingSlots,
  validateCategoryEntryCount,
  validateOptionalExamScoreValue,
  getOptionalExamScorePlaceholder,
  getOptionalExamScoreRangeInfo,
} from "../../config/optional-exam-score-config";

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

export const useThirdOptionalForm = ({
  categories,
  setCategories,
}: UseThirdOptionalFormProps) => {
  const { t } = useTranslation();

  // Generate unique ID for new scores
  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  // Validate score value against limits
  const validateScoreValue = (
    categoryName: string,
    subject: string,
    scoreValue: string,
  ): string | null => {
    if (!scoreValue) return null;

    const error = validateOptionalExamScoreValue(
      categoryName,
      subject,
      scoreValue,
    );

    if (error) {
      // Translate error messages
      const limits = getScoreLimits(categoryName, subject);
      if (error.includes("at least")) {
        return t("thirdForm.scoreTooLow", { min: limits.min });
      }
      if (error.includes("exceed")) {
        return t("thirdForm.scoreTooHigh", { max: limits.max });
      }
      return t("thirdForm.invalidNumber");
    }

    return null;
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

    const filledScores = category.scores.filter(
      (score) => score.subject && score.score,
    );

    // Validate entry count using config
    const validation = validateCategoryEntryCount(
      category.name,
      filledScores.length,
    );

    if (!validation.isValid && validation.error) {
      // Translate the error message
      const maxEntries = getMaxEntries(category.name);
      const minEntries = getMinRequiredEntries(category.name);

      // Map category names to translation key suffixes
      const categoryKeyMap: Record<string, string> = {
        ĐGNL: "dgnl",
        "V-SAT": "vsat",
        "Năng khiếu": "talent",
      };

      const categoryKey =
        categoryKeyMap[category.name] ??
        category.name.toLowerCase().replace("-", "");

      if (validation.error.includes("at least")) {
        errors.push(
          t(`thirdForm.${categoryKey}MinimumError`, {
            min: minEntries,
          }),
        );
      } else if (validation.error.includes("Maximum")) {
        errors.push(
          t(`thirdForm.${categoryKey}MaxEntriesError`, {
            max: maxEntries,
          }),
        );
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

  // Validate and sanitize score input with category-specific limits and decimal places
  const handleScoreValidation = (
    value: string,
    categoryName: string,
    subject: string,
  ): string => {
    return validateOptionalExamScore(value, categoryName, subject);
  };

  // Format score on blur
  const handleScoreBlur = (
    value: string,
    categoryName: string,
    subject: string,
  ): string => {
    return formatOptionalExamScoreOnBlur(value, categoryName, subject);
  };

  // Check if can add more scores to a category
  const canAddScore = (categoryName: string): boolean => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (!category) return false;

    return canAddEntry(categoryName, category.scores.length);
  };

  // Get button text with remaining slots information
  const getAddButtonText = (categoryName: string): string => {
    const category = categories.find((cat) => cat.name === categoryName);
    if (!category) return t("buttons.add");

    const remainingSlots = getRemainingSlots(
      categoryName,
      category.scores.length,
    );
    const maxEntries = getMaxEntries(categoryName);

    if (maxEntries === Infinity) {
      return t("buttons.add");
    }

    if (remainingSlots === 0) {
      return t("thirdForm.maxEntriesReached", { max: maxEntries });
    }

    return (
      t("buttons.add") + ` (${String(remainingSlots)}/${String(maxEntries)})`
    );
  };

  // Add a new score row to a category
  const handleAddScore = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    // Check if we can add more scores using config
    if (!canAddScore(category.name)) {
      console.warn(
        `Maximum entries reached for ${category.name}: ${String(getMaxEntries(category.name))}`,
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

  // Handle score blur event
  const handleScoreValueBlur = (categoryId: string, scoreId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    const score = category.scores.find((s) => s.id === scoreId);
    if (!score?.score) return;

    const formattedValue = handleScoreBlur(
      score.score,
      category.name,
      score.subject,
    );

    if (formattedValue !== score.score) {
      handleScoreChange(categoryId, scoreId, "score", formattedValue);
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

  // Get placeholder text for score input
  const getScorePlaceholder = (
    categoryName: string,
    subject: string,
  ): string => {
    return getOptionalExamScorePlaceholder(categoryName, subject);
  };

  // Get score range info for display
  const getScoreRangeInfo = (categoryName: string, subject: string): string => {
    return getOptionalExamScoreRangeInfo(categoryName, subject);
  };

  return {
    // Data
    categories,

    // Handlers
    handleAddScore,
    handleRemoveScore,
    handleSubjectChange,
    handleScoreValueChange,
    handleScoreValueBlur,

    // Helper functions
    getTranslatedCategoryName,
    getScoreRowData,
    getScoreLimitText,
    canAddScore,
    getAddButtonText,
    getScorePlaceholder,
    getScoreRangeInfo,

    // Validation functions
    validateForm,
    getCategoryErrors,
    getScoreRowErrors,
    validateScoreValue,

    // Score limits (exposed for advanced use cases)
    getScoreLimits,
    getMaxEntries: (categoryName: string) => getMaxEntries(categoryName),

    // Translation function
    t,
  };
};
