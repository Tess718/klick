"use client";

import { useRouter } from "next/navigation";
import { ArrowPathIcon } from "@heroicons/react/24/outline";
import { useState, useTransition } from "react";

export function RefreshButton() {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  const handleRefresh = () => {
    startTransition(() => {
      router.refresh();
    });
  };

  return (
    <button
      onClick={handleRefresh}
      disabled={isPending}
      title="Refresh data"
      className="p-2 text-zinc-400 hover:text-zinc-900 bg-white border border-zinc-200 hover:bg-zinc-50 rounded-lg transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-zinc-200 disabled:opacity-50"
    >
      <ArrowPathIcon className={`w-5 h-5 ${isPending ? "animate-spin text-zinc-900" : ""}`} />
    </button>
  );
}
