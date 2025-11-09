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
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
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
              mb: 1,
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
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#9c27b0",
                  textAlign: "left",
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
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
                      {t("thirdForm.vsatMinimumError")}
                    </Alert>
                  );
                }

                // Maximum validation
                if (filledScores.length > 8) {
                  return (
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
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
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
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
                    <Alert severity="error" sx={{ mb: 2, width: "100%" }}>
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
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    {/* Main row with dropdown, score field, and remove button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-start",
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
                          width: 200,
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={t("thirdForm.chooseExam")}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: "17px",
                                height: "40px",
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
                          width: "150px",
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: "40px",
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
                          width: "35px",
                          height: "35px",
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        <CloseIcon fontSize="small" />
                      </IconButton>
                    </Box>

                    {/* Row-level error messages */}
                    {showErrors &&
                      scoreRowErrors.map((error) => (
                        <Typography
                          key={`${score.id}-${error.substring(0, 20)}`}
                          variant="caption"
                          sx={{ color: "#d32f2f", ml: 1, textAlign: "left" }}
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
              startIcon={<AddIcon />}
              onClick={() => {
                handleAddScore(category.id);
              }}
              disabled={!canAdd}
              sx={{
                mb: 2,
                backgroundColor: canAdd ? "#9c27b0" : "#ccc",
                borderRadius: "10px",
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
