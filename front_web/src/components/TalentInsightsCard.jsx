import React from 'react';

const TalentInsightsCard = () => {
  return (
    <div className="col-span-4 space-y-8">
      {/* Recommended Profile Summary */}
      <div className="bg-surface-container-low rounded-3xl p-6 border border-white/50">
        <div className="flex items-center gap-2 mb-6">
          <span className="material-symbols-outlined text-primary text-lg">psychology</span>
          <h5 className="text-xs font-black uppercase tracking-widest text-on-surface">Talent Insights</h5>
        </div>
        <div className="space-y-6">
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-on-surface-variant mb-2">Market Difficulty</p>
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-extrabold text-on-surface">No Data</span>
            </div>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm">
            <p className="text-xs text-on-surface-variant mb-2">Average Salary Range</p>
            <div className="flex items-baseline gap-1">
              <span className="text-2xl font-extrabold text-on-surface">Not Available</span>
            </div>
          </div>
          <p className="text-[10px] leading-relaxed text-on-surface-variant/80 italic">
            Connect to recruitment data sources to see market insights.
          </p>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="space-y-3">
        <button className="w-full flex justify-between items-center p-4 bg-surface rounded-2xl border border-outline-variant/20 hover:border-primary transition-colors group">
          <span className="text-sm font-bold text-on-surface">Import JD from Template</span>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
            chevron_right
          </span>
        </button>
        <button className="w-full flex justify-between items-center p-4 bg-surface rounded-2xl border border-outline-variant/20 hover:border-primary transition-colors group">
          <span className="text-sm font-bold text-on-surface">Auto-generate with AI</span>
          <span className="material-symbols-outlined text-primary group-hover:translate-x-1 transition-transform">
            bolt
          </span>
        </button>
      </div>
    </div>
  );
};

export default TalentInsightsCard;
