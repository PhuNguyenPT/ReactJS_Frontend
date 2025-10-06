// Translation keys for special student cases
export type SpecialStudentCaseTranslationKey =
  | "specialCases.ethnic_minority_student"
  | "specialCases.heroes_and_contributors"
  | "specialCases.transfer_student"
  | "specialCases.very_few_ethnic_minority";

// SpecialStudentCase enum with translation keys
export const SpecialStudentCase = {
  ETHNIC_MINORITY_STUDENT: "specialCases.ethnic_minority_student",
  HEROES_AND_CONTRIBUTORS: "specialCases.heroes_and_contributors",
  TRANSFER_STUDENT: "specialCases.transfer_student",
  VERY_FEW_ETHNIC_MINORITY: "specialCases.very_few_ethnic_minority",
} as const;

// Vietnamese mappings for special student cases
export const SpecialStudentCaseValues: Record<
  SpecialStudentCaseTranslationKey,
  string
> = {
  "specialCases.ethnic_minority_student":
    "Học sinh thuộc huyện nghèo, vùng đặc biệt khó khăn",
  "specialCases.heroes_and_contributors":
    "Anh hùng Lao động, Anh hùng Lực lượng vũ trang Nhân dân, Chiến sĩ thi đua toàn quốc",
  "specialCases.transfer_student": "Học sinh trường chuyên",
  "specialCases.very_few_ethnic_minority":
    "Dân tộc thiểu số rất ít người (Mông, La Ha,...)",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToSpecialStudentCase: Record<
  string,
  SpecialStudentCaseTranslationKey
> = Object.fromEntries(
  Object.entries(SpecialStudentCaseValues).map(([key, value]) => [
    value,
    key as SpecialStudentCaseTranslationKey,
  ]),
) as Record<string, SpecialStudentCaseTranslationKey>;

// Type guard and helper functions
function isSpecialStudentCaseTranslationKey(
  key: string,
): key is SpecialStudentCaseTranslationKey {
  return key in SpecialStudentCaseValues;
}

export const getSpecialStudentCaseVietnameseValue = (
  translationKey: string,
): string => {
  if (isSpecialStudentCaseTranslationKey(translationKey)) {
    return SpecialStudentCaseValues[translationKey];
  }
  return translationKey;
};

export const getSpecialStudentCaseTranslationKey = (
  vietnameseValue: string,
): string => {
  if (vietnameseValue in VietnameseToSpecialStudentCase) {
    return VietnameseToSpecialStudentCase[vietnameseValue];
  }
  return vietnameseValue;
};
