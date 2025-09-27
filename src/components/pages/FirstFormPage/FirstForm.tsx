import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Button,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VietnamSouthernProvinces } from "../../../type/enum/vietnamese.provinces";
import { getAllUniTypes } from "../../../type/enum/uni-type";
import { useFormData } from "../../../contexts/FormData/useFormData";

const FirstForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormData();

  // Province state (provinces might not need translation if they're proper names)
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
  const uniTypes = useMemo(() => getAllUniTypes(), []); // Now returns translation keys

  // Convert translation keys to display options for university types
  const getTranslatedUniTypeOptions = (availableOptions: string[]) => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected university type value as an option object
  const getSelectedUniTypeValue = (translationKey: string | null) => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

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
      // Save both fields into context before navigating
      updateFormData({
        firstForm: selectedProvinces,
        uniType: selectedUniType,
      });
      void navigate("/secondForm");
    }
  };

  const translatedUniTypeOptions = getTranslatedUniTypeOptions(uniTypes);
  const selectedUniTypeValue = getSelectedUniTypeValue(selectedUniType);

  return (
    <Box component="form" className="first-form">
      {/* Province dropdown */}
      <FormControl fullWidth error={hasProvinceError} sx={{ mb: 1 }}>
        <Autocomplete
          options={provinces}
          value={selectedProvinces}
          onChange={(_, newValue) => {
            setSelectedProvinces(newValue);
            setHasProvinceError(false);
            updateFormData({ firstForm: newValue });
          }}
          sx={{
            width: 450,
            marginRight: 63,
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("firstForm.selectProvince")}
              error={hasProvinceError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  "& fieldset": {
                    borderColor: "#A657AE",
                  },
                  "&:hover fieldset": {
                    borderColor: "#8B4A8F",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A657AE",
                  },
                },
                "& input": {
                  color: "#A657AE",
                },
              }}
            />
          )}
        />
        <FormHelperText sx={{ minHeight: "1.5em" }}>
          {hasProvinceError ? t("firstForm.errorWarning1") : " "}
        </FormHelperText>
      </FormControl>
      <p className="form-subtitle">{t("firstForm.subTitle2")}</p>

      {/* University type dropdown */}
      <FormControl fullWidth error={hasUniTypeError} sx={{ mt: 2 }}>
        <Autocomplete
          options={translatedUniTypeOptions}
          value={selectedUniTypeValue}
          onChange={(_, newValue) => {
            const translationKey = newValue?.key ?? null;
            setSelectedUniType(translationKey);
            setHasUniTypeError(false);
            updateFormData({ uniType: translationKey });
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.key === value.key}
          sx={{
            width: 450,
            marginRight: 63,
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("firstForm.selectUniType")}
              error={hasUniTypeError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
                  "& fieldset": {
                    borderColor: "#A657AE",
                  },
                  "&:hover fieldset": {
                    borderColor: "#8B4A8F",
                  },
                  "&.Mui-focused fieldset": {
                    borderColor: "#A657AE",
                  },
                },
                "& input": {
                  color: "#A657AE",
                },
              }}
            />
          )}
        />
        <FormHelperText sx={{ minHeight: "1.5em" }}>
          {hasUniTypeError ? t("firstForm.errorWarning2") : " "}
        </FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        sx={{
          mt: 4,
          px: 3,
          py: 1,
          borderRadius: 2,
          fontSize: "1.1rem",
          backgroundColor: "#A657AE",
          textTransform: "none",
          fontWeight: "bold",
          marginLeft: 18.5,
          marginTop: 6,
          "&:hover": {
            backgroundColor: "#8B4A8F",
          },
        }}
        onClick={handleNext}
      >
        {t("firstForm.enterButton")}
      </Button>
    </Box>
  );
};

export default FirstForm;
