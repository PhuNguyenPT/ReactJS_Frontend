import React from "react";
import { Box, FormControl, Slider, Typography } from "@mui/material";
import {
  useFifthForm,
  type FifthFormRef,
} from "../../../hooks/formPages/useFifthForm";

interface FifthFormProps {
  ref?: React.Ref<FifthFormRef>;
}

const FifthForm = ({ ref }: FifthFormProps) => {
  const {
    costRange,
    handleSliderChange,
    formatValue,
    formatRangeText,
    sliderConfig,
  } = useFifthForm({ ref });

  return (
    <Box
      component="form"
      className="fifth-form"
      sx={{
        position: "relative",
        width: "100%",
      }}
    >
      <FormControl
        fullWidth
        sx={{
          mb: {
            xs: 2,
            sm: 2.5,
            md: 3,
          },
          width: "100%",
          maxWidth: {
            xs: "100%",
            sm: "480px",
            md: "550px",
          },
        }}
      >
        <Box
          sx={{
            px: {
              xs: 1,
              sm: 1.5,
              md: 2,
            },
          }}
        >
          <Slider
            value={costRange}
            onChange={handleSliderChange}
            valueLabelFormat={formatValue}
            min={sliderConfig.min}
            max={sliderConfig.max}
            sx={{
              color: "#A657AE",
              width: "100%",
              maxWidth: {
                xs: "100%",
                sm: "420px",
                md: "500px",
              },
              height: {
                xs: 6,
                sm: 7,
                md: 8,
              },
              "& .MuiSlider-track": {
                border: "none",
                backgroundColor: "#A657AE",
              },
              "& .MuiSlider-rail": {
                backgroundColor: "#E0C4E2",
              },
              "& .MuiSlider-thumb": {
                height: {
                  xs: 20,
                  sm: 22,
                  md: 24,
                },
                width: {
                  xs: 20,
                  sm: 22,
                  md: 24,
                },
                backgroundColor: "#A657AE",
                border: "2px solid #fff",
                boxShadow: "0 2px 6px rgba(166, 87, 174, 0.3)",
                "&:focus, &:hover, &.Mui-active, &.Mui-focusVisible": {
                  boxShadow: "0 4px 12px rgba(166, 87, 174, 0.4)",
                },
                "&::before": { display: "none" },
              },
              "& .MuiSlider-valueLabel": {
                fontSize: {
                  xs: "0.7rem",
                  sm: "0.75rem",
                  md: "0.875rem",
                },
                padding: {
                  xs: "4px 8px",
                  sm: "5px 10px",
                  md: "6px 12px",
                },
              },
            }}
          />

          {/* Min - Max labels */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: {
                xs: 0.75,
                sm: 0.875,
                md: 1,
              },
              color: "#A657AE",
              fontSize: {
                xs: "0.75rem",
                sm: "0.8125rem",
                md: "0.875rem",
              },
              width: "100%",
              maxWidth: {
                xs: "100%",
                sm: "480px",
                md: "550px",
              },
            }}
          >
            <Typography
              variant="body2"
              sx={{
                color: "#A657AE",
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.8125rem",
                  md: "0.875rem",
                },
              }}
            >
              {formatValue(costRange[0])}
            </Typography>
            <Typography
              variant="body2"
              sx={{
                color: "#A657AE",
                fontSize: {
                  xs: "0.75rem",
                  sm: "0.8125rem",
                  md: "0.875rem",
                },
              }}
            >
              {formatValue(costRange[1])}
            </Typography>
          </Box>

          {/* Centered result text */}
          <Box
            sx={{
              mt: {
                xs: 1.5,
                sm: 1.75,
                md: 2,
              },
              textAlign: "center",
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#A657AE",
                fontWeight: 500,
                fontSize: {
                  xs: "1rem",
                  sm: "1.15rem",
                  md: "1.25rem",
                },
              }}
            >
              {formatRangeText(costRange)}
            </Typography>
          </Box>
        </Box>
      </FormControl>
    </Box>
  );
};

export default FifthForm;
