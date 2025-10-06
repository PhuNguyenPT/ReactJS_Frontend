import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useNavigate, useLocation } from "react-router-dom";
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
  Alert,
  Snackbar,
} from "@mui/material";
import NinthForm from "./NinthForm";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/auth/useAuth";
import { getAdmissionForStudent } from "../../../services/studentAdmission/studentAdmissionService";
import type { StudentResponse } from "../../../type/interface/profileTypes";
import type { NinthFormNavigationState } from "../../../type/interface/navigationTypes";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Use your existing auth hook
  const { isAuthenticated, isLoading, user } = useAuth();

  // Local state for popup and loading
  const [openPopup, setOpenPopup] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);

  // Get student ID from navigation state or sessionStorage
  useEffect(() => {
    // First, try to get from navigation state
    const navigationState = location.state as
      | NinthFormNavigationState
      | undefined;

    // Check if navigationState has the studentId from previous page
    const navStudentId =
      navigationState?.responseData &&
      typeof navigationState.responseData === "object" &&
      "id" in navigationState.responseData
        ? (navigationState.responseData as { id?: string }).id
        : null;

    if (navStudentId) {
      console.log(
        "[NinthFormPage] Found student ID from navigation:",
        navStudentId,
      );
      setStudentId(navStudentId);
      sessionStorage.setItem("studentId", navStudentId);
      return;
    }

    // Fallback: check sessionStorage
    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      console.log(
        "[NinthFormPage] Found student ID from sessionStorage:",
        storedStudentId,
      );
      setStudentId(storedStudentId);
      return;
    }

    // Last resort: check user object
    if (user && typeof user === "object" && "id" in user) {
      const userId = (user as StudentResponse).id;
      if (userId) {
        console.log("[NinthFormPage] Found student ID from user:", userId);
        setStudentId(userId);
        sessionStorage.setItem("studentId", userId);
        return;
      }
    }

    console.warn("[NinthFormPage] No student ID found");
  }, [location.state, user]);

  /**
   * Unified submission handler that works for both authenticated and guest users
   * @param isGuest - Whether to treat this as a guest submission
   */
  const handleSubmit = async (isGuest = false) => {
    if (!studentId) {
      setErrorMessage(
        t(
          "errors.studentIdNotFound",
          "Student ID not found. Please complete previous steps.",
        ),
      );
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);

    try {
      const userType = isGuest ? "guest" : "authenticated";
      console.log(
        `[NinthFormPage] Submitting for ${userType} user:`,
        studentId,
      );

      // Use the smart helper that automatically picks the right endpoint
      const admissionData = await getAdmissionForStudent(
        studentId,
        isAuthenticated && !isGuest,
      );

      console.log("[NinthFormPage] Admission data received:", admissionData);

      // Extract user info safely (only for authenticated users)
      const userData =
        user && typeof user === "object" && "data" in user
          ? (user as StudentResponse).data
          : null;

      const userId =
        !isGuest && user && typeof user === "object" && "id" in user
          ? (user as StudentResponse).id
          : undefined;

      const userName = !isGuest ? userData?.name : undefined;

      // Navigate to final result page with admission data
      void navigate("/finalResult", {
        state: {
          userId,
          userName,
          studentId,
          savedToAccount: isAuthenticated && !isGuest,
          isGuest,
          admissionData: admissionData.data,
        },
      });
    } catch (error) {
      console.error("[NinthFormPage] Error submitting form:", error);
      setErrorMessage(
        t(
          "errors.submissionFailed",
          "Có lỗi xảy ra khi xử lý dữ liệu. Vui lòng thử lại!",
        ),
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  /**
   * Handle Next/Submit button click
   */
  const handleNext = () => {
    // Show loading indicator while checking authentication
    if (isLoading || isSubmitting) {
      return;
    }

    if (isAuthenticated) {
      // User is authenticated, submit with authentication
      void handleSubmit(false);
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

  /**
   * Handle skip button - proceed as guest
   */
  const handleSkip = () => {
    setOpenPopup(false);
    void handleSubmit(true); // Submit as guest
  };

  const handleClosePopup = () => {
    setOpenPopup(false);
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  // Optional: Show user info in console for debugging
  const userData =
    user && typeof user === "object" && "data" in user
      ? (user as StudentResponse).data
      : null;

  const userDisplayName = userData?.name ?? "Unknown";
  const userDisplayEmail = userData?.email ?? "Unknown";

  console.log("Auth Status:", {
    isAuthenticated,
    isLoading,
    user: user ? `${userDisplayName} (${userDisplayEmail})` : null,
    studentId: studentId ?? "Not found",
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
            height: "56px",
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
          disabled={isLoading || isSubmitting || !studentId}
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
            height: "56px",
            minWidth: "140px",
            "&:hover": { backgroundColor: "#8B4A8F" },
            boxShadow: "0px 2px 6px rgba(0,0,0,0.2)",
            "&:disabled": {
              backgroundColor: "#cccccc",
              color: "#666666",
            },
          }}
        >
          {isLoading || isSubmitting ? (
            <CircularProgress size={28} sx={{ color: "white" }} />
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
            onClick={handleSkip}
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

      {/* Error Snackbar */}
      <Snackbar
        open={!!errorMessage}
        autoHideDuration={6000}
        onClose={handleCloseError}
        anchorOrigin={{ vertical: "top", horizontal: "center" }}
      >
        <Alert
          onClose={handleCloseError}
          severity="error"
          sx={{ width: "100%" }}
        >
          {errorMessage}
        </Alert>
      </Snackbar>
    </>
  );
}
