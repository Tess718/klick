"use client";

import { useEffect } from "react";
import Link from "next/link";
import { Logo } from "@/components/logo";
import { XCircleIcon, ArrowPathIcon } from "@heroicons/react/24/outline";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Log the error to an error reporting service if needed
    console.error(error);
  }, [error]);

  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-block">
          <Logo className="h-8 w-auto" />
        </Link>
      </div>
      
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-red-100 text-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <XCircleIcon className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-ink">Something went wrong</h1>
        <p className="text-ink/60 mb-8 leading-relaxed">
          We encountered an unexpected error processing your request. Please try again.
        </p>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <button 
            onClick={() => reset()}
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-zinc-100 text-ink rounded-xl font-bold hover:bg-zinc-200 transition-all shadow-sm"
          >
            <ArrowPathIcon className="w-5 h-5" />
            Try Again
          </button>
          
          <Link 
            href="/"
            className="flex-1 flex items-center justify-center gap-2 py-3 px-4 bg-cobalt text-paper rounded-xl font-bold hover:bg-cobalt/90 transition-all shadow-md transform hover:-translate-y-0.5"
          >
            Go Home
          </Link>
        </div>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-red-100/30 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cobalt/5 blur-3xl" />
      </div>
    </div>
  );
}
