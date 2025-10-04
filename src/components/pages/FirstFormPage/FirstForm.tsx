import {
  Box,
  FormControl,
  Button,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useFirstForm } from "../../../hooks/formPages/useFirstForm";

const FirstForm = () => {
  const {
    selectedProvinces,
    //selectedUniType,
    hasProvinceError,
    hasUniTypeError,
    provinces,
    translatedUniTypeOptions,
    selectedUniTypeValue,
    handleProvinceChange,
    handleUniTypeChange,
    handleNext,
    t,
  } = useFirstForm();

  return (
    <Box component="form" className="first-form">
      {/* Province dropdown */}
      <FormControl fullWidth error={hasProvinceError} sx={{ mb: 1 }}>
        <Autocomplete
          options={provinces}
          value={selectedProvinces}
          onChange={(_, newValue) => {
            handleProvinceChange(newValue);
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
            handleUniTypeChange(newValue);
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
