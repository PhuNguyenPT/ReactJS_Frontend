import { useState, useCallback, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../auth/useAuth";
import {
  getPaginatedAdmissionData,
  convertFilterCriteriaToParams,
} from "../../services/studentAdmission/studentAdmissionService";
import { transformAdmissionData } from "../../utils/transformAdmissionData";
import type { FilterCriteria } from "../../components/pages/ResultPage/ResultFilter";
import type {
  AdmissionProgram,
  University,
  AdmissionApiResponse,
} from "../../type/interface/admissionTypes";
import type { FilterFieldsResponse } from "../../services/studentAdmission/admissionFilterService";

const ITEMS_PER_PAGE = import.meta.env.VITE_PAGINATION_DEFAULT_SIZE;
const INITIAL_DISPLAY_LIMIT = Number(import.meta.env.VITE_DISPLAY_LIMIT);

interface FinalResultState {
  studentId?: string;
  admissionData?: unknown;
  isGuest?: boolean;
  savedToAccount?: boolean;
  filterFields?: FilterFieldsResponse | null;
}

function extractPrograms(data: unknown): AdmissionProgram[] {
  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray((data as AdmissionApiResponse).content)
  ) {
    return (data as AdmissionApiResponse).content;
  }

  if (Array.isArray(data)) {
    return data as AdmissionProgram[];
  }

  return [];
}

export function useResultPage() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();

  // Data states
  const [universities, setUniversities] = useState<University[]>([]);
  const [rawProgramData, setRawProgramData] = useState<AdmissionProgram[]>([]);
  const [filterFields, setFilterFields] = useState<FilterFieldsResponse | null>(
    null,
  );
  const [studentId, setStudentId] = useState<string | null>(null);

  // Loading and error states
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);

  // Filter states
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({});
  const [isFiltered, setIsFiltered] = useState(false);

  // Expansion states for different sections
  const [expandedMajors, setExpandedMajors] = useState<Record<string, boolean>>(
    {},
  );
  const [expandedAdmissionTypes, setExpandedAdmissionTypes] = useState<
    Record<string, boolean>
  >({});
  const [expandedTuitionFees, setExpandedTuitionFees] = useState<
    Record<string, boolean>
  >({});

  // Visible count states - tracks how many items to show
  const [visibleMajorCount, setVisibleMajorCount] = useState<
    Record<string, number>
  >({});
  const [visibleAdmissionCount, setVisibleAdmissionCount] = useState<
    Record<string, number>
  >({});
  const [visibleTuitionCount, setVisibleTuitionCount] = useState<
    Record<string, number>
  >({});

  // Toggle expansion handlers
  const toggleMajorExpansion = useCallback(
    (universityId: string, majorCode: string) => {
      const key = `${universityId}-${majorCode}`;
      setExpandedMajors((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const toggleAdmissionTypeExpansion = useCallback(
    (universityId: string, admissionType: string) => {
      const key = `${universityId}-${admissionType}`;
      setExpandedAdmissionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  const toggleTuitionFeeExpansion = useCallback(
    (universityId: string, tuitionFee: string) => {
      const key = `${universityId}-${tuitionFee}`;
      setExpandedTuitionFees((prev) => ({ ...prev, [key]: !prev[key] }));
    },
    [],
  );

  // Load more handlers
  const loadMoreMajorPrograms = useCallback(
    (universityId: string, majorCode: string) => {
      const key = `${universityId}-${majorCode}`;
      setVisibleMajorCount((prev) => ({
        ...prev,
        [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  const loadMoreAdmissionPrograms = useCallback(
    (universityId: string, admissionType: string) => {
      const key = `${universityId}-${admissionType}`;
      setVisibleAdmissionCount((prev) => ({
        ...prev,
        [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  const loadMoreTuitionPrograms = useCallback(
    (universityId: string, tuitionFee: string) => {
      const key = `${universityId}-${tuitionFee}`;
      setVisibleTuitionCount((prev) => ({
        ...prev,
        [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  // Show less handlers
  const showLessMajorPrograms = useCallback(
    (universityId: string, majorCode: string) => {
      const key = `${universityId}-${majorCode}`;
      setVisibleMajorCount((prev) => ({
        ...prev,
        [key]: INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  const showLessAdmissionPrograms = useCallback(
    (universityId: string, admissionType: string) => {
      const key = `${universityId}-${admissionType}`;
      setVisibleAdmissionCount((prev) => ({
        ...prev,
        [key]: INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  const showLessTuitionPrograms = useCallback(
    (universityId: string, tuitionFee: string) => {
      const key = `${universityId}-${tuitionFee}`;
      setVisibleTuitionCount((prev) => ({
        ...prev,
        [key]: INITIAL_DISPLAY_LIMIT,
      }));
    },
    [],
  );

  // Get programs for a specific university from raw data
  const getUniversityPrograms = useCallback(
    (uniCode: string): AdmissionProgram[] => {
      return rawProgramData.filter((program) => program.uniCode === uniCode);
    },
    [rawProgramData],
  );

  // Get programs for a specific major
  const getMajorPrograms = useCallback(
    (uniCode: string, majorCode: string): AdmissionProgram[] => {
      return rawProgramData.filter(
        (program) =>
          program.uniCode === uniCode && program.majorCode === majorCode,
      );
    },
    [rawProgramData],
  );

  // Get programs for a specific admission type
  const getAdmissionTypePrograms = useCallback(
    (uniCode: string, admissionType: string): AdmissionProgram[] => {
      return rawProgramData.filter(
        (program) =>
          program.uniCode === uniCode &&
          program.admissionType === admissionType,
      );
    },
    [rawProgramData],
  );

  // Get programs for a specific tuition fee
  const getTuitionFeePrograms = useCallback(
    (uniCode: string, tuitionFee: string): AdmissionProgram[] => {
      return rawProgramData.filter(
        (program) =>
          program.uniCode === uniCode && program.tuitionFee === tuitionFee,
      );
    },
    [rawProgramData],
  );

  // Fetch page data
  const fetchPageData = useCallback(
    async (
      page: number,
      filters?: Partial<ReturnType<typeof convertFilterCriteriaToParams>>,
    ) => {
      if (!studentId) {
        console.error("[FinalResult] No student ID available");
        return;
      }

      try {
        setPageLoading(true);
        setError(null);

        const response = await getPaginatedAdmissionData(
          studentId,
          isAuthenticated,
          page.toString(),
          ITEMS_PER_PAGE,
          filters,
        );

        if (response.success && response.data) {
          const programs = extractPrograms(response.data);
          setRawProgramData(programs);

          const transformedData = transformAdmissionData(programs);
          setUniversities(transformedData);
          setTotalPages(response.totalPages ?? 1);
          setTotalElements(response.totalElements ?? 0);
          setCurrentPage(page);
        } else {
          throw new Error(
            response.message ?? t("finalResult.errors.cannotLoadData"),
          );
        }
      } catch (err) {
        console.error("[FinalResult] Error fetching page data:", err);
        setError(
          err instanceof Error
            ? err.message
            : t("finalResult.errors.cannotLoadDataRetry"),
        );
      } finally {
        setPageLoading(false);
      }
    },
    [studentId, isAuthenticated, t],
  );

  // Initialize data
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const state = location.state as FinalResultState | null;

        if (state?.filterFields) {
          console.log(
            "[FinalResult] Loading filter fields from navigation state",
          );
          setFilterFields(state.filterFields);
        }

        const id = state?.studentId ?? sessionStorage.getItem("studentId");
        if (!id) {
          throw new Error(t("finalResult.errors.studentIdNotFound"));
        }
        setStudentId(id);

        await fetchPageData(1);
      } catch (err) {
        console.error("[FinalResult] Error initializing:", err);
        setError(
          err instanceof Error
            ? err.message
            : t("finalResult.errors.cannotLoadDataRetry"),
        );
      } finally {
        setLoading(false);
      }
    };

    void initializeData();
  }, [fetchPageData, location.state, t]);

  // Handle page change
  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      console.log(`[FinalResult] Navigating to page ${page.toString()}`);

      const apiParams = isFiltered
        ? convertFilterCriteriaToParams(activeFilters)
        : undefined;

      void fetchPageData(page, apiParams);
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPageData, isFiltered, activeFilters],
  );

  // Handle filter apply
  const handleFilterApply = useCallback(
    (filters: FilterCriteria) => {
      console.log("[FinalResult] Applying filters:", filters);

      const hasActiveFilters = Object.keys(filters).some((key) => {
        const value = filters[key as keyof FilterCriteria];
        if (key === "tuitionFeeRange") {
          const feeRange = value as { min?: number; max?: number } | undefined;
          return feeRange?.min !== undefined || feeRange?.max !== undefined;
        }
        return Array.isArray(value) && value.length > 0;
      });

      if (!hasActiveFilters) {
        console.log("[FinalResult] No filters selected, fetching all data");
        setActiveFilters({});
        setIsFiltered(false);
        void fetchPageData(1);
        return;
      }

      const apiParams = convertFilterCriteriaToParams(filters);
      console.log(
        "[FinalResult] Fetching filtered data with params:",
        apiParams,
      );

      setActiveFilters(filters);
      setIsFiltered(true);
      void fetchPageData(1, apiParams);
    },
    [fetchPageData],
  );

  // Handle filter clear
  const handleFilterClear = useCallback(() => {
    console.log("[FinalResult] Clearing filters");
    setActiveFilters({});
    setIsFiltered(false);
    void fetchPageData(1);
  }, [fetchPageData]);

  return {
    // Data
    universities,
    rawProgramData,
    filterFields,

    // Loading and error states
    loading,
    pageLoading,
    error,

    // Pagination
    currentPage,
    totalPages,
    totalElements,

    // Filter states
    isFiltered,

    // Expansion states
    expandedMajors,
    expandedAdmissionTypes,
    expandedTuitionFees,

    // Visible counts
    visibleMajorCount,
    visibleAdmissionCount,
    visibleTuitionCount,

    // Constants
    INITIAL_DISPLAY_LIMIT,

    // Handlers
    toggleMajorExpansion,
    toggleAdmissionTypeExpansion,
    toggleTuitionFeeExpansion,
    loadMoreMajorPrograms,
    loadMoreAdmissionPrograms,
    loadMoreTuitionPrograms,
    showLessMajorPrograms,
    showLessAdmissionPrograms,
    showLessTuitionPrograms,

    // Data getters
    getUniversityPrograms,
    getMajorPrograms,
    getAdmissionTypePrograms,
    getTuitionFeePrograms,

    // API handlers
    handlePageChange,
    handleFilterApply,
    handleFilterClear,
  };
}
