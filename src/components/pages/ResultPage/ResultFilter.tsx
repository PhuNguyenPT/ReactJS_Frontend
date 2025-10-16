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
import { useState, useEffect } from "react";
import FilterListIcon from "@mui/icons-material/FilterList";
import ClearIcon from "@mui/icons-material/Clear";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import type { FilterFieldsResponse } from "../../../services/studentAdmission/admissionFilterService";

interface ResultFilterProps {
  filterFields: FilterFieldsResponse | null;
  onFilterApply: (filters: FilterCriteria) => void;
  onFilterClear: () => void;
}

export interface FilterCriteria {
  uniName?: string[];
  majorName?: string[];
  admissionTypeName?: string[];
  tuitionFeeRange?: {
    min?: number;
    max?: number;
  };
  province?: string[];
  studyProgram?: string[];
  subjectCombination?: string[];
}

export default function ResultFilter({
  filterFields,
  onFilterApply,
  onFilterClear,
}: ResultFilterProps) {
  const { t } = useTranslation();
  const [selectedFilters, setSelectedFilters] = useState<FilterCriteria>({});
  const [isOpen, setIsOpen] = useState(false);

  // Reset filters when filter fields change
  useEffect(() => {
    setSelectedFilters({});
  }, [filterFields]);

  if (!filterFields?.fields) {
    return null;
  }

  const { fields } = filterFields;

  const handleFilterChange = (
    filterType: keyof FilterCriteria,
    value: string | string[],
  ) => {
    setSelectedFilters((prev) => ({
      ...prev,
      [filterType]: Array.isArray(value) ? value : [value],
    }));
  };

  const handleTuitionFeeChange = (type: "min" | "max", value: string) => {
    setSelectedFilters((prev) => ({
      ...prev,
      tuitionFeeRange: {
        ...prev.tuitionFeeRange,
        [type]: value ? parseInt(value, 10) : undefined,
      },
    }));
  };

  const handleApplyFilters = () => {
    onFilterApply(selectedFilters);
    setIsOpen(false);
  };

  const handleClearFilters = () => {
    setSelectedFilters({});
    onFilterClear();
  };

  const hasActiveFilters = Object.keys(selectedFilters).some((key) => {
    const value = selectedFilters[key as keyof FilterCriteria];
    if (key === "tuitionFeeRange") {
      const feeRange = value as { min?: number; max?: number } | undefined;
      return feeRange?.min !== undefined || feeRange?.max !== undefined;
    }
    return Array.isArray(value) && value.length > 0;
  });

  const activeFilterCount = Object.entries(selectedFilters).reduce(
    (count, [key, value]) => {
      if (key === "tuitionFeeRange") {
        const feeRange = value as { min?: number; max?: number } | undefined;
        return count + (feeRange?.min || feeRange?.max ? 1 : 0);
      }
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    },
    0,
  );

  // Sort tuition fees numerically
  const sortedTuitionFees = [...fields.tuitionFee].sort(
    (a, b) => parseInt(a, 10) - parseInt(b, 10),
  );

  return (
    <>
      {/* Floating Action Button to Open Filter */}
      <Fab
        color="primary"
        aria-label="filter"
        onClick={() => {
          setIsOpen(true);
        }}
        sx={{
          position: "fixed",
          bottom: 100,
          right: 30,
          backgroundColor: "#A657AE",
          color: "white",
          zIndex: 1000,
          "&:hover": {
            backgroundColor: "#8e4a96",
          },
        }}
      >
        <FilterListIcon />
        {activeFilterCount > 0 && (
          <Box
            sx={{
              position: "absolute",
              top: -5,
              right: -5,
              backgroundColor: "#f44336",
              color: "white",
              borderRadius: "50%",
              width: 24,
              height: 24,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "0.75rem",
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
        onClose={() => {
          setIsOpen(false);
        }}
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
              p: 2,
              backgroundColor: "rgba(166, 87, 174, 0.1)",
              borderBottom: "1px solid rgba(166, 87, 174, 0.2)",
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
              <FilterListIcon sx={{ color: "#A657AE", fontSize: "1.8rem" }} />
              <Typography
                variant="h6"
                sx={{
                  color: "#A657AE",
                  fontWeight: 600,
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
                    fontWeight: 500,
                  }}
                />
              )}
            </Box>
            <IconButton
              onClick={() => {
                setIsOpen(false);
              }}
              sx={{
                color: "#A657AE",
                "&:hover": {
                  backgroundColor: "rgba(166, 87, 174, 0.1)",
                },
              }}
            >
              <CloseIcon />
            </IconButton>
          </Box>

          {/* Filter Content - Scrollable */}
          <Box
            sx={{
              flex: 1,
              overflowY: "auto",
              p: 3,
              display: "flex",
              flexDirection: "column",
              gap: 3,
              // Custom scrollbar styling
              "&::-webkit-scrollbar": {
                width: "8px",
              },
              "&::-webkit-scrollbar-track": {
                backgroundColor: "#A657AE",
                borderRadius: "10px",
              },
              "&::-webkit-scrollbar-thumb": {
                backgroundColor: "#A657AE",
                borderRadius: "10px",
                "&:hover": {
                  backgroundColor: "rgba(166, 87, 174, 0.5)",
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
                  mb: 1,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
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
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
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
                  mb: 1,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
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
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
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
                  mb: 1,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
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
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
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
                  mb: 1,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
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
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
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
                  mb: 1,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
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
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
                slotProps={{
                  chip: {
                    size: "small",
                    sx: {
                      backgroundColor: "rgba(166, 87, 174, 0.15)",
                      color: "#A657AE",
                    },
                  },
                }}
                filterSelectedOptions
                sx={{ width: "100%" }}
              />
            </Box>

            <Divider sx={{ my: 1 }} />

            {/* Tuition Fee Range */}
            <Box>
              <Typography
                variant="body1"
                sx={{
                  mb: 2,
                  color: "#A657AE",
                  textAlign: "left",
                  fontWeight: 500,
                }}
              >
                {t("finalResult.filter.tuitionFeeRange")}
              </Typography>
              <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                <Box>
                  <Typography
                    variant="caption"
                    sx={{
                      mb: 0.5,
                      color: "#A657AE",
                      display: "block",
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("finalResult.filter.any")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: "40px",
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
                          "& input": { color: "#A657AE" },
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
                      display: "block",
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
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={t("finalResult.filter.any")}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: "40px",
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
                          "& input": { color: "#A657AE" },
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
              p: 2,
              borderTop: "1px solid rgba(166, 87, 174, 0.2)",
              backgroundColor: "rgba(255, 255, 255, 0.95)",
              display: "flex",
              gap: 2,
            }}
          >
            <Button
              fullWidth
              variant="outlined"
              startIcon={<ClearIcon />}
              onClick={handleClearFilters}
              disabled={!hasActiveFilters}
              sx={{
                borderColor: "#A657AE",
                color: "#A657AE",
                borderRadius: "20px",
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
                borderRadius: "20px",
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
