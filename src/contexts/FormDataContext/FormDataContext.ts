import { createContext } from "react";

export interface OptionalScore {
  id: string;
  subject: string;
  score: string;
}

export interface CategoryData {
  id: string;
  name: string;
  scores: OptionalScore[];
  isExpanded: boolean;
}

// Fourth form specific interfaces
export interface AwardCertificate {
  id: string;
  firstField: string;
  secondField: string;
  firstFieldOther?: string;
}

export interface FourthFormCategoryData {
  id: string;
  name: string;
  entries: AwardCertificate[];
  isExpanded: boolean;
  firstFieldLabel: string;
  secondFieldLabel: string;
  categoryType: string; // category identifier
}

export interface FormData {
  selectedProvince: string | null;
  secondFormMajors: (string | null)[];
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
    specialStudentCases: string[]; // Array of selected special student case values
  };
}

export interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  updateThirdForm: (thirdFormData: Partial<FormData["thirdForm"]>) => void;
  updateFourthForm: (fourthFormData: Partial<FormData["fourthForm"]>) => void;
  updateFifthForm: (fifthFormData: Partial<FormData["fifthForm"]>) => void;
  updateSixthForm: (sixthFormData: Partial<FormData["sixthForm"]>) => void;
  resetFormData: () => void;
  isFormDataComplete: () => boolean;
}

export const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined,
);

export const initialFormData: FormData = {
  selectedProvince: null,
  secondFormMajors: [null, null, null],
  thirdForm: {
    mathScore: "",
    literatureScore: "",
    chosenSubjects: [null, null],
    chosenScores: ["", ""],
    optionalCategories: [
      {
        id: "category-1",
        name: "ĐGNL",
        scores: [],
        isExpanded: false,
      },
      {
        id: "category-2",
        name: "V-SAT",
        scores: [],
        isExpanded: false,
      },
      {
        id: "category-3",
        name: "Năng khiếu",
        scores: [],
        isExpanded: false,
      },
    ],
  },
  fourthForm: {
    categories: [
      {
        id: "category-1",
        name: "", // Will be set by translation
        entries: [],
        isExpanded: false,
        categoryType: "national_award",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
      {
        id: "category-2",
        name: "", // Will be set by translation
        entries: [],
        isExpanded: false,
        categoryType: "international_cert",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
      {
        id: "category-3",
        name: "", // Will be set by translation
        entries: [],
        isExpanded: false,
        categoryType: "language_cert",
        firstFieldLabel: "",
        secondFieldLabel: "",
      },
    ],
  },
  fifthForm: {
    costRange: [0, 500],
  },
  sixthForm: {
    specialStudentCases: [],
  },
};
