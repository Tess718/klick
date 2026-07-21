"use client";

import Link from "next/link";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function LandingHero() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <>
      <motion.h1 
        initial="hidden"
        animate="visible"
        variants={fadeUp}
        className="text-6xl md:text-[5.5rem] font-bold tracking-tighter mb-6 max-w-4xl text-cobalt leading-[1.1]"
      >
        Short links. Deep analytics.
      </motion.h1>
      <motion.p 
        initial="hidden"
        animate="visible"
        variants={{...fadeUp, visible: {...fadeUp.visible, transition: { delay: 0.1, duration: 0.6 }}}}
        className="text-lg md:text-xl text-ink/70 mb-10 max-w-3xl leading-relaxed"
      >
        Create short, memorable links. Track clicks globally. See device,
        browser, and location data in real time with our edge-optimized
        caching architecture.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{...fadeUp, visible: {...fadeUp.visible, transition: { delay: 0.2, duration: 0.6 }}}}
      >
        <Link
          href="/signup"
          className="inline-flex items-center justify-center gap-2 bg-ink text-paper px-8 py-4 rounded-full font-bold hover:bg-ink/90 transition-colors shadow-xl hover:-translate-y-0.5 transform"
        >
          Get Started <ArrowRightIcon className="w-5 h-5" />
        </Link>
      </motion.div>
    </>
  );
}
