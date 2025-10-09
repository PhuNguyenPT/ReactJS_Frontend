import { use } from "react";
import { NinthFormContext } from "./scoreBoardContext";

export const useNinthForm = () => {
  const context = use(NinthFormContext);
  if (context === undefined) {
    throw new Error("useNinthForm must be used within a NinthFormProvider");
  }
  return context;
};
