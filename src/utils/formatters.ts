export const CONSTANT_FACTOR_VOL_TO_ENERGY = 277.77777777777777;

export function formatNum(val: number, decimals: number = 2): string {
  if (isNaN(val) || !isFinite(val)) return '0.00';
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  }).format(val);
}

export function formatSmart(val: number): string {
  if (isNaN(val) || !isFinite(val)) return '0';
  if (Math.abs(val) < 0.01 && val > 0) return val.toFixed(4);
  if (Math.abs(val) < 10) return val.toFixed(3);
  if (Math.abs(val) < 100) return val.toFixed(2);
  return new Intl.NumberFormat('es-BO', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

/**
 * Tab 1 Formula:
 * E (MWh) = Volume (hm³) * 277.7778 * Kprod
 */
export function calculateEnergyFromVolume(volHm3: number, kProd: number): number {
  if (volHm3 <= 0 || kProd <= 0) return 0;
  return volHm3 * CONSTANT_FACTOR_VOL_TO_ENERGY * kProd;
}

/**
 * Tab 1 Simulation: Equivalent Flow Q (m³/s) = (V (hm³) * 1000) / (t (h) * 3.6)
 */
export function calculateFlowFromVolumeAndTime(volHm3: number, hours: number): number {
  if (volHm3 <= 0 || hours <= 0) return 0;
  return (volHm3 * 1000) / (hours * 3.6);
}

/**
 * Power P (MW) = Q (m³/s) * Kprod
 */
export function calculatePowerFromFlow(flowM3s: number, kProd: number): number {
  if (flowM3s <= 0 || kProd <= 0) return 0;
  return flowM3s * kProd;
}

/**
 * Tab 2 Formula:
 * P (MW) = Q * Kprod
 * E (MWh) = P * t (hours)
 */
export function calculateEnergyFromFlowAndTime(flowM3s: number, kProd: number, hours: number): number {
  if (flowM3s <= 0 || kProd <= 0 || hours <= 0) return 0;
  const power = calculatePowerFromFlow(flowM3s, kProd);
  return power * hours;
}

/**
 * Equivalent volume consumed from flow:
 * V (hm³) = (Q * t * 3.6) / 1000
 */
export function calculateVolumeFromFlowAndTime(flowM3s: number, hours: number): number {
  if (flowM3s <= 0 || hours <= 0) return 0;
  return (flowM3s * hours * 3.6) / 1000;
}
