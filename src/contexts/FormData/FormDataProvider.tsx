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
import { getVietnameseValue, getTranslationKey } from "../../type/enum/major";
import {
  getUniTypeVietnameseValue,
  getUniTypeTranslationKey,
} from "../../type/enum/uni-type";
import {
  getNationalExamSubjectVietnameseValue,
  getNationalExamSubjectTranslationKey,
} from "../../type/enum/national-exam-subject";
import {
  getOptionalSubjectVietnameseValue,
  getOptionalSubjectTranslationKey,
} from "../../type/enum/combineUtil";
import {
  getExamTypeVietnameseValue,
  getExamTypeTranslationKey,
} from "../../type/enum/exam";
import {
  getNationalExcellentExamVietnameseValue,
  getNationalExcellentExamTranslationKey,
} from "../../type/enum/national-excellent-exam";
import {
  getRankVietnameseValue,
  getRankTranslationKey,
} from "../../type/enum/ranks";
import {
  getSpecialStudentCaseVietnameseValue,
  getSpecialStudentCaseTranslationKey,
} from "../../type/enum/special-student-case";
import {
  getConductVietnameseValue,
  getConductTranslationKey,
} from "../../type/enum/conduct";
import {
  getAcademicPerformanceVietnameseValue,
  getAcademicPerformanceTranslationKey,
} from "../../type/enum/academic-performance";

const FORM_DATA_STORAGE_KEY = "form_data";
const FORM_DATA_TIMESTAMP_KEY = "form_data_timestamp";

// Set expiration time (in milliseconds)
// 2 hours = 2 * 60 * 60 * 1000
const FORM_DATA_EXPIRATION_TIME = 2 * 60 * 60 * 1000;

// Conversion constant for VND (million to actual value)
const MILLION_TO_VND = 1000000;

// Helper function to convert fourth form fields
function convertFourthFormToVietnamese(fourthForm: FormData["fourthForm"]) {
  return {
    ...fourthForm,
    categories: fourthForm.categories.map((category) => ({
      ...category,
      entries: category.entries.map((entry) => ({
        ...entry,
        firstField: entry.firstField
          ? category.categoryType === "national_award"
            ? getNationalExcellentExamVietnameseValue(entry.firstField)
            : getExamTypeVietnameseValue(entry.firstField)
          : entry.firstField,
        secondField: entry.secondField
          ? category.categoryType === "language_cert" ||
            category.categoryType === "international_cert"
            ? entry.secondField
            : getRankVietnameseValue(entry.secondField)
          : entry.secondField,
      })),
    })),
  };
}

// Helper function to convert fourth form fields from Vietnamese
function convertFourthFormFromVietnamese(fourthForm: FormData["fourthForm"]) {
  return {
    ...fourthForm,
    categories: fourthForm.categories.map((category) => ({
      ...category,
      entries: category.entries.map((entry) => ({
        ...entry,
        firstField: entry.firstField
          ? category.categoryType === "national_award"
            ? getNationalExcellentExamTranslationKey(entry.firstField)
            : getExamTypeTranslationKey(entry.firstField)
          : entry.firstField,
        secondField: entry.secondField
          ? category.categoryType === "language_cert" ||
            category.categoryType === "international_cert"
            ? entry.secondField
            : getRankTranslationKey(entry.secondField)
          : entry.secondField,
      })),
    })),
  };
}

// Helper function to convert translation keys to Vietnamese for storage
function convertToVietnameseForStorage(formData: FormData): FormData {
  return {
    ...formData,
    uniType: formData.uniType
      ? getUniTypeVietnameseValue(formData.uniType)
      : null,
    secondForm: formData.secondForm.map((major) =>
      major ? getVietnameseValue(major) : null,
    ),
    thirdForm: {
      ...formData.thirdForm,
      chosenSubjects: formData.thirdForm.chosenSubjects.map((subject) =>
        subject ? getNationalExamSubjectVietnameseValue(subject) : null,
      ),
      optionalCategories: formData.thirdForm.optionalCategories.map(
        (category) => ({
          ...category,
          scores: category.scores.map((score) => ({
            ...score,
            subject: score.subject
              ? getOptionalSubjectVietnameseValue(score.subject)
              : score.subject,
          })),
        }),
      ),
    },
    fourthForm: convertFourthFormToVietnamese(formData.fourthForm),
    // Convert fifthForm costRange from millions to actual VND values
    fifthForm: {
      ...formData.fifthForm,
      costRange: formData.fifthForm.costRange.map(
        (value) => value * MILLION_TO_VND,
      ),
    },
    // Convert sixthForm special student cases to Vietnamese
    sixthForm: {
      ...formData.sixthForm,
      specialStudentCases: formData.sixthForm.specialStudentCases.map(
        (caseKey) => getSpecialStudentCaseVietnameseValue(caseKey),
      ),
    },
    // Convert seventhForm grades to Vietnamese
    seventhForm: {
      ...formData.seventhForm,
      grades: {
        "10": {
          conduct: formData.seventhForm.grades["10"].conduct
            ? getConductVietnameseValue(
                formData.seventhForm.grades["10"].conduct,
              )
            : formData.seventhForm.grades["10"].conduct,
          academicPerformance: formData.seventhForm.grades["10"]
            .academicPerformance
            ? getAcademicPerformanceVietnameseValue(
                formData.seventhForm.grades["10"].academicPerformance,
              )
            : formData.seventhForm.grades["10"].academicPerformance,
        },
        "11": {
          conduct: formData.seventhForm.grades["11"].conduct
            ? getConductVietnameseValue(
                formData.seventhForm.grades["11"].conduct,
              )
            : formData.seventhForm.grades["11"].conduct,
          academicPerformance: formData.seventhForm.grades["11"]
            .academicPerformance
            ? getAcademicPerformanceVietnameseValue(
                formData.seventhForm.grades["11"].academicPerformance,
              )
            : formData.seventhForm.grades["11"].academicPerformance,
        },
        "12": {
          conduct: formData.seventhForm.grades["12"].conduct
            ? getConductVietnameseValue(
                formData.seventhForm.grades["12"].conduct,
              )
            : formData.seventhForm.grades["12"].conduct,
          academicPerformance: formData.seventhForm.grades["12"]
            .academicPerformance
            ? getAcademicPerformanceVietnameseValue(
                formData.seventhForm.grades["12"].academicPerformance,
              )
            : formData.seventhForm.grades["12"].academicPerformance,
        },
      },
    },
  };
}

// Helper function to convert Vietnamese values back to translation keys
function convertFromVietnameseStorage(formData: FormData): FormData {
  return {
    ...formData,
    uniType: formData.uniType
      ? getUniTypeTranslationKey(formData.uniType)
      : null,
    secondForm: formData.secondForm.map((major) =>
      major ? getTranslationKey(major) : null,
    ),
    thirdForm: {
      ...formData.thirdForm,
      chosenSubjects: formData.thirdForm.chosenSubjects.map((subject) =>
        subject ? getNationalExamSubjectTranslationKey(subject) : null,
      ),
      optionalCategories: formData.thirdForm.optionalCategories.map(
        (category) => ({
          ...category,
          scores: category.scores.map((score) => ({
            ...score,
            subject: score.subject
              ? getOptionalSubjectTranslationKey(score.subject)
              : score.subject,
          })),
        }),
      ),
    },
    fourthForm: convertFourthFormFromVietnamese(formData.fourthForm),
    // Convert fifthForm costRange from actual VND values back to millions
    fifthForm: {
      ...formData.fifthForm,
      costRange: formData.fifthForm.costRange.map((value) =>
        Math.round(value / MILLION_TO_VND),
      ),
    },
    // Convert sixthForm special student cases back to translation keys
    sixthForm: {
      ...formData.sixthForm,
      specialStudentCases: formData.sixthForm.specialStudentCases.map(
        (vietnameseValue) =>
          getSpecialStudentCaseTranslationKey(vietnameseValue),
      ),
    },
    // Convert seventhForm grades back to translation keys
    seventhForm: {
      ...formData.seventhForm,
      grades: {
        "10": {
          conduct: formData.seventhForm.grades["10"].conduct
            ? getConductTranslationKey(
                formData.seventhForm.grades["10"].conduct,
              )
            : formData.seventhForm.grades["10"].conduct,
          academicPerformance: formData.seventhForm.grades["10"]
            .academicPerformance
            ? getAcademicPerformanceTranslationKey(
                formData.seventhForm.grades["10"].academicPerformance,
              )
            : formData.seventhForm.grades["10"].academicPerformance,
        },
        "11": {
          conduct: formData.seventhForm.grades["11"].conduct
            ? getConductTranslationKey(
                formData.seventhForm.grades["11"].conduct,
              )
            : formData.seventhForm.grades["11"].conduct,
          academicPerformance: formData.seventhForm.grades["11"]
            .academicPerformance
            ? getAcademicPerformanceTranslationKey(
                formData.seventhForm.grades["11"].academicPerformance,
              )
            : formData.seventhForm.grades["11"].academicPerformance,
        },
        "12": {
          conduct: formData.seventhForm.grades["12"].conduct
            ? getConductTranslationKey(
                formData.seventhForm.grades["12"].conduct,
              )
            : formData.seventhForm.grades["12"].conduct,
          academicPerformance: formData.seventhForm.grades["12"]
            .academicPerformance
            ? getAcademicPerformanceTranslationKey(
                formData.seventhForm.grades["12"].academicPerformance,
              )
            : formData.seventhForm.grades["12"].academicPerformance,
        },
      },
    },
  };
}

// Helper function to validate stored form data
function isValidFormData(data: unknown): data is FormData {
  if (typeof data !== "object" || data === null) return false;

  const formData = data as Record<string, unknown>;

  return (
    (typeof formData.firstForm === "string" || formData.firstForm === null) &&
    (typeof formData.uniType === "string" || formData.uniType === null) &&
    Array.isArray(formData.secondForm) &&
    typeof formData.thirdForm === "object" &&
    typeof formData.fourthForm === "object" &&
    typeof formData.fifthForm === "object" &&
    typeof formData.sixthForm === "object" &&
    typeof formData.seventhForm === "object"
  );
}

// Helper function to check if stored data is expired
function isFormDataExpired(): boolean {
  try {
    const timestamp = localStorage.getItem(FORM_DATA_TIMESTAMP_KEY);
    if (!timestamp) return true;

    const savedTime = parseInt(timestamp);
    const currentTime = Date.now();
    const isExpired = currentTime - savedTime > FORM_DATA_EXPIRATION_TIME;

    if (isExpired) {
      console.log("Form data has expired, clearing storage");
      localStorage.removeItem(FORM_DATA_STORAGE_KEY);
      localStorage.removeItem(FORM_DATA_TIMESTAMP_KEY);
    }

    return isExpired;
  } catch (error) {
    console.error("Error checking form data expiration:", error);
    return true;
  }
}

// Helper function to save data with timestamp (converts to Vietnamese first)
function saveFormDataWithTimestamp(data: FormData): void {
  try {
    const vietnameseData = convertToVietnameseForStorage(data);
    localStorage.setItem(FORM_DATA_STORAGE_KEY, JSON.stringify(vietnameseData));
    localStorage.setItem(FORM_DATA_TIMESTAMP_KEY, Date.now().toString());
  } catch (error) {
    console.error("Error saving form data to localStorage:", error);
  }
}

export function FormDataProvider({ children }: { children: ReactNode }) {
  // Initialize state from localStorage if available and not expired
  const [formData, setFormData] = useState<FormData>(() => {
    try {
      // Check if data is expired first
      if (isFormDataExpired()) {
        return initialFormData;
      }

      const storedData = localStorage.getItem(FORM_DATA_STORAGE_KEY);
      if (storedData) {
        const parsedData = JSON.parse(storedData) as unknown;

        // Validate that the stored data has the correct structure
        if (isValidFormData(parsedData)) {
          console.log("Loaded valid form data from localStorage");
          // Convert Vietnamese values back to translation keys for UI
          const convertedData = convertFromVietnameseStorage(parsedData);
          return { ...initialFormData, ...convertedData };
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

  // Save to localStorage whenever formData changes (with timestamp and Vietnamese conversion)
  useEffect(() => {
    saveFormDataWithTimestamp(formData);
  }, [formData]);

  // Check for expiration periodically (every 5 minutes)
  useEffect(() => {
    const checkExpiration = () => {
      if (isFormDataExpired()) {
        setFormData(initialFormData);
      }
    };

    // Check immediately
    checkExpiration();

    // Set up periodic check (every 5 minutes)
    const intervalId = setInterval(checkExpiration, 5 * 60 * 1000);

    // Cleanup interval on unmount
    return () => {
      clearInterval(intervalId);
    };
  }, []);

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
      localStorage.removeItem(FORM_DATA_TIMESTAMP_KEY);
    } catch (error) {
      console.error("Error removing form data from localStorage:", error);
    }
  }, []);

  // Clear form data from localStorage (useful when form is completed)
  const clearStoredFormData = useCallback(() => {
    try {
      localStorage.removeItem(FORM_DATA_STORAGE_KEY);
      localStorage.removeItem(FORM_DATA_TIMESTAMP_KEY);
    } catch (error) {
      console.error("Error removing form data from localStorage:", error);
    }
  }, []);

  // Get remaining time until expiration (in milliseconds)
  const getRemainingTime = useCallback((): number => {
    try {
      const timestamp = localStorage.getItem(FORM_DATA_TIMESTAMP_KEY);
      if (!timestamp) return 0;

      const savedTime = parseInt(timestamp);
      const currentTime = Date.now();
      const remainingTime =
        FORM_DATA_EXPIRATION_TIME - (currentTime - savedTime);

      return Math.max(0, remainingTime);
    } catch (error) {
      console.error("Error getting remaining time:", error);
      return 0;
    }
  }, []);

  const isFormDataComplete = useCallback(() => {
    const { firstForm, secondForm, thirdForm } = formData;

    // Check if previous forms are complete
    const previousFormsComplete =
      firstForm !== null && secondForm.every((major) => major !== null);

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

  // Function to get form data with Vietnamese values (for API calls)
  const getFormDataForApi = useCallback(() => {
    return convertToVietnameseForStorage(formData);
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
      getRemainingTime,
      isFormDataComplete,
      getFormDataForApi, // New function for API calls
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
      getRemainingTime,
      isFormDataComplete,
      getFormDataForApi,
    ],
  );

  return <FormDataContext value={contextValue}>{children}</FormDataContext>;
}
