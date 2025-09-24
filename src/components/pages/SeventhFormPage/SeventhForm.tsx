import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AcademicPerformance } from "../../../type/enum/academic-performance";
import { Conduct } from "../../../type/enum/conduct";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";
import type { GradeKey } from "../../../contexts/FormDataContext/FormDataContext";

interface SeventhFormProps {
  shouldValidate?: boolean;
}

export default function SeventhForm({
  shouldValidate = false,
}: SeventhFormProps) {
  const { t } = useTranslation();
  const { formData, updateSeventhFormGrade } = useFormData();

  const conductOptions = Object.values(Conduct);
  const academicPerformanceOptions = Object.values(AcademicPerformance);

  // Convert translation keys to display options
  const getTranslatedOptions = (options: string[]) => {
    return options.map((translationKey) => ({
      key: translationKey,
      label: t(translationKey),
    }));
  };

  // Get selected value as option object
  const getSelectedValue = (translationKey: string | null) => {
    if (!translationKey) return null;
    return {
      key: translationKey,
      label: t(translationKey),
    };
  };

  const translatedConductOptions = getTranslatedOptions(conductOptions);
  const translatedAcademicPerformanceOptions = getTranslatedOptions(
    academicPerformanceOptions,
  );

  const grades = [
    { key: "10" as GradeKey, label: t("seventhForm.subTitle10") },
    { key: "11" as GradeKey, label: t("seventhForm.subTitle11") },
    { key: "12" as GradeKey, label: t("seventhForm.subTitle12") },
  ];

  const { grades: values } = formData.seventhForm;

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: 3,
        alignItems: "flex-start",
        width: "100%",
      }}
    >
      {grades.map((grade) => {
        const conductEmpty = shouldValidate && values[grade.key].conduct === "";
        const performanceEmpty =
          shouldValidate && values[grade.key].academicPerformance === "";

        const selectedConductValue = getSelectedValue(
          values[grade.key].conduct || null,
        );
        const selectedPerformanceValue = getSelectedValue(
          values[grade.key].academicPerformance || null,
        );

        return (
          <Box
            key={grade.key}
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 1,
              width: "100%",
            }}
          >
            {/* Subtitle */}
            <Typography
              variant="body1"
              sx={{ mb: 1, color: "#A657AE", textAlign: "left" }}
            >
              {grade.label}
            </Typography>

            {/* Dropdowns */}
            <Box sx={{ display: "flex", gap: 3 }}>
              {/* Conduct (Kết quả rèn luyện) */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Autocomplete
                  options={translatedConductOptions}
                  value={selectedConductValue}
                  onChange={(_, newValue) => {
                    const translationKey = newValue?.key ?? "";
                    updateSeventhFormGrade(
                      grade.key,
                      "conduct",
                      translationKey,
                    );
                  }}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.key === value.key
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("seventhForm.practiceResults")}
                      error={conductEmpty}
                      sx={{
                        width: 230,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
                          "& fieldset": {
                            borderColor: conductEmpty ? "#d32f2f" : "#A657AE",
                          },
                          "&:hover fieldset": {
                            borderColor: conductEmpty ? "#d32f2f" : "#8B4A8F",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: conductEmpty ? "#d32f2f" : "#A657AE",
                          },
                        },
                        "& input": { color: "#A657AE" },
                      }}
                    />
                  )}
                />
                {conductEmpty && (
                  <FormHelperText
                    error
                    sx={{ ml: 0, mr: 0, mt: 0.5, textAlign: "left" }}
                  >
                    {t("seventhForm.errorWarning2")}
                  </FormHelperText>
                )}
              </Box>

              {/* Academic Performance (Học lực) */}
              <Box sx={{ display: "flex", flexDirection: "column" }}>
                <Autocomplete
                  options={translatedAcademicPerformanceOptions}
                  value={selectedPerformanceValue}
                  onChange={(_, newValue) => {
                    const translationKey = newValue?.key ?? "";
                    updateSeventhFormGrade(
                      grade.key,
                      "academicPerformance",
                      translationKey,
                    );
                  }}
                  getOptionLabel={(option) => option.label}
                  isOptionEqualToValue={(option, value) =>
                    option.key === value.key
                  }
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={t("seventhForm.academicScore")}
                      error={performanceEmpty}
                      sx={{
                        width: 240,
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
                          "& fieldset": {
                            borderColor: performanceEmpty
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                          "&:hover fieldset": {
                            borderColor: performanceEmpty
                              ? "#d32f2f"
                              : "#8B4A8F",
                          },
                          "&.Mui-focused fieldset": {
                            borderColor: performanceEmpty
                              ? "#d32f2f"
                              : "#A657AE",
                          },
                        },
                        "& input": { color: "#A657AE" },
                      }}
                    />
                  )}
                />
                {performanceEmpty && (
                  <FormHelperText
                    error
                    sx={{ ml: 0, mr: 0, mt: 0.5, textAlign: "left" }}
                  >
                    {t("seventhForm.errorWarning1")}
                  </FormHelperText>
                )}
              </Box>
            </Box>
          </Box>
        );
      })}
    </Box>
  );
}
