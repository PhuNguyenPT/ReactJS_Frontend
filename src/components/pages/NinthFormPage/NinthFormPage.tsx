import usePageTitle from "../../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import { Box, Typography, Button } from "@mui/material";
import NinthForm from "./NinthForm";
import { useTranslation } from "react-i18next";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  const handleNext = () => {
    void navigate("/tenthForm");
  };

  const handlePrev = () => {
    void navigate("/eighthForm");
  };

  return (
    <>
      <div className="background" />
      <Box
        className="ninth-form-page"
        sx={{
          pb: 10,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: "4rem",
          paddingX: "1rem",
        }}
      >
        {/* Title above form */}
        <Typography
          variant="h3"
          className="ninth-title"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mb: 5,
            marginTop: "2rem", // Additional space from top if needed
          }}
        >
          {t("ninthForm.title")}
        </Typography>

        <NinthForm />

        {/* Buttons */}
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
            zIndex: 1000,
            "&:hover": { backgroundColor: "#f0f0f0" },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("buttons.back", "BACK")}
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
            zIndex: 1000,
            "&:hover": { backgroundColor: "#8B4A8F" },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("common.submit", "SUBMIT")}
        </Button>
      </Box>
    </>
  );
}
