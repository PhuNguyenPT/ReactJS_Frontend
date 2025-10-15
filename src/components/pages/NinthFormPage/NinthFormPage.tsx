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
  const [retryAttempt, setRetryAttempt] = useState<number>(0);
  const [maxRetries, setMaxRetries] = useState<number>(0);

  const hasLoggedAuthStatus = useRef(false);

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
      console.log(
        "[NinthFormPage] Found student ID from navigation:",
        navStudentId,
      );
      setStudentId(navStudentId);
      sessionStorage.setItem("studentId", navStudentId);
      return;
    }

    const storedStudentId = sessionStorage.getItem("studentId");
    if (storedStudentId) {
      console.log(
        "[NinthFormPage] Found student ID from sessionStorage:",
        storedStudentId,
      );
      setStudentId(storedStudentId);
      return;
    }

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

      // Step 1: Process admission
      const admissionData = await processAdmission(studentId, isAuthenticated, {
        initialDelay: 3000,
        maxRetries: 12,
        retryDelay: 3000,
        useExponentialBackoff: true,
        maxBackoffDelay: 10000,
        onRetry: (attempt, max) => {
          setRetryAttempt(attempt);
          setMaxRetries(max);
          setProcessingStatus(t("ninthForm.gettingResults"));
        },
      });

      console.log("[NinthFormPage] Admission data received:", admissionData);

      if (!admissionData || !isAdmissionSuccessful(admissionData)) {
        setErrorMessage(t("errors.predictionTimeout"));
        setIsSubmitting(false);
        setProcessingStatus("");
        return;
      }

      // Step 2: Fetch filter fields after successful admission
      setProcessingStatus(
        t("ninthForm.loadingFilters", "Loading filter options..."),
      );
      console.log("[NinthFormPage] Fetching filter fields for:", studentId);

      const filterResponse = await getFilterFieldsForStudent(
        studentId,
        isAuthenticated,
      );

      console.log("[NinthFormPage] Filter fields received:", filterResponse);

      // Step 3: Navigate with both admission data and filter fields
      setProcessingStatus(t("ninthForm.predictionComplete"));

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
