/**
 * Score configuration for Optional Exam Categories (Third Optional Form)
 * Handles validation for DGNL, V-SAT, and Talent exam categories
 */

interface ScoreRange {
  min: number;
  max: number;
}

interface VNUHCMSubScoreConfig {
  languageScore: ScoreRange;
  mathScore: ScoreRange;
  scienceLogic: ScoreRange;
  decimalPlaces: number;
}

interface CategoryScoreConfig {
  maxEntries: number;
  minRequiredEntries: number;
  decimalPlaces: number;
  defaultRange: ScoreRange;
  subjectSpecificRanges?: Record<string, ScoreRange>;
  vnuhcmSubScores?: VNUHCMSubScoreConfig;
}

// Configuration for all optional exam categories
export const OPTIONAL_EXAM_CONFIGS: Record<string, CategoryScoreConfig> = {
  DGNL: {
    maxEntries: 3,
    minRequiredEntries: 0, // No minimum requirement
    decimalPlaces: 0, // No decimal places allowed (whole numbers only)
    defaultRange: { min: 0, max: 100 },
    subjectSpecificRanges: {
      "examTypes.hsa": { min: 0, max: 150 },
      "examTypes.tsa": { min: 0, max: 100 },
      "examTypes.vnuhcm": { min: 0, max: 1200 },
      "thirdForm.VNUHCM": { min: 0, max: 1200 },
      VNUHCM: { min: 0, max: 1200 },
    },
    // VNUHCM Component Scores Configuration
    vnuhcmSubScores: {
      languageScore: { min: 0, max: 400 },
      mathScore: { min: 0, max: 300 },
      scienceLogic: { min: 0, max: 500 },
      decimalPlaces: 2, // Allow 2 decimal places for sub-scores
    },
  },
  "V-SAT": {
    maxEntries: 8, // Maximum 8 subjects
    minRequiredEntries: 3, // Must have at least 3 subjects if started
    decimalPlaces: 0, // No decimal places allowed (whole numbers only)
    defaultRange: { min: 0, max: 150 },
  },
  "Năng khiếu": {
    maxEntries: 12, // Maximum 3 subjects
    minRequiredEntries: 0, // No minimum requirement
    decimalPlaces: 2, // Allow up to 2 decimal places
    defaultRange: { min: 0, max: 10 },
  },
};

// Vietnamese to English category name mapping
const CATEGORY_NAME_MAP: Record<string, keyof typeof OPTIONAL_EXAM_CONFIGS> = {
  ĐGNL: "DGNL",
  "V-SAT": "V-SAT",
  "Năng khiếu": "Năng khiếu",
};

/**
 * Get category configuration
 */
export const getCategoryConfig = (
  categoryName: string,
): CategoryScoreConfig | null => {
  const normalizedName = CATEGORY_NAME_MAP[categoryName] ?? categoryName;
  return OPTIONAL_EXAM_CONFIGS[normalizedName] ?? null;
};

/**
 * Get VNUHCM sub-score configuration
 */
export const getVNUHCMSubScoreConfig = (
  categoryName: string,
): VNUHCMSubScoreConfig | null => {
  const config = getCategoryConfig(categoryName);
  return config?.vnuhcmSubScores ?? null;
};

/**
 * Get VNUHCM sub-score limits for a specific field
 */
export const getVNUHCMSubScoreLimits = (
  categoryName: string,
  field: "languageScore" | "mathScore" | "scienceLogic",
): ScoreRange => {
  const config = getVNUHCMSubScoreConfig(categoryName);
  if (config?.[field]) {
    return config[field];
  }
  // Default fallback
  return { min: 0, max: 600 };
};

/**
 * Get decimal places for VNUHCM sub-scores
 */
export const getVNUHCMSubScoreDecimalPlaces = (
  categoryName: string,
): number => {
  const config = getVNUHCMSubScoreConfig(categoryName);
  return config?.decimalPlaces ?? 2;
};

/**
 * Calculate VNUHCM total score from sub-scores
 */
export const calculateVNUHCMTotalScore = (
  languageScore: string,
  mathScore: string,
  scienceLogic: string,
): string => {
  const lang = parseFloat(languageScore || "0");
  const math = parseFloat(mathScore || "0");
  const science = parseFloat(scienceLogic || "0");

  if (isNaN(lang) || isNaN(math) || isNaN(science)) {
    return "";
  }

  const total = lang + math + science;

  // Format to remove trailing zeros
  const formatted = total.toFixed(2);
  return formatted.replace(/\.?0+$/, "");
};

/**
 * Validate and sanitize VNUHCM sub-score input
 */
export const validateVNUHCMSubScore = (
  value: string,
  categoryName: string,
  field: "languageScore" | "mathScore" | "scienceLogic",
): string => {
  // Allow empty string
  if (value === "") return "";

  const decimalPlaces = getVNUHCMSubScoreDecimalPlaces(categoryName);
  const limits = getVNUHCMSubScoreLimits(categoryName, field);

  // Create regex based on decimal places allowed
  const regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces.toString()}}$`);

  if (!regex.test(value)) {
    return value.slice(0, -1);
  }

  // Check if the value exceeds the maximum allowed
  const numericValue = parseFloat(value);
  if (!isNaN(numericValue)) {
    // Prevent typing values that exceed the maximum
    if (numericValue > limits.max) {
      return limits.max.toString();
    }

    // Prevent typing values below the minimum
    if (numericValue < limits.min) {
      return limits.min.toString();
    }
  }

  return value;
};

/**
 * Format VNUHCM sub-score on blur
 */
export const formatVNUHCMSubScoreOnBlur = (
  value: string,
  categoryName: string,
  field: "languageScore" | "mathScore" | "scienceLogic",
): string => {
  if (value === "") return "";

  const limits = getVNUHCMSubScoreLimits(categoryName, field);
  const decimalPlaces = getVNUHCMSubScoreDecimalPlaces(categoryName);
  let numValue = parseFloat(value);

  if (isNaN(numValue)) return "";

  // Clamp value to range
  numValue = Math.min(Math.max(numValue, limits.min), limits.max);

  // Format with appropriate decimal places
  const formatted = numValue.toFixed(decimalPlaces);

  // Remove trailing zeros
  return formatted.replace(/\.?0+$/, "");
};

/**
 * Validate VNUHCM sub-score value and return error message if invalid
 */
export const validateVNUHCMSubScoreValue = (
  categoryName: string,
  field: "languageScore" | "mathScore" | "scienceLogic",
  scoreValue: string,
): string | null => {
  if (!scoreValue) return null; // Empty is valid

  const numericScore = parseFloat(scoreValue);
  if (isNaN(numericScore)) {
    return "Invalid number";
  }

  const limits = getVNUHCMSubScoreLimits(categoryName, field);

  if (numericScore < limits.min) {
    return `Score must be at least ${limits.min.toString()}`;
  }

  if (numericScore > limits.max) {
    return `Score cannot exceed ${limits.max.toString()}`;
  }

  return null; // Valid
};

/**
 * Get decimal places allowed for a category
 */
export const getDecimalPlaces = (categoryName: string): number => {
  const config = getCategoryConfig(categoryName);
  return config?.decimalPlaces ?? 2; // Default to 2 decimal places
};

/**
 * Get score limits based on category and subject
 */
export const getScoreLimits = (
  categoryName: string,
  subject?: string,
): ScoreRange => {
  const config = getCategoryConfig(categoryName);

  if (!config) {
    return { min: 0, max: 100 }; // Default fallback
  }

  // Check for subject-specific range
  if (subject && config.subjectSpecificRanges?.[subject]) {
    return config.subjectSpecificRanges[subject];
  }

  // Return default range for the category
  return config.defaultRange;
};

/**
 * Get maximum number of entries allowed for a category
 */
export const getMaxEntries = (categoryName: string): number => {
  const config = getCategoryConfig(categoryName);
  return config?.maxEntries ?? Infinity; // No limit by default
};

/**
 * Get minimum required entries for a category
 */
export const getMinRequiredEntries = (categoryName: string): number => {
  const config = getCategoryConfig(categoryName);
  return config?.minRequiredEntries ?? 0; // No minimum by default
};

/**
 * Validate and sanitize optional exam score input
 */
export const validateOptionalExamScore = (
  value: string,
  categoryName: string,
  subject: string,
): string => {
  // Allow empty string
  if (value === "") return "";

  const decimalPlaces = getDecimalPlaces(categoryName);

  // If no decimal places allowed, block any input containing a dot
  if (decimalPlaces === 0 && value.includes(".")) {
    return value.replace(".", "");
  }

  // Create regex based on decimal places allowed
  let regex: RegExp;
  if (decimalPlaces === 0) {
    // Only integers allowed (no decimal point)
    regex = /^\d*$/;
  } else {
    // Allow decimal point with specified number of decimal places
    regex = new RegExp(`^\\d*\\.?\\d{0,${decimalPlaces.toString()}}$`);
  }

  if (!regex.test(value)) {
    return value.slice(0, -1);
  }

  // Check if the value exceeds the maximum allowed
  const numericValue = parseFloat(value);
  if (!isNaN(numericValue)) {
    const limits = getScoreLimits(categoryName, subject);

    // Prevent typing values that exceed the maximum
    if (numericValue > limits.max) {
      return limits.max.toString();
    }

    // Prevent typing values below the minimum
    if (numericValue < limits.min) {
      return limits.min.toString();
    }
  }

  return value;
};

/**
 * Format score on blur (when user leaves the input field)
 */
export const formatOptionalExamScoreOnBlur = (
  value: string,
  categoryName: string,
  subject: string,
): string => {
  if (value === "") return "";

  const limits = getScoreLimits(categoryName, subject);
  const decimalPlaces = getDecimalPlaces(categoryName);
  let numValue = parseFloat(value);

  if (isNaN(numValue)) return "";

  // Clamp value to range
  numValue = Math.min(Math.max(numValue, limits.min), limits.max);

  // Format with appropriate decimal places
  if (decimalPlaces === 0) {
    return Math.round(numValue).toString();
  }

  // Remove trailing zeros
  const formatted = numValue.toFixed(decimalPlaces);
  return formatted.replace(/\.?0+$/, "");
};

/**
 * Validate score value and return error message if invalid
 */
export const validateOptionalExamScoreValue = (
  categoryName: string,
  subject: string,
  scoreValue: string,
): string | null => {
  if (!scoreValue) return null; // Empty is valid

  const numericScore = parseFloat(scoreValue);
  if (isNaN(numericScore)) {
    return "Invalid number";
  }

  const limits = getScoreLimits(categoryName, subject);

  if (numericScore < limits.min) {
    return `Score must be at least ${limits.min.toString()}`;
  }

  if (numericScore > limits.max) {
    return `Score cannot exceed ${limits.max.toString()}`;
  }

  return null; // Valid
};

/**
 * Get placeholder text for score input
 */
export const getOptionalExamScorePlaceholder = (
  categoryName: string,
  subject: string,
): string => {
  const limits = getScoreLimits(categoryName, subject);
  return `${limits.min.toString()}-${limits.max.toString()}`;
};

/**
 * Get score range info for display
 */
export const getOptionalExamScoreRangeInfo = (
  categoryName: string,
  subject: string,
): string => {
  const limits = getScoreLimits(categoryName, subject);
  return `${limits.min.toString()}-${limits.max.toString()}`;
};

/**
 * Check if a category can accept more entries
 */
export const canAddEntry = (
  categoryName: string,
  currentEntryCount: number,
): boolean => {
  const maxEntries = getMaxEntries(categoryName);
  return currentEntryCount < maxEntries;
};

/**
 * Get remaining slots for a category
 */
export const getRemainingSlots = (
  categoryName: string,
  currentEntryCount: number,
): number => {
  const maxEntries = getMaxEntries(categoryName);
  return Math.max(0, maxEntries - currentEntryCount);
};

/**
 * Validate category entry count against requirements
 */
export const validateCategoryEntryCount = (
  categoryName: string,
  filledEntryCount: number,
): { isValid: boolean; error: string | null } => {
  const config = getCategoryConfig(categoryName);

  if (!config) {
    return { isValid: true, error: null };
  }

  // Check minimum requirement (only if user has started filling)
  if (filledEntryCount > 0 && filledEntryCount < config.minRequiredEntries) {
    return {
      isValid: false,
      error: `At least ${config.minRequiredEntries.toString()} entries required for ${categoryName}`,
    };
  }

  // Check maximum limit
  if (filledEntryCount > config.maxEntries) {
    return {
      isValid: false,
      error: `Maximum ${config.maxEntries.toString()} entries allowed for ${categoryName}`,
    };
  }

  return { isValid: true, error: null };
};
