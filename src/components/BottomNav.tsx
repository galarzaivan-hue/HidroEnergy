import React from 'react';
import { Droplet, Waves, Database } from 'lucide-react';
import { TabType } from '../types';

interface BottomNavProps {
  activeTab: TabType;
  onTabChange: (tab: TabType) => void;
}

export const BottomNav: React.FC<BottomNavProps> = ({ activeTab, onTabChange }) => {
  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-[#0B1320]/95 backdrop-blur-lg border-t-2 border-[#0051A1] px-3 py-2 pb-safe shadow-2xl">
      <div className="max-w-md mx-auto grid grid-cols-3 gap-1.5">
        {/* Tab 1: Volume */}
        <button
          onClick={() => onTabChange('volume')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'volume'
              ? 'bg-[#0051A1] text-white font-bold shadow-md border border-[#FFB703]/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#003870]/40'
          }`}
        >
          <Droplet className={`w-5 h-5 mb-1 ${activeTab === 'volume' ? 'text-[#FFB703]' : ''}`} />
          <span className="text-[11px] tracking-tight leading-tight">1. Vol → MWh</span>
        </button>

        {/* Tab 2: Flow */}
        <button
          onClick={() => onTabChange('flow')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'flow'
              ? 'bg-[#0051A1] text-white font-bold shadow-md border border-[#FFB703]/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#003870]/40'
          }`}
        >
          <Waves className={`w-5 h-5 mb-1 ${activeTab === 'flow' ? 'text-[#FFB703]' : ''}`} />
          <span className="text-[11px] tracking-tight leading-tight">2. Caudal → MWh</span>
        </button>

        {/* Tab 3: Database */}
        <button
          onClick={() => onTabChange('database')}
          className={`flex flex-col items-center justify-center py-2 px-1 rounded-xl transition-all duration-200 active:scale-95 ${
            activeTab === 'database'
              ? 'bg-[#0051A1] text-white font-bold shadow-md border border-[#FFB703]/50'
              : 'text-slate-400 hover:text-slate-200 hover:bg-[#003870]/40'
          }`}
        >
          <Database className={`w-5 h-5 mb-1 ${activeTab === 'database' ? 'text-[#FFB703]' : ''}`} />
          <span className="text-[11px] tracking-tight leading-tight">3. Embalses BD</span>
        </button>
      </div>
    </nav>
  );
};


