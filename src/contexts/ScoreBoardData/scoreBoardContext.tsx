import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";

type SubjectScores = Record<string, string>;
type GradeScores = Record<string, SubjectScores>;

interface NinthFormState {
  scores: GradeScores;
  selectedSubjects: Record<string, (string | null)[]>;
  hasOcrData: boolean;
}

interface NinthFormContextType {
  scores: GradeScores;
  selectedSubjects: Record<string, (string | null)[]>;
  hasOcrData: boolean;
  updateScore: (gradeKey: string, subject: string, value: string) => void;
  updateSelectedSubject: (
    gradeKey: string,
    index: number,
    subject: string | null,
  ) => void;
  removeSubjectScore: (gradeKey: string, subject: string) => void;
  loadOcrData: (
    scores: GradeScores,
    selectedSubjects: Record<string, (string | null)[]>,
  ) => void;
  clearAllData: () => void;
  resetToDefault: () => void;
}

const STORAGE_KEY = "ninthFormData";

const defaultState: NinthFormState = {
  scores: {
    "10-1": {},
    "10-2": {},
    "11-1": {},
    "11-2": {},
    "12-1": {},
    "12-2": {},
  },
  selectedSubjects: {
    "10-1": [null, null, null, null],
    "10-2": [null, null, null, null],
    "11-1": [null, null, null, null],
    "11-2": [null, null, null, null],
    "12-1": [null, null, null, null],
    "12-2": [null, null, null, null],
  },
  hasOcrData: false,
};

const NinthFormContext = createContext<NinthFormContextType | undefined>(
  undefined,
);

// Type guard to validate parsed data structure
function isValidNinthFormState(data: unknown): data is NinthFormState {
  if (typeof data !== "object" || data === null) {
    return false;
  }

  const obj = data as Record<string, unknown>;

  // Check if scores exists and is an object
  if (typeof obj.scores !== "object" || obj.scores === null) {
    return false;
  }

  // Check if selectedSubjects exists and is an object
  if (
    typeof obj.selectedSubjects !== "object" ||
    obj.selectedSubjects === null
  ) {
    return false;
  }

  // Check if hasOcrData exists and is a boolean
  if (typeof obj.hasOcrData !== "boolean") {
    return false;
  }

  return true;
}

export const NinthFormProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [scores, setScores] = useState<GradeScores>(defaultState.scores);
  const [selectedSubjects, setSelectedSubjects] = useState<
    Record<string, (string | null)[]>
  >(defaultState.selectedSubjects);
  const [hasOcrData, setHasOcrData] = useState(false);

  // Load data from localStorage on mount
  useEffect(() => {
    try {
      const savedData = localStorage.getItem(STORAGE_KEY);
      if (savedData) {
        const parsed: unknown = JSON.parse(savedData);

        // Validate the parsed data before using it
        if (isValidNinthFormState(parsed)) {
          setScores(parsed.scores);
          setSelectedSubjects(parsed.selectedSubjects);
          setHasOcrData(parsed.hasOcrData);
        } else {
          console.warn(
            "[NinthFormContext] Invalid data structure in localStorage, using defaults",
          );
        }
      }
    } catch (error) {
      console.error("[NinthFormContext] Error loading saved data:", error);
    }
  }, []);

  // Save data to localStorage whenever it changes
  useEffect(() => {
    try {
      const dataToSave: NinthFormState = {
        scores,
        selectedSubjects,
        hasOcrData,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("[NinthFormContext] Error saving data:", error);
    }
  }, [scores, selectedSubjects, hasOcrData]);

  const updateScore = useCallback(
    (gradeKey: string, subject: string, value: string) => {
      setScores((prev) => ({
        ...prev,
        [gradeKey]: {
          ...prev[gradeKey],
          [subject]: value,
        },
      }));
    },
    [],
  );

  const updateSelectedSubject = useCallback(
    (gradeKey: string, index: number, subject: string | null) => {
      setSelectedSubjects((prev) => {
        const updated = [...prev[gradeKey]];
        updated[index] = subject;
        return { ...prev, [gradeKey]: updated };
      });
    },
    [],
  );

  const removeSubjectScore = useCallback(
    (gradeKey: string, subject: string) => {
      setScores((prev) => {
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        const { [subject]: _, ...restScores } = prev[gradeKey];
        return {
          ...prev,
          [gradeKey]: restScores,
        };
      });
    },
    [],
  );

  const loadOcrData = useCallback(
    (
      newScores: GradeScores,
      newSelectedSubjects: Record<string, (string | null)[]>,
    ) => {
      setScores(newScores);
      setSelectedSubjects(newSelectedSubjects);
      setHasOcrData(true);
    },
    [],
  );

  const clearAllData = useCallback(() => {
    setScores(defaultState.scores);
    setSelectedSubjects(defaultState.selectedSubjects);
    setHasOcrData(false);
    localStorage.removeItem(STORAGE_KEY);
    console.log("[NinthFormContext] Cleared all data");
  }, []);

  const resetToDefault = useCallback(() => {
    setScores(defaultState.scores);
    setSelectedSubjects(defaultState.selectedSubjects);
    setHasOcrData(false);
  }, []);

  const value: NinthFormContextType = useMemo(
    () => ({
      scores,
      selectedSubjects,
      hasOcrData,
      updateScore,
      updateSelectedSubject,
      removeSubjectScore,
      loadOcrData,
      clearAllData,
      resetToDefault,
    }),
    [
      scores,
      selectedSubjects,
      hasOcrData,
      updateScore,
      updateSelectedSubject,
      removeSubjectScore,
      loadOcrData,
      clearAllData,
      resetToDefault,
    ],
  );

  return <NinthFormContext value={value}>{children}</NinthFormContext>;
};

// Export the context for the custom hook
export { NinthFormContext };
