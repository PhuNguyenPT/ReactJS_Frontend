import {
  Box,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TextField,
  Autocomplete,
  Alert,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useNinthFormLogic } from "../../../hooks/formPages/useNinthForm";

export default function NinthForm() {
  const {
    showAlert,
    scores,
    selectedSubjects,
    fixedSubjects,
    optionalSubjects,
    gradeInfoList,
    handleScoreChange,
    handleSubjectSelect,
    handleCloseAlert,
    getSubjectLabel,
    isScoreHighlighted,
    isSubjectHighlighted,
    translations,
  } = useNinthFormLogic();

  const renderSubjectInputs = (gradeKey: string) => (
    <>
      {/* Fixed subjects */}
      {fixedSubjects.map((subjectKey) => (
        <Box
          key={subjectKey}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 1.5, sm: 3, md: 5 },
            mb: { xs: 2, sm: 1.5 },
          }}
        >
          {/* Subject pill (same look as Autocomplete) */}
          <TextField
            value={getSubjectLabel(subjectKey)}
            disabled
            sx={{
              width: { xs: "100%", sm: "200px", md: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "17px",
                height: { xs: "48px", sm: "45px" },
                backgroundColor: "white",
                "& fieldset": { borderColor: "#A657AE" },
                "&.Mui-disabled fieldset": { borderColor: "#A657AE" },
              },
              "& .MuiInputBase-input.Mui-disabled": {
                WebkitTextFillColor: "#A657AE",
              },
              "& input": {
                textAlign: "left",
                fontWeight: 500,
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
            slotProps={{
              htmlInput: { readOnly: true },
            }}
          />

          {/* Score input */}
          <TextField
            variant="outlined"
            size="small"
            placeholder={translations.score}
            value={scores[gradeKey][subjectKey] || ""}
            onChange={(e) => {
              handleScoreChange(gradeKey, subjectKey, e.target.value);
            }}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: "200px", md: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "17px",
                height: { xs: "48px", sm: "45px" },
                backgroundColor: isScoreHighlighted(gradeKey, subjectKey)
                  ? "rgba(166, 87, 174, 0.05)"
                  : "white",
                "& fieldset": { borderColor: "#A657AE" },
                "&:hover fieldset": { borderColor: "#8B4A8F" },
                "&.Mui-focused fieldset": { borderColor: "#A657AE" },
              },
              "& input": {
                color: "#A657AE",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
            slotProps={{
              htmlInput: {
                pattern: "[0-9]+(\\.[0-9]+)?",
              },
            }}
          />
        </Box>
      ))}

      {/* Optional subjects with Autocomplete */}
      {selectedSubjects[gradeKey].map((subjectKey, idx) => (
        <Box
          key={`dropdown-${String(idx)}`}
          sx={{
            display: "flex",
            flexDirection: { xs: "column", sm: "row" },
            alignItems: { xs: "stretch", sm: "center" },
            gap: { xs: 1.5, sm: 3, md: 5 },
            mb: { xs: 2, sm: 1.5 },
          }}
        >
          <Autocomplete
            options={optionalSubjects}
            value={subjectKey}
            onChange={(_, newValue) => {
              handleSubjectSelect(gradeKey, idx, newValue);
            }}
            getOptionLabel={(option) => getSubjectLabel(option)}
            renderInput={(params) => (
              <TextField
                {...params}
                placeholder={translations.chooseSubject}
                sx={{
                  width: { xs: "100%", sm: "200px", md: "250px" },
                  "& .MuiOutlinedInput-root": {
                    borderRadius: "17px",
                    height: { xs: "48px", sm: "45px" },
                    backgroundColor: isSubjectHighlighted(gradeKey, subjectKey)
                      ? "rgba(166, 87, 174, 0.05)"
                      : "white",
                    "& fieldset": { borderColor: "#A657AE" },
                    "&:hover fieldset": { borderColor: "#8B4A8F" },
                    "&.Mui-focused fieldset": { borderColor: "#A657AE" },
                  },
                  "& input": {
                    color: "#A657AE",
                    textAlign: "left",
                    fontSize: { xs: "0.875rem", sm: "1rem" },
                  },
                }}
              />
            )}
          />

          <TextField
            variant="outlined"
            size="small"
            placeholder={translations.score}
            value={subjectKey ? scores[gradeKey][subjectKey] || "" : ""}
            onChange={(e) => {
              if (subjectKey) {
                handleScoreChange(gradeKey, subjectKey, e.target.value);
              }
            }}
            disabled={!subjectKey}
            sx={{
              width: { xs: "100%", sm: "auto" },
              minWidth: { xs: "100%", sm: "200px", md: "250px" },
              "& .MuiOutlinedInput-root": {
                borderRadius: "17px",
                height: { xs: "48px", sm: "45px" },
                backgroundColor:
                  subjectKey && isScoreHighlighted(gradeKey, subjectKey)
                    ? "rgba(166, 87, 174, 0.05)"
                    : "white",
                "& fieldset": { borderColor: "#A657AE" },
                "&:hover fieldset": { borderColor: "#8B4A8F" },
                "&.Mui-focused fieldset": { borderColor: "#A657AE" },
              },
              "& input": {
                color: "#A657AE",
                fontSize: { xs: "0.875rem", sm: "1rem" },
              },
            }}
            slotProps={{
              htmlInput: {
                pattern: "[0-9]+(\\.[0-9]+)?",
              },
            }}
          />
        </Box>
      ))}
    </>
  );

  return (
    <Box
      className="ninth-form"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: { xs: 2, sm: 2.5, md: 3 },
        maxWidth: "620px",
        width: "90%",
        margin: "0 auto",
        px: { xs: 1, sm: 2 },
        py: { xs: 2, sm: 3 },
      }}
    >
      {/* OCR Load Status Message */}
      {showAlert && (
        <Alert
          severity="success"
          onClose={handleCloseAlert}
          sx={{
            mb: 2,
            fontSize: { xs: "0.875rem", sm: "1rem" },
          }}
        >
          {translations.scoreBoardDataLoaded}
        </Alert>
      )}

      {/* Render accordions for each grade/semester */}
      {gradeInfoList.map((gradeInfo) => (
        <Accordion
          key={gradeInfo.key}
          sx={{
            backgroundColor: "rgba(255, 255, 255, 0.95)",
            borderRadius: "12px !important",
            mb: { xs: 1.5, sm: 2 },
            "&:before": { display: "none" },
            boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
          }}
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon sx={{ color: "#A657AE" }} />}
            sx={{
              backgroundColor: "rgba(166, 87, 174, 0.1)",
              borderRadius: "12px",
              minHeight: { xs: "56px", sm: "64px" },
              "& .MuiAccordionSummary-content": {
                alignItems: "center",
                my: { xs: 1, sm: 1.5 },
              },
            }}
          >
            <Typography
              variant="h6"
              sx={{
                color: "#A657AE",
                fontWeight: 600,
                fontSize: { xs: "1rem", sm: "1.15rem", md: "1.25rem" },
              }}
            >
              {translations.grade} {gradeInfo.grade} - {gradeInfo.semester}
            </Typography>
          </AccordionSummary>
          <AccordionDetails
            sx={{
              px: { xs: 2, sm: 3 },
              py: { xs: 2, sm: 3 },
            }}
          >
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {renderSubjectInputs(gradeInfo.key)}
            </Box>
          </AccordionDetails>
        </Accordion>
      ))}
    </Box>
  );
}
