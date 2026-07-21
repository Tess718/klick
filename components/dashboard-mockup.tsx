"use client";

import { motion } from "framer-motion";
import { Squares2X2Icon, LinkIcon, Cog6ToothIcon, CursorArrowRaysIcon, GlobeAltIcon, ChartBarIcon } from "@heroicons/react/24/outline";
import { Logo } from "@/components/logo";

export function DashboardMockup() {
  return (
    <div className="w-full max-w-6xl mx-auto relative">
      {/* Monitor Bezel */}
      <div className="rounded-[1.5rem] md:rounded-[2rem] p-3 md:p-4 pb-6 md:pb-8 bg-zinc-900 shadow-2xl relative z-10 border-b-4 border-zinc-950">
        
        {/* Camera Hole / Sensor */}
        <div className="absolute top-1.5 md:top-2 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full bg-zinc-950/50 shadow-inner" />

        {/* Screen */}
        <div className="w-full rounded-xl overflow-hidden bg-paper relative">
          {/* Fake Browser/Window Top Bar */}
      <div className="h-10 bg-zinc-100 border-b border-ink/10 flex items-center px-4 gap-2">
        <div className="w-3 h-3 rounded-full bg-red-400" />
        <div className="w-3 h-3 rounded-full bg-amber-400" />
        <div className="w-3 h-3 rounded-full bg-green-400" />
      </div>

      {/* Dashboard App Layout */}
      <div className="flex h-[500px] md:h-[600px] text-left">
        
        {/* Sidebar */}
        <div className="w-16 md:w-56 bg-cobalt text-paper p-4 flex flex-col hidden sm:flex border-r border-cobalt">
          <div className="mb-12 hidden md:block px-2">
            <Logo className="h-6 w-auto filter brightness-0 invert" />
          </div>
          <div className="font-bold text-xl mb-12 md:hidden flex justify-center">K</div>
          
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-3 px-2 py-2 md:px-3 md:py-2.5 rounded-lg bg-paper/10 text-paper">
              <Squares2X2Icon className="w-5 h-5" />
              <span className="font-medium hidden md:block">Overview</span>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 md:px-3 md:py-2.5 rounded-lg text-paper/60">
              <LinkIcon className="w-5 h-5" />
              <span className="font-medium hidden md:block">Links</span>
            </div>
            <div className="flex items-center gap-3 px-2 py-2 md:px-3 md:py-2.5 rounded-lg text-paper/60">
              <Cog6ToothIcon className="w-5 h-5" />
              <span className="font-medium hidden md:block">Settings</span>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 bg-zinc-50/50 p-6 md:p-10 overflow-hidden flex flex-col gap-8">
          
          {/* Header */}
          <div className="flex items-center justify-between">
            <div className="text-2xl font-bold tracking-tight text-ink">Overview</div>
            <div className="bg-ink text-paper px-4 py-2 rounded-lg font-medium text-sm hidden md:block">
              Create Link
            </div>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            
            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="bg-ink text-paper p-5 rounded-2xl shadow-sm flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-paper/60 font-medium mb-2 text-sm">
                <CursorArrowRaysIcon className="w-4 h-4" />
                Total Clicks
              </div>
              <div className="text-4xl font-bold tracking-tighter mt-2">12,450</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="bg-paper p-5 rounded-2xl border border-ink/10 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-ink/50 font-medium mb-2 text-sm">
                <LinkIcon className="w-4 h-4" />
                Active Links
              </div>
              <div className="text-3xl font-bold text-ink mt-2">142</div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="bg-paper p-5 rounded-2xl border border-ink/10 flex flex-col justify-between"
            >
              <div className="flex items-center gap-2 text-ink/50 font-medium mb-2 text-sm">
                <GlobeAltIcon className="w-4 h-4" />
                Clicks Today
              </div>
              <div className="text-3xl font-bold text-ink mt-2">1,102</div>
            </motion.div>

          </div>

          {/* Chart / List Section */}
          <div className="flex-1 bg-paper border border-ink/10 rounded-2xl p-6 hidden sm:flex flex-col shadow-sm relative overflow-hidden z-10">
            {/* Background Blob for Grounding */}
            <div className="absolute inset-0 bg-gradient-to-br from-cobalt/5 to-pink-eraser/5 blur-xl opacity-50 z-0"></div>
            
            <div className="font-bold tracking-tight text-ink mb-6 relative z-10">Clicks Over Time</div>
            
            {/* Fake Chart Area */}
            <div className="flex-1 relative flex text-xs text-ink/40 font-medium z-10">
              
              {/* Y Axis Labels */}
              <div className="flex flex-col justify-between items-end pr-4 pb-6">
                <span>10k</span>
                <span>5k</span>
                <span>0</span>
              </div>

              {/* Chart Grid */}
              <div className="flex-1 relative flex items-end justify-between px-2 pb-6 border-b border-l border-ink/10">
                
                {/* Grid Lines */}
                <div className="absolute top-0 left-0 w-full border-t border-ink/5 border-dashed" />
                <div className="absolute top-1/2 left-0 w-full border-t border-ink/5 border-dashed" />
                
                {/* Animated Bars */}
                {[30, 45, 25, 60, 80, 50, 95, 70, 85].map((height, i) => (
                  <div key={i} className="w-8 md:w-12 h-full flex items-end justify-center group relative cursor-pointer">
                    
                    {/* Tooltip on Hover */}
                    <div className="absolute -top-12 opacity-0 group-hover:opacity-100 transition-opacity bg-ink/90 backdrop-blur-sm text-paper px-3 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-20 pointer-events-none transform -translate-x-1/2 left-1/2">
                      <div className="text-[10px] text-paper/70 font-semibold uppercase tracking-wider mb-0.5">May {10 + i}, 2026</div>
                      <div className="text-sm font-bold">{Math.round((height / 100) * 10000).toLocaleString()} clicks</div>
                      {/* Triangle Pointer */}
                      <div className="absolute -bottom-1 left-1/2 transform -translate-x-1/2 w-2 h-2 bg-ink/90 rotate-45"></div>
                    </div>

                    <motion.div 
                      initial={{ height: 0 }}
                      whileInView={{ height: `${height}%` }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.4 + (i * 0.1), type: "spring", stiffness: 100 }}
                      className="w-full bg-cobalt/20 group-hover:bg-cobalt/40 rounded-t-sm relative transition-colors"
                    >
                      <div className="absolute top-0 left-0 w-full h-1 bg-cobalt rounded-t-sm" />
                    </motion.div>
                  </div>
                ))}

                {/* X Axis Labels */}
                <div className="absolute -bottom-6 left-0 w-full flex justify-between px-2 text-[10px] uppercase tracking-wider">
                  <span>Mon</span>
                  <span>Tue</span>
                  <span>Wed</span>
                  <span>Thu</span>
                  <span>Fri</span>
                  <span>Sat</span>
                  <span>Sun</span>
                  <span>Mon</span>
                  <span>Tue</span>
                </div>
              </div>
            </div>
          </div>

        </div>
        </div>
        
        {/* Close Screen */}
        </div>
        
        {/* Bottom Bezel Details */}
        <div className="absolute bottom-2 md:bottom-3 left-1/2 -translate-x-1/2 flex items-center justify-center">
           <div className="text-[10px] md:text-xs font-bold text-zinc-700 tracking-[0.2em] uppercase">Klick</div>
      </div>
    </div>
    </div>
  );
}
