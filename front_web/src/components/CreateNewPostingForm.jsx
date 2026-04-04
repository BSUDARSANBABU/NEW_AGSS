import React, { useState } from 'react';

const CreateNewPostingForm = () => {
  const [skills, setSkills] = useState([]);
  const [education, setEducation] = useState([]);
  const [experience, setExperience] = useState(0);

  const handleAddSkill = () => {
    const newSkill = prompt('Enter new skill:');
    if (newSkill && newSkill.trim()) {
      setSkills([...skills, newSkill.trim()]);
    }
  };

  const handleRemoveSkill = (index) => {
    setSkills(skills.filter((_, i) => i !== index));
  };

  const handleAddEducation = () => {
    const degree = prompt('Enter degree name:');
    const type = prompt('Enter degree type (e.g., Required Degree, Preferred):');
    if (degree && degree.trim()) {
      setEducation([...education, { degree: degree.trim(), type: type || 'Additional' }]);
    }
  };

  const handleRemoveEducation = (index) => {
    setEducation(education.filter((_, i) => i !== index));
  };

  const handleExperienceChange = (e) => {
    setExperience(parseInt(e.target.value));
  };


  return (
    <div className="col-span-8 bg-surface-container-lowest rounded-3xl p-8 shadow-[0_12px_40px_-8px_rgba(0,31,36,0.08)]">
      <div className="flex items-center justify-between mb-10">
        <h4 className="text-2xl font-extrabold text-on-surface">Create New Posting</h4>
      </div>


      {/* Active Step: Requirements */}
      <div className="space-y-8">
        <div className="grid grid-cols-2 gap-8">
          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              Primary Technical Stack
            </label>
            <div className="flex flex-wrap gap-2">
              {skills.map((skill, index) => (
                <span
                  key={index}
                  className="px-4 py-2 bg-primary text-white rounded-full text-xs font-bold flex items-center gap-2 shadow-lg shadow-primary/20"
                >
                  {skill}
                  <button
                    onClick={() => handleRemoveSkill(index)}
                    className="material-symbols-outlined text-xs hover:text-red-200"
                  >
                    close
                  </button>
                </span>
              ))}
              <button
                onClick={handleAddSkill}
                className="px-4 py-2 border border-dashed border-outline-variant rounded-full text-xs text-on-surface-variant hover:border-primary hover:text-primary transition-all"
              >
                + Add Skill
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
              Education Credentials
            </label>
            <div className="space-y-2">
              {education.map((edu, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-surface-container-low rounded-xl border-l-4 border-primary"
                >
                  <div>
                    <p className="text-sm font-bold">{edu.degree}</p>
                    <p className="text-[10px] text-on-surface-variant uppercase">{edu.type}</p>
                  </div>
                  <button
                    onClick={() => handleRemoveEducation(index)}
                    className="material-symbols-outlined text-on-surface-variant hover:text-error"
                  >
                    delete
                  </button>
                </div>
              ))}
              <div className="flex items-center justify-between p-3 bg-surface-container-lowest border border-outline-variant/30 rounded-xl">
                <p className="text-sm text-on-surface-variant italic">Add additional credentials...</p>
                <button
                  onClick={handleAddEducation}
                  className="material-symbols-outlined text-on-surface-variant"
                >
                  add
                </button>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-[10px] font-black uppercase tracking-widest text-on-surface-variant">
            Experience Threshold
          </label>
          <div className="flex items-center gap-6 p-6 bg-surface-container-low rounded-2xl">
            <div className="flex-1 space-y-4">
              <input
                type="range"
                min="0"
                max="20"
                value={experience}
                onChange={handleExperienceChange}
                className="w-full h-1 bg-surface-container-highest rounded-lg appearance-none cursor-pointer accent-primary"
              />
              <div className="flex justify-between text-[10px] font-bold text-on-surface-variant uppercase">
                <span>Junior</span>
                <span>Mid-Senior</span>
                <span>Principal</span>
              </div>
            </div>
            <div className="text-right">
              <p className="text-3xl font-black text-primary leading-none">{experience}+</p>
              <p className="text-[10px] font-bold uppercase tracking-tight">Years Exp.</p>
            </div>
          </div>
        </div>

        <div className="pt-8 flex justify-end gap-4 border-t border-surface-container">
          <button className="px-8 py-3 bg-primary text-white rounded-full text-sm font-bold hover:shadow-xl hover:shadow-primary/30 transition-all">
            Create Posting
          </button>
        </div>
      </div>
    </div>
  );
};

export default CreateNewPostingForm;
