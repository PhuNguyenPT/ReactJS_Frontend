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
    getFirstFieldOptions,
    getSecondFieldOptions,
    getSelectedValue,
    isSecondFieldTextInput,
    getEntryErrors,
    t,
  } = useFourthForm();

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        alignItems: "flex-start",
      }}
    >
      {categories.map((category) => (
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
            category.entries.map((entry) => {
              const selectedFirstFieldValue = getSelectedValue(
                entry.firstField || null,
              );
              const selectedSecondFieldValue =
                category.categoryType === "national_award"
                  ? getSelectedValue(entry.secondField || null)
                  : null;

              // Pass category.categoryType to getEntryErrors
              const entryErrors = getEntryErrors(entry, category.categoryType);
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

                    {/* Second Field - Text input or Autocomplete based on category */}
                    {isSecondFieldTextInput(category.categoryType) ? (
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
                        error={hasError}
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
                    ) : (
                      <Autocomplete
                        options={getSecondFieldOptions(category.categoryType)}
                        value={selectedSecondFieldValue}
                        onChange={(_, newValue) => {
                          const translationKey = newValue?.key ?? "";
                          handleEntryChange(
                            category.id,
                            entry.id,
                            "secondField",
                            translationKey,
                          );
                        }}
                        getOptionLabel={(option) => option.label}
                        isOptionEqualToValue={(option, value) =>
                          option.key === value.key
                        }
                        sx={{ width: 170 }}
                        filterSelectedOptions
                        renderInput={(params) => (
                          <TextField
                            {...params}
                            placeholder={category.secondFieldLabel}
                            error={hasError}
                            sx={{
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
