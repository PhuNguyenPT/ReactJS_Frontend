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
      if (costRange[0] >= costRange[1]) {
        return false;
      }

      if (
        costRange[0] < Number(import.meta.env.VITE_SLIDER_MIN) ||
        costRange[1] > Number(import.meta.env.VITE_SLIDER_MAX)
      ) {
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
    min: Number(import.meta.env.VITE_SLIDER_MIN),
    max: Number(import.meta.env.VITE_SLIDER_MAX),
    defaultValue: [
      Number(import.meta.env.VITE_SLIDER_MIN),
      Number(import.meta.env.VITE_SLIDER_MAX),
    ] as number[],
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
  };
};
