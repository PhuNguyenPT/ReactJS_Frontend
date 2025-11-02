import {
  Box,
  Typography,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Button,
  Chip,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { useHistoryPage } from "../../../hooks/formPages/useHistoryPage";

export default function History() {
  const { t } = useTranslation();

  const {
    students,
    loading,
    error,
    currentPage,
    totalElements,
    viewingResultLoading,
    paginatedStudents,
    displayTotalPages,
    handlePageChange,
    handleViewResult,
    handleStartPrediction,
    formatDate,
    formatTime,
    getRelativeTime,
  } = useHistoryPage();

  // Loading state
  if (loading) {
    return (
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "400px",
          gap: 2,
        }}
      >
        <CircularProgress sx={{ color: "#A657AE" }} size={60} />
        <Typography sx={{ color: "white", fontSize: "1.1rem" }}>
          {t("history.loading")}
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: "800px", margin: "0 auto", px: 2 }}>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("history.errorOccurred")}
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      className="history"
      sx={{
        width: "100%",
        maxWidth: "1200px",
        margin: "0 auto",
        px: 2,
        py: 3,
      }}
    >
      {/* Loading overlay for viewing result */}
      {viewingResultLoading && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(0, 0, 0, 0.5)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 9999,
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: 3,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
            }}
          >
            <CircularProgress sx={{ color: "#A657AE" }} />
            <Typography>{t("history.loadingResults")}</Typography>
          </Box>
        </Box>
      )}

      {/* Summary Info */}
      {students.length > 0 && (
        <Box
          sx={{
            mb: 4,
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: "16px",
            padding: "20px",
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: "1.2rem",
              fontWeight: 500,
            }}
          >
            {t("history.totalRecords", { count: totalElements })}
          </Typography>
        </Box>
      )}

      {/* History Cards */}
      <Box>
        {students.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 8,
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: "16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ color: "#A657AE", fontWeight: 500, mb: 2 }}
            >
              {t("history.noHistory")}
            </Typography>
            <Typography sx={{ color: "#666", mb: 3 }}>
              {t("history.noHistoryDescription")}
            </Typography>
            <Button
              variant="contained"
              onClick={handleStartPrediction}
              sx={{
                backgroundColor: "#A657AE",
                color: "white",
                px: 4,
                py: 1.5,
                borderRadius: "25px",
                fontSize: "1rem",
                fontWeight: 600,
                "&:hover": {
                  backgroundColor: "#8e4a96",
                },
              }}
            >
              {t("history.startPrediction")}
            </Button>
          </Box>
        ) : (
          <>
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                },
                gap: 3,
              }}
            >
              {paginatedStudents.map((student) => (
                <Card
                  key={student.id}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "16px",
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: "translateY(-4px)",
                      boxShadow: "0 8px 20px rgba(166, 87, 174, 0.3)",
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: 3,
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                    }}
                  >
                    {/* Relative Time Badge */}
                    <Box sx={{ mb: 2 }}>
                      <Chip
                        label={getRelativeTime(student.createdAt)}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(166, 87, 174, 0.15)",
                          color: "#A657AE",
                          fontWeight: 600,
                          fontSize: "1rem",
                        }}
                      />
                    </Box>

                    {/* Created Date */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{ color: "#A657AE", fontSize: "2rem" }}
                      />
                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: "1.25rem",
                          fontWeight: 600,
                        }}
                      >
                        {t("history.createdOn")}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: "1.25rem",
                        }}
                      >
                        {formatTime(student.createdAt)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: "1.25rem",
                          fontWeight: 500,
                        }}
                      >
                        {formatDate(student.createdAt)}
                      </Typography>
                    </Box>

                    {/* Student ID (truncated) */}
                    <Typography
                      sx={{
                        color: "#888",
                        fontSize: "1rem",
                        mb: 2,
                        fontFamily: "monospace",
                      }}
                    >
                      ID: {student.id.substring(0, 10)}...
                    </Typography>

                    {/* View Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={<VisibilityIcon />}
                      onClick={() => {
                        void handleViewResult(student.id);
                      }}
                      disabled={viewingResultLoading}
                      sx={{
                        backgroundColor: "#A657AE",
                        color: "white",
                        py: 1.5,
                        borderRadius: "12px",
                        fontSize: "0.95rem",
                        fontWeight: 600,
                        textTransform: "none",
                        "&:hover": {
                          backgroundColor: "#8e4a96",
                        },
                        "&:disabled": {
                          backgroundColor: "#ccc",
                        },
                      }}
                    >
                      {t("history.viewResults")}
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </Box>

            {/* Pagination */}
            {displayTotalPages > 1 && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 5, mb: 2 }}>
                <Pagination
                  count={displayTotalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      fontSize: "1rem",
                      fontWeight: 500,
                      "&.Mui-selected": {
                        backgroundColor: "#A657AE",
                        color: "white",
                        "&:hover": {
                          backgroundColor: "#8e4a96",
                        },
                      },
                      "&:hover": {
                        backgroundColor: "rgba(166, 87, 174, 0.2)",
                      },
                    },
                  }}
                />
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
