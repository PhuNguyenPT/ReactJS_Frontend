import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import {
  useSeventhForm,
  type TranslatedOption,
} from "../../../hooks/formPages/useSeventhForm";

interface SeventhFormProps {
  shouldValidate?: boolean;
}

export default function SeventhForm({
  shouldValidate = false,
}: SeventhFormProps) {
  const {
    grades,
    translatedConductOptions,
    translatedAcademicPerformanceOptions,
    handleConductChange,
    handleAcademicPerformanceChange,
    getValidationState,
    getGradeValues,
    placeholders,
    errors,
  } = useSeventhForm({ shouldValidate });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {grades.map((grade) => {
        const validation = getValidationState(grade.key);
        const gradeValues = getGradeValues(grade.key);

        return (
          <Box
            key={grade.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: {
                xs: 0.75,
                sm: 0.875,
                md: 1,
              },
              width: "100%",
            }}
          >
            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{
                mb: {
                  xs: 0.75,
                  sm: 0.875,
                  md: 1,
                },
                color: "#A657AE",
                textAlign: "left",
                fontSize: {
                  xs: "0.95rem",
                  sm: "1rem",
                  md: "1rem",
                },
              }}
            >
              {grade.label}
            </Typography>

            {/* Dropdowns */}
            <Box
              sx={{
                display: "flex",
                gap: {
                  xs: 1,
                  sm: 2,
                  md: 3,
                },
                flexWrap: {
                  xs: "wrap",
                  sm: "nowrap",
                },
                width: "72%",
              }}
            >
              {/* Conduct (Kết quả rèn luyện) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 auto",
                  },
                  minWidth: {
                    xs: "100%",
                    sm: "200px",
                  },
                }}
              >
                <Autocomplete
                  options={translatedConductOptions}
                  value={gradeValues.conduct}
                  onChange={(_, newValue) => {
                    handleConductChange(grade.key, newValue);
                  }}
                  getOptionLabel={(option: TranslatedOption) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.key === value.key
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={placeholders.practiceResults}
                      error={validation.conduct}
                      sx={{
                        width: "100%",
                        maxWidth: {
                          xs: "100%",
                          sm: 210,
                          md: 230,
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: {
                            xs: "12px",
                            sm: "15px",
                            md: "17px",
                          },
                          height: {
                            xs: "36px",
                            sm: "38px",
                            md: "40px",
                          },
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.85rem",
                            md: "0.9rem",
                          },
                          "& fieldset": {
                            borderColor: validation.conduct
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                          "&:hover fieldset": {
                            borderColor: validation.conduct
                              ? "#d32f2f"
                              : "#8B4A8F",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: validation.conduct
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                        },
                        "& input": {
                          color: "#A657AE",
                          padding: {
                            xs: "8px 12px",
                            sm: "9px 14px",
                            md: "10px 16px",
                          },
                        },
                      }}
                    />
                  )}
                />
                {validation.conduct && (
                  <FormHelperText
                    error
                    sx={{
                      ml: 0,
                      mr: 0,
                      mt: 0.5,
                      textAlign: "left",
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.75rem",
                        md: "0.75rem",
                      },
                    }}
                  >
                    {errors.conductError}
                  </FormHelperText>
                )}
              </Box>

              {/* Academic Performance (Học lực) */}
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  flex: {
                    xs: "1 1 100%",
                    sm: "1 1 auto",
                  },
                  minWidth: {
                    xs: "100%",
                    sm: "200px",
                  },
                }}
              >
                <Autocomplete
                  options={translatedAcademicPerformanceOptions}
                  value={gradeValues.academicPerformance}
                  onChange={(_, newValue) => {
                    handleAcademicPerformanceChange(grade.key, newValue);
                  }}
                  getOptionLabel={(option: TranslatedOption) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.key === value.key
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={placeholders.academicScore}
                      error={validation.academicPerformance}
                      sx={{
                        width: "100%",
                        maxWidth: {
                          xs: "100%",
                          sm: 220,
                          md: 240,
                        },
                        "& .MuiOutlinedInput-root": {
                          borderRadius: {
                            xs: "12px",
                            sm: "15px",
                            md: "17px",
                          },
                          height: {
                            xs: "36px",
                            sm: "38px",
                            md: "40px",
                          },
                          fontSize: {
                            xs: "0.8rem",
                            sm: "0.85rem",
                            md: "0.9rem",
                          },
                          "& fieldset": {
                            borderColor: validation.academicPerformance
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                          "&:hover fieldset": {
                            borderColor: validation.academicPerformance
                              ? "#d32f2f"
                              : "#8B4A8F",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: validation.academicPerformance
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                        },
                        "& input": {
                          color: "#A657AE",
                          padding: {
                            xs: "8px 12px",
                            sm: "9px 14px",
                            md: "10px 16px",
                          },
                        },
                      }}
                    />
                  )}
                />
                {validation.academicPerformance && (
                  <FormHelperText
                    error
                    sx={{
                      ml: 0,
                      mr: 0,
                      mt: 0.5,
                      textAlign: "left",
                      fontSize: {
                        xs: "0.7rem",
                        sm: "0.75rem",
                        md: "0.75rem",
                      },
                    }}
                  >
                    {errors.performanceError}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
