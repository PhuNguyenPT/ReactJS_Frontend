import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import {
  getOptionalCategorySubjects,
  getCategoryTranslationKey,
} from "../../../type/enum/combineUtil";

interface OptionalScore {
  id: string;
  subject: string;
  subjectOther?: string;
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
}

export default function ThirdFormOptional({
  categories,
  setCategories,
}: ThirdFormOptionalProps) {
  const { t } = useTranslation();

  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  // Validate and sanitize score input
  const handleScoreValidation = (value: string): string => {
    // Allow empty string
    if (value === "") return "";

    // Allow only numbers and one decimal point
    const regex = /^\d*\.?\d*$/;
    if (!regex.test(value)) return value.slice(0, -1);

    // Convert to number and validate range
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return value;

    // If greater than 10, return "10"
    if (numValue > 10) return "10";

    // If less than 0, return "0"
    if (numValue < 0) return "0";

    return value;
  };

  const handleAddScore = (categoryId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          scores: [
            ...category.scores,
            { id: generateId(), subject: "", subjectOther: "", score: "" },
          ],
          isExpanded: true,
        };
      }
      return category;
    });
    setCategories(updated);
  };

  const handleRemoveScore = (categoryId: string, scoreId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        const newScores = category.scores.filter(
          (score) => score.id !== scoreId,
        );
        return {
          ...category,
          scores: newScores,
          isExpanded: newScores.length > 0,
        };
      }
      return category;
    });
    setCategories(updated);
  };

  const handleScoreChange = (
    categoryId: string,
    scoreId: string,
    field: "subject" | "subjectOther" | "score",
    value: string,
  ) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          scores: category.scores.map((score) => {
            if (score.id === scoreId) {
              return { ...score, [field]: value };
            }
            return score;
          }),
        };
      }
      return category;
    });
    setCategories(updated);
  };

  // Convert translation keys to display options for subjects
  const getTranslatedSubjectOptions = (availableOptions: string[]) => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected subject value as an option object
  const getSelectedSubjectValue = (translationKey: string | null) => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Get available subjects for a specific category and exclude already selected ones
  const getAvailableSubjects = (
    categoryName: string,
    currentScoreId: string,
  ): string[] => {
    const category = categories.find((cat) => cat.name === categoryName);
    const allSubjects = getOptionalCategorySubjects(categoryName);

    if (!category) return allSubjects;

    // Filter out subjects that are already selected in this category
    const selectedSubjects = category.scores
      .filter((score) => score.id !== currentScoreId && score.subject)
      .map((score) => score.subject);

    return allSubjects.filter((subject) => !selectedSubjects.includes(subject));
  };

  // Get translated category name
  const getTranslatedCategoryName = (categoryName: string): string => {
    const translationKey = getCategoryTranslationKey(categoryName);
    return t(translationKey);
  };

  return (
    <Box
      sx={{
        mt: 3,
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {categories.map((category) => (
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
          {/* Category Header - Now with translation support */}
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: "#9c27b0",
              textAlign: "left",
            }}
          >
            {t("thirdForm.firstTypo")}{" "}
            {getTranslatedCategoryName(category.name)}{" "}
            {t("thirdForm.secondTypo")}
          </Typography>

          {/* Score Inputs */}
          {category.isExpanded &&
            category.scores.map((score) => {
              const availableSubjects = getAvailableSubjects(
                category.name,
                score.id,
              );
              const translatedSubjectOptions =
                getTranslatedSubjectOptions(availableSubjects);
              const selectedSubjectValue = getSelectedSubjectValue(
                score.subject || null,
              );

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
                        handleScoreChange(
                          category.id,
                          score.id,
                          "subject",
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
                      type="number"
                      value={score.score}
                      onChange={(e) => {
                        const validatedValue = handleScoreValidation(
                          e.target.value,
                        );
                        handleScoreChange(
                          category.id,
                          score.id,
                          "score",
                          validatedValue,
                        );
                      }}
                      placeholder={t("thirdForm.score")}
                      slotProps={{
                        htmlInput: { min: 0, max: 10, step: 0.1 },
                      }}
                      sx={{
                        width: "150px",
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
                        },
                        "&:hover .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#8B4A8F",
                        },
                        "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#A657AE",
                        },
                        "& .MuiOutlinedInput-notchedOutline": {
                          borderColor: "#A657AE",
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
            sx={{
              mb: 2,
              backgroundColor: "#9c27b0",
              borderRadius: "10px",
              textTransform: "none",
              alignSelf: "flex-start",
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
          >
            {t("buttons.add")}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
