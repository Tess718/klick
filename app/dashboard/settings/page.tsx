import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { SettingsForms } from "./forms";

export default async function SettingsPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="flex flex-col gap-8 max-w-2xl mx-auto w-full pb-10 pt-4">
      <SettingsForms email={session.user.email ?? ""} name={session.user.name ?? null} />
    </div>
  );
}
