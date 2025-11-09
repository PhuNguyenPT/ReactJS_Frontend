import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  Snackbar,
} from "@mui/material";
import NinthForm from "./NinthForm";
import { useTranslation } from "react-i18next";
import { useState, useEffect } from "react";
import useAuth from "../../../hooks/auth/useAuth";
import { useAdmissionHandler } from "../../../hooks/studentAdmission/useAdmissionHandler";
import { getFilterFieldsForStudent } from "../../../services/studentAdmission/admissionFilterService";
import type { StudentResponse } from "../../../type/interface/profileTypes";
import type { NinthFormNavigationState } from "../../../type/interface/navigationTypes";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const navigate = useNavigate();
  const location = useLocation();
  const { t } = useTranslation();

  const { isAuthenticated, isLoading, user } = useAuth();
  const { processAdmission, isAdmissionSuccessful } = useAdmissionHandler();

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [studentId, setStudentId] = useState<string | null>(null);
  const [processingStatus, setProcessingStatus] = useState<string>("");
  const [retryProgress, setRetryProgress] = useState<{
    attempt: number;
    maxAttempts: number;
    progress?: number;
  }>({ attempt: 0, maxAttempts: 0 });

  useEffect(() => {
    const navigationState = location.state as
      | NinthFormNavigationState
      | undefined;

    const navStudentId =
      navigationState?.responseData &&
      typeof navigationState.responseData === "object" &&
      "id" in navigationState.responseData
        ? (navigationState.responseData as { id?: string }).id
        : null;

    if (navStudentId) {
      setStudentId(navStudentId);
      sessionStorage.setItem("studentId", navStudentId);
      return;
    }

    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      setStudentId(storedStudentId);
      return;
    }

    if (user && typeof user === "object" && "id" in user) {
      const userId = (user as StudentResponse).id;
      if (userId) {
        setStudentId(userId);
        sessionStorage.setItem("studentId", userId);
        return;
      }
    }

    console.warn("[NinthFormPage] No student ID found");
  }, [location.state, user]);

  const handleSubmit = async () => {
    if (!studentId) {
      setErrorMessage(t("errors.studentIdNotFound"));
      return;
    }

    setIsSubmitting(true);
    setErrorMessage(null);
    setProcessingStatus(t("ninthForm.processingPrediction"));
    setRetryProgress({ attempt: 0, maxAttempts: 0 });

    try {
      // Step 1: Process admission with new RetryProgress interface
      const admissionData = await processAdmission(studentId, isAuthenticated, {
        onRetry: (progress) => {
          // Update retry progress with new interface
          setRetryProgress({
            attempt: progress.attempt,
            maxAttempts: progress.maxAttempts,
            progress: progress.progress,
          });

          // Update status message based on progress
          if (progress.statusMessage) {
            setProcessingStatus(progress.statusMessage);
          } else {
            setProcessingStatus(
              t("ninthForm.gettingResults", {
                attempt: progress.attempt,
                maxAttempts: progress.maxAttempts,
              }),
            );
          }
        },
      });

      if (!admissionData || !isAdmissionSuccessful(admissionData)) {
        setErrorMessage(t("ninthForm.errors.predictionTimeout"));
        setIsSubmitting(false);
        setProcessingStatus("");
        return;
      }

      // Step 2: Fetch filter fields after successful admission
      setProcessingStatus(t("ninthForm.loadingFilters"));
      const filterResponse = await getFilterFieldsForStudent(
        studentId,
        isAuthenticated,
      );

      // Step 3: Navigate with both admission data and filter fields
      setProcessingStatus(t("ninthForm.predictionCompleted"));

      const userData =
        user && typeof user === "object" && "data" in user
          ? (user as StudentResponse).data
          : null;

      const userId =
        isAuthenticated && user && typeof user === "object" && "userId" in user
          ? (user as StudentResponse).userId
          : undefined;

      const userName = isAuthenticated ? userData?.name : undefined;

      void navigate("/result", {
        state: {
          userId,
          userName,
          studentId,
          savedToAccount: isAuthenticated,
          isGuest: !isAuthenticated,
          admissionData: admissionData.data,
          filterFields: filterResponse.success ? filterResponse.data : null,
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

        {/* Show processing status when submitting */}
        {isSubmitting && processingStatus && (
          <Box
            sx={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              padding: 4,
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
              zIndex: 2000,
              minWidth: "300px",
              textAlign: "center",
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2, color: "#A657AE" }} />
            <Typography variant="h6" sx={{ mb: 1, color: "#333" }}>
              {processingStatus}
            </Typography>
            {retryProgress.attempt > 0 && (
              <Typography variant="body2" sx={{ color: "#666" }}>
                {t("ninthForm.retryProgress", {
                  attempt: retryProgress.attempt,
                  maxAttempts: retryProgress.maxAttempts,
                })}
              </Typography>
            )}
          </Box>
        )}

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
            t("common.submit")
          )}
        </Button>
      </Box>

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
