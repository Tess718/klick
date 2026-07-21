"use client";

import { usePathname } from "next/navigation";

export function DashboardHeaderTitle() {
  const pathname = usePathname();
  
  let title = "Overview";
  if (pathname.includes("/settings")) title = "Settings";
  else if (pathname.includes("/analytics")) title = "Analytics";
  else if (pathname.includes("/links")) title = "Link Details";

  return <span className="font-semibold">{title}</span>;
}
