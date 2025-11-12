import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Box, IconButton } from "@mui/material";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import FirstForm from "./FirstForm";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../../contexts/FormData/useFormData";

export default function FirstFormPage() {
  usePageTitle("Unizy | First Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData } = useFormData();

  const [hasProvinceError, setHasProvinceError] = useState(false);
  const [hasUniTypeError, setHasUniTypeError] = useState(false);

  const handleNext = () => {
    let isValid = true;

    // Validate province
    if (!formData.firstForm) {
      setHasProvinceError(true);
      isValid = false;
    } else {
      setHasProvinceError(false);
    }

    // Validate university type
    if (!formData.uniType) {
      setHasUniTypeError(true);
      isValid = false;
    } else {
      setHasUniTypeError(false);
    }

    if (isValid) {
      void navigate("/secondForm");
    }
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
            <h1 className="form-title">1 → {t("firstForm.title")}</h1>
            <p className="form-subtitle">{t("firstForm.subTitle1")}</p>
            {/* Pass error states to FirstForm */}
            <FirstForm
              hasProvinceError={hasProvinceError}
              hasUniTypeError={hasUniTypeError}
            />
          </div>

          {/* Navigation button positioned at bottom-right of form card */}
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
