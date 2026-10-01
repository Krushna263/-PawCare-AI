import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PetProfileView } from './components/PetProfileView';
import { SmartFeedingView } from './components/SmartFeedingView';
import { SeasonalCareView } from './components/SeasonalCareView';
import { VetCareView } from './components/VetCareView';
import { PetStoreView } from './components/PetStoreView';
import { RemindersView } from './components/RemindersView';
import { AICareAssistantView } from './components/AICareAssistantView';
import { NewPetModal } from './components/modals/NewPetModal';
import { CartDrawer } from './components/common/CartDrawer';
import { ToastContainer } from './components/common/ToastContainer';
import { Pet } from './types';

const MainContent: React.FC = () => {
  const { activeTab, activePet } = useApp();
  const [isNewPetModalOpen, setIsNewPetModalOpen] = useState(false);
  const [editingPet, setEditingPet] = useState<Pet | null>(null);

  const handleOpenNewPet = () => {
    setEditingPet(null);
    setIsNewPetModalOpen(true);
  };

  const handleEditActivePet = () => {
    setEditingPet(activePet);
    setIsNewPetModalOpen(true);
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-800">
      
      {/* Top and Mobile Navigation */}
      <Navbar onOpenNewPetModal={handleOpenNewPet} />

      {/* Main Tab Routing */}
      <main className="flex-1 pb-16 md:pb-8">
        {activeTab === 'home' && (
          <LandingPage onOpenNewPetModal={handleOpenNewPet} />
        )}
        {activeTab === 'pet' && (
          <PetProfileView 
            onOpenNewPetModal={handleOpenNewPet} 
            onEditPet={handleEditActivePet} 
          />
        )}
        {activeTab === 'feeding' && <SmartFeedingView />}
        {activeTab === 'seasonal' && <SeasonalCareView />}
        {activeTab === 'vet' && <VetCareView />}
        {activeTab === 'store' && <PetStoreView />}
        {activeTab === 'reminders' && <RemindersView />}
        {activeTab === 'assistant' && <AICareAssistantView />}
      </main>

      {/* Global Modals & Notifications */}
      <NewPetModal
        isOpen={isNewPetModalOpen}
        onClose={() => setIsNewPetModalOpen(false)}
        editingPet={editingPet}
      />
      <CartDrawer />
      <ToastContainer />

    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <MainContent />
    </AppProvider>
  );
}
