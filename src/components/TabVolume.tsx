import React, { useState } from 'react';
import { HydroPlant, CalculationHistoryItem } from '../types';
import { PlantSelector } from './PlantSelector';
import { DispatchEstimation } from './DispatchEstimation';
import { calculateEnergyFromVolume, formatNum } from '../utils/formatters';
import {
  Droplet,
  Zap,
  Info,
  Sliders,
  Save,
  Check,
  Copy,
} from 'lucide-react';

interface TabVolumeProps {
  selectedPlant: HydroPlant;
  onSelectPlant: (plant: HydroPlant) => void;
  onSaveHistory: (item: CalculationHistoryItem) => void;
}

export const TabVolume: React.FC<TabVolumeProps> = ({
  selectedPlant,
  onSelectPlant,
  onSaveHistory,
}) => {
  // Local state for Volume input (hm³)
  const [volumeInput, setVolumeInput] = useState<string>('10.0');

  // Copy/Save feedback state
  const [copied, setCopied] = useState<boolean>(false);
  const [saved, setSaved] = useState<boolean>(false);

  // Parse volume numerical value
  const numVolume = Math.max(0, parseFloat(volumeInput) || 0);

  // Reactive instant calculations
  const energyMWh = calculateEnergyFromVolume(numVolume, selectedPlant.kProd);

  // Preset percentage setters for Volume
  const handleSetVolumePercent = (percent: number) => {
    const calculatedVol = selectedPlant.volMaxHm3 * (percent / 100);
    setVolumeInput(calculatedVol < 0.01 ? calculatedVol.toFixed(4) : calculatedVol.toFixed(3));
  };

  const handleSaveToHistory = () => {
    const item: CalculationHistoryItem = {
      id: Date.now().toString(),
      timestamp: new Date().toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit', second: '2-digit' }),
      type: 'volume',
      plantCode: selectedPlant.code,
      plantName: selectedPlant.name,
      kProd: selectedPlant.kProd,
      volHm3: numVolume,
      energyMWh: energyMWh,
      installedCapacityMW: selectedPlant.capacityMW,
    };
    onSaveHistory(item);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleCopySummary = () => {
    const summary = `⚡ HydroEnergy (CNDC) - [${selectedPlant.code}] ${selectedPlant.name}
• Volumen: ${formatNum(numVolume, 3)} hm³
• Kprod: ${selectedPlant.kProd} MW/(m³/s)
• ENERGÍA DISPONIBLE: ${formatNum(energyMWh, 2)} MWh`;

    navigator.clipboard.writeText(summary);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-4 pb-24 animate-fadeIn">
      {/* 1. Selector de Embalse / Central */}
      <PlantSelector
        selectedPlant={selectedPlant}
        onSelectPlant={(plant) => {
          onSelectPlant(plant);
          if (parseFloat(volumeInput) > plant.volMaxHm3) {
            setVolumeInput((plant.volMaxHm3 * 0.5).toFixed(3));
          }
        }}
      />

      {/* 2. Campo de Entrada: Volumen Disponible (hm³) */}
      <div className="bg-[#1e293b] rounded-2xl p-4 border border-[#0051A1] shadow-xl space-y-3">
        <div className="flex items-center justify-between">
          <label htmlFor="volume-input" className="text-xs font-semibold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
            <Droplet className="w-4 h-4 text-[#FFB703]" />
            Volumen Disponible (V)
          </label>
          <span className="text-xs text-slate-300 font-mono-num">
            Máx: <strong className="text-white">{formatNum(selectedPlant.volMaxHm3, 3)} hm³</strong>
          </span>
        </div>

        {/* Input box + unit */}
        <div className="relative">
          <input
            id="volume-input"
            type="number"
            step="any"
            min="0"
            value={volumeInput}
            onChange={(e) => setVolumeInput(e.target.value)}
            placeholder="0.00"
            className="w-full bg-slate-900 text-white font-bold text-2xl font-mono-num rounded-xl px-4 py-3.5 pr-16 border-2 border-slate-700 focus:border-[#0051A1] focus:outline-none focus:ring-2 focus:ring-[#0051A1]/40 transition-all shadow-inner"
          />
          <div className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 font-bold text-sm pointer-events-none">
            hm³
          </div>
        </div>

        {/* Quick Percent Presets */}
        <div className="space-y-1.5 pt-1">
          <div className="flex items-center justify-between text-[11px] text-slate-300">
            <span className="flex items-center gap-1">
              <Sliders className="w-3 h-3 text-slate-400" />
              Acceso Rápido % del Embalse:
            </span>
            {selectedPlant.volMaxHm3 > 0 && (
              <span className="font-mono-num text-[#FFB703] font-bold">
                {((numVolume / selectedPlant.volMaxHm3) * 100).toFixed(1)}% Llenado
              </span>
            )}
          </div>
          <div className="grid grid-cols-5 gap-1.5">
            {[10, 25, 50, 75, 100].map((pct) => (
              <button
                key={pct}
                type="button"
                onClick={() => handleSetVolumePercent(pct)}
                className="py-1.5 text-xs font-bold rounded-lg bg-slate-800 hover:bg-[#0051A1] text-slate-200 hover:text-white border border-[#0051A1]/40 active:scale-95 transition-all font-mono-num text-center"
              >
                {pct}%
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Tarjeta Informativa de la Fórmula */}
      <div className="bg-[#003870]/40 rounded-2xl p-3.5 border border-[#0051A1] text-xs text-slate-200 space-y-1.5 shadow-md">
        <div className="flex items-center gap-1.5 font-bold text-white">
          <Info className="w-4 h-4 text-[#FFB703] shrink-0" />
          <span>Fórmula de Energía Teórica por Volumen:</span>
        </div>
        <div className="p-2.5 rounded-xl bg-slate-950/80 border border-[#0051A1] text-center font-mono-num font-bold text-[#FFB703] text-xs sm:text-sm tracking-wide overflow-x-auto">
          E (MWh) = Vol (hm³) × 277.7778 × K<sub>prod</sub>
        </div>
        <p className="text-[11px] text-slate-300 leading-relaxed italic">
          * Factor constante 277.7778 = 1,000,000 m³ / 3,600 s/h. La Energía Total en MWh no depende del tiempo de vaciado.
        </p>
      </div>

      {/* 4. RESULTADO PRINCIPAL DESTACADO EN NARANJA / AMARILLO CNDC */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#1e293b] via-[#2d170b] to-[#1e293b] p-5 sm:p-6 border-2 border-[#F26522] shadow-2xl text-center space-y-2">
        {/* Glow effect backdrops */}
        <div className="absolute -top-10 -left-10 w-32 h-32 bg-[#F26522]/20 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-[#0051A1]/30 rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-black text-[#FFB703]">
          <Zap className="w-4 h-4 text-[#F26522]" />
          Energía Disponible Almacenada
        </div>

        {/* Giant Monospaced CNDC Orange Text */}
        <div className="text-3xl sm:text-5xl font-black text-[#F26522] font-mono-num tracking-tight py-1">
          {formatNum(energyMWh, 2)} <span className="text-xl sm:text-3xl font-bold text-[#FFB703]">MWh</span>
        </div>

        <p className="text-xs text-amber-200/90 font-medium max-w-xs mx-auto">
          Energía eléctrica total convertible al 100% de la masa de agua disponible ({formatNum(numVolume, 2)} hm³).
        </p>

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

      {/* 5. Módulo de Estimación de Despacho y Duración de Agua */}
      <DispatchEstimation
        energyMWh={energyMWh}
        selectedPlant={selectedPlant}
      />
    </div>
  );
};


