import {
  Box,
  TextField,
  Typography,
  Button,
  IconButton,
  Autocomplete,
} from "@mui/material";
import { useState } from "react";
import AddIcon from "@mui/icons-material/Add";
import CloseIcon from "@mui/icons-material/Close";
import { useTranslation } from "react-i18next";

interface AwardCertificate {
  id: string;
  firstField: string;
  secondField: string;
}

interface CategoryData {
  id: string;
  name: string;
  entries: AwardCertificate[];
  isExpanded: boolean;
  firstFieldLabel: string;
  secondFieldLabel: string;
}

const categories = [
  "National Student Award",
  "International Certificate",
  "Language Certificate",
];

// Options for each category
const categoryOptions = {
  "National Student Award": {
    subjects: [
      "Toán học",
      "Ngữ văn",
      "Tiếng Anh",
      "Vật lý",
      "Hóa học",
      "Sinh học",
      "Lịch sử",
      "Địa lý",
      "Giáo dục công dân",
    ],
    awards: [
      "Giải Nhất",
      "Giải Nhì",
      "Giải Ba",
      "Giải Khuyến khích",
      "Giải Xuất sắc",
    ],
  },
  "International Certificate": {
    certificates: [
      "IELTS",
      "TOEFL",
      "SAT",
      "ACT",
      "Cambridge English",
      "DELF/DALF",
      "JLPT",
      "HSK",
      "TOPIK",
    ],
    scores: [
      "9.0",
      "8.5",
      "8.0",
      "7.5",
      "7.0",
      "6.5",
      "6.0",
      "5.5",
      "5.0", // IELTS
      "120",
      "110",
      "100",
      "90",
      "80",
      "70",
      "60", // TOEFL
      "1600",
      "1500",
      "1400",
      "1300",
      "1200",
      "1100",
      "1000", // SAT
      "36",
      "35",
      "34",
      "33",
      "32",
      "31",
      "30",
      "29",
      "28", // ACT
      "C2",
      "C1",
      "B2",
      "B1",
      "A2",
      "A1", // Cambridge/CEFR
      "N1",
      "N2",
      "N3",
      "N4",
      "N5", // JLPT
      "Level 6",
      "Level 5",
      "Level 4",
      "Level 3",
      "Level 2",
      "Level 1", // HSK/TOPIK
    ],
  },
  "Language Certificate": {
    subjects: [
      "Tiếng Anh",
      "Tiếng Nhật",
      "Tiếng Hàn",
      "Tiếng Trung",
      "Tiếng Pháp",
      "Tiếng Đức",
      "Tiếng Tây Ban Nha",
      "Tiếng Nga",
    ],
    awards: [
      "A1",
      "A2",
      "B1",
      "B2",
      "C1",
      "C2", // CEFR levels
      "Beginner",
      "Elementary",
      "Intermediate",
      "Upper-Intermediate",
      "Advanced",
      "Proficient",
      "N1",
      "N2",
      "N3",
      "N4",
      "N5", // Japanese
      "HSK 1",
      "HSK 2",
      "HSK 3",
      "HSK 4",
      "HSK 5",
      "HSK 6", // Chinese
    ],
  },
};

export default function FourthForm() {
  const { t } = useTranslation();

  const [categoryData, setCategoryData] = useState<CategoryData[]>(
    categories.map((cat, index) => ({
      id: `category-${String(index + 1)}`,
      name: cat,
      entries: [],
      isExpanded: false,
      firstFieldLabel:
        cat === "National Student Award"
          ? "Subject"
          : cat === "International Certificate"
            ? "Certificate Type"
            : "Language",
      secondFieldLabel: cat === "International Certificate" ? "Score" : "Award",
    })),
  );

  const generateId = () =>
    `${Date.now().toString()}-${Math.random().toString(36).substring(2, 11)}`;

  const handleAddEntry = (categoryId: string) => {
    const updated = categoryData.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          entries: [
            ...category.entries,
            { id: generateId(), firstField: "", secondField: "" },
          ],
          isExpanded: true,
        };
      }
      return category;
    });
    setCategoryData(updated);
  };

  const handleRemoveEntry = (categoryId: string, entryId: string) => {
    const updated = categoryData.map((category) => {
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
    setCategoryData(updated);
  };

  const handleEntryChange = (
    categoryId: string,
    entryId: string,
    field: "firstField" | "secondField",
    value: string,
  ) => {
    const updated = categoryData.map((category) => {
      if (category.id === categoryId) {
        return {
          ...category,
          entries: category.entries.map((entry) => {
            if (entry.id === entryId) {
              return { ...entry, [field]: value };
            }
            return entry;
          }),
        };
      }
      return category;
    });
    setCategoryData(updated);
  };

  const toggleExpanded = (categoryId: string) => {
    const updated = categoryData.map((category) => {
      if (category.id === categoryId) {
        return { ...category, isExpanded: !category.isExpanded };
      }
      return category;
    });
    setCategoryData(updated);
  };

  const getFirstFieldOptions = (categoryName: string) => {
    switch (categoryName) {
      case "National Student Award":
        return categoryOptions["National Student Award"].subjects;
      case "International Certificate":
        return categoryOptions["International Certificate"].certificates;
      case "Language Certificate":
        return categoryOptions["Language Certificate"].subjects;
      default:
        return [];
    }
  };

  const getSecondFieldOptions = (categoryName: string) => {
    switch (categoryName) {
      case "National Student Award":
        return categoryOptions["National Student Award"].awards;
      case "International Certificate":
        return categoryOptions["International Certificate"].scores;
      case "Language Certificate":
        return categoryOptions["Language Certificate"].awards;
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
      {categoryData.map((category) => (
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
              color: "#9c27b0",
              fontStyle: "italic",
              textAlign: "left",
              cursor: "pointer",
            }}
            onClick={() => {
              toggleExpanded(category.id);
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
                {/* First Field Autocomplete (Subject/Certificate and Type/Language) */}
                <Autocomplete
                  options={getFirstFieldOptions(category.name)}
                  value={entry.firstField || null}
                  onChange={(_, newValue) => {
                    handleEntryChange(
                      category.id,
                      entry.id,
                      "firstField",
                      newValue ?? "",
                    );
                  }}
                  sx={{
                    width: 200,
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={`Choose ${category.firstFieldLabel}`}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
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

                {/* Second Field Autocomplete (Award/Score) */}
                <Autocomplete
                  options={getSecondFieldOptions(category.name)}
                  value={entry.secondField || null}
                  onChange={(_, newValue) => {
                    handleEntryChange(
                      category.id,
                      entry.id,
                      "secondField",
                      newValue ?? "",
                    );
                  }}
                  sx={{
                    width: 150,
                  }}
                  filterSelectedOptions
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      placeholder={category.secondFieldLabel}
                      sx={{
                        "& .MuiOutlinedInput-root": {
                          borderRadius: "17px",
                          height: "40px",
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
              "&:hover": {
                backgroundColor: "#7b1fa2",
              },
            }}
          >
            {t("buttons.add")}
          </Button>
        </Box>
      ))}
    </Box>
  );
}
