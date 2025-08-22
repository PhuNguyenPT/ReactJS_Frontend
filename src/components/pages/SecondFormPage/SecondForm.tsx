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

  const selectedMajors = formData.secondFormMajors;
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
    updateFormData({ secondFormMajors: updated });
  };

  return (
    <Box component="form" className="second-form" sx={{ position: "relative" }}>
      {[0, 1, 2].map((index) => (
        <FormControl
          key={index}
          fullWidth
          error={hasError && index === 0 && !selectedMajors[0]}
          sx={{ mb: 1, width: 450, marginRight: 50 }}
        >
          <Autocomplete
            options={getAvailableOptions(index)}
            value={selectedMajors[index]}
            onChange={(_, newValue) => {
              handleMajorChange(index, newValue);
            }}
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
      ))}
    </Box>
  );
};

export default SecondForm;
