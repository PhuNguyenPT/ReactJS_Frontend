import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
  Divider,
  CircularProgress,
  Alert,
  Pagination,
  Stack,
  Collapse,
  IconButton,
  Button,
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import useAuth from "../../../hooks/auth/useAuth";
import {
  getPaginatedAdmissionData,
  convertFilterCriteriaToParams,
} from "../../../services/studentAdmission/studentAdmissionService";
import { transformAdmissionData } from "../../../utils/transformAdmissionData";
import ResultFilter, { type FilterCriteria } from "./ResultFilter";
import type {
  AdmissionProgram,
  University,
  AdmissionApiResponse,
} from "../../../type/interface/admissionTypes";
import type { FilterFieldsResponse } from "../../../services/studentAdmission/admissionFilterService";

const ITEMS_PER_PAGE = import.meta.env.VITE_PAGINATION_DEFAULT_SIZE;
const INITIAL_DISPLAY_LIMIT = Number(import.meta.env.VITE_DISPLAY_LIMIT);

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

interface FinalResultState {
  studentId?: string;
  admissionData?: unknown;
  isGuest?: boolean;
  savedToAccount?: boolean;
  filterFields?: FilterFieldsResponse | null;
}

// Helper function to format tuition fee
function formatTuitionFee(fee: string): string {
  const numFee = parseFloat(fee);
  if (isNaN(numFee)) return fee;
  return `${(numFee / 1000000).toFixed(1)} triệu VNĐ`;
}

export default function FinalResult() {
  const { t } = useTranslation();
  const { isAuthenticated } = useAuth();
  const location = useLocation();
  const [universities, setUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [pageLoading, setPageLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [activeFilters, setActiveFilters] = useState<FilterCriteria>({});
  const [filterFields, setFilterFields] = useState<FilterFieldsResponse | null>(
    null,
  );
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Store raw API data for detailed views
  const [rawProgramData, setRawProgramData] = useState<AdmissionProgram[]>([]);

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

  // Visible count states - tracks how many items to show (default: INITIAL_DISPLAY_LIMIT)
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
  const toggleMajorExpansion = (universityId: string, majorCode: string) => {
    const key = `${universityId}-${majorCode}`;
    setExpandedMajors((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleAdmissionTypeExpansion = (
    universityId: string,
    admissionType: string,
  ) => {
    const key = `${universityId}-${admissionType}`;
    setExpandedAdmissionTypes((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleTuitionFeeExpansion = (
    universityId: string,
    tuitionFee: string,
  ) => {
    const key = `${universityId}-${tuitionFee}`;
    setExpandedTuitionFees((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  // Load more handlers - shows 10 more items at a time
  const loadMoreMajorPrograms = (universityId: string, majorCode: string) => {
    const key = `${universityId}-${majorCode}`;
    setVisibleMajorCount((prev) => ({
      ...prev,
      [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
    }));
  };

  const loadMoreAdmissionPrograms = (
    universityId: string,
    admissionType: string,
  ) => {
    const key = `${universityId}-${admissionType}`;
    setVisibleAdmissionCount((prev) => ({
      ...prev,
      [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
    }));
  };

  const loadMoreTuitionPrograms = (
    universityId: string,
    tuitionFee: string,
  ) => {
    const key = `${universityId}-${tuitionFee}`;
    setVisibleTuitionCount((prev) => ({
      ...prev,
      [key]: (prev[key] || INITIAL_DISPLAY_LIMIT) + INITIAL_DISPLAY_LIMIT,
    }));
  };

  // Show less handlers - resets to initial display limit
  const showLessMajorPrograms = (universityId: string, majorCode: string) => {
    const key = `${universityId}-${majorCode}`;
    setVisibleMajorCount((prev) => ({
      ...prev,
      [key]: INITIAL_DISPLAY_LIMIT,
    }));
  };

  const showLessAdmissionPrograms = (
    universityId: string,
    admissionType: string,
  ) => {
    const key = `${universityId}-${admissionType}`;
    setVisibleAdmissionCount((prev) => ({
      ...prev,
      [key]: INITIAL_DISPLAY_LIMIT,
    }));
  };

  const showLessTuitionPrograms = (
    universityId: string,
    tuitionFee: string,
  ) => {
    const key = `${universityId}-${tuitionFee}`;
    setVisibleTuitionCount((prev) => ({
      ...prev,
      [key]: INITIAL_DISPLAY_LIMIT,
    }));
  };

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

          // Store raw program data
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

  const handleFilterClear = useCallback(() => {
    console.log("[FinalResult] Clearing filters");
    setActiveFilters({});
    setIsFiltered(false);
    void fetchPageData(1);
  }, [fetchPageData]);

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
          {t("finalResult.loading")}
        </Typography>
      </Box>
    );
  }

  if (error && !pageLoading) {
    return (
      <Box sx={{ maxWidth: "800px", margin: "0 auto", px: 2 }}>
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          <Typography variant="h6" sx={{ mb: 1 }}>
            {t("finalResult.errorOccurred")}
          </Typography>
          <Typography>{error}</Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      className="final-result"
      sx={{
        width: "100%",
        maxWidth: "1100px",
        margin: "0 auto",
        px: 2,
        py: 3,
      }}
    >
      {filterFields && (
        <ResultFilter
          filterFields={filterFields}
          onFilterApply={handleFilterApply}
          onFilterClear={handleFilterClear}
        />
      )}

      {pageLoading && (
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
            <Typography>
              {isFiltered
                ? t("finalResult.applyingFilters")
                : t("finalResult.loadingPage", { page: currentPage })}
            </Typography>
          </Box>
        </Box>
      )}

      {!pageLoading && totalElements > 0 && (
        <Box sx={{ mb: 3 }}>
          {isFiltered && (
            <Typography
              sx={{
                color: "white",
                fontSize: "1.5rem",
                textAlign: "center",
                mt: 1,
              }}
            >
              {t("finalResult.filteredResults")}
            </Typography>
          )}
        </Box>
      )}

      <Box>
        {!pageLoading && universities.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#A657AE", fontWeight: 500 }}>
              {isFiltered
                ? t("finalResult.noResultsForFilters")
                : t("finalResult.noAdmissionData")}
            </Typography>
            {isFiltered && (
              <Typography
                sx={{
                  color: "#666",
                  mt: 2,
                  fontSize: "0.95rem",
                }}
              >
                {t("finalResult.tryDifferentFilters")}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            {universities.map((university) => {
              const uniPrograms = getUniversityPrograms(university.shortName);

              // Get unique values for summary
              const uniqueMajors = Array.from(
                new Set(uniPrograms.map((p) => p.majorCode)),
              );
              const uniqueSubjectCombinations = Array.from(
                new Set(uniPrograms.map((p) => p.subjectCombination)),
              );
              const uniqueStudyPrograms = Array.from(
                new Set(uniPrograms.map((p) => p.studyProgram)),
              );

              return (
                <Accordion
                  key={university.id}
                  sx={{
                    backgroundColor: "rgba(255, 255, 255, 0.95)",
                    borderRadius: "12px !important",
                    mb: 3,
                    "&:before": { display: "none" },
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#A657AE" }} />}
                    sx={{
                      backgroundColor: "rgba(166, 87, 174, 0.1)",
                      borderRadius: "12px",
                      minHeight: "70px",
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        justifyContent: "space-between",
                        my: 1.5,
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        flex: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#A657AE",
                          fontWeight: 600,
                          fontSize: "1.2rem",
                        }}
                      >
                        {university.name} ({university.shortName})
                      </Typography>
                      <Typography
                        sx={{
                          color: "#666",
                          fontSize: "0.9rem",
                        }}
                      >
                        {university.location} • {university.uniType}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails sx={{ px: 4, py: 3 }}>
                    {/* Majors Section with Expandable Details */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontWeight: 600,
                          mb: 2,
                          fontSize: "1.1rem",
                        }}
                      >
                        {t("finalResult.majors", {
                          count: uniqueMajors.length,
                        })}
                      </Typography>

                      {/* Summary Information */}
                      <Box
                        sx={{
                          mb: 2,
                          p: 2,
                          backgroundColor: "rgba(166, 87, 174, 0.05)",
                          borderRadius: "8px",
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          sx={{ fontSize: "0.9rem", color: "#666", mb: 1 }}
                        >
                          <strong>
                            {t("finalResult.subjectCombination")}:
                          </strong>{" "}
                          {uniqueSubjectCombinations.join(", ")}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                          <strong>{t("finalResult.studyProgram")}:</strong>{" "}
                          {uniqueStudyPrograms.join(", ")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 2,
                        }}
                      >
                        {university.courses.map((course) => {
                          const majorPrograms = getMajorPrograms(
                            university.shortName,
                            course.code,
                          );
                          const expandKey = `${university.id}-${course.code}`;
                          const isExpanded = expandedMajors[expandKey] || false;

                          // Get current visible count or use default
                          const currentVisibleCount =
                            visibleMajorCount[expandKey] ||
                            INITIAL_DISPLAY_LIMIT;
                          const displayedPrograms = majorPrograms.slice(
                            0,
                            currentVisibleCount,
                          );
                          const remainingCount =
                            majorPrograms.length - currentVisibleCount;
                          const hasMore = remainingCount > 0;
                          const canShowLess =
                            currentVisibleCount > INITIAL_DISPLAY_LIMIT;

                          return (
                            <Box key={`${university.id}-${course.code}`}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  backgroundColor: "rgba(166, 87, 174, 0.05)",
                                  padding: "12px 20px",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(166, 87, 174, 0.2)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(166, 87, 174, 0.1)",
                                  },
                                }}
                                onClick={() => {
                                  toggleMajorExpansion(
                                    university.id,
                                    course.code,
                                  );
                                }}
                              >
                                <Box sx={{ flex: 1, textAlign: "center" }}>
                                  <Typography
                                    sx={{
                                      color: "#333",
                                      fontWeight: 500,
                                      fontSize: "1rem",
                                    }}
                                  >
                                    {course.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#666",
                                      fontSize: "0.85rem",
                                      mt: 0.5,
                                    }}
                                  >
                                    {t("finalResult.majorCode")}: {course.code}
                                  </Typography>
                                </Box>
                                <Box
                                  sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 1,
                                  }}
                                >
                                  <IconButton size="small">
                                    {isExpanded ? (
                                      <KeyboardArrowUpIcon />
                                    ) : (
                                      <KeyboardArrowDownIcon />
                                    )}
                                  </IconButton>
                                </Box>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: 2,
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {displayedPrograms.map((program, index) => (
                                    <Box
                                      key={`${program.id}-${program.subjectCombination}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          index <
                                            displayedPrograms.length - 1 ||
                                          hasMore ||
                                          canShowLess
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.combination")}:
                                        </strong>{" "}
                                        {program.subjectCombination} |{" "}
                                        <strong>
                                          {t("finalResult.program")}:
                                        </strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.tuitionFee")}:
                                        </strong>{" "}
                                        {formatTuitionFee(program.tuitionFee)} |{" "}
                                        <strong>
                                          {t("finalResult.method")}:
                                        </strong>{" "}
                                        {program.admissionTypeName}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {(hasMore || canShowLess) && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 2,
                                        mt: 2,
                                      }}
                                    >
                                      {hasMore && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            loadMoreMajorPrograms(
                                              university.id,
                                              course.code,
                                            );
                                          }}
                                          sx={{
                                            color: "#A657AE",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
                                            count: Math.min(
                                              remainingCount,
                                              INITIAL_DISPLAY_LIMIT,
                                            ),
                                            remaining: remainingCount,
                                          })}
                                        </Button>
                                      )}
                                      {canShowLess && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showLessMajorPrograms(
                                              university.id,
                                              course.code,
                                            );
                                          }}
                                          sx={{
                                            color: "#666",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(0, 0, 0, 0.05)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.showLess")}
                                        </Button>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Application Method Section with Expandable Details */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontWeight: 600,
                          mb: 2,
                          fontSize: "1.1rem",
                          textAlign: "center",
                        }}
                      >
                        {t("finalResult.applicationMethod")}
                      </Typography>
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {Array.from(
                          new Set(uniPrograms.map((p) => p.admissionType)),
                        ).map((admissionType) => {
                          const admissionPrograms = getAdmissionTypePrograms(
                            university.shortName,
                            admissionType,
                          );
                          const expandKey = `${university.id}-${admissionType}`;
                          const isExpanded =
                            expandedAdmissionTypes[expandKey] || false;

                          // Get current visible count or use default
                          const currentVisibleCount =
                            visibleAdmissionCount[expandKey] ||
                            INITIAL_DISPLAY_LIMIT;
                          const displayedPrograms = admissionPrograms.slice(
                            0,
                            currentVisibleCount,
                          );
                          const remainingCount =
                            admissionPrograms.length - currentVisibleCount;
                          const hasMore = remainingCount > 0;
                          const canShowLess =
                            currentVisibleCount > INITIAL_DISPLAY_LIMIT;

                          return (
                            <Box key={`${university.id}-${admissionType}`}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  backgroundColor: "rgba(166, 87, 174, 0.05)",
                                  padding: "12px 20px",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(166, 87, 174, 0.2)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(166, 87, 174, 0.1)",
                                  },
                                }}
                                onClick={() => {
                                  toggleAdmissionTypeExpansion(
                                    university.id,
                                    admissionType,
                                  );
                                }}
                              >
                                <Typography
                                  sx={{
                                    color: "#A657AE",
                                    fontWeight: 500,
                                    fontSize: "0.9rem",
                                    flex: 1,
                                  }}
                                >
                                  {admissionPrograms[0]?.admissionTypeName ||
                                    admissionType}
                                </Typography>
                                <IconButton size="small">
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: 2,
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {displayedPrograms.map((program, index) => (
                                    <Box
                                      key={`${program.id}-${program.majorCode}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          index <
                                            displayedPrograms.length - 1 ||
                                          hasMore ||
                                          canShowLess
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.major")}:
                                        </strong>{" "}
                                        {program.majorName} ({program.majorCode}
                                        ) |{" "}
                                        <strong>
                                          {t("finalResult.combination")}:
                                        </strong>{" "}
                                        {program.subjectCombination}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.tuitionFee")}:
                                        </strong>{" "}
                                        {formatTuitionFee(program.tuitionFee)} |{" "}
                                        <strong>
                                          {t("finalResult.program")}:
                                        </strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {(hasMore || canShowLess) && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 2,
                                        mt: 2,
                                      }}
                                    >
                                      {hasMore && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            loadMoreAdmissionPrograms(
                                              university.id,
                                              admissionType,
                                            );
                                          }}
                                          sx={{
                                            color: "#A657AE",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
                                            count: Math.min(
                                              remainingCount,
                                              INITIAL_DISPLAY_LIMIT,
                                            ),
                                            remaining: remainingCount,
                                          })}
                                        </Button>
                                      )}
                                      {canShowLess && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showLessAdmissionPrograms(
                                              university.id,
                                              admissionType,
                                            );
                                          }}
                                          sx={{
                                            color: "#666",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(0, 0, 0, 0.05)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.showLess")}
                                        </Button>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Tuition Fee Range Section with Expandable Details */}
                    <Box sx={{ mb: 3 }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: "1.1rem",
                        }}
                      >
                        {t("finalResult.tuitionFeeRange")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#333",
                          fontSize: "1rem",
                          mb: 2,
                        }}
                      >
                        {university.tuitionFeeRange}
                      </Typography>

                      {/* Individual Tuition Fees with Details */}
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: 1,
                        }}
                      >
                        {Array.from(
                          new Set(uniPrograms.map((p) => p.tuitionFee)),
                        ).map((fee) => {
                          const feePrograms = getTuitionFeePrograms(
                            university.shortName,
                            fee,
                          );
                          const expandKey = `${university.id}-${fee}`;
                          const isExpanded =
                            expandedTuitionFees[expandKey] || false;

                          // Get current visible count or use default
                          const currentVisibleCount =
                            visibleTuitionCount[expandKey] ||
                            INITIAL_DISPLAY_LIMIT;
                          const displayedPrograms = feePrograms.slice(
                            0,
                            currentVisibleCount,
                          );
                          const remainingCount =
                            feePrograms.length - currentVisibleCount;
                          const hasMore = remainingCount > 0;
                          const canShowLess =
                            currentVisibleCount > INITIAL_DISPLAY_LIMIT;

                          return (
                            <Box key={`${university.id}-${fee}`}>
                              <Box
                                sx={{
                                  display: "flex",
                                  justifyContent: "center",
                                  position: "relative",
                                  alignItems: "center",
                                  backgroundColor: "rgba(166, 87, 174, 0.05)",
                                  padding: "12px 20px",
                                  borderRadius: "8px",
                                  border: "1px solid rgba(166, 87, 174, 0.2)",
                                  cursor: "pointer",
                                  "&:hover": {
                                    backgroundColor: "rgba(166, 87, 174, 0.1)",
                                  },
                                }}
                                onClick={() => {
                                  toggleTuitionFeeExpansion(university.id, fee);
                                }}
                              >
                                <Chip
                                  label={formatTuitionFee(fee)}
                                  sx={{
                                    backgroundColor: "#A657AE",
                                    color: "white",
                                    fontWeight: 600,
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{ position: "absolute", right: "20px" }}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon />
                                  ) : (
                                    <KeyboardArrowDownIcon />
                                  )}
                                </IconButton>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: 2,
                                    backgroundColor: "rgba(0, 0, 0, 0.02)",
                                    borderRadius: "8px",
                                  }}
                                >
                                  {displayedPrograms.map((program, index) => (
                                    <Box
                                      key={`${program.id}-${program.admissionCode}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          index <
                                            displayedPrograms.length - 1 ||
                                          hasMore ||
                                          canShowLess
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.major")}:
                                        </strong>{" "}
                                        {program.majorName} ({program.majorCode}
                                        )
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.combination")}:
                                        </strong>{" "}
                                        {program.subjectCombination} |{" "}
                                        <strong>
                                          {t("finalResult.program")}:
                                        </strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                        }}
                                      >
                                        <strong>
                                          {t("finalResult.method")}:
                                        </strong>{" "}
                                        {program.admissionTypeName}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {(hasMore || canShowLess) && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        gap: 2,
                                        mt: 2,
                                      }}
                                    >
                                      {hasMore && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            loadMoreTuitionPrograms(
                                              university.id,
                                              fee,
                                            );
                                          }}
                                          sx={{
                                            color: "#A657AE",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
                                            count: Math.min(
                                              remainingCount,
                                              INITIAL_DISPLAY_LIMIT,
                                            ),
                                            remaining: remainingCount,
                                          })}
                                        </Button>
                                      )}
                                      {canShowLess && (
                                        <Button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            showLessTuitionPrograms(
                                              university.id,
                                              fee,
                                            );
                                          }}
                                          sx={{
                                            color: "#666",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(0, 0, 0, 0.05)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.showLess")}
                                        </Button>
                                      )}
                                    </Box>
                                  )}
                                </Box>
                              </Collapse>
                            </Box>
                          );
                        })}
                      </Box>
                    </Box>

                    <Divider sx={{ my: 3 }} />

                    {/* Website Link */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: "1.1rem",
                        }}
                      >
                        {t("finalResult.website")}
                      </Typography>
                      <Typography
                        component="a"
                        href={university.webLink}
                        target="_blank"
                        rel="noopener noreferrer"
                        sx={{
                          color: "#A657AE",
                          fontSize: "1rem",
                          textDecoration: "none",
                          "&:hover": {
                            textDecoration: "underline",
                          },
                        }}
                      >
                        {university.webLink}
                      </Typography>
                    </Box>
                  </AccordionDetails>
                </Accordion>
              );
            })}

            {/* Pagination */}
            {totalPages > 1 && (
              <Stack spacing={2} alignItems="center" sx={{ mt: 4, mb: 2 }}>
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  disabled={pageLoading}
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
                      "&.Mui-disabled": {
                        opacity: 0.5,
                      },
                    },
                  }}
                />
                <Typography sx={{ color: "white", fontSize: "0.9rem" }}>
                  {t("finalResult.pageInfo", {
                    current: currentPage,
                    total: totalPages,
                    totalItems: totalElements,
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
