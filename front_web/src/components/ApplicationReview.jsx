import React from 'react';
import { 
  ArrowLeft, 
  Bell, 
  HelpCircle, 
  Calendar, 
  MapPin, 
  Mail, 
  Code, 
  Link as LinkIcon, 
  CheckCircle, 
  School, 
  ChevronDown, 
  Layers, 
  Clock, 
  ShieldCheck, 
  XCircle 
} from 'lucide-react';
import { motion } from 'motion/react';
import { cn } from '../lib/utils';

export const ApplicationReview = ({ candidate, onClose }) => {
  return (
    <motion.div 
      initial={{ opacity: 0, x: 50 }}
      animate={{ opacity: 1, x: 0 }}
      exit={{ opacity: 0, x: 50 }}
      className="fixed inset-0 z-[60] bg-surface flex flex-col"
    >
      {/* Top Navigation */}
      <header className="w-full top-0 sticky bg-slate-50 dark:bg-slate-900 flex justify-between items-center px-10 py-4 border-b border-outline-variant/10 z-40">
        <div className="flex items-center gap-4">
          <button 
            onClick={onClose}
            className="text-on-surface-variant hover:text-primary transition-colors"
          >
            <ArrowLeft size={24} />
          </button>
          <div className="h-4 w-[1px] bg-slate-200 dark:bg-slate-800 mx-2"></div>
          <h2 className="font-headline tracking-tight text-xl font-bold text-cyan-900 dark:text-cyan-50">Application Review</h2>
        </div>
        <div className="flex items-center space-x-6">
          <div className="flex items-center space-x-4 text-slate-500 dark:text-slate-400">
            <button className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
              <Bell size={20} />
            </button>
            <button className="hover:text-cyan-700 dark:hover:text-cyan-300 transition-colors">
              <HelpCircle size={20} />
            </button>
          </div>
          <div className="h-8 w-[1px] bg-slate-200 dark:bg-slate-800"></div>
          <div className="flex items-center space-x-3">
            <img 
              alt="User profile" 
              className="w-8 h-8 rounded-full border border-outline-variant/20 object-cover" 
              src="https://lh3.googleusercontent.com/aida-public/AB6AXuDgZNNqNvmwHptyyLAmxKx-aoteaVKSW_bYzTq0_FQ7NzlT5g65GrRRFYvAjW1B4KWIpn9NITLWAZFbBQNyTK__4CAt3Ft2iCdrE7S1-5ZFy5UQmElF_eFXgPvdcHjqQccIwM9sFAXhgjgc5rjBI0ezn7gvunhVDXTxWeL0zVGMPYH5FR5LASQsu80kuMboV7qUVG6vukFsWOUwBHELvJ4AHaOB44W_wUlF7TH-0_EvF9DmQNmHyJnrHPYDGTaiCF3fAkP_2exinOI"
              referrerPolicy="no-referrer"
            />
            <span className="text-sm font-bold text-cyan-900 dark:text-cyan-50">Admin User</span>
          </div>
        </div>
      </header>

      {/* Main Body Grid */}
      <div className="flex-1 overflow-hidden flex">
        {/* Left: Candidate Dossier */}
        <section className="flex-1 bg-surface p-12 space-y-12 overflow-y-auto custom-scrollbar">
          {/* Profile Header */}
          <div className="flex items-start justify-between">
            <div className="space-y-4">
              <div className="inline-block px-2 py-1 bg-primary-fixed text-on-primary-fixed-variant text-[10px] font-bold uppercase tracking-widest rounded-sm">Candidate Dossier</div>
              <h1 className="text-5xl font-extrabold tracking-tight text-on-surface leading-none">{candidate.name}</h1>
              <p className="text-xl text-primary font-medium tracking-tight">{candidate.role}</p>
              <div className="flex items-center space-x-6 pt-2">
                <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                  <Calendar size={18} className="text-primary" />
                  <span>Applied: Oct 24, 2023</span>
                </div>
                <div className="flex items-center space-x-2 text-on-surface-variant text-sm">
                  <MapPin size={18} className="text-primary" />
                  <span>Vancouver, BC</span>
                </div>
              </div>
            </div>
            <img 
              className="w-32 h-32 rounded-xl object-cover glass-border grayscale hover:grayscale-0 transition-all duration-500" 
              alt={candidate.name}
              src={candidate.avatar || "https://picsum.photos/seed/candidate/200/200"}
              referrerPolicy="no-referrer"
            />
          </div>

          {/* Contact Grid */}
          <div className="grid grid-cols-3 gap-6">
            <a className="p-6 bg-surface-container-lowest glass-border hover:bg-primary group transition-all duration-300 rounded-lg" href="#">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-primary-fixed mb-2 block">Direct Email</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface group-hover:text-white">m.chen@devforge.tech</span>
                <Mail size={20} className="text-primary group-hover:text-primary-fixed" />
              </div>
            </a>
            <a className="p-6 bg-surface-container-lowest glass-border hover:bg-on-surface group transition-all duration-300 rounded-lg" href="#">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-outline-variant mb-2 block">GitHub Identity</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface group-hover:text-white">chen-codes-v8</span>
                <Code size={20} className="text-on-surface group-hover:text-white" />
              </div>
            </a>
            <a className="p-6 bg-surface-container-lowest glass-border hover:bg-[#0077b5] group transition-all duration-300 rounded-lg" href="#">
              <span className="text-[10px] font-bold uppercase tracking-widest text-on-surface-variant group-hover:text-secondary-fixed mb-2 block">Professional Network</span>
              <div className="flex items-center justify-between">
                <span className="font-semibold text-on-surface group-hover:text-white">marcus-chen-sys</span>
                <LinkIcon size={20} className="text-[#0077b5] group-hover:text-white" />
              </div>
            </a>
          </div>

          {/* Bio Section */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center">
              <span className="w-8 h-[2px] bg-primary mr-3"></span> Executive Summary
            </h3>
            <p className="text-lg leading-relaxed text-on-surface-variant font-light max-w-3xl">
              Systems architect with 12+ years of experience specializing in high-frequency trading infrastructure and distributed consensus protocols. Expert in bridging gap between low-level hardware performance and high-level application scalability. Former lead at <span className="text-on-surface font-semibold underline decoration-primary-fixed decoration-4 underline-offset-4">QuantFlow Systems</span>.
            </p>
          </div>

          {/* Experience Timeline */}
          <div className="space-y-8">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center">
              <span className="w-8 h-[2px] bg-primary mr-3"></span> Professional Trajectory
            </h3>
            <div className="space-y-12 relative pl-8">
              <div className="absolute left-0 top-0 bottom-0 w-[1px] bg-outline-variant/30"></div>
              {/* Role 1 */}
              <div className="relative">
                <div className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-primary border-4 border-surface"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-on-surface">Lead Distributed Systems Engineer</h4>
                    <p className="text-primary font-semibold">QuantFlow Systems</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded">2019 — Present</span>
                </div>
                <ul className="space-y-3 mt-4 text-on-surface-variant">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span>Engineered a sub-10ms latency message broker handling 4M+ requests per second using Rust and DPDK.</span>
                  </li>
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span>Reduced infrastructure overhead by 40% through custom WASM-based plugin architecture.</span>
                  </li>
                </ul>
              </div>
              {/* Role 2 */}
              <div className="relative">
                <div className="absolute -left-[36px] top-1 w-4 h-4 rounded-full bg-outline-variant border-4 border-surface"></div>
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="text-xl font-bold text-on-surface">Senior Infrastructure Developer</h4>
                    <p className="text-primary font-semibold">Nebula Cloud Services</p>
                  </div>
                  <span className="text-sm font-bold text-on-surface-variant bg-surface-container-low px-3 py-1 rounded">2015 — 2019</span>
                </div>
                <ul className="space-y-3 mt-4 text-on-surface-variant">
                  <li className="flex items-start">
                    <CheckCircle size={16} className="text-primary mt-1 mr-3 flex-shrink-0" />
                    <span>Architected a multi-region Kubernetes control plane that managed 5,000+ nodes globally.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* Technical Skills */}
          <div className="space-y-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center">
              <span className="w-8 h-[2px] bg-primary mr-3"></span> Technical Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {['Rust', 'Go', 'WebAssembly (WASM)', 'Distributed Systems', 'eBPF', 'C++20', 'PostgreSQL', 'ZeroMQ'].map(skill => (
                <span key={skill} className="px-4 py-2 bg-surface-container-lowest border border-outline-variant/30 font-bold text-on-surface rounded-full text-sm hover:border-primary transition-colors cursor-default">
                  {skill}
                </span>
              ))}
            </div>
          </div>

          {/* Education */}
          <div className="space-y-6 pb-12">
            <h3 className="text-sm font-bold uppercase tracking-widest text-primary flex items-center">
              <span className="w-8 h-[2px] bg-primary mr-3"></span> Education
            </h3>
            <div className="flex items-center space-x-6">
              <div className="w-14 h-14 bg-surface-container-high rounded-lg flex items-center justify-center text-primary">
                <School size={32} />
              </div>
              <div>
                <h4 className="font-bold text-on-surface">M.Sc. in Computer Science</h4>
                <p className="text-on-surface-variant text-sm">University of Toronto • Specialized in Distributed Algorithms</p>
              </div>
            </div>
          </div>
        </section>

        {/* Right: Assessment Sidebar */}
        <aside className="w-96 bg-surface-container-low p-8 border-l border-outline-variant/10 overflow-y-auto custom-scrollbar">
          <div className="space-y-10">
            {/* Application Status */}
            <section className="space-y-4">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Review Status</label>
              <div className="relative">
                <select className="w-full bg-surface-container-lowest glass-border px-4 py-4 rounded-lg font-bold text-on-surface appearance-none focus:ring-2 focus:ring-primary focus:outline-none cursor-pointer">
                  <option>Technical Screening</option>
                  <option selected>Under Review</option>
                  <option>Shortlisted</option>
                  <option>Hired</option>
                  <option>Rejected</option>
                </select>
                <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none text-on-surface-variant" size={20} />
              </div>
            </section>

            {/* Metrics */}
            <section className="space-y-6">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Performance Metrics</label>
              <div className="space-y-6">
                {[
                  { label: 'Technical Aptitude', score: 9.4 },
                  { label: 'System Design', score: 8.8 },
                  { label: 'Communication', score: 7.5 }
                ].map(metric => (
                  <div key={metric.label}>
                    <div className="flex justify-between items-end mb-2">
                      <span className="text-sm font-bold">{metric.label}</span>
                      <span className="text-2xl font-headline font-extrabold text-primary leading-none">{metric.score}<span className="text-xs text-on-surface-variant ml-1">/10</span></span>
                    </div>
                    <div className="w-full h-1.5 bg-surface-container-high rounded-full overflow-hidden">
                      <div className="h-full bg-primary" style={{ width: `${metric.score * 10}%` }}></div>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* Interview Schedule */}
            <section className="space-y-4">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Interview Log</label>
              <div className="space-y-3">
                <div className="p-4 bg-surface-container-lowest rounded-lg glass-border flex items-center space-x-4">
                  <div className="w-10 h-10 rounded bg-secondary-container flex items-center justify-center text-on-secondary-container">
                    <Code size={20} fill="currentColor" />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">Algo Deep-Dive</h5>
                    <p className="text-[10px] text-on-surface-variant uppercase font-semibold">Completed • Oct 28</p>
                  </div>
                  <CheckCircle size={18} className="text-green-600" />
                </div>
                <div className="p-4 bg-surface-container-lowest rounded-lg glass-border flex items-center space-x-4">
                  <div className="w-10 h-10 rounded bg-primary-fixed flex items-center justify-center text-on-primary-fixed-variant">
                    <Layers size={20} />
                  </div>
                  <div className="flex-1">
                    <h5 className="text-sm font-bold">System Architecture</h5>
                    <p className="text-[10px] text-primary uppercase font-bold tracking-wider">Scheduled • Nov 02, 10:00 AM</p>
                  </div>
                  <Clock size={18} className="text-primary animate-pulse" />
                </div>
              </div>
            </section>

            {/* Team Notes */}
            <section className="space-y-4">
              <label className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-on-surface-variant">Internal Team Feedback</label>
              <textarea 
                className="w-full bg-surface-container-lowest glass-border p-4 rounded-lg text-sm text-on-surface-variant placeholder:text-outline-variant focus:ring-2 focus:ring-primary focus:outline-none resize-none" 
                placeholder="Add a private note about this candidate..." 
                rows={4}
              />
            </section>

            {/* Action Buttons */}
            <div className="grid grid-cols-1 gap-3 pt-6">
              <button className="w-full py-4 bg-gradient-to-r from-primary to-primary-container text-white font-bold rounded-full shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-95 transition-all flex items-center justify-center">
                <ShieldCheck size={20} className="mr-2" />
                Accept for Next Round
              </button>
              <button className="w-full py-4 bg-surface-container-high text-on-surface font-bold rounded-full hover:bg-error-container hover:text-on-error-container transition-all flex items-center justify-center">
                <XCircle size={20} className="mr-2" />
                Reject Candidate
              </button>
            </div>
          </div>
        </aside>
      </div>
    </motion.div>
  );
};
