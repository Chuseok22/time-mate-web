'use client'
import { JSX, useEffect, useState } from "react";
import clsx from "clsx";
import { Check, Copy } from "lucide-react";
import { generateInviteMessage } from "@/features/meeting/templates/inviteTemplate";

interface CopyButtonProps {
  title: string
  url: string,
  joinCode: string;
  className?: string;
  successDurationMs?: number;
}

export default function CopyButton({
  title,
  url,
  joinCode,
  className,
  successDurationMs = 1500,
}: CopyButtonProps): JSX.Element {

  const [copied, setCopied] = useState<boolean>(false);

  async function copyToClipboard() {
    try {
      await navigator.clipboard.writeText(generateInviteMessage({ title, url, joinCode }));
    } catch {
      await navigator.clipboard.writeText(joinCode);
    }
    setCopied(true);
  }

  useEffect(() => {
    if (!copied) return;
    const timeout = setTimeout(() => setCopied(false), successDurationMs);
    return () => clearTimeout(timeout);
  }, [copied, successDurationMs]);

  return (
      <button
          type='button'
          onClick={copyToClipboard}
          className={clsx(
              "bg-sky-500 rounded-xl text-white px-4 py-0.5",
              "flex items-center justify-center",
              "hover:cursor-pointer",
              "hover:bg-sky-600 active:bg-sky-700 transition",
              className
          )}
      >
        {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
      </button>

  );
};