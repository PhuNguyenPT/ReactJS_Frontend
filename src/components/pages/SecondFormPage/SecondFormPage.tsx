import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import SecondForm from "./SecondForm";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

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
        <div className="form-2-content">
          <h1 className="form-title">2 → {t("secondForm.title")}</h1>
          <p className="form-subtitle">{t("secondForm.subTitle")}</p>
          {/* Pass only error state to SecondForm */}
          <SecondForm hasError={hasError} />
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
          <IconButton onClick={handlePrev} sx={buttonStyle}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleNext} sx={buttonStyle}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </div>
    </>
  );
}

const buttonStyle = {
  height: 40,
  width: 40,
  backgroundColor: "#A657AE",
  color: "white",
  "&:hover": { backgroundColor: "#8B4A8F" },
  borderRadius: 1,
};
