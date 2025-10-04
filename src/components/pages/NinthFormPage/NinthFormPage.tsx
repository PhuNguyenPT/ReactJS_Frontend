import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
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
import useAuth from "../../../hooks/auth/useAuth";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use your existing auth hook
  const { isAuthenticated, isLoading, user } = useAuth();

  // Local state for popup
  const [openPopup, setOpenPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleNext = () => {
    // Show loading indicator while checking authentication
    if (isLoading || isSubmitting) {
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, process and save results
      console.log("User is authenticated:", user?.name ?? user?.email);

      setIsSubmitting(true);

      // Use void to explicitly ignore the promise
      void (async () => {
        try {
          // Simulate API call
          await new Promise((resolve) => setTimeout(resolve, 1000));

          // Navigate to final result page with prediction data
          void navigate("/finalResult", {
            state: {
              userId: user?.id,
              userName: user?.name,
              savedToAccount: true,
            },
          });
        } catch (error) {
          console.error("Error processing form:", error);
          // Handle error - maybe show an error dialog
          alert("Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại!");
        } finally {
          setIsSubmitting(false);
        }
      })();
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
    // Store the current path to redirect back after login
    sessionStorage.setItem("redirectAfterAuth", "/ninthForm");
    // Redirect to login page
    void navigate("/login");
  };

  const handleSkip = async () => {
    setOpenPopup(false);
    setIsSubmitting(true);

    try {
      // Skip authentication and proceed without saving
      console.log(
        "User skipped authentication, proceeding without saving results",
      );
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // Navigate to final result page without saving
      void navigate("/finalResult", {
        state: {
          savedToAccount: false,
          isGuest: true,
        },
      });
    } catch (error) {
      console.error("Error processing form:", error);
      alert("Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại!");
    } finally {
      setIsSubmitting(false);
    }
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
        <NinthForm />

        {/* Back button */}
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
            "&:hover": { backgroundColor: "#f0f0f0" },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
          }}
        >
          {t("buttons.back", "BACK")}
        </Button>

        {/* Submit button */}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isLoading || isSubmitting}
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
          {isLoading || isSubmitting ? (
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
              <CircularProgress size={20} sx={{ color: "#A657AE" }} />
            ) : (
              t("common.skip", "Bỏ qua")
            )}
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
