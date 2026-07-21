"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { updateProfile } from "@/actions/settings";
import { useRouter } from "next/navigation";

import { SparklesIcon } from "@heroicons/react/24/outline";

export function OnboardingModal({ isOpen }: { isOpen: boolean }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);

    const result = await updateProfile(formData);
    if (result.error) {
      setError(result.error);
      setLoading(false);
    } else {
      router.refresh();
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={() => {}}>
      <DialogContent className="sm:max-w-md [&>button]:hidden p-0 overflow-hidden border-0">
        <div className="bg-cobalt p-8 flex flex-col items-center justify-center text-paper relative overflow-hidden">
          <div className="w-16 h-16 bg-pink-eraser/20 rounded-2xl flex items-center justify-center mb-6 relative z-10 shadow-sm border border-pink-eraser/30">
            <SparklesIcon className="w-8 h-8 text-pink-eraser" />
          </div>
          <DialogHeader className="relative z-10 text-center items-center">
            <DialogTitle className="text-2xl font-bold tracking-tight text-paper mb-2">
              Welcome to Klick!
            </DialogTitle>
            <DialogDescription className="text-paper/80 text-center max-w-[280px]">
              We've added new personalization features. To continue, what should
              we call you?
            </DialogDescription>
          </DialogHeader>

          {/* Background effects */}
          <div className="absolute top-0 left-0 right-0 bottom-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-pink-eraser/40 rounded-full blur-3xl" />
            <div className="absolute -bottom-10 -left-10 w-40 h-40 bg-pink-eraser/30 rounded-full blur-3xl" />
          </div>
        </div>

        <div className="p-8 bg-background">
          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div>
              <label className="block text-sm font-medium text-muted-foreground mb-2">
                Your Name
              </label>
              <Input
                type="text"
                name="name"
                placeholder="Jane Doe"
                required
                className="w-full px-4 py-6 text-lg bg-transparent border-input rounded-xl focus-visible:ring-pink-eraser"
              />
            </div>
            {error && (
              <p className="text-sm text-destructive font-medium text-center">
                {error}
              </p>
            )}
            <Button
              type="submit"
              disabled={loading}
              className="w-full py-6 text-base font-bold bg-pink-eraser hover:bg-pink-eraser/90 text-ink rounded-xl shadow-md transition-all hover:-translate-y-0.5"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Saving...
                </>
              ) : (
                "Save and Continue"
              )}
            </Button>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}
