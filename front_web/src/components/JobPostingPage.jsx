import React from 'react';
import RecruitmentPipeline from './RecruitmentPipeline';
import CreateNewPostingForm from './CreateNewPostingForm';
import TalentInsightsCard from './TalentInsightsCard';

const JobPostingPage = () => {
  return (
    <main className="min-h-screen">
      <div className="p-10 max-w-7xl mx-auto space-y-12">
        {/* Recruitment Pipeline Summary */}
        <RecruitmentPipeline />

        {/* Main Content Grid */}
        <div className="grid grid-cols-12 gap-10">
          {/* Job Creation Workspace */}
          <CreateNewPostingForm />

          {/* Technical Context Panel */}
          <TalentInsightsCard />
        </div>
      </div>
    </main>
  );
};

export default JobPostingPage;
