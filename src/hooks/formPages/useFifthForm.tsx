import { useImperativeHandle } from "react";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../contexts/FormData/useFormData";

export interface FifthFormRef {
  validate: () => boolean;
}

interface UseFifthFormProps {
  ref?: React.Ref<FifthFormRef>;
}

export const useFifthForm = ({ ref }: UseFifthFormProps = {}) => {
  const { t } = useTranslation();
  const { formData, updateFifthForm } = useFormData();

  // Expose validate() to parent via ref
  useImperativeHandle(ref, () => ({
    validate: () => {
      // Add your validation logic here
      const { costRange } = formData.fifthForm;

      // Example validation rules:
      // - Check if range is valid
      // - Check if minimum is less than maximum
      // - Check if values are within allowed bounds
      if (costRange[0] >= costRange[1]) {
        return false;
      }

      if (costRange[0] < 1 || costRange[1] > 900) {
        return false;
      }

      return true;
    },
  }));

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    updateFifthForm({ costRange: newValue as number[] });
  };

  const formatValue = (value: number) => {
    return `${String(value)} ${t("fifthForm.millionVND")}`;
  };

  const formatRangeText = (range: number[]) => {
    return `${String(range[0])} - ${String(range[1])} ${t("fifthForm.millionVND/year")}`;
  };

  // Extract data from formData
  const { costRange } = formData.fifthForm;

  // Configuration values
  const sliderConfig = {
    min: 1,
    max: 900,
    defaultValue: [1, 900] as number[],
  };

  return {
    // State
    costRange,

    // Handlers
    handleSliderChange,

    // Formatters
    formatValue,
    formatRangeText,

    // Configuration
    sliderConfig,

    // Translations
    subTitle: t("fifthForm.subTitle1"),
  };
};
