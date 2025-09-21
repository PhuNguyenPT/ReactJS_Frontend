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
import { UniType } from "../../../type/enum/uni-type";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

const FirstForm = () => {
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
  const uniTypes = useMemo(() => Object.values(UniType), []);

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
          options={uniTypes}
          value={selectedUniType}
          onChange={(_, newValue) => {
            setSelectedUniType(newValue);
            setHasUniTypeError(false);
            updateFormData({ uniType: newValue });
          }}
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
