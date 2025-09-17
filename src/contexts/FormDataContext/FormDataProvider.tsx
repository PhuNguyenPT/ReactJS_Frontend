import {
  useState,
  useCallback,
  useMemo,
  useEffect,
  type ReactNode,
} from "react";
import {
  FormDataContext,
  initialFormData,
  type FormData,
  type GradeKey,
  type GradeValues,
} from "./FormDataContext";

const FORM_DATA_STORAGE_KEY = "form_data";

// Helper function to validate stored form data
function isValidFormData(data: unknown): data is FormData {
  if (typeof data !== "object" || data === null) return false;

  const formData = data as Record<string, unknown>;

  // Check if it has the required top-level properties
  return (
    (typeof formData.selectedProvince === "string" ||
      formData.selectedProvince === null) &&
    Array.isArray(formData.secondFormMajors) &&
    typeof formData.thirdForm === "object" &&
    typeof formData.fourthForm === "object" &&
    typeof formData.fifthForm === "object" &&
    typeof formData.sixthForm === "object" &&
    typeof formData.seventhForm === "object"
  );
}

export function FormDataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as unknown;

        // Validate that the stored data has the correct structure
        if (isValidFormData(parsedData)) {
          return { ...initialFormData, ...parsedData };
        } else {
          console.warn(
            "Stored form data has invalid structure, using initial data",
          );
        }
      }
    } catch (error) {
      console.error("Error loading form data from localStorage:", error);
    }
    return initialFormData;
  });

  // Save to localStorage whenever formData changes
  useEffect(() => {
    try {
      localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(formData));
    } catch (error) {
      console.error("Error saving form data to localStorage:", error);
    }
  }, [formData]);

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
        },
      }));
    },
    [],
  );

  const resetFormData = useCallback(() => {
    setFormData(initialFormData);
    // Also clear from localStorage
    try {
      localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing form data from localStorage:", error);
    }
  }, []);

  // Clear form data from localStorage (useful when form is completed)
  const clearStoredFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_STORAGE_KEY);
    } catch (error) {
      console.error("Error removing form data from localStorage:", error);
    }
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
      clearStoredFormData,
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
      clearStoredFormData,
      isFormDataComplete,
    ],
  );

  return <FormDataContext value={contextValue}>{children}</FormDataContext>;
}
