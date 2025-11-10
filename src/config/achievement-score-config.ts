import { CCNNType, CCQTType } from "../type/enum/exam";

interface ScoreRange {
  min: number;
  max: number;
  step?: number; // For scores that increment by specific values
  decimalPlaces?: number; // Number of decimal places allowed
}

// Score ranges for CCNN (Language Certification) exams
export const CCNN_SCORE_RANGES: Record<string, ScoreRange> = {
  [CCNNType.IELTS]: {
    min: 0,
    max: 9,
    step: 0.5,
    decimalPlaces: 1,
  },
  [CCNNType.TOEFL_CBT]: {
    min: 0,
    max: 300,
    decimalPlaces: 0,
  },
  [CCNNType.TOEFL_iBT]: {
    min: 0,
    max: 120,
    decimalPlaces: 0,
  },
  [CCNNType.TOEFL_Paper]: {
    min: 310,
    max: 677,
    decimalPlaces: 0,
  },
  [CCNNType.TOEIC]: {
    min: 10,
    max: 990,
    decimalPlaces: 0,
  },
};

// Score ranges for CCQT (International Certification) exams
export const CCQT_SCORE_RANGES: Record<string, ScoreRange> = {
  [CCQTType.ACT]: {
    min: 1,
    max: 36,
    decimalPlaces: 0,
  },
  [CCQTType.DoulingoEnglishTest]: {
    min: 10,
    max: 160,
    decimalPlaces: 0,
  },
  [CCQTType.IB]: {
    min: 1,
    max: 45,
    decimalPlaces: 0,
  },
  [CCQTType.OSSD]: {
    min: 0,
    max: 100,
    decimalPlaces: 2,
  },
  [CCQTType.PTE_Academic]: {
    min: 10,
    max: 90,
    decimalPlaces: 0,
  },
  [CCQTType.SAT]: {
    min: 400,
    max: 1600,
    decimalPlaces: 0,
  },
};

// Combined score ranges
export const EXAM_SCORE_RANGES: Partial<Record<string, ScoreRange>> = {
  ...CCNN_SCORE_RANGES,
  ...CCQT_SCORE_RANGES,
};

/**
 * Get score range configuration for a specific exam type
 */
export const getScoreRange = (examType: string | null): ScoreRange | null => {
  if (!examType) return null;
  return EXAM_SCORE_RANGES[examType] ?? null;
};

/**
 * Check if exam type uses grade/level dropdown instead of numeric score
 */
export const usesGradeDropdown = (examType: string | null): boolean => {
  return examType === CCQTType.ALevel || examType === CCNNType.JLPT;
};

/**
 * Validate and sanitize score input based on exam type
 * Only validates format during typing, boundary checks happen on blur
 */
export const validateExamScore = (
  value: string,
  examType: string | null,
): string => {
  // Allow empty string
  if (value === "") return "";

  const scoreRange = getScoreRange(examType);
  if (!scoreRange) {
    // If no score range is defined, use default validation (allow any numbers with up to 2 decimals)
    return validateDefaultScoreFormat(value);
  }

  const { decimalPlaces = 2 } = scoreRange;

  // Create regex based on decimal places
  const regex =
    decimalPlaces === 0
      ? /^\d+$/ // Only whole numbers
      : new RegExp(`^\\d*\\.?\\d{0,${String(decimalPlaces)}}$`);

  // Only validate format, NOT range - this allows users to type freely
  if (!regex.test(value)) {
    return value.slice(0, -1);
  }

  return value;
};

/**
 * Default score format validation (any number with max 2 decimals)
 */
const validateDefaultScoreFormat = (value: string): string => {
  // Allow only numbers and one decimal point with max 2 decimal places
  const regex = /^\d*\.?\d{0,2}$/;
  if (!regex.test(value)) return value.slice(0, -1);

  return value;
};

/**
 * Format score on blur (when user leaves the input field)
 * This is where we apply min/max boundaries and formatting
 */
export const formatScoreOnBlur = (
  value: string,
  examType: string | null,
): string => {
  if (value === "") return "";

  const scoreRange = getScoreRange(examType);
  if (!scoreRange) return value;

  const { min, max, step, decimalPlaces = 2 } = scoreRange;
  let numValue = parseFloat(value);

  if (isNaN(numValue)) return "";

  // Clamp value to range (this is where min/max boundaries are applied)
  numValue = Math.min(Math.max(numValue, min), max);

  // For IELTS, round to nearest 0.5
  if (step) {
    numValue = Math.round(numValue / step) * step;
  }

  // Format with appropriate decimal places
  if (decimalPlaces === 0) {
    return Math.round(numValue).toString();
  }

  return numValue.toFixed(decimalPlaces).replace(/\.?0+$/, "");
};

/**
 * Get placeholder text based on exam type
 */
export const getScorePlaceholder = (
  examType: string | null,
  defaultPlaceholder: string,
): string => {
  const scoreRange = getScoreRange(examType);
  if (!scoreRange) return defaultPlaceholder;

  const { min, max, step } = scoreRange;

  if (step) {
    return `${String(min)}-${String(max)}`;
  }

  return `${String(min)}-${String(max)}`;
};
