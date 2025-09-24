// Translation keys for academic performance
export type AcademicPerformanceTranslationKey =
  | "academicPerformance.good"
  | "academicPerformance.satisfactory"
  | "academicPerformance.passed"
  | "academicPerformance.not_passed";

// AcademicPerformance enum with translation keys
export const AcademicPerformance = {
  GOOD: "academicPerformance.good",
  SATISFACTORY: "academicPerformance.satisfactory",
  PASSED: "academicPerformance.passed",
  NOT_PASSED: "academicPerformance.not_passed",
} as const;

// Vietnamese mappings for academic performance
export const AcademicPerformanceValues: Record<
  AcademicPerformanceTranslationKey,
  string
> = {
  "academicPerformance.good": "Tốt",
  "academicPerformance.satisfactory": "Khá",
  "academicPerformance.passed": "Đạt",
  "academicPerformance.not_passed": "Chưa đạt",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToAcademicPerformance: Record<
  string,
  AcademicPerformanceTranslationKey
> = Object.fromEntries(
  Object.entries(AcademicPerformanceValues).map(([key, value]) => [
    value,
    key as AcademicPerformanceTranslationKey,
  ]),
) as Record<string, AcademicPerformanceTranslationKey>;

// Type definitions
export type AcademicPerformance =
  (typeof AcademicPerformance)[keyof typeof AcademicPerformance];

// Type guard and helper functions
function isAcademicPerformanceTranslationKey(
  key: string,
): key is AcademicPerformanceTranslationKey {
  return key in AcademicPerformanceValues;
}

export const getAcademicPerformanceVietnameseValue = (
  translationKey: string,
): string => {
  if (isAcademicPerformanceTranslationKey(translationKey)) {
    return AcademicPerformanceValues[translationKey];
  }
  return translationKey;
};

export const getAcademicPerformanceTranslationKey = (
  vietnameseValue: string,
): string => {
  if (vietnameseValue in VietnameseToAcademicPerformance) {
    return VietnameseToAcademicPerformance[vietnameseValue];
  }
  return vietnameseValue;
};

// Ranking function using translation keys
export function getRankByAcademicPerformance(performanceKey: string): number {
  switch (performanceKey) {
    case AcademicPerformance.GOOD:
      return 1;
    case AcademicPerformance.SATISFACTORY:
      return 2;
    case AcademicPerformance.PASSED:
      return 3;
    case AcademicPerformance.NOT_PASSED:
      return 4;
    default:
      return 4;
  }
}
