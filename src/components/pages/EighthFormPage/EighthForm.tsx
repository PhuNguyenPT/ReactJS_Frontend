import { Box, Typography } from "@mui/material";
import { useState } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import { useTranslation } from "react-i18next";

export default function EighthForm() {
  const { t } = useTranslation();
  const grades = ["10", "11", "12"];
  const semesters = [t("eighthForm.semester1"), t("eighthForm.semester2")];

  // State: { grade: [File|null, File|null] }
  const [files, setFiles] = useState<Record<string, (File | null)[]>>({
    "10": [null, null],
    "11": [null, null],
    "12": [null, null],
  });

  const handleFileChange = (
    grade: string,
    index: number,
    file: File | null,
  ) => {
    setFiles((prev) => ({
      ...prev,
      [grade]: prev[grade].map((f, i) => (i === index ? file : f)),
    }));
  };

  return (
    <Box
      className="eighth-form"
      sx={{ display: "flex", flexDirection: "column", gap: 5 }}
    >
      <Box sx={{ display: "flex", gap: 20 }}>
        {grades.map((grade) => (
          <Box key={grade} className="grade-section">
            {/* Subtitle */}
            <Typography
              variant="h5"
              className="grade-title"
              sx={{ mb: 1, marginLeft: "110px" }}
            >
              {t("eighthForm.grade")} {grade}
            </Typography>

            {/* Two upload rows with semester labels */}
            <Box
              className="upload-column"
              sx={{ display: "flex", flexDirection: "column", gap: 5 }}
            >
              {[0, 1].map((index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    gap: 1,
                  }}
                >
                  {/* Semester label + Upload */}
                  <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                    <Typography
                      variant="body1"
                      sx={{ minWidth: "100px", textAlign: "right" }}
                    >
                      {semesters[index]}
                    </Typography>

                    {/* Upload box */}
                    <div className="upload-box">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          handleFileChange(
                            grade,
                            index,
                            e.target.files?.[0] ?? null,
                          );
                        }}
                        className="upload-input"
                        id={`upload-${grade}-${index.toString()}`}
                        aria-label={`Upload file for Grade ${grade}, ${semesters[index]}`}
                        title={`Upload file for Grade ${grade}, ${semesters[index]}`}
                      />
                      <label
                        htmlFor={`upload-${grade}-${index.toString()}`}
                        className="upload-label"
                      >
                        <FileUploadOutlinedIcon
                          className="upload-icon"
                          sx={{ fontSize: 100 }}
                        />
                      </label>
                    </div>
                  </Box>

                  {/* File name preview */}
                  {files[grade][index] && (
                    <Typography
                      variant="caption"
                      sx={{
                        color: "white",
                        textAlign: "center",
                        mt: 1,
                        maxWidth: "200px",
                        wordBreak: "break-word",
                      }}
                    >
                      {files[grade][index]?.name}
                    </Typography>
                  )}
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
