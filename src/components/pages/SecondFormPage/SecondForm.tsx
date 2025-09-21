import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { getAllMajorGroups } from "../../../type/enum/major";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

const SecondForm = ({ hasError }: { hasError: boolean }) => {
  const { t } = useTranslation();
  const { formData, updateFormData } = useFormData();

  const selectedMajors = formData.secondForm;
  const allMajors = getAllMajorGroups();

  const getAvailableOptions = (currentIndex: number): string[] => {
    const otherSelected = selectedMajors
      .filter((_, i) => i !== currentIndex)
      .filter((v): v is string => v !== null);

    return allMajors.filter((major) => !otherSelected.includes(major));
  };

  const handleMajorChange = (index: number, value: string | null) => {
    const updated = [...selectedMajors];
    updated[index] = value;
    updateFormData({ secondForm: updated });
  };

  // Convert translation keys to display options with translated labels
  const getTranslatedOptions = (availableOptions: string[]) => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected value as an option object
  const getSelectedValue = (translationKey: string | null) => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  return (
    <Box component="form" className="second-form" sx={{ position: "relative" }}>
      {[0, 1, 2].map((index) => {
        const availableOptions = getAvailableOptions(index);
        const translatedOptions = getTranslatedOptions(availableOptions);
        const selectedValue = getSelectedValue(selectedMajors[index]);

        return (
          <FormControl
            key={index}
            fullWidth
            error={hasError && index === 0 && !selectedMajors[0]}
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
              {hasError && index === 0 && !selectedMajors[0]
                ? t("secondForm.errorWarning")
                : " "}
            </FormHelperText>
          </FormControl>
        );
      })}
    </Box>
  );
};

export default SecondForm;
