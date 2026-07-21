"use client";

import { useTransition, useState } from "react";
import { createLink } from "@/actions/create-link";
import { useRouter } from "next/navigation";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

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
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      {error && <div className="p-3 bg-destructive/10 text-destructive rounded-lg text-sm">{error}</div>}
      
      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Original URL</label>
        <Input 
          type="url" 
          name="originalUrl"
          placeholder="https://example.com/very-long-url-path"
          required
        />
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Custom Slug (Optional)</label>
        <div className="flex items-center">
          <span className="inline-flex h-9 items-center rounded-l-md border border-r-0 border-input bg-muted px-3 text-sm text-muted-foreground">
            klick.vercel.app/
          </span>
          <Input 
            type="text" 
            name="customSlug"
            placeholder="my-campaign"
            pattern="^[a-zA-Z0-9_-]+$"
            minLength={3}
            maxLength={30}
            className="rounded-l-none"
          />
        </div>
        <p className="text-xs text-muted-foreground">Leave blank to auto-generate.</p>
      </div>

      <div className="space-y-2">
        <label className="text-sm font-medium leading-none">Expiration Date (Optional)</label>
        <Input 
          type="datetime-local" 
          name="expiresAt"
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
          {isPending ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Creating...</> : "Create Link"}
        </Button>
      </div>
    </form>
  );
}
