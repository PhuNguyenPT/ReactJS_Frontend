import { useState, useCallback, useMemo, type ReactNode } from "react";
import {
  FormDataContext,
  initialFormData,
  type FormData,
} from "./FormDataContext";

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // Memoize functions to prevent unnecessary re-renders
  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormDataComplete = useCallback(() => {
    return formData.selectedProvince !== null;
    // Add more validation as you add more forms
  }, [formData.selectedProvince]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      resetFormData,
      isFormDataComplete,
    }),
    [formData, updateFormData, resetFormData, isFormDataComplete],
  );

  return <FormDataContext value={contextValue}>{children}</FormDataContext>;
}
