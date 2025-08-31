import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
import { useTranslation } from "react-i18next";

interface GradeValues {
  kqrl: string;
  hocLuc: string;
}

interface GradeErrors {
  kqrl: boolean;
  hocLuc: boolean;
}

type GradeKey = "10" | "11" | "12";

interface SeventhFormProps {
  onChange: (grade: GradeKey, field: keyof GradeValues, value: string) => void;
  errors: Record<GradeKey, GradeErrors>;
  values: Record<GradeKey, GradeValues>;
  shouldValidate?: boolean;
}

export default function SeventhForm({
  onChange,
  errors,
  values,
  shouldValidate = false,
}: SeventhFormProps) {
  const { t } = useTranslation();

  const kqrlOptions = ["Tốt", "Khá", "Đạt", "Chưa đạt"];
  const hocLucOptions = ["Giỏi", "Khá", "Trung bình", "Yếu", "Kém"];

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
          <Box sx={{ display: "flex", gap: 5 }}>
            {/* Kết quả rèn luyện*/}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Autocomplete
                options={kqrlOptions}
                value={values[grade.key].kqrl || null}
                onChange={(_, newValue) => {
                  onChange(grade.key, "kqrl", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("seventhForm.practiceResults")}
                    error={errors[grade.key].kqrl && shouldValidate}
                    sx={{
                      width: 190,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": {
                          borderColor:
                            errors[grade.key].kqrl && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            errors[grade.key].kqrl && shouldValidate
                              ? "#d32f2f"
                              : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            errors[grade.key].kqrl && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
              />
              {errors[grade.key].kqrl && shouldValidate && (
                <FormHelperText error sx={{ ml: 0 }}>
                  {t("seventhForm.errorWarning2")}
                </FormHelperText>
              )}
            </Box>

            {/* Học lực */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Autocomplete
                options={hocLucOptions}
                value={values[grade.key].hocLuc || null}
                onChange={(_, newValue) => {
                  onChange(grade.key, "hocLuc", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder={t("seventhForm.academicScore")}
                    error={errors[grade.key].hocLuc && shouldValidate}
                    sx={{
                      width: 190,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": {
                          borderColor:
                            errors[grade.key].hocLuc && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            errors[grade.key].hocLuc && shouldValidate
                              ? "#d32f2f"
                              : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            errors[grade.key].hocLuc && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
              />
              {errors[grade.key].hocLuc && shouldValidate && (
                <FormHelperText error sx={{ ml: 0 }}>
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
