import { createContext } from "react";

export interface OptionalScore {
  id: string;
  subject: string;
  score: string;
  // VNUHCM specific fields (only used when subject is VNUHCM)
  languageScore?: string;
  mathScore?: string;
  scienceLogic?: string;
}

export interface CategoryData {
  id: string;
  name: string;
  scores: OptionalScore[];
  isExpanded: boolean;
}

export interface AwardCertificate {
  id: string;
  firstField: string;
  secondField: string;
}

export interface FourthFormCategoryData {
  id: string;
  name: string;
  entries: AwardCertificate[];
  isExpanded: boolean;
  firstFieldLabel: string;
  secondFieldLabel: string;
  categoryType: string;
}

export interface GradeValues {
  conduct: string;
  academicPerformance: string;
}

export type GradeKey = "10" | "11" | "12";

export interface FormData {
  firstForm: string | null;
  uniType: string | null;
  secondForm: (string | null)[];
  thirdForm: {
    mathScore: string;
    literatureScore: string;
    chosenSubjects: (string | null)[];
    chosenScores: string[];
    optionalCategories: CategoryData[];
  };
  fourthForm: {
    categories: FourthFormCategoryData[];
  };
  fifthForm: {
    costRange: number[];
  };
  sixthForm: {
    specialStudentCases: string[];
  };
  seventhForm: {
    grades: Record<GradeKey, GradeValues>;
  };
}

export interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  updateThirdForm: (thirdFormData: Partial<FormData["thirdForm"]>) => void;
  updateFourthForm: (fourthFormData: Partial<FormData["fourthForm"]>) => void;
  updateFifthForm: (fifthFormData: Partial<FormData["fifthForm"]>) => void;
  updateSixthForm: (sixthFormData: Partial<FormData["sixthForm"]>) => void;
  updateSeventhForm: (
    seventhFormData: Partial<FormData["seventhForm"]>,
  ) => void;
  updateSeventhFormGrade: (
    grade: GradeKey,
    field: keyof GradeValues,
    value: string,
  ) => void;
  resetFormData: () => void;
  clearStoredFormData: () => void;
  getRemainingTime: () => number;
  isFormDataComplete: () => boolean;
  getFormDataForApi: () => FormData;
}

export const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined,
);

export const initialFormData: FormData = {
  firstForm: null,
  uniType: null,
  secondForm: [null, null, null],
  thirdForm: {
    mathScore: "",
    literatureScore: "",
    chosenSubjects: [null, null],
    chosenScores: ["", ""],
    optionalCategories: [
      { id: "category-1", name: "ĐGNL", scores: [], isExpanded: false },
      { id: "category-2", name: "V-SAT", scores: [], isExpanded: false },
      { id: "category-3", name: "Năng khiếu", scores: [], isExpanded: false },
    ],
  },
  fourthForm: {
    categories: [
      {
        id: "category-1",
        name: "",
        entries: [],
        isExpanded: false,
        categoryType: "national_award",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
      {
        id: "category-2",
        name: "",
        entries: [],
        isExpanded: false,
        categoryType: "international_cert",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
      {
        id: "category-3",
        name: "",
        entries: [],
        isExpanded: false,
        categoryType: "language_cert",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
    ],
  },
  fifthForm: {
    costRange: [
      Number(import.meta.env.VITE_SLIDER_MIN),
      Number(import.meta.env.VITE_SLIDER_MAX),
    ],
  },
  sixthForm: { specialStudentCases: [] },
  seventhForm: {
    grades: {
      "10": { conduct: "", academicPerformance: "" },
      "11": { conduct: "", academicPerformance: "" },
      "12": { conduct: "", academicPerformance: "" },
    } as Record<GradeKey, GradeValues>,
  },
};
