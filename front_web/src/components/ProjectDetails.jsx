import React from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Clock, Database, Globe, Cpu, ShieldCheck, Activity } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProjectDetails = ({ project, onClose }) => (
  <motion.div 
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-on-background/40 backdrop-blur-md"
    onClick={onClose}
  >
    <motion.div 
      initial={{ scale: 0.9, opacity: 0, y: 20 }}
      animate={{ scale: 1, opacity: 1, y: 0 }}
      exit={{ scale: 0.9, opacity: 0, y: 20 }}
      className="bg-surface-container-lowest w-full max-w-5xl max-h-[90vh] overflow-y-auto rounded-3xl border border-outline-variant/20 shadow-2xl flex flex-col"
      onClick={e => e.stopPropagation()}
    >
      {/* Hero Section */}
      <div className="relative h-72 sm:h-96 shrink-0">
        <img src={project.img} alt={project.title} className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/20 to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-10 space-y-4">
          <div className="flex gap-3">
            <span className={cn(
              "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
              project.status === 'Active' && "bg-primary-container/20 text-primary-container border-primary-container/30",
              project.status === 'Staging' && "bg-secondary-container/20 text-secondary-container border-secondary-container/30",
              project.status === 'Completed' && "bg-white/10 text-white border-white/20"
            )}>
              {project.status}
            </span>
            <span className="px-3 py-1 bg-white/10 text-white text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-md border border-white/20">
              {project.category}
            </span>
          </div>
          <div className="space-y-1">
            <p className="text-xs font-bold text-white/60 uppercase tracking-widest">{project.id}</p>
            <h2 className="text-5xl font-bold tracking-tighter text-white">{project.title}</h2>
          </div>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="p-10 grid grid-cols-1 lg:grid-cols-12 gap-12">
        <div className="lg:col-span-8 space-y-10">
          {/* Summary */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Activity className="w-4 h-4 text-primary-container" />
              Executive Summary
            </h3>
            <div className="space-y-4 text-on-surface-variant leading-relaxed">
              <p className="text-lg font-medium text-on-surface">{project.desc}</p>
              <p>
                This system implements a high-precision architecture designed for extreme environmental conditions. 
                By leveraging {project.tech.join(', ')}, we achieve sub-millisecond latency and 99.99% uptime across all active nodes.
                The current deployment phase focuses on optimizing data throughput and ensuring end-to-end encryption across mesh network.
              </p>
            </div>
          </section>
          
          {/* Technical Stack */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Cpu className="w-4 h-4 text-primary-container" />
              Technical Stack
            </h3>
            <div className="flex flex-wrap gap-3">
              {project.tech.map((t) => (
                <div key={t} className="px-5 py-2.5 bg-surface-container-low rounded-xl border border-outline-variant/10 flex items-center gap-3 group hover:border-primary-container/30 transition-all">
                  <div className="w-2 h-2 rounded-full bg-primary-container group-hover:scale-125 transition-transform"></div>
                  <span className="text-xs font-bold text-on-surface">{t}</span>
                </div>
              ))}
            </div>
          </section>
 
          {/* Performance Metrics */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface flex items-center gap-2">
              <Globe className="w-4 h-4 text-primary-container" />
              System Performance
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Network Latency</p>
                <p className="text-3xl font-bold text-on-surface">12.4<span className="text-sm font-medium opacity-50">ms</span></p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Node Density</p>
                <p className="text-3xl font-bold text-on-surface">842<span className="text-sm font-medium opacity-50">/sqkm</span></p>
              </div>
              <div className="p-5 bg-surface-container-low rounded-2xl border border-outline-variant/10">
                <p className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest mb-2">Throughput</p>
                <p className="text-3xl font-bold text-on-surface">1.2<span className="text-sm font-medium opacity-50">GB/s</span></p>
              </div>
            </div>
          </section>
        </div>
        
        <div className="lg:col-span-4 space-y-10">
          {/* Metadata */}
          <section className="space-y-6">
            <h3 className="text-sm font-bold text-on-surface">Project Metadata</h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Instance ID</span>
                <span className="text-[10px] font-mono text-on-surface font-bold">{project.id}</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Deployment Date</span>
                <span className="text-[10px] font-bold text-on-surface">OCT 24, 2023</span>
              </div>
              <div className="flex justify-between items-center py-3 border-b border-outline-variant/10">
                <span className="text-[10px] font-bold text-on-surface-variant uppercase tracking-widest">Security Level</span>
                <div className="flex items-center gap-2 text-primary-container">
                  <ShieldCheck className="w-3 h-3" />
                  <span className="text-[10px] font-bold uppercase">Class-A Prime</span>
                </div>
              </div>
            </div>
          </section>
          
          {/* Project Lead */}
          <section className="space-y-4">
            <h3 className="text-sm font-bold text-on-surface">Project Lead</h3>
            <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center gap-4">
              <img src={project.leadAvatar} alt={project.lead} className="w-12 h-12 rounded-full object-cover border-2 border-surface-container-lowest" referrerPolicy="no-referrer" />
              <div>
                <p className="text-sm font-bold text-on-surface">{project.lead}</p>
                <p className="text-[10px] font-medium text-on-surface-variant">Principal Systems Engineer</p>
              </div>
            </div>
          </section>
          
          <div className="space-y-3">
            <button className="w-full py-4 bg-primary-container text-on-primary-container font-bold rounded-2xl hover:opacity-90 transition-all flex items-center justify-center gap-3 shadow-lg shadow-primary-container/10">
              Access Repository
              <ExternalLink className="w-4 h-4" />
            </button>
            <button className="w-full py-4 bg-surface-container-high text-on-surface font-bold rounded-2xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-3">
              <Clock className="w-4 h-4" />
              View Commit History
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
