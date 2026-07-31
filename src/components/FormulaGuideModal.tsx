import React from 'react';
import { X, BookOpen, Zap, Droplet, Waves, Info } from 'lucide-react';

interface FormulaGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const FormulaGuideModal: React.FC<FormulaGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/80 backdrop-blur-sm flex items-center justify-center p-4 animate-fadeIn">
      <div className="bg-[#1e293b] rounded-3xl border border-[#0051A1] shadow-2xl w-full max-w-lg max-h-[85vh] flex flex-col overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 border-b border-[#0051A1] flex items-center justify-between bg-[#0B1320]">
          <div className="flex items-center gap-2">
            <div className="p-2 rounded-xl bg-[#0051A1] text-[#FFB703] border border-[#0051A1]">
              <BookOpen className="w-5 h-5 text-[#FFB703]" />
            </div>
            <div>
              <h2 className="text-base font-bold text-white">
                Guía Técnica y Fórmulas Físicas (CNDC)
              </h2>
              <p className="text-[11px] text-slate-300">
                Sistemas Eléctricos de Potencia Hidroeléctrica
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

        {/* Modal Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs text-slate-300 leading-relaxed">
          {/* Section 1: Concept & Kprod */}
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-[#0051A1]/40 space-y-2">
            <h3 className="text-sm font-bold text-[#FFB703] flex items-center gap-1.5">
              <Zap className="w-4 h-4 text-[#F26522]" />
              1. Coeficiente de Productividad (K<sub>prod</sub>)
            </h3>
            <p>
              El coeficiente <strong className="text-white">K<sub>prod</sub></strong> [medido en MW/(m³/s)] sintetiza la altura de caída neta (H<sub>neta</sub>), la eficiencia global turbina-generador (η), el peso específico del agua y la aceleración de la gravedad:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 text-center font-mono-num text-[#FFB703] font-bold border border-[#0051A1]">
              K<sub>prod</sub> = g · ρ · H<sub>neta</sub> · η / 10⁶ &nbsp; [MW / (m³/s)]
            </div>
          </div>

          {/* Section 2: Volume Formula */}
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-[#0051A1]/40 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Droplet className="w-4 h-4 text-[#FFB703]" />
              2. Energía por Volumen Almacenado (V)
            </h3>
            <p>
              El volumen almacenado representa una energía potencial finita convertible. La energía total en MWh <strong>NO depende del tiempo (t)</strong> en que se vacíe el embalse:
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 text-center font-mono-num text-[#F26522] font-bold border border-[#F26522]/40">
              E (MWh) = Volumen (hm³) × 277.7778 × K<sub>prod</sub>
            </div>
            <p className="text-[11px] text-slate-400 italic">
              <strong>Demostración de la constante 277.7778:</strong><br />
              1 hm³ = 1,000,000 m³. Al dividir entre 3,600 segundos (1 hora), resulta: 1,000,000 / 3,600 = 277.777778... (m³/s)·h.
            </p>
          </div>

          {/* Section 3: Flow Formula */}
          <div className="bg-slate-900/90 rounded-2xl p-3.5 border border-[#0051A1]/40 space-y-2">
            <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
              <Waves className="w-4 h-4 text-[#FFB703]" />
              3. Energía por Caudal Turbinado (Q)
            </h3>
            <p>
              Para un caudal continuo Q (m³/s), la potencia instantánea es constante y la energía generada es proporcional al tiempo de operación t (en horas):
            </p>
            <div className="p-2.5 rounded-xl bg-slate-950 text-center font-mono-num text-[#FFB703] font-bold space-y-1 border border-[#0051A1]">
              <div>P (MW) = Q (m³/s) × K<sub>prod</sub></div>
              <div>E (MWh) = P (MW) × t (horas)</div>
              <div>Volumen Consumido (hm³) = (Q · t · 3.6) / 1000</div>
            </div>
          </div>

          {/* Section 4: Operational Limits */}
          <div className="bg-[#003870]/40 rounded-2xl p-3.5 border border-[#0051A1] text-slate-200 space-y-1.5">
            <div className="font-bold text-[#FFB703] flex items-center gap-1.5 text-xs">
              <Info className="w-4 h-4 text-[#FFB703]" />
              Restricciones Físicas y Límite Nominal
            </div>
            <p className="text-[11px] leading-relaxed">
              Si la potencia generada calculada P supera la <strong>Capacidad Instalada (MW)</strong> de la central, el sistema mostrará una alerta visual. Físicamente, la central no puede entregar más potencia que su límite de placa.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-[#0051A1] bg-[#0B1320] flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-[#0051A1] hover:bg-[#003870] text-white text-xs font-bold transition-all shadow"
          >
            Entendido
          </button>
        </div>
      </div>
    </div>
  );
};


