/**
 * Vietnamese High School Subjects
 * Based on Vietnam's national curriculum and university entrance exam subjects
 */
export const VietnameseSubject = {
  AM_NHAC: "Âm Nhạc",
  CONG_NGHE: "Công Nghệ",
  DIA_LY: "Địa Lý",
  GDCD: "Giáo Dục Công Dân",
  GDQP: "Giáo Dục Quốc Phòng An Ninh",
  HOA_HOC: "Hóa Học",
  KINH_TE: "Kinh Tế",
  KY_THUAT: "Kỹ Thuật",
  LICH_SU: "Lịch Sử",
  MY_THUAT: "Mỹ Thuật",
  PHAP_LUAT: "Pháp Luật",
  SINH_HOC: "Sinh Học",
  TAM_LY_HOC: "Tâm Lý Học",
  THE_DUC: "Thể Dục",
  TIENG_ANH: "Tiếng Anh",
  TIENG_DUC: "Tiếng Đức",
  TIENG_NGA: "Tiếng Nga",
  TIENG_NHAT: "Tiếng Nhật",
  TIENG_PHAP: "Tiếng Pháp",
  TIENG_TRUNG: "Tiếng Trung",
  TIN_HOC: "Tin Học",
  TOAN: "Toán",
  TRIET_HOC: "Triết Học",
  VAN: "Ngữ Văn",
  VAT_LY: "Vật Lý",
} as const;

export type VietnameseSubjectType =
  (typeof VietnameseSubject)[keyof typeof VietnameseSubject];

export const CORE_SUBJECTS = [
  VietnameseSubject.TOAN,
  VietnameseSubject.VAN,
  VietnameseSubject.TIENG_ANH,
  VietnameseSubject.VAT_LY,
  VietnameseSubject.HOA_HOC,
  VietnameseSubject.SINH_HOC,
  VietnameseSubject.LICH_SU,
  VietnameseSubject.DIA_LY,
  VietnameseSubject.GDCD,
] as const;

export function getSelectableSubjects(): string[] {
  return CORE_SUBJECTS.filter(
    (subject) =>
      subject !== VietnameseSubject.TOAN && subject !== VietnameseSubject.VAN,
  );
}
