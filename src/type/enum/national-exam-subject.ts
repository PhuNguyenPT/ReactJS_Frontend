type NationalExamSubjectTranslationKey =
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
  | "subjects.giao_duc_kinh_te_va_phap_luat"
  | "subjects.tin_hoc"
  | "subjects.cong_nghe_cong_nghiep"
  | "subjects.cong_nghe_nong_nghiep";

// NationalExamSubjects enum with translation keys
export const NationalExamSubjects = {
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
  giao_duc_kinh_te_va_phap_luat: "subjects.giao_duc_kinh_te_va_phap_luat",
  TIN_HOC: "subjects.tin_hoc",
  CONG_NGHE_CONG_NGHIEP: "subjects.cong_nghe_cong_nghiep",
  CONG_NGHE_NONG_NGHIEP: "subjects.cong_nghe_nong_nghiep",
} as const;

export type { NationalExamSubjectTranslationKey };

export const NationalExamSubjectsVietnamese: Record<
  NationalExamSubjectTranslationKey,
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
  "subjects.giao_duc_kinh_te_va_phap_luat": "Giáo dục Kinh tế và Pháp luật",
  "subjects.tin_hoc": "Tin Học",
  "subjects.cong_nghe_cong_nghiep": "Công nghệ Công nghiệp",
  "subjects.cong_nghe_nong_nghiep": "Công nghệ Nông nghiệp",
} as const;

export const VietnameseToNationalExamSubjects: Record<
  string,
  NationalExamSubjectTranslationKey
> = Object.fromEntries(
  Object.entries(NationalExamSubjectsVietnamese).map(([key, value]) => [
    value,
    key as NationalExamSubjectTranslationKey,
  ]),
) as Record<string, NationalExamSubjectTranslationKey>;

export function isNationalExamSubjectTranslationKey(
  key: string,
): key is NationalExamSubjectTranslationKey {
  return key in NationalExamSubjectsVietnamese;
}

// Helper functions
export const getAllNationalExamSubjects =
  (): NationalExamSubjectTranslationKey[] => {
    return Object.values(NationalExamSubjects);
  };

export const getSelectableSubjects =
  (): NationalExamSubjectTranslationKey[] => {
    return Object.values(NationalExamSubjects).filter(
      (subject) =>
        subject !== NationalExamSubjects.TOAN &&
        subject !== NationalExamSubjects.NGU_VAN,
    );
  };

export const isTechnologySubject = (subject: string | null): boolean => {
  if (!subject) return false;
  return (
    subject === NationalExamSubjects.CONG_NGHE_CONG_NGHIEP ||
    subject === NationalExamSubjects.CONG_NGHE_NONG_NGHIEP
  );
};

export const getOtherTechnologySubject = (
  subject: string,
): NationalExamSubjectTranslationKey | null => {
  if (subject === NationalExamSubjects.CONG_NGHE_CONG_NGHIEP) {
    return NationalExamSubjects.CONG_NGHE_NONG_NGHIEP;
  }
  if (subject === NationalExamSubjects.CONG_NGHE_NONG_NGHIEP) {
    return NationalExamSubjects.CONG_NGHE_CONG_NGHIEP;
  }
  return null;
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

export const isValidSubjectKey = isNationalExamSubjectTranslationKey;
