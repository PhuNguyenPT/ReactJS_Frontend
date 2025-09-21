export const Conduct = {
  GOOD: "Tốt",
  SATISFACTORY: "Khá",
  PASSED: "Đạt",
  NOT_PASSED: "Chưa đạt",
} as const;

export type Conduct = (typeof Conduct)[keyof typeof Conduct];

export function getRankByConduct(conduct: Conduct): number {
  switch (conduct) {
    case Conduct.GOOD:
      return 1;
    case Conduct.SATISFACTORY:
      return 2;
    case Conduct.PASSED:
      return 3;
    case Conduct.NOT_PASSED:
      return 4;
  }
}
