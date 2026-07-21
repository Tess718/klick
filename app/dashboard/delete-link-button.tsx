"use client";

import { TrashIcon, ExclamationTriangleIcon } from "@heroicons/react/24/outline";
import { useTransition, useState } from "react";
import { deleteLink } from "@/actions/link-actions";
import { useRouter } from "next/navigation";

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
    <>
      <button
        onClick={() => setShowConfirm(true)}
        disabled={isPending}
        className="inline-flex items-center justify-center p-2 text-zinc-400 hover:text-red-500 hover:bg-red-50 rounded-md transition-colors disabled:opacity-50"
        title="Delete link"
      >
        <TrashIcon className="w-4 h-4" />
      </button>

      {showConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-ink/40 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-xl overflow-hidden animate-in zoom-in-95 duration-200">
            <div className="p-6">
              <div className="flex flex-col items-center text-center mb-2">
                <div className="w-12 h-12 rounded-full bg-red-100 flex items-center justify-center mb-4">
                  <ExclamationTriangleIcon className="w-6 h-6 text-red-600" />
                </div>
                <h3 className="text-lg font-bold text-ink">Delete Link</h3>
                <p className="text-sm text-ink/60 mt-2 leading-relaxed">
                  Are you sure you want to delete this link? This action cannot be undone.
                </p>
              </div>

              {errorMsg && (
                <div className="mt-4 p-3 bg-red-50 text-red-600 text-sm rounded-lg border border-red-100">
                  {errorMsg}
                </div>
              )}
            </div>

            <div className="bg-zinc-50 px-6 py-4 flex items-center justify-end gap-3 border-t border-zinc-100">
              <button
                onClick={() => {
                  setShowConfirm(false);
                  setErrorMsg(null);
                }}
                disabled={isPending}
                className="px-4 py-2 text-sm font-medium text-ink/70 hover:text-ink hover:bg-zinc-200/50 rounded-lg transition-colors disabled:opacity-50"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isPending}
                className="px-4 py-2 text-sm font-bold text-white bg-red-500 hover:bg-red-600 rounded-lg transition-colors shadow-sm disabled:opacity-70 flex items-center gap-2"
              >
                {isPending && (
                  <svg className="animate-spin h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                  </svg>
                )}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
