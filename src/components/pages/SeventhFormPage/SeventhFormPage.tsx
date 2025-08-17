import usePageTitle from "../../../hooks/usePageTitle";
import { useTranslation } from "react-i18next";
import SeventhForm from "./SeventhForm";
import { Box, IconButton } from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import { useState } from "react";

// Define types for form values and errors
interface GradeValues {
  hanhKiem: string;
  hocLuc: string;
}

interface GradeErrors {
  hanhKiem: boolean;
  hocLuc: boolean;
}

type GradeKey = "10" | "11" | "12";

export default function SeventhFormPage() {
  usePageTitle("Unizy | Seventh Form");
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [formValues, setFormValues] = useState<Record<GradeKey, GradeValues>>({
    "10": { hanhKiem: "", hocLuc: "" },
    "11": { hanhKiem: "", hocLuc: "" },
    "12": { hanhKiem: "", hocLuc: "" },
  });

  const [errors, setErrors] = useState<Record<GradeKey, GradeErrors>>({
    "10": { hanhKiem: false, hocLuc: false },
    "11": { hanhKiem: false, hocLuc: false },
    "12": { hanhKiem: false, hocLuc: false },
  });

  // Add validation trigger state
  const [shouldValidate, setShouldValidate] = useState(false);

  // Handle form changes from child component
  const handleFormChange = (
    grade: GradeKey,
    field: keyof GradeValues,
    value: string,
  ) => {
    setFormValues((prev) => ({
      ...prev,
      [grade]: {
        ...prev[grade],
        [field]: value,
      },
    }));

    // Clear error immediately for that field when user makes a selection
    if (value !== "") {
      setErrors((prev) => ({
        ...prev,
        [grade]: {
          ...prev[grade],
          [field]: false,
        },
      }));
    }
  };

  const handleNext = () => {
    // Trigger validation
    setShouldValidate(true);

    const newErrors: Record<GradeKey, GradeErrors> = {
      "10": {
        hanhKiem: formValues["10"].hanhKiem === "",
        hocLuc: formValues["10"].hocLuc === "",
      },
      "11": {
        hanhKiem: formValues["11"].hanhKiem === "",
        hocLuc: formValues["11"].hocLuc === "",
      },
      "12": {
        hanhKiem: formValues["12"].hanhKiem === "",
        hocLuc: formValues["12"].hocLuc === "",
      },
    };

    setErrors(newErrors);

    // Only navigate if all fields are filled
    const allFilled = Object.values(newErrors).every(
      (e) => !e.hanhKiem && !e.hocLuc,
    );

    if (allFilled) {
      setShouldValidate(false); // Reset validation trigger
      void navigate("/eighthForm");
    }
  };

  const handlePrev = () => {
    void navigate("/sixthForm");
  };

  return (
    <>
      <div className="background" />
      <div className="form-container">
        <div className="form-2-content">
          <h1 className="form-title">
            7 → {t("seventhForm.title", "Về học lực của bạn")}
          </h1>
          <SeventhForm
            onChange={handleFormChange}
            errors={errors}
            values={formValues}
            shouldValidate={shouldValidate}
          />
        </div>

        {/* Navigation buttons */}
        <Box
          sx={{
            position: "relative",
            display: "flex",
            gap: 0.3,
            top: 181.6,
            right: 106,
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
      </div>
    </>
  );
}
