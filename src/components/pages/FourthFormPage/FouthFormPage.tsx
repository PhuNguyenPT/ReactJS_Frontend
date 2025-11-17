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
              4 → {t("fourthForm.title")}
            </Box>
            <FourthForm showErrors={showErrors} />
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
                xs: 1,
                sm: 1,
                md: 1,
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
