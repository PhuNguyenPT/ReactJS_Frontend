import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Button,
  FormHelperText,
  TextField,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VietnamSouthernProvinces } from "../../../type/enum/vietnamese.provinces";

const FirstForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProvinces, setSelectedProvinces] = useState<string | null>(
    null,
  );
  const [hasError, setHasError] = useState(false);

  // Convert enum to array of values
  const provinces = useMemo(() => Object.values(VietnamSouthernProvinces), []);

  const handleNext = () => {
    if (selectedProvinces) {
      setHasError(false);
      void navigate("/secondForm");
    } else {
      setHasError(true);
    }
  };

  return (
    <Box component="form" className="first-form">
      <FormControl fullWidth error={hasError}>
        <Autocomplete
          options={provinces}
          value={selectedProvinces}
          onChange={(_, newValue) => {
            setSelectedProvinces(newValue);
            setHasError(false);
          }}
          sx={{
            width: 450,
            marginRight: 50,
          }}
          filterSelectedOptions
          renderInput={(params) => (
            <TextField
              {...params}
              placeholder={t("firstForm.selectProvince")}
              error={hasError}
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
          )}
        />
        <FormHelperText sx={{ minHeight: "1.5em" }}>
          {hasError ? t("firstForm.errorWarning") : " "}
        </FormHelperText>
      </FormControl>

      <Button
        variant="contained"
        sx={{
          mt: 4,
          px: 3,
          py: 1,
          borderRadius: 2,
          fontSize: "1.1rem",
          backgroundColor: "#A657AE",
          textTransform: "none",
          fontWeight: "bold",
          marginLeft: 18.5,
          marginTop: 22,
          "&:hover": {
            backgroundColor: "#8B4A8F",
          },
        }}
        onClick={handleNext}
      >
        {t("firstForm.enterButton")}
      </Button>
    </Box>
  );
};

export default FirstForm;
