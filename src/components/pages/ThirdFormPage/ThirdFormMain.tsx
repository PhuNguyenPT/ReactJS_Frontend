import { Box, TextField, Autocomplete, FormHelperText } from "@mui/material";
import { useThirdMainForm } from "../../../hooks/formPages/useThirdMainForm";

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

export default function ThirdFormMain(props: ThirdFormMainProps) {
  const {
    mathScore,
    literatureScore,
    chosenScores,
    handleMathScoreChange,
    handleLiteratureScoreChange,
    handleChosenSubjectChange,
    handleChosenScoreChange,
    getOptionalSubjectData,
    shouldShowMathError,
    shouldShowLiteratureError,
    mandatorySubjects,
    t,
  } = useThirdMainForm(props);

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
    width: "200px",
  };

  const scoreFieldStyle = {
    ...pillStyle,
    width: "150px",
    "& input[type=number]": {
      MozAppearance: "textfield",
    },
    "& input[type=number]::-webkit-outer-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
    "& input[type=number]::-webkit-inner-spin-button": {
      WebkitAppearance: "none",
      margin: 0,
    },
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
          value={mandatorySubjects.math}
          disabled
          sx={subjectFieldStyle}
        />
        <TextField
          placeholder={t("thirdForm.score")}
          type="number"
          slotProps={{
            htmlInput: { min: 0, max: 10, step: 0.1 },
          }}
          value={mathScore}
          onChange={(e) => {
            handleMathScoreChange(e.target.value);
          }}
          error={shouldShowMathError()}
          sx={scoreFieldStyle}
        />
      </Box>
      {shouldShowMathError() && (
        <FormHelperText error sx={{ ml: 1, mt: -1.5 }}>
          {t("thirdForm.errorWarning")}
        </FormHelperText>
      )}

      {/* Literature row - Fixed as NGU_VAN */}
      <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
        <TextField
          value={mandatorySubjects.literature}
          disabled
          sx={subjectFieldStyle}
        />
        <TextField
          placeholder={t("thirdForm.score")}
          type="number"
          slotProps={{
            htmlInput: { min: 0, max: 10, step: 0.1 },
          }}
          value={literatureScore}
          onChange={(e) => {
            handleLiteratureScoreChange(e.target.value);
          }}
          error={shouldShowLiteratureError()}
          sx={scoreFieldStyle}
        />
      </Box>
      {shouldShowLiteratureError() && (
        <FormHelperText error sx={{ ml: 1, mt: -1.5 }}>
          {t("thirdForm.errorWarning")}
        </FormHelperText>
      )}

      {/* Two choosable subjects */}
      {[0, 1].map((index) => {
        const {
          translatedSubjectOptions,
          selectedSubjectValue,
          showSubjectError,
          showScoreError,
          showRowError,
        } = getOptionalSubjectData(index);

        return (
          <Box key={index}>
            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
              <Autocomplete
                options={translatedSubjectOptions}
                value={selectedSubjectValue}
                onChange={(_, newValue) => {
                  handleChosenSubjectChange(index, newValue?.key ?? null);
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
                    error={showSubjectError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: "40px",
                        width: "200px",
                        borderRadius: "17px",
                        fontSize: "0.9rem",
                        "& fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#A657AE",
                          borderRadius: "17px",
                        },
                        "&:hover fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#A657AE",
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
                type="number"
                slotProps={{
                  htmlInput: { min: 0, max: 10, step: 0.1 },
                }}
                value={chosenScores[index]}
                onChange={(e) => {
                  handleChosenScoreChange(index, e.target.value);
                }}
                error={showScoreError}
                sx={scoreFieldStyle}
              />
            </Box>
            {showRowError && (
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
