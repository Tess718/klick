"use client";

import { useTransition, useState } from "react";
import { createLink } from "@/actions/create-link";
import { useRouter } from "next/navigation";
import Link from "next/link";

export function CreateLinkForm() {
  const [isPending, startTransition] = useTransition();
  const router = useRouter();
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await createLink(formData);
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
        <label className="block text-sm font-medium mb-1">Original URL</label>
        <input 
          type="url" 
          name="originalUrl"
          placeholder="https://example.com/very-long-url-path"
          required
          className="w-full p-2 border border-zinc-200 rounded-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" 
        />
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Custom Slug (Optional)</label>
        <div className="flex items-center">
          <span className="p-2 border border-r-0 border-zinc-200 rounded-l-md bg-zinc-50 text-zinc-500">klick.vercel.app/</span>
          <input 
            type="text" 
            name="customSlug"
            placeholder="my-campaign"
            pattern="^[a-zA-Z0-9_-]+$"
            minLength={3}
            maxLength={30}
            className="w-full p-2 border border-zinc-200 rounded-r-md bg-white focus:outline-none focus:ring-2 focus:ring-zinc-900" 
          />
        </div>
        <p className="text-xs text-zinc-500 mt-1">Leave blank to auto-generate.</p>
      </div>

      <div>
        <label className="block text-sm font-medium mb-1">Expiration Date (Optional)</label>
        <input 
          type="datetime-local" 
          name="expiresAt"
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
          {isPending ? "Creating..." : "Create Link"}
        </button>
      </div>
    </form>
  );
}
