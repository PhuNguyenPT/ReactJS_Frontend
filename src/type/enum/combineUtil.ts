import { VietnameseSubject } from "./subject";
import { getTalentExamSubjects } from "./talent-exam";
import { DGNLType } from "./exam";
import {
  getVietnameseSubjectValue,
  getVietnameseSubjectTranslationKey,
} from "./subject";
import { getExamTypeVietnameseValue, getExamTypeTranslationKey } from "./exam";

// ==========================================
// CATEGORY NAME TRANSLATION KEYS
// ==========================================

export const CategoryNames = {
  DGNL: "categories.dgnl",
  VSAT: "categories.vsat",
  TALENT: "categories.talent",
} as const;

// ==========================================
// MAIN CATEGORY SUBJECTS FUNCTION
// ==========================================

/**
 * Get subjects for optional categories based on category name
 * Returns translation keys that can be used with i18next
 * Supports both Vietnamese category names and translation keys
 */
export function getOptionalCategorySubjects(category: string): string[] {
  switch (category) {
    case "categories.dgnl":
    case "ĐGNL": // Support both translation key and Vietnamese value
      return Object.values(DGNLType);

    case "categories.vsat":
    case "V-SAT": // Support both translation key and Vietnamese value
      return Object.values(VietnameseSubject);

    case "categories.talent":
    case "Năng khiếu": // Support both translation key and Vietnamese value
      return getTalentExamSubjects(); // Use the curated talent subjects array

    default:
      return [];
  }
}

// ==========================================
// SUBJECT CONVERSION HELPER FUNCTIONS
// ==========================================

/**
 * Combined helper function to get Vietnamese value for any optional subject type
 * Works with both Vietnamese subjects and exam types
 */
export const getOptionalSubjectVietnameseValue = (
  translationKey: string,
): string => {
  // Try Vietnamese subject first
  const subjectValue = getVietnameseSubjectValue(translationKey);
  if (subjectValue !== translationKey) {
    return subjectValue;
  }

  // Try exam type
  const examValue = getExamTypeVietnameseValue(translationKey);
  if (examValue !== translationKey) {
    return examValue;
  }

  // Return original if no match found
  return translationKey;
};

/**
 * Combined helper function to get translation key from Vietnamese value
 * Works with both Vietnamese subjects and exam types
 */
export const getOptionalSubjectTranslationKey = (
  vietnameseValue: string,
): string => {
  // Try Vietnamese subject first
  const subjectKey = getVietnameseSubjectTranslationKey(vietnameseValue);
  if (subjectKey !== vietnameseValue) {
    return subjectKey;
  }

  // Try exam type
  const examKey = getExamTypeTranslationKey(vietnameseValue);
  if (examKey !== vietnameseValue) {
    return examKey;
  }

  // Return original if no match found
  return vietnameseValue;
};

// ==========================================
// ADDITIONAL UTILITY FUNCTIONS
// ==========================================

/**
 * Get all DGNL exam types
 */
export const getAllExamTypes = () => {
  return Object.values(DGNLType);
};

/**
 * Get all Vietnamese subjects
 */
export const getAllVietnameseSubjects = () => {
  return Object.values(VietnameseSubject);
};

/**
 * Get all talent exam subjects (curated list)
 */
export const getAllTalentSubjects = () => {
  return getTalentExamSubjects();
};

/**
 * Helper function to get category translation key from Vietnamese name
 */
export const getCategoryTranslationKey = (
  vietnameseCategoryName: string,
): string => {
  switch (vietnameseCategoryName) {
    case "ĐGNL":
      return "categories.dgnl";
    case "V-SAT":
      return "categories.vsat";
    case "Năng khiếu":
      return "categories.talent";
    default:
      return vietnameseCategoryName.toLowerCase();
  }
};
