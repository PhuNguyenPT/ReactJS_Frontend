// Translation keys for ranks/awards
export type RankTranslationKey =
  | "ranks.first"
  | "ranks.second"
  | "ranks.third"
  | "ranks.consolation";

// Rank enum with translation keys
export const Rank = {
  FIRST: "ranks.first",
  SECOND: "ranks.second",
  THIRD: "ranks.third",
  CONSOLATION: "ranks.consolation",
} as const;

// Vietnamese mappings for ranks
export const RankValues: Record<RankTranslationKey, string> = {
  "ranks.first": "Hạng Nhất",
  "ranks.second": "Hạng Nhì",
  "ranks.third": "Hạng Ba",
  "ranks.consolation": "Khuyến Khích",
} as const;

// Reverse mapping from Vietnamese values to translation keys
export const VietnameseToRank: Record<string, RankTranslationKey> =
  Object.fromEntries(
    Object.entries(RankValues).map(([key, value]) => [
      value,
      key as RankTranslationKey,
    ]),
  ) as Record<string, RankTranslationKey>;

// Type guard and helper functions for ranks
function isRankTranslationKey(key: string): key is RankTranslationKey {
  return key in RankValues;
}

export const getRankVietnameseValue = (translationKey: string): string => {
  if (isRankTranslationKey(translationKey)) {
    return RankValues[translationKey];
  }
  return translationKey;
};

export const getRankTranslationKey = (vietnameseValue: string): string => {
  if (vietnameseValue in VietnameseToRank) {
    return VietnameseToRank[vietnameseValue];
  }
  return vietnameseValue;
};
