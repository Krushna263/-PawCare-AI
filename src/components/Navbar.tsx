import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { NavTab } from '../types';
import { 
  Home, 
  Heart, 
  Utensils, 
  SunMedium, 
  Stethoscope, 
  ShoppingBag, 
  Bell, 
  Bot, 
  ChevronDown, 
  Plus, 
  Menu, 
  X,
  PawPrint
} from 'lucide-react';

interface NavbarProps {
  onOpenNewPetModal: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenNewPetModal }) => {
  const { 
    activeTab, 
    setActiveTab, 
    pets, 
    activePet, 
    setActivePetId, 
    cart, 
    setIsCartOpen 
  } = useApp();

  const [isPetDropdownOpen, setIsPetDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const cartTotalCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  const navItems: { id: NavTab; label: string; icon: React.ComponentType<{ className?: string }> }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'pet', label: 'My Pet', icon: Heart },
    { id: 'feeding', label: 'Feeding', icon: Utensils },
    { id: 'seasonal', label: 'Seasonal Care', icon: SunMedium },
    { id: 'vet', label: 'Vet Care', icon: Stethoscope },
    { id: 'store', label: 'Pet Store', icon: ShoppingBag },
    { id: 'reminders', label: 'Reminders', icon: Bell },
    { id: 'assistant', label: 'AI Care Assistant', icon: Bot },
  ];

  const handleNavClick = (tab: NavTab) => {
    setActiveTab(tab);
    setIsMobileMenuOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <>
      {/* Top Navigation Bar adhering to the 3-Zone Contract */}
      <header className="sticky top-0 z-40 bg-[#FAF9F5]/90 backdrop-blur-md border-b border-stone-200/80 transition-all">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
          
          {/* Zone 1: Single text element wordmark */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => handleNavClick('home')}
              className="flex items-center gap-2 text-left group focus:outline-none"
            >
              <div className="relative w-9 h-9 rounded-2xl bg-linear-to-br from-emerald-600 via-emerald-800 to-stone-900 p-[1.5px] shadow-sm shadow-emerald-950/25 transition-all duration-300 group-hover:scale-105 group-hover:shadow-md group-hover:shadow-emerald-900/30 flex items-center justify-center">
                <div className="w-full h-full rounded-[14px] bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-950 flex items-center justify-center relative overflow-hidden">
                  <div className="absolute -top-1.5 -right-1.5 w-5 h-5 rounded-full bg-amber-400/30 blur-xs pointer-events-none" />
                  <svg
                    viewBox="0 0 32 32"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    className="w-5 h-5 transition-transform duration-300 group-hover:scale-105"
                    aria-label="All pets: dog, cat, rabbit, bird symbol"
                  >
                    {/* Dog silhouette (left) with soft floppy ear */}
                    <path
                      d="M7 14C6 11.5 7.5 8.5 10 7.5C12 6.8 14 7.8 15 9.5C13.8 11.8 13.2 14.5 13.2 17.5C13.2 20.8 14.2 23.5 15.8 25C11.8 25 8.5 21.8 7.5 17.8C7 16 6.8 15 7 14Z"
                      fill="#FAF9F5"
                    />
                    <path
                      d="M7.5 11.5C6 13.2 5.8 17 6.8 19C7.5 20.2 8.8 19.8 9.2 17.8C9.6 15.2 9.2 13 7.5 11.5Z"
                      fill="#E2E8F0"
                    />

                    {/* Cat silhouette (right) with alert perked triangular ear */}
                    <path
                      d="M18 7.5L20.5 3.5L22.5 7C24.5 8.2 26.5 10.8 26.5 14.2C26.5 18.5 23.8 22.5 20 24.5C18.5 25.1 17 25.3 15.8 25.4C14.5 23.5 13.8 20.8 13.8 17.5C13.8 13.8 15.2 11 17.2 8.5L18 7.5Z"
                      fill="#F59E0B"
                    />
                    <path
                      d="M19.5 6.8L20.6 5L21.8 6.8C21.1 7.2 20.2 7.2 19.5 6.8Z"
                      fill="#B45309"
                    />

                    {/* Rabbit upright ears silhouette tucked atop */}
                    <path
                      d="M13.5 6.5C13 4 13.5 2.2 14.5 2.2C15.5 2.2 15.8 3.8 15.5 6"
                      stroke="#FAF9F5"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />
                    <path
                      d="M16 6C16.5 3.8 17.2 2.5 18.2 2.8C19 3.2 18.8 4.8 17.8 6.5"
                      stroke="#FEF08A"
                      strokeWidth="1.2"
                      strokeLinecap="round"
                    />

                    {/* Companion bird in flight accent */}
                    <path
                      d="M24.5 4.5C25.5 3.8 27 3.8 28 4.2C27.2 5 26.5 5.8 26.2 6.5C25.5 6 24.8 5.2 24.5 4.5Z"
                      fill="#FEF08A"
                    />

                    {/* Loving unified heart center */}
                    <path
                      d="M14.5 17C14.5 15.5 15.5 14.8 16.2 15.5C17 14.8 18 15.5 18 17C18 18.8 16.2 20.2 16.2 20.2C16.2 20.2 14.5 18.8 14.5 17Z"
                      fill="#FAF9F5"
                    />
                  </svg>
                </div>
              </div>
              <span className="font-['Outfit',sans-serif] text-[22px] font-black tracking-[-0.03em] text-stone-900 group-hover:text-emerald-950 transition-colors inline-flex items-center">
                Paw<span className="text-emerald-800 font-extrabold ml-px">Care</span>
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1 mb-0.5 inline-block" />
              </span>
            </button>
          </div>

          {/* Zone 2: 4-6 Clean text navigation links */}
          <nav className="hidden xl:flex items-center gap-6 text-sm font-medium text-stone-600">
            {navItems.map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`relative py-1 transition-colors whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'text-emerald-800 font-semibold'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {item.label}
                  {isActive && (
                    <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-700 rounded-full" />
                  )}
                </button>
              );
            })}
          </nav>

          {/* Compact links for intermediate screens */}
          <nav className="hidden lg:flex xl:hidden items-center gap-4 text-xs font-medium text-stone-600">
            {navItems.slice(0, 5).map((item) => {
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => handleNavClick(item.id)}
                  className={`py-1 transition-colors whitespace-nowrap ${
                    isActive ? 'text-emerald-800 font-semibold border-b-2 border-emerald-700' : 'hover:text-stone-900'
                  }`}
                >
                  {item.label}
                </button>
              );
            })}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="py-1 text-stone-500 hover:text-stone-900 flex items-center gap-1"
            >
              More
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </nav>

          {/* Zone 3: 1-2 Primary Actions */}
          <div className="flex items-center gap-3">
            {/* Active Pet Selector / Profile Button */}
            <div className="relative">
              <button
                onClick={() => setIsPetDropdownOpen(!isPetDropdownOpen)}
                className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-full bg-stone-100 hover:bg-stone-200/70 border border-stone-200 text-stone-800 text-xs font-medium transition-colors shadow-2xs focus:outline-none"
                aria-expanded={isPetDropdownOpen}
              >
                <img
                  src={activePet.photoUrl}
                  alt={activePet.name}
                  className="w-6 h-6 rounded-full object-cover border border-emerald-700/20"
                />
                <span className="max-w-[80px] sm:max-w-[110px] truncate">{activePet.name}</span>
                <ChevronDown className="w-3.5 h-3.5 text-stone-500 shrink-0" />
              </button>

              {/* Pet Dropdown */}
              {isPetDropdownOpen && (
                <div 
                  className="absolute right-0 mt-2 w-56 rounded-xl bg-white border border-stone-200 shadow-xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150"
                  onMouseLeave={() => setIsPetDropdownOpen(false)}
                >
                  <div className="px-3 py-2 text-[11px] font-semibold uppercase tracking-wider text-stone-600 border-b border-stone-100">
                    Your Companions
                  </div>
                  <div className="py-1">
                    {pets.map((pet) => (
                      <button
                        key={pet.id}
                        onClick={() => {
                          setActivePetId(pet.id);
                          setIsPetDropdownOpen(false);
                          setActiveTab('pet');
                        }}
                        className={`w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-xs text-left transition-colors ${
                          pet.id === activePet.id
                            ? 'bg-emerald-50 text-emerald-900 font-semibold'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="w-7 h-7 rounded-full object-cover shrink-0 border border-stone-200"
                        />
                        <div className="truncate flex-1">
                          <div className="truncate">{pet.name}</div>
                          <div className="text-[10px] text-stone-600 truncate">{pet.breed}</div>
                        </div>
                        {pet.id === activePet.id && (
                          <span className="w-2 h-2 rounded-full bg-emerald-700 shrink-0" />
                        )}
                      </button>
                    ))}
                  </div>

                  <div className="pt-1 border-t border-stone-100">
                    <button
                      onClick={() => {
                        setIsPetDropdownOpen(false);
                        onOpenNewPetModal();
                      }}
                      className="w-full flex items-center gap-2 px-3 py-2 rounded-lg text-xs font-medium text-emerald-800 hover:bg-emerald-50 transition-colors"
                    >
                      <Plus className="w-4 h-4 shrink-0" />
                      <span>Add New Pet Profile</span>
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Shopping Cart Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 rounded-full hover:bg-stone-100 text-stone-700 transition-colors focus:outline-none"
              aria-label="Open Shopping Cart"
            >
              <ShoppingBag className="w-5 h-5" />
              {cartTotalCount > 0 && (
                <span className="absolute -top-1 -right-1 w-5 h-5 bg-emerald-700 text-white text-[10px] font-bold rounded-full flex items-center justify-center shadow-xs">
                  {cartTotalCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="lg:hidden p-2 rounded-lg hover:bg-stone-100 text-stone-700 transition-colors"
              aria-label="Toggle mobile menu"
            >
              {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>

        </div>

        {/* Mobile Dropdown Menu Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-stone-200 bg-white/95 px-4 pt-3 pb-6 shadow-xl animate-in slide-in-from-top duration-200">
            <div className="grid grid-cols-2 gap-2 mb-4">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleNavClick(item.id)}
                    className={`flex items-center gap-2.5 p-2.5 rounded-xl text-xs font-medium text-left transition-colors ${
                      isActive
                        ? 'bg-emerald-50 text-emerald-900 font-semibold'
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-emerald-700' : 'text-stone-400'}`} />
                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
            <button
              onClick={() => {
                setIsMobileMenuOpen(false);
                onOpenNewPetModal();
              }}
              className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-emerald-800 text-white rounded-xl text-xs font-medium hover:bg-emerald-900 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Create Pet Profile</span>
            </button>
          </div>
        )}
      </header>

      {/* Mobile Fixed Bottom Navigation Bar (Natural thumb reach, <=15% sticky height) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#FAF9F5]/95 backdrop-blur-md border-t border-stone-200/90 pb-safe">
        <div className="grid grid-cols-5 items-center h-14 px-2">
          {[
            { id: 'home', label: 'Home', icon: Home },
            { id: 'pet', label: 'My Pet', icon: Heart },
            { id: 'feeding', label: 'Feeding', icon: Utensils },
            { id: 'vet', label: 'Vet Care', icon: Stethoscope },
            { id: 'assistant', label: 'AI Care', icon: Bot },
          ].map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => handleNavClick(item.id as NavTab)}
                className={`flex flex-col items-center justify-center h-full min-h-[44px] transition-colors ${
                  isActive ? 'text-emerald-800 font-semibold' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'stroke-[2.2] text-emerald-800' : 'stroke-[1.6]'}`} />
                <span className="text-[10px] tracking-tight mt-0.5">{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
};
