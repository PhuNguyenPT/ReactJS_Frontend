/**
 * Vietnamese High School Subjects
 * Based on Vietnam's national curriculum and university entrance exam subjects
 */
export const VietnameseSubject = {
  BIEU_DIEN_NGHE_THUAT: "Biểu diễn nghệ thuật",
  DIA_LY: "Địa Lý",
  DOC_HIEU: "Đọc hiểu",
  DOC_KE_DIEN_CAM: "Đọc kể diễn cảm",
  GDCD: "Giáo Dục Công Dân",
  GDKTPL: "Giáo dục Kinh tế và Pháp luật",
  HAT: "Hát",
  HAT_BIEU_DIEN_NHAC_CU: "Hát hoặc biểu diễn nhạc cụ",
  HAT_MUA: "Hát - Múa",
  HINH_HOA: "Hình họa",
  HOA_HOC: "Hóa Học",
  KY_XUONG_AM: "Ký xướng âm",
  LICH_SU: "Lịch Sử",
  NANG_KHIEU: "Năng khiếu",
  NANG_KHIEU_1: "Năng khiếu 1",
  NANG_KHIEU_2: "Năng khiếu 2",
  NANG_KHIEU_AM_NHAC_1: "Năng khiếu Âm nhạc 1",
  NANG_KHIEU_AM_NHAC_2: "Năng khiếu Âm nhạc 2",
  NANG_KHIEU_BAO_CHI: "Năng khiếu báo chí",
  NANG_KHIEU_MAM_NON_1: "NK Mầm non 1( kể chuyện, đọc, diễn cảm)",
  NANG_KHIEU_MAM_NON_2: "NK Mầm non 2 (Hát)",
  NANG_KHIEU_SKDA_1: "Năng khiếu SKĐA 1",
  NANG_KHIEU_SKDA_2: "Năng khiếu SKĐA 2",
  NANG_KHIEU_TDTT: "Năng khiếu TDTT",
  NANG_KHIEU_VE: "Vẽ Năng khiếu",
  NGU_VAN: "Ngữ Văn",
  SINH_HOC: "Sinh Học",
  TIENG_ANH: "Tiếng Anh",
  TIENG_DUC: "Tiếng Đức",
  TIENG_NGA: "Tiếng Nga",
  TIENG_NHAT: "Tiếng Nhật",
  TIENG_PHAP: "Tiếng Pháp",
  TIENG_TRUNG: "Tiếng Trung",
  TOAN: "Toán",
  TRANG_TRI: "Trang trí",
  TU_DUY_GIAI_QUYET_NGU_VAN_DE: "Tư duy Khoa học Giải quyết vấn đề",
  VAT_LY: "Vật Lý",
  VE_HINH_HOA_MY_THUAT: "Vẽ Hình họa mỹ thuật",
  VE_MY_THUAT: "Vẽ Mỹ thuật",
  VE_TRANG_TRI_MAU: "Vẽ trang trí màu",
  XAY_DUNG_KICH_BAN_SU_KIEN: "Xây dựng kịch bản sự kiện",
  XUONG_AM: "Xướng âm",
} as const;

export type VietnameseSubjectType =
  (typeof VietnameseSubject)[keyof typeof VietnameseSubject];

export const CORE_SUBJECTS = [
  VietnameseSubject.TOAN,
  VietnameseSubject.NGU_VAN,
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
      subject !== VietnameseSubject.TOAN &&
      subject !== VietnameseSubject.NGU_VAN,
  );
}
