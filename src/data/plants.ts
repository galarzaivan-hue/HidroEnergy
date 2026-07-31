import { HydroPlant, TimePreset } from '../types';

export const HYDRO_PLANTS: HydroPlant[] = [
  {
    id: 'COR',
    code: 'COR',
    name: 'Corani',
    fullName: 'Central Hidroeléctrica Corani (Embalse Corani)',
    volMaxHm3: 137.996,
    capacityMW: 65.25,
    kProd: 5.035,
    location: 'Cochabamba',
    notes: 'Embalse principal de regulación plurianual.'
  },
  {
    id: 'SIS',
    code: 'SIS',
    name: 'Santa Isabel',
    fullName: 'Central Hidroeléctrica Santa Isabel',
    volMaxHm3: 0.082,
    capacityMW: 91.11,
    kProd: 6.749,
    location: 'Cochabamba',
    notes: 'Central en cascada de alta caída.'
  },
  {
    id: 'MIG',
    code: 'MIG',
    name: 'Miguillas',
    fullName: 'Central Hidroeléctrica Miguillas',
    volMaxHm3: 2.9832,
    capacityMW: 2.55,
    kProd: 3.298,
    location: 'La Paz',
    notes: 'Sistema hidroeléctrico Miguillas.'
  },
  {
    id: 'ANG',
    code: 'ANG',
    name: 'Angostura',
    fullName: 'Central Hidroeléctrica Angostura',
    volMaxHm3: 3.0523,
    capacityMW: 6.23,
    kProd: 3.859,
    location: 'La Paz',
    notes: 'Regulación de cuenca alta.'
  },
  {
    id: 'ZON',
    code: 'ZON',
    name: 'Zongo',
    fullName: 'Central Hidroeléctrica Zongo',
    volMaxHm3: 3.6000,
    capacityMW: 11.04,
    kProd: 3.121,
    location: 'La Paz - Valle de Zongo',
    notes: 'Central de pasada con pequeño embalse de compensación.'
  },
  {
    id: 'TIQ',
    code: 'TIQ',
    name: 'Tiquimani',
    fullName: 'Central Hidroeléctrica Tiquimani',
    volMaxHm3: 0.0300,
    capacityMW: 9.72,
    kProd: 4.313,
    location: 'La Paz',
    notes: 'Aprovechamiento hidroeléctrico Tiquimani.'
  },
  {
    id: 'SRO',
    code: 'SRO',
    name: 'Santa Rosa',
    fullName: 'Central Hidroeléctrica Santa Rosa',
    volMaxHm3: 0.0120,
    capacityMW: 10.69,
    kProd: 6.240,
    location: 'La Paz',
    notes: 'Estructura en cascada Zongo.'
  },
  {
    id: 'CHJ',
    code: 'CHJ',
    name: 'Chojlla',
    fullName: 'Central Hidroeléctrica Chojlla',
    volMaxHm3: 0.1110,
    capacityMW: 38.40,
    kProd: 5.356,
    location: 'La Paz',
    notes: 'Generación hidroeléctrica alta eficiencia.'
  },
  {
    id: 'YAN',
    code: 'YAN',
    name: 'Yanacachi',
    fullName: 'Central Hidroeléctrica Yanacachi',
    volMaxHm3: 0.0460,
    capacityMW: 50.79,
    kProd: 4.385,
    location: 'La Paz - Yungas',
    notes: 'Aprovechamiento hidroeléctrico dinámico.'
  },
  {
    id: 'SJA',
    code: 'SJA',
    name: 'San Jacinto',
    fullName: 'Central Hidroeléctrica San Jacinto',
    volMaxHm3: 39.7669,
    capacityMW: 7.52,
    kProd: 0.442,
    location: 'Tarija',
    notes: 'Embalse multipropósito para riego y energía.'
  },
  {
    id: 'MIS',
    code: 'MIS',
    name: 'Misicuni',
    fullName: 'Central Hidroeléctrica Misicuni',
    volMaxHm3: 147.083,
    capacityMW: 118.68,
    kProd: 8.073,
    location: 'Cochabamba',
    notes: 'Mayor coeficiente de productividad y capacidad instalada.'
  }
];

export const TIME_PRESETS: TimePreset[] = [
  { label: '24h', hours: 24, sublabel: '1 día' },
  { label: '48h', hours: 48, sublabel: '2 días' },
  { label: '72h', hours: 72, sublabel: '3 días' },
  { label: '96h', hours: 96, sublabel: '4 días' },
  { label: '120h', hours: 120, sublabel: '5 días' },
  { label: '144h', hours: 144, sublabel: '6 días' },
  { label: '168h', hours: 168, sublabel: '7 días' },
];

export function getPlantByCode(code: string): HydroPlant {
  return HYDRO_PLANTS.find(p => p.code === code) || HYDRO_PLANTS[0];
}
