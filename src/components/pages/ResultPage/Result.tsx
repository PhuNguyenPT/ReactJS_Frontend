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
} from "@mui/material";
import { useState, useCallback, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
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

const ITEMS_PER_PAGE = 20; // Changed to match API default

function extractPrograms(data: unknown): AdmissionProgram[] {
  // Check if data is AdmissionApiResponse (has content property)
  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray((data as AdmissionApiResponse).content)
  ) {
    return (data as AdmissionApiResponse).content;
  }

  // Check if data is already an array of programs
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

  // Function to fetch data for a specific page
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
          page,
          ITEMS_PER_PAGE,
          filters,
        );

        if (response.success && response.data) {
          const programs = extractPrograms(response.data);
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

  // Initial data loading
  useEffect(() => {
    const initializeData = async () => {
      try {
        setLoading(true);
        setError(null);

        const state = location.state as FinalResultState | null;

        // Load filter fields from navigation state
        if (state?.filterFields) {
          console.log(
            "[FinalResult] Loading filter fields from navigation state",
          );
          setFilterFields(state.filterFields);
        }

        // Get student ID
        const id = state?.studentId ?? sessionStorage.getItem("studentId");
        if (!id) {
          throw new Error(t("finalResult.errors.studentIdNotFound"));
        }
        setStudentId(id);

        // Fetch first page of data
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
  }, [fetchPageData, location.state, t]); // Remove fetchPageData from dependencies to avoid loop

  // Handle page change
  const handlePageChange = useCallback(
    (_event: React.ChangeEvent<unknown>, page: number) => {
      console.log(`[FinalResult] Navigating to page ${String(page)}`);

      // Convert active filters to API params if any filters are applied
      const apiParams = isFiltered
        ? convertFilterCriteriaToParams(activeFilters)
        : undefined;

      void fetchPageData(page, apiParams);

      // Scroll to top when changing pages
      window.scrollTo({ top: 0, behavior: "smooth" });
    },
    [fetchPageData, isFiltered, activeFilters],
  );

  // Handle filter application
  const handleFilterApply = useCallback(
    (filters: FilterCriteria) => {
      console.log("[FinalResult] Applying filters:", filters);

      // Check if any filters are actually selected
      const hasActiveFilters = Object.keys(filters).some((key) => {
        const value = filters[key as keyof FilterCriteria];
        if (key === "tuitionFeeRange") {
          const feeRange = value as { min?: number; max?: number } | undefined;
          return feeRange?.min !== undefined || feeRange?.max !== undefined;
        }
        return Array.isArray(value) && value.length > 0;
      });

      if (!hasActiveFilters) {
        // No filters selected, fetch unfiltered data
        console.log("[FinalResult] No filters selected, fetching all data");
        setActiveFilters({});
        setIsFiltered(false);
        void fetchPageData(1); // Reset to first page
        return;
      }

      // Convert UI filter criteria to API parameters
      const apiParams = convertFilterCriteriaToParams(filters);

      console.log(
        "[FinalResult] Fetching filtered data with params:",
        apiParams,
      );

      setActiveFilters(filters);
      setIsFiltered(true);
      void fetchPageData(1, apiParams); // Always start from page 1 when applying filters
    },
    [fetchPageData],
  );

  // Handle filter clear
  const handleFilterClear = useCallback(() => {
    console.log("[FinalResult] Clearing filters");
    setActiveFilters({});
    setIsFiltered(false);
    void fetchPageData(1); // Reset to first page without filters
  }, [fetchPageData]);

  // Client-side search filtering (applied to current page data)
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
      {/* Filter Component */}
      {filterFields && (
        <ResultFilter
          filterFields={filterFields}
          onFilterApply={handleFilterApply}
          onFilterClear={handleFilterClear}
        />
      )}

      {/* Loading overlay for page/filter operations */}
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

      {/* Search Bar */}
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

      {/* Results count and filter status */}
      {!pageLoading && totalElements > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: "white",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            <Trans
              i18nKey="finalResult.totalResults"
              values={{
                total: totalElements,
                showing: filteredUniversities.length,
                page: currentPage,
              }}
              components={{ strong: <strong /> }}
            />
          </Typography>
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

      {/* University Results */}
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
            {filteredUniversities.map((university) => (
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
                  {/* Courses Section */}
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
                      {t("finalResult.coursesCount", {
                        count: university.courses.length,
                      })}
                    </Typography>
                    <Box
                      sx={{ display: "flex", flexDirection: "column", gap: 2 }}
                    >
                      {university.courses.map((course) => (
                        <Box
                          key={`${university.id}-${course.code}`}
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            backgroundColor: "rgba(166, 87, 174, 0.05)",
                            padding: "12px 20px",
                            borderRadius: "8px",
                            border: "1px solid rgba(166, 87, 174, 0.2)",
                            flexWrap: "wrap",
                            gap: 2,
                          }}
                        >
                          <Box sx={{ flex: 1, minWidth: "200px" }}>
                            <Typography
                              sx={{
                                color: "#333",
                                fontWeight: 500,
                                fontSize: "1rem",
                                textAlign: "left",
                              }}
                            >
                              {course.name}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#666",
                                fontSize: "0.85rem",
                                mt: 0.5,
                                textAlign: "left",
                              }}
                            >
                              {t("finalResult.courseCode")}: {course.code}
                            </Typography>
                            <Typography
                              sx={{
                                color: "#666",
                                fontSize: "0.85rem",
                                mt: 0.5,
                                textAlign: "left",
                              }}
                            >
                              {t("finalResult.subjectCombination")}:{" "}
                              {course.subjectCombination}
                            </Typography>
                          </Box>
                          <Chip
                            label={course.tuitionFee}
                            sx={{
                              backgroundColor: "#A657AE",
                              color: "white",
                              fontWeight: 600,
                            }}
                          />
                        </Box>
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Application Method */}
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
                        flexWrap: "wrap",
                        gap: 1,
                        justifyContent: "center",
                      }}
                    >
                      {university.applicationMethods.map((method) => (
                        <Chip
                          key={`${university.id}-${method}`}
                          label={method}
                          sx={{
                            backgroundColor: "rgba(166, 87, 174, 0.15)",
                            color: "#A657AE",
                            fontWeight: 500,
                            fontSize: "0.9rem",
                          }}
                        />
                      ))}
                    </Box>
                  </Box>

                  <Divider sx={{ my: 3 }} />

                  {/* Tuition Fee Range */}
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
                      }}
                    >
                      {university.tuitionFeeRange}
                    </Typography>
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
            ))}

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
