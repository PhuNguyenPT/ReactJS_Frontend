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
}

export interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  updateThirdForm: (thirdFormData: Partial<FormData["thirdForm"]>) => void;
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
};
