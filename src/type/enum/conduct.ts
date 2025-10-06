// Translation keys for conduct
export type ConductTranslationKey =
  | "conduct.good"
  | "conduct.satisfactory"
  | "conduct.passed"
  | "conduct.not_passed";

// Conduct enum with translation keys
export const Conduct = {
  GOOD: "conduct.good",
  SATISFACTORY: "conduct.satisfactory",
  PASSED: "conduct.passed",
  NOT_PASSED: "conduct.not_passed",
} as const;

// Vietnamese mappings for conduct
export const ConductValues: Record<ConductTranslationKey, string> = {
  "conduct.good": "Tốt",
  "conduct.satisfactory": "Khá",
  "conduct.passed": "Đạt",
  "conduct.not_passed": "Chưa đạt",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToConduct: Record<string, ConductTranslationKey> =
  Object.fromEntries(
    Object.entries(ConductValues).map(([key, value]) => [
      value,
      key as ConductTranslationKey,
    ]),
  ) as Record<string, ConductTranslationKey>;

// Type guard and helper functions
function isConductTranslationKey(key: string): key is ConductTranslationKey {
  return key in ConductValues;
}

export const getConductVietnameseValue = (translationKey: string): string => {
  if (isConductTranslationKey(translationKey)) {
    return ConductValues[translationKey];
  }
  return translationKey;
};

export const getConductTranslationKey = (vietnameseValue: string): string => {
  if (vietnameseValue in VietnameseToConduct) {
    return VietnameseToConduct[vietnameseValue];
  }
  return vietnameseValue;
};

// Ranking function using translation keys
export function getRankByConduct(conductKey: string): number {
  switch (conductKey) {
    case Conduct.GOOD:
      return 1;
    case Conduct.SATISFACTORY:
      return 2;
    case Conduct.PASSED:
      return 3;
    case Conduct.NOT_PASSED:
      return 4;
    default:
      return 4;
  }
}
