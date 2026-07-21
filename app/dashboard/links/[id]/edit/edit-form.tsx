"use client";

import { useTransition, useState } from "react";
import { updateLink } from "@/actions/link-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function EditLinkForm({ link }: { link: { id: string, slug: string, originalUrl: string, expiresAt: string | null } }) {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const originalUrl = formData.get("originalUrl") as string;
    const expiresAtRaw = formData.get("expiresAt") as string;
    const expiresAt = expiresAtRaw ? new Date(expiresAtRaw) : null;

    startTransition(async () => {
      const res = await updateLink(link.id, { originalUrl, expiresAt });
      if (res.error) {
        setError(res.error);
      } else {
        router.push("/dashboard");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      {error && <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm">{error}</div>}
      
      <div>
        <label className="block text-sm font-medium mb-1">Short Link (Slug)</label>
        <input 
          type="text" 
          disabled 
          value={link.slug} 
          className="w-full p-2 border border-zinc-200 rounded-md bg-zinc-50 text-zinc-500" 
        />
        <p className="text-xs text-zinc-500 mt-1">Slugs cannot be changed after creation.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Original URL</label>
        <input 
          type="url" 
          name="originalUrl"
          defaultValue={link.originalUrl} 
          required
          className="w-full p-2 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
        <input 
          type="datetime-local" 
          name="expiresAt"
          defaultValue={link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ""} 
          className="w-full p-2 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" 
        />
      </div>

      <div className="flex justify-end gap-3 mt-4">
        <Link href="/dashboard" className="px-4 py-2 border border-zinc-200 rounded-md hover:bg-zinc-50:bg-zinc-800 transition-colors">
          Cancel
        </Link>
        <button 
          type="submit" 
          disabled={isPending}
          className="px-4 py-2 bg-zinc-900 text-white rounded-md hover:bg-zinc-800:bg-zinc-100 transition-colors disabled:opacity-70"
        >
          {isPending ? "Saving..." : "Save Changes"}
        </button>
      </div>
    </form>
  );
}
