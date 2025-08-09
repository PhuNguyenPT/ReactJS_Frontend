import { useState } from "react";
import { Box, TextField, Autocomplete, FormHelperText } from "@mui/material";
//import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const allSubjects = [
  "Toán",
  "Ngữ văn",
  "Ngoại ngữ",
  "Vật lý",
  "Hóa học",
  "Sinh học",
  "Lịch sử",
  "Địa lý",
  "GDCD",
];

export default function ThirdFormMain() {
  //  const navigate = useNavigate();
  const { t } = useTranslation();

  const [mathScore, setMathScore] = useState("");
  const [literatureScore, setLiteratureScore] = useState("");
  const [chosenSubjects, setChosenSubjects] = useState<(string | null)[]>([
    null,
    null,
  ]);
  const [chosenScores, setChosenScores] = useState<string[]>(["", ""]);
  const [hasError, setHasError] = useState(false);

  const pillStyle = {
    borderRadius: "25px",
    height: "40px",
    "& .MuiOutlinedInput-root": {
      height: "40px",
      fontSize: "0.9rem",
      borderRadius: "25px",
      "& fieldset": {
        borderColor: "#A657AE",
        borderRadius: "25px",
      },
      "&:hover fieldset": {
        borderColor: "#8B4A8F",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#A657AE",
      },
    },
    "& input": {
      color: "#333",
      padding: "10px 16px",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#A657AE",
      color: "#A657AE",
      fontWeight: "500",
    },
  };

  const subjectFieldStyle = {
    ...pillStyle,
    width: "200px",
  };

  const scoreFieldStyle = {
    ...pillStyle,
    width: "180px",
  };

  //  const handleNext = () => {
  //    const allFilled =
  //      mathScore.trim() !== "" &&
  //      literatureScore.trim() !== "" &&
  //      chosenSubjects.every((s) => s && s.trim() !== "") &&
  //      chosenScores.every((s) => s.trim() !== "");

  //    if (allFilled) {
  //      setHasError(false);
  //      void navigate("/summary");
  //    } else {
  //      setHasError(true);
  //    }
  //  };

  // const handlePrev = () => {
  //   void navigate("/secondForm");
  // };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "300px",
      }}
    >
      {/* Math row */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField value="Toán" disabled sx={subjectFieldStyle} />
        <TextField
          placeholder="Điểm"
          slotProps={{
            htmlInput: { min: 0, max: 10, step: 0.1 },
          }}
          value={mathScore}
          onChange={(e) => {
            setMathScore(e.target.value);
            setHasError(false);
          }}
          error={hasError && mathScore === ""}
          sx={scoreFieldStyle}
        />
      </Box>
      {hasError && mathScore === "" && (
        <FormHelperText error sx={{ ml: 1 }}>
          {t("thirdForm.errorWarning", "Vui lòng nhập điểm")}
        </FormHelperText>
      )}

      {/* Literature row */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField value="Ngữ Văn" disabled sx={subjectFieldStyle} />
        <TextField
          placeholder="Điểm"
          slotProps={{
            htmlInput: { min: 0, max: 10, step: 0.1 },
          }}
          value={literatureScore}
          onChange={(e) => {
            setLiteratureScore(e.target.value);
            setHasError(false);
          }}
          error={hasError && literatureScore === ""}
          sx={scoreFieldStyle}
        />
      </Box>
      {hasError && literatureScore === "" && (
        <FormHelperText error sx={{ ml: 1 }}>
          {t("thirdForm.errorWarning", "Vui lòng nhập điểm")}
        </FormHelperText>
      )}

      {/* Two chosen subjects */}
      {[0, 1].map((index) => (
        <Box key={index}>
          <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
            <Autocomplete
              options={allSubjects.filter(
                (s) => s !== "Toán" && s !== "Ngữ văn",
              )}
              value={chosenSubjects[index]}
              onChange={(_, newValue) => {
                const updated = [...chosenSubjects];
                updated[index] = newValue;
                setChosenSubjects(updated);
                setHasError(false);
              }}
              sx={subjectFieldStyle}
              renderInput={(params) => (
                <TextField
                  {...params}
                  placeholder={`Môn tự chọn ${String(index + 1)}`}
                  error={hasError && !chosenSubjects[index]}
                  sx={{
                    "& .MuiOutlinedInput-root": {
                      height: "40px",
                      borderRadius: "25px",
                      fontSize: "0.9rem",
                      "& fieldset": {
                        borderColor:
                          hasError && !chosenSubjects[index]
                            ? "#d32f2f"
                            : "#A657AE",
                        borderRadius: "25px",
                      },
                      "&:hover fieldset": {
                        borderColor:
                          hasError && !chosenSubjects[index]
                            ? "#d32f2f"
                            : "#8B4A8F",
                      },
                      "&.Mui-focused fieldset": {
                        borderColor:
                          hasError && !chosenSubjects[index]
                            ? "#d32f2f"
                            : "#A657AE",
                      },
                    },
                    "& input": {
                      padding: "10px 16px",
                    },
                  }}
                />
              )}
            />
            <TextField
              placeholder="Điểm"
              slotProps={{
                htmlInput: { min: 0, max: 10, step: 0.1 },
              }}
              value={chosenScores[index]}
              onChange={(e) => {
                const updated = [...chosenScores];
                updated[index] = e.target.value;
                setChosenScores(updated);
                setHasError(false);
              }}
              error={hasError && chosenScores[index] === ""}
              sx={scoreFieldStyle}
            />
          </Box>
          {hasError &&
            (!chosenSubjects[index] || chosenScores[index] === "") && (
              <FormHelperText error sx={{ ml: 1 }}>
                {t(
                  "thirdForm.errorWarning",
                  "Vui lòng chọn môn học và nhập điểm",
                )}
              </FormHelperText>
            )}
        </Box>
      ))}
    </Box>
  );
}
