import { VietnameseSubject } from "./subject";
import { DGNLType } from "./exam";

/**
 * Get subjects for optional categories
 */
export function getOptionalCategorySubjects(category: string): string[] {
  switch (category) {
    case "ĐGNL":
      return Object.values(DGNLType);
    case "V-SAT":
    case "Năng khiếu":
      return Object.values(VietnameseSubject);
    default:
      return [];
  }
}
