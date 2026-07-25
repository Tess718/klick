import { ReactNode, Suspense, cache } from "react";
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { SidebarProvider, SidebarTrigger, SidebarInset } from "@/components/ui/sidebar";
import { AppSidebar } from "./app-sidebar";
import { OnboardingModal } from "./onboarding-modal";
import { DashboardHeaderTitle } from "./header-title";

const getDashboardUserData = cache(async () => {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true },
  });

  return {
    email: session.user.email ?? "",
    needsOnboarding: !dbUser?.name,
  };
});

async function SidebarWrapper() {
  const userData = await getDashboardUserData();
  return <AppSidebar email={userData?.email ?? ""} />;
}

async function OnboardingCheck() {
  const userData = await getDashboardUserData();
  if (!userData) return null;

  return <OnboardingModal isOpen={userData.needsOnboarding} />;
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={<AppSidebar email="" />}>
        <SidebarWrapper />
      </Suspense>
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
      <Suspense fallback={null}>
        <OnboardingCheck />
      </Suspense>
    </SidebarProvider>
  );
}



