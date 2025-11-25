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
  languageScore?: string;
  mathScore?: string;
  scienceLogic?: string;
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
  const dgnlLimit = Number(import.meta.env.VITE_DGNL_LIMIT);
  const vsatminLimit = Number(import.meta.env.VITE_VSAT_MIN_LIMIT);
  const vsatmaxLimit = Number(import.meta.env.VITE_VSAT_MAX_LIMIT);
  const talentLimit = Number(import.meta.env.VITE_NANG_KHIEU_LIMMIT);

  const { showErrors = false } = props;
  const {
    categories,
    handleAddScore,
    handleRemoveScore,
    handleSubjectChange,
    handleScoreValueChange,
    handleScoreValueBlur,
    handleVNUHCMSubScoreChange,
    handleVNUHCMSubScoreBlur,
    getTranslatedCategoryName,
    getScoreRowData,
    getScoreRowErrors,
    canAddScore,
    getAddButtonText,
    getScorePlaceholder,
    getVNUHCMSubScoreLimits,
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
        const filledScores = category.scores.filter((score) => {
          if (score.subject) {
            const { isVNUHCM } = getScoreRowData(category.name, score);
            if (isVNUHCM) {
              // For VNUHCM, check if all sub-scores are filled
              return (
                score.languageScore && score.mathScore && score.scienceLogic
              );
            } else {
              // For non-VNUHCM, check if score is filled
              return score.score;
            }
          }
          return false;
        });

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
                  fontStyle: "italic",
                  fontFamily: "Montserrat",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.9rem",
                    md: "1.1rem",
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
                if (
                  filledScores.length > 0 &&
                  filledScores.length < vsatminLimit
                ) {
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
                        fontFamily: "Montserrat",
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
                if (filledScores.length > vsatmaxLimit) {
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
                        fontFamily: "Montserrat",
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
                if (filledScores.length > dgnlLimit) {
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
                        fontFamily: "Montserrat",
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
                if (filledScores.length > talentLimit) {
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
                        fontFamily: "Montserrat",
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
                const {
                  translatedSubjectOptions,
                  selectedSubjectValue,
                  isVNUHCM,
                } = getScoreRowData(category.name, score);
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
                    {/* Main row with dropdown, score field (or total for VNUHCM), and remove button */}
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
                        slotProps={{
                          paper: {
                            sx: {
                              "& .MuiAutocomplete-option": {
                                fontFamily: "Montserrat",
                              },
                            },
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
                                fontFamily: "Montserrat",
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

                      {/* Score Input/Display - For VNUHCM shows total*/}
                      {isVNUHCM ? (
                        // VNUHCM Total Score Display
                        <Box
                          sx={{
                            width: {
                              xs: "110px",
                              sm: "130px",
                              md: "150px",
                            },
                            height: {
                              xs: "36px",
                              sm: "38px",
                              md: "40px",
                            },
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "flex-start",
                            paddingLeft: {
                              xs: "12px",
                              sm: "14px",
                              md: "16px",
                            },
                            backgroundColor: "#ffffffff",
                            border: "1px solid #A657AE",
                            borderRadius: {
                              xs: "12px",
                              sm: "15px",
                              md: "17px",
                            },
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                            color: "#A657AE",
                            fontFamily: "Montserrat",
                            fontWeight: 500,
                          }}
                        >
                          {score.score || "0"}
                        </Box>
                      ) : (
                        // Regular Score Input (for non-VNUHCM)
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
                              ? getScorePlaceholder(
                                  category.name,
                                  score.subject,
                                )
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
                              fontFamily: "Montserrat",
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
                      )}

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

                    {/* VNUHCM Sub-scores Section */}
                    {isVNUHCM && (
                      <Box
                        sx={{
                          display: "flex",
                          flexDirection: "column",
                          gap: {
                            xs: 1,
                            sm: 1.25,
                            md: 1.5,
                          },
                          ml: 0,
                          p: {
                            xs: 1.5,
                            sm: 2,
                            md: 2.5,
                          },
                          backgroundColor: "#f5f5f5",
                          borderRadius: {
                            xs: "8px",
                            sm: "10px",
                            md: "12px",
                          },
                          border: "1px solid #e0e0e0",
                        }}
                      >
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#9c27b0",
                            fontFamily: "Montserrat",
                            fontWeight: 600,
                            fontSize: {
                              xs: "0.8rem",
                              sm: "0.85rem",
                              md: "0.9rem",
                            },
                            mb: {
                              xs: 0.5,
                              sm: 0.75,
                              md: 1,
                            },
                          }}
                        >
                          {t("thirdForm.vnuhcmComponentScores")}
                        </Typography>

                        {/* Language Score */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 1,
                              sm: 1.5,
                              md: 2,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              width: {
                                xs: "110px",
                                sm: "130px",
                                md: "150px",
                              },
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
                              color: "#A657AE",
                              fontFamily: "Montserrat",
                              fontWeight: 500,
                              flexShrink: 0,
                              textAlign: "left",
                            }}
                          >
                            {t("thirdForm.languageScore")}:
                          </Typography>
                          <TextField
                            type="text"
                            value={score.languageScore ?? ""}
                            onChange={(e) => {
                              handleVNUHCMSubScoreChange(
                                category.id,
                                score.id,
                                "languageScore",
                                e.target.value,
                              );
                            }}
                            onBlur={() => {
                              handleVNUHCMSubScoreBlur(
                                category.id,
                                score.id,
                                "languageScore",
                              );
                            }}
                            placeholder={`0-${String(getVNUHCMSubScoreLimits("languageScore").max)}`}
                            error={hasError && !score.languageScore}
                            sx={{
                              flex: 1,
                              maxWidth: {
                                xs: "140px",
                                sm: "160px",
                                md: "180px",
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
                                  borderColor: "#A657AE",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#8B4A8F",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
                                },
                                backgroundColor: "white",
                              },
                              "& .MuiInputBase-input": {
                                textAlign: "left",
                                color: "#A657AE",
                                fontFamily: "Montserrat",
                                padding: {
                                  xs: "8px 12px",
                                  sm: "9px 14px",
                                  md: "10px 16px",
                                },
                              },
                            }}
                          />
                        </Box>

                        {/* Math Score */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 1,
                              sm: 1.5,
                              md: 2,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              width: {
                                xs: "110px",
                                sm: "130px",
                                md: "150px",
                              },
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
                              color: "#A657AE",
                              fontFamily: "Montserrat",
                              fontWeight: 500,
                              flexShrink: 0,
                              textAlign: "left",
                            }}
                          >
                            {t("thirdForm.mathScore")}:
                          </Typography>
                          <TextField
                            type="text"
                            value={score.mathScore ?? ""}
                            onChange={(e) => {
                              handleVNUHCMSubScoreChange(
                                category.id,
                                score.id,
                                "mathScore",
                                e.target.value,
                              );
                            }}
                            onBlur={() => {
                              handleVNUHCMSubScoreBlur(
                                category.id,
                                score.id,
                                "mathScore",
                              );
                            }}
                            placeholder={`0-${String(getVNUHCMSubScoreLimits("mathScore").max)}`}
                            error={hasError && !score.mathScore}
                            sx={{
                              flex: 1,
                              maxWidth: {
                                xs: "140px",
                                sm: "160px",
                                md: "180px",
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
                                  borderColor: "#A657AE",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#8B4A8F",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
                                },
                                backgroundColor: "white",
                              },
                              "& .MuiInputBase-input": {
                                textAlign: "left",
                                color: "#A657AE",
                                fontFamily: "Montserrat",
                                padding: {
                                  xs: "8px 12px",
                                  sm: "9px 14px",
                                  md: "10px 16px",
                                },
                              },
                            }}
                          />
                        </Box>

                        {/* Science/Logic Score */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            gap: {
                              xs: 1,
                              sm: 1.5,
                              md: 2,
                            },
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              width: {
                                xs: "110px",
                                sm: "130px",
                                md: "150px",
                              },
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
                              color: "#A657AE",
                              fontFamily: "Montserrat",
                              fontWeight: 500,
                              flexShrink: 0,
                              textAlign: "left",
                            }}
                          >
                            {t("thirdForm.scienceLogic")}:
                          </Typography>
                          <TextField
                            type="text"
                            value={score.scienceLogic ?? ""}
                            onChange={(e) => {
                              handleVNUHCMSubScoreChange(
                                category.id,
                                score.id,
                                "scienceLogic",
                                e.target.value,
                              );
                            }}
                            onBlur={() => {
                              handleVNUHCMSubScoreBlur(
                                category.id,
                                score.id,
                                "scienceLogic",
                              );
                            }}
                            placeholder={`0-${String(getVNUHCMSubScoreLimits("scienceLogic").max)}`}
                            error={hasError && !score.scienceLogic}
                            sx={{
                              flex: 1,
                              maxWidth: {
                                xs: "140px",
                                sm: "160px",
                                md: "180px",
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
                                  borderColor: "#A657AE",
                                },
                                "&:hover fieldset": {
                                  borderColor: "#8B4A8F",
                                },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
                                },
                                backgroundColor: "white",
                              },
                              "& .MuiInputBase-input": {
                                textAlign: "left",
                                color: "#A657AE",
                                fontFamily: "Montserrat",
                                padding: {
                                  xs: "8px 12px",
                                  sm: "9px 14px",
                                  md: "10px 16px",
                                },
                              },
                            }}
                          />
                        </Box>
                      </Box>
                    )}

                    {/* Row-level error messages */}
                    {showErrors &&
                      scoreRowErrors.map((error) => (
                        <Typography
                          key={`${score.id}-${error.substring(0, 20)}`}
                          variant="caption"
                          sx={{
                            color: "#d32f2f",
                            fontFamily: "Montserrat",
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
                fontFamily: "Montserrat",
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
