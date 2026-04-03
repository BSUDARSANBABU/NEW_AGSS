import React, { useState, useEffect } from 'react';
import apiService from '../services/api';

export const Footer = () => {
  const [footerData, setFooterData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFooterData = async () => {
      try {
        const data = await apiService.getFooter();
        setFooterData(data[0]); // Footer API returns array, get first item
      } catch (err) {
        console.error('Failed to fetch footer data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchFooterData();
  }, []);

  if (loading) {
    return (
      <footer className="w-full mt-auto bg-[#f3f3f4] dark:bg-slate-900 border-t border-surface-container">
        <div className="flex justify-center items-center py-12">
          <div className="text-sm text-on-surface-variant">Loading...</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full mt-auto bg-[#f3f3f4] dark:bg-slate-900 border-t border-surface-container">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 px-10 py-12 max-w-[1440px] mx-auto font-sans text-xs tracking-wide uppercase">
        <div className="flex flex-col gap-6">
          <span className="text-lg font-black text-[#1a1c1c] dark:text-white">
            {footerData?.company_name || 'DEVFORGE'}
          </span>
          <p className="text-[#3e494b] normal-case tracking-normal max-w-sm">
            {footerData?.company_description || 'PRECISION SYSTEMS FOR MODERN ARCHITECTS. BUILT FOR SCALE, DESIGNED FOR CLARITY.'}
          </p>
          <p className="text-[#3e494b] dark:text-slate-400">
            {footerData?.copyright_text || '© 2024 DEVFORGE Precision Systems. All rights reserved.'}
          </p>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-8">
          <div className="flex flex-col gap-4">
            <p className="font-bold text-on-surface">Platform</p>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">About</a>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">Projects</a>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">Contact</a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-bold text-on-surface">Legal</p>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">Privacy Policy</a>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">Terms of Service</a>
          </div>
          <div className="flex flex-col gap-4">
            <p className="font-bold text-on-surface">Support</p>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">API Documentation</a>
            <a className="text-[#3e494b] dark:text-slate-400 hover:text-[#00606b] transition-colors" href="#">System Status</a>
          </div>
        </div>
      </div>
    </footer>
  );
};
