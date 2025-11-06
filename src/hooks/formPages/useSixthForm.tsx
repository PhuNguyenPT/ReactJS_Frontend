import { useTranslation } from "react-i18next";
import { SpecialStudentCase } from "../../type/enum/special-student-case";
import { useFormData } from "../../contexts/FormData/useFormData";

export interface SixthFormOption {
  key: string;
  value: (typeof SpecialStudentCase)[keyof typeof SpecialStudentCase];
  label: string;
}

export const useSixthForm = () => {
  const { t } = useTranslation();
  const { formData, updateSixthForm } = useFormData();

  // Get current checked values from context (these are translation keys)
  const checkedValues = formData.sixthForm.specialStudentCases;

  // Handler for toggling checkbox values
  const handleToggle = (translationKey: string) => {
    const newCheckedValues = checkedValues.includes(translationKey)
      ? checkedValues.filter((v) => v !== translationKey)
      : [...checkedValues, translationKey];

    updateSixthForm({ specialStudentCases: newCheckedValues });
  };

  // Check if a specific value is checked
  const isChecked = (value: string): boolean => {
    return checkedValues.includes(value);
  };

  // Define the options using the SpecialStudentCase enum with translation keys
  const specialStudentOptions: SixthFormOption[] = [
    {
      key: "HEROES_AND_CONTRIBUTORS",
      value: SpecialStudentCase.HEROES_AND_CONTRIBUTORS,
      label: t(SpecialStudentCase.HEROES_AND_CONTRIBUTORS),
    },
    {
      key: "TRANSFER_STUDENT",
      value: SpecialStudentCase.TRANSFER_STUDENT,
      label: t(SpecialStudentCase.TRANSFER_STUDENT),
    },
    {
      key: "ETHNIC_MINORITY_STUDENT",
      value: SpecialStudentCase.ETHNIC_MINORITY_STUDENT,
      label: t(SpecialStudentCase.ETHNIC_MINORITY_STUDENT),
    },
    {
      key: "VERY_FEW_ETHNIC_MINORITY",
      value: SpecialStudentCase.VERY_FEW_ETHNIC_MINORITY,
      label: t(SpecialStudentCase.VERY_FEW_ETHNIC_MINORITY),
    },
  ];

  // Get selected options with full details
  const getSelectedOptions = (): SixthFormOption[] => {
    return specialStudentOptions.filter((opt) =>
      checkedValues.includes(opt.value),
    );
  };

  // Clear all selections
  const clearSelections = () => {
    updateSixthForm({ specialStudentCases: [] });
  };

  // Select all options
  const selectAll = () => {
    const allValues = specialStudentOptions.map((opt) => opt.value);
    updateSixthForm({ specialStudentCases: allValues });
  };

  return {
    // State
    checkedValues,
    specialStudentOptions,

    // Handlers
    handleToggle,
    clearSelections,
    selectAll,

    // Utilities
    isChecked,
    getSelectedOptions,
  };
};
