import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CCNNType, CCQTType } from "../../type/enum/exam";
import { NationalExcellentStudentExamSubject } from "../../type/enum/national-excellent-exam";
import { Rank } from "../../type/enum/ranks";
import { useFormData } from "../../contexts/FormData/useFormData";
import {
  validateExamScore,
  formatScoreOnBlur,
  getScorePlaceholder,
  getScoreRange,
} from "../../config/achievement-score-config";

interface FieldOption {
  key: string;
  label: string;
}

interface Entry {
  id: string;
  firstField: string;
  secondField: string;
}

interface Category {
  id: string;
  name: string;
  categoryType: string;
  firstFieldLabel: string;
  secondFieldLabel: string;
  entries: Entry[];
  isExpanded: boolean;
}

// Maximum entries configuration for all categories
const MAX_ENTRIES_PER_CATEGORY = Number(
  import.meta.env.VITE_MAX_ENTRIES_PER_CATEGORY,
);

export const useFourthForm = () => {
  const { t } = useTranslation();
  const { formData, updateFourthForm } = useFormData();

  const ccqtOptions = useMemo(() => [...Object.values(CCQTType)], []);
  const ccnnOptions = useMemo(() => [...Object.values(CCNNType)], []);
  const hsgOptions = useMemo(
    () => Object.values(NationalExcellentStudentExamSubject),
    [],
  );
  const rankOptions = useMemo(() => Object.values(Rank), []);

  // Convert translation keys to display options
  const getTranslatedOptions = useCallback(
    (options: string[]): FieldOption[] => {
      return options.map((translationKey) => ({
        key: translationKey,
        label: t(translationKey),
      }));
    },
    [t],
  );

  // Get selected value as option object
  const getSelectedValue = (
    translationKey: string | null,
  ): FieldOption | null => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Options for each category
  const categoryOptions = useMemo(
    () => ({
      national_award: {
        subjects: getTranslatedOptions(hsgOptions),
        awards: getTranslatedOptions(rankOptions),
      },
      international_cert: {
        certificates: getTranslatedOptions(ccqtOptions),
      },
      language_cert: {
        certificates: getTranslatedOptions(ccnnOptions),
      },
    }),
    [hsgOptions, rankOptions, ccqtOptions, ccnnOptions, getTranslatedOptions],
  );

  // Update category names and labels when language changes
  useEffect(() => {
    const translatedCategories = [
      t("fourthForm.cat1"),
      t("fourthForm.cat2"),
      t("fourthForm.cat3"),
    ];

    const needsUpdate = formData.fourthForm.categories.some(
      (category, index) => {
        const expectedName = translatedCategories[index];
        const expectedFirstLabel =
          index === 0
            ? t("fourthForm.firstField")
            : index === 1
              ? t("fourthForm.secondField")
              : t("fourthForm.thirdField");
        const expectedSecondLabel =
          index === 0 ? t("fourthForm.rank") : t("fourthForm.score");

        return (
          category.name !== expectedName ||
          category.firstFieldLabel !== expectedFirstLabel ||
          category.secondFieldLabel !== expectedSecondLabel
        );
      },
    );

    if (needsUpdate) {
      const updatedCategories = formData.fourthForm.categories.map(
        (category, index) => ({
          ...category,
          name: translatedCategories[index],
          firstFieldLabel:
            index === 0
              ? t("fourthForm.firstField")
              : index === 1
                ? t("fourthForm.secondField")
                : t("fourthForm.thirdField"),
          secondFieldLabel:
            index === 0 ? t("fourthForm.rank") : t("fourthForm.score"),
        }),
      );

      updateFourthForm({ categories: updatedCategories });
    }
  }, [t, updateFourthForm, formData.fourthForm.categories]);

  // Generate unique ID for new entries
  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  // Check if can add more entries to a category
  const canAddEntry = (categoryId: string): boolean => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return false;

    return category.entries.length < MAX_ENTRIES_PER_CATEGORY;
  };

  // Get remaining slots for a category
  const getRemainingSlots = (categoryId: string): number => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return 0;

    return Math.max(0, MAX_ENTRIES_PER_CATEGORY - category.entries.length);
  };

  // Get button text with remaining slots information
  const getAddButtonText = (categoryId: string): string => {
    const remainingSlots = getRemainingSlots(categoryId);

    if (remainingSlots === 0) {
      return t("fourthForm.maxEntriesReached", {
        max: MAX_ENTRIES_PER_CATEGORY,
      });
    }

    return (
      t("buttons.add") +
      ` (${String(remainingSlots)}/${String(MAX_ENTRIES_PER_CATEGORY)})`
    );
  };

  // Add a new entry to a category
  const handleAddEntry = (categoryId: string) => {
    // Check if we can add more entries
    if (!canAddEntry(categoryId)) {
      console.warn(
        `Maximum entries reached for category ${categoryId}: ${String(MAX_ENTRIES_PER_CATEGORY)}`,
      );
      return;
    }

    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: [
              ...category.entries,
              {
                id: generateId(),
                firstField: "",
                secondField: "",
              },
            ],
            isExpanded: true,
          }
        : category,
    );

    updateFourthForm({ categories: updatedCategories });
  };

  // Remove an entry from a category
  const handleRemoveEntry = (categoryId: string, entryId: string) => {
    const updatedCategories = formData.fourthForm.categories.map((category) => {
      if (category.id === categoryId) {
        const newEntries = category.entries.filter(
          (entry) => entry.id !== entryId,
        );
        return {
          ...category,
          entries: newEntries,
          isExpanded: newEntries.length > 0,
        };
      }
      return category;
    });

    updateFourthForm({ categories: updatedCategories });
  };

  // Validate and handle score change based on exam type
  const handleScoreChange = (
    value: string,
    examType: string | null,
  ): string => {
    return validateExamScore(value, examType);
  };

  // Format score when user leaves the input field
  const handleScoreBlur = (value: string, examType: string | null): string => {
    return formatScoreOnBlur(value, examType);
  };

  // Update a field in an entry
  const handleEntryChange = (
    categoryId: string,
    entryId: string,
    field: "firstField" | "secondField",
    value: string,
  ) => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    const entry = category?.entries.find((e) => e.id === entryId);

    let validatedValue = value;

    // If updating the score field (secondField) for exam types with validation
    if (field === "secondField" && entry) {
      const examType = entry.firstField || null;

      // Only validate if it's a text input field (language_cert or international_cert)
      if (
        category?.categoryType === "language_cert" ||
        category?.categoryType === "international_cert"
      ) {
        validatedValue = handleScoreChange(value, examType);
      }
    }

    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: category.entries.map((entry) =>
              entry.id === entryId
                ? { ...entry, [field]: validatedValue }
                : entry,
            ),
          }
        : category,
    );

    updateFourthForm({ categories: updatedCategories });
  };

  // Handle score blur event (format on blur)
  const handleEntryScoreBlur = (categoryId: string, entryId: string) => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    const entry = category?.entries.find((e) => e.id === entryId);

    if (!entry?.secondField) return;

    const examType = entry.firstField || null;

    // Only format if it's a text input field
    if (
      category?.categoryType === "language_cert" ||
      category?.categoryType === "international_cert"
    ) {
      const formattedScore = handleScoreBlur(entry.secondField, examType);

      if (formattedScore !== entry.secondField) {
        const updatedCategories = formData.fourthForm.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                entries: cat.entries.map((e) =>
                  e.id === entryId ? { ...e, secondField: formattedScore } : e,
                ),
              }
            : cat,
        );

        updateFourthForm({ categories: updatedCategories });
      }
    }
  };

  // Get placeholder text for score input based on exam type
  const getScoreInputPlaceholder = (
    examType: string | null,
    categoryType: string,
  ): string => {
    const defaultPlaceholder = t("fourthForm.scorePlaceholder");

    // Only show custom placeholder for exam types with validation
    if (
      categoryType === "language_cert" ||
      categoryType === "international_cert"
    ) {
      return getScorePlaceholder(examType, defaultPlaceholder);
    }

    return defaultPlaceholder;
  };

  // Get score range info for display
  const getScoreRangeInfo = (examType: string | null): string | null => {
    const scoreRange = getScoreRange(examType);
    if (!scoreRange) return null;

    const { min, max, step } = scoreRange;

    if (step) {
      return `${String(min)}-${String(max)} (${String(step)} ${t("fourthForm.increment")})`;
    }

    return `${String(min)}-${String(max)}`;
  };

  // Get first field options based on category type
  const getFirstFieldOptions = (categoryType: string): FieldOption[] => {
    switch (categoryType) {
      case "national_award":
        return categoryOptions.national_award.subjects;
      case "international_cert":
        return categoryOptions.international_cert.certificates;
      case "language_cert":
        return categoryOptions.language_cert.certificates;
      default:
        return [];
    }
  };

  // Get second field options based on category type
  const getSecondFieldOptions = (categoryType: string): FieldOption[] => {
    switch (categoryType) {
      case "national_award":
        return categoryOptions.national_award.awards;
      default:
        return [];
    }
  };

  // Check if second field should be text input (for language_cert and international_cert)
  const isSecondFieldTextInput = (categoryType: string): boolean => {
    return (
      categoryType === "language_cert" || categoryType === "international_cert"
    );
  };

  // Validation functions
  const getEntryErrors = (entry: Entry, categoryType: string): string[] => {
    const errors: string[] = [];

    // If first field (subject/certificate) is selected but second field is empty
    if (entry.firstField && !entry.secondField) {
      // Different error messages based on category type
      if (categoryType === "national_award") {
        errors.push(t("fourthForm.awardRequiredError"));
      } else {
        // For language_cert and international_cert
        errors.push(t("fourthForm.scoreRequiredError"));
      }
    }

    // Validate score range if applicable
    if (
      entry.firstField &&
      entry.secondField &&
      (categoryType === "language_cert" ||
        categoryType === "international_cert")
    ) {
      const scoreRange = getScoreRange(entry.firstField);
      if (scoreRange) {
        const score = parseFloat(entry.secondField);
        if (!isNaN(score)) {
          if (score < scoreRange.min || score > scoreRange.max) {
            errors.push(
              t("fourthForm.scoreOutOfRangeError", {
                min: scoreRange.min,
                max: scoreRange.max,
              }),
            );
          }
        }
      }
    }

    return errors;
  };

  const getCategoryErrors = (category: Category): string[] => {
    const errors: string[] = [];

    // Check if category has exceeded maximum entries (shouldn't happen with UI controls)
    if (category.entries.length > MAX_ENTRIES_PER_CATEGORY) {
      errors.push(
        t("fourthForm.maxEntriesError", { max: MAX_ENTRIES_PER_CATEGORY }),
      );
    }

    // Add individual entry errors
    category.entries.forEach((entry) => {
      errors.push(...getEntryErrors(entry, category.categoryType));
    });

    return errors;
  };

  const validateForm = (): { isValid: boolean; errors: string[] } => {
    const allErrors: string[] = [];

    formData.fourthForm.categories.forEach((category) => {
      allErrors.push(...getCategoryErrors(category));
    });

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  };

  return {
    // Data
    categories: formData.fourthForm.categories,

    // Handlers
    handleAddEntry,
    handleRemoveEntry,
    handleEntryChange,
    handleEntryScoreBlur,

    // Helper functions
    getFirstFieldOptions,
    getSecondFieldOptions,
    getSelectedValue,
    isSecondFieldTextInput,
    canAddEntry,
    getRemainingSlots,
    getAddButtonText,
    getScoreInputPlaceholder,
    getScoreRangeInfo,

    // Validation functions
    validateForm,
    getEntryErrors,
    getCategoryErrors,

    // Translation function
    t,

    // Constants
    maxEntries: MAX_ENTRIES_PER_CATEGORY,
  };
};
