import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  Paper,
} from "@mui/material";
import EighthForm from "./EighthForm";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { useStudentProfile } from "../../../hooks/userProfile/useStudentProfile";
import useAuth from "../../../hooks/auth/useAuth";

export default function EighthFormPage() {
  usePageTitle("Unizy | Eighth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Auth hook
  const { isAuthenticated, isLoading } = useAuth();

  // Use the custom hook for profile submission
  const { isSubmitting, error, handleSubmit, clearError } = useStudentProfile();

  // State for authentication popup
  const [openPopup, setOpenPopup] = useState(false);

  const handleNext = async () => {
    // Check authentication status
    if (isLoading || isSubmitting) {
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, proceed with submission
      await handleSubmit();
    } else {
      // User is not authenticated, show popup
      setOpenPopup(true);
    }
  };

  const handlePrev = () => {
    void navigate("/seventhForm");
  };

  const handleLogin = () => {
    setOpenPopup(false);
    // Store the current path to redirect back after login
    sessionStorage.setItem("redirectAfterAuth", "/eighthForm");
    // Redirect to login page
    void navigate("/login");
  };

  const handleSkip = async () => {
    setOpenPopup(false);
    // Proceed as guest
    await handleSubmit();
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  return (
    <>
      <div className="background" />
      <Box
        className="eighth-form-page"
        sx={{
          pb: { xs: 10, sm: 12, md: 14 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: { xs: "4rem", sm: "5rem", md: "6rem" },
          paddingX: { xs: "1rem", sm: "1.5rem", md: "2rem" },
        }}
      >
        {/* Title */}
        <Typography
          variant="h4"
          className="eighth-title"
          sx={{
            fontSize: {
              xs: "1.5rem",
              sm: "1.75rem",
              md: "2rem",
              lg: "2.125rem",
            },
            fontWeight: 500,
            mb: { xs: 2, sm: 3, md: 4 },
            textAlign: "center",
            px: { xs: 1, sm: 2 },
          }}
        >
          {t("eighthForm.title")}
        </Typography>

        {/* Form Container */}
        <Box
          sx={{
            width: "100%",
            maxWidth: { xs: "100%", sm: "600px", md: "800px", lg: "900px" },
            px: { xs: 0, sm: 1, md: 2 },
          }}
        >
          <EighthForm />
        </Box>

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{
              mt: { xs: 2, sm: 2.5, md: 3 },
              maxWidth: { xs: "100%", sm: "600px", md: "800px" },
              width: "100%",
              mx: { xs: 1, sm: 2 },
              fontSize: { xs: "0.875rem", sm: "0.9rem", md: "1rem" },
              "& .MuiAlert-message": {
                width: "100%",
                whiteSpace: "pre-line",
              },
              "& .MuiAlert-icon": {
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
              },
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 0.5, sm: 0.75, md: 1 },
              }}
            >
              {error.split("\n").map((errorLine) => (
                <Typography
                  key={errorLine}
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                    fontSize: { xs: "0.8rem", sm: "0.875rem", md: "0.9rem" },
                  }}
                >
                  {errorLine}
                </Typography>
              ))}
            </Box>
          </Alert>
        )}

        {/* Helper Text  */}
        <Typography
          variant="body1"
          sx={{
            color: "white",
            textAlign: { xs: "center", sm: "center", md: "center" },
            paddingTop: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
            fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
            maxWidth: { xs: "100%" },
            px: { xs: 2, sm: 1 },
            lineHeight: 1.6,
          }}
        >
          {t("eighthForm.helper1")} <strong>{t("buttons.next")}</strong>{" "}
          {t("eighthForm.helper2")}
        </Typography>

        {/* Back Button */}
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={isSubmitting}
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
            fontWeight: 500,
            zIndex: 1000,
            minWidth: { xs: "auto", sm: "100px", md: "120px" },
            height: { xs: "44px", sm: "50px", md: "56px" },
            "&:hover": {
              backgroundColor: "#f0f0f0",
              transform: "translateY(-2px)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {t("buttons.back")}
        </Button>

        {/* Next Button */}
        <Button
          variant="contained"
          onClick={() => void handleNext()}
          disabled={isSubmitting || isLoading}
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 25, md: 30 },
            right: { xs: 20, sm: 25, md: 30 },
            backgroundColor: "#A657AE",
            color: "white",
            borderRadius: { xs: "16px", sm: "18px", md: "20px" },
            px: { xs: 2, sm: 3, md: 4 },
            py: { xs: 1, sm: 1.25, md: 1.5 },
            fontSize: {
              xs: "0.875rem",
              sm: "1rem",
              md: "1.25rem",
              lg: "1.5rem",
            },
            fontWeight: 500,
            zIndex: 1000,
            minWidth: { xs: "auto", sm: "100px", md: "120px" },
            height: { xs: "44px", sm: "50px", md: "56px" },
            "&:hover": {
              backgroundColor: "#8B4A8F",
              transform: "translateY(-2px)",
              boxShadow: "0px 4px 12px rgba(0,0,0,0.3)",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            transition: "all 0.3s ease",
          }}
        >
          {isSubmitting || isLoading ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            t("buttons.next")
          )}
        </Button>
      </Box>

      {/* Authentication Popup Dialog*/}
      <Dialog
        open={openPopup}
        onClose={handleClosePopup}
        PaperComponent={Paper}
        slotProps={{
          paper: {
            sx: {
              backgroundColor: "white",
              borderRadius: { xs: "12px", sm: "14px", md: "16px" },
              padding: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
              textAlign: "center",
              maxWidth: { xs: "80%", sm: "400px" },
              margin: { xs: "1rem", sm: "auto" },
              width: { xs: "calc(100% - 2rem)", sm: "auto" },
            },
          },
        }}
      >
        <DialogContent
          sx={{
            px: { xs: 1, sm: 2, md: 3 },
            py: { xs: 2, sm: 2.5, md: 3 },
          }}
        >
          <DialogContentText
            sx={{
              fontSize: { xs: "0.95rem", sm: "1rem", md: "1.1rem" },
              fontWeight: 500,
              color: "#A657AE",
              mb: { xs: 2, sm: 2.5, md: 3 },
              lineHeight: 1.5,
            }}
          >
            {t("popup.saveResultMessage")}
          </DialogContentText>
        </DialogContent>
        <DialogActions
          sx={{
            justifyContent: "center",
            gap: { xs: 1.5, sm: 2 },
            pb: { xs: 1, sm: 1.5 },
            px: { xs: 1, sm: 2 },
            flexDirection: { xs: "column", sm: "row" },
            width: { xs: "100%", sm: "auto" },
          }}
        >
          <Button
            variant="contained"
            onClick={handleLogin}
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#A657AE",
              color: "white",
              px: { xs: 3, sm: 4 },
              height: { xs: "40px", sm: "42px" },
              fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
              borderRadius: { xs: "10px", sm: "12px" },
              width: { xs: "100%", sm: "auto" },
              minWidth: { sm: "120px" },
              "&:hover": { backgroundColor: "#8B4A8F" },
              "&:disabled": {
                backgroundColor: "#cccccc",
              },
            }}
          >
            {t("common.login", "Đăng nhập")}
          </Button>
          <Button
            variant="outlined"
            onClick={() => void handleSkip()}
            disabled={isSubmitting}
            sx={{
              borderColor: "#A657AE",
              color: "#A657AE",
              px: { xs: 3, sm: 4 },
              height: { xs: "40px", sm: "42px" },
              fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
              minWidth: { xs: "100%", sm: "100px" },
              borderRadius: { xs: "10px", sm: "12px" },
              width: { xs: "100%", sm: "auto" },
              "&:hover": {
                backgroundColor: "#f5f5f5",
                borderColor: "#A657AE",
              },
              "&:disabled": {
                borderColor: "#cccccc",
                color: "#cccccc",
              },
            }}
          >
            {isSubmitting ? (
              <CircularProgress size={24} sx={{ color: "#A657AE" }} />
            ) : (
              t("common.skip", "Bỏ qua")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
