export interface HydroPlant {
  id: string;
  code: string;
  name: string;
  fullName: string;
  volMaxHm3: number;
  capacityMW: number;
  kProd: number; // MW / (m³/s)
  location?: string;
  notes?: string;
}

export type TabType = 'volume' | 'flow' | 'database';

export interface TimePreset {
  label: string;
  hours: number;
  sublabel: string;
}

export interface CalculationHistoryItem {
  id: string;
  timestamp: string;
  type: 'volume' | 'flow';
  plantCode: string;
  plantName: string;
  kProd: number;
  
  // Volume calculation inputs & outputs
  volHm3?: number;
  simHours?: number;
  simFlowM3s?: number;
  simPowerMW?: number;
  
  // Flow calculation inputs & outputs
  flowM3s?: number;
  hours?: number;
  calcPowerMW?: number;
  calcVolHm3?: number;
  
  // Primary output
  energyMWh: number;
  isCapacityExceeded?: boolean;
  installedCapacityMW: number;
}
