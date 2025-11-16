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
          minHeight: { xs: "300px", sm: "400px" },
          gap: 2,
          px: 2,
        }}
      >
        <CircularProgress
          sx={{
            color: "#A657AE",
            width: { xs: 50, sm: 60 },
            height: { xs: 50, sm: 60 },
          }}
        />
        <Typography
          sx={{
            color: "white",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
          }}
        >
          {t("history.loading")}
        </Typography>
      </Box>
    );
  }

  // Error state
  if (error) {
    return (
      <Box sx={{ maxWidth: "800px", margin: "0 auto", px: { xs: 2, sm: 3 } }}>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontSize: { xs: "1.1rem", sm: "1.25rem" },
            }}
          >
            {t("history.errorOccurred")}
          </Typography>
          <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
            {error}
          </Typography>
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
        px: { xs: 2, sm: 3, md: 4 },
        py: { xs: 2, sm: 3 },
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
            px: 2,
          }}
        >
          <Box
            sx={{
              backgroundColor: "white",
              borderRadius: "12px",
              padding: { xs: 2, sm: 3 },
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              minWidth: { xs: "200px", sm: "250px" },
            }}
          >
            <CircularProgress sx={{ color: "#A657AE" }} />
            <Typography sx={{ fontSize: { xs: "0.9rem", sm: "1rem" } }}>
              {t("history.loadingResults")}
            </Typography>
          </Box>
        </Box>
      )}

      {/* Summary Info */}
      {students.length > 0 && (
        <Box
          sx={{
            mb: { xs: 3, sm: 4 },
            textAlign: "center",
            backgroundColor: "rgba(255, 255, 255, 0.1)",
            borderRadius: { xs: "12px", sm: "16px" },
            padding: { xs: "16px", sm: "20px" },
          }}
        >
          <Typography
            sx={{
              color: "white",
              fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
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
              py: { xs: 4, sm: 6, md: 8 },
              px: { xs: 2, sm: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              borderRadius: { xs: "12px", sm: "16px" },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#A657AE",
                fontWeight: 500,
                mb: 2,
                fontSize: { xs: "1.1rem", sm: "1.25rem" },
              }}
            >
              {t("history.noHistory")}
            </Typography>
            <Typography
              sx={{
                color: "#666",
                mb: 3,
                fontSize: { xs: "0.9rem", sm: "1rem" },
              }}
            >
              {t("history.noHistoryDescription")}
            </Typography>
            <Button
              variant="contained"
              onClick={handleStartPrediction}
              sx={{
                backgroundColor: "#A657AE",
                color: "white",
                px: { xs: 3, sm: 4 },
                py: { xs: 1.2, sm: 1.5 },
                borderRadius: "25px",
                fontSize: { xs: "0.9rem", sm: "1rem" },
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
                gap: { xs: 2, sm: 2.5, md: 3 },
              }}
            >
              {paginatedStudents.map((student) => (
                <Card
                  key={student.id}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: { xs: "12px", sm: "16px" },
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                    transition: "all 0.3s ease",
                    "&:hover": {
                      transform: { xs: "none", sm: "translateY(-4px)" },
                      boxShadow: {
                        xs: "0 4px 12px rgba(0, 0, 0, 0.1)",
                        sm: "0 8px 20px rgba(166, 87, 174, 0.3)",
                      },
                    },
                  }}
                >
                  <CardContent
                    sx={{
                      p: { xs: 2, sm: 2.5, md: 3 },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      textAlign: "center",
                      "&:last-child": {
                        pb: { xs: 2, sm: 2.5, md: 3 },
                      },
                    }}
                  >
                    {/* Relative Time Badge */}
                    <Box sx={{ mb: { xs: 1.5, sm: 2 } }}>
                      <Chip
                        label={getRelativeTime(student.createdAt)}
                        size="small"
                        sx={{
                          backgroundColor: "rgba(166, 87, 174, 0.15)",
                          color: "#A657AE",
                          fontWeight: 600,
                          fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                          height: { xs: "28px", sm: "32px" },
                        }}
                      />
                    </Box>

                    {/* Created Date */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: { xs: 2, sm: 2.5, md: 3 },
                        gap: 0.5,
                      }}
                    >
                      <CalendarTodayIcon
                        sx={{
                          color: "#A657AE",
                          fontSize: { xs: "1.5rem", sm: "1.75rem", md: "2rem" },
                          mb: 0.5,
                        }}
                      />
                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                          fontWeight: 600,
                        }}
                      >
                        {t("history.createdOn")}
                      </Typography>

                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
                        }}
                      >
                        {formatTime(student.createdAt)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.25rem" },
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
                        fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                        mb: { xs: 1.5, sm: 2 },
                        fontFamily: "monospace",
                        wordBreak: "break-all",
                      }}
                    >
                      ID: {student.id.substring(0, 10)}...
                    </Typography>

                    {/* View Button */}
                    <Button
                      fullWidth
                      variant="contained"
                      startIcon={
                        <VisibilityIcon
                          sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }}
                        />
                      }
                      onClick={() => {
                        void handleViewResult(student.id);
                      }}
                      disabled={viewingResultLoading}
                      sx={{
                        backgroundColor: "#A657AE",
                        color: "white",
                        py: { xs: 1.2, sm: 1.5 },
                        borderRadius: { xs: "10px", sm: "12px" },
                        fontSize: {
                          xs: "0.85rem",
                          sm: "0.9rem",
                          md: "0.95rem",
                        },
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
              <Stack
                spacing={2}
                alignItems="center"
                sx={{
                  mt: { xs: 3, sm: 4, md: 5 },
                  mb: 2,
                }}
              >
                <Pagination
                  count={displayTotalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size={{ xs: "medium", sm: "large" } as never}
                  siblingCount={{ xs: 0, sm: 1 } as never}
                  boundaryCount={{ xs: 1, sm: 1 } as never}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      fontSize: { xs: "0.9rem", sm: "1rem" },
                      fontWeight: 500,
                      minWidth: { xs: "32px", sm: "36px" },
                      height: { xs: "32px", sm: "36px" },
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
