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
        width: "100%",
        maxWidth: {
          xs: "100%",
          sm: "480px",
          md: "550px",
        },
        textAlign: "left",
      }}
    >
      {/* Checkbox group */}
      <FormControl
        component="fieldset"
        sx={{
          mb: {
            xs: 1.5,
            sm: 1.75,
            md: 2,
          },
          width: "100%",
        }}
      >
        <FormGroup
          sx={{
            gap: {
              xs: "4px",
              sm: "5px",
              md: "6px",
            },
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
                      fontSize: {
                        xs: 28,
                        sm: 32,
                        md: 35,
                      },
                      stroke: "#A657AE",
                      strokeWidth: 0,
                    },
                    color: "#A657AE",
                    "&.Mui-checked": { color: "#A657AE" },
                    padding: {
                      xs: "6px",
                      sm: "8px",
                      md: "9px",
                    },
                  }}
                />
              }
              label={opt.label}
              sx={{
                alignItems: "flex-start",
                marginLeft: 0,
                marginRight: 0,
                "& .MuiFormControlLabel-label": {
                  fontFamily: "Montserrat",
                  fontSize: {
                    xs: "0.95rem",
                    sm: "1.05rem",
                    md: "1.2rem",
                  },
                  fontWeight: 500,
                  marginTop: {
                    xs: "7px",
                    sm: "8px",
                    md: "9px",
                  },
                  lineHeight: {
                    xs: 1.4,
                    sm: 1.4,
                    md: 1.5,
                  },
                  color: "#A657AE",
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
