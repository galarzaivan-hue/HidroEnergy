import React from 'react';
import { HYDRO_PLANTS } from '../data/plants';
import { HydroPlant } from '../types';
import { formatNum } from '../utils/formatters';
import { ChevronDown, Gauge, HardDrive, Zap, Building2 } from 'lucide-react';

interface PlantSelectorProps {
  selectedPlant: HydroPlant;
  onSelectPlant: (plant: HydroPlant) => void;
}

export const PlantSelector: React.FC<PlantSelectorProps> = ({
  selectedPlant,
  onSelectPlant,
}) => {
  return (
    <div className="bg-[#1e293b] rounded-2xl p-4 border-2 border-[#0051A1] shadow-xl space-y-3">
      <div className="flex items-center justify-between">
        <label htmlFor="plant-select" className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Building2 className="w-4 h-4 text-[#FFB703]" />
          Embalse / Central (CNDC)
        </label>
        <span className="text-[10px] font-mono-num font-bold px-2 py-0.5 rounded bg-[#0051A1] text-white border border-[#0051A1]">
          11 Unidades CNDC
        </span>
      </div>

      {/* Selector Dropdown */}
      <div className="relative">
        <select
          id="plant-select"
          value={selectedPlant.code}
          onChange={(e) => {
            const plant = HYDRO_PLANTS.find(p => p.code === e.target.value);
            if (plant) onSelectPlant(plant);
          }}
          className="w-full appearance-none bg-slate-900 text-white text-base font-bold rounded-xl px-4 py-3.5 pr-10 border-2 border-slate-700 hover:border-[#0051A1] focus:border-[#FFB703] focus:outline-none focus:ring-2 focus:ring-[#FFB703]/30 transition-all cursor-pointer shadow-inner truncate"
        >
          {HYDRO_PLANTS.map((plant) => (
            <option key={plant.code} value={plant.code} className="bg-slate-900 text-white py-2">
              [{plant.code}] {plant.name}
            </option>
          ))}
        </select>
        <div className="absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none text-[#FFB703]">
          <ChevronDown className="w-5 h-5" />
        </div>
      </div>

      {/* Prominent Kprod and Tech Spec Badges */}
      <div className="grid grid-cols-3 gap-2 pt-1">
        {/* Kprod Badge - Highlighted in Naranja/Amarillo CNDC */}
        <div className="bg-slate-900/90 border-2 border-[#F26522] rounded-xl p-2.5 text-center flex flex-col items-center justify-center shadow-md">
          <span className="text-[10px] uppercase tracking-wider text-[#FFB703] font-extrabold flex items-center gap-1">
            <Gauge className="w-3.5 h-3.5 text-[#F26522]" />
            Kprod
          </span>
          <span className="text-base sm:text-lg font-black text-[#F26522] font-mono-num mt-0.5">
            {formatNum(selectedPlant.kProd, 3)}
          </span>
          <span className="text-[9px] text-[#FFB703] font-medium">MW/(m³/s)</span>
        </div>

        {/* Installed Capacity */}
        <div className="bg-slate-900/80 border border-[#0051A1] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-200 font-bold flex items-center gap-1">
            <Zap className="w-3 h-3 text-[#FFB703]" />
            Cap. Inst.
          </span>
          <span className="text-sm sm:text-base font-bold text-white font-mono-num mt-0.5">
            {formatNum(selectedPlant.capacityMW, 2)}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">MW</span>
        </div>

        {/* Vol Max */}
        <div className="bg-slate-900/80 border border-[#0051A1] rounded-xl p-2.5 text-center flex flex-col items-center justify-center">
          <span className="text-[10px] uppercase tracking-wider text-slate-200 font-bold flex items-center gap-1">
            <HardDrive className="w-3 h-3 text-[#FFB703]" />
            Vol. Máx
          </span>
          <span className="text-sm sm:text-base font-bold text-white font-mono-num mt-0.5">
            {formatNum(selectedPlant.volMaxHm3, 3)}
          </span>
          <span className="text-[9px] text-slate-400 font-medium">hm³</span>
        </div>
      </div>
    </div>
  );
};


