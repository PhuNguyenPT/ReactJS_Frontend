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
    <Box component="form" className="second-form" sx={{ position: "relative" }}>
      {[0, 1, 2].map((index) => {
        const { translatedOptions, selectedValue, showError } =
          getDropdownData(index);

        return (
          <FormControl
            key={index}
            fullWidth
            error={showError}
            sx={{ mb: 1, width: 450, marginRight: 50 }}
          >
            <Autocomplete
              options={translatedOptions}
              value={selectedValue}
              onChange={(_, newValue) => {
                handleMajorChange(index, newValue?.key ?? null);
              }}
              getOptionLabel={(option) => option.label}
              isOptionEqualToValue={(option, value) => option.key === value.key}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`${t("secondForm.major")} ${String(index + 1)}`}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      borderRadius: 999,
                      "& fieldset": { borderColor: "#A657AE" },
                      "&:hover fieldset": { borderColor: "#8B4A8F" },
                      "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                    },
                    "& input": { color: "#A657AE" },
                  }}
                />
              )}
            />
            <FormHelperText sx={{ minHeight: "1.5em" }}>
              {showError ? t("secondForm.errorWarning") : " "}
            </FormHelperText>
          </FormControl>
        );
      })}
    </Box>
  );
};

export default SecondForm;
