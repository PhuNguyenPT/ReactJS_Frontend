import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";
import React from "react";
import { CCNNType, CCQTType } from "../../../type/enum/exam";
import { VietnameseSubject } from "../../../type/enum/subject";
import { Rank } from "../../../type/enum/ranks";
import { useFormData } from "../../../contexts/FormDataContext/useFormData";

export default function FourthForm() {
  const { t } = useTranslation();
  const { formData, updateFourthForm } = useFormData();

  const ccqtOptions = Object.values(CCQTType);
  const ccnnOptions = Object.values(CCNNType);
  const hsgOptions = Object.values(VietnameseSubject);
  const rankOptions = Object.values(Rank);

  // Options for each category
  const categoryOptions = {
    national_award: {
      subjects: hsgOptions,
      awards: rankOptions,
    },
    international_cert: {
      certificates: ccqtOptions,
      scores: rankOptions,
    },
    language_cert: {
      certificates: ccnnOptions,
    },
  };

  // Update labels when translation changes
  React.useEffect(() => {
    const translatedCategories = [
      t("fourthForm.cat1"),
      t("fourthForm.cat2"),
      t("fourthForm.cat3"),
    ];

    // Check if translations have actually changed to avoid unnecessary updates
    const needsUpdate = formData.fourthForm.categories.some(
      (category, index) => {
        const expectedName = translatedCategories[index];
        const expectedFirstLabel =
          index === 0
            ? t("fourthForm.firstField")
            : index === 1
              ? t("fourthForm.secondField")
              : t("fourthForm.thirdField");
        const expectedSecondLabel =
          index === 1 ? t("fourthForm.score") : t("fourthForm.award");

        return (
          category.name !== expectedName ||
          category.firstFieldLabel !== expectedFirstLabel ||
          category.secondFieldLabel !== expectedSecondLabel
        );
      },
    );

    if (needsUpdate) {
      const updatedCategories = formData.fourthForm.categories.map(
        (category, index) => ({
          ...category,
          name: translatedCategories[index],
          firstFieldLabel:
            index === 0
              ? t("fourthForm.firstField")
              : index === 1
                ? t("fourthForm.secondField")
                : t("fourthForm.thirdField"),
          secondFieldLabel:
            index === 1 ? t("fourthForm.score") : t("fourthForm.award"),
        }),
      );

      updateFourthForm({ categories: updatedCategories });
    }
  }, [t, updateFourthForm, formData.fourthForm.categories]);

  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleAddEntry = (categoryId: string) => {
    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: [
              ...category.entries,
              { id: generateId(), firstField: "", secondField: "" },
            ],
            isExpanded: true,
          }
        : category,
    );

    updateFourthForm({ categories: updatedCategories });
  };

  const handleRemoveEntry = (categoryId: string, entryId: string) => {
    const updatedCategories = formData.fourthForm.categories.map((category) => {
      if (category.id === categoryId) {
        const newEntries = category.entries.filter(
          (entry) => entry.id !== entryId,
        );
        return {
          ...category,
          entries: newEntries,
          isExpanded: newEntries.length > 0,
        };
      }
      return category;
    });

    updateFourthForm({ categories: updatedCategories });
  };

  const handleEntryChange = (
    categoryId: string,
    entryId: string,
    field: "firstField" | "secondField",
    value: string,
  ) => {
    const updatedCategories = formData.fourthForm.categories.map((category) =>
      category.id === categoryId
        ? {
            ...category,
            entries: category.entries.map((entry) =>
              entry.id === entryId ? { ...entry, [field]: value } : entry,
            ),
          }
        : category,
    );

    updateFourthForm({ categories: updatedCategories });
  };

  // Options helper
  const getFirstFieldOptions = (categoryType: string) => {
    switch (categoryType) {
      case "national_award":
        return categoryOptions.national_award.subjects;
      case "international_cert":
        return categoryOptions.international_cert.certificates;
      case "language_cert":
        return categoryOptions.language_cert.certificates;
      default:
        return [];
    }
  };

  const getSecondFieldOptions = (categoryType: string) => {
    switch (categoryType) {
      case "national_award":
        return categoryOptions.national_award.awards;
      case "international_cert":
        return categoryOptions.international_cert.scores;
      default:
        return [];
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {formData.fourthForm.categories.map((category) => (
        <Box
          key={category.id}
          sx={{
            mb: 1,
            width: "100%",
            display: "flex",
            flexDirection: "column",
            alignItems: "flex-start",
          }}
        >
          {/* Category Header */}
          <Typography
            variant="body1"
            sx={{
              mb: 1,
              color: "#A657AE",
              textAlign: "left",
            }}
          >
            {category.name}
          </Typography>

          {category.isExpanded &&
            category.entries.map((entry) => (
              <Box
                key={entry.id}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  justifyContent: "flex-start",
                  mb: 1,
                }}
              >
                {/* First Field Autocomplete */}
                <Autocomplete
                  options={getFirstFieldOptions(category.categoryType)}
                  value={entry.firstField || null}
                  onChange={(_, newValue) => {
                    handleEntryChange(
                      category.id,
                      entry.id,
                      "firstField",
                      newValue ?? "",
                    );
                  }}
                  sx={{ width: 200 }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={category.firstFieldLabel}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
                          "& fieldset": { borderColor: "#A657AE" },
                          "&:hover fieldset": { borderColor: "#8B4A8F" },
                          "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                        },
                        "& input": { color: "#A657AE" },
                      }}
                    />
                  )}
                />

                {/* Second Field */}
                {category.categoryType === "language_cert" ? (
                  // Free text input for language cert score
                  <TextField
                    value={entry.secondField}
                    onChange={(e) => {
                      handleEntryChange(
                        category.id,
                        entry.id,
                        "secondField",
                        e.target.value,
                      );
                    }}
                    placeholder={category.secondFieldLabel}
                    sx={{
                      width: 170,
                      "& .MuiOutlinedInput-root": {
                        borderRadius: "17px",
                        height: "40px",
                        "& fieldset": { borderColor: "#A657AE" },
                        "&:hover fieldset": { borderColor: "#8B4A8F" },
                        "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                      },
                      "& input": { color: "#A657AE" },
                    }}
                  />
                ) : (
                  // Autocomplete for other categories
                  <Autocomplete
                    options={getSecondFieldOptions(category.categoryType)}
                    value={entry.secondField || null}
                    onChange={(_, newValue) => {
                      handleEntryChange(
                        category.id,
                        entry.id,
                        "secondField",
                        newValue ?? "",
                      );
                    }}
                    sx={{ width: 170 }}
                    filterSelectedOptions
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        placeholder={category.secondFieldLabel}
                        sx={{
                          "& .MuiOutlinedInput-root": {
                            borderRadius: "17px",
                            height: "40px",
                            "& fieldset": { borderColor: "#A657AE" },
                            "&:hover fieldset": { borderColor: "#8B4A8F" },
                            "&.Mui-focused fieldset": {
                              borderColor: "#A657AE",
                            },
                          },
                          "& input": { color: "#A657AE" },
                        }}
                      />
                    )}
                  />
                )}

                {/* Remove Button */}
                <IconButton
                  onClick={() => {
                    handleRemoveEntry(category.id, entry.id);
                  }}
                  sx={{
                    backgroundColor: "#f44336",
                    color: "white",
                    width: "35px",
                    height: "35px",
                    "&:hover": {
                      backgroundColor: "#d32f2f",
                    },
                  }}
                >
                  <CloseIcon fontSize="small" />
                </IconButton>
              </Box>
            ))}

          {/* Add Button */}
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => {
              handleAddEntry(category.id);
            }}
            sx={{
              mb: 2,
              backgroundColor: "#9c27b0",
              borderRadius: "10px",
              textTransform: "none",
              alignSelf: "flex-start",
              "&:hover": { backgroundColor: "#7b1fa2" },
            }}
          >
            {t("buttons.add")}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
