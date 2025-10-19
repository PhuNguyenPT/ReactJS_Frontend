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
        gap: 3,
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
              gap: 1,
              width: "100%",
            }}
          >
            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "#A657AE", textAlign: "left" }}
            >
              {grade.label}
            </Typography>

            {/* Dropdowns */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Conduct (Kết quả rèn luyện) */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                        width: 230,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
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
                        "& input": { color: "#A657AE" },
                      }}
                    />
                  )}
                />
                {validation.conduct && (
                  <FormHelperText
                    error
                    sx={{ ml: 0, mr: 0, mt: 0.5, textAlign: "left" }}
                  >
                    {errors.conductError}
                  </FormHelperText>
                )}
              </Box>

              {/* Academic Performance (Học lực) */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
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
                        width: 240,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
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
                        "& input": { color: "#A657AE" },
                      }}
                    />
                  )}
                />
                {validation.academicPerformance && (
                  <FormHelperText
                    error
                    sx={{ ml: 0, mr: 0, mt: 0.5, textAlign: "left" }}
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
