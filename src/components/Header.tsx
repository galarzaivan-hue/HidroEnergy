import React from 'react';
import { Zap, History, BookOpen, ShieldCheck } from 'lucide-react';
import { HydroPlant } from '../types';

interface HeaderProps {
  selectedPlant: HydroPlant;
  onOpenHistory: () => void;
  onOpenGuide: () => void;
  onOpenDatabase: () => void;
  historyCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  selectedPlant,
  onOpenHistory,
  onOpenGuide,
  onOpenDatabase,
  historyCount,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-[#0B1320]/95 backdrop-blur-md border-b border-[#0051A1] shadow-xl">
      {/* 1. Thin CNDC Gradient Accent Bar (Naranja #E85D04 -> Amarillo #FFB703 -> Azul CNDC #0051A1) */}
      <div className="h-1.5 w-full bg-gradient-to-r from-[#E85D04] via-[#FFB703] to-[#0051A1]" />

      <div className="max-w-md mx-auto px-4 py-3 space-y-2">
        {/* Top Header Row */}
        <div className="flex items-center justify-between gap-2">
          {/* CNDC Emblem + Main Title */}
          <div className="flex items-center gap-2.5">
            {/* Zap Button Container: Azul CNDC (#0051A1) background with Amarillo CNDC (#FFB703) icon */}
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-[#0051A1] border-2 border-[#FFB703] shadow-md shrink-0">
              <Zap className="w-6 h-6 text-[#FFB703] fill-[#FFB703]" />
              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-[#F26522] rounded-full border-2 border-[#0B1320] flex items-center justify-center shadow">
                <ShieldCheck className="w-2.5 h-2.5 text-white" />
              </div>
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-xl font-black text-white tracking-tight leading-none">
                  HydroEnergy
                </h1>
                <span className="text-xs font-bold text-[#F26522] bg-[#F26522]/15 px-2 py-0.5 rounded-md border border-[#F26522]/40 tracking-wider">
                  CNDC
                </span>
              </div>
            </div>
          </div>

          {/* Quick Action Icons */}
          <div className="flex items-center gap-1.5 shrink-0">
            <button
              onClick={onOpenGuide}
              title="Guía Técnica CNDC"
              className="p-2 rounded-xl bg-[#003870]/80 hover:bg-[#0051A1] text-white transition-all border border-[#0051A1] active:scale-95"
            >
              <BookOpen className="w-4 h-4 text-[#FFB703]" />
            </button>

            <button
              onClick={onOpenHistory}
              title="Historial de Cálculos"
              className="relative p-2 rounded-xl bg-[#003870]/80 hover:bg-[#0051A1] text-white transition-all border border-[#0051A1] active:scale-95"
            >
              <History className="w-4 h-4 text-[#F26522]" />
              {historyCount > 0 && (
                <span className="absolute -top-1 -right-1 min-w-4 h-4 px-1 rounded-full bg-[#FFB703] text-slate-950 text-[10px] font-black flex items-center justify-center font-mono-num shadow">
                  {historyCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* CNDC Active Plant Indicator Bar */}
        <div className="flex items-center justify-between text-xs px-3 py-1.5 rounded-lg bg-[#003870]/50 border border-[#0051A1]">
          <span className="text-[11px] text-slate-200 font-medium flex items-center gap-1">
            Central Activa:
            <strong className="text-[#FFB703] font-mono-num ml-0.5">[{selectedPlant.code}]</strong>
            <span className="text-white font-bold truncate max-w-[140px] sm:max-w-xs">{selectedPlant.name}</span>
          </span>

          <button
            onClick={onOpenDatabase}
            className="text-[10px] font-bold text-white bg-[#F26522] hover:bg-[#E85D04] px-2.5 py-0.5 rounded transition-all shrink-0 shadow-sm"
          >
            Cambiar →
          </button>
        </div>
      </div>
    </header>
  );
};


