import { useState } from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useTranslation } from "react-i18next";

const SixthForm = () => {
  const { t } = useTranslation();

  // State for checkboxes
  const [checkedValues, setCheckedValues] = useState<string[]>([]);

  const handleToggle = (value: string) => {
    setCheckedValues((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    );
  };

  return (
    <Box
      component="form"
      className="sixth-form"
      sx={{
        position: "relative",
        width: 550,
        marginRight: 50,
        textAlign: "left",
      }}
    >
      {/* Checkbox group */}
      <FormControl component="fieldset" sx={{ mb: 2 }}>
        <FormGroup
          sx={{
            gap: "6px",
          }}
        >
          {[
            { key: "hero", label: t("sixthForm.option1") },
            { key: "specialSchool", label: t("sixthForm.option2") },
            { key: "poorDistrict", label: t("sixthForm.option3") },
            { key: "minority", label: t("sixthForm.option4") },
          ].map((opt) => (
            <FormControlLabel
              key={opt.key}
              control={
                <Checkbox
                  checked={checkedValues.includes(opt.key)}
                  onChange={() => {
                    handleToggle(opt.key);
                  }}
                  sx={{
                    "& .MuiSvgIcon-root": {
                      fontSize: 35,
                      stroke: "#A657AE",
                      strokeWidth: 0,
                    },
                    color: "#A657AE",
                    "&.Mui-checked": { color: "#A657AE" },
                  }}
                />
              }
              label={opt.label}
              sx={{
                alignItems: "flex-start",
                "& .MuiFormControlLabel-label": {
                  fontSize: "1.2rem",
                  fontWeight: 500,
                  marginTop: "9px",
                },
              }}
            />
          ))}
        </FormGroup>
      </FormControl>
    </Box>
  );
};

export default SixthForm;
