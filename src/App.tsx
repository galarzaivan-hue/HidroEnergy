import React, { useState, useEffect } from 'react';
import { HYDRO_PLANTS, getPlantByCode } from './data/plants';
import { HydroPlant, TabType, CalculationHistoryItem } from './types';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { TabVolume } from './components/TabVolume';
import { TabFlow } from './components/TabFlow';
import { TabDatabase } from './components/TabDatabase';
import { HistoryModal } from './components/HistoryModal';
import { FormulaGuideModal } from './components/FormulaGuideModal';

const LOCAL_STORAGE_PLANT_KEY = 'HYDRO_EXPRESS_LAST_PLANT';
const LOCAL_STORAGE_HISTORY_KEY = 'HYDRO_EXPRESS_HISTORY';

export default function App() {
  // Navigation tab state
  const [activeTab, setActiveTab] = useState<TabType>('volume');

  // Currently selected plant
  const [selectedPlant, setSelectedPlant] = useState<HydroPlant>(() => {
    try {
      const savedCode = localStorage.getItem(LOCAL_STORAGE_PLANT_KEY);
      if (savedCode) {
        return getPlantByCode(savedCode);
      }
    } catch (e) {
      console.warn('LocalStorage error:', e);
    }
    return HYDRO_PLANTS[0]; // default Corani (COR)
  });

  // History log
  const [history, setHistory] = useState<CalculationHistoryItem[]>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_HISTORY_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.warn('LocalStorage history parse error:', e);
    }
    return [];
  });

  // Modals state
  const [isHistoryOpen, setIsHistoryOpen] = useState<boolean>(false);
  const [isGuideOpen, setIsGuideOpen] = useState<boolean>(false);

  // Persist selected plant code
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_PLANT_KEY, selectedPlant.code);
    } catch (e) {
      console.warn('LocalStorage save error:', e);
    }
  }, [selectedPlant]);

  // Persist history log
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_HISTORY_KEY, JSON.stringify(history));
    } catch (e) {
      console.warn('LocalStorage save history error:', e);
    }
  }, [history]);

  // Save item handler
  const handleSaveHistoryItem = (item: CalculationHistoryItem) => {
    setHistory((prev) => [item, ...prev].slice(0, 50)); // keep last 50
  };

  const handleClearHistory = () => {
    setHistory([]);
  };

  // Switch plant and tab from Database table
  const handleSelectPlantAndNavigate = (plant: HydroPlant, tab: TabType) => {
    setSelectedPlant(plant);
    setActiveTab(tab);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B1320] text-slate-100 flex flex-col font-sans selection:bg-[#F26522]/30 selection:text-[#FFB703]">
      {/* Top Mobile Header */}
      <Header
        selectedPlant={selectedPlant}
        onOpenHistory={() => setIsHistoryOpen(true)}
        onOpenGuide={() => setIsGuideOpen(true)}
        onOpenDatabase={() => setActiveTab('database')}
        historyCount={history.length}
      />

      {/* Main Responsive Body Container */}
      <main className="flex-1 max-w-md w-full mx-auto px-4 pt-4">
        {activeTab === 'volume' && (
          <TabVolume
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
            onSaveHistory={handleSaveHistoryItem}
          />
        )}

        {activeTab === 'flow' && (
          <TabFlow
            selectedPlant={selectedPlant}
            onSelectPlant={setSelectedPlant}
            onSaveHistory={handleSaveHistoryItem}
          />
        )}

        {activeTab === 'database' && (
          <TabDatabase
            selectedPlant={selectedPlant}
            onSelectPlantAndNavigate={handleSelectPlantAndNavigate}
          />
        )}
      </main>

      {/* Fixed Bottom Navigation Bar */}
      <BottomNav
        activeTab={activeTab}
        onTabChange={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Modals */}
      <HistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onClearHistory={handleClearHistory}
      />

      <FormulaGuideModal
        isOpen={isGuideOpen}
        onClose={() => setIsGuideOpen(false)}
      />
    </div>
  );
}
