import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { LockOpen, ShieldCheck, Cpu, Activity, Database } from 'lucide-react';

export const KonamiTransition = ({ onComplete }) => {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          clearInterval(timer);
          setTimeout(onComplete, 500);
          return 100;
        }
        return prev + 1;
      });
    }, 30);

    return () => clearInterval(timer);
  }, [onComplete]);

  return (
    <div className="fixed inset-0 z-[100] bg-[#131313] flex items-center justify-center overflow-hidden">
      {/* Background Void & Grid */}
      <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: 'linear-gradient(to right, rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(to bottom, rgba(255,255,255,0.05) 1px, transparent 1px)', backgroundSize: '40px 40px' }}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_0%,#131313_70%)] pointer-events-none"></div>

      {/* Main Container */}
      <motion.main 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative z-10 w-full max-w-4xl px-8 flex flex-col items-center"
      >
        {/* Top Identity Anchor */}
        <div className="absolute top-[-120px] left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-60">
          <span className="font-serif italic text-[#adc6ff] text-2xl tracking-tighter">ARCHITECTURAL_VOID</span>
          <span className="text-[10px] uppercase tracking-[0.2em] text-[#8c909f] font-bold">System Handshake Protocol v4.2.0-Alpha</span>
        </div>

        {/* Stylized Circular Scanner */}
        <div className="relative w-80 h-80 md:w-[450px] md:h-[450px] flex items-center justify-center mb-12">
          {/* Outer Glow Rings */}
          <div className="absolute inset-0 rounded-full border border-[#adc6ff]/10 animate-pulse"></div>
          <div className="absolute inset-4 rounded-full border border-[#d0bcff]/10"></div>
          <div className="absolute inset-12 rounded-full border border-[#adc6ff]/5 animate-ping duration-[3000ms]"></div>
          
          {/* Rotating Scanner Hand */}
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-[#3B82F6] border-b-[#571bc1] opacity-40 animate-spin shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
          <div className="absolute inset-8 rounded-full border-2 border-transparent border-t-[#3B82F6] border-b-[#571bc1] opacity-20 animate-[spin_6s_linear_infinite_reverse]"></div>

          {/* Central Content Core */}
          <div className="relative z-20 flex flex-col items-center text-center">
            <motion.div 
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
              className="mb-4 text-[#adc6ff]"
            >
              <LockOpen className="w-16 h-16" />
            </motion.div>
            <h1 className="font-serif text-4xl md:text-6xl font-bold tracking-tight mb-2 text-[#e2e2e2] uppercase italic">
              SEQUENCE ACCEPTED
            </h1>
            <p className="text-[#d0bcff] text-xs md:text-sm tracking-[0.3em] uppercase opacity-80 font-bold">
              INITIALIZING ADMIN ACCESS PROTOCOL...
            </p>
          </div>

          {/* Decorative Data Nodes */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-b from-[#adc6ff] to-transparent opacity-50"></div>
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-1 h-12 bg-gradient-to-t from-[#d0bcff] to-transparent opacity-50"></div>
          <div className="absolute left-0 top-1/2 -translate-y-1/2 h-1 w-12 bg-gradient-to-r from-[#adc6ff] to-transparent opacity-50"></div>
          <div className="absolute right-0 top-1/2 -translate-y-1/2 h-1 w-12 bg-gradient-to-l from-[#d0bcff] to-transparent opacity-50"></div>
        </div>

        {/* Progress Tracking Section */}
        <div className="w-full max-w-md flex flex-col items-center gap-6">
          {/* Bento-style Meta Info */}
          <div className="grid grid-cols-3 gap-4 w-full mb-4">
            <div className="bg-[#1b1b1b]/40 backdrop-blur-xl rounded-xl p-3 border-t border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#8c909f] mb-1 uppercase font-bold">Node</span>
              <span className="text-xs text-[#adc6ff] font-bold tracking-widest flex items-center gap-1">
                <Cpu className="w-3 h-3" /> AX-09
              </span>
            </div>
            <div className="bg-[#1b1b1b]/40 backdrop-blur-xl rounded-xl p-3 border-t border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#8c909f] mb-1 uppercase font-bold">Enc</span>
              <span className="text-xs text-[#d0bcff] font-bold tracking-widest flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" /> RSA_4096
              </span>
            </div>
            <div className="bg-[#1b1b1b]/40 backdrop-blur-xl rounded-xl p-3 border-t border-white/10 flex flex-col items-center justify-center">
              <span className="text-[10px] text-[#8c909f] mb-1 uppercase font-bold">Sig</span>
              <span className="text-xs text-[#adc6ff] font-bold tracking-widest flex items-center gap-1">
                <Activity className="w-3 h-3" /> VERIFIED
              </span>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="w-full">
            <div className="flex justify-between items-end mb-3">
              <span className="text-[10px] tracking-widest text-[#8c909f] uppercase font-bold">CALIBRATING SECURITY LAYERS...</span>
              <span className="font-sans text-[#adc6ff] text-xl font-extrabold italic">{progress}%</span>
            </div>
            <div className="h-1.5 w-full bg-[#353535] rounded-full overflow-hidden">
              <motion.div 
                className="h-full bg-gradient-to-r from-[#adc6ff] to-[#d0bcff] shadow-[0_0_15px_rgba(173,198,255,0.4)]"
                style={{ width: `${progress}%` }}
              ></motion.div>
            </div>
          </div>

          {/* Bottom Status Log */}
          <div className="text-center">
            <p className="text-[10px] text-[#8c909f]/40 italic flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-[#adc6ff] animate-pulse"></span>
              Handshaking with Core_Engine v4.2.0-Alpha...
            </p>
          </div>
        </div>
      </motion.main>

      {/* Side Decorative Elements */}
      <aside className="fixed left-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 opacity-30">
        <div className="flex flex-col gap-2">
          <div className="h-1 w-24 bg-[#adc6ff]/20"></div>
          <div className="h-1 w-16 bg-[#adc6ff]/10"></div>
          <div className="h-1 w-32 bg-[#adc6ff]/5"></div>
        </div>
        <div className="font-bold text-[10px] uppercase tracking-[0.5em] origin-left rotate-90 whitespace-nowrap text-[#8c909f]">
          AUTHORIZATION_LEVEL:_OMEGA
        </div>
      </aside>
      <aside className="fixed right-8 top-1/2 -translate-y-1/2 hidden lg:flex flex-col gap-12 items-end opacity-30">
        <div className="font-bold text-[10px] uppercase tracking-[0.5em] origin-right -rotate-90 whitespace-nowrap text-[#8c909f]">
          TERMINAL_STATE:_LOCKED_BY_ROOT
        </div>
        <div className="flex flex-col gap-2 items-end">
          <div className="h-1 w-32 bg-[#d0bcff]/20"></div>
          <div className="h-1 w-16 bg-[#d0bcff]/10"></div>
          <div className="h-1 w-24 bg-[#d0bcff]/5"></div>
        </div>
      </aside>

      {/* Background Refraction Textures */}
      <div className="fixed bottom-0 left-0 w-1/3 h-1/3 bg-[#adc6ff]/5 blur-[120px] rounded-full pointer-events-none"></div>
      <div className="fixed top-0 right-0 w-1/3 h-1/3 bg-[#d0bcff]/5 blur-[120px] rounded-full pointer-events-none"></div>
    </div>
  );
};
