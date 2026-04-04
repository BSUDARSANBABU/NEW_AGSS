import React from 'react';

const RecruitmentPipeline = () => {
  return (
    <section className="space-y-6">
      <div className="flex justify-between items-end">
        <div>
          <h2 className="text-sm font-bold tracking-widest text-on-surface-variant uppercase mb-1">
            Global Health
          </h2>
          <h3 className="text-4xl font-extrabold tracking-tight text-on-surface">Recruitment Pipeline</h3>
        </div>
        <div className="flex gap-2">
          <span className="px-3 py-1 bg-primary-fixed/20 text-primary text-xs font-bold rounded-full">
            ACTIVE: 0 POSTINGS
          </span>
        </div>
      </div>

      <div className="text-center py-12 bg-surface-container-lowest rounded-2xl">
        <p className="text-on-surface-variant">No recruitment data available</p>
      </div>
    </section>
  );
};

export default RecruitmentPipeline;
