import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { Box, Typography, Button } from "@mui/material";
import History from "./History";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";

export default function HistoryPage() {
  usePageTitle("Unizy | Prediction History");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleBackHome = () => {
    void navigate("/");
  };

  return (
    <>
      <div className="background" />
      <Box
        className="history-page"
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
        {/* Title Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: 5,
            marginTop: "2rem",
            px: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mb: 2,
            }}
          >
            <Typography
              variant="h3"
              className="history-title"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: { xs: "1.8rem", md: "2.5rem" },
              }}
            >
              {t("history.title")}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: { xs: "1rem", md: "1.2rem" },
              fontWeight: 300,
              maxWidth: "800px",
              margin: "0 auto",
            }}
          >
            {t("history.subtitle")}
          </Typography>
        </Box>

        {/* History Component */}
        <History />

        {/* Back to Home button */}
        <Button
          variant="contained"
          onClick={handleBackHome}
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
          {t("common.home")}
        </Button>
      </Box>
    </>
  );
}
