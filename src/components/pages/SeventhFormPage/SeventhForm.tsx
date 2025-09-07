import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";
import { AcademicPerformance } from "../../../type/enum/academic.performance";
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

  const grades = [
    {
      key: "10" as GradeKey,
      label: t("seventhForm.subTitle10"),
    },
    {
      key: "11" as GradeKey,
      label: t("seventhForm.subTitle11"),
    },
    {
      key: "12" as GradeKey,
      label: t("seventhForm.subTitle12"),
    },
  ];

  // Get values and errors from context
  const { grades: values, errors } = formData.seventhForm;

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
      {grades.map((grade) => (
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
                options={conductOptions}
                value={values[grade.key].conduct || null}
                onChange={(_, newValue) => {
                  updateSeventhFormGrade(grade.key, "conduct", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("seventhForm.practiceResults")}
                    error={errors[grade.key].conduct && shouldValidate}
                    sx={{
                      width: 230,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": {
                          borderColor:
                            errors[grade.key].conduct && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            errors[grade.key].conduct && shouldValidate
                              ? "#d32f2f"
                              : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            errors[grade.key].conduct && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
              />
              {errors[grade.key].conduct && shouldValidate && (
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
                options={academicPerformanceOptions}
                value={values[grade.key].academicPerformance || null}
                onChange={(_, newValue) => {
                  updateSeventhFormGrade(
                    grade.key,
                    "academicPerformance",
                    newValue ?? "",
                  );
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("seventhForm.academicScore")}
                    error={
                      errors[grade.key].academicPerformance && shouldValidate
                    }
                    sx={{
                      width: 240,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": {
                          borderColor:
                            errors[grade.key].academicPerformance &&
                            shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            errors[grade.key].academicPerformance &&
                            shouldValidate
                              ? "#d32f2f"
                              : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            errors[grade.key].academicPerformance &&
                            shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
              />
              {errors[grade.key].academicPerformance && shouldValidate && (
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
      ))}
    </Box>
  );
}
