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

export const useThirdOptionalForm = ({
  categories,
  setCategories,
}: UseThirdOptionalFormProps) => {
  const { t } = useTranslation();

  // Check if a specific score row has validation errors
  const getScoreRowErrors = (
    _categoryName: string,
    score: OptionalScore,
  ): string[] => {
    const errors: string[] = [];

    // If subject is selected but score is empty
    if (score.subject && !score.score) {
      errors.push(t("thirdForm.errorWarning"));
    }

    return errors;
  };

  // Check if a category has validation errors
  const getCategoryErrors = (category: CategoryData): string[] => {
    const errors: string[] = [];

    // V-SAT specific validation
    if (category.name === "V-SAT") {
      const filledScores = category.scores.filter(
        (score) => score.subject && score.score,
      );

      // If user has started filling V-SAT but has less than 3 complete entries
      if (filledScores.length > 0 && filledScores.length < 3) {
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

  // Validate and sanitize score input
  const handleScoreValidation = (value: string): string => {
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

  // Add a new score row to a category
  const handleAddScore = (categoryId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          scores: [
            ...category.scores,
            { id: generateId(), subject: "", subjectOther: "", score: "" },
          ],
          isExpanded: true,
        };
      }
      return category;
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
    const validatedValue = handleScoreValidation(value);
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

    // Validation functions
    validateForm,
    getCategoryErrors,
    getScoreRowErrors,

    // Translation function
    t,
  };
};
