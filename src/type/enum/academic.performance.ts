export const AcademicPerformance = {
  GOOD: "Tốt",
  SATISFACTORY: "Khá",
  PASSED: "Đạt",
  NOT_PASSED: "Chưa đạt",
} as const;

export type AcademicPerformance =
  (typeof AcademicPerformance)[keyof typeof AcademicPerformance];

export function getRankByAcademicPerformance(
  academicPerformance: AcademicPerformance,
): number {
  switch (academicPerformance) {
    case AcademicPerformance.GOOD:
      return 1;
    case AcademicPerformance.SATISFACTORY:
      return 2;
    case AcademicPerformance.PASSED:
      return 3;
    case AcademicPerformance.NOT_PASSED:
      return 4;
  }
}
