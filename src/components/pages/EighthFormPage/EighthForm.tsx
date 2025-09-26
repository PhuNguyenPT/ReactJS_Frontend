import { Box, Typography } from "@mui/material";
import { useState, useEffect } from "react";
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

  // State for image preview URLs: { grade: [string|null, string|null] }
  const [previewUrls, setPreviewUrls] = useState<
    Record<string, (string | null)[]>
  >({
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

    // Handle preview URL
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setPreviewUrls((prev) => ({
        ...prev,
        [grade]: prev[grade].map((url, i) => {
          // Clean up previous URL if exists
          if (i === index && url) {
            URL.revokeObjectURL(url);
          }
          return i === index ? imageUrl : url;
        }),
      }));
    } else {
      // Clean up URL when file is removed
      setPreviewUrls((prev) => ({
        ...prev,
        [grade]: prev[grade].map((url, i) => {
          if (i === index && url) {
            URL.revokeObjectURL(url);
            return null;
          }
          return url;
        }),
      }));
    }
  };

  // Cleanup URLs on component unmount
  useEffect(() => {
    return () => {
      Object.values(previewUrls)
        .flat()
        .forEach((url) => {
          if (url) URL.revokeObjectURL(url);
        });
    };
  }, [previewUrls]);

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
                  <Box
                    sx={{ display: "flex", alignItems: "flex-start", gap: 2 }}
                  >
                    <Typography
                      variant="body1"
                      sx={{
                        minWidth: "100px",
                        textAlign: "right",
                        paddingTop: "75px", // Center the text vertically with the upload box
                      }}
                    >
                      {semesters[index]}
                    </Typography>

                    {/* Upload box container */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                      }}
                    >
                      {/* Upload box */}
                      <Box
                        component="label"
                        htmlFor={`upload-${grade}-${index.toString()}`}
                        className="upload-box"
                        sx={{
                          position: "relative",
                          width: "150px",
                          height: "150px",
                          border: "2px dashed #ccc",
                          borderRadius: "8px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          cursor: "pointer",
                          overflow: "hidden",
                          "&:hover": {
                            borderColor: "#999",
                          },
                          "&:hover .replace-overlay": {
                            opacity: 1,
                          },
                        }}
                      >
                        {/* Hidden file input */}
                        <Box
                          component="input"
                          type="file"
                          accept="image/*"
                          onChange={(
                            e: React.ChangeEvent<HTMLInputElement>,
                          ) => {
                            const file = e.target.files?.[0] ?? null;
                            handleFileChange(grade, index, file);
                          }}
                          className="upload-input"
                          id={`upload-${grade}-${index.toString()}`}
                          aria-label={`Upload file for Grade ${grade}, ${semesters[index]}`}
                          sx={{
                            display: "none", // Hide the input completely
                          }}
                        />

                        {/* Show preview image or upload icon */}
                        {previewUrls[grade][index] ? (
                          <>
                            {/* Preview Image */}
                            <Box
                              component="img"
                              src={previewUrls[grade][index]}
                              alt={`Preview for Grade ${grade}, ${semesters[index]}`}
                              sx={{
                                width: "100%",
                                height: "100%",
                                objectFit: "cover",
                                borderRadius: "6px",
                              }}
                            />

                            {/* Overlay for replacing image */}
                            <Box
                              className="replace-overlay"
                              sx={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                width: "100%",
                                height: "100%",
                                backgroundColor: "rgba(0,0,0,0.7)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                opacity: 0,
                                transition: "opacity 0.2s",
                                borderRadius: "6px",
                              }}
                            >
                              <Typography
                                variant="body2"
                                sx={{
                                  color: "white",
                                  textAlign: "center",
                                  fontWeight: 500,
                                }}
                              >
                                Click to replace
                              </Typography>
                            </Box>
                          </>
                        ) : (
                          <Box
                            sx={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <FileUploadOutlinedIcon
                              className="upload-icon"
                              sx={{ fontSize: 48, color: "#999", mb: 1 }}
                            />
                            <Typography
                              variant="caption"
                              sx={{ color: "#666", textAlign: "center" }}
                            >
                              Click to upload
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* File name preview */}
                      {files[grade][index] && (
                        <Typography
                          variant="caption"
                          sx={{
                            color: "#ffffffff",
                            textAlign: "center",
                            mt: 1,
                            maxWidth: "150px",
                            wordBreak: "break-word",
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                          }}
                        >
                          {files[grade][index]?.name}
                        </Typography>
                      )}
                    </Box>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
