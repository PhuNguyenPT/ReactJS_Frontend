// MajorGroup enum with translation keys
export const MajorGroup = {
  AGRICULTURE_FORESTRY_FISHERIES: "majors.agriculture_forestry_fisheries",
  ARCHITECTURE_AND_CONSTRUCTION: "majors.architecture_and_construction",
  ARTS: "majors.arts",
  BUSINESS_AND_MANAGEMENT: "majors.business_and_management",
  COMPUTER_AND_IT: "majors.computer_and_it",
  EDUCATION_AND_TEACHER_TRAINING: "majors.education_and_teacher_training",
  ENGINEERING: "majors.engineering",
  ENGINEERING_TECHNOLOGY: "majors.engineering_technology",
  ENVIRONMENT_AND_PROTECTION: "majors.environment_and_protection",
  HEALTH: "majors.health",
  HUMANITIES: "majors.humanities",
  JOURNALISM_AND_INFORMATION: "majors.journalism_and_information",
  LAW: "majors.law",
  LIFE_SCIENCES: "majors.life_sciences",
  MANUFACTURING_AND_PROCESSING: "majors.manufacturing_and_processing",
  MATHEMATICS_AND_STATISTICS: "majors.mathematics_and_statistics",
  NATURAL_SCIENCES: "majors.natural_sciences",
  OTHER: "majors.other",
  SECURITY_DEFENSE: "majors.security_defense",
  SOCIAL_AND_BEHAVIORAL_SCIENCES: "majors.social_and_behavioral_sciences",
  SOCIAL_SERVICES: "majors.social_services",
  TOURISM_HOSPITALITY_SPORTS_PERSONAL:
    "majors.tourism_hospitality_sports_personal",
  TRANSPORT_SERVICES: "majors.transport_services",
  VETERINARY: "majors.veterinary",
};

// Define types for better TypeScript support
type MajorTranslationKey =
  | "majors.agriculture_forestry_fisheries"
  | "majors.architecture_and_construction"
  | "majors.arts"
  | "majors.business_and_management"
  | "majors.computer_and_it"
  | "majors.education_and_teacher_training"
  | "majors.engineering"
  | "majors.engineering_technology"
  | "majors.environment_and_protection"
  | "majors.health"
  | "majors.humanities"
  | "majors.journalism_and_information"
  | "majors.law"
  | "majors.life_sciences"
  | "majors.manufacturing_and_processing"
  | "majors.mathematics_and_statistics"
  | "majors.natural_sciences"
  | "majors.other"
  | "majors.security_defense"
  | "majors.social_and_behavioral_sciences"
  | "majors.social_services"
  | "majors.tourism_hospitality_sports_personal"
  | "majors.transport_services"
  | "majors.veterinary";

// Mapping from translation keys to Vietnamese values (for API)
export const MajorGroupVietnamese: Record<MajorTranslationKey, string> = {
  "majors.agriculture_forestry_fisheries": "Nông, lâm nghiệp và thủy sản",
  "majors.architecture_and_construction": "Kiến trúc và xây dựng",
  "majors.arts": "Nghệ thuật",
  "majors.business_and_management": "Kinh doanh và quản lý",
  "majors.computer_and_it": "Máy tính và công nghệ thông tin",
  "majors.education_and_teacher_training":
    "Khoa học giáo dục và đào tạo giáo viên",
  "majors.engineering": "Kỹ thuật",
  "majors.engineering_technology": "Công nghệ kỹ thuật",
  "majors.environment_and_protection": "Môi trường và bảo vệ môi trường",
  "majors.health": "Sức khỏe",
  "majors.humanities": "Nhân văn",
  "majors.journalism_and_information": "Báo chí và thông tin",
  "majors.law": "Pháp luật",
  "majors.life_sciences": "Khoa học sự sống",
  "majors.manufacturing_and_processing": "Sản xuất và chế biến",
  "majors.mathematics_and_statistics": "Toán và thống kê",
  "majors.natural_sciences": "Khoa học tự nhiên",
  "majors.other": "Khác",
  "majors.security_defense": "An ninh, Quốc phòng",
  "majors.social_and_behavioral_sciences": "Khoa học xã hội và hành vi",
  "majors.social_services": "Dịch vụ xã hội",
  "majors.tourism_hospitality_sports_personal":
    "Du lịch, khách sạn, thể thao và dịch vụ cá nhân",
  "majors.transport_services": "Dịch vụ vận tải",
  "majors.veterinary": "Thú y",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToMajorGroup: Record<string, MajorTranslationKey> =
  Object.fromEntries(
    Object.entries(MajorGroupVietnamese).map(([key, value]) => [
      value,
      key as MajorTranslationKey,
    ]),
  ) as Record<string, MajorTranslationKey>;

// Helper functions
export const getAllMajorGroups = () => {
  return Object.values(MajorGroup);
};

// Type guard to check if a string is a valid translation key
function isMajorTranslationKey(key: string): key is MajorTranslationKey {
  return key in MajorGroupVietnamese;
}

export const getVietnameseValue = (translationKey: string): string => {
  if (isMajorTranslationKey(translationKey)) {
    return MajorGroupVietnamese[translationKey];
  }
  return translationKey;
};

export const getTranslationKey = (vietnameseValue: string): string => {
  if (vietnameseValue in VietnameseToMajorGroup) {
    return VietnameseToMajorGroup[vietnameseValue];
  }
  return vietnameseValue;
};
