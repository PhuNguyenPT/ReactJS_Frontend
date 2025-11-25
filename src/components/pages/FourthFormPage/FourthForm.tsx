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
        width: "100%",
      }}
    >
      {categories.map((category) => {
        const canAdd = canAddEntry(category.id);

        return (
          <Box
            key={category.id}
            sx={{
              mb: {
                xs: 1,
                sm: 1,
                md: 1,
              },
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
                mb: {
                  xs: 0.75,
                  sm: 0.875,
                  md: 1,
                },
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "#A657AE",
                  fontFamily: "Montserrat",
                  textAlign: "left",
                  fontStyle: "italic",
                  fontSize: {
                    xs: "0.75rem",
                    sm: "0.9rem",
                    md: "1.1rem",
                  },
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
                      mb: {
                        xs: 1.5,
                        sm: 1.75,
                        md: 2,
                      },
                      gap: {
                        xs: 0.75,
                        sm: 0.875,
                        md: 1,
                      },
                    }}
                  >
                    {/* Main row with dropdown, second field, and remove button */}
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        gap: {
                          xs: 0.5,
                          sm: 0.75,
                          md: 1,
                        },
                        justifyContent: "flex-start",
                        flexWrap: {
                          xs: "wrap",
                          sm: "nowrap",
                        },
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
                        sx={{
                          width: {
                            xs: 140,
                            sm: 170,
                            md: 200,
                          },
                        }}
                        slotProps={{
                          paper: {
                            sx: {
                              "& .MuiAutocomplete-option": {
                                fontFamily: "Montserrat",
                              },
                            },
                          },
                        }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={category.firstFieldLabel}
                            sx={{
                              "& .MuiOutlinedInput-root": {
                                borderRadius: {
                                  xs: "12px",
                                  sm: "15px",
                                  md: "17px",
                                },
                                height: {
                                  xs: "36px",
                                  sm: "38px",
                                  md: "40px",
                                },
                                fontSize: {
                                  xs: "0.8rem",
                                  sm: "0.85rem",
                                  md: "0.9rem",
                                },
                                "& fieldset": { borderColor: "#A657AE" },
                                "&:hover fieldset": { borderColor: "#8B4A8F" },
                                "&.Mui-focused fieldset": {
                                  borderColor: "#A657AE",
                                },
                              },
                              "& input": {
                                color: "#A657AE",
                                fontFamily: "Montserrat",
                                padding: {
                                  xs: "8px 12px",
                                  sm: "9px 14px",
                                  md: "10px 16px",
                                },
                              },
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
                            width: {
                              xs: 110,
                              sm: 140,
                              md: 170,
                            },
                            "& .MuiOutlinedInput-root": {
                              borderRadius: {
                                xs: "12px",
                                sm: "15px",
                                md: "17px",
                              },
                              height: {
                                xs: "36px",
                                sm: "38px",
                                md: "40px",
                              },
                              fontSize: {
                                xs: "0.8rem",
                                sm: "0.85rem",
                                md: "0.9rem",
                              },
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
                            "& input": {
                              color: "#A657AE",
                              fontFamily: "Montserrat",
                              padding: {
                                xs: "8px 12px",
                                sm: "9px 14px",
                                md: "10px 16px",
                              },
                            },
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
                          sx={{
                            width: {
                              xs: 110,
                              sm: 140,
                              md: 170,
                            },
                          }}
                          slotProps={{
                            paper: {
                              sx: {
                                "& .MuiAutocomplete-option": {
                                  fontFamily: "Montserrat",
                                },
                              },
                            },
                          }}
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
                                  borderRadius: {
                                    xs: "12px",
                                    sm: "15px",
                                    md: "17px",
                                  },
                                  height: {
                                    xs: "36px",
                                    sm: "38px",
                                    md: "40px",
                                  },
                                  fontSize: {
                                    xs: "0.8rem",
                                    sm: "0.85rem",
                                    md: "0.9rem",
                                  },
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
                                "& input": {
                                  color: "#A657AE",
                                  fontFamily: "Montserrat",
                                  padding: {
                                    xs: "8px 12px",
                                    sm: "9px 14px",
                                    md: "10px 16px",
                                  },
                                },
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
                          width: {
                            xs: "32px",
                            sm: "34px",
                            md: "35px",
                          },
                          height: {
                            xs: "32px",
                            sm: "34px",
                            md: "35px",
                          },
                          "&:hover": {
                            backgroundColor: "#d32f2f",
                          },
                        }}
                      >
                        <CloseIcon
                          sx={{
                            fontSize: {
                              xs: "1rem",
                              sm: "1.1rem",
                              md: "1.25rem",
                            },
                          }}
                        />
                      </IconButton>
                    </Box>

                    {/* Entry-level error messages - only show when showErrors is true */}
                    {showErrors &&
                      entryErrors.map((error) => (
                        <Typography
                          key={`${entry.id}-${error}`}
                          variant="caption"
                          sx={{
                            color: "#d32f2f",
                            fontFamily: "Montserrat",
                            ml: 1,
                            textAlign: "left",
                            fontSize: {
                              xs: "0.7rem",
                              sm: "0.75rem",
                              md: "0.75rem",
                            },
                          }}
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
              startIcon={
                <AddIcon
                  sx={{
                    fontSize: {
                      xs: "1rem",
                      sm: "1.1rem",
                      md: "1.25rem",
                    },
                  }}
                />
              }
              onClick={() => {
                handleAddEntry(category.id);
              }}
              disabled={!canAdd}
              sx={{
                mb: {
                  xs: 1.5,
                  sm: 1.75,
                  md: 2,
                },
                px: {
                  xs: 1.5,
                  sm: 2,
                  md: 2,
                },
                py: {
                  xs: 0.6,
                  sm: 0.7,
                  md: 0.8,
                },
                fontFamily: "Montserrat",
                fontSize: {
                  xs: "0.8rem",
                  sm: "0.85rem",
                  md: "0.9rem",
                },
                backgroundColor: canAdd ? "#9c27b0" : "#ccc",
                borderRadius: {
                  xs: "8px",
                  sm: "9px",
                  md: "10px",
                },
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
