"use client";

import { ChartBarIcon, GlobeAltIcon, ClockIcon, BoltIcon } from "@heroicons/react/24/outline";
import { motion } from "framer-motion";

export function LandingFeatures() {
  const fadeUp = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" as const } }
  };

  return (
    <>
      {/* Feature 1: Global Tracking */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="flex flex-col md:flex-row items-center gap-12 lg:gap-32 text-left"
      >
        <div className="flex-1">
          <div className="p-3 bg-cobalt/10 text-cobalt rounded-xl inline-block mb-4">
            <GlobeAltIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Global Tracking</h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            See exactly where your clicks are coming from on an interactive world map. 
            Track real-time data from every continent and optimize your campaigns based on true geographic reach.
          </p>
        </div>
        <div className="flex-1 w-full relative flex items-center justify-center">
          {/* Abstract blurred background grounding */}
          <div className="absolute inset-0 bg-gradient-to-br from-cobalt/20 to-pink-eraser/20 rounded-[3rem] blur-2xl opacity-60 transform scale-90" />
          
          {/* Faux UI Panel */}
          <div className="flex flex-col w-full p-6 bg-paper rounded-3xl shadow-2xl shadow-ink/5 border border-ink/10 z-10">
            {/* Header */}
            <div className="flex items-center justify-between mb-4 pb-4 border-b border-ink/5">
              <div className="text-sm font-semibold text-ink">Live Traffic Sources</div>
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-lime-500 animate-pulse shadow-[0_0_8px_rgba(132,204,22,0.6)]" />
                <div className="text-xs font-bold text-ink/50 uppercase tracking-wider">Live</div>
              </div>
            </div>

            {/* Data List */}
            <div className="flex flex-col gap-3">
              {[ 
                { country: "United States", code: "US", clicks: "12,450", percent: 85, color: "bg-cobalt" },
                { country: "United Kingdom", code: "UK", clicks: "8,240", percent: 65, color: "bg-pink-eraser" },
                { country: "Germany", code: "DE", clicks: "4,120", percent: 45, color: "bg-ink" },
                { country: "Japan", code: "JP", clicks: "2,890", percent: 25, color: "bg-cobalt" },
              ].map((row, i) => (
                <motion.div 
                  key={row.code}
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: 0.2 + (i * 0.1) }}
                  className="flex items-center justify-between p-3 bg-white hover:bg-zinc-50 rounded-2xl border border-ink/5 transition-colors"
                >
                  <div className="flex items-center gap-3 w-1/2">
                    <div className="w-8 h-8 rounded-full bg-ink/5 text-ink flex items-center justify-center font-bold text-xs">
                      {row.code}
                    </div>
                    <div className="text-sm font-semibold text-ink truncate">{row.country}</div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-1.5 w-1/2 pl-4">
                    <div className="text-xs font-bold text-ink">{row.clicks} clicks</div>
                    <div className="w-full bg-ink/5 rounded-full h-1.5 overflow-hidden">
                      <motion.div 
                        initial={{ width: 0 }}
                        whileInView={{ width: `${row.percent}%` }}
                        viewport={{ once: true }}
                        transition={{ delay: 0.5 + (i * 0.1), duration: 1, type: "spring" }}
                        className={`h-full rounded-full ${row.color}`}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature 2: Device Analytics (Donut Pattern) */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-32 text-left"
      >
        <div className="flex-1">
          <div className="p-3 bg-pink-eraser/20 text-pink-eraser rounded-xl inline-block mb-4">
            <ChartBarIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Device Analytics</h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            Get a detailed breakdown of the devices, browsers, and operating systems your audience uses.
            Ensure your content is optimized for the platforms your users actually prefer.
          </p>
        </div>
        <div className="flex-1 w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cobalt/20 to-pink-eraser/20 rounded-[3rem] blur-2xl opacity-60 transform scale-90" />
          
          <div className="flex flex-col w-full h-full p-6 bg-paper rounded-3xl shadow-2xl shadow-ink/5 border border-ink/10 z-10 gap-6">
            
            <div className="flex flex-col md:flex-row items-center justify-between gap-6 w-full">
              <div className="relative w-40 h-40 flex items-center justify-center">
                {/* SVG Donut Chart */}
                <svg viewBox="0 0 100 100" className="w-full h-full transform -rotate-90">
                  {/* Background Track */}
                  <circle cx="50" cy="50" r="40" fill="transparent" stroke="#282828" strokeWidth="12" strokeOpacity="0.05" />
                  
                  {/* Mobile Segment - Cobalt (64%) */}
                  <motion.circle 
                    cx="50" cy="50" r="40" fill="transparent" stroke="#193497" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.64) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                  
                  {/* Desktop Segment - Pink Eraser (28%) */}
                  <motion.circle 
                    cx="50" cy="50" r="40" fill="transparent" stroke="#EDA398" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.28) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 1 }}
                    style={{ transformOrigin: "center", transform: `rotate(${360 * 0.64}deg)` }}
                  />

                  {/* Tablet Segment - Ink (8%) */}
                  <motion.circle 
                    cx="50" cy="50" r="40" fill="transparent" stroke="#282828" strokeWidth="12"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    initial={{ strokeDashoffset: 2 * Math.PI * 40 }}
                    whileInView={{ strokeDashoffset: 2 * Math.PI * 40 * (1 - 0.08) }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.5, ease: "easeOut", delay: 2 }}
                    style={{ transformOrigin: "center", transform: `rotate(${360 * (0.64 + 0.28)}deg)` }}
                  />
                </svg>

                {/* Center Content */}
                <motion.div 
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: 2.5 }}
                  className="absolute inset-0 flex flex-col items-center justify-center text-ink font-bold"
                >
                  <span className="text-2xl">64%</span>
                  <span className="text-[10px] text-ink/60 uppercase">Mobile</span>
                </motion.div>
              </div>

              {/* Legend List */}
              <div className="flex flex-col gap-4 flex-1">
                {[
                  { label: "Mobile", percent: 64, color: "bg-cobalt" },
                  { label: "Desktop", percent: 28, color: "bg-pink-eraser" },
                  { label: "Tablet", percent: 8, color: "bg-ink" },
                ].map((item, i) => (
                  <motion.div 
                    key={item.label}
                    initial={{ opacity: 0, x: 20 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 1 + (i * 0.2) }}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-sm ${item.color}`}></div>
                      <div className="text-xs font-semibold text-ink">{item.label}</div>
                    </div>
                    <div className="text-xs font-bold text-ink">{item.percent}%</div>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Top OS Row */}
            <div className="w-full pt-6 border-t border-ink/10 flex flex-col gap-3 mt-auto">
              <div className="text-xs font-bold text-ink/50 uppercase tracking-wider">Top Operating Systems</div>
              <div className="flex gap-2">
                <div className="flex-1 bg-ink/5 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-ink">42%</span>
                  <span className="text-[10px] font-bold uppercase text-ink/50 mt-1">iOS</span>
                </div>
                <div className="flex-1 bg-ink/5 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-ink">38%</span>
                  <span className="text-[10px] font-bold uppercase text-ink/50 mt-1">Android</span>
                </div>
                <div className="flex-1 bg-ink/5 rounded-xl p-3 flex flex-col items-center justify-center">
                  <span className="text-lg font-bold text-ink">15%</span>
                  <span className="text-[10px] font-bold uppercase text-ink/50 mt-1">macOS</span>
                </div>
              </div>
            </div>

            {/* Floating Tooltips */}
            <motion.div 
              animate={{ y: [0, -10, 0] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="absolute -top-6 -right-6 bg-white/90 backdrop-blur-md border border-ink/10 px-4 py-2 rounded-xl shadow-2xl text-xs font-bold text-ink z-20 pointer-events-none"
            >
              <div className="flex items-center gap-2">
                <GlobeAltIcon className="w-4 h-4 text-cobalt" />
                Chrome: 45%
              </div>
            </motion.div>

          </div>
        </div>
      </motion.div>

      {/* Feature 3: Link Expiration */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="flex flex-col md:flex-row items-center gap-12 lg:gap-32 text-left"
      >
        <div className="flex-1">
          <div className="p-3 bg-ink/10 text-ink rounded-xl inline-block mb-4">
            <ClockIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Link Expiration</h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            Set custom expiration dates so your links automatically expire when a campaign ends. 
            Perfect for limited-time offers, flash sales, and tight marketing schedules.
          </p>
        </div>
        <div className="flex-1 w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-br from-amber-100/50 to-pink-100/50 rounded-[3rem] blur-2xl opacity-60 transform scale-90" />
          
          <div className="w-full bg-paper p-6 rounded-3xl shadow-2xl shadow-ink/5 border border-ink/10 z-10 flex flex-col gap-6">
            
            <div className="flex justify-between items-start">
              <div>
                <div className="text-sm font-bold text-ink mb-1">Link Expiration</div>
                <div className="text-xs text-ink/50">Automatically disable after date</div>
              </div>
              <div className="w-10 h-6 bg-lime-500 rounded-full relative shadow-inner">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="p-4 bg-zinc-50 border border-ink/5 rounded-2xl">
              <div className="flex justify-between items-center mb-4">
                 <span className="text-xs font-semibold text-ink">Expiration Date</span>
                 <span className="px-2 py-1 bg-amber-100 text-amber-700 text-[10px] font-bold rounded uppercase tracking-wider">
                   Expires Soon
                 </span>
              </div>
              <div className="w-full p-3 bg-white border border-ink/10 rounded-xl flex items-center justify-between text-sm">
                <span className="text-ink font-medium">Oct 24, 2026</span>
                <ClockIcon className="w-4 h-4 text-ink/40" />
              </div>
            </div>

            <div className="flex gap-3 justify-center pt-2">
              <div className="flex flex-col items-center p-3 bg-pink-eraser/10 rounded-xl w-16 border border-pink-eraser/20">
                <span className="text-2xl font-bold text-pink-eraser">12</span>
                <span className="text-[10px] text-pink-eraser/70 font-bold uppercase mt-1">Hrs</span>
              </div>
              <div className="flex flex-col items-center p-3 bg-cobalt/10 rounded-xl w-16 border border-cobalt/20">
                <span className="text-2xl font-bold text-cobalt">44</span>
                <span className="text-[10px] text-cobalt/70 font-bold uppercase mt-1">Mins</span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Feature 4: Edge Caching */}
      <motion.div 
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        variants={fadeUp}
        className="flex flex-col md:flex-row-reverse items-center gap-12 lg:gap-32 text-left"
      >
        <div className="flex-1">
          <div className="p-3 bg-cobalt/10 text-cobalt rounded-xl inline-block mb-4">
            <BoltIcon className="w-6 h-6" />
          </div>
          <h2 className="text-3xl font-bold mb-4 tracking-tight">Edge Caching</h2>
          <p className="text-lg text-ink/70 leading-relaxed">
            Sub-millisecond resolution with our global edge network. 
            Your short links load instantly across the globe, ensuring you never lose a click to high latency.
          </p>
        </div>
        <div className="flex-1 w-full relative flex items-center justify-center">
          <div className="absolute inset-0 bg-gradient-to-tr from-cobalt/20 to-lime-200/20 rounded-[3rem] blur-2xl opacity-60 transform scale-90" />
          
          <div className="w-full bg-slate-900 p-8 rounded-3xl shadow-2xl shadow-blue-900/20 border border-slate-800 z-10 flex flex-col">
            <div className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-8 text-center">Network Routing Status</div>
            
            <div className="relative w-full flex items-center justify-between mb-8">
              <div className="flex flex-col items-center gap-2 z-10">
                <div className="w-14 h-14 rounded-2xl bg-slate-800 text-slate-300 flex items-center justify-center border border-slate-700 shadow-xl">
                  <GlobeAltIcon className="w-6 h-6" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase">User</span>
              </div>

              {/* Animated Flow Track */}
              <div className="absolute left-14 right-14 h-[2px] bg-slate-800 top-7 -translate-y-1/2 overflow-hidden">
                 <motion.div 
                   animate={{ x: ["-100%", "200%"] }}
                   transition={{ repeat: Infinity, duration: 1.5, ease: "linear" }}
                   className="absolute left-0 top-0 h-full w-1/3 bg-lime-400 shadow-[0_0_10px_#A3E635]"
                 />
              </div>

              <motion.div 
                whileHover={{ scale: 1.05 }}
                className="flex flex-col items-center gap-2 z-10 cursor-pointer relative"
              >
                <div className="w-14 h-14 rounded-2xl bg-cobalt text-white flex items-center justify-center shadow-[0_0_20px_rgba(25,52,151,0.5)] border border-blue-500">
                  <BoltIcon className="w-6 h-6 fill-current text-white" />
                </div>
                <span className="text-[10px] font-bold text-slate-400 uppercase text-center">Edge Node</span>
                
                {/* Badge */}
                <motion.div 
                  animate={{ scale: [1, 1.1, 1] }}
                  transition={{ repeat: Infinity, duration: 2 }}
                  className="absolute -top-3 -right-6 px-2 py-0.5 bg-lime-500/20 text-lime-400 border border-lime-500/30 font-bold text-[10px] rounded uppercase tracking-wider"
                >
                  &lt; 1ms
                </motion.div>
              </motion.div>
            </div>

            {/* Global Latency Table */}
            <div className="mt-auto pt-6 border-t border-slate-800/80 w-full flex flex-col gap-3">
              <div className="flex justify-between items-center text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2">
                <span>Region</span>
                <span>Latency</span>
              </div>
              <div className="flex flex-col gap-2">
                {[
                  { region: "US East (N. Virginia)", time: "0.8ms" },
                  { region: "EU West (London)", time: "1.2ms" },
                  { region: "AP East (Tokyo)", time: "0.9ms" }
                ].map((row, i) => (
                  <motion.div 
                    key={row.region}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 + (i * 0.1) }}
                    className="flex justify-between items-center bg-slate-800/50 p-2.5 rounded-lg border border-slate-700/50 hover:bg-slate-800 transition-colors"
                  >
                    <span className="text-xs text-slate-300 font-medium">{row.region}</span>
                    <span className="text-xs text-lime-400 font-bold">{row.time}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </>
  );
}
