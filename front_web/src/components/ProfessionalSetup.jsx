import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfessionalSetup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    experience: '',
    expertise: [],
    company: '',
    role: '',
    linkedin: '',
    portfolio: '',
    bio: ''
  });

  const expertiseOptions = [
    'Frontend Development',
    'Backend Development', 
    'Full Stack Development',
    'Mobile Development',
    'DevOps',
    'UI/UX Design',
    'Data Science',
    'Machine Learning',
    'Cloud Architecture',
    'Cybersecurity'
  ];

  const experienceLevels = [
    '0-1 years (Junior)',
    '1-3 years (Mid)', 
    '3-5 years (Senior)',
    '5-10 years (Lead)',
    '10+ years (Principal)'
  ];

  const handleBack = () => {
    navigate('/projects');
  };

  const handleNext = () => {
    navigate('/workspace-sync');
  };

  const handleExpertiseToggle = (expertise) => {
    setFormData(prev => ({
      ...prev,
      expertise: prev.expertise.includes(expertise)
        ? prev.expertise.filter(e => e !== expertise)
        : [...prev.expertise, expertise]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="bg-surface text-on-surface min-h-screen flex flex-col font-['Plus_Jakarta_Sans'] antialiased tracking-tight">
      {/* Header */}
      <header className="flex items-center justify-between px-8 py-6 border-b border-outline-variant/20">
        <div className="flex items-center gap-4">
          <button 
            onClick={handleBack}
            className="p-2 rounded-lg hover:bg-surface-container-low transition-colors"
          >
            <span className="material-symbols-outlined">arrow_back</span>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-on-surface">Professional Setup</h1>
            <p className="text-sm text-on-surface-variant mt-1">Tell us about your professional background</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-xs font-bold">1</div>
          <div className="w-12 h-0.5 bg-outline-variant/30"></div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-xs font-bold">2</div>
          <div className="w-12 h-0.5 bg-outline-variant/30"></div>
          <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-on-primary text-xs font-bold">3</div>
          <div className="w-12 h-0.5 bg-outline-variant/30"></div>
          <div className="w-8 h-8 bg-surface-container-low border-2 border-outline-variant/50 rounded-full flex items-center justify-center text-on-surface-variant text-xs font-bold">4</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 px-8 py-8 max-w-4xl mx-auto w-full">
        <form className="space-y-8" onSubmit={(e) => { e.preventDefault(); handleNext(); }}>
          {/* Experience Level */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Experience Level</span>
              <select 
                name="experience"
                value={formData.experience}
                onChange={handleInputChange}
                className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                required
              >
                <option value="">Select your experience level</option>
                {experienceLevels.map(level => (
                  <option key={level} value={level}>{level}</option>
                ))}
              </select>
            </label>
          </div>

          {/* Expertise Areas */}
          <div className="space-y-4">
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Areas of Expertise</span>
              <span className="text-xs text-on-surface-variant ml-2">(Select all that apply)</span>
            </label>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {expertiseOptions.map(expertise => (
                <label 
                  key={expertise}
                  className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-colors ${
                    formData.expertise.includes(expertise)
                      ? 'border-primary bg-primary/5 text-primary'
                      : 'border-outline-variant/30 hover:border-outline-variant/50'
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={formData.expertise.includes(expertise)}
                    onChange={() => handleExpertiseToggle(expertise)}
                    className="rounded border-outline-variant text-primary focus:ring-primary"
                  />
                  <span className="text-sm">{expertise}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Company and Role */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">Current Company</span>
                <input
                  type="text"
                  name="company"
                  value={formData.company}
                  onChange={handleInputChange}
                  placeholder="e.g., Tech Corp"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">Current Role</span>
                <input
                  type="text"
                  name="role"
                  value={formData.role}
                  onChange={handleInputChange}
                  placeholder="e.g., Senior Developer"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
            </div>
          </div>

          {/* LinkedIn and Portfolio */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">LinkedIn Profile</span>
                <input
                  type="url"
                  name="linkedin"
                  value={formData.linkedin}
                  onChange={handleInputChange}
                  placeholder="https://linkedin.com/in/yourprofile"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
            </div>
            <div className="space-y-2">
              <label className="block">
                <span className="text-sm font-semibold text-on-surface">Portfolio Website</span>
                <input
                  type="url"
                  name="portfolio"
                  value={formData.portfolio}
                  onChange={handleInputChange}
                  placeholder="https://yourportfolio.com"
                  className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors"
                />
              </label>
            </div>
          </div>

          {/* Bio */}
          <div className="space-y-2">
            <label className="block">
              <span className="text-sm font-semibold text-on-surface">Professional Bio</span>
              <span className="text-xs text-on-surface-variant ml-2">(Brief description about yourself)</span>
              <textarea
                name="bio"
                value={formData.bio}
                onChange={handleInputChange}
                rows={4}
                placeholder="Tell us about your professional journey, achievements, and what you're passionate about..."
                className="mt-2 block w-full px-4 py-3 rounded-lg border border-outline-variant/50 bg-surface text-on-surface focus:border-primary focus:ring-2 focus:ring-primary/20 transition-colors resize-none"
              />
            </label>
          </div>

          {/* Action Buttons */}
          <div className="flex justify-between items-center pt-8 border-t border-outline-variant/20">
            <button
              type="button"
              onClick={handleBack}
              className="px-6 py-3 text-on-surface-variant hover:text-on-surface font-medium transition-colors"
            >
              Back
            </button>
            <button
              type="submit"
              className="px-8 py-3 bg-primary text-on-primary rounded-lg font-medium hover:bg-primary/90 transition-colors"
            >
              Continue to Workspace Setup
            </button>
          </div>
        </form>
      </main>

      {/* Visual Footer Accent */}
      <footer className="p-8 flex justify-center opacity-20 pointer-events-none">
        <div className="h-1 w-24 bg-primary/20 rounded-full"></div>
      </footer>
    </div>
  );
};

export default ProfessionalSetup;
