import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import FifthForm from "./FifthForm";
import { type FifthFormRef } from "../../../hooks/formPages/useFifthForm";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useRef } from "react";

export default function FifthFormPage() {
  usePageTitle("Unizy | Fifth Form");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const formRef = useRef<FifthFormRef>(null);

  const handleNext = () => {
    if (formRef.current?.validate()) {
      void navigate("/sixthForm");
    }
  };

  const handlePrev = () => {
    void navigate("/fourthForm");
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
            <Box component="h1" className="form-title">
              5 → {t("fifthForm.title")}
            </Box>
            <Box component="p" className="form-subtitle">
              {t("fifthForm.subTitle1")}
            </Box>
            <FifthForm ref={formRef} />
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
