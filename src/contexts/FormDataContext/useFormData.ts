import { use } from "react";
import { FormDataContext } from "./FormDataContext";

export function useFormData() {
  const context = use(FormDataContext);
  if (context === undefined) {
    throw new Error("useFormData must be used within a FormDataProvider");
  }
  return context;
}
