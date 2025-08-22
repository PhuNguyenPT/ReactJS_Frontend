import { useState, useImperativeHandle } from "react";
import {
  Box,
  FormControl,
  FormHelperText,
  TextField,
  Typography,
} from "@mui/material";
import { useTranslation } from "react-i18next";

export interface FifthFormRef {
  validate: () => boolean;
}

interface FifthFormProps {
  ref?: React.Ref<FifthFormRef>;
}

const FifthForm = ({ ref }: FifthFormProps) => {
  const { t } = useTranslation();

  const [minCost, setMinCost] = useState("");
  const [maxCost, setMaxCost] = useState("");
  const [hasError, setHasError] = useState(false);

  // Expose validate() to parent
  useImperativeHandle(ref, () => ({
    validate: () => {
      if (minCost.trim() && maxCost.trim()) {
        setHasError(false);
        return true;
      } else {
        setHasError(true);
        return false;
      }
    },
  }));

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
          {t("fifthForm.subTitle1")} <b>{t("fifthForm.highlight1")}</b>{" "}
          {t("fifthForm.subTitle2")}
        </Typography>
        <TextField
          value={minCost}
          onChange={(e) => {
            setMinCost(e.target.value);
          }}
          placeholder={t("fifthForm.placeholder")}
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
          {t("fifthForm.subTitle1")} <b>{t("fifthForm.highlight2")}</b>{" "}
          {t("fifthForm.subTitle2")}
        </Typography>
        <TextField
          value={maxCost}
          onChange={(e) => {
            setMaxCost(e.target.value);
          }}
          placeholder={t("fifthForm.placeholder")}
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
    </Box>
  );
};

export default FifthForm;
