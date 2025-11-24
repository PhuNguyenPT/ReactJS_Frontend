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
          pb: { xs: 10, sm: 12 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: { xs: "5rem", sm: "3.5rem", md: "4rem" },
          paddingX: { xs: "0.5rem", sm: "1rem" },
        }}
      >
        <Box
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mb: { xs: 3, sm: 4, md: 5 },
            marginTop: { xs: "1rem", sm: "1.5rem", md: "2rem" },
            px: { xs: 1, sm: 2 },
            fontSize: {
              xs: "1.75rem",
              sm: "2.25rem",
              md: "2.75rem",
              lg: "3rem",
            },
            lineHeight: 1.2,
          }}
          component="h3"
          id="page-top"
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
            bottom: { xs: 16, sm: 24, md: 30 },
            left: { xs: 16, sm: 24, md: 30 },
            backgroundColor: "white",
            color: "#A657AE",
            borderRadius: { xs: "16px", sm: "18px", md: "20px" },
            px: { xs: 2.5, sm: 3.5, md: 4 },
            py: { xs: 1, sm: 1.25 },
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            fontWeight: 500,
            minHeight: { xs: "44px", sm: "48px" },
            zIndex: 1000,
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            transition: "all 0.2s ease-in-out",
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "translateY(-2px)",
              boxShadow: "0px 4px 8px rgba(0,0,0,0.25)",
            },
            "&:active": {
              transform: "translateY(0px)",
            },
          }}
        >
          {t("buttons.back")}
        </Button>

        {/* Scroll to Top Button - Aligned with Filter Button */}
        <Fab
          color="primary"
          aria-label="scroll to top"
          onClick={handleScrollToTop}
          sx={{
            position: "fixed",
            bottom: { xs: 90, sm: 172, md: 150 },
            right: { xs: 16, sm: 24, md: 50 },
            backgroundColor: "#A657AE",
            color: "white",
            width: { xs: 56, sm: 56, md: 64 },
            height: { xs: 56, sm: 56, md: 64 },
            zIndex: 1000,
            boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
            transition: "all 0.3s ease-in-out",
            "&:hover": {
              backgroundColor: "#8e4a96",
              transform: "scale(1.1)",
              boxShadow: "0px 6px 16px rgba(0, 0, 0, 0.2)",
            },
            "&:active": {
              transform: "scale(0.95)",
            },
          }}
        >
          <KeyboardArrowUpIcon
            sx={{
              fontSize: { xs: "1.5rem", sm: "1.75rem" },
            }}
          />
        </Fab>
      </Box>
    </>
  );
}
