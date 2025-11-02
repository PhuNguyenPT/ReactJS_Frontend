import { useState, useEffect, useCallback, useMemo } from "react";
import type { FilterFieldsResponse } from "../../services/studentAdmission/admissionFilterService";

export interface FilterCriteria {
  uniName?: string[];
  majorName?: string[];
  admissionTypeName?: string[];
  tuitionFeeRange?: {
    min?: number;
    max?: number;
  };
  province?: string[];
  studyProgram?: string[];
  subjectCombination?: string[];
}

interface UseResultFilterProps {
  filterFields: FilterFieldsResponse | null;
  onFilterApply: (filters: FilterCriteria) => void;
  onFilterClear: () => void;
}

export function useResultFilter({
  filterFields,
  onFilterApply,
  onFilterClear,
}: UseResultFilterProps) {
  const [selectedFilters, setSelectedFilters] = useState<FilterCriteria>({});
  const [isOpen, setIsOpen] = useState(false);

  // Reset filters when filter fields change
  useEffect(() => {
    setSelectedFilters({});
  }, [filterFields]);

  // Handle filter change for array-based filters
  const handleFilterChange = useCallback(
    (filterType: keyof FilterCriteria, value: string | string[]) => {
      setSelectedFilters((prev) => ({
        ...prev,
        [filterType]: Array.isArray(value) ? value : [value],
      }));
    },
    [],
  );

  // Handle tuition fee range change
  const handleTuitionFeeChange = useCallback(
    (type: "min" | "max", value: string) => {
      setSelectedFilters((prev) => ({
        ...prev,
        tuitionFeeRange: {
          ...prev.tuitionFeeRange,
          [type]: value ? parseInt(value, 10) : undefined,
        },
      }));
    },
    [],
  );

  // Apply filters and close drawer
  const handleApplyFilters = useCallback(() => {
    onFilterApply(selectedFilters);
    setIsOpen(false);
  }, [selectedFilters, onFilterApply]);

  // Clear all filters
  const handleClearFilters = useCallback(() => {
    setSelectedFilters({});
    onFilterClear();
  }, [onFilterClear]);

  // Open drawer
  const openDrawer = useCallback(() => {
    setIsOpen(true);
  }, []);

  // Close drawer
  const closeDrawer = useCallback(() => {
    setIsOpen(false);
  }, []);

  // Check if there are any active filters
  const hasActiveFilters = useMemo(() => {
    return Object.keys(selectedFilters).some((key) => {
      const value = selectedFilters[key as keyof FilterCriteria];
      if (key === "tuitionFeeRange") {
        const feeRange = value as { min?: number; max?: number } | undefined;
        return feeRange?.min !== undefined || feeRange?.max !== undefined;
      }
      return Array.isArray(value) && value.length > 0;
    });
  }, [selectedFilters]);

  // Count active filters
  const activeFilterCount = useMemo(() => {
    return Object.entries(selectedFilters).reduce((count, [key, value]) => {
      if (key === "tuitionFeeRange") {
        const feeRange = value as { min?: number; max?: number } | undefined;
        return count + (feeRange?.min || feeRange?.max ? 1 : 0);
      }
      return count + (Array.isArray(value) && value.length > 0 ? 1 : 0);
    }, 0);
  }, [selectedFilters]);

  // Sort tuition fees numerically
  const sortedTuitionFees = useMemo(() => {
    if (!filterFields?.fields.tuitionFee) return [];
    return [...filterFields.fields.tuitionFee].sort(
      (a, b) => parseInt(a, 10) - parseInt(b, 10),
    );
  }, [filterFields?.fields.tuitionFee]);

  // Check if filter fields are available
  const isFilterFieldsAvailable = useMemo(() => {
    return filterFields?.fields != null;
  }, [filterFields?.fields]);

  return {
    // State
    selectedFilters,
    isOpen,
    filterFields,

    // Computed values
    hasActiveFilters,
    activeFilterCount,
    sortedTuitionFees,
    isFilterFieldsAvailable,

    // Handlers
    handleFilterChange,
    handleTuitionFeeChange,
    handleApplyFilters,
    handleClearFilters,
    openDrawer,
    closeDrawer,
  };
}
