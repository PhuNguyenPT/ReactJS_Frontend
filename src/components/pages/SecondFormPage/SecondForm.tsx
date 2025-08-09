import { useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  IconButton,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const majors = [
  "Khoa học máy tính",
  "Kinh tế",
  "Y học",
  "Kỹ thuật",
  "Luật",
  "Ngôn ngữ học",
];

const SecondForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [selectedMajors, setSelectedMajors] = useState<string[]>(["", "", ""]);
  const [hasError, setHasError] = useState(false);

  const handleChange = (index: number, value: string | null) => {
    const updated = [...selectedMajors];
    updated[index] = value ?? "";
    setSelectedMajors(updated);
    setHasError(false);
  };

  const handleNext = () => {
    if (selectedMajors.every((major) => major.trim() !== "")) {
      setHasError(false);
      void navigate("/thirdForm");
    } else {
      setHasError(true);
    }
  };

  const handlePrev = () => {
    void navigate("/firstForm");
  };

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
          error={hasError && selectedMajors[index] === ""}
          sx={{ mb: 1, width: 450, marginRight: 50 }}
        >
          <Autocomplete
            options={majors}
            value={selectedMajors[index] || ""}
            onChange={(_, newValue) => {
              handleChange(index, newValue);
            }}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={`${t("secondForm.major")} ${String(index + 1)}`}
                sx={{
                  "& .MuiOutlinedInput-root": {
                    borderRadius: 999,
                  },
                }}
              />
            )}
          />
          <FormHelperText sx={{ minHeight: "1.5em" }}>
            {hasError && selectedMajors[index] === ""
              ? t("secondForm.errorWarning")
              : " "}
          </FormHelperText>
        </FormControl>
      ))}

      <Box
        sx={{
          position: "relative",
          bottom: 0,
          right: 0,
          display: "flex",
          gap: 0.3,
          marginLeft: 58,
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            height: 40,
            width: 40,
            backgroundColor: "#A657AE",
            color: "white",
            "&:hover": { backgroundColor: "#8B4A8F" },
            borderRadius: 1,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            height: 40,
            width: 40,
            backgroundColor: "#A657AE",
            color: "white",
            "&:hover": { backgroundColor: "#8B4A8F" },
            borderRadius: 1,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default SecondForm;
