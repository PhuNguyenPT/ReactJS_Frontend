import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SecondForm from "./SecondForm";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";

export default function SecondFormPage() {
  usePageTitle("Unizy | Second Form");
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Move state and validation logic here
  const [selectedMajors, setSelectedMajors] = useState<(string | null)[]>([
    null,
    null,
    null,
  ]);
  const [hasError, setHasError] = useState(false);

  const handleMajorChange = (index: number, value: string | null) => {
    const updated = [...selectedMajors];
    updated[index] = value;
    setSelectedMajors(updated);
    setHasError(false);
  };

  const handleNext = () => {
    // Check if at least one major is selected (not null and not empty)
    const hasAtLeastOneMajor = selectedMajors.some(
      (major) => major !== null && major.trim() !== "",
    );

    if (hasAtLeastOneMajor) {
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
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content">
          <h1 className="form-title">2 → {t("secondForm.title")}</h1>
          <p className="form-subtitle">{t("secondForm.subTitle")}</p>
          <SecondForm
            selectedMajors={selectedMajors}
            hasError={hasError}
            onMajorChange={handleMajorChange}
          />
        </div>
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
