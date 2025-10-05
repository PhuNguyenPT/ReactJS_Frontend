import { useState } from "react";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import FourthForm from "./FourthForm";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useFourthForm } from "../../../hooks/formPages/useFourthForm";

export default function FourthFormPage() {
  usePageTitle("Unizy | Fourth Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [showErrors, setShowErrors] = useState(false);

  // Get validation function from fourth form hook
  const { validateForm } = useFourthForm();

  const handleNext = () => {
    const validation = validateForm();

    if (validation.isValid) {
      void navigate("/fifthForm");
      setShowErrors(false); // Reset errors on successful navigation
    } else {
      // Show errors when user tries to proceed with incomplete form
      setShowErrors(true);
    }
  };

  const handlePrev = () => {
    void navigate("/thirdForm");
  };

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content">
          <h1 className="form-title">4 → {t("fourthForm.title")}</h1>
          <FourthForm showErrors={showErrors} />
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
