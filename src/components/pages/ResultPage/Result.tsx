import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  InputAdornment,
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
import SearchIcon from "@mui/icons-material/Search";
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
  const [searchQuery, setSearchQuery] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [filteredUniversities, setFilteredUniversities] = useState<
    University[]
  >([]);
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

  // Show more states for limiting initial display
  const [showAllMajorPrograms, setShowAllMajorPrograms] = useState<
    Record<string, boolean>
  >({});
  const [showAllAdmissionPrograms, setShowAllAdmissionPrograms] = useState<
    Record<string, boolean>
  >({});
  const [showAllTuitionPrograms, setShowAllTuitionPrograms] = useState<
    Record<string, boolean>
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

  // Toggle show more handlers
  const toggleShowAllMajorPrograms = (
    universityId: string,
    majorCode: string,
  ) => {
    const key = `${universityId}-${majorCode}`;
    setShowAllMajorPrograms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowAllAdmissionPrograms = (
    universityId: string,
    admissionType: string,
  ) => {
    const key = `${universityId}-${admissionType}`;
    setShowAllAdmissionPrograms((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const toggleShowAllTuitionPrograms = (
    universityId: string,
    tuitionFee: string,
  ) => {
    const key = `${universityId}-${tuitionFee}`;
    setShowAllTuitionPrograms((prev) => ({ ...prev, [key]: !prev[key] }));
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

  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredUniversities(universities);
    } else {
      const query = searchQuery.toLowerCase();
      const filtered = universities.filter(
        (uni) =>
          uni.name.toLowerCase().includes(query) ||
          uni.shortName.toLowerCase().includes(query) ||
          uni.location.toLowerCase().includes(query) ||
          uni.courses.some((course) =>
            course.name.toLowerCase().includes(query),
          ),
      );
      setFilteredUniversities(filtered);
    }
  }, [searchQuery, universities]);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
    },
    [],
  );

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

      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          variant="outlined"
          placeholder={t("finalResult.searchPlaceholder")}
          value={searchQuery}
          onChange={handleSearchChange}
          slotProps={{
            input: {
              endAdornment: (
                <InputAdornment position="end">
                  <SearchIcon sx={{ color: "#A657AE", fontSize: "1.8rem" }} />
                </InputAdornment>
              ),
            },
          }}
          sx={{
            backgroundColor: "white",
            borderRadius: "30px",
            "& .MuiOutlinedInput-root": {
              borderRadius: "30px",
              "& fieldset": {
                borderColor: "rgba(166, 87, 174, 0.3)",
              },
              "&:hover fieldset": {
                borderColor: "#A657AE",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#A657AE",
                borderWidth: "2px",
              },
            },
            "& input": {
              padding: "16px 20px",
              fontSize: "1rem",
            },
          }}
        />
      </Box>

      {!pageLoading && totalElements > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: "white",
              fontSize: "1rem",
              textAlign: "center",
            }}
          ></Typography>
          {isFiltered && (
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9rem",
                textAlign: "center",
                mt: 1,
              }}
            >
              {t("finalResult.filteredResults")}
            </Typography>
          )}
          {searchQuery && (
            <Typography
              sx={{
                color: "white",
                fontSize: "0.9rem",
                textAlign: "center",
                mt: 1,
              }}
            >
              {t("finalResult.searchingInCurrentPage", { query: searchQuery })}
            </Typography>
          )}
        </Box>
      )}

      <Box>
        {!pageLoading && filteredUniversities.length === 0 ? (
          <Box
            sx={{
              textAlign: "center",
              py: 6,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
            }}
          >
            <Typography variant="h6" sx={{ color: "#A657AE", fontWeight: 500 }}>
              {searchQuery
                ? t("finalResult.noResultsForKeywordInPage", {
                    keyword: searchQuery,
                    page: currentPage,
                  })
                : isFiltered
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
            {searchQuery && (
              <Typography
                sx={{
                  color: "#666",
                  mt: 2,
                  fontSize: "0.95rem",
                }}
              >
                {t("finalResult.tryDifferentPageOrClearSearch")}
              </Typography>
            )}
          </Box>
        ) : (
          <>
            {filteredUniversities.map((university) => {
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
                        Các ngành học ({uniqueMajors.length} ngành)
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
                          <strong>Tổ hợp môn:</strong>{" "}
                          {uniqueSubjectCombinations.join(", ")}
                        </Typography>
                        <Typography sx={{ fontSize: "0.9rem", color: "#666" }}>
                          <strong>Chương trình đào tạo:</strong>{" "}
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
                          const showAll =
                            showAllMajorPrograms[expandKey] || false;
                          const displayedPrograms = showAll
                            ? majorPrograms
                            : majorPrograms.slice(0, INITIAL_DISPLAY_LIMIT);
                          const hasMore =
                            majorPrograms.length > INITIAL_DISPLAY_LIMIT;

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
                                    Mã ngành: {course.code}
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
                                  {displayedPrograms.map((program) => (
                                    <Box
                                      key={`${program.id}-${program.subjectCombination}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          "1px solid rgba(0, 0, 0, 0.1)",
                                        "&:last-child": {
                                          borderBottom: hasMore
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                        },
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Tổ hợp:</strong>{" "}
                                        {program.subjectCombination} |{" "}
                                        <strong>Chương trình:</strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Học phí:</strong>{" "}
                                        {formatTuitionFee(program.tuitionFee)} |{" "}
                                        <strong>Phương thức:</strong>{" "}
                                        {program.admissionTypeName}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {hasMore && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                      }}
                                    >
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleShowAllMajorPrograms(
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
                                        {showAll
                                          ? `Ẩn bớt (${String(majorPrograms.length - INITIAL_DISPLAY_LIMIT)})`
                                          : `Xem thêm (${String(majorPrograms.length - INITIAL_DISPLAY_LIMIT)})`}{" "}
                                      </Button>
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
                          const showAll =
                            showAllAdmissionPrograms[expandKey] || false;
                          const displayedPrograms = showAll
                            ? admissionPrograms
                            : admissionPrograms.slice(0, INITIAL_DISPLAY_LIMIT);
                          const hasMore =
                            admissionPrograms.length > INITIAL_DISPLAY_LIMIT;

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
                                  {displayedPrograms.map((program) => (
                                    <Box
                                      key={`${program.id}-${program.majorCode}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          "1px solid rgba(0, 0, 0, 0.1)",
                                        "&:last-child": {
                                          borderBottom: hasMore
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                        },
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Ngành:</strong>{" "}
                                        {program.majorName} ({program.majorCode}
                                        ) | <strong>Tổ hợp:</strong>{" "}
                                        {program.subjectCombination}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Học phí:</strong>{" "}
                                        {formatTuitionFee(program.tuitionFee)} |{" "}
                                        <strong>Chương trình:</strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {hasMore && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                      }}
                                    >
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleShowAllAdmissionPrograms(
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
                                        {showAll
                                          ? `Ẩn bớt (${String(admissionPrograms.length - INITIAL_DISPLAY_LIMIT)})`
                                          : `Xem thêm (${String(admissionPrograms.length - INITIAL_DISPLAY_LIMIT)})`}
                                      </Button>
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
                        {t("finalResult.tuitionFee")}
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
                          const showAll =
                            showAllTuitionPrograms[expandKey] || false;
                          const displayedPrograms = showAll
                            ? feePrograms
                            : feePrograms.slice(0, INITIAL_DISPLAY_LIMIT);
                          const hasMore =
                            feePrograms.length > INITIAL_DISPLAY_LIMIT;

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
                                  {displayedPrograms.map((program) => (
                                    <Box
                                      key={`${program.id}-${program.admissionCode}`}
                                      sx={{
                                        mb: 2,
                                        pb: 2,
                                        borderBottom:
                                          "1px solid rgba(0, 0, 0, 0.1)",
                                        "&:last-child": {
                                          borderBottom: hasMore
                                            ? "1px solid rgba(0, 0, 0, 0.1)"
                                            : "none",
                                        },
                                      }}
                                    >
                                      <Typography
                                        sx={{
                                          fontSize: "0.9rem",
                                          color: "#333",
                                          mb: 0.5,
                                        }}
                                      >
                                        <strong>Ngành:</strong>{" "}
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
                                        <strong>Tổ hợp:</strong>{" "}
                                        {program.subjectCombination} |{" "}
                                        <strong>Chương trình:</strong>{" "}
                                        {program.studyProgram}
                                      </Typography>
                                      <Typography
                                        sx={{
                                          fontSize: "0.85rem",
                                          color: "#666",
                                        }}
                                      >
                                        <strong>Phương thức:</strong>{" "}
                                        {program.admissionTypeName}
                                      </Typography>
                                    </Box>
                                  ))}

                                  {hasMore && (
                                    <Box
                                      sx={{
                                        display: "flex",
                                        justifyContent: "center",
                                        mt: 2,
                                      }}
                                    >
                                      <Button
                                        onClick={(e) => {
                                          e.stopPropagation();
                                          toggleShowAllTuitionPrograms(
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
                                        {showAll
                                          ? `Ẩn bớt (${String(feePrograms.length - INITIAL_DISPLAY_LIMIT)})`
                                          : `Xem thêm (${String(feePrograms.length - INITIAL_DISPLAY_LIMIT)})`}
                                      </Button>
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
