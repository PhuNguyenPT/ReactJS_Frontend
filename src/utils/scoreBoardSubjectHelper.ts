/**
 * Re-export necessary types and utilities from score-board-subject
 * This file provides a convenient import point for Vietnamese subject name mapping
 */
import {
  ScoreBoardSubjectsVietnamese,
  type ScordBoardSubjectTranslationKey,
} from "../type/enum/score-board-subject";

/**
 * Get Vietnamese subject name from translation key
 * Used when preparing data for API requests
 *
 * @param translationKey - The translation key (e.g., "subjects.toan")
 * @returns The Vietnamese subject name (e.g., "Toán")
 */
export function getVietnameseSubjectName(
  translationKey: ScordBoardSubjectTranslationKey,
): string {
  return ScoreBoardSubjectsVietnamese[translationKey] || translationKey;
}

/**
 * Re-export the Vietnamese mapping for direct access if needed
 */
export { ScoreBoardSubjectsVietnamese as vietnameseSubjectNameMap };
