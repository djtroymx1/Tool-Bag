"use client";

import { createContext, useContext } from "react";
import { useSelection } from "@/hooks/use-selection";

type SelectionContextType = ReturnType<typeof useSelection>;

const SelectionContext = createContext<SelectionContextType | null>(null);

export function SelectionProvider({ children }: { children: React.ReactNode }) {
  const selection = useSelection();
  return (
    <SelectionContext.Provider value={selection}>
      {children}
    </SelectionContext.Provider>
  );
}

export function useSelectionContext() {
  const ctx = useContext(SelectionContext);
  if (!ctx) {
    throw new Error(
      "useSelectionContext must be used within SelectionProvider"
    );
  }
  return ctx;
}
