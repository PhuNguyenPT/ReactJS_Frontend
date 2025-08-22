import {
  Box,
  TextField,
  Typography,
  Autocomplete,
  FormHelperText,
} from "@mui/material";
//import { useTranslation } from "react-i18next";

interface GradeValues {
  hanhKiem: string;
  hocLuc: string;
}

interface GradeErrors {
  hanhKiem: boolean;
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
  //const { t } = useTranslation();

  const hanhKiemOptions = ["Tốt", "Khá", "Trung bình", "Yếu"];
  const hocLucOptions = ["Giỏi", "Khá", "Trung bình", "Yếu", "Kém"];

  const grades = [
    {
      key: "10" as GradeKey,
      label: "Vui lòng nhập hạnh kiểm và học lực năm lớp 10 của bạn",
    },
    {
      key: "11" as GradeKey,
      label: "Vui lòng nhập hạnh kiểm và học lực năm lớp 11 của bạn",
    },
    {
      key: "12" as GradeKey,
      label: "Vui lòng nhập hạnh kiểm và học lực năm lớp 12 của bạn",
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
          <Box sx={{ display: "flex", gap: 2 }}>
            {/* Hạnh kiểm */}
            <Box sx={{ display: "flex", flexDirection: "column" }}>
              <Autocomplete
                options={hanhKiemOptions}
                value={values[grade.key].hanhKiem || null}
                onChange={(_, newValue) => {
                  onChange(grade.key, "hanhKiem", newValue ?? "");
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    placeholder="Hạnh kiểm"
                    error={errors[grade.key].hanhKiem && shouldValidate}
                    sx={{
                      width: 150,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": {
                          borderColor:
                            errors[grade.key].hanhKiem && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                        "&:hover fieldset": {
                          borderColor:
                            errors[grade.key].hanhKiem && shouldValidate
                              ? "#d32f2f"
                              : "#8B4A8F",
                        },
                        "&.Mui-focused fieldset": {
                          borderColor:
                            errors[grade.key].hanhKiem && shouldValidate
                              ? "#d32f2f"
                              : "#A657AE",
                        },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                )}
              />
              {errors[grade.key].hanhKiem && shouldValidate && (
                <FormHelperText error sx={{ ml: 0 }}>
                  Bạn phải chọn hạnh kiểm
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
                    placeholder="Học lực"
                    error={errors[grade.key].hocLuc && shouldValidate}
                    sx={{
                      width: 150,
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
                  Bạn phải chọn học lực
                </FormHelperText>
              )}
            </Box>
          </Box>
        </Box>
      ))}
    </Box>
  );
}
