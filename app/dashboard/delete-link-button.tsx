"use client";

import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTransition, useState } from "react";
import { deleteLink } from "@/actions/link-actions";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
export function DeleteLinkButton({ id }: { id: string }) {
  const [isPending, startTransition] = useTransition();
  const [showConfirm, setShowConfirm] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const router = useRouter();

  const handleDelete = () => {
    setErrorMsg(null);
    startTransition(async () => {
      const res = await deleteLink(id);
      if (res.error) {
        setErrorMsg(res.error);
      } else {
        setShowConfirm(false);
        router.refresh();
      }
    });
  };

  return (
    <Dialog open={showConfirm} onOpenChange={setShowConfirm}>
      <DialogTrigger render={
        <Button
          variant="ghost"
          size="icon"
          disabled={isPending}
          className="text-muted-foreground hover:text-destructive hover:bg-destructive/10"
          title="Delete link"
        >
          <TrashIcon className="w-4 h-4" />
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <div className="flex flex-col items-center text-center mb-2">
            <div className="w-12 h-12 rounded-full bg-destructive/10 flex items-center justify-center mb-4">
              <ExclamationTriangleIcon className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle>Delete Link</DialogTitle>
            <DialogDescription className="mt-2">
              Are you sure you want to delete this link? This action cannot be undone.
            </DialogDescription>
          </div>
        </DialogHeader>

        {errorMsg && (
          <div className="p-3 bg-destructive/10 text-destructive text-sm rounded-lg border border-destructive/20 mt-4">
            {errorMsg}
          </div>
        )}

        <DialogFooter className="sm:justify-end gap-2 mt-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => {
              setShowConfirm(false);
              setErrorMsg(null);
            }}
            disabled={isPending}
          >
            Cancel
          </Button>
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={isPending}
            className="flex items-center gap-2"
          >
            {isPending && (
              <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
              </svg>
            )}
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
