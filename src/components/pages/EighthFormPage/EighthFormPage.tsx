import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Typography,
  Button,
  CircularProgress,
  Alert,
  LinearProgress,
} from "@mui/material";
import EighthForm from "./EighthForm";
import { useTranslation } from "react-i18next";
import { useStudentProfile } from "../../../hooks/userProfile/useStudentProfile";

export default function EighthFormPage() {
  usePageTitle("Unizy | Eighth Form");
  const navigate = useNavigate();
  const { t } = useTranslation();

  // Use the custom hook for profile submission
  const { isSubmitting, error, handleSubmit, clearError, uploadProgress } =
    useStudentProfile();

  const handleNext = async () => {
    await handleSubmit();
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

        {/* Upload Progress */}
        {isSubmitting && uploadProgress > 0 && (
          <Box sx={{ width: "100%", maxWidth: "600px", mt: 2 }}>
            <LinearProgress
              variant="determinate"
              value={uploadProgress}
              sx={{
                height: 8,
                borderRadius: 5,
                backgroundColor: "rgba(255, 255, 255, 0.3)",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#A657AE",
                },
              }}
            />
            <Typography
              variant="caption"
              sx={{
                color: "white",
                mt: 1,
                display: "block",
                textAlign: "center",
              }}
            >
              {uploadProgress < 50
                ? "Creating profile..."
                : uploadProgress < 100
                  ? "Uploading files..."
                  : "Complete!"}
            </Typography>
          </Box>
        )}

        {/* Error Alert */}
        {error && (
          <Alert
            severity="error"
            onClose={clearError}
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
          onClick={() => void handleNext()}
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
