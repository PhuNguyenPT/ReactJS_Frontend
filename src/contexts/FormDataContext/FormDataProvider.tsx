import { useState, useCallback, useMemo, type ReactNode } from "react";
import {
  FormDataContext,
  initialFormData,
  type FormData,
} from "./FormDataContext";

export function FormDataProvider({ children }: { children: ReactNode }) {
  const [formData, setFormData] = useState<FormData>(initialFormData);

  // General form data update
  const updateFormData = useCallback((data: Partial<FormData>) => {
    setFormData((prev) => ({ ...prev, ...data }));
  }, []);

  // Specific third form update function
  const updateThirdForm = useCallback(
    (thirdFormData: Partial<FormData["thirdForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        thirdForm: { ...prev.thirdForm, ...thirdFormData },
      }));
    },
    [],
  );

  // Specific fourth form update function
  const updateFourthForm = useCallback(
    (fourthFormData: Partial<FormData["fourthForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        fourthForm: { ...prev.fourthForm, ...fourthFormData },
      }));
    },
    [],
  );

  // ✅ New: Specific fifth form update function
  const updateFifthForm = useCallback(
    (fifthFormData: Partial<FormData["fifthForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        fifthForm: { ...prev.fifthForm, ...fifthFormData },
      }));
    },
    [],
  );

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
  }, []);

  const isFormDataComplete = useCallback(() => {
    const { selectedProvince, secondFormMajors, thirdForm } = formData;

    // Check if previous forms are complete
    const previousFormsComplete =
      selectedProvince !== null &&
      secondFormMajors.every((major) => major !== null);

    // Check if third form main subjects are complete
    const thirdFormMainComplete =
      thirdForm.mathScore.trim() !== "" &&
      thirdForm.literatureScore.trim() !== "" &&
      thirdForm.chosenSubjects.every(
        (subject) => subject && subject.trim() !== "",
      ) &&
      thirdForm.chosenScores.every((score) => score.trim() !== "");

    return previousFormsComplete && thirdFormMainComplete;
  }, [formData]);

  // Memoize context value to prevent unnecessary re-renders
  const contextValue = useMemo(
    () => ({
      formData,
      updateFormData,
      updateThirdForm,
      updateFourthForm,
      updateFifthForm, // ✅ now defined
      resetFormData,
      isFormDataComplete,
    }),
    [
      formData,
      updateFormData,
      updateThirdForm,
      updateFourthForm,
      updateFifthForm,
      resetFormData,
      isFormDataComplete,
    ],
  );

  return <FormDataContext value={contextValue}>{children}</FormDataContext>;
}
