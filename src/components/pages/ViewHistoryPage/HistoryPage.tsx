import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { Box, Typography, Button } from "@mui/material";
import History from "./History";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";

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
          pb: { xs: 10, sm: 12, md: 14 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: { xs: "5rem", sm: "5rem", md: "4rem" },
          paddingX: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        }}
      >
        {/* Title Section */}
        <Box
          sx={{
            textAlign: "center",
            mb: { xs: 3, sm: 4, md: 5 },
            marginTop: { xs: "1rem", sm: "1.5rem", md: "2rem" },
            px: { xs: 1, sm: 2 },
            width: "100%",
            maxWidth: "1200px",
          }}
        >
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 1, sm: 1.5, md: 2 },
              mb: { xs: 1.5, sm: 2 },
            }}
          >
            <Typography
              variant="h3"
              className="history-title"
              sx={{
                fontWeight: "bold",
                color: "white",
                fontSize: {
                  xs: "1.5rem",
                  sm: "2rem",
                  md: "2.5rem",
                  lg: "3rem",
                },
                lineHeight: 1.2,
              }}
            >
              {t("history.title")}
            </Typography>
          </Box>
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.9)",
              fontSize: {
                xs: "0.875rem",
                sm: "1rem",
                md: "1.1rem",
                lg: "1.2rem",
              },
              fontWeight: 300,
              maxWidth: "800px",
              margin: "0 auto",
              lineHeight: 1.5,
              px: { xs: 1, sm: 0 },
            }}
          >
            {t("history.subtitle")}
          </Typography>
        </Box>

        {/* History Component */}
        <Box
          sx={{
            width: "100%",
            maxWidth: "1400px",
            px: { xs: 0, sm: 1, md: 2 },
          }}
        >
          <History />
        </Box>

        {/* Back to Home button - Responsive positioning and sizing */}
        <Button
          variant="contained"
          onClick={handleBackHome}
          startIcon={
            <HomeIcon
              sx={{
                display: { xs: "block", sm: "none" },
                fontSize: "1.25rem",
              }}
            />
          }
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 25, md: 30 },
            left: { xs: 20, sm: 25, md: 30 },
            backgroundColor: "white",
            color: "#A657AE",
            borderRadius: { xs: "16px", sm: "18px", md: "20px" },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.25, md: 1.5 },
            fontSize: {
              xs: "0.875rem",
              sm: "1rem",
              md: "1.25rem",
              lg: "1.5rem",
            },
            fontWeight: 600,
            zIndex: 1000,
            minWidth: { xs: "auto", sm: "120px" },
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "translateY(-2px)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            },
            boxShadow: "0px 2px 8px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
            // Hide text on extra small screens, show icon only
            "& .MuiButton-startIcon": {
              margin: { xs: 0, sm: "0 8px 0 -4px" },
            },
          }}
        >
          <Box
            component="span"
            sx={{
              display: { xs: "none", sm: "inline" },
            }}
          >
            {t("common.home")}
          </Box>
        </Button>
      </Box>
    </>
  );
}
