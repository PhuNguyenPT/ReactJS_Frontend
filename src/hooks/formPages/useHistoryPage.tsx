import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStudentHistory } from "../../services/student/studentHistoryService";
import type { StudentRecord } from "../../services/student/studentHistoryService";
import { getFilterFieldsForStudent } from "../../services/studentAdmission/admissionFilterService";
import APIError from "../../utils/apiError";

const ITEMS_PER_PAGE = 6;

export function useHistoryPage() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  // State management
  const [students, setStudents] = useState<StudentRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [viewingResultLoading, setViewingResultLoading] = useState(false);

  // Fetch student history on mount
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

  // Handle page change
  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      setCurrentPage(page);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [],
  );

  // Handle viewing a student's results
  const handleViewResult = useCallback(
    async (studentId: string) => {
      try {
        setViewingResultLoading(true);

        // Since we're in History, user is authenticated
        const isAuthenticated = true;

        // Fetch filter fields for this student
        console.log("[History] Fetching filter fields for student:", studentId);
        const filterResponse = await getFilterFieldsForStudent(
          studentId,
          isAuthenticated,
        );

        // Navigate to final result page with both student ID and filter fields
        void navigate("/result", {
          state: {
            studentId: studentId,
            fromHistory: true,
            filterFields: filterResponse.success ? filterResponse.data : null,
          },
        });
      } catch (err) {
        console.error("[History] Error fetching filter fields:", err);

        // Even if filter fields fail, still navigate to results
        // The result page can work without filters
        void navigate("/result", {
          state: {
            studentId: studentId,
            fromHistory: true,
            filterFields: null,
          },
        });
      } finally {
        setViewingResultLoading(false);
      }
    },
    [navigate],
  );

  // Navigate to home/start prediction
  const handleStartPrediction = useCallback(() => {
    void navigate("/");
  }, [navigate]);

  // Format date string to readable format
  const formatDate = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  }, []);

  // Format time string to readable format
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
    });
  }, []);

  // Get relative time string (e.g., "Today", "Yesterday", "3 days ago")
  const getRelativeTime = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const now = new Date();

      // Reset times to midnight for date-only comparison
      const dateOnly = new Date(
        date.getFullYear(),
        date.getMonth(),
        date.getDate(),
      );
      const nowOnly = new Date(
        now.getFullYear(),
        now.getMonth(),
        now.getDate(),
      );

      // Calculate difference in days
      const diffMs = nowOnly.getTime() - dateOnly.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 0) return t("history.today");
      if (diffDays === 1) return t("history.yesterday");
      if (diffDays < 7) return t("history.daysAgo", { count: diffDays });
      if (diffDays < 30)
        return t("history.weeksAgo", { count: Math.floor(diffDays / 7) });
      return t("history.monthsAgo", { count: Math.floor(diffDays / 30) });
    },
    [t],
  );

  // Paginate students (client-side pagination)
  const paginatedStudents = students.slice(
    (currentPage - 1) * ITEMS_PER_PAGE,
    currentPage * ITEMS_PER_PAGE,
  );

  // Calculate total pages based on client-side data
  const displayTotalPages = Math.ceil(students.length / ITEMS_PER_PAGE);

  return {
    // State
    students,
    loading,
    error,
    currentPage,
    totalElements,
    viewingResultLoading,

    // Computed values
    paginatedStudents,
    displayTotalPages,

    // Handlers
    handlePageChange,
    handleViewResult,
    handleStartPrediction,

    // Formatters
    formatDate,
    formatTime,
    getRelativeTime,
  };
}
