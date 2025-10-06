// Define types for better TypeScript support
type VSATSubjectTranslationKey =
  | "subjects.toan"
  | "subjects.ngu_van"
  | "subjects.tieng_anh"
  | "subjects.vat_ly"
  | "subjects.hoa_hoc"
  | "subjects.sinh_hoc"
  | "subjects.lich_su"
  | "subjects.dia_ly";

// VSATSubjects enum with translation keys
export const VSATSubjects = {
  TOAN: "subjects.toan",
  NGU_VAN: "subjects.ngu_van",
  TIENG_ANH: "subjects.tieng_anh",
  VAT_LY: "subjects.vat_ly",
  HOA_HOC: "subjects.hoa_hoc",
  SINH_HOC: "subjects.sinh_hoc",
  LICH_SU: "subjects.lich_su",
  DIA_LY: "subjects.dia_ly",
} as const;

// Mapping from translation keys to Vietnamese values (for API)
export const VSATSubjectsVietnamese: Record<VSATSubjectTranslationKey, string> =
  {
    "subjects.toan": "Toán",
    "subjects.ngu_van": "Ngữ Văn",
    "subjects.tieng_anh": "Tiếng Anh",
    "subjects.vat_ly": "Vật Lý",
    "subjects.hoa_hoc": "Hóa Học",
    "subjects.sinh_hoc": "Sinh Học",
    "subjects.lich_su": "Lịch Sử",
    "subjects.dia_ly": "Địa Lý",
  } as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToVSATSubjects: Record<
  string,
  VSATSubjectTranslationKey
> = Object.fromEntries(
  Object.entries(VSATSubjectsVietnamese).map(([key, value]) => [
    value,
    key as VSATSubjectTranslationKey,
  ]),
) as Record<string, VSATSubjectTranslationKey>;

// Type guard to check if a string is a valid subject translation key
function isVSATSubjectTranslationKey(
  key: string,
): key is VSATSubjectTranslationKey {
  return key in VSATSubjectsVietnamese;
}

// Helper functions
export const getAllVSATSubjects = () => {
  return Object.values(VSATSubjects);
};

export const getSelectableVSATSubjects = () => {
  // Return all subjects except Math and Literature (which are mandatory)
  return Object.values(VSATSubjects).filter(
    (subject) =>
      subject !== VSATSubjects.TOAN && subject !== VSATSubjects.NGU_VAN,
  );
};

export const getVSATSubjectVietnameseValue = (
  translationKey: string,
): string => {
  if (isVSATSubjectTranslationKey(translationKey)) {
    return VSATSubjectsVietnamese[translationKey];
  }
  return translationKey;
};

export const getVSATSubjectTranslationKey = (
  vietnameseValue: string,
): string => {
  if (vietnameseValue in VietnameseToVSATSubjects) {
    return VietnameseToVSATSubjects[vietnameseValue];
  }
  return vietnameseValue;
};
