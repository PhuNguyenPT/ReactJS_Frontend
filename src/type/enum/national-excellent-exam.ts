// Translation keys for National Excellent Student Exam
export type NationalExcellentExamTranslationKey =
  | "examTypes.national_excellent"
  | "subjects.sinh_hoc"
  | "subjects.hoa_hoc"
  | "subjects.tieng_trung"
  | "subjects.tieng_anh"
  | "subjects.tieng_phap"
  | "subjects.dia_ly"
  | "subjects.lich_su"
  | "subjects.tin_hoc"
  | "subjects.tieng_nhat"
  | "subjects.ngu_van"
  | "subjects.toan"
  | "subjects.vat_ly"
  | "subjects.tieng_nga";

// National Excellent Exam Type with translation key
export const NationalExcellentExamType = {
  NATIONAL: "examTypes.national_excellent",
} as const;

// National Excellent Student Exam subjects with translation keys
export const NationalExcellentStudentExamSubject = {
  SINH_HOC: "subjects.sinh_hoc",
  HOA_HOC: "subjects.hoa_hoc",
  TIENG_TRUNG: "subjects.tieng_trung",
  TIENG_ANH: "subjects.tieng_anh",
  TIENG_PHAP: "subjects.tieng_phap",
  DIA_LY: "subjects.dia_ly",
  LICH_SU: "subjects.lich_su",
  TIN_HOC: "subjects.tin_hoc",
  TIENG_NHAT: "subjects.tieng_nhat",
  NGU_VAN: "subjects.ngu_van",
  TOAN: "subjects.toan",
  VAT_LY: "subjects.vat_ly",
  TIENG_NGA: "subjects.tieng_nga",
} as const;

// Vietnamese mappings for National Excellent Exam
export const NationalExcellentExamValues: Record<
  NationalExcellentExamTranslationKey,
  string
> = {
  "examTypes.national_excellent": "Học sinh giỏi cấp Quốc Gia",
  "subjects.sinh_hoc": "Sinh Học",
  "subjects.hoa_hoc": "Hoá Học",
  "subjects.tieng_trung": "Tiếng Trung",
  "subjects.tieng_anh": "Tiếng Anh",
  "subjects.tieng_phap": "Tiếng Pháp",
  "subjects.dia_ly": "Địa Lý",
  "subjects.lich_su": "Lịch Sử",
  "subjects.tin_hoc": "Tin Học",
  "subjects.tieng_nhat": "Tiếng Nhật",
  "subjects.ngu_van": "Ngữ Văn",
  "subjects.toan": "Toán",
  "subjects.vat_ly": "Vật Lý",
  "subjects.tieng_nga": "Tiếng Nga",
} as const;

// Type guard and helper functions
function isNationalExcellentExamTranslationKey(
  key: string,
): key is NationalExcellentExamTranslationKey {
  return key in NationalExcellentExamValues;
}

export const getNationalExcellentExamVietnameseValue = (
  translationKey: string,
): string => {
  if (isNationalExcellentExamTranslationKey(translationKey)) {
    return NationalExcellentExamValues[translationKey];
  }
  return translationKey;
};

export const getNationalExcellentExamTranslationKey = (
  vietnameseValue: string,
): string => {
  const entry = Object.entries(NationalExcellentExamValues).find(
    ([, value]) => value === vietnameseValue,
  );
  return entry ? entry[0] : vietnameseValue;
};

// Helper function to get all National Excellent exam subjects
export const getAllNationalExcellentSubjects = () => {
  return Object.values(NationalExcellentStudentExamSubject);
};
