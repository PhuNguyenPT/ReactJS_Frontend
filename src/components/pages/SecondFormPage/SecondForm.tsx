import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useSecondForm } from "../../../hooks/formPages/useSecondForm";

const SecondForm = ({ hasError }: { hasError: boolean }) => {
  const { handleMajorChange, getDropdownData, t } = useSecondForm({ hasError });

  return (
    <Box
      component="form"
      className="second-form"
      sx={{
        width: "100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {[0, 1, 2].map((index) => {
        const { translatedOptions, selectedValue, showError } =
          getDropdownData(index);

        return (
          <FormControl
            key={index}
            error={showError}
            sx={{
              width: {
                xs: "100%",
                sm: "100%",
                md: 450,
              },
            }}
          >
            <Autocomplete
              options={translatedOptions}
              value={selectedValue}
              onChange={(_, newValue) => {
                handleMajorChange(index, newValue?.key ?? null);
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
                  placeholder={`${t("secondForm.major")} ${String(index + 1)}`}
                  error={showError}
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
              {showError ? t("secondForm.errorWarning") : " "}
            </FormHelperText>
          </FormControl>
        );
      })}
    </Box>
  );
};

export default SecondForm;
