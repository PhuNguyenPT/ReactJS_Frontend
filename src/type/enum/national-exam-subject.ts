// Define types for better TypeScript support
type NationalExamSubjectTranslationKey =
  | "subjects.math"
  | "subjects.literature"
  | "subjects.english"
  | "subjects.german"
  | "subjects.russian"
  | "subjects.japanese"
  | "subjects.french"
  | "subjects.chinese"
  | "subjects.physics"
  | "subjects.chemistry"
  | "subjects.biology"
  | "subjects.history"
  | "subjects.geography"
  | "subjects.civic_education"
  | "subjects.informatics"
  | "subjects.technology";

// NationalExamSubjects enum with translation keys
export const NationalExamSubjects = {
  TOAN: "subjects.math",
  NGU_VAN: "subjects.literature",
  TIENG_ANH: "subjects.english",
  TIENG_DUC: "subjects.german",
  TIENG_NGA: "subjects.russian",
  TIENG_NHAT: "subjects.japanese",
  TIENG_PHAP: "subjects.french",
  TIENG_TRUNG: "subjects.chinese",
  VAT_LY: "subjects.physics",
  HOA_HOC: "subjects.chemistry",
  SINH_HOC: "subjects.biology",
  LICH_SU: "subjects.history",
  DIA_LY: "subjects.geography",
  GDKT_PL: "subjects.civic_education",
  TIN_HOC: "subjects.informatics",
  CONG_NGHE: "subjects.technology",
} as const;

// Mapping from translation keys to Vietnamese values (for API)
export const NationalExamSubjectsVietnamese: Record<
  NationalExamSubjectTranslationKey,
  string
> = {
  "subjects.math": "Toán",
  "subjects.literature": "Ngữ Văn",
  "subjects.english": "Tiếng Anh",
  "subjects.german": "Tiếng Đức",
  "subjects.russian": "Tiếng Nga",
  "subjects.japanese": "Tiếng Nhật",
  "subjects.french": "Tiếng Pháp",
  "subjects.chinese": "Tiếng Trung",
  "subjects.physics": "Vật Lý",
  "subjects.chemistry": "Hóa Học",
  "subjects.biology": "Sinh Học",
  "subjects.history": "Lịch Sử",
  "subjects.geography": "Địa Lý",
  "subjects.civic_education": "Giáo dục Kinh tế và Pháp luật",
  "subjects.informatics": "Tin Học",
  "subjects.technology": "Công Nghệ",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToNationalExamSubjects: Record<
  string,
  NationalExamSubjectTranslationKey
> = Object.fromEntries(
  Object.entries(NationalExamSubjectsVietnamese).map(([key, value]) => [
    value,
    key as NationalExamSubjectTranslationKey,
  ]),
) as Record<string, NationalExamSubjectTranslationKey>;

// Type guard to check if a string is a valid subject translation key
function isNationalExamSubjectTranslationKey(
  key: string,
): key is NationalExamSubjectTranslationKey {
  return key in NationalExamSubjectsVietnamese;
}

// Helper functions
export const getAllNationalExamSubjects = () => {
  return Object.values(NationalExamSubjects);
};

export const getSelectableSubjects = () => {
  // Return all subjects except Math and Literature (which are mandatory)
  return Object.values(NationalExamSubjects).filter(
    (subject) =>
      subject !== NationalExamSubjects.TOAN &&
      subject !== NationalExamSubjects.NGU_VAN,
  );
};

export const getNationalExamSubjectVietnameseValue = (
  translationKey: string,
): string => {
  if (isNationalExamSubjectTranslationKey(translationKey)) {
    return NationalExamSubjectsVietnamese[translationKey];
  }
  return translationKey;
};

export const getNationalExamSubjectTranslationKey = (
  vietnameseValue: string,
): string => {
  if (vietnameseValue in VietnameseToNationalExamSubjects) {
    return VietnameseToNationalExamSubjects[vietnameseValue];
  }
  return vietnameseValue;
};
