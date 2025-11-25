import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useFirstForm } from "../../../hooks/formPages/useFirstForm";

interface FirstFormProps {
  hasProvinceError: boolean;
  hasUniTypeError: boolean;
}

const FirstForm = ({ hasProvinceError, hasUniTypeError }: FirstFormProps) => {
  const {
    selectedProvinces,
    provinces,
    translatedUniTypeOptions,
    selectedUniTypeValue,
    handleProvinceChange,
    handleUniTypeChange,
    t,
  } = useFirstForm();

  return (
    <Box
      component="form"
      className="first-form"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {/* Province dropdown */}
      <FormControl
        error={hasProvinceError}
        sx={{
          mb: 1,
          width: {
            xs: "100%",
            sm: "100%",
            md: 450,
          },
        }}
      >
        <Autocomplete
          options={provinces}
          value={selectedProvinces}
          onChange={(_, newValue) => {
            handleProvinceChange(newValue);
          }}
          sx={{
            width: "100%",
          }}
          filterSelectedOptions
          slotProps={{
            paper: {
              sx: {
                "& .MuiAutocomplete-option": {
                  fontFamily: "Montserrat",
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("firstForm.selectProvince")}
              error={hasProvinceError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: {
                    xs: 20,
                    sm: 30,
                    md: 999,
                  },
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },
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
                  fontFamily: "Montserrat",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },
                  padding: {
                    xs: "10px 14px",
                    sm: "12px 14px",
                    md: "16.5px 14px",
                  },
                },
              }}
            />
          )}
        />
        <FormHelperText
          sx={{
            minHeight: "1.5em",
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
              md: "0.75rem",
            },
          }}
        >
          {hasProvinceError ? t("firstForm.errorWarning1") : " "}
        </FormHelperText>
      </FormControl>

      <Box component="p" className="form-subtitle">
        {t("firstForm.subTitle2")}
      </Box>

      {/* University type dropdown */}
      <FormControl
        error={hasUniTypeError}
        sx={{
          mt: {
            xs: 1.5,
            sm: 1.5,
            md: 2,
          },
          width: {
            xs: "100%",
            sm: "100%",
            md: 450,
          },
        }}
      >
        <Autocomplete
          options={translatedUniTypeOptions}
          value={selectedUniTypeValue}
          onChange={(_, newValue) => {
            handleUniTypeChange(newValue);
          }}
          getOptionLabel={(option) => option.label}
          isOptionEqualToValue={(option, value) => option.key === value.key}
          sx={{
            width: "100%",
          }}
          filterSelectedOptions
          slotProps={{
            paper: {
              sx: {
                "& .MuiAutocomplete-option": {
                  fontFamily: "Montserrat",
                },
              },
            },
          }}
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("firstForm.selectUniType")}
              error={hasUniTypeError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: {
                    xs: 20,
                    sm: 30,
                    md: 999,
                  },
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },
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
                  fontFamily: "Montserrat",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },
                  padding: {
                    xs: "10px 14px",
                    sm: "12px 14px",
                    md: "16.5px 14px",
                  },
                },
              }}
            />
          )}
        />
        <FormHelperText
          sx={{
            minHeight: "1.5em",
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
              md: "0.75rem",
            },
          }}
        >
          {hasUniTypeError ? t("firstForm.errorWarning2") : " "}
        </FormHelperText>
      </FormControl>
    </Box>
  );
};

export default FirstForm;
