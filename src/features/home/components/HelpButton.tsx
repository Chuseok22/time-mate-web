'use client';

import { useCallback, useEffect, useState } from "react";
import { HelpCircle } from "lucide-react";
import HelpModal from "@/features/home/components/HelpModal";

export default function HelpButton() {

  const [open, setOpen] = useState<boolean>(false);
  const onClose = useCallback(() => {
    setOpen(false);
  }, []);

  useEffect(() => {
    if (!open) {
      return;
    }
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
      <>
        <button
            type="button"
            onClick={() => setOpen(true)}
            className="inline-flex items-center justify-center rounded-full
            p-1.5 bg-white hover:cursor-pointer shadow-2xl
            hover:bg-gray-100/80 transition"
        >
          <HelpCircle className="size-8" />
        </button>

        <HelpModal
            open={open}
            onClose={onClose}
        />

      </>
  );
};