import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, ExternalLink, Clock, Database, Globe, Cpu, ShieldCheck, Activity, Users, Code, Calendar, Award, MapPin, Github, Terminal } from 'lucide-react';
import { cn } from '../lib/utils';

export const ProjectDetails = ({ project, onClose }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Handle multiple images - use project.images array or fallback to single img
  const images = project.images || [project.img];
  const currentImage = images[currentImageIndex] || project.img;

  const handleThumbnailClick = (index) => {
    setCurrentImageIndex(index);
  };

  return (
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
        className="bg-surface-container-lowest w-full max-w-6xl max-h-[90vh] overflow-y-auto rounded-3xl border border-outline-variant/20 shadow-2xl flex flex-col"
        onClick={e => e.stopPropagation()}
      >
        {/* Hero Section with Full Width Image */}
        <div className="relative h-96 shrink-0 bg-black">
          {/* Main Image */}
          <img
            src={currentImage}
            alt={project.title}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent"></div>

          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20 z-10"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Project Info Overlay */}
          <div className="absolute bottom-0 left-0 right-0 p-10 z-10">
            <div className="flex items-end gap-6">
              <div className="w-24 h-24 rounded-2xl bg-surface-container overflow-hidden border-4 border-surface-container-lowest shadow-xl">
                <img
                  src={project.img}
                  alt={project.title}
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className="flex-1 pb-2">
                <div className="flex items-center gap-3 mb-2">
                  <h2 className="text-4xl font-bold tracking-tighter text-white">{project.title}</h2>
                  <span className={cn(
                    "px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border",
                    project.status === 'Active' && "bg-green-500/20 text-green-100 border-green-400/30",
                    project.status === 'Staging' && "bg-yellow-500/20 text-yellow-100 border-yellow-400/30",
                    project.status === 'Completed' && "bg-blue-500/20 text-blue-100 border-blue-400/30"
                  )}>
                    {project.status}
                  </span>
                </div>
                <p className="text-lg font-medium text-white/90">{project.category}</p>
                <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" />
                    <span>Created {project.created_at || 'Recently'}</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" />
                    <span>{project.team_size || 'Small'} team</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Image Counter */}
          <div className="absolute top-6 left-6 px-3 py-1 bg-black/50 text-white rounded-full text-xs font-medium backdrop-blur-md border border-white/20 z-10">
            {currentImageIndex + 1} / {images.length}
          </div>
        </div>

        {/* Thumbnail Gallery */}
        {images.length > 1 && (
          <div className="px-10 py-4 bg-surface-container-lowest border-b border-outline-variant/20">
            <div className="flex gap-3 overflow-x-auto">
              {images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-all",
                    index === currentImageIndex
                      ? "border-primary shadow-lg scale-105"
                      : "border-outline-variant/30 hover:border-primary/50"
                  )}
                >
                  <img
                    src={image}
                    alt={`${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Content Grid */}
        <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
          <div className="lg:col-span-2 space-y-8">
            {/* About Section */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Activity className="w-5 h-5 text-primary" />
                Project Overview
              </h3>
              <div className="text-on-surface-variant leading-relaxed">
                <p className="text-lg">
                  {project.desc}
                </p>
                <p className="mt-4">
                  This system implements a high-precision architecture designed for extreme environmental conditions.
                  By leveraging {project.tech.join(', ')}, we achieve sub-millisecond latency and 99.99% uptime across all active nodes.
                  The current deployment phase focuses on optimizing data throughput and ensuring end-to-end encryption across mesh network.
                </p>
              </div>
            </section>

            {/* Technical Stack */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Code className="w-5 h-5 text-primary" />
                Technical Stack
              </h3>
              <div className="flex flex-wrap gap-3">
                {project.tech.map((t) => (
                  <div key={t} className="px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                    <span className="text-sm font-bold text-on-surface">{t}</span>
                  </div>
                ))}
              </div>
            </section>

            {/* Performance Metrics */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
                <Globe className="w-5 h-5 text-primary" />
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

          <div className="space-y-8">
            {/* Project Metadata */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Project Metadata</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <Database className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Instance ID</div>
                    <div className="text-xs text-on-surface-variant font-mono">{project.id}</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <Calendar className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Deployment Date</div>
                    <div className="text-xs text-on-surface-variant">OCT 24, 2023</div>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <ShieldCheck className="w-4 h-4 text-primary" />
                  <div>
                    <div className="text-sm font-bold text-on-surface">Security Level</div>
                    <div className="text-xs text-on-surface-variant">Class-A Prime</div>
                  </div>
                </div>
              </div>
            </section>

            {/* Project Lead */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Project Lead</h3>
              <div className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 flex items-center gap-4">
                <img src={project.leadAvatar} alt={project.lead} className="w-12 h-12 rounded-full object-cover border-2 border-surface-container-lowest" referrerPolicy="no-referrer" />
                <div>
                  <p className="text-sm font-bold text-on-surface">{project.lead}</p>
                  <p className="text-[10px] font-medium text-on-surface-variant">Principal Systems Engineer</p>
                </div>
              </div>
            </section>

            {/* Quick Stats */}
            <section className="space-y-4">
              <h3 className="text-lg font-bold text-on-surface">Quick Stats</h3>
              <div className="grid grid-cols-2 gap-3">
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary">{project.tech.length}</div>
                  <div className="text-xs text-on-surface-variant">Technologies</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary">99.9%</div>
                  <div className="text-xs text-on-surface-variant">Uptime</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary">12.4</div>
                  <div className="text-xs text-on-surface-variant">Latency (ms)</div>
                </div>
                <div className="p-3 bg-surface-container-low rounded-xl text-center">
                  <div className="text-2xl font-bold text-primary">A+</div>
                  <div className="text-xs text-on-surface-variant">Security</div>
                </div>
              </div>
            </section>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg">
                <Terminal className="w-4 h-4" />
                Access Repository
                <ExternalLink className="w-4 h-4" />
              </button>
              <button className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
                <Clock className="w-4 h-4" />
                View Commit History
              </button>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};
