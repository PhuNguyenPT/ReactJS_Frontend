// Define types for better TypeScript support
type NationalExamSubjectTranslationKey =
  | "subjects.toan"
  | "subjects.ngu_van"
  | "subjects.tieng_anh"
  | "subjects.tieng_duc"
  | "subjects.tieng_nga"
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
  | "subjects.cong_nghe";

// NationalExamSubjects enum with translation keys
export const NationalExamSubjects = {
  TOAN: "subjects.toan",
  NGU_VAN: "subjects.ngu_van",
  TIENG_ANH: "subjects.tieng_anh",
  TIENG_DUC: "subjects.tieng_duc",
  TIENG_NGA: "subjects.tieng_nga",
  TIENG_NHAT: "subjects.tieng_nhat",
  TIENG_PHAP: "subjects.tieng_phap",
  TIENG_TRUNG: "subjects.tieng_trung",
  VAT_LY: "subjects.vat_ly",
  HOA_HOC: "subjects.hoa_hoc",
  SINH_HOC: "subjects.sinh_hoc",
  LICH_SU: "subjects.lich_su",
  DIA_LY: "subjects.dia_ly",
  GDKT_PL: "subjects.gdktpl",
  TIN_HOC: "subjects.tin_hoc",
  CONG_NGHE: "subjects.cong_nghe",
} as const;

// Mapping from translation keys to Vietnamese values (for API)
export const NationalExamSubjectsVietnamese: Record<
  NationalExamSubjectTranslationKey,
  string
> = {
  "subjects.toan": "Toán",
  "subjects.ngu_van": "Ngữ Văn",
  "subjects.tieng_anh": "Tiếng Anh",
  "subjects.tieng_duc": "Tiếng Đức",
  "subjects.tieng_nga": "Tiếng Nga",
  "subjects.tieng_nhat": "Tiếng Nhật",
  "subjects.tieng_phap": "Tiếng Pháp",
  "subjects.tieng_trung": "Tiếng Trung",
  "subjects.vat_ly": "Vật Lý",
  "subjects.hoa_hoc": "Hóa Học",
  "subjects.sinh_hoc": "Sinh Học",
  "subjects.lich_su": "Lịch Sử",
  "subjects.dia_ly": "Địa Lý",
  "subjects.gdktpl": "Giáo dục Kinh tế và Pháp luật",
  "subjects.tin_hoc": "Tin Học",
  "subjects.cong_nghe": "Công Nghệ",
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
