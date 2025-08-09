import { useState, useMemo } from "react";
import {
  Box,
  FormControl,
  Button,
  FormHelperText,
  TextField,
} from "@mui/material";
import { Autocomplete } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { VietnamSouthernProvinces } from "../../../type/enum/vietnamese.provinces";

const FirstForm = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [selectedProvinces, setSelectedProvinces] = useState<string[]>([]);
  const [hasError, setHasError] = useState(false);

  // Convert enum to array of values
  const provinces = useMemo(() => Object.values(VietnamSouthernProvinces), []);

  const handleNext = () => {
    if (selectedProvinces.length > 0) {
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
          multiple
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
              label={t("firstForm.selectProvince")}
              placeholder={t("firstForm.selectProvince")}
              error={hasError}
              sx={{
                "& .MuiOutlinedInput-root": {
                  borderRadius: 999,
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
          px: 4,
          py: 1,
          borderRadius: 2,
          fontSize: "1.1rem",
          backgroundColor: "#A657AE",
          textTransform: "none",
          fontWeight: "bold",
          marginLeft: 16,
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
