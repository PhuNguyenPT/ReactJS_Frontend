import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Autocomplete,
  Alert,
} from "@mui/material";
import { useState, useEffect, useCallback, useMemo } from "react";
import { useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";
import type { NinthFormNavigationState } from "../../../type/interface/navigationTypes";
import type { OcrResultItem } from "../../../type/interface/ocrTypes";
import {
  NationalExamSubjects,
  getNationalExamSubjectTranslationKey,
  isValidSubjectKey,
  type NationalExamSubjectTranslationKey,
} from "../../../type/enum/national-exam-subject";
import { useNinthForm } from "../../../contexts/ScoreBoardData/useScoreBoardContext";

type SubjectScores = Record<string, string>;
type GradeScores = Record<string, SubjectScores>;

export default function NinthForm() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigationState = location.state as
    | NinthFormNavigationState
    | undefined;

  const [showAlert, setShowAlert] = useState(false);

  // Use the context hook
  const {
    scores,
    selectedSubjects,
    hasOcrData,
    updateScore,
    updateSelectedSubject,
    removeSubjectScore,
    loadOcrData,
  } = useNinthForm();

  // Show alert when OCR data is loaded
  useEffect(() => {
    if (hasOcrData) {
      setShowAlert(true);
    }
  }, [hasOcrData]);

  // Fixed subjects using translation keys (enum values)
  const fixedSubjects = useMemo(
    () =>
      [
        NationalExamSubjects.TOAN,
        NationalExamSubjects.NGU_VAN,
        NationalExamSubjects.TIENG_ANH,
        NationalExamSubjects.LICH_SU,
      ] as NationalExamSubjectTranslationKey[],
    [],
  );

  // Optional subjects using translation keys (enum values)
  const optionalSubjects = useMemo(
    () =>
      [
        NationalExamSubjects.DIA_LY,
        NationalExamSubjects.GDKT_PL,
        NationalExamSubjects.VAT_LY,
        NationalExamSubjects.HOA_HOC,
        NationalExamSubjects.SINH_HOC,
        NationalExamSubjects.CONG_NGHE,
        NationalExamSubjects.TIN_HOC,
      ] as NationalExamSubjectTranslationKey[],
    [],
  );

  // Grades and semesters - memoized for consistency
  const grades = useMemo(() => ["10", "11", "12"], []);
  const semesters = useMemo(
    () => [t("ninthForm.semester1"), t("ninthForm.semester2")],
    [t],
  );

  /**
   * Process OCR data and load into context
   */
  const processOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        // Filter out results without scores
        const validResults = ocrResults.filter(
          (result) => result.scores && result.scores.length > 0,
        );

        if (validResults.length === 0) {
          console.log("[NinthForm] No valid OCR data to load");
          return;
        }

        console.log(
          `[NinthForm] Loading ${String(validResults.length)} OCR results`,
        );

        const newScores: GradeScores = {
          "10-1": {},
          "10-2": {},
          "11-1": {},
          "11-2": {},
          "12-1": {},
          "12-2": {},
        };

        const newSelectedSubjects: Record<string, (string | null)[]> = {
          "10-1": [null, null, null, null],
          "10-2": [null, null, null, null],
          "11-1": [null, null, null, null],
          "11-2": [null, null, null, null],
          "12-1": [null, null, null, null],
          "12-2": [null, null, null, null],
        };

        // Map to grade-semester keys: 10-1, 10-2, 11-1, 11-2, 12-1, 12-2
        const gradeKeys = ["10-1", "10-2", "11-1", "11-2", "12-1", "12-2"];

        validResults.forEach((result, index) => {
          if (index >= gradeKeys.length) {
            console.warn(
              `[NinthForm] More OCR results than expected: ${String(index + 1)} results`,
            );
            return;
          }

          const gradeKey = gradeKeys[index];
          console.log(
            `[NinthForm] Processing ${gradeKey}:`,
            String(result.scores?.length),
            "subjects",
          );

          if (!result.scores) return;

          // Initialize scores for this grade-semester
          newScores[gradeKey] = {};
          const optionalSubjectsForGrade: (string | null)[] = [];

          result.scores.forEach((scoreItem) => {
            const subjectNameVietnamese = scoreItem.name;
            const scoreValue = scoreItem.score.toString();

            // Convert Vietnamese name to translation key
            const subjectTranslationKey = getNationalExamSubjectTranslationKey(
              subjectNameVietnamese,
            );

            console.log(
              `[NinthForm] ${gradeKey} - Processing: "${subjectNameVietnamese}" -> "${subjectTranslationKey}" = ${scoreValue}`,
            );

            // ✅ FIX: Check if it's a valid subject key first
            if (isValidSubjectKey(subjectTranslationKey)) {
              const isFixedSubject = fixedSubjects.includes(
                subjectTranslationKey,
              );
              const isOptionalSubject = optionalSubjects.includes(
                subjectTranslationKey,
              );

              if (isFixedSubject) {
                // Store using translation key
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                console.log(
                  `[NinthForm] ✓ Fixed subject stored: ${subjectTranslationKey} = ${scoreValue}`,
                );
              } else if (isOptionalSubject) {
                // Store using translation key
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
                console.log(
                  `[NinthForm] ✓ Optional subject stored: ${subjectTranslationKey} = ${scoreValue}`,
                );
              } else {
                // Valid key but not in our lists (shouldn't happen)
                console.warn(
                  `[NinthForm] ⚠️ Valid subject key but not in lists: ${subjectTranslationKey}`,
                );
                newScores[gradeKey][subjectTranslationKey] = scoreValue;
                optionalSubjectsForGrade.push(subjectTranslationKey);
              }
            } else {
              // Not a recognized subject
              console.warn(
                `[NinthForm] ⚠️ Unknown subject from OCR: "${subjectNameVietnamese}" (key: "${subjectTranslationKey}")`,
              );
              console.warn(
                `[NinthForm] Available fixed subjects:`,
                fixedSubjects,
              );
              console.warn(
                `[NinthForm] Available optional subjects:`,
                optionalSubjects,
              );

              // Fallback: store with the returned key (might be Vietnamese name)
              newScores[gradeKey][subjectTranslationKey] = scoreValue;
              optionalSubjectsForGrade.push(subjectTranslationKey);
            }
          });

          // Pad with nulls to have 4 optional subject slots
          while (optionalSubjectsForGrade.length < 4) {
            optionalSubjectsForGrade.push(null);
          }

          newSelectedSubjects[gradeKey] = optionalSubjectsForGrade;

          console.log(
            `[NinthForm] ${gradeKey} - Scores stored:`,
            newScores[gradeKey],
          );
          console.log(
            `[NinthForm] ${gradeKey} - Optional subjects:`,
            optionalSubjectsForGrade,
          );
        });

        // Load into context
        loadOcrData(newScores, newSelectedSubjects);
        setShowAlert(true);
        console.log("[NinthForm] ✅ OCR data loaded successfully");
        console.log("[NinthForm] Final scores:", newScores);
        console.log(
          "[NinthForm] Final selected subjects:",
          newSelectedSubjects,
        );
      } catch (error) {
        console.error("[NinthForm] ❌ Error loading OCR data:", error);
      }
    },
    [fixedSubjects, optionalSubjects, loadOcrData],
  );

  // Load OCR data on component mount if available
  useEffect(() => {
    if (
      navigationState?.ocrProcessed &&
      navigationState.ocrResults &&
      !hasOcrData
    ) {
      console.log("[NinthForm] Processing OCR data from navigation state...");
      processOcrData(navigationState.ocrResults);
    }
  }, [
    navigationState?.ocrProcessed,
    navigationState?.ocrResults,
    hasOcrData,
    processOcrData,
  ]);

  const handleScoreChange = useCallback(
    (gradeKey: string, subject: string, value: string) => {
      updateScore(gradeKey, subject, value);
    },
    [updateScore],
  );

  const handleSubjectSelect = useCallback(
    (gradeKey: string, index: number, newSubject: string | null) => {
      const oldSubject = selectedSubjects[gradeKey][index];

      // If changing subject, remove old subject's score
      if (oldSubject && oldSubject !== newSubject) {
        removeSubjectScore(gradeKey, oldSubject);
      }

      updateSelectedSubject(gradeKey, index, newSubject);
    },
    [selectedSubjects, removeSubjectScore, updateSelectedSubject],
  );

  const handleCloseAlert = useCallback(() => {
    setShowAlert(false);
  }, []);

  const renderSubjectInputs = useCallback(
    (gradeKey: string) => (
      <>
        {/* Fixed subjects */}
        {fixedSubjects.map((subjectKey) => (
          <Box
            key={subjectKey}
            sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}
          >
            {/* Subject pill (same look as Autocomplete) */}
            <TextField
              value={t(subjectKey)}
              disabled
              sx={{
                width: 250,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "45px",
                  backgroundColor: "white",
                  "& fieldset": { borderColor: "#A657AE" },
                  "&.Mui-disabled fieldset": { borderColor: "#A657AE" },
                },
                "& .MuiInputBase-input.Mui-disabled": {
                  WebkitTextFillColor: "#A657AE",
                },
                "& input": { textAlign: "left", fontWeight: 500 },
              }}
              slotProps={{
                htmlInput: { readOnly: true },
              }}
            />

            {/* Score input */}
            <TextField
              variant="outlined"
              size="small"
              placeholder={t("ninthForm.score")}
              value={scores[gradeKey][subjectKey] || ""}
              onChange={(e) => {
                handleScoreChange(gradeKey, subjectKey, e.target.value);
              }}
              sx={{
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "45px",
                  backgroundColor:
                    hasOcrData && scores[gradeKey][subjectKey]
                      ? "rgba(166, 87, 174, 0.05)"
                      : "white",
                  "& fieldset": { borderColor: "#A657AE" },
                  "&:hover fieldset": { borderColor: "#8B4A8F" },
                  "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                },
                "& input": { color: "#A657AE" },
              }}
              slotProps={{
                htmlInput: {
                  pattern: "[0-9]+(\\.[0-9]+)?",
                },
              }}
            />
          </Box>
        ))}

        {/* Optional subjects with Autocomplete */}
        {selectedSubjects[gradeKey].map((subjectKey, idx) => (
          <Box
            key={`dropdown-${String(idx)}`}
            sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}
          >
            <Autocomplete
              options={optionalSubjects}
              value={subjectKey}
              onChange={(_, newValue) => {
                handleSubjectSelect(gradeKey, idx, newValue);
              }}
              getOptionLabel={(option) => t(option)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("ninthForm.chooseSubject")}
                  sx={{
                    width: 250,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "17px",
                      height: "45px",
                      backgroundColor:
                        hasOcrData && subjectKey
                          ? "rgba(166, 87, 174, 0.05)"
                          : "white",
                      "& fieldset": { borderColor: "#A657AE" },
                      "&:hover fieldset": { borderColor: "#8B4A8F" },
                      "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                    },
                    "& input": { color: "#A657AE", textAlign: "left" },
                  }}
                />
              )}
            />

            <TextField
              variant="outlined"
              size="small"
              placeholder={t("ninthForm.score")}
              value={subjectKey ? scores[gradeKey][subjectKey] || "" : ""}
              onChange={(e) => {
                if (subjectKey) {
                  handleScoreChange(gradeKey, subjectKey, e.target.value);
                }
              }}
              disabled={!subjectKey}
              sx={{
                minWidth: "250px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "45px",
                  backgroundColor:
                    hasOcrData && subjectKey && scores[gradeKey][subjectKey]
                      ? "rgba(166, 87, 174, 0.05)"
                      : "white",
                  "& fieldset": { borderColor: "#A657AE" },
                  "&:hover fieldset": { borderColor: "#8B4A8F" },
                  "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                },
                "& input": { color: "#A657AE" },
              }}
              slotProps={{
                htmlInput: {
                  pattern: "[0-9]+(\\.[0-9]+)?",
                },
              }}
            />
          </Box>
        ))}
      </>
    ),
    [
      fixedSubjects,
      optionalSubjects,
      selectedSubjects,
      scores,
      hasOcrData,
      handleScoreChange,
      handleSubjectSelect,
      t,
    ],
  );

  return (
    <Box
      className="ninth-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "1200px",
        margin: "0 auto",
        px: 2,
        py: 3,
      }}
    >
      {/* OCR Load Status Message */}
      {hasOcrData && showAlert && (
        <Alert severity="success" onClose={handleCloseAlert} sx={{ mb: 2 }}>
          {t("ninthForm.scoreBoardDataLoaded")}
        </Alert>
      )}

      {grades.map((grade) => (
        <Box key={grade}>
          {[0, 1].map((semesterIndex) => {
            const gradeKey = `${grade}-${String(semesterIndex + 1)}`;
            return (
              <Accordion
                key={gradeKey}
                sx={{
                  backgroundColor: "rgba(255, 255, 255, 0.95)",
                  borderRadius: "12px !important",
                  mb: 2,
                  "&:before": { display: "none" },
                  boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                }}
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon sx={{ color: "#A657AE" }} />}
                  sx={{
                    backgroundColor: "rgba(166, 87, 174, 0.1)",
                    borderRadius: "12px",
                    "& .MuiAccordionSummary-content": {
                      alignItems: "center",
                    },
                  }}
                >
                  <Typography
                    variant="h6"
                    sx={{ color: "#A657AE", fontWeight: 600 }}
                  >
                    {t("ninthForm.grade")} {grade} - {semesters[semesterIndex]}
                  </Typography>
                </AccordionSummary>
                <AccordionDetails sx={{ px: 3, py: 3 }}>
                  <Box
                    sx={{ display: "flex", flexDirection: "column", gap: 1 }}
                  >
                    {renderSubjectInputs(gradeKey)}
                  </Box>
                </AccordionDetails>
              </Accordion>
            );
          })}
        </Box>
      ))}
    </Box>
  );
}
