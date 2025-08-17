import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const majors = [
  "Khoa học máy tính",
  "Kinh tế",
  "Y học",
  "Kỹ thuật",
  "Luật",
  "Ngôn ngữ học",
];

interface SecondFormProps {
  selectedMajors: (string | null)[];
  hasError: boolean;
  onMajorChange: (index: number, value: string | null) => void;
}

const SecondForm = ({
  selectedMajors,
  hasError,
  onMajorChange,
}: SecondFormProps) => {
  const { t } = useTranslation();

  return (
    <Box
      component="form"
      className="second-form"
      sx={{
        position: "relative",
      }}
    >
      {[0, 1, 2].map((index) => (
        <FormControl
          key={index}
          fullWidth
          error={hasError}
          sx={{ mb: 1, width: 450, marginRight: 50 }}
        >
          <Autocomplete
            options={majors}
            value={selectedMajors[index]}
            onChange={(_, newValue) => {
              onMajorChange(index, newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={`${t("secondForm.major")} ${String(index + 1)}`}
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
            {hasError && index === 0 ? t("secondForm.errorWarning") : " "}
          </FormHelperText>
        </FormControl>
      ))}
    </Box>
  );
};

export default SecondForm;
