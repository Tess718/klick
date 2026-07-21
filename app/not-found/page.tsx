import Link from "next/link";
import { Logo } from "@/components/logo";
import { ExclamationTriangleIcon, ArrowLeftIcon } from "@heroicons/react/24/outline";

export default function LinkNotFoundPage() {
  return (
    <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-6 text-center">
      <div className="absolute top-8 left-8">
        <Link href="/" className="inline-block">
          <Logo className="h-8 w-auto" />
        </Link>
      </div>
      
      <div className="max-w-md w-full bg-white p-10 rounded-3xl shadow-sm border border-zinc-100 flex flex-col items-center">
        <div className="w-16 h-16 bg-pink-eraser/20 text-pink-eraser rounded-2xl flex items-center justify-center mb-6 shadow-sm">
          <ExclamationTriangleIcon className="w-8 h-8" />
        </div>
        
        <h1 className="text-3xl font-bold tracking-tight mb-3 text-ink">Page not found</h1>
        <p className="text-ink/60 mb-8 leading-relaxed">
          This page doesn't exist or may have been deleted. Please check the URL and try again.
        </p>
        
        <Link 
          href="/"
          className="w-full flex items-center justify-center gap-2 py-4 px-4 bg-cobalt text-paper rounded-xl font-bold hover:bg-cobalt/90 transition-all shadow-md transform hover:-translate-y-0.5"
        >
          <ArrowLeftIcon className="w-5 h-5" />
          Back to Home
        </Link>
      </div>
      
      {/* Background decoration */}
      <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none -z-10">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-pink-eraser/10 blur-3xl" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-cobalt/5 blur-3xl" />
      </div>
    </div>
  );
}
