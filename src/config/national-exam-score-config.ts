/**
 * Score configuration for National Exam subjects (Third Main Form)
 * Handles validation for mandatory and optional subjects in the Vietnamese National Exam
 */

interface ScoreConfig {
  min: number;
  max: number;
  decimalPlaces: number;
}

// Configuration for all National Exam subjects
export const NATIONAL_EXAM_SCORE_CONFIG: ScoreConfig = {
  min: 0,
  max: 10,
  decimalPlaces: 2, // Allow up to 2 decimal places (e.g., 8.75)
};

/**
 * Validate and sanitize national exam score input
 */
export const validateNationalExamScore = (value: string): string => {
  // Allow empty string
  if (value === "") return "";

  const { min, max, decimalPlaces } = NATIONAL_EXAM_SCORE_CONFIG;

  // Create regex based on decimal places
  const regex = new RegExp(`^\\d*\\.?\\d{0,${String(decimalPlaces)}}$`);

  // Check if input matches the pattern
  if (!regex.test(value)) {
    return value.slice(0, -1);
  }

  // Convert to number and validate range
  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;

  // If greater than max, return max
  if (numValue > max) return max.toString();

  // If less than min, return min
  if (numValue < min) return min.toString();

  return value;
};

/**
 * Format score on blur (when user leaves the input field)
 */
export const formatNationalExamScoreOnBlur = (value: string): string => {
  if (value === "") return "";

  const { min, max, decimalPlaces } = NATIONAL_EXAM_SCORE_CONFIG;
  let numValue = parseFloat(value);

  if (isNaN(numValue)) return "";

  // Clamp value to range
  numValue = Math.min(Math.max(numValue, min), max);

  // Format with appropriate decimal places, removing trailing zeros
  const formatted = numValue.toFixed(decimalPlaces);
  return formatted.replace(/\.?0+$/, "");
};

/**
 * Get placeholder text for national exam score input
 */
export const getNationalExamScorePlaceholder = (): string => {
  const { min, max } = NATIONAL_EXAM_SCORE_CONFIG;
  return `${String(min)}-${String(max)}`;
};

/**
 * Get score range info for display
 */
export const getNationalExamScoreRangeInfo = (): string => {
  const { min, max } = NATIONAL_EXAM_SCORE_CONFIG;
  return `${String(min)}-${String(max)}`;
};
