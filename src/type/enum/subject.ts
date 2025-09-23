// VietnameseSubject with translation keys
export type VietnameseSubjectTranslationKey =
  | "subjects.bieu_dien_nghe_thuat"
  | "subjects.cong_nghe"
  | "subjects.dia_ly"
  | "subjects.doc_hieu"
  | "subjects.doc_ke_dien_cam"
  | "subjects.gdktpl"
  | "subjects.hat"
  | "subjects.hat_bieu_dien_nhac_cu"
  | "subjects.hat_mua"
  | "subjects.hinh_hoa"
  | "subjects.hoa_hoc"
  | "subjects.ky_xuong_am"
  | "subjects.lich_su"
  | "subjects.nang_khieu"
  | "subjects.nang_khieu_1"
  | "subjects.nang_khieu_2"
  | "subjects.nang_khieu_am_nhac_1"
  | "subjects.nang_khieu_am_nhac_2"
  | "subjects.nang_khieu_bao_chi"
  | "subjects.nang_khieu_mam_non_1"
  | "subjects.nang_khieu_mam_non_2"
  | "subjects.nang_khieu_skda_1"
  | "subjects.nang_khieu_skda_2"
  | "subjects.nang_khieu_tdtt"
  | "subjects.nang_khieu_ve"
  | "subjects.ngu_van"
  | "subjects.sinh_hoc"
  | "subjects.tieng_anh"
  | "subjects.tieng_duc"
  | "subjects.tieng_nga"
  | "subjects.tieng_nhat"
  | "subjects.tieng_phap"
  | "subjects.tieng_trung"
  | "subjects.tin_hoc"
  | "subjects.toan"
  | "subjects.trang_tri"
  | "subjects.tu_duy_giai_quyet_ngu_van_de"
  | "subjects.vat_ly"
  | "subjects.ve_hinh_hoa_my_thuat"
  | "subjects.ve_my_thuat"
  | "subjects.ve_trang_tri_mau"
  | "subjects.xay_dung_kich_ban_su_kien"
  | "subjects.xuong_am";

export const VietnameseSubject = {
  BIEU_DIEN_NGHE_THUAT: "subjects.bieu_dien_nghe_thuat",
  CONG_NGHE: "subjects.cong_nghe",
  DIA_LY: "subjects.dia_ly",
  DOC_HIEU: "subjects.doc_hieu",
  DOC_KE_DIEN_CAM: "subjects.doc_ke_dien_cam",
  GDKTPL: "subjects.gdktpl",
  HAT: "subjects.hat",
  HAT_BIEU_DIEN_NHAC_CU: "subjects.hat_bieu_dien_nhac_cu",
  HAT_MUA: "subjects.hat_mua",
  HINH_HOA: "subjects.hinh_hoa",
  HOA_HOC: "subjects.hoa_hoc",
  KY_XUONG_AM: "subjects.ky_xuong_am",
  LICH_SU: "subjects.lich_su",
  NANG_KHIEU: "subjects.nang_khieu",
  NANG_KHIEU_1: "subjects.nang_khieu_1",
  NANG_KHIEU_2: "subjects.nang_khieu_2",
  NANG_KHIEU_AM_NHAC_1: "subjects.nang_khieu_am_nhac_1",
  NANG_KHIEU_AM_NHAC_2: "subjects.nang_khieu_am_nhac_2",
  NANG_KHIEU_BAO_CHI: "subjects.nang_khieu_bao_chi",
  NANG_KHIEU_MAM_NON_1: "subjects.nang_khieu_mam_non_1",
  NANG_KHIEU_MAM_NON_2: "subjects.nang_khieu_mam_non_2",
  NANG_KHIEU_SKDA_1: "subjects.nang_khieu_skda_1",
  NANG_KHIEU_SKDA_2: "subjects.nang_khieu_skda_2",
  NANG_KHIEU_TDTT: "subjects.nang_khieu_tdtt",
  NANG_KHIEU_VE: "subjects.nang_khieu_ve",
  NGU_VAN: "subjects.ngu_van",
  SINH_HOC: "subjects.sinh_hoc",
  TIENG_ANH: "subjects.tieng_anh",
  TIENG_DUC: "subjects.tieng_duc",
  TIENG_NGA: "subjects.tieng_nga",
  TIENG_NHAT: "subjects.tieng_nhat",
  TIENG_PHAP: "subjects.tieng_phap",
  TIENG_TRUNG: "subjects.tieng_trung",
  TIN_HOC: "subjects.tin_hoc",
  TOAN: "subjects.toan",
  TRANG_TRI: "subjects.trang_tri",
  TU_DUY_GIAI_QUYET_NGU_VAN_DE: "subjects.tu_duy_giai_quyet_ngu_van_de",
  VAT_LY: "subjects.vat_ly",
  VE_HINH_HOA_MY_THUAT: "subjects.ve_hinh_hoa_my_thuat",
  VE_MY_THUAT: "subjects.ve_my_thuat",
  VE_TRANG_TRI_MAU: "subjects.ve_trang_tri_mau",
  XAY_DUNG_KICH_BAN_SU_KIEN: "subjects.xay_dung_kich_ban_su_kien",
  XUONG_AM: "subjects.xuong_am",
} as const;

// Vietnamese mappings for subjects
export const VietnameseSubjectValues: Record<
  VietnameseSubjectTranslationKey,
  string
> = {
  "subjects.bieu_dien_nghe_thuat": "Biểu diễn nghệ thuật",
  "subjects.cong_nghe": "Công Nghệ",
  "subjects.dia_ly": "Địa Lý",
  "subjects.doc_hieu": "Đọc hiểu",
  "subjects.doc_ke_dien_cam": "Đọc kể diễn cảm",
  "subjects.gdktpl": "Giáo dục Kinh tế và Pháp luật",
  "subjects.hat": "Hát",
  "subjects.hat_bieu_dien_nhac_cu": "Hát hoặc biểu diễn nhạc cụ",
  "subjects.hat_mua": "Hát - Múa",
  "subjects.hinh_hoa": "Hình họa",
  "subjects.hoa_hoc": "Hóa Học",
  "subjects.ky_xuong_am": "Ký xướng âm",
  "subjects.lich_su": "Lịch Sử",
  "subjects.nang_khieu": "Năng khiếu",
  "subjects.nang_khieu_1": "Năng khiếu 1",
  "subjects.nang_khieu_2": "Năng khiếu 2",
  "subjects.nang_khieu_am_nhac_1": "Năng khiếu Âm nhạc 1",
  "subjects.nang_khieu_am_nhac_2": "Năng khiếu Âm nhạc 2",
  "subjects.nang_khieu_bao_chi": "Năng khiếu báo chí",
  "subjects.nang_khieu_mam_non_1": "NK Mầm non 1( kể chuyện, đọc, diễn cảm)",
  "subjects.nang_khieu_mam_non_2": "NK Mầm non 2 (Hát)",
  "subjects.nang_khieu_skda_1": "Năng khiếu SKĐA 1",
  "subjects.nang_khieu_skda_2": "Năng khiếu SKĐA 2",
  "subjects.nang_khieu_tdtt": "Năng khiếu TDTT",
  "subjects.nang_khieu_ve": "Vẽ Năng khiếu",
  "subjects.ngu_van": "Ngữ Văn",
  "subjects.sinh_hoc": "Sinh Học",
  "subjects.tieng_anh": "Tiếng Anh",
  "subjects.tieng_duc": "Tiếng Đức",
  "subjects.tieng_nga": "Tiếng Nga",
  "subjects.tieng_nhat": "Tiếng Nhật",
  "subjects.tieng_phap": "Tiếng Pháp",
  "subjects.tieng_trung": "Tiếng Trung",
  "subjects.tin_hoc": "Tin Học",
  "subjects.toan": "Toán",
  "subjects.trang_tri": "Trang trí",
  "subjects.tu_duy_giai_quyet_ngu_van_de": "Tư duy Khoa học Giải quyết vấn đề",
  "subjects.vat_ly": "Vật Lý",
  "subjects.ve_hinh_hoa_my_thuat": "Vẽ Hình họa mỹ thuật",
  "subjects.ve_my_thuat": "Vẽ Mỹ thuật",
  "subjects.ve_trang_tri_mau": "Vẽ trang trí màu",
  "subjects.xay_dung_kich_ban_su_kien": "Xây dựng kịch bản sự kiện",
  "subjects.xuong_am": "Xướng âm",
} as const;

// Type guard and helper functions for subjects
function isVietnameseSubjectTranslationKey(
  key: string,
): key is VietnameseSubjectTranslationKey {
  return key in VietnameseSubjectValues;
}

export const getVietnameseSubjectValue = (translationKey: string): string => {
  if (isVietnameseSubjectTranslationKey(translationKey)) {
    return VietnameseSubjectValues[translationKey];
  }
  return translationKey;
};

export const getVietnameseSubjectTranslationKey = (
  vietnameseValue: string,
): string => {
  const entry = Object.entries(VietnameseSubjectValues).find(
    ([, value]) => value === vietnameseValue,
  );
  return entry ? entry[0] : vietnameseValue;
};
