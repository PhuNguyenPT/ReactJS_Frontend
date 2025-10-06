import { useEffect, useMemo, useCallback } from "react";
import { useTranslation } from "react-i18next";
import { CCNNType, CCQTType } from "../../type/enum/exam";
import { NationalExcellentStudentExamSubject } from "../../type/enum/national-excellent-exam";
import { Rank } from "../../type/enum/ranks";
import { useFormData } from "../../contexts/FormData/useFormData";

interface FieldOption {
  key: string;
  label: string;
}

interface Entry {
  id: string;
  firstField: string;
  firstFieldOther?: string;
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
          index === 2 ? t("fourthForm.score") : t("fourthForm.award");

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
            index === 2 ? t("fourthForm.score") : t("fourthForm.award"),
        }),
      );

      updateFourthForm({ categories: updatedCategories });
    }
  }, [t, updateFourthForm, formData.fourthForm.categories]);

  // Generate unique ID for new entries
  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  // Add a new entry to a category
  const handleAddEntry = (categoryId: string) => {
    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: [
              ...category.entries,
              {
                id: generateId(),
                firstField: "",
                firstFieldOther: "",
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

  // Update a field in an entry
  const handleEntryChange = (
    categoryId: string,
    entryId: string,
    field: "firstField" | "firstFieldOther" | "secondField",
    value: string,
  ) => {
    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: category.entries.map((entry) =>
              entry.id === entryId ? { ...entry, [field]: value } : entry,
            ),
          }
        : category,
    );

    updateFourthForm({ categories: updatedCategories });
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

    return errors;
  };

  const getCategoryErrors = (category: Category): string[] => {
    const errors: string[] = [];

    category.entries.forEach((entry) => {
      errors.push(...getEntryErrors(entry, category.categoryType)); // Added categoryType
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

    // Helper functions
    getFirstFieldOptions,
    getSecondFieldOptions,
    getSelectedValue,
    isSecondFieldTextInput,

    // Validation functions
    validateForm,
    getEntryErrors,

    // Translation function
    t,
  };
};
