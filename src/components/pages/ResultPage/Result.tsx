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
import { useState, useMemo, useCallback, useEffect } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import SearchIcon from "@mui/icons-material/Search";
import { useLocation } from "react-router-dom";
import { useTranslation, Trans } from "react-i18next";
import useAuth from "../../../hooks/auth/useAuth";
import {
  getInitialAdmissionData,
  getFilteredAdmissionData,
  convertFilterCriteriaToParams,
} from "../../../services/studentAdmission/studentAdmissionService";
import { transformAdmissionData } from "../../../utils/transformAdmissionData";
import ResultFilter, { type FilterCriteria } from "./ResultFilter";
import type {
  AdmissionProgram,
  University,
} from "../../../type/interface/admissionTypes";
import type { FilterFieldsResponse } from "../../../services/studentAdmission/admissionFilterService";

const ITEMS_PER_PAGE = 5;

function extractPrograms(data: unknown): AdmissionProgram[] {
  if (Array.isArray(data)) {
    return data as AdmissionProgram[];
  }

  if (
    data &&
    typeof data === "object" &&
    "content" in data &&
    Array.isArray((data as { content: unknown }).content)
  ) {
    return (data as { content: AdmissionProgram[] }).content;
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
  const [allUniversities, setAllUniversities] = useState<University[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterLoading, setFilterLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [, setActiveFilters] = useState<FilterCriteria>({});
  const [filterFields, setFilterFields] = useState<FilterFieldsResponse | null>(
    null,
  );
  const [studentId, setStudentId] = useState<string | null>(null);
  const [isFiltered, setIsFiltered] = useState(false);

  // Initial data loading
  useEffect(() => {
    const fetchInitialData = async () => {
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

        // Check if we have data in navigation state
        if (state?.admissionData) {
          console.log(
            "[FinalResult] Using admission data from navigation state",
          );
          const programs = extractPrograms(state.admissionData);

          if (programs.length === 0) {
            throw new Error(t("finalResult.errors.noDataFound"));
          }

          const transformedData = transformAdmissionData(programs);
          setUniversities(transformedData);
          setAllUniversities(transformedData);
          setLoading(false);
          return;
        }

        console.log("[FinalResult] Fetching all admission data from API");

        // Fetch all data using the new service method
        const response = await getInitialAdmissionData(id, isAuthenticated);

        if (response.success && response.data) {
          const programs = extractPrograms(response.data);

          if (programs.length === 0) {
            throw new Error(t("finalResult.errors.noDataFound"));
          }

          const transformedData = transformAdmissionData(programs);
          setUniversities(transformedData);
          setAllUniversities(transformedData); // Store all data for client-side filtering
        } else {
          throw new Error(
            response.message ?? t("finalResult.errors.cannotLoadData"),
          );
        }
      } catch (err) {
        console.error("[FinalResult] Error fetching initial data:", err);
        setError(
          err instanceof Error
            ? err.message
            : t("finalResult.errors.cannotLoadDataRetry"),
        );
      } finally {
        setLoading(false);
      }
    };

    void fetchInitialData();
  }, [location.state, isAuthenticated, t]);

  // Handle filter application with API call
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
        // No filters selected, show all data
        console.log("[FinalResult] No filters selected, showing all data");
        setUniversities(allUniversities);
        setActiveFilters({});
        setIsFiltered(false);
        setCurrentPage(1);
        return;
      }

      if (!studentId) {
        console.error("[FinalResult] No student ID available for filtering");
        return;
      }

      // Execute async logic without making the callback itself async
      const applyFiltersAsync = async () => {
        try {
          setFilterLoading(true);
          setError(null);

          // Convert UI filter criteria to API parameters
          const apiParams = convertFilterCriteriaToParams(filters);

          console.log(
            "[FinalResult] Fetching filtered data with params:",
            apiParams,
          );

          // Fetch filtered data from API
          const response = await getFilteredAdmissionData(
            studentId,
            isAuthenticated,
            apiParams,
          );

          if (response.success && response.data) {
            const programs = extractPrograms(response.data);

            if (programs.length === 0) {
              // No results for these filters
              setUniversities([]);
              setActiveFilters(filters);
              setIsFiltered(true);
              setCurrentPage(1);
              return;
            }

            const transformedData = transformAdmissionData(programs);
            setUniversities(transformedData);
            setActiveFilters(filters);
            setIsFiltered(true);
            setCurrentPage(1);
          } else {
            throw new Error(
              response.message ?? t("finalResult.errors.filterFailed"),
            );
          }
        } catch (err) {
          console.error("[FinalResult] Error applying filters:", err);
          setError(
            err instanceof Error
              ? err.message
              : t("finalResult.errors.filterFailed"),
          );
        } finally {
          setFilterLoading(false);
        }
      };

      // Call the async function but don't await it
      void applyFiltersAsync();
    },
    [studentId, isAuthenticated, allUniversities, t],
  );

  // Handle filter clear
  const handleFilterClear = useCallback(() => {
    console.log("[FinalResult] Clearing filters");
    setActiveFilters({});
    setUniversities(allUniversities);
    setIsFiltered(false);
    setCurrentPage(1);
  }, [allUniversities]);

  // Client-side search filtering
  const filteredUniversities = useMemo(() => {
    if (!searchQuery.trim()) {
      return universities;
    }

    const query = searchQuery.toLowerCase();
    return universities.filter(
      (uni) =>
        uni.name.toLowerCase().includes(query) ||
        uni.shortName.toLowerCase().includes(query) ||
        uni.location.toLowerCase().includes(query) ||
        uni.courses.some((course) => course.name.toLowerCase().includes(query)),
    );
  }, [searchQuery, universities]);

  // Pagination
  const paginatedUniversities = useMemo(() => {
    const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
    const endIndex = startIndex + ITEMS_PER_PAGE;
    return filteredUniversities.slice(startIndex, endIndex);
  }, [filteredUniversities, currentPage]);

  const totalPages = Math.ceil(filteredUniversities.length / ITEMS_PER_PAGE);

  const handleSearchChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      setSearchQuery(event.target.value);
      setCurrentPage(1);
    },
    [],
  );

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

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

  if (error) {
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

      {/* Loading overlay for filter operations */}
      {filterLoading && (
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
            <Typography>{t("finalResult.applyingFilters")}</Typography>
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
      {universities.length > 0 && (
        <Box sx={{ mb: 2 }}>
          <Typography
            sx={{
              color: "white",
              fontSize: "1rem",
              textAlign: "center",
            }}
          >
            <Trans
              i18nKey="finalResult.foundResults"
              values={{ count: filteredUniversities.length }}
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
        </Box>
      )}

      {/* University Results */}
      <Box>
        {filteredUniversities.length === 0 ? (
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
                ? t("finalResult.noResultsForKeyword", { keyword: searchQuery })
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
          </Box>
        ) : (
          <>
            {paginatedUniversities.map((university) => (
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
                  {t("finalResult.pageInfo", {
                    current: currentPage,
                    total: totalPages,
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
