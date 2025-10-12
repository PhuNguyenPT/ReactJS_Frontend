import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
  LinearProgress,
} from "@mui/material";
import NinthForm from "./NinthForm";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useRef } from "react";
import useAuth from "../../../hooks/auth/useAuth";
import { useAdmissionHandler } from "../../../hooks/studentAdmission/useAdmissionHandler";
import type { StudentResponse } from "../../../type/interface/profileTypes";
import type { NinthFormNavigationState } from "../../../type/interface/navigationTypes";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  // Use your existing auth hook
  const { isAuthenticated, isLoading, user } = useAuth();

  // Use the admission handler hook
  const { processAdmission, isAdmissionSuccessful } = useAdmissionHandler();

  // Local state for loading and errors
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [maxRetries, setMaxRetries] = useState<number>(0);

  // Use ref to track if we've already logged auth status
  const hasLoggedAuthStatus = useRef(false);

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

  // Log auth status only once when component mounts or when auth state actually changes
  useEffect(() => {
    if (!hasLoggedAuthStatus.current || isLoading) {
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

      if (!isLoading) {
        hasLoggedAuthStatus.current = true;
      }
    }
  }, [isAuthenticated, isLoading, user, studentId]);

  /**
   * Handle form submission with retry callback for UI updates
   */
  const handleSubmit = async () => {
    if (!studentId) {
      setErrorMessage(t("errors.studentIdNotFound"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setProcessingStatus(t("ninthForm.processingPrediction"));
    setRetryAttempt(0);

    try {
      console.log("[NinthFormPage] Submitting for user:", studentId);

      // Use the refactored hook with options object
      const admissionData = await processAdmission(studentId, isAuthenticated, {
        initialDelay: 3000, // 3 second initial wait (faster first check)
        maxRetries: 12, // 12 retries for ML processing
        retryDelay: 3000, // 3 second base delay between retries
        useExponentialBackoff: true, // Gradually increase delay
        maxBackoffDelay: 10000, // Max 10 seconds between retries
        onRetry: (attempt, max) => {
          // Update UI with retry progress
          setRetryAttempt(attempt);
          setMaxRetries(max);
          setProcessingStatus(t("ninthForm.gettingResults"));
        },
      });

      console.log("[NinthFormPage] Admission data received:", admissionData);

      // Check if we got valid results
      if (!admissionData || !isAdmissionSuccessful(admissionData)) {
        // ML processing might still be ongoing
        setErrorMessage(t("errors.predictionTimeout"));
        setIsSubmitting(false);
        setProcessingStatus("");
        return;
      }

      // Success! Update status
      setProcessingStatus(t("ninthForm.predictionComplete"));

      // Extract user info safely (only for authenticated users)
      const userData =
        user && typeof user === "object" && "data" in user
          ? (user as StudentResponse).data
          : null;

      const userId =
        isAuthenticated && user && typeof user === "object" && "userId" in user
          ? (user as StudentResponse).userId
          : undefined;

      const userName = isAuthenticated ? userData?.name : undefined;

      // Navigate to final result page with admission data
      void navigate("/finalResult", {
        state: {
          userId,
          userName,
          studentId,
          savedToAccount: isAuthenticated,
          isGuest: !isAuthenticated,
          admissionData: admissionData.data,
        },
      });
    } catch (error) {
      console.error("[NinthFormPage] Error submitting form:", error);
      setErrorMessage(t("errors.submissionFailed"));
      setProcessingStatus("");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleNext = () => {
    if (isLoading || isSubmitting) {
      return;
    }
    void handleSubmit();
  };

  const handlePrev = () => {
    void navigate("/eighthForm");
  };

  const handleCloseError = () => {
    setErrorMessage(null);
  };

  // Calculate progress percentage for visual feedback
  const progressPercentage =
    maxRetries > 0 ? (retryAttempt / maxRetries) * 100 : 0;

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

        {/* Processing Status Alert */}
        {isSubmitting && processingStatus && (
          <Box
            sx={{
              position: "fixed",
              top: 20,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 2000,
              width: "90%",
              maxWidth: "500px",
            }}
          >
            <Alert
              severity="info"
              sx={{
                backgroundColor: "rgba(166, 87, 174, 0.95)",
                backdropFilter: "blur(10px)",
                color: "white",
                "& .MuiAlert-icon": {
                  color: "white",
                },
              }}
            >
              <Typography variant="body1" sx={{ mb: 1, color: "white" }}>
                {processingStatus}
              </Typography>
              {maxRetries > 0 && (
                <LinearProgress
                  variant="determinate"
                  value={progressPercentage}
                  sx={{
                    mt: 1,
                    backgroundColor: "rgba(255, 255, 255, 0.3)",
                    "& .MuiLinearProgress-bar": {
                      backgroundColor: "white",
                    },
                  }}
                />
              )}
            </Alert>
          </Box>
        )}

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
            px: 4,
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
            px: 4,
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
