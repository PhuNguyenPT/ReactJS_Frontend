import { useState, useCallback, useMemo, type ReactNode } from "react";
import {
  FormDataContext,
  initialFormData,
  type FormData,
  type GradeKey,
  type GradeValues,
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

  // Specific fifth form update function
  const updateFifthForm = useCallback(
    (fifthFormData: Partial<FormData["fifthForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        fifthForm: { ...prev.fifthForm, ...fifthFormData },
      }));
    },
    [],
  );

  // Specific sixth form update function
  const updateSixthForm = useCallback(
    (sixthFormData: Partial<FormData["sixthForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        sixthForm: { ...prev.sixthForm, ...sixthFormData },
      }));
    },
    [],
  );

  // Specific seventh form update function
  const updateSeventhForm = useCallback(
    (seventhFormData: Partial<FormData["seventhForm"]>) => {
      setFormData((prev) => ({
        ...prev,
        seventhForm: { ...prev.seventhForm, ...seventhFormData },
      }));
    },
    [],
  );

  // Specific seventh form grade update function
  const updateSeventhFormGrade = useCallback(
    (grade: GradeKey, field: keyof GradeValues, value: string) => {
      setFormData((prev) => ({
        ...prev,
        seventhForm: {
          ...prev.seventhForm,
          grades: {
            ...prev.seventhForm.grades,
            [grade]: {
              ...prev.seventhForm.grades[grade],
              [field]: value,
            },
          },
          // Clear error when user inputs a value
          errors: {
            ...prev.seventhForm.errors,
            [grade]: {
              ...prev.seventhForm.errors[grade],
              [field]: value.trim() === "",
            },
          },
        },
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
      updateFifthForm,
      updateSixthForm,
      updateSeventhForm,
      updateSeventhFormGrade,
      resetFormData,
      isFormDataComplete,
    }),
    [
      formData,
      updateFormData,
      updateThirdForm,
      updateFourthForm,
      updateFifthForm,
      updateSixthForm,
      updateSeventhForm,
      updateSeventhFormGrade,
      resetFormData,
      isFormDataComplete,
    ],
  );

  return <FormDataContext value={contextValue}>{children}</FormDataContext>;
}
