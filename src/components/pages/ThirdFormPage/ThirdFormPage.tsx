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
import { useThirdOptionalForm } from "../../../hooks/formPages/useThirdOptionalForm";

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

  // Get validation function from optional form hook
  const { validateForm } = useThirdOptionalForm({
    categories: optionalCategories,
    setCategories: (value) => {
      updateThirdForm({ optionalCategories: value });
    },
  });

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

  // Pass showErrors directly as hasError
  const hasError = showErrors;

  const setHasError = (value: boolean) => {
    setShowErrors(value);
  };

  const handleNext = () => {
    const mainFormValid = isMainFormValid();
    const optionalFormValidation = validateForm();
    const optionalFormValid = optionalFormValidation.isValid;

    // Check both main form and optional form
    if (mainFormValid && optionalFormValid) {
      void navigate("/fourthForm");
    } else {
      // Show errors when user tries to proceed with incomplete form
      setShowErrors(true);
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
