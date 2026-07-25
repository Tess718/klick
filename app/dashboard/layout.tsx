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

async function UserEmailFooter() {
  const userData = await getDashboardUserData();
  return <span>{userData?.email ?? ""}</span>;
}

async function OnboardingCheck() {
  const userData = await getDashboardUserData();
  if (!userData) return null;

  return <OnboardingModal isOpen={userData.needsOnboarding} />;
}

function UserEmailSkeleton() {
  return <div className="h-3 w-28 bg-sidebar-foreground/20 rounded animate-pulse" />;
}

function SidebarSkeleton() {
  return (
    <div className="w-[16rem] hidden md:flex h-svh flex-col bg-sidebar border-r border-sidebar-border p-4 shrink-0">
      <div className="h-6 w-24 bg-sidebar-accent rounded animate-pulse mb-8" />
      <div className="space-y-3 flex-1">
        <div className="h-8 w-full bg-sidebar-accent rounded animate-pulse" />
        <div className="h-8 w-full bg-sidebar-accent rounded animate-pulse" />
        <div className="h-8 w-full bg-sidebar-accent rounded animate-pulse" />
      </div>
      <div className="h-4 w-32 bg-sidebar-accent rounded animate-pulse mb-2" />
    </div>
  );
}

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <Suspense fallback={<SidebarSkeleton />}>
        <AppSidebar
          userEmail={
            <Suspense fallback={<UserEmailSkeleton />}>
              <UserEmailFooter />
            </Suspense>
          }
        />
      </Suspense>
      <SidebarInset>
        {/* Mobile Header */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b border-border/50 px-4">
          <SidebarTrigger />
          <div className="flex flex-1 items-center justify-between">
            <Suspense fallback={<span className="font-semibold text-sm">Dashboard</span>}>
              <DashboardHeaderTitle />
            </Suspense>
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



