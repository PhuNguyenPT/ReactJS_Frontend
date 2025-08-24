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
import { getOptionalCategorySubjects } from "../../../type/enum/combineUtil";

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
}

export default function ThirdFormOptional({
  categories,
  setCategories,
}: ThirdFormOptionalProps) {
  const { t } = useTranslation();

  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleAddScore = (categoryId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          scores: [
            ...category.scores,
            { id: generateId(), subject: "", score: "" },
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
    field: "subject" | "score",
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

  const toggleExpanded = (categoryId: string) => {
    const updated = categories.map((category) => {
      if (category.id === categoryId) {
        return { ...category, isExpanded: !category.isExpanded };
      }
      return category;
    });
    setCategories(updated);
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
          {/* Category Header */}
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: "#9c27b0",
              fontStyle: "italic",
              textAlign: "left",
              cursor: "pointer",
            }}
            onClick={() => {
              toggleExpanded(category.id);
            }}
          >
            {t("thirdForm.firstTypo")} {category.name}{" "}
            {t("thirdForm.secondTypo")}
          </Typography>

          {/* Score Inputs */}
          {category.isExpanded &&
            category.scores.map((score) => (
              <Box
                key={score.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-start",
                  mb: 1,
                }}
              >
                {/* Subject Autocomplete */}
                <Autocomplete
                  options={getAvailableSubjects(category.name, score.id)}
                  value={score.subject || null}
                  onChange={(_, newValue) => {
                    handleScoreChange(
                      category.id,
                      score.id,
                      "subject",
                      newValue ?? "",
                    );
                  }}
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

                {/* Score Input */}
                <TextField
                  value={score.score}
                  onChange={(e) => {
                    handleScoreChange(
                      category.id,
                      score.id,
                      "score",
                      e.target.value,
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
            ))}

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
