"use client";

import { motion } from "framer-motion";

export function LandingHowItWorks() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <>
      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={fadeUp}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-16 h-16 rounded-full bg-cobalt/10 text-cobalt flex items-center justify-center mb-6 text-xl font-bold">1</div>
        <h3 className="text-xl font-bold mb-3">Paste your link</h3>
        <p className="text-ink/60 leading-relaxed">Enter any long URL into our platform. We'll automatically generate a clean, branded short link.</p>
      </motion.div>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{...fadeUp, visible: {...fadeUp.visible, transition: { delay: 0.2 }}}}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-16 h-16 rounded-full bg-pink-eraser/20 text-pink-eraser flex items-center justify-center mb-6 text-xl font-bold">2</div>
        <h3 className="text-xl font-bold mb-3">Share it everywhere</h3>
        <p className="text-ink/60 leading-relaxed">Share your new short link on social media, in emails, or on printed materials (via QR codes).</p>
      </motion.div>

      <motion.div 
        initial="hidden" whileInView="visible" viewport={{ once: true }} variants={{...fadeUp, visible: {...fadeUp.visible, transition: { delay: 0.4 }}}}
        className="flex flex-col items-center text-center z-10"
      >
        <div className="w-16 h-16 rounded-full bg-ink/10 text-ink flex items-center justify-center mb-6 text-xl font-bold">3</div>
        <h3 className="text-xl font-bold mb-3">Track performance</h3>
        <p className="text-ink/60 leading-relaxed">Watch the data roll in. See detailed location, device, and referral stats in real-time.</p>
      </motion.div>
    </>
  );
}
