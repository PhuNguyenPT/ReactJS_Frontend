import { useState } from "react";
import ThirdFormMain from "./ThirdFormMain";
import usePageTitle from "../../../hooks/pageTilte/usePageTitle";
import { useTranslation } from "react-i18next";
import ThirdFormOptional from "./ThirdFormOptional";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../../../contexts/FormData/useFormData";

export default function ThirdFormPage() {
  usePageTitle("Unizy | Third Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, updateThirdForm } = useFormData();

  // Add explicit error state
  const [showErrors, setShowErrors] = useState(false);

  // Get current third form data from context
  const {
    mathScore,
    literatureScore,
    chosenSubjects,
    chosenScores,
    optionalCategories,
  } = formData.thirdForm;

  // Update functions that sync with context
  const setMathScore = (value: string) => {
    updateThirdForm({ mathScore: value });
    // Clear errors when user starts typing
    if (showErrors) setShowErrors(false);
  };

  const setLiteratureScore = (value: string) => {
    updateThirdForm({ literatureScore: value });
    if (showErrors) setShowErrors(false);
  };

  const setChosenSubjects = (value: (string | null)[]) => {
    updateThirdForm({ chosenSubjects: value });
    if (showErrors) setShowErrors(false);
  };

  const setChosenScores = (value: string[]) => {
    updateThirdForm({ chosenScores: value });
    if (showErrors) setShowErrors(false);
  };

  const setOptionalCategories = (value: typeof optionalCategories) => {
    updateThirdForm({ optionalCategories: value });
    // Clear errors when user updates optional categories
    if (showErrors) setShowErrors(false);
  };

  // Check if all required fields are filled
  const isMainFormValid = () => {
    return (
      mathScore.trim() !== "" &&
      literatureScore.trim() !== "" &&
      chosenSubjects.every((s) => s && s.trim() !== "") &&
      chosenScores.every((s) => s.trim() !== "")
    );
  };

  // Helper function to check if a subject is VNUHCM
  const isVNUHCM = (subject: string): boolean => {
    if (!subject) return false;
    const normalized = subject.toUpperCase();
    return (
      subject === "thirdForm.VNUHCM" ||
      subject === "VNUHCM" ||
      normalized.includes("VNUHCM") ||
      subject.includes("vnuhcm")
    );
  };

  // Validate optional categories manually
  const validateOptionalCategories = (): boolean => {
    // Check each category for validation errors
    for (const category of optionalCategories) {
      const filledScores = category.scores.filter(
        (score) => score.subject && score.score,
      );

      // V-SAT specific validation
      if (category.name === "V-SAT") {
        if (filledScores.length > 0 && filledScores.length < 3) {
          return false; // Invalid - needs at least 3
        }
        if (filledScores.length > 8) {
          return false; // Invalid - max 8
        }
      }

      // ĐGNL specific validation
      if (category.name === "ĐGNL") {
        if (filledScores.length > 3) {
          return false; // Invalid - max 3
        }
      }

      // Năng khiếu specific validation
      if (category.name === "Năng khiếu") {
        if (filledScores.length > 3) {
          return false; // Invalid - max 3
        }
      }

      // Check for incomplete entries
      for (const score of category.scores) {
        // Check if subject is selected but main score is missing
        if (
          (score.subject && !score.score) ||
          (!score.subject && score.score)
        ) {
          return false; // Invalid - incomplete entry
        }

        // VNUHCM specific validation - check if sub-scores are complete
        if (score.subject && isVNUHCM(score.subject)) {
          // If VNUHCM is selected, all three sub-scores must be filled
          if (!score.languageScore || !score.mathScore || !score.scienceLogic) {
            return false; // Invalid - VNUHCM sub-scores incomplete
          }

          // Validate that sub-scores are valid numbers within range (0-600)
          const langScore = parseFloat(score.languageScore);
          const mathScoreVal = parseFloat(score.mathScore);
          const scienceScore = parseFloat(score.scienceLogic);

          if (
            isNaN(langScore) ||
            langScore < 0 ||
            langScore > 600 ||
            isNaN(mathScoreVal) ||
            mathScoreVal < 0 ||
            mathScoreVal > 600 ||
            isNaN(scienceScore) ||
            scienceScore < 0 ||
            scienceScore > 600
          ) {
            return false; // Invalid - sub-scores out of valid range
          }
        }
      }
    }

    return true; // All valid
  };

  // Pass showErrors directly as hasError
  const hasError = showErrors;

  const setHasError = (value: boolean) => {
    setShowErrors(value);
  };

  const handleNext = () => {
    const mainFormValid = isMainFormValid();
    const optionalFormValid = validateOptionalCategories();

    // Check both main form and optional form
    if (mainFormValid && optionalFormValid) {
      // Both valid - navigate
      void navigate("/fourthForm");
    } else {
      // Show errors when user tries to proceed with incomplete form
      setShowErrors(true);

      // Optional: Scroll to first error
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  const handlePrev = () => {
    void navigate("/secondForm");
  };

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <div className="form-content">
            <Box
              component="h1"
              className="form-title"
              sx={{
                fontSize: {
                  xs: "1.5rem",
                  sm: "1.75rem",
                  md: "2rem",
                },
              }}
            >
              3 → {t("thirdForm.title")}
            </Box>
            <Box
              component="p"
              className="form-subtitle"
              sx={{
                fontSize: {
                  xs: "0.875rem",
                  sm: "0.95rem",
                  md: "1rem",
                },
              }}
            >
              {t("thirdForm.subTitle")}
            </Box>

            <ThirdFormMain
              mathScore={mathScore}
              setMathScore={setMathScore}
              literatureScore={literatureScore}
              setLiteratureScore={setLiteratureScore}
              chosenSubjects={chosenSubjects}
              setChosenSubjects={setChosenSubjects}
              chosenScores={chosenScores}
              setChosenScores={setChosenScores}
              hasError={hasError}
              setHasError={setHasError}
            />

            <ThirdFormOptional
              categories={optionalCategories}
              setCategories={setOptionalCategories}
              showErrors={showErrors}
            />
          </div>

          {/* Navigation buttons positioned at bottom-right of form card */}
          <Box
            sx={{
              position: "absolute",
              bottom: {
                xs: 15,
                sm: 20,
                md: 20,
              },
              right: {
                xs: 15,
                sm: 20,
                md: 20,
              },
              display: "flex",
              gap: {
                xs: 0.5,
                sm: 0.5,
                md: 0.3,
              },
              zIndex: 10,
            }}
          >
            <IconButton onClick={handlePrev} sx={buttonStyle}>
              <ArrowBackIosNewIcon
                fontSize="small"
                sx={{
                  fontSize: {
                    xs: "1rem",
                    sm: "1.1rem",
                    md: "1.25rem",
                  },
                }}
              />
            </IconButton>
            <IconButton onClick={handleNext} sx={buttonStyle}>
              <ArrowForwardIosIcon
                fontSize="small"
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
        </Box>
      </div>
    </>
  );
}

const buttonStyle = {
  height: {
    xs: 35,
    sm: 38,
    md: 40,
  },
  width: {
    xs: 35,
    sm: 38,
    md: 40,
  },
  backgroundColor: "#A657AE",
  color: "white",
  "&:hover": { backgroundColor: "#8B4A8F" },
  borderRadius: 1,
};
