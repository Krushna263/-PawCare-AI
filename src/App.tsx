import React, { useState } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Navbar } from './components/Navbar';
import { LandingPage } from './components/LandingPage';
import { PetProfileView } from './components/PetProfileView';
import { SmartFeedingView } from './components/SmartFeedingView';
import { SeasonalCareView } from './components/SeasonalCareView';
import { VetCareView } from './components/VetCareView';
import { PetFoodSection } from './components/PetFoodSection';
import { PetStoreView } from './components/PetStoreView';
import { RemindersView } from './components/RemindersView';
import { AICareAssistantView } from './components/AICareAssistantView';
import { UserPanel } from './components/UserPanel';
import { AdminPanel } from './components/AdminPanel';
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
    <div className="min-h-screen flex flex-col bg-[#FAF9F5] text-stone-800 relative isolate">
      {/* Ambient background light orbs for realistic glass refraction */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden" aria-hidden="true">
        <div className="absolute -top-[10%] left-[12%] w-[620px] h-[620px] rounded-full bg-emerald-200/25 blur-[140px]" />
        <div className="absolute top-[32%] -right-[8%] w-[580px] h-[580px] rounded-full bg-amber-200/25 blur-[140px]" />
        <div className="absolute bottom-[8%] left-[2%] w-[640px] h-[640px] rounded-full bg-teal-200/20 blur-[150px]" />
      </div>

      {/* Top and Mobile Navigation */}
      <Navbar onOpenNewPetModal={handleOpenNewPet} />

      {/* Main Tab Routing */}
      <main className="flex-1 pb-16 md:pb-8 relative z-10">
        {activeTab === 'home' && (
          <LandingPage onOpenNewPetModal={handleOpenNewPet} />
        )}
        {activeTab === 'pet' && (
          <PetProfileView 
            onOpenNewPetModal={handleOpenNewPet} 
            onEditPet={handleEditActivePet} 
          />
        )}
        {activeTab === 'user_panel' && (
          <UserPanel 
            onOpenNewPetModal={handleOpenNewPet} 
            onEditPet={handleEditActivePet} 
          />
        )}
        {activeTab === 'admin_panel' && <AdminPanel />}
        {activeTab === 'food' && <PetFoodSection />}
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
