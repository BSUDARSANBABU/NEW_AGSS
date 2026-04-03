import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Lock, Mail, Key, ArrowRight, Terminal, Keyboard } from 'lucide-react';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    // In a real app, validate credentials here
    onLogin();
  };

  return (
    <div className="min-h-screen bg-[#131313] text-[#e2e2e2] font-sans selection:bg-primary/30 selection:text-primary flex flex-col items-center justify-center p-6 relative overflow-hidden">
      {/* Hero Content Background Pattern */}
      <div className="fixed inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-0 left-0 w-full h-full" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.02) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.02) 1px, transparent 1px)', backgroundSize: '80px 80px' }}></div>
      </div>

      <div className="fixed top-1/4 -left-20 w-64 h-64 bg-[#d0bcff]/10 rounded-full blur-[100px] pointer-events-none"></div>
      <div className="fixed bottom-1/4 -right-20 w-96 h-96 bg-[#adc6ff]/10 rounded-full blur-[120px] pointer-events-none"></div>

      {/* Main Navigation Header */}
      <nav className="fixed top-0 w-full z-50 bg-zinc-950/40 backdrop-blur-xl shadow-[0_0_12px_rgba(59,130,246,0.1)] h-16 flex items-center justify-between px-8">
        <div className="text-xl font-serif tracking-tighter text-blue-400">ARCHITECT_VOID</div>
        <div className="flex items-center gap-6">
          <span className="text-zinc-500 text-[10px] uppercase tracking-[0.2em] font-medium">Security Protocol: Active</span>
          <div className="w-2 h-2 rounded-full bg-[#adc6ff] animate-pulse shadow-[0_0_15px_rgba(173,198,255,0.5)]"></div>
        </div>
      </nav>

      {/* Content Container */}
      <motion.main 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-lg z-10"
      >
        <div className="text-center mb-10 space-y-2">
          <h1 className="font-serif text-4xl tracking-tight text-[#e2e2e2]">Initialize Core Access</h1>
          <p className="text-[#c2c6d6] text-[10px] uppercase tracking-[0.3em] opacity-70">Infrastructure Authentication Gateway</p>
        </div>

        <section className="bg-[#353535]/20 backdrop-blur-xl rounded-xl p-10 border border-white/5 shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 right-0 p-4 opacity-10">
            <Lock className="w-16 h-16" />
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-4">
              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-widest text-[#adc6ff] mb-2 ml-1 font-bold">Identity Identifier</label>
                <div className="flex items-center bg-[#0e0e0e]/50 rounded-lg px-4 py-3 border border-[#424754]/30 focus-within:border-[#adc6ff]/50 transition-all duration-300">
                  <Mail className="w-4 h-4 text-[#8c909f] mr-3" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-[#e2e2e2] w-full placeholder:text-[#8c909f]/50 font-medium text-sm" 
                    placeholder="username@void.io" 
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
              </div>

              <div className="relative group">
                <label className="block text-[10px] uppercase tracking-widest text-[#adc6ff] mb-2 ml-1 font-bold">Encryption Key</label>
                <div className="flex items-center bg-[#0e0e0e]/50 rounded-lg px-4 py-3 border border-[#424754]/30 focus-within:border-[#adc6ff]/50 transition-all duration-300">
                  <Key className="w-4 h-4 text-[#8c909f] mr-3" />
                  <input 
                    className="bg-transparent border-none focus:ring-0 text-[#e2e2e2] w-full placeholder:text-[#8c909f]/50 text-sm" 
                    placeholder="•••••••••••" 
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
              </div>
            </div>

            <button 
              className="w-full py-4 bg-gradient-to-r from-[#adc6ff] to-[#571bc1] text-[#002e6a] font-bold rounded-full shadow-[0_0_20px_rgba(173,198,255,0.2)] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 uppercase tracking-widest text-xs flex items-center justify-center gap-2" 
              type="submit"
            >
              Enter Void
              <ArrowRight className="w-4 h-4" />
            </button>

            <div className="relative flex items-center py-2">
              <div className="flex-grow border-t border-white/5"></div>
              <span className="flex-shrink mx-4 text-[10px] font-bold uppercase tracking-widest text-[#8c909f]">Alternative Protocol</span>
              <div className="flex-grow border-t border-white/5"></div>
            </div>

            <button 
              className="w-full py-3 bg-[#353535]/20 hover:bg-[#353535]/40 border border-[#424754]/20 backdrop-blur-md text-[#e2e2e2] font-medium rounded-full transition-all duration-300 flex items-center justify-center gap-3" 
              type="button"
              onClick={onLogin}
            >
              <img alt="Google logo" className="w-5 h-5 grayscale opacity-80" src="https://lh3.googleusercontent.com/aida-public/AB6AXuANeVC9a9Gei8Nz6PiA_RjScKhtmq1JeuvQxvi9hund31D1oCs56wVa74_HOGAqOw6srPlAwoKfQqUoKwdWiKmyhC28ZGmPHvFht2jGQ4KDXoga-NprBw_NqZPlPW0StPYpQK6fg9yzlJiROb5eAVsftxhJ9XITZIxPJ_fzGVGNjjRs2Gp7fuO0bAK3ImnnDLZauHAwL7KE7iziLieGgQVEdgLTvFvB0IJ1EnWxhx8CqXggqtCNSX08QjLLXrdVfuSOGW34t50GuSk" />
              <span className="text-[10px] uppercase tracking-wider font-bold">Sign in with Google</span>
            </button>
          </form>

          <div className="mt-8 text-center">
            <a className="text-[10px] font-bold uppercase tracking-widest text-[#8c909f] hover:text-[#adc6ff] transition-colors duration-300" href="#">Recover Access Rights</a>
          </div>
        </section>

        <footer className="mt-12 grid grid-cols-2 gap-4">
          <div className="bg-[#353535]/20 backdrop-blur-xl rounded-lg p-6 border border-white/5 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-widest text-[#8c909f] mb-2 font-bold">System Load</span>
            <div className="flex items-end gap-2">
              <div className="w-1 h-3 bg-[#adc6ff]/20 rounded-full"></div>
              <div className="w-1 h-5 bg-[#adc6ff]/40 rounded-full"></div>
              <div className="w-1 h-2 bg-[#adc6ff]/20 rounded-full"></div>
              <div className="w-1 h-4 bg-[#adc6ff]/60 rounded-full"></div>
              <span className="font-serif text-xl text-[#adc6ff] leading-none">0.02ms</span>
            </div>
          </div>

          <div className="bg-[#353535]/20 backdrop-blur-xl rounded-lg p-6 border border-dashed border-[#adc6ff]/20 flex flex-col justify-center">
            <div className="flex items-center gap-3 mb-2">
              <Terminal className="w-4 h-4 text-[#adc6ff]" />
              <span className="text-[10px] uppercase tracking-widest text-[#8c909f] font-bold">Legacy Sequence</span>
            </div>
            <div className="flex gap-1 opacity-40 grayscale group hover:grayscale-0 transition-all">
              <ArrowRight className="w-3 h-3 -rotate-90" />
              <ArrowRight className="w-3 h-3 -rotate-90" />
              <ArrowRight className="w-3 h-3 rotate-90" />
              <ArrowRight className="w-3 h-3 rotate-90" />
              <span className="text-[8px] flex items-center font-bold tracking-tighter">...</span>
            </div>
          </div>
        </footer>

        <div className="mt-12 flex justify-between items-center px-4">
          <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50">© 2024 ARCHITECT_VOID SYSTEMS</span>
          <div className="flex gap-4">
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50 cursor-pointer hover:text-[#8c909f] transition-colors">v4.0.2-alpha</span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-[#8c909f]/50 cursor-pointer hover:text-[#8c909f] transition-colors">Privacy</span>
          </div>
        </div>
      </motion.main>

      <div className="fixed bottom-0 right-0 p-12 pointer-events-none select-none opacity-5">
        <h2 className="font-serif text-[12vw] leading-none tracking-tighter">VOID</h2>
      </div>
    </div>
  );
};

export default Login;
