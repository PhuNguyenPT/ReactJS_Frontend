import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
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
import { useNinthFormSubmission } from "../../../hooks/formPages/useNinthFormSubmission";

export default function NinthFormPage() {
  usePageTitle("Unizy | Ninth Form");
  const { t } = useTranslation();

  const {
    isSubmitting,
    isLoading,
    errorMessage,
    studentId,
    processingStatus,
    retryProgress,
    handleNext,
    handlePrev,
    handleCloseError,
  } = useNinthFormSubmission();

  return (
    <>
      <div className="background" />
      <Box
        className="ninth-form-page"
        sx={{
          pb: { xs: 12, sm: 10 },
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "100vh",
          paddingTop: { xs: "5rem", sm: "4rem" },
          paddingX: { xs: "0.5rem", sm: "1rem", md: "2rem" },
        }}
      >
        <Typography
          variant="h3"
          className="ninth-title"
          sx={{
            textAlign: "center",
            fontWeight: "bold",
            color: "white",
            mb: { xs: 3, sm: 4, md: 5 },
            marginTop: { xs: "1rem", sm: "1.5rem", md: "2rem" },
            fontSize: { xs: "1.75rem", sm: "2.5rem", md: "3rem" },
            px: { xs: 1, sm: 2 },
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
              padding: { xs: 3, sm: 4 },
              borderRadius: 2,
              boxShadow: "0px 4px 20px rgba(0,0,0,0.2)",
              zIndex: 2000,
              minWidth: { xs: "250px", sm: "300px" },
              maxWidth: { xs: "90%", sm: "400px" },
              textAlign: "center",
            }}
          >
            <CircularProgress size={40} sx={{ mb: 2, color: "#A657AE" }} />
            <Typography
              variant="h6"
              sx={{
                mb: 1,
                color: "#333",
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {processingStatus}
            </Typography>
            {retryProgress.attempt > 0 && (
              <Typography
                variant="body2"
                sx={{
                  color: "#666",
                  fontSize: { xs: "0.75rem", sm: "0.875rem" },
                }}
              >
                {t("ninthForm.retryProgress", {
                  attempt: retryProgress.attempt,
                  maxAttempts: retryProgress.maxAttempts,
                })}
              </Typography>
            )}
          </Box>
        )}

        {/* Back Button */}
        <Button
          variant="contained"
          onClick={handlePrev}
          disabled={isSubmitting}
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 30 },
            left: { xs: 15, sm: 30 },
            backgroundColor: "white",
            color: "#A657AE",
            borderRadius: "20px",
            px: { xs: 2.5, sm: 3, md: 4 },
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            zIndex: 1000,
            height: { xs: "48px", sm: "52px", md: "56px" },
            minWidth: { xs: "80px", sm: "100px", md: "120px" },
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

        {/* Submit Button */}
        <Button
          variant="contained"
          onClick={handleNext}
          disabled={isLoading || isSubmitting || !studentId}
          sx={{
            position: "fixed",
            bottom: { xs: 20, sm: 30 },
            right: { xs: 15, sm: 30 },
            backgroundColor: "#A657AE",
            color: "white",
            borderRadius: "20px",
            px: { xs: 2.5, sm: 3, md: 4 },
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.5rem" },
            zIndex: 1000,
            height: { xs: "48px", sm: "52px", md: "56px" },
            minWidth: { xs: "100px", sm: "120px", md: "140px" },
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
