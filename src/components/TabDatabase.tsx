import React, { useState } from 'react';
import { HYDRO_PLANTS } from '../data/plants';
import { HydroPlant, TabType } from '../types';
import { formatNum } from '../utils/formatters';
import {
  Search,
  Droplet,
  Waves,
  Zap,
  HardDrive,
  ArrowUpDown,
  CheckCircle2,
  MapPin,
} from 'lucide-react';

interface TabDatabaseProps {
  selectedPlant: HydroPlant;
  onSelectPlantAndNavigate: (plant: HydroPlant, tab: TabType) => void;
}

type SortField = 'code' | 'name' | 'volMaxHm3' | 'capacityMW' | 'kProd';

export const TabDatabase: React.FC<TabDatabaseProps> = ({
  selectedPlant,
  onSelectPlantAndNavigate,
}) => {
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [sortField, setSortField] = useState<SortField>('capacityMW');
  const [sortAsc, setSortAsc] = useState<boolean>(false); // default descending capacity

  // Calculate totals for system summary card
  const totalCapacityMW = HYDRO_PLANTS.reduce((sum, p) => sum + p.capacityMW, 0);
  const totalVolMaxHm3 = HYDRO_PLANTS.reduce((sum, p) => sum + p.volMaxHm3, 0);

  // Filter plants based on search query
  const filteredPlants = HYDRO_PLANTS.filter(plant => {
    const term = searchTerm.toLowerCase().trim();
    return (
      plant.code.toLowerCase().includes(term) ||
      plant.name.toLowerCase().includes(term) ||
      plant.fullName.toLowerCase().includes(term) ||
      (plant.location && plant.location.toLowerCase().includes(term))
    );
  });

  // Sort plants
  const sortedPlants = [...filteredPlants].sort((a, b) => {
    let valA = a[sortField];
    let valB = b[sortField];

    if (typeof valA === 'string' && typeof valB === 'string') {
      return sortAsc ? valA.localeCompare(valB) : valB.localeCompare(valA);
    }
    return sortAsc ? (valA as number) - (valB as number) : (valB as number) - (valA as number);
  });

  const handleSort = (field: SortField) => {
    if (sortField === field) {
      setSortAsc(!sortAsc);
    } else {
      setSortField(field);
      setSortAsc(false); // default descending for numbers
    }
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* System Summary Header Card */}
      <div className="bg-gradient-to-r from-[#0B1320] via-[#1e293b] to-[#0B1320] rounded-2xl p-4 border border-[#0051A1] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0051A1] text-white border border-[#0051A1]">
              <Zap className="w-5 h-5 text-[#FFB703]" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-white">
                Base de Datos de Embalses y Centrales (CNDC)
              </h2>
              <p className="text-[11px] text-slate-300">
                11 Unidades Generadoras Hidroeléctricas en Sistema
              </p>
            </div>
          </div>
        </div>

        {/* Aggregate Stats */}
        <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-[#0051A1]">
            <span className="text-[10px] uppercase text-slate-300 font-semibold flex items-center gap-1">
              <Zap className="w-3 h-3 text-[#FFB703]" />
              Cap. Total Instalada
            </span>
            <div className="text-base font-extrabold text-white font-mono-num mt-0.5">
              {formatNum(totalCapacityMW, 2)} <span className="text-xs font-semibold text-[#FFB703]">MW</span>
            </div>
          </div>

          <div className="bg-slate-950/80 rounded-xl p-2.5 border border-[#0051A1]">
            <span className="text-[10px] uppercase text-slate-300 font-semibold flex items-center gap-1">
              <HardDrive className="w-3 h-3 text-[#FFB703]" />
              Almacenamiento Total
            </span>
            <div className="text-base font-extrabold text-[#FFB703] font-mono-num mt-0.5">
              {formatNum(totalVolMaxHm3, 3)} <span className="text-xs font-semibold text-white">hm³</span>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar & Sorting Controls */}
      <div className="bg-[#1e293b] rounded-2xl p-3 border border-[#0051A1] shadow-lg space-y-2.5">
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Buscar central por código o nombre..."
            className="w-full bg-slate-900 text-white text-xs font-medium rounded-xl pl-10 pr-4 py-2.5 border border-slate-700 focus:border-[#0051A1] focus:outline-none"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-white"
            >
              ✕
            </button>
          )}
        </div>

        {/* Quick Sort Chips */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 text-[11px] text-slate-300">
          <span className="text-slate-400 text-[10px] font-semibold uppercase flex items-center gap-1 shrink-0">
            <ArrowUpDown className="w-3 h-3" /> Ordenar:
          </span>
          <button
            onClick={() => handleSort('capacityMW')}
            className={`px-2.5 py-1 rounded-lg font-mono-num shrink-0 transition-all ${
              sortField === 'capacityMW'
                ? 'bg-[#0051A1] text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Capacidad (MW) {sortField === 'capacityMW' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSort('kProd')}
            className={`px-2.5 py-1 rounded-lg font-mono-num shrink-0 transition-all ${
              sortField === 'kProd'
                ? 'bg-[#F26522] text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Kprod {sortField === 'kProd' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSort('volMaxHm3')}
            className={`px-2.5 py-1 rounded-lg font-mono-num shrink-0 transition-all ${
              sortField === 'volMaxHm3'
                ? 'bg-[#0051A1] text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Vol. Máx {sortField === 'volMaxHm3' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
          <button
            onClick={() => handleSort('code')}
            className={`px-2.5 py-1 rounded-lg font-mono-num shrink-0 transition-all ${
              sortField === 'code'
                ? 'bg-[#F26522] text-white font-bold'
                : 'bg-slate-800 text-slate-300 hover:bg-slate-700'
            }`}
          >
            Nombre {sortField === 'code' ? (sortAsc ? '↑' : '↓') : ''}
          </button>
        </div>
      </div>

      {/* Main Table / Mobile Card Views */}
      <div className="space-y-3">
        {sortedPlants.length === 0 ? (
          <div className="p-8 text-center bg-[#1e293b] rounded-2xl border border-slate-700/80 text-slate-400">
            No se encontraron centrales con el criterio "{searchTerm}".
          </div>
        ) : (
          sortedPlants.map((plant) => {
            const isSelected = plant.code === selectedPlant.code;
            return (
              <div
                key={plant.code}
                className={`bg-[#1e293b] rounded-2xl p-4 border transition-all duration-200 shadow-lg space-y-3 ${
                  isSelected
                    ? 'border-[#F26522] bg-slate-900/90 ring-1 ring-[#F26522]'
                    : 'border-[#0051A1]/40 hover:border-[#0051A1]'
                }`}
              >
                {/* Header Row */}
                <div className="flex items-start justify-between">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="text-base font-extrabold text-white">
                        [{plant.code}] {plant.name}
                      </h3>
                      {isSelected && (
                        <span className="text-[10px] font-bold text-[#FFB703] bg-[#003870] px-1.5 py-0.5 rounded border border-[#0051A1] flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-[#FFB703]" />
                          Seleccionada
                        </span>
                      )}
                    </div>
                    {plant.location && (
                      <p className="text-[11px] text-slate-400 flex items-center gap-1 mt-1">
                        <MapPin className="w-3 h-3 text-slate-500" />
                        {plant.location}
                      </p>
                    )}
                  </div>
                </div>

                {/* Technical Parameters Matrix */}
                <div className="grid grid-cols-3 gap-2 bg-slate-900/90 rounded-xl p-2.5 border border-slate-800 text-center">
                  {/* Vol Max */}
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Vol. Máx
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-slate-200 font-mono-num">
                      {formatNum(plant.volMaxHm3, 3)}
                    </span>
                    <span className="text-[9px] text-slate-500 block">hm³</span>
                  </div>

                  {/* Cap. Instalada */}
                  <div className="border-x border-slate-800">
                    <span className="text-[9px] uppercase tracking-wider text-slate-400 font-semibold block">
                      Capacidad
                    </span>
                    <span className="text-xs sm:text-sm font-bold text-white font-mono-num">
                      {formatNum(plant.capacityMW, 2)}
                    </span>
                    <span className="text-[9px] text-slate-500 block">MW</span>
                  </div>

                  {/* Kprod */}
                  <div>
                    <span className="text-[9px] uppercase tracking-wider text-[#FFB703] font-semibold block">
                      Kprod
                    </span>
                    <span className="text-xs sm:text-sm font-extrabold text-[#F26522] font-mono-num">
                      {formatNum(plant.kProd, 3)}
                    </span>
                    <span className="text-[9px] text-[#FFB703] block">MW/(m³/s)</span>
                  </div>
                </div>

                {plant.notes && (
                  <p className="text-[11px] text-slate-400 italic">
                    {plant.notes}
                  </p>
                )}

                {/* Quick Action Navigation Buttons per specs */}
                <div className="grid grid-cols-2 gap-2 pt-1 border-t border-slate-800">
                  <button
                    onClick={() => onSelectPlantAndNavigate(plant, 'volume')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#F26522] hover:bg-[#E85D04] text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <Droplet className="w-3.5 h-3.5 text-[#FFB703]" />
                    Calc. por Volumen
                  </button>

                  <button
                    onClick={() => onSelectPlantAndNavigate(plant, 'flow')}
                    className="flex items-center justify-center gap-1.5 py-2 px-2 rounded-xl bg-[#0051A1] hover:bg-[#003870] text-white text-xs font-bold transition-all active:scale-95 shadow-sm"
                  >
                    <Waves className="w-3.5 h-3.5 text-[#FFB703]" />
                    Calc. por Caudal
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>
    </div>
  );
};

