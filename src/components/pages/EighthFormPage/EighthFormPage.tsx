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

        {/* Error Alert - Enhanced to handle multi-line errors */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
            sx={{
              mt: 2,
              maxWidth: "600px",
              width: "100%",
              "& .MuiAlert-message": {
                width: "100%",
                whiteSpace: "pre-line", // Preserve line breaks
              },
            }}
          >
            <Box
              component="div"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 1,
              }}
            >
              {/* Split by newline and render each error on separate line */}
              {error.split("\n").map((errorLine) => (
                <Typography
                  key={errorLine}
                  variant="body2"
                  sx={{
                    wordBreak: "break-word",
                  }}
                >
                  {errorLine}
                </Typography>
              ))}
            </Box>
          </Alert>
        )}

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
          disabled={isSubmitting}
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
            "&:hover": {
              backgroundColor: "#f0f0f0",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {t("buttons.back")}
        </Button>

        <Button
          variant="contained"
          onClick={() => void handleNext()}
          disabled={isSubmitting || isLoading}
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
            minWidth: "120px",
            height: "56px",
            "&:hover": {
              backgroundColor: "#8B4A8F",
            },
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
          }}
        >
          {isSubmitting || isLoading ? (
            <CircularProgress size={28} sx={{ color: "white" }} />
          ) : (
            t("buttons.next")
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
            {t(
              "popup.saveResultMessage",
              "Bạn có muốn đăng nhập để lưu kết quả không?",
            )}
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
            disabled={isSubmitting}
            sx={{
              backgroundColor: "#A657AE",
              color: "white",
              px: 4,
              height: "42px",
              borderRadius: "12px",
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
              px: 4,
              height: "42px",
              minWidth: "100px",
              borderRadius: "12px",
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
