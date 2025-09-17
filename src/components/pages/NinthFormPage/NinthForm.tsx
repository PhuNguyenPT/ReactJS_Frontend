import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useTranslation } from "react-i18next";

type SubjectScores = Record<string, string>;
type GradeScores = Record<string, SubjectScores>;

export default function NinthForm() {
  const { t } = useTranslation();

  // Fixed subjects
  const fixedSubjects = ["Toán", "Ngữ Văn", "Tiếng Anh", "Lịch sử"];

  // Subjects available for dropdown
  const optionalSubjects = [
    "Địa lý",
    "Giáo dục công dân",
    "Vật lý",
    "Hóa học",
    "Sinh học",
    "Công nghệ",
    "Tin học",
    "Giáo dục thể chất",
  ];

  const grades = ["10", "11", "12"];
  const semesters = [t("ninthForm.semester1"), t("ninthForm.semester2")];

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

  const handleScoreChange = (
    gradeKey: string,
    subject: string,
    value: string,
  ) => {
    setScores((prev) => ({
      ...prev,
      [gradeKey]: {
        ...prev[gradeKey],
        [subject]: value,
      },
    }));
  };

  const handleSubjectSelect = (
    gradeKey: string,
    index: number,
    newSubject: string | null,
  ) => {
    setSelectedSubjects((prev) => {
      const updated = [...prev[gradeKey]];
      updated[index] = newSubject;
      return { ...prev, [gradeKey]: updated };
    });
  };

  const renderSubjectInputs = (gradeKey: string) => (
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
                backgroundColor: "white",
                "& fieldset": { borderColor: "#A657AE" },
                "&:hover fieldset": { borderColor: "#8B4A8F" },
                "&.Mui-focused fieldset": { borderColor: "#A657AE" },
              },
              "& input": { color: "#A657AE" },
            }}
            slotProps={{
              htmlInput: {
                pattern: "[0-9]+(\\.[0-9]+)?",
                title: "Nhập điểm số (ví dụ: 8.5)",
              },
            }}
          />
        </Box>
      ))}

      {/* Optional subjects with Autocomplete */}
      {selectedSubjects[gradeKey].map((subject, idx) => (
        <Box
          key={`${gradeKey}-dropdown-${String(idx)}`}
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
                backgroundColor: "white",
                "& fieldset": { borderColor: "#A657AE" },
                "&:hover fieldset": { borderColor: "#8B4A8F" },
                "&.Mui-focused fieldset": { borderColor: "#A657AE" },
              },
              "& input": { color: "#A657AE" },
            }}
            slotProps={{
              htmlInput: {
                pattern: "[0-9]+(\\.[0-9]+)?",
                title: "Nhập điểm số (ví dụ: 8.5)",
              },
            }}
          />
        </Box>
      ))}
    </>
  );

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
      }}
    >
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
