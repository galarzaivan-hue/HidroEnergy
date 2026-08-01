import React, { useState, useEffect } from 'react';
import { HydroPlant } from '../types';
import { formatNum, formatHoursToDaysAndHours } from '../utils/formatters';
import {
  Timer,
  Clock,
  Zap,
  Waves,
  Calendar,
  AlertTriangle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface DispatchEstimationProps {
  energyMWh: number;
  selectedPlant: HydroPlant;
  title?: string;
  inputLabel?: string;
  maxPowerButtonLabel?: string;
  initialFlowM3s?: number;
}

export const DispatchEstimation: React.FC<DispatchEstimationProps> = ({
  energyMWh,
  selectedPlant,
  title = 'Estimación de Despacho y Duración de Agua',
  inputLabel = 'Potencia de Despacho Prevista (MW)',
  maxPowerButtonLabel = '[ Cargar P. Máxima ]',
  initialFlowM3s,
}) => {
  // Collapsible state for optimal mobile space management
  const [isOpen, setIsOpen] = useState<boolean>(true);

  // Local state for Target Dispatch Power (MW)
  const [dispatchPowerInput, setDispatchPowerInput] = useState<string>(
    selectedPlant.capacityMW.toString()
  );

  // Sync dispatch input when plant changes
  useEffect(() => {
    setDispatchPowerInput(selectedPlant.capacityMW.toString());
  }, [selectedPlant.code, selectedPlant.capacityMW]);

  // Numerical calculations
  const dispatchPowerMW = Math.max(0, parseFloat(dispatchPowerInput) || 0);

  // Duration in hours: Hours = Energy (MWh) / Power (MW)
  const estimatedHours =
    dispatchPowerMW > 0 ? energyMWh / dispatchPowerMW : 0;

  // Required Flow: Q (m³/s) = Power (MW) / Kprod
  const requiredFlowM3s =
    selectedPlant.kProd > 0 ? dispatchPowerMW / selectedPlant.kProd : 0;

  // Format hours and days
  const { mainHours, daysFormatted } = formatHoursToDaysAndHours(estimatedHours);

  // Capacity overload flag
  const isOverCapacity = dispatchPowerMW > selectedPlant.capacityMW;

  // Flow difference if initialFlowM3s is provided
  const flowDiff = initialFlowM3s !== undefined ? requiredFlowM3s - initialFlowM3s : null;

  return (
    <div className="bg-[#1e293b] rounded-2xl border-2 border-[#00E5FF]/40 shadow-xl overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full p-4 bg-slate-900/90 hover:bg-slate-900 flex items-center justify-between text-left transition-colors border-b border-[#00E5FF]/20"
      >
        <div className="flex items-center gap-2.5">
          <div className="p-2 rounded-xl bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30">
            <Timer className="w-5 h-5 text-[#00E5FF]" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold text-white flex items-center gap-2">
              {title}
            </h3>
            <p className="text-[11px] text-slate-300 mt-0.5">
              Simulación basada en <strong className="text-[#00E5FF]">{formatNum(energyMWh, 2)} MWh</strong>
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="hidden sm:inline-block text-xs font-mono-num font-bold text-[#00E5FF] bg-[#00E5FF]/10 px-2.5 py-1 rounded-lg border border-[#00E5FF]/30">
            {mainHours} h ({daysFormatted})
          </span>
          <div className="p-1 rounded-lg bg-slate-800 text-slate-300">
            {isOpen ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </div>
        </div>
      </button>

      {/* Content Area */}
      {isOpen && (
        <div className="p-4 sm:p-5 space-y-4 animate-fadeIn">
          {/* Input Section: Potencia de Despacho Objetivo (MW) */}
          <div className="space-y-2">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <label
                htmlFor="dispatch-power-input"
                className="text-xs font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5"
              >
                <Zap className="w-4 h-4 text-[#FFB703]" />
                {inputLabel}
              </label>

              {/* Action Button: [ Cargar P. Máxima ] */}
              <button
                type="button"
                onClick={() =>
                  setDispatchPowerInput(selectedPlant.capacityMW.toString())
                }
                className="text-[11px] font-bold text-[#00E5FF] bg-[#00E5FF]/10 hover:bg-[#00E5FF]/20 border border-[#00E5FF]/40 px-2.5 py-1 rounded-lg transition-all active:scale-95 shadow-sm"
              >
                {maxPowerButtonLabel} ({formatNum(selectedPlant.capacityMW, 2)} MW)
              </button>
            </div>

            {/* Input Field */}
            <div className="relative">
              <input
                id="dispatch-power-input"
                type="number"
                step="any"
                min="0"
                value={dispatchPowerInput}
                onChange={(e) => setDispatchPowerInput(e.target.value)}
                placeholder="0.00"
                className="w-full bg-slate-900 text-white font-bold text-2xl font-mono-num rounded-xl px-4 py-3 pr-16 border-2 border-slate-700 focus:border-[#00E5FF] focus:outline-none focus:ring-2 focus:ring-[#00E5FF]/30 transition-all shadow-inner"
              />
              <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
                MW
              </div>
            </div>

            {/* Quick Presets */}
            <div className="grid grid-cols-4 gap-1.5 pt-1">
              {[25, 50, 75, 100].map((pct) => (
                <button
                  key={pct}
                  type="button"
                  onClick={() =>
                    setDispatchPowerInput(
                      (selectedPlant.capacityMW * (pct / 100)).toFixed(2)
                    )
                  }
                  className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-[#0051A1] text-slate-200 hover:text-white border border-slate-700 active:scale-95 transition-all font-mono-num text-center"
                >
                  {pct === 100 ? '100% P.Máx' : `${pct}%`}
                </button>
              ))}
            </div>
          </div>

          {/* Over-capacity warning */}
          {isOverCapacity && (
            <div className="p-3 rounded-xl bg-amber-950/70 border border-[#F26522] text-[#FFB703] text-xs font-medium flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 text-[#F26522] shrink-0" />
              <span>
                <strong>Atención:</strong> La potencia ingresada ({formatNum(dispatchPowerMW, 2)} MW) excede la capacidad instalada ({formatNum(selectedPlant.capacityMW, 2)} MW).
              </span>
            </div>
          )}

          {/* Instant Calculation Results Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
            {/* 1. Tiempo de Operación (Horas) & Dias */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-[#00E5FF]/40 text-center space-y-2 shadow-inner flex flex-col items-center justify-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5">
                <Clock className="w-4 h-4 text-[#00E5FF]" />
                Horas de Despacho Continuo
              </span>

              {/* Big Cyan Text */}
              <div className="text-3xl sm:text-4xl font-black text-[#00E5FF] font-mono-num tracking-tight drop-shadow-[0_0_12px_rgba(0,229,255,0.3)]">
                {mainHours} <span className="text-lg sm:text-2xl font-bold">Horas</span>
              </div>

              {/* Equivalence Badge */}
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#00E5FF]/10 text-[#00E5FF] border border-[#00E5FF]/30 text-xs font-bold font-mono-num">
                <Calendar className="w-3.5 h-3.5" />
                <span>Equivalencia: {daysFormatted}</span>
              </div>
            </div>

            {/* 2. Caudal Turbinado Requerido (m³/s) */}
            <div className="bg-slate-900/90 rounded-2xl p-4 border border-[#0051A1] text-center space-y-2 flex flex-col items-center justify-center">
              <span className="text-[11px] uppercase tracking-wider text-slate-300 font-bold flex items-center justify-center gap-1.5">
                <Waves className="w-4 h-4 text-[#FFB703]" />
                Caudal Requerido (Q<sub>req</sub>)
              </span>

              <div className="text-2xl sm:text-3xl font-black text-white font-mono-num">
                {formatNum(requiredFlowM3s, 2)}{' '}
                <span className="text-sm font-bold text-[#FFB703]">m³/s</span>
              </div>

              {/* Optional comparison with Q_inicial if initialFlowM3s was passed */}
              {initialFlowM3s !== undefined ? (
                <div className="space-y-0.5">
                  <div className="text-[11px] text-slate-300 font-mono-num">
                    Q inicial ingresado: <strong className="text-white">{formatNum(initialFlowM3s, 2)} m³/s</strong>
                  </div>
                  {flowDiff !== null && Math.abs(flowDiff) > 0.01 && (
                    <div className="text-[10px] font-bold font-mono-num">
                      {flowDiff > 0 ? (
                        <span className="text-[#FFB703]">
                          📈 Requiere +{formatNum(flowDiff, 2)} m³/s adicional vs Q inicial
                        </span>
                      ) : (
                        <span className="text-[#00E5FF]">
                          📉 Requiere -{formatNum(Math.abs(flowDiff), 2)} m³/s vs Q inicial
                        </span>
                      )}
                    </div>
                  )}
                </div>
              ) : (
                <div className="text-[10px] text-slate-400 font-mono-num">
                  Q = {formatNum(dispatchPowerMW, 2)} MW / {selectedPlant.kProd} Kprod
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
