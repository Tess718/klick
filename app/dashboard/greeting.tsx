"use client";

import { useEffect, useState } from "react";

import { DotLottieReact } from '@lottiefiles/dotlottie-react';

const morningGreetings = [
  "Top of the morning to ya",
  "Rise and shine",
  "Wakey wakey, eggs and bakey",
  "Morning, sunshine",
  "Look who's up early",
  "Ready to crush it today",
];

const afternoonGreetings = [
  "Good afternoon, superstar",
  "Hope you're having a swell afternoon",
  "Halfway there",
  "Afternoon delight",
  "Stay hydrated",
  "Keep up the great work",
];

const eveningGreetings = [
  "Good evening, night owl",
  "Burning the midnight oil",
  "Time to wind down",
  "Evening, legend",
  "Still grinding",
  "Have a wonderful evening",
];

export function Greeting({ name }: { name: string | null }) {
  const [greeting, setGreeting] = useState("Welcome back");
  
  useEffect(() => {
    const hour = new Date().getHours();
    let selectedGreeting = "";
    if (hour < 12) {
      selectedGreeting = morningGreetings[Math.floor(Math.random() * morningGreetings.length)];
    } else if (hour < 18) {
      selectedGreeting = afternoonGreetings[Math.floor(Math.random() * afternoonGreetings.length)];
    } else {
      selectedGreeting = eveningGreetings[Math.floor(Math.random() * eveningGreetings.length)];
    }
    setGreeting(selectedGreeting);
  }, []);

  if (!name) return null; // Fallback, though OnboardingModal should prevent this.

  return (
    <div className="bg-cobalt p-8 rounded-2xl border border-cobalt/20 flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 shadow-sm relative overflow-hidden gap-4">
      <div className="relative z-10 flex-1">
        <h2 className="text-2xl font-bold tracking-tight text-paper flex items-center gap-3">
          {greeting}, {name}
          
          {/* Mobile icon (inline) */}
          <div className="w-12 h-12 rounded-full bg-paper/10 flex items-center justify-center shrink-0 sm:hidden">
            <div className="w-8 h-8 brightness-0 invert flex items-center justify-center">
              <DotLottieReact
                src="https://lottie.host/a5064009-cdff-47de-a1be-e137161750f6/fINwph9Urh.lottie"
                loop
                autoplay
              />
            </div>
          </div>
        </h2>
        <p className="text-paper/80 mt-1">Here's what's happening with your links today.</p>
      </div>

      {/* Desktop icon (right-aligned) */}
      <div className="relative z-10 hidden sm:flex w-16 h-16 rounded-full bg-paper/10 items-center justify-center shrink-0">
        <div className="w-10 h-10 brightness-0 invert flex items-center justify-center">
          <DotLottieReact
            src="https://lottie.host/a5064009-cdff-47de-a1be-e137161750f6/fINwph9Urh.lottie"
            loop
            autoplay
          />
        </div>
      </div>
      
      {/* Subtle background glow effect */}
      <div className="absolute top-0 right-0 bottom-0 w-64 bg-gradient-to-l from-pink-eraser/20 to-transparent pointer-events-none" />
    </div>
  );
}
