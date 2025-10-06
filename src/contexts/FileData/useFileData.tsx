import { use } from "react";
import { FileDataContext, type FileDataContextType } from "./FileDataContext";

export function useFileData(): FileDataContextType {
  const context = use(FileDataContext);
  if (context === undefined) {
    throw new Error("useFileData must be used within a FileDataProvider");
  }

  return context;
}
