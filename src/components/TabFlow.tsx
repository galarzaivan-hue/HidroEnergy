import React, { useState } from 'react';
import { HydroPlant, CalculationHistoryItem } from '../types';
import { TIME_PRESETS } from '../data/plants';
import { PlantSelector } from './PlantSelector';
import {
  calculatePowerFromFlow,
  calculateEnergyFromFlowAndTime,
  calculateVolumeFromFlowAndTime,
  formatNum,
} from '../utils/formatters';
import {
  Waves,
  Zap,
  Info,
  AlertTriangle,
  Clock,
  Save,
  Check,
  Copy,
} from 'lucide-react';

interface TabFlowProps {
  selectedPlant: HydroPlant;
  onSelectPlant: (plant: HydroPlant) => void;
  onSaveHistory: (item: CalculationHistoryItem) => void;
}

export const TabFlow: React.FC<TabFlowProps> = ({
  selectedPlant,
  onSelectPlant,
  onSaveHistory,
}) => {
  // Turbined flow input Q (m³/s)
  const [flowInput, setFlowInput] = useState<string>('10.0');

  // Operation time selection
  const [selectedPresetHours, setSelectedPresetHours] = useState<number>(24);
  const [customHours, setCustomHours] = useState<string>('7');
  const [isCustomHours, setIsCustomHours] = useState<boolean>(false);

  // Copy/Save feedback
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Numerical value
  const numFlow = Math.max(0, parseFloat(flowInput) || 0);

  // Active operation time in hours
  const activeHours = isCustomHours
    ? Math.max(0.1, parseFloat(customHours) || 1)
    : selectedPresetHours;

  // Instant reactive calculations
  const instantPowerMW = calculatePowerFromFlow(numFlow, selectedPlant.kProd);
  const totalEnergyMWh = calculateEnergyFromFlowAndTime(numFlow, selectedPlant.kProd, activeHours);
  const equivalentVolumeHm3 = calculateVolumeFromFlowAndTime(numFlow, activeHours);
  const isCapacityExceeded = instantPowerMW > selectedPlant.capacityMW;

  // Quick step adjustment for flow
  const handleAdjustFlow = (delta: number) => {
    const current = parseFloat(flowInput) || 0;
    const nextVal = Math.max(0, current + delta);
    setFlowInput(nextVal.toFixed(1));
  };

  // Preset max flow calculation (Flow to reach 100% capacity: Q = Cap / Kprod)
  const handleSetMaxFlow = () => {
    if (selectedPlant.kProd > 0) {
      const maxQ = selectedPlant.capacityMW / selectedPlant.kProd;
      setFlowInput(maxQ.toFixed(2));
    }
  };

  const handleSaveToHistory = () => {
    const item: CalculationHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'flow',
      plantCode: selectedPlant.code,
      plantName: selectedPlant.name,
      kProd: selectedPlant.kProd,
      flowM3s: numFlow,
      hours: activeHours,
      calcPowerMW: instantPowerMW,
      calcVolHm3: equivalentVolumeHm3,
      energyMWh: totalEnergyMWh,
      isCapacityExceeded: isCapacityExceeded,
      installedCapacityMW: selectedPlant.capacityMW,
    };
    onSaveHistory(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopySummary = () => {
    const summary = `⚡ HydroEnergy (CNDC) - [${selectedPlant.code}] ${selectedPlant.name}
• Caudal Turbinado: ${formatNum(numFlow, 2)} m³/s
• Tiempo de Operación: ${activeHours} h
• Potencia Instantánea: ${formatNum(instantPowerMW, 2)} MW ${isCapacityExceeded ? '⚠️ (Excede Cap. Inst)' : ''}
• ENERGÍA TOTAL GENERADA: ${formatNum(totalEnergyMWh, 2)} MWh
• Volumen Consumido: ${formatNum(equivalentVolumeHm3, 3)} hm³`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 1. Selector de Central */}
      <PlantSelector
        selectedPlant={selectedPlant}
        onSelectPlant={onSelectPlant}
      />

      {/* 2. Entrada: Caudal Turbinado (Q in m³/s) */}
      <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#0051A1] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="flow-input" className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Waves className="w-4 h-4 text-[#FFB703]" />
            Caudal Turbinado (Q)
          </label>
          <button
            type="button"
            onClick={handleSetMaxFlow}
            className="text-[11px] font-bold text-[#FFB703] bg-[#0051A1] hover:bg-[#003870] border border-[#0051A1] px-2.5 py-0.5 rounded transition-all shadow-sm"
          >
            Q. Máx Nominal ({formatNum(selectedPlant.capacityMW / selectedPlant.kProd, 2)} m³/s)
          </button>
        </div>

        {/* Input box with quick step buttons */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <input
              id="flow-input"
              type="number"
              step="any"
              min="0"
              value={flowInput}
              onChange={(e) => setFlowInput(e.target.value)}
              placeholder="0.00"
              className="w-full bg-slate-900 text-white font-bold text-2xl font-mono-num rounded-xl px-4 py-3.5 pr-16 border-2 border-slate-700 focus:border-[#0051A1] focus:outline-none focus:ring-2 focus:ring-[#0051A1]/40 transition-all shadow-inner"
            />
            <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
              m³/s
            </div>
          </div>

          {/* Quick Increments */}
          <div className="flex flex-col gap-1">
            <button
              type="button"
              onClick={() => handleAdjustFlow(5)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-[#0051A1] text-slate-200 hover:text-white border border-slate-700 active:scale-95 text-xs font-bold font-mono-num"
              title="+5 m³/s"
            >
              +5
            </button>
            <button
              type="button"
              onClick={() => handleAdjustFlow(-5)}
              className="p-2 rounded-lg bg-slate-800 hover:bg-[#0051A1] text-slate-200 hover:text-white border border-slate-700 active:scale-95 text-xs font-bold font-mono-num"
              title="-5 m³/s"
            >
              -5
            </button>
          </div>
        </div>
      </div>

      {/* 3. Entrada: Tiempo de Operación (t) con Casillas Táctiles Radio/Chips */}
      <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#0051A1] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Clock className="w-4 h-4 text-[#FFB703]" />
            Tiempo de Operación (t)
          </label>
          <span className="text-xs text-[#FFB703] font-bold font-mono-num">
            {activeHours} Horas
          </span>
        </div>

        {/* Radio/Chip selection layout */}
        <div className="space-y-2">
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
            {TIME_PRESETS.map((preset) => {
              const isSelected = !isCustomHours && selectedPresetHours === preset.hours;
              return (
                <button
                  key={preset.hours}
                  type="button"
                  onClick={() => {
                    setIsCustomHours(false);
                    setSelectedPresetHours(preset.hours);
                  }}
                  className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all border active:scale-95 ${
                    isSelected
                      ? 'bg-[#0051A1] text-white border-[#0051A1] font-bold shadow-md'
                      : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
                  }`}
                >
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    isSelected ? 'border-[#FFB703] bg-[#FFB703]' : 'border-slate-500'
                  }`}>
                    {isSelected && <div className="w-1.5 h-1.5 bg-[#0B1320] rounded-full" />}
                  </div>
                  <div>
                    <div className="text-xs font-mono-num font-bold">{preset.sublabel} ({preset.hours}h)</div>
                  </div>
                </button>
              );
            })}

            {/* Custom Hours Option */}
            <button
              type="button"
              onClick={() => setIsCustomHours(true)}
              className={`flex items-center gap-2.5 p-2.5 rounded-xl text-left transition-all border active:scale-95 ${
                isCustomHours
                  ? 'bg-[#0051A1] text-white border-[#0051A1] font-bold shadow-md'
                  : 'bg-slate-900/80 hover:bg-slate-800 text-slate-300 border-slate-700'
              }`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                isCustomHours ? 'border-[#FFB703] bg-[#FFB703]' : 'border-slate-500'
              }`}>
                {isCustomHours && <div className="w-1.5 h-1.5 bg-[#0B1320] rounded-full" />}
              </div>
              <div className="text-xs font-bold">
                ✏️ Editar horas parciales
              </div>
            </button>
          </div>

          {/* Manual numeric input field if custom hours selected */}
          {isCustomHours && (
            <div className="p-3 bg-slate-900 rounded-xl border border-[#0051A1] flex items-center gap-3">
              <span className="text-xs text-slate-300 font-semibold whitespace-nowrap">
                Ingresar Horas Personalizadas:
              </span>
              <div className="relative flex-1">
                <input
                  type="number"
                  step="0.5"
                  min="0.1"
                  value={customHours}
                  onChange={(e) => setCustomHours(e.target.value)}
                  placeholder="Ej: 7"
                  className="w-full bg-slate-950 text-white font-mono-num font-bold text-base rounded-lg px-3 py-1.5 pr-8 border border-slate-700 focus:border-[#0051A1] focus:outline-none"
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 font-bold pointer-events-none">
                  h
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 4. Fórmula Visible */}
      <div className="bg-[#003870]/40 rounded-2xl p-3.5 border border-[#0051A1] text-xs text-slate-200 space-y-1.5 shadow-md">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Info className="w-4 h-4 text-[#FFB703] shrink-0" />
          <span>Fórmulas de Potencia y Energía por Caudal:</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-[#0051A1] text-center font-mono-num font-bold text-[#FFB703] text-xs sm:text-sm tracking-wide overflow-x-auto">
          P (MW) = Q × K<sub>prod</sub> &nbsp; | &nbsp; E (MWh) = P × t (horas)
        </div>
      </div>

      {/* 5. RESULTADOS INSTANTÁNEOS DESTACADOS */}
      <div className="space-y-3">
        {/* Featured Result Card: ENERGÍA TOTAL GENERADA */}
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#2d170b] to-[#1e293b] p-5 sm:p-6 border-2 border-[#F26522] shadow-2xl text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-black text-[#FFB703]">
            <Zap className="w-4 h-4 text-[#F26522]" />
            Energía Total Generada ({activeHours}h)
          </div>

          <div className="text-3xl sm:text-5xl font-black text-[#F26522] font-mono-num tracking-tight py-1">
            {formatNum(totalEnergyMWh, 2)} <span className="text-xl sm:text-3xl font-bold text-[#FFB703]">MWh</span>
          </div>

          {/* Action Row */}
          <div className="flex items-center justify-center gap-2 pt-2 border-t border-amber-900/50">
            <button
              onClick={handleSaveToHistory}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all ${
                saved
                  ? 'bg-[#FFB703] text-slate-950 font-extrabold'
                  : 'bg-[#F26522] text-white hover:bg-[#E85D04]'
              }`}
            >
              {saved ? <Check className="w-3.5 h-3.5" /> : <Save className="w-3.5 h-3.5" />}
              {saved ? 'Guardado' : 'Guardar'}
            </button>

            <button
              onClick={handleCopySummary}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-slate-800 text-slate-200 border border-slate-700 hover:bg-slate-700 transition-all"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-[#FFB703]" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copiado' : 'Copiar'}
            </button>
          </div>
        </div>

        {/* Secondary Instant Metric Cards Grid */}
        <div className="grid grid-cols-2 gap-3">
          {/* Potencia Instantánea */}
          <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#0051A1] shadow-lg space-y-1">
            <span className="text-[11px] text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1">
              💡 Potencia Instantánea
            </span>
            <div className={`text-xl sm:text-2xl font-black font-mono-num ${isCapacityExceeded ? 'text-[#F26522]' : 'text-white'}`}>
              {formatNum(instantPowerMW, 2)} <span className="text-xs font-bold text-[#FFB703]">MW</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Límite nominal: {formatNum(selectedPlant.capacityMW, 2)} MW
            </div>
          </div>

          {/* Volumen Equivalente Consumido */}
          <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#0051A1] shadow-lg space-y-1">
            <span className="text-[11px] text-slate-200 font-bold uppercase tracking-wider flex items-center gap-1">
              💧 Volumen Consumido
            </span>
            <div className="text-xl sm:text-2xl font-black text-white font-mono-num">
              {formatNum(equivalentVolumeHm3, 3)} <span className="text-xs font-bold text-[#FFB703]">hm³</span>
            </div>
            <div className="text-[10px] text-slate-400">
              V = (Q · t · 3.6) / 1000
            </div>
          </div>
        </div>

        {/* Alerta de Capacidad si P > Capacidad Instalada */}
        {isCapacityExceeded && (
          <div className="p-3.5 rounded-2xl bg-amber-950/70 border-2 border-amber-500/60 text-amber-200 text-xs flex items-start gap-3 shadow-lg animate-pulse">
            <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
            <div>
              <div className="font-bold text-amber-300 text-sm">
                ⚠️ Alerta: Exceso de Capacidad Instalada
              </div>
              <p className="mt-0.5 text-[11px] leading-relaxed">
                La Potencia Instantánea calculada (<strong>{formatNum(instantPowerMW, 2)} MW</strong>) sobrepasa la Capacidad Instalada de la central <strong>[{selectedPlant.code}]</strong> (<strong>{formatNum(selectedPlant.capacityMW, 2)} MW</strong>). Reduzca el caudal turbinado a máximo <strong>{formatNum(selectedPlant.capacityMW / selectedPlant.kProd, 2)} m³/s</strong>.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

