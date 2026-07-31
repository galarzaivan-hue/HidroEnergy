import React from 'react';
import { CalculationHistoryItem } from '../types';
import { formatNum } from '../utils/formatters';
import {
  X,
  History,
  Trash2,
  Copy,
  Check,
  Zap,
  AlertTriangle,
} from 'lucide-react';

interface HistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: CalculationHistoryItem[];
  onClearHistory: () => void;
}

export const HistoryModal: React.FC<HistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onClearHistory,
}) => {
  const [copiedIndex, setCopiedIndex] = React.useState<number | null>(null);

  if (!isOpen) return null;

  const handleCopyItem = (item: CalculationHistoryItem, idx: number) => {
    let text = `⚡ HydroEnergy Express (CNDC) - [${item.plantCode}] ${item.plantName} (${item.timestamp})
Tipo: ${item.type === 'volume' ? 'Energía por Volumen' : 'Energía por Caudal'}`;

    if (item.type === 'volume') {
      text += `\n• Vol: ${formatNum(item.volHm3 || 0, 3)} hm³
• ENERGÍA: ${formatNum(item.energyMWh, 2)} MWh`;
      if (item.simHours) {
        text += `\n• Simulación (${item.simHours}h): Q = ${formatNum(item.simFlowM3s || 0, 2)} m³/s, P = ${formatNum(item.simPowerMW || 0, 2)} MW`;
      }
    } else {
      text += `\n• Caudal: ${formatNum(item.flowM3s || 0, 2)} m³/s (${item.hours}h)
• Potencia Instantánea: ${formatNum(item.calcPowerMW || 0, 2)} MW
• ENERGÍA: ${formatNum(item.energyMWh, 2)} MWh
• Vol Consumido: ${formatNum(item.calcVolHm3 || 0, 3)} hm³`;
    }

    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1500);
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1e293b] rounded-3xl border border-[#0051A1] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-[#0051A1] flex items-center justify-between bg-[#0B1320]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0051A1] text-[#FFB703] border border-[#0051A1]">
              <History className="w-5 h-5 text-[#FFB703]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Historial de Cálculos (CNDC)
              </h2>
              <p className="text-[11px] text-slate-300 font-mono-num">
                {history.length} registro(s) guardado(s)
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content list */}
        <div className="p-4 overflow-y-auto space-y-3 flex-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-slate-400 text-xs space-y-2">
              <History className="w-8 h-8 text-slate-600 mx-auto" />
              <p>No hay cálculos guardados en la sesión actual.</p>
              <p className="text-[11px] text-slate-500">
                Presione el botón "Guardar" en la Pestaña 1 o 2 para registrar simulaciones.
              </p>
            </div>
          ) : (
            history.map((item, idx) => (
              <div
                key={item.id}
                className="bg-slate-900/90 rounded-2xl p-3.5 border border-[#0051A1]/40 space-y-2 relative"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-extrabold text-[#FFB703] bg-[#0051A1] px-2 py-0.5 rounded font-mono-num border border-[#0051A1]">
                      {item.plantCode}
                    </span>
                    <span className="text-xs font-semibold text-white">
                      {item.plantName}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono-num">
                      {item.timestamp}
                    </span>
                  </div>

                  <button
                    onClick={() => handleCopyItem(item, idx)}
                    className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium flex items-center gap-1 border border-slate-700"
                  >
                    {copiedIndex === idx ? (
                      <Check className="w-3.5 h-3.5 text-[#FFB703]" />
                    ) : (
                      <Copy className="w-3.5 h-3.5" />
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-slate-800/80">
                  {item.type === 'volume' ? (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Volumen</span>
                        <span className="font-bold text-white font-mono-num">{formatNum(item.volHm3 || 0, 3)} hm³</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Factor Kprod</span>
                        <span className="font-bold text-[#FFB703] font-mono-num">{item.kProd} MW/(m³/s)</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Caudal ({item.hours}h)</span>
                        <span className="font-bold text-white font-mono-num">{formatNum(item.flowM3s || 0, 2)} m³/s</span>
                      </div>
                      <div>
                        <span className="text-[10px] text-slate-400 uppercase block">Potencia</span>
                        <span className="font-bold text-[#FFB703] font-mono-num">{formatNum(item.calcPowerMW || 0, 2)} MW</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Energy Big Result */}
                <div className="bg-slate-950 p-2 rounded-xl text-center flex items-center justify-between px-3 border border-[#F26522]/30">
                  <span className="text-[11px] font-bold text-slate-300 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#F26522]" />
                    ENERGÍA GENERADA:
                  </span>
                  <span className="text-sm font-extrabold text-[#F26522] font-mono-num">
                    {formatNum(item.energyMWh, 2)} MWh
                  </span>
                </div>

                {item.isCapacityExceeded && (
                  <div className="text-[10px] text-[#F26522] font-medium flex items-center gap-1">
                    <AlertTriangle className="w-3 h-3 text-[#F26522] shrink-0" />
                    Advertencia: Excedió capacidad nominal ({item.installedCapacityMW} MW)
                  </div>
                )}
              </div>
            ))
          )}
        </div>

        {/* Footer */}
        {history.length > 0 && (
          <div className="p-4 border-t border-[#0051A1] bg-[#0B1320] flex items-center justify-between">
            <button
              onClick={onClearHistory}
              className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 border border-rose-800/50 text-xs font-semibold transition-all"
            >
              <Trash2 className="w-4 h-4" />
              Borrar Historial
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 rounded-xl bg-[#0051A1] hover:bg-[#003870] text-white text-xs font-bold transition-all"
            >
              Cerrar
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

