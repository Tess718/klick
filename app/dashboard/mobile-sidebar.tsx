"use client";

import { useState } from "react";
import { Bars3Icon, XMarkIcon, ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { SidebarNav } from "./sidebar-nav";
import { Logo } from "@/components/logo";
import Link from "next/link";
import { logoutAction } from "@/actions/logout";

export function MobileSidebar({ email }: { email: string }) {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <>
      <div className="flex items-center gap-3">
        <button onClick={() => setIsOpen(true)} className="p-1 -ml-1 text-zinc-500 hover:text-zinc-900 focus:outline-none">
          <Bars3Icon className="w-6 h-6" />
        </button>
        <Link href="/" className="inline-block">
          <Logo className="h-6 w-auto" />
        </Link>
      </div>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex md:hidden">
          {/* Backdrop */}
          <div 
            className="fixed inset-0 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200" 
            onClick={() => setIsOpen(false)} 
          />
          
          {/* Sidebar */}
          <div className="relative flex flex-col w-64 max-w-sm h-full bg-cobalt text-paper shadow-2xl animate-in slide-in-from-left duration-200">
            <div className="h-16 flex items-center justify-between px-6 border-b border-paper/10">
              <Link href="/" onClick={() => setIsOpen(false)}>
                <Logo className="h-6 w-auto filter brightness-0 invert" />
              </Link>
              <button onClick={() => setIsOpen(false)} className="text-paper/50 hover:text-paper focus:outline-none">
                <XMarkIcon className="w-6 h-6" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto" onClick={() => setIsOpen(false)}>
              <SidebarNav />
            </div>

            <div className="p-4 border-t border-paper/10">
              <div className="mb-4 px-2">
                <div className="text-sm text-paper/70 truncate">{email}</div>
              </div>
              <form action={logoutAction}>
                <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-paper/10 hover:text-paper transition-colors text-paper/70">
                  <ArrowRightOnRectangleIcon className="w-5 h-5" />
                  <span className="font-medium">Log out</span>
                </button>
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
