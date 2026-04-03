import React from 'react';
import { motion } from 'motion/react';
import { X, ExternalLink, Mail, Phone, MapPin, Calendar, Award, Briefcase, Github, Linkedin, Terminal, Verified, Clock, Users, Code } from 'lucide-react';
import { cn } from '../lib/utils';

export const DeveloperDetails = ({ developer, projects, onClose }) => (
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
      {/* Hero Section */}
      <div className="relative h-64 sm:h-80 shrink-0 bg-gradient-to-br from-primary to-primary-container">
        <div className="absolute inset-0 bg-gradient-to-t from-on-background via-on-background/20 to-transparent"></div>
        
        <button 
          onClick={onClose}
          className="absolute top-6 right-6 p-2 bg-white/10 text-white rounded-full hover:bg-white/20 transition-all backdrop-blur-md border border-white/20"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="absolute bottom-0 left-0 right-0 p-10">
          <div className="flex items-end gap-6">
            <div className="w-24 h-24 rounded-2xl bg-surface-container overflow-hidden border-4 border-surface-container-lowest shadow-xl">
              <img
                src={developer.profile_image || developer.avatar}
                alt={developer.name}
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="flex-1 pb-2">
              <div className="flex items-center gap-3 mb-2">
                <h2 className="text-4xl font-bold tracking-tighter text-white">{developer.name}</h2>
                {developer.available && (
                  <span className="px-3 py-1 bg-green-500/20 text-green-100 text-[10px] font-bold rounded-full uppercase tracking-wider backdrop-blur-md border border-green-400/30">
                    Available
                  </span>
                )}
              </div>
              <p className="text-lg font-medium text-white/90">{developer.title || developer.role}</p>
              <div className="flex items-center gap-4 mt-2 text-white/80 text-sm">
                <div className="flex items-center gap-1">
                  <MapPin className="w-4 h-4" />
                  <span>{developer.location || 'Remote'}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Briefcase className="w-4 h-4" />
                  <span>{developer.experience_years || '0'} years experience</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Content Grid */}
      <div className="p-10 grid grid-cols-1 lg:grid-cols-3 gap-10">
        <div className="lg:col-span-2 space-y-8">
          {/* About Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-primary" />
              About
            </h3>
            <div className="text-on-surface-variant leading-relaxed">
              <p className="text-lg">
                {developer.bio || `Passionate ${developer.title || developer.role} with ${developer.experience_years || 0}+ years of experience building scalable solutions. Specialized in ${developer.skills ? developer.skills.split(',').slice(0, 3).join(', ') : 'modern technologies'}.`}
              </p>
            </div>
          </section>
          
          {/* Skills Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Code className="w-5 h-5 text-primary" />
              Technical Skills
            </h3>
            <div className="flex flex-wrap gap-3">
              {(developer.skills ? developer.skills.split(',').map(s => s.trim()) : []).map((skill) => (
                <div key={skill} className="px-4 py-2 bg-surface-container-low rounded-xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                  <span className="text-sm font-bold text-on-surface">{skill}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Projects Section */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" />
              Projects
            </h3>
            {projects && projects.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {projects.map((project) => (
                  <div key={project.id} className="p-4 bg-surface-container-low rounded-2xl border border-outline-variant/10 hover:border-primary/30 transition-all">
                    <div className="flex justify-between items-start mb-3">
                      <h4 className="font-bold text-on-surface">{project.title}</h4>
                      <span className={cn(
                        "px-2 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider",
                        project.status === 'Active' && "bg-primary-container/20 text-primary",
                        project.status === 'Completed' && "bg-secondary-container/20 text-secondary",
                        project.status === 'Staging' && "bg-tertiary-container/20 text-tertiary"
                      )}>
                        {project.status}
                      </span>
                    </div>
                    <p className="text-sm text-on-surface-variant mb-3 line-clamp-2">{project.description || project.desc}</p>
                    <div className="flex flex-wrap gap-2 mb-3">
                      {(project.tech || []).slice(0, 3).map((tech) => (
                        <span key={tech} className="px-2 py-1 bg-surface-container text-[10px] font-bold text-primary rounded-full">
                          {tech}
                        </span>
                      ))}
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-xs text-on-surface-variant">{project.category}</span>
                      {project.github_link && (
                        <a href={project.github_link} target="_blank" rel="noopener noreferrer" className="text-primary hover:text-primary-container transition-colors">
                          <Github className="w-4 h-4" />
                        </a>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-on-surface-variant">
                <Award className="w-12 h-12 mx-auto mb-3 opacity-50" />
                <p>No projects available</p>
              </div>
            )}
          </section>
        </div>
        
        <div className="space-y-8">
          {/* Contact Information */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface">Contact Information</h3>
            <div className="space-y-3">
              {developer.email && (
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <Mail className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface-variant">{developer.email}</span>
                </div>
              )}
              {developer.phone && (
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <Phone className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface-variant">{developer.phone}</span>
                </div>
              )}
              {developer.location && (
                <div className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl">
                  <MapPin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface-variant">{developer.location}</span>
                </div>
              )}
            </div>
          </section>
          
          {/* Social Links */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface">Connect</h3>
            <div className="space-y-3">
              {developer.github_link && (
                <a href={developer.github_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all">
                  <Terminal className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface">GitHub Profile</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-on-surface-variant" />
                </a>
              )}
              {developer.linkedin_link && (
                <a href={developer.linkedin_link} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-3 bg-surface-container-low rounded-xl hover:bg-surface-container transition-all">
                  <Linkedin className="w-4 h-4 text-primary" />
                  <span className="text-sm text-on-surface">LinkedIn Profile</span>
                  <ExternalLink className="w-3 h-3 ml-auto text-on-surface-variant" />
                </a>
              )}
            </div>
          </section>

          {/* Availability & Stats */}
          <section className="space-y-4">
            <h3 className="text-lg font-bold text-on-surface">Quick Stats</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="p-3 bg-surface-container-low rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{developer.experience_years || '0'}</div>
                <div className="text-xs text-on-surface-variant">Years Experience</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{developer.skills ? developer.skills.split(',').length : '0'}</div>
                <div className="text-xs text-on-surface-variant">Technical Skills</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl text-center">
                <div className="text-2xl font-bold text-primary">{projects ? projects.length : '0'}</div>
                <div className="text-xs text-on-surface-variant">Projects Completed</div>
              </div>
              <div className="p-3 bg-surface-container-low rounded-xl text-center">
                <div className={`text-2xl font-bold ${developer.available ? 'text-green-600' : 'text-orange-600'}`}>
                  {developer.available ? 'Yes' : 'No'}
                </div>
                <div className="text-xs text-on-surface-variant">Available</div>
              </div>
            </div>
          </section>
          
          {/* Action Buttons */}
          <div className="space-y-3">
            <button className="w-full py-3 bg-primary text-white font-bold rounded-xl hover:bg-primary-container transition-all flex items-center justify-center gap-2 shadow-lg">
              <Mail className="w-4 h-4" />
              Send Message
            </button>
            <button className="w-full py-3 bg-surface-container-high text-on-surface font-bold rounded-xl hover:bg-surface-container-highest transition-all flex items-center justify-center gap-2">
              <Users className="w-4 h-4" />
              Schedule Interview
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  </motion.div>
);
