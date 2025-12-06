import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../auth/useAuth";
import { useAdmissionHandler } from "../studentAdmission/useAdmissionHandler";
import { pollPredictionResult } from "../../services/predictionResult/predictionResultService";
import { getFilterFieldsForStudent } from "../../services/studentAdmission/admissionFilterService";
import type { StudentResponse } from "../../type/interface/profileTypes";
import type { NinthFormNavigationState } from "../../type/interface/navigationTypes";

export function useNinthFormSubmission() {
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

  // Get studentId from navigation state, sessionStorage, or user object
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
    setProcessingStatus(t("ninthForm.updatingScores"));
    setRetryProgress({ attempt: 0, maxAttempts: 0 });

    try {
      // STEP 1: Poll prediction result to check if status is "completed"
      setProcessingStatus(t("ninthForm.checkingPredictionStatus"));

      const predictionResult = await pollPredictionResult(
        studentId,
        isAuthenticated,
        {
          maxAttempts: 10,
          intervalMs: 2000,
          onProgress: (attempt, maxAttempts) => {
            setRetryProgress({
              attempt,
              maxAttempts,
              progress: (attempt / maxAttempts) * 100,
            });
            setProcessingStatus(
              t("ninthForm.checkingPredictionStatus") +
                ` (${String(attempt)}/${String(maxAttempts)})`,
            );
          },
        },
      );

      if (
        !predictionResult.success ||
        predictionResult.status !== "completed"
      ) {
        setErrorMessage(
          predictionResult.message ?? t("ninthForm.errors.predictionNotReady"),
        );
        setIsSubmitting(false);
        setProcessingStatus("");
        return;
      }

      // STEP 2: Process admission with retry logic
      setProcessingStatus(t("ninthForm.processingPrediction"));
      setRetryProgress({ attempt: 0, maxAttempts: 0 });

      const admissionData = await processAdmission(studentId, isAuthenticated, {
        onRetry: (progress) => {
          setRetryProgress({
            attempt: progress.attempt,
            maxAttempts: progress.maxAttempts,
            progress: progress.progress,
          });

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

      // STEP 3: Fetch filter fields after successful admission
      setProcessingStatus(t("ninthForm.loadingFilters"));
      const filterResponse = await getFilterFieldsForStudent(
        studentId,
        isAuthenticated,
      );

      // STEP 4: Navigate to results page
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

  return {
    isSubmitting,
    isLoading,
    errorMessage,
    studentId,
    processingStatus,
    retryProgress,
    handleNext,
    handlePrev,
    handleCloseError,
  };
}
