// Translation keys for exam types
export type ExamTypeTranslationKey =
  | "examTypes.ielts"
  | "examTypes.jlpt"
  | "examTypes.toefl_cbt"
  | "examTypes.toefl_ibt"
  | "examTypes.toefl_paper"
  | "examTypes.toeic"
  | "examTypes.act"
  | "examTypes.a_level"
  | "examTypes.duolingo_english_test"
  | "examTypes.ib"
  | "examTypes.ossd"
  | "examTypes.pte_academic"
  | "examTypes.sat"
  | "examTypes.hsa"
  | "examTypes.tsa"
  | "examTypes.vnuhcm";

// CCNN (Language Certification) exam types
export const CCNNType = {
  IELTS: "examTypes.ielts",
  JLPT: "examTypes.jlpt",
  TOEFL_CBT: "examTypes.toefl_cbt",
  TOEFL_iBT: "examTypes.toefl_ibt",
  TOEFL_Paper: "examTypes.toefl_paper",
  TOEIC: "examTypes.toeic",
} as const;

// CCQT (International Certification) exam types
export const CCQTType = {
  ACT: "examTypes.act",
  ALevel: "examTypes.a_level",
  DoulingoEnglishTest: "examTypes.duolingo_english_test",
  IB: "examTypes.ib",
  OSSD: "examTypes.ossd",
  PTE_Academic: "examTypes.pte_academic",
  SAT: "examTypes.sat",
} as const;

// DGNL (Aptitude Assessment) exam types
export const DGNLType = {
  HSA: "examTypes.hsa",
  TSA: "examTypes.tsa",
  VNUHCM: "examTypes.vnuhcm",
} as const;

// Vietnamese mappings for exam types
export const ExamTypeValues: Record<ExamTypeTranslationKey, string> = {
  "examTypes.ielts": "IELTS",
  "examTypes.jlpt": "JLPT",
  "examTypes.toefl_cbt": "TOEFL CBT",
  "examTypes.toefl_ibt": "TOEFL iBT",
  "examTypes.toefl_paper": "TOEFL Paper",
  "examTypes.toeic": "TOEIC",
  "examTypes.act": "ACT",
  "examTypes.a_level": "Alevel",
  "examTypes.duolingo_english_test": "DoulingoEnglishTest",
  "examTypes.ib": "IB",
  "examTypes.ossd": "OSSD",
  "examTypes.pte_academic": "PTEAcademic",
  "examTypes.sat": "SAT",
  "examTypes.hsa": "HSA",
  "examTypes.tsa": "TSA",
  "examTypes.vnuhcm": "VNUHCM",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToExamType: Record<string, ExamTypeTranslationKey> =
  Object.fromEntries(
    Object.entries(ExamTypeValues).map(([key, value]) => [
      value,
      key as ExamTypeTranslationKey,
    ]),
  ) as Record<string, ExamTypeTranslationKey>;

// Type definitions for exam types
export type CCNNTypeValue = (typeof CCNNType)[keyof typeof CCNNType];
export type CCQTTypeValue = (typeof CCQTType)[keyof typeof CCQTType];
export type DGNLTypeValue = (typeof DGNLType)[keyof typeof DGNLType];

export type ExamType =
  | { type: "CCNN"; value: CCNNTypeValue }
  | { type: "CCQT"; value: CCQTTypeValue }
  | { type: "DGNL"; value: DGNLTypeValue };

// Type guard and helper functions for exam types
function isExamTypeTranslationKey(key: string): key is ExamTypeTranslationKey {
  return key in ExamTypeValues;
}

export const getExamTypeVietnameseValue = (translationKey: string): string => {
  if (isExamTypeTranslationKey(translationKey)) {
    return ExamTypeValues[translationKey];
  }
  return translationKey;
};

export const getExamTypeTranslationKey = (vietnameseValue: string): string => {
  if (vietnameseValue in VietnameseToExamType) {
    return VietnameseToExamType[vietnameseValue];
  }
  return vietnameseValue;
};
