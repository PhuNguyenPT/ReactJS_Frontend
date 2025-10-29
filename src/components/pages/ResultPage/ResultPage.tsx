import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { Box, Button, Fab } from "@mui/material";
import FinalResult from "./Result";
import { useTranslation } from "react-i18next";
import { useNavigate, useLocation } from "react-router-dom";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";

export default function FinalResultPage() {
  usePageTitle("Unizy | Final Result");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const location = useLocation();

  const handlePrev = () => {
    const state = location.state as { fromHistory?: boolean } | null;

    if (state?.fromHistory) {
      void navigate("/history");
    } else {
      void navigate("/ninthForm");
    }
  };

  const handleScrollToTop = () => {
    setTimeout(() => {
      const titleElement = document.querySelector(".final-result-page");
      if (titleElement) {
        titleElement.scrollIntoView({ behavior: "smooth", block: "start" });
      }
    });
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
        <Box
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mb: 5,
            marginTop: "2rem",
            px: 2,
            fontSize: { xs: "2rem", sm: "2.5rem", md: "3rem" },
          }}
          component="h3"
          id="page-top" // Add ID for easier targeting
        >
          {t("finalResult.title")}
        </Box>

        <FinalResult />

        {/* Back Button */}
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

        {/* Scroll to Top Button - Always visible, matching filter button style */}
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: 50, // Positioned above filter button (at 100px)
            right: 30,
            backgroundColor: "#A657AE",
            color: "white",
            zIndex: 1000,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#8e4a96",
              transform: "scale(1.1)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <KeyboardArrowUpIcon sx={{ fontSize: "2rem" }} />
        </Fab>
      </Box>
    </>
  );
}
