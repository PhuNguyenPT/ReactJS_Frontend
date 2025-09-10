import usePageTitle from "../../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
  CircularProgress,
} from "@mui/material";
import NinthForm from "./NinthForm";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import useAuth from "../../../hooks/useAuth"; // Import your existing useAuth hook

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use your existing auth hook
  const { isAuthenticated, isLoading, user } = useAuth();

  // Local state for popup
  const [openPopup, setOpenPopup] = useState(false);

  const handleNext = () => {
    // Show loading indicator while checking authentication
    if (isLoading) {
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, proceed to next form
      console.log("User is authenticated:", user?.name ?? user?.email);
      void navigate("/tenthForm");
    } else {
      // User is not authenticated, show popup
      setOpenPopup(true);
    }
  };

  const handlePrev = () => {
    void navigate("/eighthForm");
  };

  const handleLogin = () => {
    setOpenPopup(false);
    // Redirect to login page
    void navigate("/login");
  };

  const handleSkip = () => {
    setOpenPopup(false);
    // Skip authentication and proceed to next form
    console.log(
      "User skipped authentication, proceeding without saving results",
    );
    void navigate("/tenthForm");
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  // Optional: Show user info in console for debugging
  console.log("Auth Status:", {
    isAuthenticated,
    isLoading,
    user: user ? `${user.name} (${user.email})` : null,
  });

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
            marginTop: "2rem",
          }}
        >
          {t("ninthForm.title")}
        </Typography>

        {/* Optional: Show welcome message if user is logged in */}
        {isAuthenticated && user && (
          <Typography
            variant="subtitle1"
            sx={{
              textAlign: "center",
              color: "white",
              mb: 2,
              opacity: 0.8,
            }}
          >
            {t("welcome.message", `Welcome back, ${user.name || user.email}!`)}
          </Typography>
        )}

        <NinthForm />

        {/* Back button */}
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

        {/* Submit button */}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isLoading}
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
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
          }}
        >
          {isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            t("common.submit", "SUBMIT")
          )}
        </Button>
      </Box>

      {/* Authentication Popup Dialog */}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        PaperComponent={Paper}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "white",
              borderRadius: "16px",
              padding: "1.5rem",
              textAlign: "center",
              maxWidth: "400px",
            },
          },
        }}
      >
        <DialogContent>
          <DialogContentText
            sx={{
              fontSize: "1.1rem",
              fontWeight: 500,
              color: "#A657AE",
              mb: 3,
            }}
          >
            {t("popup.saveResultMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: 2,
            pb: 1,
          }}
        >
          <Button
            variant="contained"
            onClick={handleLogin}
            sx={{
              backgroundColor: "#A657AE",
              color: "white",
              px: 4,
              borderRadius: "12px",
              "&:hover": { backgroundColor: "#8B4A8F" },
            }}
          >
            {t("common.login")}
          </Button>
          <Button
            variant="outlined"
            onClick={handleSkip}
            sx={{
              borderColor: "#A657AE",
              color: "#A657AE",
              px: 4,
              borderRadius: "12px",
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#A657AE",
              },
            }}
          >
            {t("common.skip")}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
