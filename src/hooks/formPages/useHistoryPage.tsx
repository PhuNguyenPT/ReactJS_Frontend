import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { getStudentHistory } from "../../services/student/studentHistoryService";
import type { StudentRecord } from "../../services/student/studentHistoryService";
import { getFilterFieldsForStudent } from "../../services/studentAdmission/admissionFilterService";
import APIError from "../../utils/apiError";

const ITEMS_PER_PAGE = Number(import.meta.env.VITE_ITEMS_PER_PAGE);

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

  // Format date string with translated short month name in format: dd Month yy
  const formatDate = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const day = String(date.getDate()).padStart(2, "0");
      const monthIndex = date.getMonth(); // 0-11
      const year = String(date.getFullYear());

      // Get translated short month name
      const monthName = t(`common.months.${String(monthIndex)}`);

      return `${day} ${monthName} ${year}`;
    },
    [t],
  );

  // Format date with full translated month name (e.g., "15 January 2024" or "15 Tháng 1 2024")
  const formatDateWithMonth = useCallback(
    (dateString: string) => {
      const date = new Date(dateString);
      const day = date.getDate();
      const monthIndex = date.getMonth(); // 0-11
      const year = date.getFullYear();

      // Get translated month name
      const monthName = t(`common.months.${String(monthIndex)}`);

      return `${String(day)} ${monthName} ${String(year)}`;
    },
    [t],
  );

  // Format time string to 24-hour format
  const formatTime = useCallback((dateString: string) => {
    const date = new Date(dateString);
    const hours = String(date.getHours()).padStart(2, "0");
    const minutes = String(date.getMinutes()).padStart(2, "0");

    return `${hours}:${minutes}`;
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
    formatDateWithMonth,
    formatTime,
    getRelativeTime,
  };
}
