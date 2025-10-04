import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import SixthForm from "./SixthForm";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export default function SixthFormPage() {
  usePageTitle("Unizy | Sixth Form");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleNext = () => {
    void navigate("/seventhForm");
  };

  const handlePrev = () => {
    void navigate("/fifthForm");
  };

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content ">
          <h1 className="form-title">6 → {t("sixthForm.title")}</h1>
          <p className="form-subtitle">{t("sixthForm.subTitle")}</p>
          <SixthForm />
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
