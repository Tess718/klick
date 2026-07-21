import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { redirect, notFound } from "next/navigation";
import { EditLinkForm } from "./edit-form";

export default async function EditLinkPage({ params }: { params: Promise<{ id: string }> }) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/login");
  }

  const { id } = await params;
  const link = await prisma.link.findUnique({
    where: { id, userId: session.user.id },
  });

  if (!link) {
    notFound();
  }

  return (
    <div className="max-w-2xl mx-auto w-full pt-10">
      <h1 className="text-2xl font-bold tracking-tight mb-6">Edit Link</h1>
      <div className="bg-white border border-zinc-200 rounded-2xl p-6">
        <EditLinkForm link={link as any} />
      </div>
    </div>
  );
}
