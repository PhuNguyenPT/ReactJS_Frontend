import React from "react";
import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import { useEighthForm } from "../../../hooks/formPages/useEighthForm";
import type { SemesterKey } from "../../../contexts/FileData/FileDataContext";

export default function EighthForm() {
  const {
    grades,
    semesters,
    acceptedTypes,
    handleFileChange,
    handleClearFile,
    getFileIcon,
    isImageFile,
    getEighthFormFile,
    getEighthFormPreviewUrl,
    translations,
  } = useEighthForm();

  return (
    <Box
      className="eighth-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 3, sm: 4, md: 5 },
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Box
        sx={{
          display: "flex",
          flexDirection: { xs: "column", md: "row" },
          gap: { xs: 4, sm: 5, md: 10, lg: 20 },
          width: "100%",
          maxWidth: "1400px",
          justifyContent: "center",
          alignItems: { xs: "center", md: "flex-start" },
        }}
      >
        {grades.map((grade) => (
          <Box
            key={grade}
            className="grade-section"
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              width: { xs: "100%", sm: "auto" },
              maxWidth: { xs: "400px", sm: "none" },
            }}
          >
            {/* Grade Title - Centered above the upload boxes */}
            <Typography
              variant="h5"
              className="grade-title"
              sx={{
                textAlign: "center",
                fontSize: { xs: "1.25rem", sm: "1.5rem" },
                width: "100%",
              }}
            >
              {translations.grade} {grade}
            </Typography>

            {/* Two upload rows with semester labels */}
            <Box
              className="upload-column"
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: { xs: 3, sm: 4, md: 5 },
                width: "110%",
                alignItems: "center",
              }}
            >
              {([0, 1] as SemesterKey[]).map((semesterIndex) => {
                const currentFile = getEighthFormFile(grade, semesterIndex);
                const previewUrl = getEighthFormPreviewUrl(
                  grade,
                  semesterIndex,
                );
                const isImage = currentFile && isImageFile(currentFile);

                return (
                  <Box
                    key={semesterIndex}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      gap: 1,
                      width: "100%",
                    }}
                  >
                    {/* Semester label + Upload */}
                    <Box
                      sx={{
                        display: "flex",
                        flexDirection: "row",
                        alignItems: "center",
                        gap: { xs: 2, sm: 2 },
                        width: "100%",
                        justifyContent: "left",
                      }}
                    >
                      <Typography
                        variant="body1"
                        sx={{
                          minWidth: { xs: "120px", sm: "65px" },
                          textAlign: "right",
                          fontSize: { xs: "0.95rem", sm: "1rem" },
                        }}
                      >
                        {semesters[semesterIndex]}
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
                          htmlFor={`upload-${grade}-${String(semesterIndex)}`}
                          className="upload-box"
                          sx={{
                            position: "relative",
                            width: { xs: "140px", sm: "150px", md: "150px" },
                            height: { xs: "140px", sm: "150px", md: "150px" },
                            border: "2px dashed #ccc",
                            borderRadius: "8px",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            cursor: "pointer",
                            overflow: "hidden",
                            backgroundColor: currentFile
                              ? "#f5f5f5"
                              : "transparent",
                            "&:hover": {
                              borderColor: "#999",
                              backgroundColor: currentFile
                                ? "#eeeeee"
                                : "#fafafa",
                            },
                            "&:hover .replace-overlay": {
                              opacity: 1,
                            },
                            "&:active": {
                              borderColor: "#666",
                            },
                          }}
                        >
                          {/* Clear button - shows when there's a file */}
                          {currentFile && (
                            <Tooltip title={translations.clearFile}>
                              <IconButton
                                onClick={(e) => {
                                  handleClearFile(grade, semesterIndex, e);
                                }}
                                size="small"
                                sx={{
                                  position: "absolute",
                                  top: 4,
                                  right: 4,
                                  zIndex: 2,
                                  backgroundColor: "rgba(255, 255, 255, 0.9)",
                                  "&:hover": {
                                    backgroundColor: "rgba(255, 255, 255, 1)",
                                  },
                                  minWidth: { xs: 36, sm: 32 },
                                  minHeight: { xs: 36, sm: 32 },
                                }}
                              >
                                <ClearIcon
                                  sx={{
                                    fontSize: { xs: "1.1rem", sm: "1rem" },
                                  }}
                                />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Hidden file input */}
                          <Box
                            component="input"
                            type="file"
                            accept={acceptedTypes}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              const file = e.target.files?.[0] ?? null;
                              handleFileChange(grade, semesterIndex, file);
                              e.target.value = "";
                            }}
                            className="upload-input"
                            id={`upload-${grade}-${String(semesterIndex)}`}
                            aria-label={`Upload file for Grade ${grade}, ${semesters[semesterIndex]}`}
                            sx={{
                              display: "none",
                            }}
                          />

                          {/* Show preview based on file type */}
                          {currentFile ? (
                            isImage && previewUrl ? (
                              <>
                                {/* Image Preview */}
                                <Box
                                  component="img"
                                  src={previewUrl}
                                  alt={`Preview for Grade ${grade}, ${semesters[semesterIndex]}`}
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
                                      fontSize: {
                                        xs: "0.8rem",
                                        sm: "0.875rem",
                                      },
                                    }}
                                  >
                                    {translations.replace}
                                  </Typography>
                                </Box>
                              </>
                            ) : (
                              <>
                                {/* Document Preview */}
                                <Box
                                  sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    gap: 1,
                                  }}
                                >
                                  {getFileIcon(currentFile)}
                                  <Typography
                                    variant="caption"
                                    sx={{
                                      color: "#333",
                                      textAlign: "center",
                                      maxWidth: "130px",
                                      wordBreak: "break-word",
                                      overflow: "hidden",
                                      textOverflow: "ellipsis",
                                      display: "-webkit-box",
                                      WebkitLineClamp: 2,
                                      WebkitBoxOrient: "vertical",
                                      fontSize: {
                                        xs: "0.65rem",
                                        sm: "0.7rem",
                                      },
                                    }}
                                  >
                                    {currentFile.name}
                                  </Typography>
                                </Box>

                                {/* Overlay for replacing document */}
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
                                      fontSize: {
                                        xs: "0.8rem",
                                        sm: "0.875rem",
                                      },
                                    }}
                                  >
                                    {translations.replace}
                                  </Typography>
                                </Box>
                              </>
                            )
                          ) : (
                            <Box
                              sx={{
                                display: "flex",
                                flexDirection: "column",
                                alignItems: "center",
                                justifyContent: "center",
                                px: 1,
                              }}
                            >
                              <FileUploadOutlinedIcon
                                className="upload-icon"
                                sx={{
                                  fontSize: { xs: 40, sm: 48 },
                                  color: "#999",
                                  mb: 1,
                                }}
                              />
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#666",
                                  textAlign: "center",
                                  fontSize: { xs: "0.75rem", sm: "0.8rem" },
                                }}
                              >
                                {translations.upload}
                              </Typography>
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#999",
                                  textAlign: "center",
                                  fontSize: { xs: "0.6rem", sm: "0.65rem" },
                                  mt: 0.5,
                                }}
                              >
                                {translations.imageDocument}
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* File info below upload box */}
                        {currentFile && (
                          <Box
                            sx={{
                              mt: 1,
                              maxWidth: { xs: "140px", sm: "150px" },
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#ffffffff",
                                display: "-webkit-box",
                                wordBreak: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
                                fontSize: { xs: "0.7rem", sm: "0.75rem" },
                              }}
                            >
                              {currentFile.name}
                            </Typography>
                          </Box>
                        )}
                      </Box>
                    </Box>
                  </Box>
                );
              })}
            </Box>
          </Box>
        ))}
      </Box>
    </Box>
  );
}
