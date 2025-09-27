import { useState } from "react";
import usePageTitle from "../../../hooks/usePageTitle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
} from "@mui/material";
import EighthForm from "./EighthForm";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../../contexts/FormData/useFormData";
import { submitGuestStudent } from "../../../services/student/guestStudentProfile";

export default function EighthFormPage() {
  usePageTitle("Unizy | Eighth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Get form data from context
  const { getFormDataForApi, clearStoredFormData } = useFormData();

  // State for API call handling
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleNext = async () => {
    setError(null);
    setIsSubmitting(true);

    try {
      // Get the form data already converted to Vietnamese values
      const formData = getFormDataForApi();

      // Submit to API
      const response = await submitGuestStudent(formData);

      if (response.success) {
        // Clear the stored form data after successful submission
        clearStoredFormData();

        // Navigate to the next page (you might want to pass the response data)
        void navigate("/ninthForm", {
          state: {
            submissionSuccess: true,
            responseData: response.data,
          },
        });
      } else {
        // Handle API error response
        setError(response.message ?? "Submission failed. Please try again.");
      }
    } catch (err) {
      // Handle network or other errors
      console.error("Error submitting form:", err);
      setError(
        err instanceof Error
          ? err.message
          : "An unexpected error occurred. Please try again.",
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handlePrev = () => {
    void navigate("/seventhForm");
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

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={() => {
              setError(null);
            }}
            sx={{
              mt: 2,
              maxWidth: "600px",
              width: "100%",
            }}
          >
            {error}
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
          onClick={() => {
            void handleNext();
          }}
          disabled={isSubmitting}
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
          {isSubmitting ? (
            <CircularProgress size={24} sx={{ color: "white" }} />
          ) : (
            t("buttons.next")
          )}
        </Button>
      </Box>
    </>
  );
}
