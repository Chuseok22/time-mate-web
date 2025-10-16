'use client';
import { createContext, ReactNode, useCallback, useContext, useState } from "react";

type BottomSheetId = string;

interface BottomSheetContextValue {
  activeId: BottomSheetId | null;
  open: (id: BottomSheetId) => void;
  close: (id?: BottomSheetId) => void;
  isOpen: (id: BottomSheetId) => boolean;
}

const BottomSheetContext = createContext<BottomSheetContextValue | null>(null);

export function BottomSheetProvider({
  children
}: { children: ReactNode }) {
  const [activeId, setActiveId] = useState<BottomSheetId | null>(null);

  const open = useCallback((id: BottomSheetId) => {
    setActiveId(id);
  }, []);

  const close = useCallback((id?: BottomSheetId) => {
    setActiveId((prev) => (id === undefined || prev === id ? null : prev));
  }, []);

  const isOpen = useCallback((id: BottomSheetId) => activeId === id, [activeId]);


  return (
      <BottomSheetContext.Provider value={{ activeId, open, close, isOpen }}>
        {children}
      </BottomSheetContext.Provider>
  );
}

export function useBottomSheet() {
  const ctx = useContext(BottomSheetContext);
  if (!ctx) {
    throw new Error("useBottomSheet must be used within BottomSheetProvider");
  }
  return ctx;
}