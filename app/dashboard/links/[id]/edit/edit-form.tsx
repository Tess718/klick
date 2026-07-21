"use client";

import { useTransition, useState } from "react";
import { updateLink } from "@/actions/link-actions";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Short Link (Slug)</label>
        <Input 
          type="text" 
          disabled 
          value={link.slug} 
        />
        <p className="text-xs text-muted-foreground">Slugs cannot be changed after creation.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Original URL</label>
        <Input 
          type="url" 
          name="originalUrl"
          defaultValue={link.originalUrl} 
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Expiration Date (Optional)</label>
        <Input 
          type="datetime-local" 
          name="expiresAt"
          defaultValue={link.expiresAt ? new Date(link.expiresAt).toISOString().slice(0, 16) : ""} 
        />
      </div>

      <div className="flex justify-end gap-3 pt-2">
        <Button variant="outline" type="button" render={<Link href="/dashboard" />}>
          Cancel
        </Button>
        <Button 
          type="submit" 
          disabled={isPending}
        >
          {isPending ? "Saving..." : "Save Changes"}
        </Button>
      </div>
    </form>
  );
}
