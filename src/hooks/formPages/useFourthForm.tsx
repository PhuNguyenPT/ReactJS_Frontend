import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CCNNType, CCQTType } from "../../type/enum/exam";
import { NationalExcellentStudentExamSubject } from "../../type/enum/national-excellent-exam";
import { Rank } from "../../type/enum/ranks";
import { ALevelGrade } from "../../type/enum/A-Level-grade";
import { JPLTLevel } from "../../type/enum/JLPT-Level";
import { useFormData } from "../../contexts/FormData/useFormData";
import {
  validateExamScore,
  formatScoreOnBlur,
  getScorePlaceholder,
  getScoreRange,
  usesGradeDropdown,
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

// Maximum entries configuration - now separate for each category
const MAX_NATIONAL_AWARD_ENTRIES = Number(
  import.meta.env.VITE_MAX_NATIONAL_AWARD_ENTRIES,
);
const MAX_INTERNATIONAL_CERT_ENTRIES = Number(
  import.meta.env.VITE_MAX_INTERNATIONAL_CERT_ENTRIES,
);
const MAX_LANGUAGE_CERT_ENTRIES = Number(
  import.meta.env.VITE_MAX_LANGUAGE_CERT_ENTRIES,
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
  const alevelGradeOptions = useMemo(() => Object.values(ALevelGrade), []);
  const jlptLevelOptions = useMemo(() => Object.values(JPLTLevel), []);

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
    useRawValue = false,
  ): FieldOption | null => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: useRawValue ? translationKey : t(translationKey),
    };
  };

  // Get A-Level grade options (no translation needed, use raw values)
  const getALevelGradeOptions = (): FieldOption[] => {
    return alevelGradeOptions.map((grade) => ({
      key: grade,
      label: grade,
    }));
  };

  // Get JLPT level options (no translation needed, use raw values)
  const getJLPTLevelOptions = (): FieldOption[] => {
    return jlptLevelOptions.map((level) => ({
      key: level,
      label: level,
    }));
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

  // Get max entries for a specific category type
  const getMaxEntriesForCategory = (categoryType: string): number => {
    switch (categoryType) {
      case "national_award":
        return MAX_NATIONAL_AWARD_ENTRIES;
      case "international_cert":
        return MAX_INTERNATIONAL_CERT_ENTRIES;
      case "language_cert":
        return MAX_LANGUAGE_CERT_ENTRIES;
      default:
        return 0;
    }
  };

  // Check if can add more entries to a category
  const canAddEntry = (categoryId: string): boolean => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return false;

    const maxEntries = getMaxEntriesForCategory(category.categoryType);
    return category.entries.length < maxEntries;
  };

  // Get remaining slots for a category
  const getRemainingSlots = (categoryId: string): number => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return 0;

    const maxEntries = getMaxEntriesForCategory(category.categoryType);
    return Math.max(0, maxEntries - category.entries.length);
  };

  // Get button text with remaining slots information
  const getAddButtonText = (categoryId: string): string => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return t("buttons.add");

    const remainingSlots = getRemainingSlots(categoryId);
    const maxEntries = getMaxEntriesForCategory(category.categoryType);

    if (remainingSlots === 0) {
      return t("fourthForm.maxEntriesReached", {
        max: maxEntries,
      });
    }

    return (
      t("buttons.add") + ` (${String(remainingSlots)}/${String(maxEntries)})`
    );
  };

  // Add a new entry to a category
  const handleAddEntry = (categoryId: string) => {
    // Check if we can add more entries
    if (!canAddEntry(categoryId)) {
      const category = formData.fourthForm.categories.find(
        (cat) => cat.id === categoryId,
      );
      const maxEntries = getMaxEntriesForCategory(category?.categoryType ?? "");

      console.warn(
        `Maximum entries reached for category ${categoryId}: ${String(maxEntries)}`,
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

    // If updating the first field (exam type)
    if (field === "firstField" && entry) {
      const oldExamType = entry.firstField;
      const newExamType = value;

      // CASE 1: If clearing the first field (selecting empty), always clear the second field
      if (!newExamType && entry.secondField) {
        const updatedCategories = formData.fourthForm.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                entries: cat.entries.map((e) =>
                  e.id === entryId
                    ? { ...e, firstField: "", secondField: "" }
                    : e,
                ),
              }
            : cat,
        );
        updateFourthForm({ categories: updatedCategories });
        return;
      }

      // CASE 2: If switching between different field types (dropdown vs text input), clear the second field
      const wasGradeDropdown = usesGradeDropdown(oldExamType || null);
      const isNowGradeDropdown = usesGradeDropdown(newExamType || null);

      if (wasGradeDropdown !== isNowGradeDropdown && entry.secondField) {
        const updatedCategories = formData.fourthForm.categories.map((cat) =>
          cat.id === categoryId
            ? {
                ...cat,
                entries: cat.entries.map((e) =>
                  e.id === entryId
                    ? { ...e, firstField: value, secondField: "" }
                    : e,
                ),
              }
            : cat,
        );
        updateFourthForm({ categories: updatedCategories });
        return;
      }
    }

    // If updating the score field (secondField) for exam types with validation
    if (field === "secondField" && entry) {
      const examType = entry.firstField || null;

      // Only validate if it's a text input field (not ALevel grade dropdown or JLPT level dropdown)
      if (
        !usesGradeDropdown(examType) &&
        (category?.categoryType === "language_cert" ||
          category?.categoryType === "international_cert")
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

    // Don't format if it's ALevel (uses dropdown)
    if (usesGradeDropdown(examType)) return;

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

  // Get already selected options for a category (to filter them out)
  const getSelectedOptionsInCategory = (categoryId: string): string[] => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.id === categoryId,
    );
    if (!category) return [];

    return category.entries
      .map((entry) => entry.firstField)
      .filter((field) => field !== "");
  };

  // Get first field options based on category type, filtering out already selected options
  const getFirstFieldOptions = (categoryType: string): FieldOption[] => {
    const category = formData.fourthForm.categories.find(
      (cat) => cat.categoryType === categoryType,
    );
    if (!category) return [];

    const selectedOptions = getSelectedOptionsInCategory(category.id);
    let allOptions: FieldOption[] = [];

    switch (categoryType) {
      case "national_award":
        allOptions = categoryOptions.national_award.subjects;
        break;
      case "international_cert":
        allOptions = categoryOptions.international_cert.certificates;
        break;
      case "language_cert":
        allOptions = categoryOptions.language_cert.certificates;
        break;
      default:
        return [];
    }

    // Filter out already selected options
    return allOptions.filter((option) => !selectedOptions.includes(option.key));
  };

  // Get second field options based on category type and exam type
  const getSecondFieldOptions = (
    categoryType: string,
    examType: string | null,
  ): FieldOption[] => {
    switch (categoryType) {
      case "national_award":
        return categoryOptions.national_award.awards;
      case "international_cert":
        // If ALevel is selected, return grade options
        if (usesGradeDropdown(examType)) {
          return getALevelGradeOptions();
        }
        return [];
      case "language_cert":
        // If JLPT is selected, return level options
        if (usesGradeDropdown(examType)) {
          return getJLPTLevelOptions();
        }
        return [];
      default:
        return [];
    }
  };

  // Check if second field should be a dropdown (for national_award, ALevel, or JLPT)
  const isSecondFieldDropdown = (
    categoryType: string,
    examType: string | null,
  ): boolean => {
    if (categoryType === "national_award") {
      return true;
    }
    if (
      categoryType === "international_cert" ||
      categoryType === "language_cert"
    ) {
      return usesGradeDropdown(examType);
    }
    return false;
  };

  // Check if second field should be text input (for non-JLPT language_cert and non-ALevel international_cert)
  const isSecondFieldTextInput = (
    categoryType: string,
    examType: string | null,
  ): boolean => {
    if (categoryType === "language_cert") {
      return !usesGradeDropdown(examType);
    }
    if (categoryType === "international_cert") {
      return !usesGradeDropdown(examType);
    }
    return false;
  };

  // Validation functions
  const getEntryErrors = (entry: Entry, categoryType: string): string[] => {
    const errors: string[] = [];

    // CASE 1: First field is selected but second field is empty
    if (entry.firstField && !entry.secondField) {
      // Different error messages based on category type
      if (categoryType === "national_award") {
        errors.push(t("fourthForm.awardRequiredError"));
      } else {
        // For language_cert and international_cert
        errors.push(t("fourthForm.scoreRequiredError"));
      }
    }

    // CASE 2: Second field is filled but first field is empty (shouldn't happen with UI controls, but adding for safety)
    if (!entry.firstField && entry.secondField) {
      if (categoryType === "national_award") {
        errors.push(
          t("fourthForm.subjectRequiredError") || "Subject is required",
        );
      } else if (categoryType === "international_cert") {
        errors.push(
          t("fourthForm.certificateRequiredError") || "Certificate is required",
        );
      } else if (categoryType === "language_cert") {
        errors.push(
          t("fourthForm.certificateRequiredError") || "Certificate is required",
        );
      }
    }

    // Validate score range if applicable (only for numeric scores, not grades)
    if (
      entry.firstField &&
      entry.secondField &&
      !usesGradeDropdown(entry.firstField) &&
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

    // Check if category has exceeded maximum entries
    const maxEntries = getMaxEntriesForCategory(category.categoryType);
    if (category.entries.length > maxEntries) {
      errors.push(t("fourthForm.maxEntriesError", { max: maxEntries }));
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
    isSecondFieldDropdown,
    isSecondFieldTextInput,
    canAddEntry,
    getRemainingSlots,
    getAddButtonText,
    getScoreInputPlaceholder,
    getScoreRangeInfo,
    getSelectedOptionsInCategory,

    // Validation functions
    validateForm,
    getEntryErrors,
    getCategoryErrors,

    // Translation function
    t,

    // Constants
    maxNationalAwardEntries: MAX_NATIONAL_AWARD_ENTRIES,
    maxInternationalCertEntries: MAX_INTERNATIONAL_CERT_ENTRIES,
    maxLanguageCertEntries: MAX_LANGUAGE_CERT_ENTRIES,
  };
};
