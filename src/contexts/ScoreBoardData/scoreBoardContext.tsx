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
  ocrIdMapping: Record<string, string>; // NEW: Add OCR ID mapping
}

interface NinthFormContextType {
  scores: GradeScores;
  selectedSubjects: Record<string, (string | null)[]>;
  hasOcrData: boolean;
  ocrIdMapping: Record<string, string>; // NEW
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
    ocrIdMapping: Record<string, string>,
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
  ocrIdMapping: {}, // NEW: Initialize empty mapping
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

  // ocrIdMapping is optional for backward compatibility
  // If it doesn't exist, it will be set to {}

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
  const [ocrIdMapping, setOcrIdMapping] = useState<Record<string, string>>({});

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
          setOcrIdMapping(parsed.ocrIdMapping);
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
        ocrIdMapping, // NEW: Include OCR ID mapping
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(dataToSave));
    } catch (error) {
      console.error("[NinthFormContext] Error saving data:", error);
    }
  }, [scores, selectedSubjects, hasOcrData, ocrIdMapping]); // NEW: Add ocrIdMapping to dependency

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
      newOcrIdMapping: Record<string, string>, // NEW: Add parameter
    ) => {
      setScores(newScores);
      setSelectedSubjects(newSelectedSubjects);
      setHasOcrData(true);
      setOcrIdMapping(newOcrIdMapping); // NEW: Save OCR ID mapping
    },
    [],
  );

  const clearAllData = useCallback(() => {
    setScores(defaultState.scores);
    setSelectedSubjects(defaultState.selectedSubjects);
    setHasOcrData(false);
    setOcrIdMapping({}); // NEW: Clear OCR ID mapping
    localStorage.removeItem(STORAGE_KEY);
    console.log("[NinthFormContext] Cleared all data");
  }, []);

  const resetToDefault = useCallback(() => {
    setScores(defaultState.scores);
    setSelectedSubjects(defaultState.selectedSubjects);
    setHasOcrData(false);
    setOcrIdMapping({}); // NEW: Reset OCR ID mapping
  }, []);

  const value: NinthFormContextType = useMemo(
    () => ({
      scores,
      selectedSubjects,
      hasOcrData,
      ocrIdMapping, // NEW: Expose OCR ID mapping
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
      ocrIdMapping, // NEW: Add to dependencies
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
