"use client";

import { useTransition, useState } from "react";
import { signup } from "@/actions/signup";
import Link from "next/link";
import { ArrowRightIcon, EyeIcon, EyeSlashIcon, ChartBarSquareIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components/logo";

export default function SignupPage() {
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    startTransition(async () => {
      const res = await signup(formData);
      if (res?.error) {
        setError(res.error);
      }
    });
  };

  return (
    <div className="w-full min-h-screen bg-paper flex flex-col md:flex-row">
      {/* Left Panel */}
      <div className="hidden md:flex md:w-[45%] bg-cobalt p-12 flex-col justify-between relative overflow-hidden text-paper">
        <div className="z-10 relative">
          <Link href="/" className="inline-block">
            <Logo className="h-8 w-auto filter brightness-0 invert" />
          </Link>
        </div>
        <div className="z-10 relative mt-auto mb-16">
          <h2 className="text-4xl font-bold tracking-tight mb-4 leading-tight">
            Create short,
            <br />
            memorable links.
          </h2>
          <p className="text-paper/70 text-lg">
            Track clicks globally with our edge-optimized network.
          </p>
        </div>

        {/* Abstract glowing effect */}
        <div className="absolute bottom-0 left-0 right-0 h-64 bg-gradient-to-t from-pink-eraser/40 to-transparent flex items-end justify-center gap-4 px-8 opacity-80 pointer-events-none">
          <div className="w-16 h-40 bg-pink-eraser/80 blur-3xl transform translate-y-10" />
          <div className="w-24 h-64 bg-pink-eraser/60 blur-3xl transform translate-y-10" />
          <div className="w-16 h-48 bg-pink-eraser/90 blur-3xl transform translate-y-10" />
        </div>
      </div>

      {/* Right Panel - Form */}
      <div className="w-full md:w-[55%] p-8 sm:p-12 md:p-16 flex flex-col justify-center">
        <div className="mb-10 text-left">
          <div className="w-12 h-12 bg-pink-eraser/20 text-pink-eraser rounded-2xl flex items-center justify-center mb-6 shadow-sm">
            <ChartBarSquareIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold tracking-tight mb-2">
            Get Started
          </h2>
          <p className="text-sm text-ink/60 font-medium">
            Welcome to Klick — Let's get started
          </p>
        </div>

        <div className="w-full h-px bg-ink/5 mb-8" />

        <form className="space-y-5" onSubmit={handleSubmit}>
          {error && (
            <div className="p-3 bg-red-50 text-red-600 rounded-lg text-sm text-center">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Your email
            </label>
            <input
              name="email"
              type="email"
              placeholder="hi@example.com"
              required
              className="w-full px-4 py-3 border border-ink/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-eraser focus:border-transparent transition-all placeholder:text-ink/30"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-ink/70 mb-2">
              Create new password
            </label>
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                placeholder="••••••••"
                required
                minLength={8}
                className="w-full px-4 py-3 pr-12 border border-ink/20 rounded-xl bg-transparent focus:outline-none focus:ring-2 focus:ring-pink-eraser focus:border-transparent transition-all placeholder:text-ink/30"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-4 flex items-center text-ink/40 hover:text-ink/80 focus:outline-none transition-colors"
              >
                {showPassword ? (
                  <EyeSlashIcon className="w-5 h-5" />
                ) : (
                  <EyeIcon className="w-5 h-5" />
                )}
              </button>
            </div>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isPending}
              className="w-full flex justify-center items-center gap-2 py-4 px-4 border border-transparent rounded-xl shadow-md text-base font-bold text-ink bg-pink-eraser hover:bg-pink-eraser/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-pink-eraser transition-all disabled:opacity-70 transform hover:-translate-y-0.5"
            >
              {isPending ? "Creating account..." : "Create new account"}
            </button>
          </div>

          <div className="text-center pt-4">
            <span className="text-sm text-ink/60">Already have account? </span>
            <Link
              href="/login"
              className="text-sm font-bold text-ink hover:underline underline-offset-4"
            >
              Login
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
}
