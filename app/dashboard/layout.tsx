import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";
import { SidebarNav } from "./sidebar-nav";
import { MobileSidebar } from "./mobile-sidebar";

import { Suspense } from "react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-zinc-100 text-zinc-500">Loading...</div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

async function DashboardContent({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  return (
    <div className="flex h-screen bg-paper font-sans text-ink">
      {/* Sidebar Navigation */}
      <aside className="w-64 bg-cobalt text-paper flex flex-col hidden md:flex border-r border-cobalt">
        <div className="h-16 flex items-center px-6 border-b border-paper/10">
          <Link href="/" className="inline-block">
             <Logo className="h-6 w-auto filter brightness-0 invert" />
          </Link>
        </div>
        
        <SidebarNav />

        <div className="p-4 border-t border-paper/10">
          <div className="mb-4 px-2">
            <div className="text-sm text-paper/70 truncate">{session.user.email}</div>
          </div>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <button className="flex w-full items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-paper/10 hover:text-paper transition-colors text-paper/70">
              <ArrowRightOnRectangleIcon className="w-5 h-5" />
              <span className="font-medium">Log out</span>
            </button>
          </form>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 flex flex-col h-screen overflow-hidden">
        {/* Mobile Header */}
        <header className="h-16 bg-white border-b border-zinc-200 flex items-center px-4 md:hidden">
          <MobileSidebar email={session.user.email ?? ""} />
        </header>

        <div className="flex-1 overflow-auto p-4 md:p-8 bg-paper">
          {children}
        </div>
      </main>
    </div>
  );
}
