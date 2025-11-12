import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import SeventhForm from "./SeventhForm";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useState } from "react";
import { useFormData } from "../../../contexts/FormData/useFormData";

export default function SeventhFormPage() {
  usePageTitle("Unizy | Seventh Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData } = useFormData();

  const [shouldValidate, setShouldValidate] = useState(false);

  // Validate all seventh form fields (just check empties)
  const validateSeventhForm = () => {
    const { grades } = formData.seventhForm;
    const allFilled = Object.values(grades).every(
      (grade) => grade.conduct !== "" && grade.academicPerformance !== "",
    );
    return allFilled;
  };

  const handleNext = () => {
    setShouldValidate(true);

    const isValid = validateSeventhForm();
    if (isValid) {
      setShouldValidate(false); // Reset validation trigger
      void navigate("/eighthForm");
    }
  };

  const handlePrev = () => {
    setShouldValidate(false);
    void navigate("/sixthForm");
  };

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="form-content">
            <Box
              component="h1"
              className="form-title"
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.75rem",
                  md: "2rem",
                },
              }}
            >
              7 → {t("seventhForm.title")}
            </Box>
            <SeventhForm shouldValidate={shouldValidate} />
          </div>

          {/* Navigation buttons positioned at bottom-right of form card */}
          <Box
            sx={{
              position: "absolute",
              bottom: {
                xs: 15,
                sm: 20,
                md: 20,
              },
              right: {
                xs: 15,
                sm: 20,
                md: 20,
              },
              display: "flex",
              gap: {
                xs: 0.5,
                sm: 0.5,
                md: 0.3,
              },
              zIndex: 10,
            }}
          >
            <IconButton onClick={handlePrev} sx={buttonStyle}>
              <ArrowBackIosNewIcon
                fontSize="small"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                    md: "1.25rem",
                  },
                }}
              />
            </IconButton>
            <IconButton onClick={handleNext} sx={buttonStyle}>
              <ArrowForwardIosIcon
                fontSize="small"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                    md: "1.25rem",
                  },
                }}
              />
            </IconButton>
          </Box>
        </Box>
      </div>
    </>
  );
}

const buttonStyle = {
  height: {
    xs: 35,
    sm: 38,
    md: 40,
  },
  width: {
    xs: 35,
    sm: 38,
    md: 40,
  },
  backgroundColor: "#A657AE",
  color: "white",
  "&:hover": { backgroundColor: "#8B4A8F" },
  borderRadius: 1,
};
