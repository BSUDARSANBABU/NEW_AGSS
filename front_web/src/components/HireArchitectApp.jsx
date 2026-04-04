import React from 'react';
import { Header } from './Header';
import JobPostingPage from './JobPostingPage';

const HireArchitectApp = () => {
  return (
    <div className="bg-surface text-on-surface selection:bg-primary-fixed selection:text-on-primary-fixed">
      {/* Main Header */}
      <Header showProfile={false} activeTab="hiring" />

      {/* Main Content Area */}
      <JobPostingPage />
    </div>
  );
};

export default HireArchitectApp;
