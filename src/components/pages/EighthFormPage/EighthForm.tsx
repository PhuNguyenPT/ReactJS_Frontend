import { Box, Typography, IconButton, Tooltip } from "@mui/material";
import FileUploadOutlinedIcon from "@mui/icons-material/FileUploadOutlined";
import ClearIcon from "@mui/icons-material/Clear";
import InsertDriveFileIcon from "@mui/icons-material/InsertDriveFile";
import ImageIcon from "@mui/icons-material/Image";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import DescriptionIcon from "@mui/icons-material/Description";
import { useTranslation } from "react-i18next";
import { useFileData } from "../../../contexts/FileData/useFileData";
import type {
  GradeKey,
  SemesterKey,
} from "../../../contexts/FileData/FileDataContext";

// Supported file types
const ACCEPTED_FILE_TYPES = {
  images: ".jpg,.jpeg,.png,.gif,.bmp,.webp,.svg",
  documents: ".pdf,.doc,.docx,.txt,.odt,.rtf",
};

const ALL_ACCEPTED_TYPES = `${ACCEPTED_FILE_TYPES.images},${ACCEPTED_FILE_TYPES.documents}`;

export default function EighthForm() {
  const { t } = useTranslation();
  const { updateEighthFormFile, getEighthFormFile, getEighthFormPreviewUrl } =
    useFileData();

  const grades: GradeKey[] = ["10", "11", "12"];
  const semesters = [t("eighthForm.semester1"), t("eighthForm.semester2")];

  const handleFileChange = (
    grade: GradeKey,
    semesterIndex: SemesterKey,
    file: File | null,
  ) => {
    updateEighthFormFile(grade, semesterIndex, file);
  };

  const handleClearFile = (
    grade: GradeKey,
    semesterIndex: SemesterKey,
    event: React.MouseEvent,
  ) => {
    event.preventDefault();
    event.stopPropagation();
    handleFileChange(grade, semesterIndex, null);
  };

  const getFileIcon = (file: File) => {
    const fileType = file.type;
    const fileName = file.name.toLowerCase();

    if (fileType.startsWith("image/")) {
      return <ImageIcon sx={{ fontSize: 48, color: "#4CAF50" }} />;
    } else if (fileType === "application/pdf" || fileName.endsWith(".pdf")) {
      return <PictureAsPdfIcon sx={{ fontSize: 48, color: "#F44336" }} />;
    } else if (
      fileType.includes("document") ||
      fileName.endsWith(".doc") ||
      fileName.endsWith(".docx")
    ) {
      return <DescriptionIcon sx={{ fontSize: 48, color: "#2196F3" }} />;
    } else {
      return <InsertDriveFileIcon sx={{ fontSize: 48, color: "#757575" }} />;
    }
  };

  const isImageFile = (file: File) => {
    return file.type.startsWith("image/");
  };

  return (
    <Box
      className="eighth-form"
      sx={{ display: "flex", flexDirection: "column", gap: 5 }}
    >
      <Box sx={{ display: "flex", gap: 20, marginRight: "30px" }}>
        {grades.map((grade) => (
          <Box key={grade} className="grade-section">
            {/* Grade Title */}
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
                          paddingTop: "75px",
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
                            width: "150px",
                            height: "150px",
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
                          }}
                        >
                          {/* Clear button - shows when there's a file */}
                          {currentFile && (
                            <Tooltip title="Clear file">
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
                                }}
                              >
                                <ClearIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          )}

                          {/* Hidden file input */}
                          <Box
                            component="input"
                            type="file"
                            accept={ALL_ACCEPTED_TYPES}
                            onChange={(
                              e: React.ChangeEvent<HTMLInputElement>,
                            ) => {
                              const file = e.target.files?.[0] ?? null;
                              handleFileChange(grade, semesterIndex, file);
                              // Reset input value to allow re-uploading same file
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
                                    }}
                                  >
                                    Click to replace
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
                                      fontSize: "0.7rem",
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
                                    }}
                                  >
                                    Click to replace
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
                              <Typography
                                variant="caption"
                                sx={{
                                  color: "#999",
                                  textAlign: "center",
                                  fontSize: "0.65rem",
                                  mt: 0.5,
                                }}
                              >
                                Images or Documents
                              </Typography>
                            </Box>
                          )}
                        </Box>

                        {/* File info below upload box */}
                        {currentFile && (
                          <Box
                            sx={{
                              mt: 1,
                              maxWidth: "150px",
                              width: "100%",
                              textAlign: "center",
                            }}
                          >
                            <Typography
                              variant="caption"
                              sx={{
                                color: "#ffffffff",
                                display: "block -webkit-box",
                                wordBreak: "break-word",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                WebkitLineClamp: 1,
                                WebkitBoxOrient: "vertical",
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
