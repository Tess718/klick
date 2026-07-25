"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

const RANGES = [
  { label: "24h", value: "24h" },
  { label: "7d", value: "7d" },
  { label: "30d", value: "30d" },
  { label: "90d", value: "90d" },
  { label: "All", value: "all" },
];

export function DateRangePicker() {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const currentRange = searchParams.get("range") || "7d";

  const handleSelect = (val: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("range", val);
    router.push(`${pathname}?${params.toString()}`);
  };

  return (
    <div className="flex items-center gap-1 bg-muted/60 p-1 rounded-xl border border-border/50 text-xs shadow-xs">
      <div className="flex items-center gap-1.5 px-2 py-1 text-muted-foreground font-medium">
        <CalendarIcon className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">Range:</span>
      </div>
      <div className="flex items-center gap-0.5 sm:gap-1">
        {RANGES.map((r) => {
          const isActive = currentRange === r.value;
          return (
            <button
              key={r.value}
              onClick={() => handleSelect(r.value)}
              className={cn(
                "px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all duration-150 cursor-pointer",
                isActive
                  ? "bg-background text-foreground shadow-xs border border-border/80"
                  : "text-muted-foreground hover:text-foreground hover:bg-background/40"
              )}
            >
              {r.label}
            </button>
          );
        })}
      </div>
    </div>
  );
}
