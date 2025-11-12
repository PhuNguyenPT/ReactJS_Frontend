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
    borderRadius: {
      xs: "12px",
      sm: "15px",
      md: "17px",
    },
    height: {
      xs: "36px",
      sm: "38px",
      md: "40px",
    },
    "& .MuiOutlinedInput-root": {
      height: {
        xs: "36px",
        sm: "38px",
        md: "40px",
      },
      fontSize: {
        xs: "0.8rem",
        sm: "0.85rem",
        md: "0.9rem",
      },
      borderRadius: {
        xs: "12px",
        sm: "15px",
        md: "17px",
      },
      "& fieldset": {
        borderColor: "#A657AE",
        borderRadius: {
          xs: "12px",
          sm: "15px",
          md: "17px",
        },
      },
      "&:hover fieldset": {
        borderColor: "#8B4A8F",
      },
      "&.Mui-focused fieldset": {
        borderColor: "#A657AE",
      },
    },
    "& input": {
      padding: {
        xs: "8px 12px",
        sm: "9px 14px",
        md: "10px 16px",
      },
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
    width: {
      xs: "140px",
      sm: "170px",
      md: "200px",
    },
  };

  const scoreFieldStyle = {
    ...pillStyle,
    width: {
      xs: "110px",
      sm: "130px",
      md: "150px",
    },
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
        gap: {
          xs: 1.5,
          sm: 1.75,
          md: 2,
        },
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "380px",
          md: "400px",
        },
      }}
    >
      {/* Math row - Fixed as TOAN */}
      <Box
        sx={{
          display: "flex",
          gap: {
            xs: 0.5,
            sm: 0.75,
            md: 1,
          },
          alignItems: "center",
          flexWrap: {
            xs: "wrap",
            sm: "nowrap",
          },
        }}
      >
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
        <FormHelperText
          error
          sx={{
            ml: 1,
            mt: -1.5,
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
              md: "0.75rem",
            },
          }}
        >
          {t("thirdForm.errorWarning")}
        </FormHelperText>
      )}

      {/* Literature row - Fixed as NGU_VAN */}
      <Box
        sx={{
          display: "flex",
          gap: {
            xs: 0.5,
            sm: 0.75,
            md: 1,
          },
          alignItems: "center",
          flexWrap: {
            xs: "wrap",
            sm: "nowrap",
          },
        }}
      >
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
        <FormHelperText
          error
          sx={{
            ml: 1,
            mt: -1.5,
            fontSize: {
              xs: "0.7rem",
              sm: "0.75rem",
              md: "0.75rem",
            },
          }}
        >
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
            <Box
              sx={{
                display: "flex",
                gap: {
                  xs: 0.5,
                  sm: 0.75,
                  md: 1,
                },
                alignItems: "center",
                flexWrap: {
                  xs: "wrap",
                  sm: "nowrap",
                },
              }}
            >
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
                sx={{
                  width: {
                    xs: "140px",
                    sm: "170px",
                    md: "200px",
                  },
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={`${t("thirdForm.optionalSubject")} ${String(index + 1)}`}
                    error={showSubjectError}
                    sx={{
                      "& .MuiOutlinedInput-root": {
                        height: {
                          xs: "36px",
                          sm: "38px",
                          md: "40px",
                        },
                        width: {
                          xs: "140px",
                          sm: "170px",
                          md: "200px",
                        },
                        borderRadius: {
                          xs: "12px",
                          sm: "15px",
                          md: "17px",
                        },
                        fontSize: {
                          xs: "0.8rem",
                          sm: "0.85rem",
                          md: "0.9rem",
                        },
                        "& fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#A657AE",
                          borderRadius: {
                            xs: "12px",
                            sm: "15px",
                            md: "17px",
                          },
                        },
                        "&:hover fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor: showSubjectError ? "#d32f2f" : "#A657AE",
                        },
                      },
                      "& input": {
                        padding: {
                          xs: "8px 12px",
                          sm: "9px 14px",
                          md: "10px 16px",
                        },
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
              <FormHelperText
                error
                sx={{
                  ml: 1,
                  fontSize: {
                    xs: "0.7rem",
                    sm: "0.75rem",
                    md: "0.75rem",
                  },
                }}
              >
                {t("thirdForm.errorWarning")}
              </FormHelperText>
            )}
          </Box>
        );
      })}
    </Box>
  );
}
