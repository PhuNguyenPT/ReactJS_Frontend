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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import KeyboardArrowUpIcon from "@mui/icons-material/KeyboardArrowUp";
import { useTranslation } from "react-i18next";
import ResultFilter from "./ResultFilter";
import { useResultPage } from "../../../hooks/formPages/useResultPage";
import { formatTuitionFee } from "../../../utils/resultUtils";

export default function FinalResult() {
  const { t } = useTranslation();
  const {
    // Data
    universities,
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
  } = useResultPage();

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
          px: { xs: 2, sm: 3 },
        }}
      >
        <CircularProgress
          sx={{
            color: "#A657AE",
            width: { xs: "50px !important", sm: "60px !important" },
            height: { xs: "50px !important", sm: "60px !important" },
          }}
        />
        <Typography
          sx={{
            color: "white",
            fontFamily: "Montserrat",
            fontSize: { xs: "1rem", sm: "1.1rem" },
            textAlign: "center",
          }}
        >
          {t("finalResult.loading")}
        </Typography>
      </Box>
    );
  }

  if (error && !pageLoading) {
    return (
      <Box
        sx={{
          maxWidth: "800px",
          margin: "0 auto",
          px: { xs: 2, sm: 3 },
        }}
      >
        <Alert severity="error" sx={{ borderRadius: "12px" }}>
          <Typography
            variant="h6"
            sx={{
              mb: 1,
              fontFamily: "Montserrat",
              fontSize: { xs: "1rem", sm: "1.25rem" },
            }}
          >
            {t("finalResult.errorOccurred")}
          </Typography>
          <Typography
            sx={{
              fontFamily: "Montserrat",
              fontSize: { xs: "0.875rem", sm: "1rem" },
            }}
          >
            {error}
          </Typography>
        </Alert>
      </Box>
    );
  }

  return (
    <Box
      className="final-result"
      sx={{
        width: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        px: { xs: 1.5, sm: 2, md: 3 },
        py: { xs: 2, sm: 3 },
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
              maxWidth: "90%",
            }}
          >
            <CircularProgress sx={{ color: "#A657AE" }} />
            <Typography
              sx={{
                fontFamily: "Montserrat",
                fontSize: { xs: "0.875rem", sm: "1rem" },
                textAlign: "center",
              }}
            >
              {isFiltered
                ? t("finalResult.applyingFilters")
                : t("finalResult.loadingPage", { page: currentPage })}
            </Typography>
          </Box>
        </Box>
      )}

      {!pageLoading && totalElements > 0 && (
        <Box sx={{ mb: { xs: 2, sm: 3 } }}>
          {isFiltered && (
            <Typography
              sx={{
                color: "white",
                fontFamily: "Montserrat",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                textAlign: "center",
                mt: 1,
                px: 2,
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
              py: { xs: 4, sm: 6 },
              px: { xs: 2, sm: 3 },
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              borderRadius: "16px",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#A657AE",
                fontFamily: "Montserrat",
                fontWeight: 500,
                fontSize: { xs: "1rem", sm: "1.25rem" },
              }}
            >
              {isFiltered
                ? t("finalResult.noResultsForFilters")
                : t("finalResult.noAdmissionData")}
            </Typography>
            {isFiltered && (
              <Typography
                sx={{
                  color: "#666",
                  fontFamily: "Montserrat",
                  mt: 2,
                  fontSize: { xs: "0.875rem", sm: "0.95rem" },
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
                    borderRadius: "15px !important",
                    mb: { xs: 2, sm: 3 },
                    "&:before": { display: "none" },
                    boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                  }}
                >
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon sx={{ color: "#A657AE" }} />}
                    sx={{
                      backgroundColor: "rgba(166, 87, 174, 0.1)",
                      borderRadius: "12px",
                      minHeight: { xs: "auto", sm: "70px" },
                      px: { xs: 2, sm: 3 },
                      py: { xs: 1.5, sm: 2 },
                      "& .MuiAccordionSummary-content": {
                        alignItems: "center",
                        justifyContent: "space-between",
                        my: { xs: 1, sm: 1.5 },
                      },
                    }}
                  >
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        gap: 0.5,
                        flex: 1,
                        pr: 1,
                      }}
                    >
                      <Typography
                        variant="h6"
                        sx={{
                          color: "#A657AE",
                          fontFamily: "Montserrat",
                          fontWeight: 600,
                          fontSize: { xs: "1rem", sm: "1.1rem", md: "1.2rem" },
                          lineHeight: 1,
                        }}
                      >
                        {university.name} ({university.shortName})
                      </Typography>
                      <Typography
                        sx={{
                          color: "#666",
                          fontFamily: "Montserrat",
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.85rem",
                            md: "0.9rem",
                          },
                        }}
                      >
                        {university.location} • {university.uniType}
                      </Typography>
                    </Box>
                  </AccordionSummary>

                  <AccordionDetails
                    sx={{
                      px: { xs: 2, sm: 3, md: 4 },
                      py: { xs: 2, sm: 2.5, md: 3 },
                    }}
                  >
                    {/* Majors Section */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontFamily: "Montserrat",
                          fontWeight: 600,
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
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
                          p: { xs: 1.5, sm: 2 },
                          backgroundColor: "rgba(166, 87, 174, 0.05)",
                          borderRadius: "8px",
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                            fontFamily: "Montserrat",
                            color: "#666",
                            mb: 1,
                            wordBreak: "break-word",
                          }}
                        >
                          <strong>
                            {t("finalResult.subjectCombination")}:
                          </strong>{" "}
                          {uniqueSubjectCombinations.join(", ")}
                        </Typography>
                        <Typography
                          sx={{
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                            fontFamily: "Montserrat",
                            color: "#666",
                            wordBreak: "break-word",
                          }}
                        >
                          <strong>{t("finalResult.studyProgram")}:</strong>{" "}
                          {uniqueStudyPrograms.join(", ")}
                        </Typography>
                      </Box>

                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: { xs: 1.5, sm: 2 },
                        }}
                      >
                        {university.courses.map((course) => {
                          const majorPrograms = getMajorPrograms(
                            university.shortName,
                            course.code,
                          );
                          const expandKey = `${university.id}-${course.code}`;
                          const isExpanded = expandedMajors[expandKey] || false;

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
                                  padding: {
                                    xs: "10px 12px",
                                    sm: "12px 16px",
                                    md: "12px 20px",
                                  },
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
                                <Box
                                  sx={{ flex: 1, textAlign: "center", pr: 1 }}
                                >
                                  <Typography
                                    sx={{
                                      color: "#333",
                                      fontFamily: "Montserrat",
                                      fontWeight: 500,
                                      fontSize: {
                                        xs: "0.9rem",
                                        sm: "0.95rem",
                                        md: "1rem",
                                      },
                                      lineHeight: 1.3,
                                    }}
                                  >
                                    {course.name}
                                  </Typography>
                                  <Typography
                                    sx={{
                                      color: "#666",
                                      fontFamily: "Montserrat",
                                      fontSize: {
                                        xs: "0.75rem",
                                        sm: "0.8rem",
                                        md: "0.85rem",
                                      },
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
                                  <IconButton
                                    size="small"
                                    sx={{
                                      padding: { xs: "4px", sm: "8px" },
                                    }}
                                  >
                                    {isExpanded ? (
                                      <KeyboardArrowUpIcon
                                        sx={{
                                          fontSize: {
                                            xs: "1.2rem",
                                            sm: "1.5rem",
                                          },
                                        }}
                                      />
                                    ) : (
                                      <KeyboardArrowDownIcon
                                        sx={{
                                          fontSize: {
                                            xs: "1.2rem",
                                            sm: "1.5rem",
                                          },
                                        }}
                                      />
                                    )}
                                  </IconButton>
                                </Box>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: { xs: 1.5, sm: 2 },
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                        flexDirection: {
                                          xs: "column",
                                          sm: "row",
                                        },
                                        justifyContent: "center",
                                        gap: { xs: 1, sm: 2 },
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
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

                    <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                    {/* Application Method Section */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontFamily: "Montserrat",
                          fontWeight: 600,
                          mb: { xs: 1.5, sm: 2 },
                          fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
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
                                  padding: {
                                    xs: "10px 12px",
                                    sm: "12px 16px",
                                    md: "12px 20px",
                                  },
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
                                    fontFamily: "Montserrat",
                                    fontSize: { xs: "0.85rem", sm: "0.9rem" },
                                    flex: 1,
                                    pr: 1,
                                    wordBreak: "break-word",
                                  }}
                                >
                                  {admissionPrograms[0]?.admissionTypeName ||
                                    admissionType}
                                </Typography>
                                <IconButton
                                  size="small"
                                  sx={{
                                    padding: { xs: "4px", sm: "8px" },
                                  }}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon
                                      sx={{
                                        fontSize: {
                                          xs: "1.2rem",
                                          sm: "1.5rem",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      sx={{
                                        fontSize: {
                                          xs: "1.2rem",
                                          sm: "1.5rem",
                                        },
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: { xs: 1.5, sm: 2 },
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                        flexDirection: {
                                          xs: "column",
                                          sm: "row",
                                        },
                                        justifyContent: "center",
                                        gap: { xs: 1, sm: 2 },
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
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

                    <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                    {/* Tuition Fee Range Section */}
                    <Box sx={{ mb: { xs: 2, sm: 3 } }}>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontFamily: "Montserrat",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
                        }}
                      >
                        {t("finalResult.tuitionFeeRange")}
                      </Typography>
                      <Typography
                        sx={{
                          color: "#333",
                          fontFamily: "Montserrat",
                          fontSize: { xs: "0.9rem", sm: "0.95rem", md: "1rem" },
                          mb: 2,
                          wordBreak: "break-word",
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
                                  padding: {
                                    xs: "10px 12px",
                                    sm: "12px 16px",
                                    md: "12px 20px",
                                  },
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
                                    fontFamily: "Montserrat",
                                    fontSize: { xs: "0.8rem", sm: "0.85rem" },
                                    height: { xs: "28px", sm: "32px" },
                                  }}
                                />
                                <IconButton
                                  size="small"
                                  sx={{
                                    position: "absolute",
                                    right: {
                                      xs: "12px",
                                      sm: "16px",
                                      md: "20px",
                                    },
                                    padding: { xs: "4px", sm: "8px" },
                                  }}
                                >
                                  {isExpanded ? (
                                    <KeyboardArrowUpIcon
                                      sx={{
                                        fontSize: {
                                          xs: "1.2rem",
                                          sm: "1.5rem",
                                        },
                                      }}
                                    />
                                  ) : (
                                    <KeyboardArrowDownIcon
                                      sx={{
                                        fontSize: {
                                          xs: "1.2rem",
                                          sm: "1.5rem",
                                        },
                                      }}
                                    />
                                  )}
                                </IconButton>
                              </Box>

                              <Collapse in={isExpanded}>
                                <Box
                                  sx={{
                                    mt: 1,
                                    p: { xs: 1.5, sm: 2 },
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          mb: 0.5,
                                          wordBreak: "break-word",
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
                                          fontSize: {
                                            xs: "0.8rem",
                                            sm: "0.85rem",
                                            md: "0.9rem",
                                          },
                                          fontFamily: "Montserrat",
                                          color: "#333",
                                          wordBreak: "break-word",
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
                                        flexDirection: {
                                          xs: "column",
                                          sm: "row",
                                        },
                                        justifyContent: "center",
                                        gap: { xs: 1, sm: 2 },
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
                                            "&:hover": {
                                              backgroundColor:
                                                "rgba(166, 87, 174, 0.1)",
                                            },
                                          }}
                                        >
                                          {t("finalResult.loadMore", {
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
                                            fontFamily: "Montserrat",
                                            textTransform: "none",
                                            fontWeight: 500,
                                            fontSize: {
                                              xs: "0.85rem",
                                              sm: "0.9rem",
                                            },
                                            minHeight: "40px",
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

                    <Divider sx={{ my: { xs: 2, sm: 3 } }} />

                    {/* Website Link */}
                    <Box>
                      <Typography
                        variant="subtitle1"
                        sx={{
                          color: "#A657AE",
                          fontFamily: "Montserrat",
                          fontWeight: 600,
                          mb: 1,
                          fontSize: { xs: "1rem", sm: "1.05rem", md: "1.1rem" },
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
                          fontFamily: "Montserrat",
                          fontSize: { xs: "0.85rem", sm: "0.9rem", md: "1rem" },
                          textDecoration: "none",
                          wordBreak: "break-all",
                          display: "block",
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
              <Stack
                spacing={2}
                alignItems="center"
                sx={{
                  mt: { xs: 3, sm: 4 },
                  mb: 2,
                  px: { xs: 1, sm: 0 },
                }}
              >
                <Pagination
                  count={totalPages}
                  page={currentPage}
                  onChange={handlePageChange}
                  color="primary"
                  size="large"
                  disabled={pageLoading}
                  siblingCount={1}
                  boundaryCount={1}
                  sx={{
                    "& .MuiPaginationItem-root": {
                      color: "white",
                      fontSize: { xs: "0.875rem", sm: "0.95rem", md: "1rem" },
                      fontWeight: 500,
                      fontFamily: "Montserrat",
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
                      "&.Mui-disabled": {
                        opacity: 0.5,
                      },
                    },
                  }}
                />
                <Typography
                  sx={{
                    color: "white",
                    fontFamily: "Montserrat",
                    fontSize: { xs: "0.8rem", sm: "0.85rem", md: "0.9rem" },
                    textAlign: "center",
                  }}
                >
                  {t("finalResult.pageInfo", {
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
