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
        <div className="form-2-content">
          <h1 className="form-title">7 → {t("seventhForm.title")}</h1>
          <SeventhForm shouldValidate={shouldValidate} />
        </div>

        {/* Navigation buttons */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: 0.3,
            top: 181.6,
            right: 106,
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
      </div>
    </>
  );
}
