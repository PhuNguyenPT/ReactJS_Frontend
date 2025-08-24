import { useEffect } from "react";
import ThirdFormMain from "./ThirdFormMain";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import ThirdFormOptional from "./ThirdFormOptional";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useFormData } from "../../../contexts/FormDataContext/useFormData"; // Adjust path as needed

export default function ThirdFormPage() {
  usePageTitle("Unizy | Third Form");
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { formData, updateThirdForm, isFormDataComplete } = useFormData();

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
  };

  const setLiteratureScore = (value: string) => {
    updateThirdForm({ literatureScore: value });
  };

  const setChosenSubjects = (value: (string | null)[]) => {
    updateThirdForm({ chosenSubjects: value });
  };

  const setChosenScores = (value: string[]) => {
    updateThirdForm({ chosenScores: value });
  };

  const setOptionalCategories = (value: typeof optionalCategories) => {
    updateThirdForm({ optionalCategories: value });
  };

  // Validation state - derived from context data
  const hasError =
    !isFormDataComplete() &&
    (mathScore.trim() !== "" ||
      literatureScore.trim() !== "" ||
      chosenSubjects.some((s) => s) ||
      chosenScores.some((s) => s.trim() !== ""));

  const setHasError = () => {
    // This is handled by the validation logic above
    // You could add a separate error state in context if needed
  };

  const handleNext = () => {
    const allFilled =
      mathScore.trim() !== "" &&
      literatureScore.trim() !== "" &&
      chosenSubjects.every((s) => s && s.trim() !== "") &&
      chosenScores.every((s) => s.trim() !== "");

    if (allFilled) {
      console.log("Form data saved:", formData); // Debug: see saved data
      void navigate("/fourthForm");
    } else {
      // You could add an error state to context if needed
      // For now, the hasError logic above will handle display
    }
  };

  const handlePrev = () => {
    void navigate("/secondForm");
  };

  useEffect(() => {
    console.log("Third form data updated:", formData.thirdForm);
  }, [formData.thirdForm]);

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content">
          <h1 className="form-title">3 → {t("thirdForm.title")}</h1>
          <p className="form-subtitle">{t("thirdForm.subTitle")}</p>

          {/* Pass context-managed state and setters as props */}
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
