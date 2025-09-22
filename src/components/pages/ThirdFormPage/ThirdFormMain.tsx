import { Box, TextField, Autocomplete, FormHelperText } from "@mui/material";
import { useTranslation } from "react-i18next";
import {
  NationalExamSubjects,
  getSelectableSubjects,
} from "../../../type/enum/national-exam-subject";

interface ThirdFormMainProps {
  mathScore: string;
  setMathScore: (value: string) => void;
  literatureScore: string;
  setLiteratureScore: (value: string) => void;
  chosenSubjects: (string | null)[];
  setChosenSubjects: (value: (string | null)[]) => void;
  chosenScores: string[];
  setChosenScores: (value: string[]) => void;
  hasError: boolean;
  setHasError: (value: boolean) => void;
}

export default function ThirdFormMain({
  mathScore,
  setMathScore,
  literatureScore,
  setLiteratureScore,
  chosenSubjects,
  setChosenSubjects,
  chosenScores,
  setChosenScores,
  hasError,
  setHasError,
}: ThirdFormMainProps) {
  const { t } = useTranslation();

  // Get selectable subjects (excluding mandatory TOAN and VAN)
  const selectableSubjects = getSelectableSubjects();

  const pillStyle = {
    borderRadius: "17px",
    height: "40px",
    "& .MuiOutlinedInput-root": {
      height: "40px",
      fontSize: "0.9rem",
      borderRadius: "17px",
      "& fieldset": {
        borderColor: "#A657AE",
        borderRadius: "17px",
      },
      "&:hover fieldset": {
        borderColor: "#8B4A8F",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#A657AE",
      },
    },
    "& input": {
      padding: "10px 16px",
      color: "#A657AE",
    },
    "& .MuiInputBase-input.Mui-disabled": {
      WebkitTextFillColor: "#A657AE",
      color: "#A657AE",
      fontWeight: "500",
    },
    "& .MuiOutlinedInput-root.Mui-disabled fieldset": {
      borderColor: "#A657AE",
    },
  };

  const subjectFieldStyle = {
    ...pillStyle,
    width: "190px",
  };

  const scoreFieldStyle = {
    ...pillStyle,
    width: "130px",
  };

  // Convert translation keys to display options for subjects
  const getTranslatedSubjectOptions = (availableOptions: string[]) => {
    return availableOptions.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get the selected subject value as an option object
  const getSelectedSubjectValue = (translationKey: string | null) => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  // Filter available subjects to exclude already selected ones
  const getAvailableSubjects = (currentIndex: number): string[] => {
    return selectableSubjects.filter((subject) => {
      // Don't show subjects that are already selected in other dropdowns
      return !chosenSubjects.some(
        (selected, index) => index !== currentIndex && selected === subject,
      );
    });
  };

  return (
    <Box
      sx={{
        position: "relative",
        display: "flex",
        flexDirection: "column",
        gap: 2,
        width: "100%",
        maxWidth: "400px",
      }}
    >
      {/* Math row - Fixed as TOAN */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          value={t(NationalExamSubjects.TOAN)} // Translate the subject name
          disabled
          sx={subjectFieldStyle}
        />
        <TextField
          placeholder={t("thirdForm.score")}
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
        <FormHelperText error sx={{ ml: 1, mt: -1.5 }}>
          {t("thirdForm.errorWarning")}
        </FormHelperText>
      )}

      {/* Literature row - Fixed as NGU_VAN */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          value={t(NationalExamSubjects.NGU_VAN)} // Translate the subject name
          disabled
          sx={subjectFieldStyle}
        />
        <TextField
          placeholder={t("thirdForm.score")}
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
        <FormHelperText error sx={{ ml: 1, mt: -1.5 }}>
          {t("thirdForm.errorWarning")}
        </FormHelperText>
      )}

      {/* Two choosable subjects */}
      {[0, 1].map((index) => {
        const availableSubjects = getAvailableSubjects(index);
        const translatedSubjectOptions =
          getTranslatedSubjectOptions(availableSubjects);
        const selectedSubjectValue = getSelectedSubjectValue(
          chosenSubjects[index],
        );

        return (
          <Box key={index}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Autocomplete
                options={translatedSubjectOptions}
                value={selectedSubjectValue}
                onChange={(_, newValue) => {
                  const translationKey = newValue?.key ?? null;
                  const updated = [...chosenSubjects];
                  updated[index] = translationKey;
                  setChosenSubjects(updated);
                  setHasError(false);
                }}
                getOptionLabel={(option) => option.label}
                isOptionEqualToValue={(option, value) =>
                  option.key === value.key
                }
                sx={subjectFieldStyle}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={`${t("thirdForm.optionalSubject")} ${String(index + 1)}`}
                    error={hasError && !chosenSubjects[index]}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        width: "190px",
                        borderRadius: "17px",
                        fontSize: "0.9rem",
                        "& fieldset": {
                          borderColor:
                            hasError && !chosenSubjects[index]
                              ? "#d32f2f"
                              : "#A657AE",
                          borderRadius: "17px",
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
                        color: "#A657AE",
                      },
                    }}
                  />
                )}
              />
              <TextField
                placeholder={t("thirdForm.score")}
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
                  {t("thirdForm.errorWarning")}
                </FormHelperText>
              )}
          </Box>
        );
      })}
    </Box>
  );
}
