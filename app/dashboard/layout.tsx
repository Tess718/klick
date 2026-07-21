import { ReactNode } from "react";
import Link from "next/link";
import { ArrowRightOnRectangleIcon } from "@heroicons/react/24/outline";
import { auth, signOut } from "@/lib/auth";
import { Logo } from "@/components/logo";
import { redirect } from "next/navigation";

import { Suspense } from "react";

import { Loader2 } from "lucide-react";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div className="flex h-screen items-center justify-center bg-background"><Loader2 className="w-8 h-8 animate-spin text-muted-foreground" /></div>}>
      <DashboardContent>{children}</DashboardContent>
    </Suspense>
  );
}

import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { OnboardingModal } from "./onboarding-modal";

import { DashboardHeaderTitle } from "./header-title";

import { prisma } from "@/lib/prisma";

async function DashboardContent({ children }: { children: ReactNode }) {
  const session = await auth();
  
  if (!session?.user) {
    redirect("/login");
  }

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  const needsOnboarding = !dbUser?.name;

  return (
    <SidebarProvider>
      <AppSidebar email={session.user.email ?? ""} />
      <SidebarInset>
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <DashboardHeaderTitle />
          </div>
        </header>
        
        <div className="flex-1 overflow-auto p-4 md:p-8 bg-background text-foreground">
          {children}
        </div>
      </SidebarInset>
      <OnboardingModal isOpen={needsOnboarding} />
    </SidebarProvider>
  );
}
