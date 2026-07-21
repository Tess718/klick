"use client";

import { DocumentDuplicateIcon, CheckIcon } from "@heroicons/react/24/outline";
import { useState } from "react";

export function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Failed to copy", err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="p-1.5 text-current opacity-50 hover:opacity-100 hover:bg-current/10 rounded-md transition-all focus:outline-none"
      title="Copy to clipboard"
    >
      {copied ? <CheckIcon className="w-4 h-4 text-emerald-500" /> : <DocumentDuplicateIcon className="w-4 h-4" />}
    </button>
  );
}
