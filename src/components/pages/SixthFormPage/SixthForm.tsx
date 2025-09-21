import {
  Box,
  FormControl,
  FormGroup,
  FormControlLabel,
  Checkbox,
} from "@mui/material";
import { SpecialStudentCase } from "../../../type/enum/special.student.case";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

const SixthForm = () => {
  const { formData, updateSixthForm } = useFormData();

  // Get current checked values from context
  const checkedValues = formData.sixthForm.specialStudentCases;

  const handleToggle = (value: string) => {
    const newCheckedValues = checkedValues.includes(value)
      ? checkedValues.filter((v) => v !== value)
      : [...checkedValues, value];

    updateSixthForm({ specialStudentCases: newCheckedValues });
  };

  // Define the options using the SpecialStudentCase enum
  const specialStudentOptions = [
    {
      key: "HEROES_AND_CONTRIBUTORS",
      value: SpecialStudentCase.HEROES_AND_CONTRIBUTORS,
      label: SpecialStudentCase.HEROES_AND_CONTRIBUTORS,
    },
    {
      key: "TRANSFER_STUDENT",
      value: SpecialStudentCase.TRANSFER_STUDENT,
      label: SpecialStudentCase.TRANSFER_STUDENT,
    },
    {
      key: "ETHNIC_MINORITY_STUDENT",
      value: SpecialStudentCase.ETHNIC_MINORITY_STUDENT,
      label: SpecialStudentCase.ETHNIC_MINORITY_STUDENT,
    },
    {
      key: "VERY_FEW_ETHNIC_MINORITY",
      value: SpecialStudentCase.VERY_FEW_ETHNIC_MINORITY,
      label: SpecialStudentCase.VERY_FEW_ETHNIC_MINORITY,
    },
  ];

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
                  checked={checkedValues.includes(opt.value)}
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
