import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { CreateLinkForm } from "./create-form";

export default async function NewLinkPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  return (
    <div className="max-w-2xl mx-auto w-full pt-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Create New Link</h1>
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <CreateLinkForm />
      </div>
    </div>
  );
}
