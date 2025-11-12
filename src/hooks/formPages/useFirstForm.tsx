import { useState, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { VietnamSouthernProvinces } from "../../type/enum/vietnamese.provinces";
import { getAllUniTypes } from "../../type/enum/uni-type";
import { useFormData } from "../../contexts/FormData/useFormData";

interface UniTypeOption {
  key: string;
  label: string;
}

export const useFirstForm = () => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormData();

  // Province state - initialize from formData
  const [selectedProvinces, setSelectedProvinces] = useState<string | null>(
    formData.firstForm ?? null,
  );

  // University type state - initialize from formData
  const [selectedUniType, setSelectedUniType] = useState<string | null>(
    formData.uniType ?? null,
  );

  // Convert enums to array of values
  const provinces = useMemo(() => Object.values(VietnamSouthernProvinces), []);
  const uniTypes = useMemo(() => getAllUniTypes(), []);

  // Convert translation keys to display options for university types
  const translatedUniTypeOptions = useMemo(
    () =>
      uniTypes.map((translationKey) => ({
        key: translationKey,
        label: t(translationKey),
      })),
    [uniTypes, t],
  );

  // Get the selected university type value as an option object
  const selectedUniTypeValue = useMemo(() => {
    if (!selectedUniType) return null;
    return {
      key: selectedUniType,
      label: t(selectedUniType),
    };
  }, [selectedUniType, t]);

  // Handle province change
  const handleProvinceChange = (newValue: string | null) => {
    setSelectedProvinces(newValue);
    updateFormData({ firstForm: newValue });
  };

  // Handle university type change
  const handleUniTypeChange = (newValue: UniTypeOption | null) => {
    const translationKey = newValue?.key ?? null;
    setSelectedUniType(translationKey);
    updateFormData({ uniType: translationKey });
  };

  return {
    // State
    selectedProvinces,
    selectedUniType,

    // Data
    provinces,
    translatedUniTypeOptions,
    selectedUniTypeValue,

    // Handlers
    handleProvinceChange,
    handleUniTypeChange,

    // Translation function
    t,
  };
};
