"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LinkIcon, ChartBarIcon, Cog6ToothIcon } from "@heroicons/react/24/outline";

const navItems = [
  { href: "/dashboard", label: "Links", icon: LinkIcon, exact: true },
  { href: "/dashboard/analytics", label: "Analytics", icon: ChartBarIcon },
  { href: "/dashboard/settings", label: "Settings", icon: Cog6ToothIcon },
];

export function SidebarNav() {
  const pathname = usePathname();

  return (
    <nav className="flex-1 py-6 px-3 flex flex-col gap-1">
      {navItems.map(({ href, label, icon: Icon, exact }) => {
        const isActive = exact
          ? pathname === href || pathname.startsWith("/dashboard/links") || pathname.startsWith("/dashboard/new")
          : pathname.startsWith(href);

        return (
          <Link
            key={href}
            href={href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg transition-colors ${
              isActive
                ? "text-cobalt bg-paper"
                : "text-paper/70 hover:bg-paper/10 hover:text-paper"
            }`}
          >
            <Icon className="w-5 h-5" />
            <span className="font-medium">{label}</span>
          </Link>
        );
      })}
    </nav>
  );
}
