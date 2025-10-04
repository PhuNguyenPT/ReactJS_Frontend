import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { getAllMajorGroups } from "../../type/enum/major";
import { useFormData } from "../../contexts/FormData/useFormData";

interface MajorOption {
  key: string;
  label: string;
}

interface UseSecondFormProps {
  hasError: boolean;
}

export const useSecondForm = ({ hasError }: UseSecondFormProps) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormData();

  const selectedMajors = formData.secondForm;
  const allMajors = useMemo(() => getAllMajorGroups(), []);

  // Get available options for a specific dropdown (excluding already selected)
  const getAvailableOptions = (currentIndex: number): string[] => {
    const otherSelected = selectedMajors
      .filter((_, i) => i !== currentIndex)
      .filter((v): v is string => v !== null);

    return allMajors.filter((major) => !otherSelected.includes(major));
  };

  // Convert translation keys to display options with translated labels
  const getTranslatedOptions = (availableOptions: string[]): MajorOption[] => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected value as an option object
  const getSelectedValue = (
    translationKey: string | null,
  ): MajorOption | null => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Handle major selection change
  const handleMajorChange = (index: number, value: string | null) => {
    const updated = [...selectedMajors];
    updated[index] = value;
    updateFormData({ secondForm: updated });
  };

  // Check if a specific field should show error
  const shouldShowError = (index: number): boolean => {
    return hasError && index === 0 && !selectedMajors[0];
  };

  // Get dropdown data for a specific index
  const getDropdownData = (index: number) => {
    const availableOptions = getAvailableOptions(index);
    const translatedOptions = getTranslatedOptions(availableOptions);
    const selectedValue = getSelectedValue(selectedMajors[index]);

    return {
      translatedOptions,
      selectedValue,
      showError: shouldShowError(index),
    };
  };

  return {
    // Data
    selectedMajors,

    // Functions
    handleMajorChange,
    getDropdownData,

    // Translation function
    t,
  };
};
