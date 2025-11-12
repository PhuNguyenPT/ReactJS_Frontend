import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
  Alert,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useThirdOptionalForm } from "../../../hooks/formPages/useThirdOptionalForm";

interface OptionalScore {
  id: string;
  subject: string;
  score: string;
}

interface CategoryData {
  id: string;
  name: string;
  scores: OptionalScore[];
  isExpanded: boolean;
}

interface ThirdFormOptionalProps {
  categories: CategoryData[];
  setCategories: (categories: CategoryData[]) => void;
  showErrors?: boolean;
}

export default function ThirdFormOptional(props: ThirdFormOptionalProps) {
  const { showErrors = false } = props;
  const {
    categories,
    handleAddScore,
    handleRemoveScore,
    handleSubjectChange,
    handleScoreValueChange,
    handleScoreValueBlur,
    getTranslatedCategoryName,
    getScoreRowData,
    getScoreRowErrors,
    canAddScore,
    getAddButtonText,
    getScorePlaceholder,
    t,
  } = useThirdOptionalForm(props);

  return (
    <Box
      sx={{
        mt: {
          xs: 2,
          sm: 2.5,
          md: 3,
        },
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {categories.map((category) => {
        const canAdd = canAddScore(category.name);

        // Count filled scores for validation
        const filledScores = category.scores.filter(
          (score) => score.subject && score.score,
        );

        return (
          <Box
            key={category.id}
            sx={{
              mb: {
                xs: 1,
                sm: 1,
                md: 1,
              },
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
            }}
          >
            {/* Category Header */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: {
                  xs: 0.75,
                  sm: 0.875,
                  md: 1,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#9c27b0",
                  textAlign: "left",
                  fontSize: {
                    xs: "0.875rem",
                    sm: "0.95rem",
                    md: "1rem",
                  },
                }}
              >
                {t("thirdForm.firstTypo")}{" "}
                {getTranslatedCategoryName(category.name)}{" "}
                {t("thirdForm.secondTypo")}
              </Typography>
            </Box>

            {/* V-SAT Validation Errors - Direct Check */}
            {showErrors &&
              category.name === "V-SAT" &&
              (() => {
                // Minimum validation
                if (filledScores.length > 0 && filledScores.length < 3) {
                  return (
                    <Alert
                      severity="error"
                      sx={{
                        mb: {
                          xs: 1.5,
                          sm: 1.75,
                          md: 2,
                        },
                        width: "100%",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {t("thirdForm.vsatMinimumError")}
                    </Alert>
                  );
                }

                // Maximum validation
                if (filledScores.length > 8) {
                  return (
                    <Alert
                      severity="error"
                      sx={{
                        mb: {
                          xs: 1.5,
                          sm: 1.75,
                          md: 2,
                        },
                        width: "100%",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {t("thirdForm.maxEntriesReached")}
                    </Alert>
                  );
                }

                return null;
              })()}

            {/* ĐGNL Validation Errors - Direct Check */}
            {showErrors &&
              category.name === "ĐGNL" &&
              (() => {
                if (filledScores.length > 3) {
                  return (
                    <Alert
                      severity="error"
                      sx={{
                        mb: {
                          xs: 1.5,
                          sm: 1.75,
                          md: 2,
                        },
                        width: "100%",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {t("thirdForm.maxEntriesReached")}
                    </Alert>
                  );
                }
                return null;
              })()}

            {/* Năng khiếu Validation Errors - Direct Check */}
            {showErrors &&
              category.name === "Năng khiếu" &&
              (() => {
                if (filledScores.length > 3) {
                  return (
                    <Alert
                      severity="error"
                      sx={{
                        mb: {
                          xs: 1.5,
                          sm: 1.75,
                          md: 2,
                        },
                        width: "100%",
                        fontSize: {
                          xs: "0.75rem",
                          sm: "0.8rem",
                          md: "0.875rem",
                        },
                      }}
                    >
                      {t("thirdForm.maxEntriesReached")}
                    </Alert>
                  );
                }
                return null;
              })()}

            {/* Score Inputs */}
            {category.isExpanded &&
              category.scores.map((score) => {
                const { translatedSubjectOptions, selectedSubjectValue } =
                  getScoreRowData(category.name, score);
                const scoreRowErrors = getScoreRowErrors(category.name, score);
                const hasError = showErrors && scoreRowErrors.length > 0;

                return (
                  <Box
                    key={score.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      mb: {
                        xs: 1.5,
                        sm: 1.75,
                        md: 2,
                      },
                      gap: {
                        xs: 0.75,
                        sm: 0.875,
                        md: 1,
                      },
                    }}
                  >
                    {/* Main row with dropdown, score field, and remove button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: {
                          xs: 0.5,
                          sm: 0.75,
                          md: 1,
                        },
                        justifyContent: "flex-start",
                        flexWrap: {
                          xs: "wrap",
                          sm: "nowrap",
                        },
                      }}
                    >
                      {/* Subject Autocomplete */}
                      <Autocomplete
                        options={translatedSubjectOptions}
                        value={selectedSubjectValue}
                        onChange={(_, newValue) => {
                          const translationKey = newValue?.key ?? "";
                          handleSubjectChange(
                            category.id,
                            score.id,
                            translationKey,
                          );
                        }}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.key === value.key
                        }
                        sx={{
                          width: {
                            xs: 140,
                            sm: 170,
                            md: 200,
                          },
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("thirdForm.chooseExam")}
                            sx={{
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
                                  borderColor: "#A657AE",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#8B4A8F",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
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

                      {/* Score Input with validation */}
                      <TextField
                        type="text"
                        value={score.score}
                        onChange={(e) => {
                          handleScoreValueChange(
                            category.id,
                            score.id,
                            e.target.value,
                          );
                        }}
                        onBlur={() => {
                          handleScoreValueBlur(category.id, score.id);
                        }}
                        placeholder={
                          score.subject
                            ? getScorePlaceholder(category.name, score.subject)
                            : t("thirdForm.score")
                        }
                        error={hasError}
                        disabled={!score.subject}
                        sx={{
                          width: {
                            xs: "110px",
                            sm: "130px",
                            md: "150px",
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
                          },
                          "&:hover .MuiOutlinedInput-notchedOutline": {
                            borderColor: hasError ? "#d32f2f" : "#8B4A8F",
                          },
                          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                            borderColor: hasError ? "#d32f2f" : "#A657AE",
                          },
                          "& .MuiOutlinedInput-notchedOutline": {
                            borderColor: hasError ? "#d32f2f" : "#A657AE",
                          },
                          "& .MuiInputBase-input": {
                            textAlign: "left",
                            color: "#A657AE",
                            padding: {
                              xs: "8px 12px",
                              sm: "9px 14px",
                              md: "10px 16px",
                            },
                          },
                          "& input[type=number]": {
                            MozAppearance: "textfield",
                          },
                          "& input[type=number]::-webkit-outer-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                          "& input[type=number]::-webkit-inner-spin-button": {
                            WebkitAppearance: "none",
                            margin: 0,
                          },
                        }}
                      />

                      {/* Remove Button */}
                      <IconButton
                        onClick={() => {
                          handleRemoveScore(category.id, score.id);
                        }}
                        sx={{
                          backgroundColor: "#f44336",
                          color: "white",
                          width: {
                            xs: "32px",
                            sm: "34px",
                            md: "35px",
                          },
                          height: {
                            xs: "32px",
                            sm: "34px",
                            md: "35px",
                          },
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.25rem",
                            },
                          }}
                        />
                      </IconButton>
                    </Box>

                    {/* Row-level error messages */}
                    {showErrors &&
                      scoreRowErrors.map((error) => (
                        <Typography
                          key={`${score.id}-${error.substring(0, 20)}`}
                          variant="caption"
                          sx={{
                            color: "#d32f2f",
                            ml: 1,
                            textAlign: "left",
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
                        >
                          {error}
                        </Typography>
                      ))}
                  </Box>
                );
              })}

            {/* Add Button */}
            <Button
              variant="contained"
              startIcon={
                <AddIcon
                  sx={{
                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                      md: "1.25rem",
                    },
                  }}
                />
              }
              onClick={() => {
                handleAddScore(category.id);
              }}
              disabled={!canAdd}
              sx={{
                mb: {
                  xs: 1.5,
                  sm: 1.75,
                  md: 2,
                },
                px: {
                  xs: 1.5,
                  sm: 2,
                  md: 2,
                },
                py: {
                  xs: 0.6,
                  sm: 0.7,
                  md: 0.8,
                },
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.85rem",
                  md: "0.9rem",
                },
                backgroundColor: canAdd ? "#9c27b0" : "#ccc",
                borderRadius: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },
                textTransform: "none",
                alignSelf: "flex-start",
                "&:hover": {
                  backgroundColor: canAdd ? "#7b1fa2" : "#ccc",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {getAddButtonText(category.name)}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}
