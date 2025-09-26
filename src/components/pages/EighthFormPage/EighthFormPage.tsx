import usePageTitle from "../../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import EighthForm from "./EighthForm";
import { useTranslation } from "react-i18next";

export default function EighthFormPage() {
  usePageTitle("Unizy | Eighth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNext = () => {
    void navigate("/ninthForm");
  };

  const handlePrev = () => {
    void navigate("/seventhForm");
  };

  return (
    <>
      <div className="background" />
      <Box
        className="eighth-form-page"
        sx={{
          pb: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: "6rem",
          paddingX: "1rem",
        }}
      >
        {/* Title */}
        <Typography variant="h4" className="eighth-title">
          {t("eighthForm.title")}
        </Typography>

        <EighthForm />
        <Typography
          variant="body1"
          sx={{ color: "white", textAlign: "left", paddingTop: "2rem" }}
        >
          {t("eighthForm.helper1")} <strong>{t("buttons.next")}</strong>{" "}
          {t("eighthForm.helper2")}
        </Typography>
        <Button
          variant="contained"
          onClick={handlePrev}
          sx={{
            position: "fixed",
            bottom: 30,
            left: 30,
            backgroundColor: "white",
            color: "#A657AE",
            borderRadius: "20px",
            px: 5,
            fontSize: "1.5rem",
            zIndex: 1000, // Ensure button is on top
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("buttons.back")}
        </Button>
        <Button
          variant="contained"
          onClick={handleNext}
          sx={{
            position: "fixed",
            bottom: 30,
            right: 30,
            backgroundColor: "#A657AE",
            color: "white",
            borderRadius: "20px",
            px: 5,
            fontSize: "1.5rem",
            zIndex: 1000, // Ensure button is on top
            "&:hover": {
              backgroundColor: "#8B4A8F",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("buttons.next")}
        </Button>
      </Box>
    </>
  );
}
