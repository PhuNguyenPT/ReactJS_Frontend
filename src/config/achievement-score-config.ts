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
    step: 0.5, // IELTS scores increment by 0.5
    decimalPlaces: 1,
  },
  [CCNNType.JLPT]: {
    min: 0,
    max: 180,
    decimalPlaces: 0, // JLPT uses whole numbers
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
  [CCQTType.ALevel]: {
    min: 0,
    max: 100,
    decimalPlaces: 2, // A-Level can have decimal scores
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
 * Validate and sanitize score input based on exam type
 */
export const validateExamScore = (
  value: string,
  examType: string | null,
): string => {
  // Allow empty string
  if (value === "") return "";

  const scoreRange = getScoreRange(examType);
  if (!scoreRange) {
    // If no score range is defined, use default validation (0-100, 2 decimals)
    return validateDefaultScore(value);
  }

  const { min, max, step, decimalPlaces = 2 } = scoreRange;

  // Create regex based on decimal places
  const regex =
    decimalPlaces === 0
      ? /^\d+$/ // Only whole numbers
      : new RegExp(`^\\d*\\.?\\d{0,${String(decimalPlaces)}}$`);

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

  // For IELTS, validate step increment (must be in 0.5 increments)
  if (step && decimalPlaces > 0) {
    const decimalPart = value.split(".")[1];
    if (decimalPart) {
      const remainder = numValue % step;
      // Allow typing but don't auto-correct while typing
      if (remainder !== 0 && decimalPart.length >= decimalPlaces) {
        // Round to nearest valid step
        const rounded = Math.round(numValue / step) * step;
        return Math.min(Math.max(rounded, min), max).toFixed(decimalPlaces);
      }
    }
  }

  return value;
};

/**
 * Default score validation (0-100, max 2 decimals)
 */
const validateDefaultScore = (value: string): string => {
  // Allow only numbers and one decimal point with max 2 decimal places
  const regex = /^\d*\.?\d{0,2}$/;
  if (!regex.test(value)) return value.slice(0, -1);

  const numValue = parseFloat(value);
  if (isNaN(numValue)) return value;

  if (numValue > 100) return "100";
  if (numValue < 0) return "0";

  return value;
};

/**
 * Format score on blur (when user leaves the input field)
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

  // Clamp value to range
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
    return `${String(min)}-${String(max)} (${String(step)} increment)`;
  }

  return `${String(min)}-${String(max)}`;
};
