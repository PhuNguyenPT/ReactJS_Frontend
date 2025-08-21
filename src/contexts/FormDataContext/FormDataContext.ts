import { createContext } from "react";

export interface FormData {
  selectedProvince: string | null;
  // Add other form fields as you create more forms
  // secondFormData?: any;
  // thirdFormData?: any;
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
};
