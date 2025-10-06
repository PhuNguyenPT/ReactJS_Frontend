import { useState, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VietnamSouthernProvinces } from "../../type/enum/vietnamese.provinces";
import { getAllUniTypes } from "../../type/enum/uni-type";
import { useFormData } from "../../contexts/FormData/useFormData";

interface UniTypeOption {
  key: string;
  label: string;
}

export const useFirstForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormData();

  // Province state
  const [selectedProvinces, setSelectedProvinces] = useState<string | null>(
    formData.firstForm ?? null,
  );
  const [hasProvinceError, setHasProvinceError] = useState(false);

  // University type state
  const [selectedUniType, setSelectedUniType] = useState<string | null>(
    formData.uniType ?? null,
  );
  const [hasUniTypeError, setHasUniTypeError] = useState(false);

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
    setHasProvinceError(false);
    updateFormData({ firstForm: newValue });
  };

  // Handle university type change
  const handleUniTypeChange = (newValue: UniTypeOption | null) => {
    const translationKey = newValue?.key ?? null;
    setSelectedUniType(translationKey);
    setHasUniTypeError(false);
    updateFormData({ uniType: translationKey });
  };

  // Handle form submission
  const handleNext = () => {
    let valid = true;

    if (!selectedProvinces) {
      setHasProvinceError(true);
      valid = false;
    }
    if (!selectedUniType) {
      setHasUniTypeError(true);
      valid = false;
    }

    if (valid) {
      updateFormData({
        firstForm: selectedProvinces,
        uniType: selectedUniType,
      });
      void navigate("/secondForm");
    }
  };

  return {
    // State
    selectedProvinces,
    selectedUniType,
    hasProvinceError,
    hasUniTypeError,

    // Data
    provinces,
    translatedUniTypeOptions,
    selectedUniTypeValue,

    // Handlers
    handleProvinceChange,
    handleUniTypeChange,
    handleNext,

    // Translation function
    t,
  };
};
