/**
 * Exam types for optional subjects
 */
export const CCNNType = {
  IELTS: "IELTS",
  OTHER: "Other",
  TOEFL_CBT: "TOEFL CBT",
  TOEFL_iBT: "TOEFL iBT",
  TOEFL_Paper: "TOEFL Paper",
  TOEIC: "TOEIC",
} as const;

export const CCQTType = {
  ACT: "ACT",
  ALevel: "A-Level",
  DoulingoEnglishTest: "DoulingoEnglishTest",
  IB: "IB",
  OSSD: "OSSD",
  OTHER: "Other",
  PTE: "PTE",
  SAT: "SAT",
} as const;

export const DGNLType = {
  HSA: "HSA",
  OTHER: "Other",
  TSA: "TSA",
  VNUHCM: "VNUHCM",
} as const;

export type CCNNTypeValue = (typeof CCNNType)[keyof typeof CCNNType];
export type CCQTTypeValue = (typeof CCQTType)[keyof typeof CCQTType];
export type DGNLTypeValue = (typeof DGNLType)[keyof typeof DGNLType];

export type ExamType =
  | { type: "CCNN"; value: CCNNTypeValue }
  | { type: "CCQT"; value: CCQTTypeValue }
  | { type: "DGNL"; value: DGNLTypeValue };
