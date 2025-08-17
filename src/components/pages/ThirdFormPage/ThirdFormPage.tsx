import { useState } from "react";
import ThirdFormMain from "./ThirdFormMain";
import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import ThirdFormOptional from "./ThirdFormOptional";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";

export default function ThirdFormPage() {
  usePageTitle("Unizy | Third Form");
  const { t } = useTranslation();
  const navigate = useNavigate();

  // Lifted state from ThirdFormMain
  const [mathScore, setMathScore] = useState("");
  const [literatureScore, setLiteratureScore] = useState("");
  const [chosenSubjects, setChosenSubjects] = useState<(string | null)[]>([
    null,
    null,
  ]);
  const [chosenScores, setChosenScores] = useState<string[]>(["", ""]);
  const [hasError, setHasError] = useState(false);

  const handleNext = () => {
    const allFilled =
      mathScore.trim() !== "" &&
      literatureScore.trim() !== "" &&
      chosenSubjects.every((s) => s && s.trim() !== "") &&
      chosenScores.every((s) => s.trim() !== "");

    if (allFilled) {
      setHasError(false);
      void navigate("/fourthForm");
    } else {
      setHasError(true);
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

          {/* Pass state and setters as props */}
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

          <ThirdFormOptional />
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
