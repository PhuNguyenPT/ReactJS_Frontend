import { createContext } from "react";

export interface FormData {
  selectedProvince: string | null;
  secondFormMajors: (string | null)[];
}

export interface FormDataContextType {
  formData: FormData;
  updateFormData: (data: Partial<FormData>) => void;
  resetFormData: () => void;
  isFormDataComplete: () => boolean;
}

export const FormDataContext = createContext<FormDataContextType | undefined>(
  undefined,
);

export const initialFormData: FormData = {
  selectedProvince: null,
  secondFormMajors: [null, null, null],
};
