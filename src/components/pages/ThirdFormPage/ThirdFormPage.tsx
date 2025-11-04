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

      // Check for incomplete entries (subject without score or vice versa)
      for (const score of category.scores) {
        if (
          (score.subject && !score.score) ||
          (!score.subject && score.score)
        ) {
          console.log("Incomplete entry found in", category.name);
          return false; // Invalid - incomplete entry
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
        <div className="form-2-content">
          <h1 className="form-title">3 → {t("thirdForm.title")}</h1>
          <p className="form-subtitle">{t("thirdForm.subTitle")}</p>

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

        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: 0.3,
            top: 181.6,
            right: 106,
          }}
        >
          <IconButton
            onClick={handlePrev}
            sx={{
              height: 40,
              width: 40,
              backgroundColor: "#A657AE",
              color: "white",
              "&:hover": { backgroundColor: "#8B4A8F" },
              borderRadius: 1,
            }}
          >
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton
            onClick={handleNext}
            sx={{
              height: 40,
              width: 40,
              backgroundColor: "#A657AE",
              color: "white",
              "&:hover": { backgroundColor: "#8B4A8F" },
              borderRadius: 1,
            }}
          >
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
      </div>
    </>
  );
}
