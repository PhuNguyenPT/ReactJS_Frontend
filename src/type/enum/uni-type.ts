// Define types for better TypeScript support
type UniTypeTranslationKey = "uniType.private" | "uniType.public";

// UniType enum with translation keys
export const UniType = {
  /** A privately-funded university. */
  PRIVATE: "uniType.private",
  /** A publicly-funded university. */
  PUBLIC: "uniType.public",
};

// Mapping from translation keys to Vietnamese values (for API)
export const UniTypeVietnamese: Record<UniTypeTranslationKey, string> = {
  "uniType.private": "Tư thục",
  "uniType.public": "Công lập",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToUniType: Record<string, UniTypeTranslationKey> =
  Object.fromEntries(
    Object.entries(UniTypeVietnamese).map(([key, value]) => [
      value,
      key as UniTypeTranslationKey,
    ]),
  ) as Record<string, UniTypeTranslationKey>;

// Type guard to check if a string is a valid university type translation key
function isUniTypeTranslationKey(key: string): key is UniTypeTranslationKey {
  return key in UniTypeVietnamese;
}

// Helper functions
export const getAllUniTypes = () => {
  return Object.values(UniType);
};

export const getUniTypeVietnameseValue = (translationKey: string): string => {
  if (isUniTypeTranslationKey(translationKey)) {
    return UniTypeVietnamese[translationKey];
  }
  return translationKey;
};

export const getUniTypeTranslationKey = (vietnameseValue: string): string => {
  if (vietnameseValue in VietnameseToUniType) {
    return VietnameseToUniType[vietnameseValue];
  }
  return vietnameseValue;
};
