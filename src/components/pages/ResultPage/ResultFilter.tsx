import {
  Box,
  Typography,
  Chip,
  Button,
  Divider,
  Autocomplete,
  TextField,
  IconButton,
  Drawer,
  Fab,
} from "@mui/material";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import {
  useResultFilter,
  type FilterCriteria,
} from "../../../hooks/formPages/useResultFilter";
import type { FilterFieldsResponse } from "../../../services/studentAdmission/admissionFilterService";

interface ResultFilterProps {
  filterFields: FilterFieldsResponse | null;
  onFilterApply: (filters: FilterCriteria) => void;
  onFilterClear: () => void;
}

export default function ResultFilter({
  filterFields,
  onFilterApply,
  onFilterClear,
}: ResultFilterProps) {
  const { t } = useTranslation();

  const {
    selectedFilters,
    isOpen,
    hasActiveFilters,
    activeFilterCount,
    sortedTuitionFees,
    isFilterFieldsAvailable,
    handleFilterChange,
    handleTuitionFeeChange,
    handleApplyFilters,
    handleClearFilters,
    openDrawer,
    closeDrawer,
  } = useResultFilter({ filterFields, onFilterApply, onFilterClear });

  if (!isFilterFieldsAvailable || !filterFields?.fields) {
    return null;
  }

  const { fields } = filterFields;

  return (
    <>
      {/* Floating Action Button to Open Filter */}
      <Fab
        color="primary"
        aria-label="filter"
        onClick={openDrawer}
        sx={{
          position: "fixed",
          bottom: { xs: 20, sm: 100, md: 50 },
          right: { xs: 16, sm: 24, md: 50 },
          backgroundColor: "#A657AE",
          color: "white",
          zIndex: 1000,
          width: { xs: 56, sm: 56, md: 64 },
          height: { xs: 56, sm: 56, md: 64 },
          boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.15)",
          transition: "all 0.3s ease-in-out",
          "&:hover": {
            backgroundColor: "#8e4a96",
            transform: "scale(1.1)",
          },
          "&:active": {
            transform: "scale(0.95)",
          },
        }}
      >
        <FilterListIcon sx={{ fontSize: { xs: "1.5rem", sm: "1.75rem" } }} />
        {activeFilterCount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: { xs: -4, sm: -5 },
              right: { xs: -4, sm: -5 },
              backgroundColor: "#f44336",
              color: "white",
              fontFamily: "Montserrat",
              borderRadius: "50%",
              width: { xs: 20, sm: 24 },
              height: { xs: 20, sm: 24 },
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: { xs: "0.7rem", sm: "0.75rem" },
              fontWeight: "bold",
            }}
          >
            {activeFilterCount}
          </Box>
        )}
      </Fab>

      {/* Sliding Drawer Panel */}
      <Drawer
        anchor="right"
        open={isOpen}
        onClose={closeDrawer}
        sx={{
          "& .MuiDrawer-paper": {
            width: {
              xs: "100%",
              sm: 400,
              md: 450,
            },
            backgroundColor: "rgba(255, 255, 255, 0.98)",
            boxShadow: "-4px 0 12px rgba(0, 0, 0, 0.15)",
          },
        }}
      >
        <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
          {/* Header */}
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              p: { xs: 1.5, sm: 2 },
              backgroundColor: "rgba(166, 87, 174, 0.1)",
              borderBottom: "1px solid rgba(166, 87, 174, 0.2)",
            }}
          >
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 1, sm: 2 },
                flex: 1,
                minWidth: 0,
              }}
            >
              <FilterListIcon
                sx={{
                  color: "#A657AE",
                  fontSize: { xs: "1.5rem", sm: "1.6rem", md: "1.8rem" },
                  flexShrink: 0,
                }}
              />
              <Typography
                variant="h6"
                sx={{
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  fontWeight: 600,
                  fontSize: { xs: "1.1rem", sm: "1.2rem", md: "1.25rem" },
                  flexShrink: 0,
                }}
              >
                {t("finalResult.filter.title")}
              </Typography>

              {activeFilterCount > 0 && (
                <Chip
                  label={`${String(activeFilterCount)} ${t("finalResult.filter.active")}`}
                  size="small"
                  sx={{
                    backgroundColor: "#A657AE",
                    color: "white",
                    fontFamily: "Montserrat",
                    fontWeight: 500,
                    fontSize: { xs: "0.7rem", sm: "0.8125rem" },
                    height: { xs: "24px", sm: "28px" },
                    "& .MuiChip-label": {
                      px: { xs: 1, sm: 1.5 },
                    },
                  }}
                />
              )}
            </Box>
            <IconButton
              onClick={closeDrawer}
              sx={{
                color: "#A657AE",
                padding: { xs: "6px", sm: "8px" },
                flexShrink: 0,
                "&:hover": {
                  backgroundColor: "rgba(166, 87, 174, 0.1)",
                },
              }}
            >
              <CloseIcon sx={{ fontSize: { xs: "1.25rem", sm: "1.5rem" } }} />
            </IconButton>
          </Box>

          {/* Filter Content - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: { xs: 2, sm: 2.5, md: 3 },
              display: "flex",
              flexDirection: "column",
              gap: { xs: 2.5, sm: 3 },
              // Custom scrollbar styling
              "&::-webkit-scrollbar": {
                width: { xs: "6px", sm: "8px" },
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "rgba(253, 232, 255, 0.05)",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#A657AE",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "rgba(166, 87, 174, 0.7)",
                },
              },
              // Firefox scrollbar styling
              scrollbarWidth: "thin",
              scrollbarColor: "#A657AE rgba(253, 232, 255, 0.05)",
            }}
          >
            {/* University Name Filter */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 0.75, sm: 1 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.university")}
              </Typography>
              <Autocomplete
                multiple
                options={fields.uniName}
                value={selectedFilters.uniName ?? []}
                onChange={(_, newValue) => {
                  handleFilterChange("uniName", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("finalResult.filter.selectUniversity")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        minHeight: { xs: "44px", sm: "48px" },
                        "& fieldset": {
                          borderColor: "rgba(166, 87, 174, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A657AE",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A657AE",
                        },
                      },
                      "& input": {
                        color: "#A657AE",
                        fontFamily: "Montserrat",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      height: { xs: "24px", sm: "28px" },
                    },
                  },
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Montserrat",
                      },
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Major Name Filter */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 0.75, sm: 1 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.major")}
              </Typography>
              <Autocomplete
                multiple
                options={fields.majorName}
                value={selectedFilters.majorName ?? []}
                onChange={(_, newValue) => {
                  handleFilterChange("majorName", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("finalResult.filter.selectMajor")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        minHeight: { xs: "44px", sm: "48px" },
                        "& fieldset": {
                          borderColor: "rgba(166, 87, 174, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A657AE",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A657AE",
                        },
                      },
                      "& input": {
                        color: "#A657AE",
                        fontFamily: "Montserrat",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      height: { xs: "24px", sm: "28px" },
                    },
                  },
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Montserrat",
                      },
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Admission Type Name Filter */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 0.75, sm: 1 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.admissionType")}
              </Typography>
              <Autocomplete
                multiple
                options={fields.admissionTypeName}
                value={selectedFilters.admissionTypeName ?? []}
                onChange={(_, newValue) => {
                  handleFilterChange("admissionTypeName", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("finalResult.filter.selectAdmissionType")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        minHeight: { xs: "44px", sm: "48px" },
                        "& fieldset": {
                          borderColor: "rgba(166, 87, 174, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A657AE",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A657AE",
                        },
                      },
                      "& input": {
                        color: "#A657AE",
                        fontFamily: "Montserrat",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      height: { xs: "24px", sm: "28px" },
                    },
                  },
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Montserrat",
                      },
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Study Program Filter */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 0.75, sm: 1 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.studyProgram")}
              </Typography>
              <Autocomplete
                multiple
                options={fields.studyProgram}
                value={selectedFilters.studyProgram ?? []}
                onChange={(_, newValue) => {
                  handleFilterChange("studyProgram", newValue);
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("finalResult.filter.selectStudyProgram")}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        minHeight: { xs: "44px", sm: "48px" },
                        "& fieldset": {
                          borderColor: "rgba(166, 87, 174, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A657AE",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A657AE",
                        },
                      },
                      "& input": {
                        color: "#A657AE",
                        fontFamily: "Montserrat",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      height: { xs: "24px", sm: "28px" },
                    },
                  },
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Montserrat",
                      },
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            {/* Subject Combination Filter */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 0.75, sm: 1 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.subjectCombination")}
              </Typography>
              <Autocomplete
                multiple
                options={fields.subjectCombination}
                value={selectedFilters.subjectCombination ?? []}
                onChange={(_, newValue) => {
                  handleFilterChange("subjectCombination", newValue);
                }}
                getOptionLabel={(option) =>
                  option || t("finalResult.filter.none")
                }
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t(
                      "finalResult.filter.selectSubjectCombination",
                    )}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                        minHeight: { xs: "44px", sm: "48px" },
                        "& fieldset": {
                          borderColor: "rgba(166, 87, 174, 0.3)",
                        },
                        "&:hover fieldset": {
                          borderColor: "#A657AE",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: "#A657AE",
                        },
                      },
                      "& input": {
                        color: "#A657AE",
                        fontFamily: "Montserrat",
                        fontSize: { xs: "0.875rem", sm: "1rem" },
                      },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                      height: { xs: "24px", sm: "28px" },
                    },
                  },
                  paper: {
                    sx: {
                      "& .MuiAutocomplete-option": {
                        fontFamily: "Montserrat",
                      },
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            <Divider sx={{ my: { xs: 0.5, sm: 1 } }} />

            {/* Tuition Fee Range */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: { xs: 1.5, sm: 2 },
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontWeight: 500,
                  fontSize: { xs: "0.9rem", sm: "1rem" },
                }}
              >
                {t("finalResult.filter.tuitionFeeRange")}
              </Typography>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  gap: { xs: 1.5, sm: 2 },
                }}
              >
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 0.5,
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      display: "block",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  >
                    {t("finalResult.filter.minFee")}
                  </Typography>
                  <Autocomplete
                    options={sortedTuitionFees}
                    value={
                      selectedFilters.tuitionFeeRange?.min?.toString() ?? ""
                    }
                    onChange={(_, newValue) => {
                      handleTuitionFeeChange("min", newValue ?? "");
                    }}
                    getOptionLabel={(option) =>
                      option
                        ? `${parseInt(option, 10).toLocaleString()} VND`
                        : t("finalResult.filter.any")
                    }
                    slotProps={{
                      paper: {
                        sx: {
                          "& .MuiAutocomplete-option": {
                            fontFamily: "Montserrat",
                          },
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("finalResult.filter.any")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: { xs: "44px", sm: "48px" },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            "& fieldset": {
                              borderColor: "rgba(166, 87, 174, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#A657AE",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#A657AE",
                            },
                          },
                          "& input": {
                            color: "#A657AE",
                            fontFamily: "Montserrat",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                </Box>

                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 0.5,
                      color: "#A657AE",
                      fontFamily: "Montserrat",
                      display: "block",
                      fontSize: { xs: "0.75rem", sm: "0.8125rem" },
                    }}
                  >
                    {t("finalResult.filter.maxFee")}
                  </Typography>
                  <Autocomplete
                    options={sortedTuitionFees}
                    value={
                      selectedFilters.tuitionFeeRange?.max?.toString() ?? ""
                    }
                    onChange={(_, newValue) => {
                      handleTuitionFeeChange("max", newValue ?? "");
                    }}
                    getOptionLabel={(option) =>
                      option
                        ? `${parseInt(option, 10).toLocaleString()} VND`
                        : t("finalResult.filter.any")
                    }
                    slotProps={{
                      paper: {
                        sx: {
                          "& .MuiAutocomplete-option": {
                            fontFamily: "Montserrat",
                          },
                        },
                      },
                    }}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("finalResult.filter.any")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: { xs: "44px", sm: "48px" },
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                            "& fieldset": {
                              borderColor: "rgba(166, 87, 174, 0.3)",
                            },
                            "&:hover fieldset": {
                              borderColor: "#A657AE",
                            },
                            "&.Mui-focused fieldset": {
                              borderColor: "#A657AE",
                            },
                          },
                          "& input": {
                            color: "#A657AE",
                            fontFamily: "Montserrat",
                            fontSize: { xs: "0.875rem", sm: "1rem" },
                          },
                        }}
                      />
                    )}
                    sx={{ width: "100%" }}
                  />
                </Box>
              </Box>
            </Box>
          </Box>

          {/* Footer - Action Buttons */}
          <Box
            sx={{
              p: { xs: 1.5, sm: 2 },
              borderTop: "1px solid rgba(166, 87, 174, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              flexDirection: { xs: "column", sm: "row" },
              gap: { xs: 1.5, sm: 2 },
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={
                <ClearIcon sx={{ fontSize: { xs: "1.1rem", sm: "1.25rem" } }} />
              }
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              sx={{
                borderColor: "#A657AE",
                color: "#A657AE",
                fontFamily: "Montserrat",
                borderRadius: "20px",
                height: { xs: "44px", sm: "48px" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 500,
                "&:hover": {
                  borderColor: "#8e4a96",
                  backgroundColor: "rgba(166, 87, 174, 0.05)",
                },
                "&:disabled": {
                  borderColor: "#cccccc",
                  color: "#cccccc",
                },
              }}
            >
              {t("finalResult.filter.clear")}
            </Button>
            <Button
              fullWidth
              variant="contained"
              onClick={handleApplyFilters}
              sx={{
                backgroundColor: "#A657AE",
                color: "white",
                fontFamily: "Montserrat",
                borderRadius: "20px",
                height: { xs: "44px", sm: "48px" },
                fontSize: { xs: "0.9rem", sm: "1rem" },
                fontWeight: 500,
                "&:hover": {
                  backgroundColor: "#8e4a96",
                },
              }}
            >
              {t("finalResult.filter.apply")}
            </Button>
          </Box>
        </Box>
      </Drawer>
    </>
  );
}

export type { FilterCriteria };
