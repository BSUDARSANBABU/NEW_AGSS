import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useOnboardingFlow from '../hooks/useOnboardingFlow';

const ProfileSetup = () => {
  const navigate = useNavigate();
  const { markStepCompleted: completeStep } = useOnboardingFlow();
  const [selectedSkills, setSelectedSkills] = useState(['Data Modeling', 'HL7 / FHIR']);
  const [professionalTitle, setProfessionalTitle] = useState('');
  const [professionalSummary, setProfessionalSummary] = useState('');

  const availableSkills = [
    'Clinical NLP',
    'React Native', 
    'Python',
    'AWS Health'
  ];

  const handleSkillToggle = (skill) => {
    setSelectedSkills(prev => 
      prev.includes(skill) 
        ? prev.filter(s => s !== skill)
        : [...prev, skill]
    );
  };

  const handleSaveProfile = async () => {
    try {
      // Save profile logic here
      console.log('Saving profile:', {
        title: professionalTitle,
        summary: professionalSummary,
        skills: selectedSkills
      });
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      completeStep('profile-setup');
      navigate('/professional-setup');
    } catch (error) {
      console.error('Error saving profile:', error);
    }
  };

  const handleBack = () => {
    navigate('/projects');
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    handleSaveProfile();
  };

  return (
    <div className="bg-white text-on-surface min-h-screen flex flex-col">
      {/* Top Navigation Bar */}
      <nav className="w-full top-0 flex justify-between items-center px-8 py-6 max-w-full bg-white">
        <div className="text-xl font-bold text-[#1a1c1c] font-['Plus_Jakarta_Sans'] tracking-tight">
          Clinical Architect
        </div>
        <div className="flex items-center gap-4">
          <button className="material-symbols-outlined text-primary p-2 hover:bg-surface transition-colors rounded-full">
            help_outline
          </button>
        </div>
      </nav>

      <main className="flex-1 px-8 py-8 max-w-4xl mx-auto w-full">
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Left Section - Form */}
          <div className="flex-1">
            <div className="mb-8">
              <h1 className="text-3xl font-bold text-on-surface mb-2">Profile Setup</h1>
              <p className="text-on-surface-variant">Configure your professional profile and technical expertise</p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
              {/* Professional Title */}
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.1em] text-on-surface">Professional Title</label>
                <div className="relative">
                  <input
                    type="text"
                    value={professionalTitle}
                    onChange={(e) => setProfessionalTitle(e.target.value)}
                    placeholder="e.g., Senior Clinical Data Engineer"
                    className="w-full px-4 py-4 bg-white ghost-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm"
                    required
                  />
                </div>
              </div>

              {/* Skills Selection */}
              <div>
                <label className="text-[11px] uppercase font-bold tracking-[0.1em] text-on-surface">Technical Skills</label>
                <div className="grid grid-cols-2 gap-3 mt-3">
                  {availableSkills.map(skill => (
                    <label
                      key={skill}
                      className={`flex items-center gap-3 p-3 rounded-lg border cursor-pointer transition-all ${
                        selectedSkills.includes(skill)
                          ? 'border-primary bg-primary/5 text-primary'
                          : 'border-outline-variant/30 hover:border-outline-variant/50'
                      }`}
                    >
                      <input
                        type="checkbox"
                        checked={selectedSkills.includes(skill)}
                        onChange={() => handleSkillToggle(skill)}
                        className="rounded border-outline-variant text-primary focus:ring-primary"
                      />
                      <span className="text-sm">{skill}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Professional Summary */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <label className="text-[11px] uppercase font-bold tracking-[0.1em] text-on-surface">Professional Summary</label>
                  <div className="group relative flex items-center">
                    <span className="material-symbols-outlined text-sm text-outline-variant cursor-help">info</span>
                    <div className="absolute bottom-full right-0 mb-2 w-56 p-3 bg-on-surface text-white text-[10px] rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none z-20 shadow-xl leading-relaxed">
                      Highlight your specific experience with medical data standards and system interoperability.
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <textarea
                    className="w-full px-4 py-4 bg-white ghost-border rounded-lg focus:ring-2 focus:ring-primary/20 focus:border-primary outline-none transition-all text-sm resize-none"
                    placeholder="Briefly describe your expertise in medical infrastructure and system design..."
                    rows="5"
                    value={professionalSummary}
                    onChange={(e) => setProfessionalSummary(e.target.value)}
                    required
                  ></textarea>
                </div>
                <div className="flex justify-between items-center mt-2">
                  <p className="text-[11px] text-on-surface-variant opacity-60">Help teams understand your technical value proposition.</p>
                  <p className="text-[10px] font-bold text-on-surface-variant tracking-wider">{professionalSummary.length} / 250</p>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center justify-between pt-6 border-t border-outline-variant/10">
                <button 
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-2 text-on-surface-variant font-bold text-sm hover:text-primary transition-colors py-2"
                >
                  <span className="material-symbols-outlined text-base">arrow_back</span>
                  Back
                </button>
                <button 
                  type="submit"
                  className="bg-primary text-on-primary px-12 py-4 rounded-lg font-bold text-sm shadow-[0_4px_14px_rgba(0,122,138,0.3)] hover:shadow-[0_6px_20px_rgba(0,122,138,0.4)] hover:-translate-y-0.5 transition-all active:scale-[0.98] active:translate-y-0"
                >
                  Continue to Professional Setup
                </button>
              </div>
            </form>
          </div>

          {/* Right Section - Progress Indicator */}
          <div className="lg:w-80">
            <div className="sticky top-8 space-y-8">
              {/* Progress Card */}
              <div className="bg-surface-container-lowest p-6 rounded-xl border border-outline-variant/20">
                <h3 className="font-semibold text-on-surface mb-4">Setup Progress</h3>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                    <span className="text-sm text-on-surface">Welcome</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">✓</div>
                    <span className="text-sm text-on-surface">Discover Projects</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center text-white text-xs font-bold">3</div>
                    <span className="text-sm font-medium text-primary">Profile Setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-outline-variant/30 rounded-full flex items-center justify-center text-on-surface-variant text-xs font-bold">4</div>
                    <span className="text-sm text-on-surface-variant">Professional Setup</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 bg-outline-variant/30 rounded-full flex items-center justify-center text-on-surface-variant text-xs font-bold">5</div>
                    <span className="text-sm text-on-surface-variant">Workspace Sync</span>
                  </div>
                </div>
              </div>

              {/* Tips Card */}
              <div className="bg-primary/5 p-6 rounded-xl border border-primary/20">
                <h3 className="font-semibold text-primary mb-3">💡 Pro Tip</h3>
                <p className="text-sm text-on-surface-variant leading-relaxed">
                  Complete your profile with accurate skills and experience to get matched with most relevant projects and team opportunities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Visual Footer Accent */}
      <footer className="p-8 flex justify-center opacity-20 pointer-events-none">
        <div className="h-1 w-24 bg-primary/20 rounded-full"></div>
      </footer>
    </div>
  );
};

export default ProfileSetup;
