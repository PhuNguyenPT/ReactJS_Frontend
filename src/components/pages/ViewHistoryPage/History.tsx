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
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import VisibilityIcon from "@mui/icons-material/Visibility";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import { getStudentHistory } from "../../../services/student/studentHistoryService";
import type { StudentRecord } from "../../../services/student/studentHistoryService";
import APIError from "../../../utils/apiError";

const ITEMS_PER_PAGE = 6;

export default function History() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  useEffect(() => {
    const fetchStudentHistory = async () => {
      try {
        setLoading(true);
        setError(null);

        // Check if user is authenticated
        const accessToken = localStorage.getItem("accessToken");
        if (!accessToken) {
          setError(t("history.errors.notAuthenticated"));
          void navigate("/login");
          return;
        }

        // Fetch student history using the service
        const data = await getStudentHistory();

        setStudents(data.content);
        setTotalElements(data.totalElements);
      } catch (err) {
        console.error("[History] Error fetching student history:", err);

        if (err instanceof APIError) {
          // Handle specific API errors
          if (err.status === 401) {
            setError(t("history.errors.unauthorized"));
            // Redirect to login after a short delay
            setTimeout(() => {
              void navigate("/login");
            }, 2000);
          } else if (err.status === 403) {
            setError(t("history.errors.forbidden"));
          } else {
            setError(err.message);
          }
        } else {
          setError(t("history.errors.unknownError"));
        }
      } finally {
        setLoading(false);
      }
    };

    void fetchStudentHistory();
  }, [t, navigate]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleViewResult = (studentId: string) => {
    // Navigate to final result page with the student ID
    void navigate("/result", {
      state: {
        studentId: studentId,
        fromHistory: true,
      },
    });
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const formatTime = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getRelativeTime = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

    if (diffDays === 0) return t("history.today");
    if (diffDays === 1) return t("history.yesterday");
    if (diffDays < 7) return t("history.daysAgo", { count: diffDays });
    if (diffDays < 30)
      return t("history.weeksAgo", { count: Math.floor(diffDays / 7) });
    return t("history.monthsAgo", { count: Math.floor(diffDays / 30) });
  };

  // Paginate students (client-side pagination)
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Calculate total pages based on client-side data
  const displayTotalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

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
          <Typography
            sx={{
              color: "rgba(255, 255, 255, 0.8)",
              fontSize: "0.95rem",
              mt: 0.5,
            }}
          >
            {t("history.showingRecords", {
              showing: students.length,
              total: totalElements,
            })}
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
              onClick={() => void navigate("/")}
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
                          color: "#333",
                          fontSize: "1.25rem",
                          fontWeight: 500,
                        }}
                      >
                        {formatDate(student.createdAt)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#999",
                          fontSize: "1rem",
                        }}
                      >
                        {formatTime(student.createdAt)}
                      </Typography>
                    </Box>

                    {/* Modified Date */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        mb: 3,
                      }}
                    >
                      <AccessTimeIcon
                        sx={{ color: "#A657AE", fontSize: "2rem" }}
                      />
                      <Typography
                        sx={{
                          color: "#000000ff",
                          fontSize: "1.25rem",
                          fontWeight: 600,
                        }}
                      >
                        {t("history.lastModified")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#333",
                          fontSize: "1.25rem",
                          fontWeight: 500,
                        }}
                      >
                        {formatDate(student.updatedAt)}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#999",
                          fontSize: "1rem",
                        }}
                      >
                        {formatTime(student.updatedAt)}
                      </Typography>
                    </Box>

                    {/* Student ID (truncated) */}
                    <Typography
                      sx={{
                        color: "#999",
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
                        handleViewResult(student.id);
                      }}
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
                <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                  {t("history.pageInfo", {
                    current: currentPage,
                    total: displayTotalPages,
                  })}
                </Typography>
              </Stack>
            )}
          </>
        )}
      </Box>
    </Box>
  );
}
