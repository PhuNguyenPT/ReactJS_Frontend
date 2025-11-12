import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SecondForm from "./SecondForm";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../../contexts/FormData/useFormData";

export default function SecondFormPage() {
  usePageTitle("Unizy | Second Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData } = useFormData();

  const [hasError, setHasError] = useState(false);

  const handleNext = () => {
    // check if at least one major is selected
    const hasAtLeastOneMajor = formData.secondForm.some(
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
        <Box
          sx={{
            position: "relative", // Keep relative positioning for the container
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="form-content">
            <h1 className="form-title">2 → {t("secondForm.title")}</h1>
            <p className="form-subtitle">{t("secondForm.subTitle")}</p>
            {/* Pass only error state to SecondForm */}
            <SecondForm hasError={hasError} />
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
