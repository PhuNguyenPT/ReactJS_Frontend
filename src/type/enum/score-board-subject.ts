// Define types for better TypeScript support
type ScordBoardSubjectTranslationKey =
  | "subjects.toan"
  | "subjects.ngu_van"
  | "subjects.tieng_anh"
  | "subjects.tieng_duc"
  | "subjects.tieng_nga"
  | "subjects.tieng_han"
  | "subjects.tieng_nhat"
  | "subjects.tieng_phap"
  | "subjects.tieng_trung"
  | "subjects.vat_ly"
  | "subjects.hoa_hoc"
  | "subjects.sinh_hoc"
  | "subjects.lich_su"
  | "subjects.dia_ly"
  | "subjects.gdktpl"
  | "subjects.tin_hoc"
  | "subjects.cong_nghe_cong_nghiep"
  | "subjects.cong_nghe_nong_nghiep";

// NationalExamSubjects enum with translation keys
export const ScoreBoardSubjects = {
  TOAN: "subjects.toan",
  NGU_VAN: "subjects.ngu_van",
  TIENG_ANH: "subjects.tieng_anh",
  TIENG_DUC: "subjects.tieng_duc",
  TIENG_NGA: "subjects.tieng_nga",
  TIENG_HAN: "subjects.tieng_han",
  TIENG_NHAT: "subjects.tieng_nhat",
  TIENG_PHAP: "subjects.tieng_phap",
  TIENG_TRUNG: "subjects.tieng_trung",
  VAT_LY: "subjects.vat_ly",
  HOA_HOC: "subjects.hoa_hoc",
  SINH_HOC: "subjects.sinh_hoc",
  LICH_SU: "subjects.lich_su",
  DIA_LY: "subjects.dia_ly",
  GDKTPL: "subjects.gdktpl",
  TIN_HOC: "subjects.tin_hoc",
  CONG_NGHE_CONG_NGHIEP: "subjects.cong_nghe_cong_nghiep",
  CONG_NGHE_NONG_NGHIEP: "subjects.cong_nghe_nong_nghiep",
} as const;

// Export the type
export type { ScordBoardSubjectTranslationKey };

// Mapping from translation keys to Vietnamese values (for API)
export const ScoreBoardSubjectsVietnamese: Record<
  ScordBoardSubjectTranslationKey,
  string
> = {
  "subjects.toan": "Toán",
  "subjects.ngu_van": "Ngữ Văn",
  "subjects.tieng_anh": "Tiếng Anh",
  "subjects.tieng_duc": "Tiếng Đức",
  "subjects.tieng_nga": "Tiếng Nga",
  "subjects.tieng_han": "Tiếng Hàn",
  "subjects.tieng_nhat": "Tiếng Nhật",
  "subjects.tieng_phap": "Tiếng Pháp",
  "subjects.tieng_trung": "Tiếng Trung",
  "subjects.vat_ly": "Vật Lý",
  "subjects.hoa_hoc": "Hóa Học",
  "subjects.sinh_hoc": "Sinh Học",
  "subjects.lich_su": "Lịch Sử",
  "subjects.dia_ly": "Địa Lý",
  "subjects.gdktpl": "GDKTPL",
  "subjects.tin_hoc": "Tin Học",
  "subjects.cong_nghe_cong_nghiep": "Công nghệ Công nghiệp",
  "subjects.cong_nghe_nong_nghiep": "Công nghệ Nông nghiệp",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToScoreBoardSubjects: Record<
  string,
  ScordBoardSubjectTranslationKey
> = Object.fromEntries(
  Object.entries(ScoreBoardSubjectsVietnamese).map(([key, value]) => [
    value,
    key as ScordBoardSubjectTranslationKey,
  ]),
) as Record<string, ScordBoardSubjectTranslationKey>;

// Type guard to check if a string is a valid subject translation key
export function isScoreBoardSubjectTranslationKey(
  key: string,
): key is ScordBoardSubjectTranslationKey {
  return key in ScoreBoardSubjectsVietnamese;
}

// Helper functions
export const getAllScoreBoardSubjects =
  (): ScordBoardSubjectTranslationKey[] => {
    return Object.values(ScoreBoardSubjects);
  };

export const getSelectableSubjects = (): ScordBoardSubjectTranslationKey[] => {
  // Return all subjects except Math and Literature (which are mandatory)
  return Object.values(ScoreBoardSubjects).filter(
    (subject) =>
      subject !== ScoreBoardSubjects.TOAN &&
      subject !== ScoreBoardSubjects.NGU_VAN,
  );
};

// Check if a subject is a technology subject (Công nghệ)
export const isTechnologySubject = (subject: string | null): boolean => {
  if (!subject) return false;
  return (
    subject === ScoreBoardSubjects.CONG_NGHE_CONG_NGHIEP ||
    subject === ScoreBoardSubjects.CONG_NGHE_NONG_NGHIEP
  );
};

// Get the other technology subject
export const getOtherTechnologySubject = (
  subject: string,
): ScordBoardSubjectTranslationKey | null => {
  if (subject === ScoreBoardSubjects.CONG_NGHE_CONG_NGHIEP) {
    return ScoreBoardSubjects.CONG_NGHE_NONG_NGHIEP;
  }
  if (subject === ScoreBoardSubjects.CONG_NGHE_NONG_NGHIEP) {
    return ScoreBoardSubjects.CONG_NGHE_CONG_NGHIEP;
  }
  return null;
};

export const getNationalExamSubjectVietnameseValue = (
  translationKey: string,
): string => {
  if (isScoreBoardSubjectTranslationKey(translationKey)) {
    return ScoreBoardSubjectsVietnamese[translationKey];
  }
  return translationKey;
};

// ✅ FIX: Just return string and let the caller use type guard
export const getNationalExamSubjectTranslationKey = (
  vietnameseValue: string,
): string => {
  if (vietnameseValue in VietnameseToScoreBoardSubjects) {
    return VietnameseToScoreBoardSubjects[vietnameseValue];
  }
  // Return the original value if not found (fallback)
  return vietnameseValue;
};

// ✅ Helper to check if a translation key is valid (same as the type guard above)
export const isValidSubjectKey = isScoreBoardSubjectTranslationKey;
