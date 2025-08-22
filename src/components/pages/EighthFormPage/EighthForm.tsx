import { Box, Typography } from "@mui/material";
import { useState } from "react";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";

export default function EighthForm() {
  const grades = ["10", "11", "12"];

  // State: { grade: { slot1: File|null, slot2: File|null } }
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
    <Box className="eighth-form" sx={{ display: "flex", gap: 20 }}>
      {grades.map((grade) => (
        <Box key={grade} className="grade-section">
          {/* Subtitle */}
          <Typography variant="h5" className="grade-title" sx={{ mb: 2 }}>
            Grade {grade}
          </Typography>

          {/* Two upload boxes stacked */}
          <Box
            className="upload-column"
            sx={{ display: "flex", flexDirection: "column", gap: 5 }}
          >
            {[0, 1].map((index) => (
              <div key={index} className="upload-box">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    handleFileChange(grade, index, e.target.files?.[0] ?? null);
                  }}
                  className="upload-input"
                  id={`upload-${grade}-${index.toString()}`}
                />
                <label
                  htmlFor={`upload-${grade}-${index.toString()}`}
                  className="upload-label"
                >
                  <FileUploadOutlinedIcon
                    className="upload-icon"
                    sx={{ fontSize: 100 }}
                  >
                    {files[grade][index] ? files[grade][index]?.name : "Upload"}
                  </FileUploadOutlinedIcon>
                </label>
              </div>
            ))}
          </Box>
        </Box>
      ))}
    </Box>
  );
}
