import { useState } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  IconButton,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

const FifthForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [hasError, setHasError] = useState(false);

  const handleNext = () => {
    if (minCost.trim() && maxCost.trim()) {
      setHasError(false);
      void navigate("/sixthForm");
    } else {
      setHasError(true);
    }
  };

  const handlePrev = () => {
    void navigate("/fourthForm");
  };

  return (
    <Box
      component="form"
      className="fifth-form"
      sx={{
        position: "relative",
      }}
    >
      {/* Min cost */}
      <FormControl
        fullWidth
        error={hasError && !minCost.trim()}
        sx={{ mb: 3, width: 450, marginRight: 50 }}
      >
        <Typography
          sx={{ color: "#A657AE", fontSize: "1rem", mb: 1, textAlign: "left" }}
        >
          Trong một năm, gia đình bạn có thể chi <b>tối thiểu</b> bao nhiêu tiền
          cho học phí?
        </Typography>
        <TextField
          value={minCost}
          onChange={(e) => {
            setMinCost(e.target.value);
          }}
          placeholder="Theo VNĐ (ví dụ: 1000000, 15000000,...)"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              "& fieldset": {
                borderColor: "#A657AE",
              },
              "&:hover fieldset": {
                borderColor: "#8B4A8F",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#A657AE",
              },
            },
            "& input": {
              color: "#A657AE",
            },
          }}
        />
        <FormHelperText sx={{ minHeight: "1.5em" }}>
          {hasError && !minCost.trim() ? t("fifthForm.errorWarning") : " "}
        </FormHelperText>
      </FormControl>

      {/* Max cost */}
      <FormControl
        fullWidth
        error={hasError && !maxCost.trim()}
        sx={{ mb: 1, width: 450, marginRight: 50 }}
      >
        <Typography
          sx={{ color: "#A657AE", fontSize: "1rem", mb: 1, textAlign: "left" }}
        >
          Trong một năm, gia đình bạn có thể chi <b>tối đa</b> bao nhiêu tiền
          cho học phí?
        </Typography>
        <TextField
          value={maxCost}
          onChange={(e) => {
            setMaxCost(e.target.value);
          }}
          placeholder="Theo VNĐ (ví dụ: 1000000, 15000000,...)"
          sx={{
            "& .MuiOutlinedInput-root": {
              borderRadius: 999,
              "& fieldset": {
                borderColor: "#A657AE",
              },
              "&:hover fieldset": {
                borderColor: "#8B4A8F",
              },
              "&.Mui-focused fieldset": {
                borderColor: "#A657AE",
              },
            },
            "& input": {
              color: "#A657AE",
            },
          }}
        />
        <FormHelperText sx={{ minHeight: "1.5em" }}>
          {hasError && !maxCost.trim() ? t("fifthForm.errorWarning") : " "}
        </FormHelperText>
      </FormControl>

      {/* Navigation buttons */}
      <Box
        sx={{
          position: "relative",
          display: "flex",
          gap: 0.3,
          marginLeft: 58,
          marginTop: 0.5,
        }}
      >
        <IconButton
          onClick={handlePrev}
          sx={{
            height: 40,
            width: 40,
            backgroundColor: "#A657AE",
            color: "white",
            "&:hover": { backgroundColor: "#8B4A8F" },
            borderRadius: 1,
          }}
        >
          <ArrowBackIosNewIcon fontSize="small" />
        </IconButton>
        <IconButton
          onClick={handleNext}
          sx={{
            height: 40,
            width: 40,
            backgroundColor: "#A657AE",
            color: "white",
            "&:hover": { backgroundColor: "#8B4A8F" },
            borderRadius: 1,
          }}
        >
          <ArrowForwardIosIcon fontSize="small" />
        </IconButton>
      </Box>
    </Box>
  );
};

export default FifthForm;
