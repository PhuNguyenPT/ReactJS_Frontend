import { useImperativeHandle } from "react";
import { Box, FormControl, Slider, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

export interface FifthFormRef {
  validate: () => boolean;
}

interface FifthFormProps {
  ref?: React.Ref<FifthFormRef>;
}

const FifthForm = ({ ref }: FifthFormProps) => {
  const { t } = useTranslation();
  const { formData, updateFifthForm } = useFormData();

  // Expose validate() to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      return true;
    },
  }));

  const handleSliderChange = (_: Event, newValue: number | number[]) => {
    updateFifthForm({ costRange: newValue as number[] });
  };

  const formatValue = (value: number) => {
    return `${String(value)} ${t("fifthForm.millionVND")}`;
  };

  const { costRange } = formData.fifthForm;

  return (
    <Box component="form" className="fifth-form" sx={{ position: "relative" }}>
      <FormControl fullWidth sx={{ mb: 3, width: 550, marginRight: 50 }}>
        <Typography
          sx={{
            color: "#A657AE",
            fontSize: "1.2rem",
            mb: 3,
            textAlign: "left",
          }}
        >
          {t("fifthForm.subTitle1")}
        </Typography>

        <Box sx={{ px: 2 }}>
          <Slider
            value={costRange}
            onChange={handleSliderChange}
            valueLabelFormat={formatValue}
            min={0}
            max={900}
            sx={{
              color: "#A657AE",
              maxWidth: "450px",
              height: 8,
              "& .MuiSlider-track": {
                border: "none",
                backgroundColor: "#A657AE",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#E0C4E2",
              },
              "& .MuiSlider-thumb": {
                height: 24,
                width: 24,
                backgroundColor: "#A657AE",
                border: "2px solid #fff",
                boxShadow: "0 2px 6px rgba(166, 87, 174, 0.3)",
                "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                  boxShadow: "0 4px 12px rgba(166, 87, 174, 0.4)",
                },
                "&::before": { display: "none" },
              },
            }}
          />

          {/* Min - Max labels */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: 1,
              color: "#A657AE",
              fontSize: "0.875rem",
              maxWidth: "550px",
            }}
          >
            <Typography variant="body2" sx={{ color: "#A657AE" }}>
              {formatValue(costRange[0])}
            </Typography>
            <Typography variant="body2" sx={{ color: "#A657AE" }}>
              {formatValue(costRange[1])}
            </Typography>
          </Box>

          {/* Centered result text */}
          <Box sx={{ mt: 2, textAlign: "center" }}>
            <Typography variant="h6" sx={{ color: "#A657AE", fontWeight: 500 }}>
              {`${String(costRange[0])} - ${String(costRange[1])} ${t("fifthForm.millionVND/year")}`}
            </Typography>
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
};

export default FifthForm;
