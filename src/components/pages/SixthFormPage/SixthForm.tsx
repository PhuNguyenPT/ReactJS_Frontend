import React from "react";
import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { useSixthForm } from "../../../hooks/formPages/useSixthForm";

const SixthForm: React.FC = () => {
  const { specialStudentOptions, handleToggle, isChecked } = useSixthForm();

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
          {specialStudentOptions.map((opt) => (
            <FormControlLabel
              key={opt.key}
              control={
                <Checkbox
                  checked={isChecked(opt.value)}
                  onChange={() => {
                    handleToggle(opt.value);
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
