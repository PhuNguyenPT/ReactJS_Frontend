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
import { useFourthForm } from "../../../hooks/formPages/useFourthForm";

interface FourthFormProps {
  showErrors?: boolean;
}

export default function FourthForm({ showErrors = false }: FourthFormProps) {
  const {
    categories,
    handleAddEntry,
    handleRemoveEntry,
    handleEntryChange,
    handleEntryScoreBlur,
    getFirstFieldOptions,
    getSecondFieldOptions,
    getSelectedValue,
    isSecondFieldDropdown,
    isSecondFieldTextInput,
    canAddEntry,
    getAddButtonText,
    getEntryErrors,
    getScoreInputPlaceholder,
  } = useFourthForm();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {categories.map((category) => {
        const canAdd = canAddEntry(category.id);

        return (
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
            {/* Category Header with Helper Text */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                mb: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#A657AE",
                  textAlign: "left",
                }}
              >
                {category.name}
              </Typography>
            </Box>

            {category.isExpanded &&
              category.entries.map((entry) => {
                const selectedFirstFieldValue = getSelectedValue(
                  entry.firstField || null,
                  false, // Use translated labels for first field
                );

                // Determine if second field should be dropdown or text input
                const isDropdown = isSecondFieldDropdown(
                  category.categoryType,
                  entry.firstField || null,
                );
                const isTextInput = isSecondFieldTextInput(
                  category.categoryType,
                  entry.firstField || null,
                );

                // Get second field options and selected value for dropdown
                const secondFieldOptions = isDropdown
                  ? getSecondFieldOptions(
                      category.categoryType,
                      entry.firstField || null,
                    )
                  : [];

                // For A-Level grades and JLPT levels, the value is the grade/level itself (A*, N1, etc.)
                // For national_award ranks, the value is a translation key (ranks.first, etc.)
                // Check if it's a raw value dropdown (key === label) rather than a translation key dropdown
                const isRawValueDropdown =
                  secondFieldOptions.length > 0 &&
                  secondFieldOptions[0]?.key === secondFieldOptions[0]?.label; // Raw values have key === label

                const selectedSecondFieldValue =
                  isDropdown && entry.secondField
                    ? getSelectedValue(entry.secondField, isRawValueDropdown)
                    : null;

                // Pass category.categoryType to getEntryErrors
                const entryErrors = getEntryErrors(
                  entry,
                  category.categoryType,
                );
                const hasError = showErrors && entryErrors.length > 0;

                return (
                  <Box
                    key={entry.id}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      width: "100%",
                      mb: 2,
                      gap: 1,
                    }}
                  >
                    {/* Main row with dropdown, second field, and remove button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: 1,
                        justifyContent: "flex-start",
                      }}
                    >
                      {/* First Field Autocomplete */}
                      <Autocomplete
                        options={getFirstFieldOptions(category.categoryType)}
                        value={selectedFirstFieldValue}
                        onChange={(_, newValue) => {
                          const translationKey = newValue?.key ?? "";
                          handleEntryChange(
                            category.id,
                            entry.id,
                            "firstField",
                            translationKey,
                          );
                        }}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.key === value.key
                        }
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
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
                                },
                              },
                              "& input": { color: "#A657AE" },
                            }}
                          />
                        )}
                      />

                      {/* Second Field - Text input or Autocomplete based on category and exam type */}
                      {isTextInput ? (
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
                          onBlur={() => {
                            handleEntryScoreBlur(category.id, entry.id);
                          }}
                          placeholder={
                            entry.firstField
                              ? getScoreInputPlaceholder(
                                  entry.firstField,
                                  category.categoryType,
                                )
                              : category.secondFieldLabel
                          }
                          error={hasError}
                          disabled={!entry.firstField}
                          sx={{
                            width: 170,
                            "& .MuiOutlinedInput-root": {
                              borderRadius: "17px",
                              height: "40px",
                              "& fieldset": {
                                borderColor: hasError ? "#d32f2f" : "#A657AE",
                              },
                              "&:hover fieldset": {
                                borderColor: hasError ? "#d32f2f" : "#8B4A8F",
                              },
                              "&.Mui-focused fieldset": {
                                borderColor: hasError ? "#d32f2f" : "#A657AE",
                              },
                            },
                            "& input": { color: "#A657AE" },
                          }}
                        />
                      ) : isDropdown ? (
                        <Autocomplete
                          options={secondFieldOptions}
                          value={selectedSecondFieldValue}
                          onChange={(_, newValue) => {
                            const value = newValue?.key ?? "";
                            handleEntryChange(
                              category.id,
                              entry.id,
                              "secondField",
                              value,
                            );
                          }}
                          getOptionLabel={(option) => option.label}
                          isOptionEqualToValue={(option, value) =>
                            option.key === value.key
                          }
                          sx={{ width: 170 }}
                          filterSelectedOptions
                          disabled={!entry.firstField}
                          renderInput={(params) => (
                            <TextField
                              {...params}
                              placeholder={
                                entry.firstField
                                  ? category.secondFieldLabel
                                  : category.secondFieldLabel
                              }
                              error={hasError}
                              sx={{
                                "& .MuiOutlinedInput-root": {
                                  borderRadius: "17px",
                                  height: "40px",
                                  "& fieldset": {
                                    borderColor: hasError
                                      ? "#d32f2f"
                                      : "#A657AE",
                                  },
                                  "&:hover fieldset": {
                                    borderColor: hasError
                                      ? "#d32f2f"
                                      : "#8B4A8F",
                                  },
                                  "&.Mui-focused fieldset": {
                                    borderColor: hasError
                                      ? "#d32f2f"
                                      : "#A657AE",
                                  },
                                },
                                "& input": { color: "#A657AE" },
                              }}
                            />
                          )}
                        />
                      ) : null}

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

                    {/* Entry-level error messages - only show when showErrors is true */}
                    {showErrors &&
                      entryErrors.map((error) => (
                        <Typography
                          key={`${entry.id}-${error}`}
                          variant="caption"
                          sx={{ color: "#d32f2f", ml: 1, textAlign: "left" }}
                        >
                          {error}
                        </Typography>
                      ))}
                  </Box>
                );
              })}

            {/* Add Button - Disabled when max entries reached */}
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={() => {
                handleAddEntry(category.id);
              }}
              disabled={!canAdd}
              sx={{
                mb: 2,
                backgroundColor: canAdd ? "#9c27b0" : "#ccc",
                borderRadius: "10px",
                textTransform: "none",
                alignSelf: "flex-start",
                "&:hover": {
                  backgroundColor: canAdd ? "#7b1fa2" : "#ccc",
                },
                "&.Mui-disabled": {
                  backgroundColor: "#e0e0e0",
                  color: "#9e9e9e",
                },
              }}
            >
              {getAddButtonText(category.id)}
            </Button>
          </Box>
        );
      })}
    </Box>
  );
}
