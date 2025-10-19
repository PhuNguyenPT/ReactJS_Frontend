import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { Box, Button, Typography } from "@mui/material";
import FinalResult from "./Result";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";

export default function FinalResultPage() {
  usePageTitle("Unizy | Final Result");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePrev = () => {
    // Check if user came from history page
    const state = location.state as { fromHistory?: boolean } | null;

    if (state?.fromHistory) {
      // If from history, go back to history page
      void navigate("/history");
    } else {
      // Otherwise, go back to ninthForm
      void navigate("/ninthForm");
    }
  };

  return (
    <>
      <div className="background" />
      <Box
        className="final-result-page"
        sx={{
          pb: 12,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: "4rem",
          paddingX: "1rem",
        }}
      >
        <Typography
          variant="h3"
          className="final-result-title"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mb: 5,
            marginTop: "2rem",
            px: 2,
          }}
        >
          {t("finalResult.title")}
        </Typography>

        <FinalResult />

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
            px: 4,
            fontSize: "1.5rem",
            zIndex: 1000,
            "&:hover": { backgroundColor: "#f0f0f0" },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("buttons.back")}
        </Button>
      </Box>
    </>
  );
}
