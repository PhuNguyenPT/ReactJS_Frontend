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

type SubjectScores = Record<string, string>;
type GradeScores = Record<string, SubjectScores>;

export default function NinthForm() {
  const { t } = useTranslation();
  const location = useLocation();
  const navigationState = location.state as
    | NinthFormNavigationState
    | undefined;

  // Fixed subjects - memoized to prevent recreation on every render
  const fixedSubjects = useMemo(
    () => ["Toán", "Ngữ Văn", "Tiếng Anh", "Lịch sử"],
    [],
  );

  // Subjects available for dropdown - memoized to prevent recreation on every render
  const optionalSubjects = useMemo(
    () => [
      "Địa lý",
      "Giáo dục công dân",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Công nghệ",
      "Tin học",
      "GDKTPL",
    ],
    [],
  );

  // Grades and semesters - memoized for consistency
  const grades = useMemo(() => ["10", "11", "12"], []);
  const semesters = useMemo(
    () => [t("ninthForm.semester1"), t("ninthForm.semester2")],
    [t],
  );

  const [scores, setScores] = useState<GradeScores>({
    "10-1": {},
    "10-2": {},
    "11-1": {},
    "11-2": {},
    "12-1": {},
    "12-2": {},
  });

  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, (string | null)[]>
  >({
    "10-1": [null, null, null, null],
    "10-2": [null, null, null, null],
    "11-1": [null, null, null, null],
    "11-2": [null, null, null, null],
    "12-1": [null, null, null, null],
    "12-2": [null, null, null, null],
  });

  const [hasOcrData, setHasOcrData] = useState(false);
  const [ocrLoadMessage, setOcrLoadMessage] = useState<string | null>(null);

  /**
   * Load OCR data into the form
   * Maps OCR results to grade-semester format
   * Using useCallback to memoize the function and avoid recreation on every render
   */
  const loadOcrData = useCallback(
    (ocrResults: OcrResultItem[]) => {
      try {
        // Filter out results without scores
        const validResults = ocrResults.filter(
          (result) => result.scores && result.scores.length > 0,
        );

        if (validResults.length === 0) {
          setOcrLoadMessage("No OCR data available to load");
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
            const subjectName = scoreItem.name;
            const scoreValue = scoreItem.score.toString();

            // Check if it's a fixed subject
            const isFixedSubject = fixedSubjects.includes(subjectName);
            const isOptionalSubject = optionalSubjects.includes(subjectName);

            if (isFixedSubject) {
              // Add to fixed subjects scores
              newScores[gradeKey][subjectName] = scoreValue;
            } else if (isOptionalSubject) {
              // Add to optional subjects
              newScores[gradeKey][subjectName] = scoreValue;
              optionalSubjectsForGrade.push(subjectName);
            } else {
              // Subject not in either list - show warning
              console.warn(
                `[NinthForm] Unknown subject from OCR: ${subjectName} (not found in fixed or optional subjects)`,
              );
              // Still add it to optional subjects so data isn't lost
              newScores[gradeKey][subjectName] = scoreValue;
              optionalSubjectsForGrade.push(subjectName);
            }
          });

          // Pad with nulls to have 4 optional subject slots
          while (optionalSubjectsForGrade.length < 4) {
            optionalSubjectsForGrade.push(null);
          }

          newSelectedSubjects[gradeKey] = optionalSubjectsForGrade;
        });

        setScores(newScores);
        setSelectedSubjects(newSelectedSubjects);
        setHasOcrData(true);
        setOcrLoadMessage(
          `Successfully loaded scores from ${String(validResults.length)} transcript${
            validResults.length > 1 ? "s" : ""
          }. Please review and edit if needed.`,
        );

        console.log("[NinthForm] OCR data loaded successfully");
      } catch (error) {
        console.error("[NinthForm] Error loading OCR data:", error);
        setOcrLoadMessage(
          "Error loading OCR data. Please enter scores manually.",
        );
      }
    },
    [fixedSubjects, optionalSubjects],
  );

  // Load OCR data on component mount
  useEffect(() => {
    if (navigationState?.ocrProcessed && navigationState.ocrResults) {
      console.log("[NinthForm] Loading OCR data...");
      loadOcrData(navigationState.ocrResults);
    }
  }, [navigationState?.ocrProcessed, navigationState?.ocrResults, loadOcrData]);

  const handleScoreChange = useCallback(
    (gradeKey: string, subject: string, value: string) => {
      setScores((prev) => ({
        ...prev,
        [gradeKey]: {
          ...prev[gradeKey],
          [subject]: value,
        },
      }));
    },
    [],
  );

  const handleSubjectSelect = useCallback(
    (gradeKey: string, index: number, newSubject: string | null) => {
      setSelectedSubjects((prev) => {
        const updated = [...prev[gradeKey]];
        const oldSubject = updated[index];

        // If changing subject, remove old subject's score
        if (oldSubject && oldSubject !== newSubject) {
          setScores((prevScores) => {
            // Use object destructuring to omit the old subject instead of delete
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
            const { [oldSubject]: _, ...restScores } = prevScores[gradeKey];
            return {
              ...prevScores,
              [gradeKey]: restScores,
            };
          });
        }

        updated[index] = newSubject;
        return { ...prev, [gradeKey]: updated };
      });
    },
    [],
  );

  const renderSubjectInputs = useCallback(
    (gradeKey: string) => (
      <>
        {/* Fixed subjects */}
        {fixedSubjects.map((subject) => (
          <Box
            key={subject}
            sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}
          >
            {/* Subject pill (same look as Autocomplete) */}
            <TextField
              value={subject}
              disabled
              sx={{
                width: 180,
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "40px",
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
              value={scores[gradeKey][subject] || ""}
              onChange={(e) => {
                handleScoreChange(gradeKey, subject, e.target.value);
              }}
              sx={{
                minWidth: "120px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "40px",
                  backgroundColor:
                    hasOcrData && scores[gradeKey][subject]
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
        {selectedSubjects[gradeKey].map((subject, idx) => (
          <Box
            key={`dropdown-${String(idx)}`}
            sx={{ display: "flex", alignItems: "center", gap: 5, mb: 1 }}
          >
            <Autocomplete
              options={optionalSubjects}
              value={subject}
              onChange={(_, newValue) => {
                handleSubjectSelect(gradeKey, idx, newValue);
              }}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={t("ninthForm.chooseSubject")}
                  sx={{
                    width: 180,
                    "& .MuiOutlinedInput-root": {
                      borderRadius: "17px",
                      height: "40px",
                      backgroundColor:
                        hasOcrData && subject
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
              value={subject ? scores[gradeKey][subject] || "" : ""}
              onChange={(e) => {
                if (subject) {
                  handleScoreChange(gradeKey, subject, e.target.value);
                }
              }}
              disabled={!subject}
              sx={{
                minWidth: "120px",
                "& .MuiOutlinedInput-root": {
                  borderRadius: "17px",
                  height: "40px",
                  backgroundColor:
                    hasOcrData && subject && scores[gradeKey][subject]
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

  const handleCloseAlert = useCallback(() => {
    setOcrLoadMessage(null);
  }, []);

  return (
    <Box
      className="ninth-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        maxWidth: "800px",
        margin: "0 auto",
        px: 2,
        py: 3,
      }}
    >
      {/* OCR Load Status Message */}
      {ocrLoadMessage && (
        <Alert
          severity={hasOcrData ? "success" : "info"}
          onClose={handleCloseAlert}
          sx={{ mb: 2 }}
        >
          {ocrLoadMessage}
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
