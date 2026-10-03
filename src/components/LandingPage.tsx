import React from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './common/ImageWithFallback';
import heroAllPetsImg from '../assets/images/all_pets_realistic_1790933284668.jpg';
import { 
  Heart, 
  Utensils, 
  Stethoscope, 
  Bell, 
  ShoppingBag, 
  SunMedium, 
  Bot, 
  ArrowRight, 
  ShieldCheck, 
  Check, 
  Sparkles,
  PawPrint,
  Crown
} from 'lucide-react';

interface LandingPageProps {
  onOpenNewPetModal: () => void;
}

export const LandingPage: React.FC<LandingPageProps> = ({ onOpenNewPetModal }) => {
  const { setActiveTab, activePet } = useApp();

  return (
    <div className="space-y-20 pb-16">
      
      {/* 1. HERO SECTION */}
      <section className="relative pt-6 sm:pt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
            
            <div className="lg:col-span-6 space-y-6">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-50/90 border border-emerald-200/90 text-emerald-950 text-xs font-semibold shadow-2xs">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>✦ AI Powered Companion Platform</span>
                <span className="text-emerald-400">·</span>
                <span>Veterinary Aligned</span>
              </div>

              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-stone-900 leading-[1.1] text-balance">
                Better care. <br className="hidden sm:inline" />
                <span className="text-emerald-900">Happier companions.</span>
              </h1>

              <p className="text-lg sm:text-xl text-stone-600 max-w-xl leading-relaxed text-pretty">
                Personalized everyday care, feeding guidance, reminders and veterinary support for the pets you love.
              </p>

              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button
                  onClick={onOpenNewPetModal}
                  className="px-6 py-3.5 rounded-2xl bg-emerald-800/80 hover:bg-emerald-800/90 text-white font-semibold text-sm backdrop-blur-2xl border border-white/30 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.45),inset_0_-1px_1px_0_rgba(0,0,0,0.25),0_8px_20px_-4px_rgba(6,78,59,0.35)] hover:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,0.6),0_12px_28px_-6px_rgba(6,78,59,0.45)] hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-200 flex items-center gap-2 cursor-pointer"
                >
                  <PawPrint className="w-4 h-4 fill-white" />
                  <span>Create Pet Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('pet')}
                  className="px-6 py-3.5 rounded-2xl bg-white/50 hover:bg-white/70 text-stone-800 font-semibold text-sm backdrop-blur-2xl border border-white/80 shadow-[inset_0_1px_1px_0_rgba(255,255,255,0.9),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_8px_20px_-4px_rgba(0,0,0,0.06)] hover:shadow-[inset_0_1px_1.5px_0_rgba(255,255,255,1),0_12px_28px_-6px_rgba(0,0,0,0.09)] hover:-translate-y-0.5 active:scale-[0.985] transition-all duration-200 cursor-pointer"
                >
                  Explore Dashboard
                </button>
              </div>

              {/* Quick trust metrics */}
              <div className="pt-6 border-t border-stone-200/80 flex items-center gap-6 text-xs text-stone-600">
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-700" />
                  <span>Evidence-Based Guidelines</span>
                </div>
                <span>·</span>
                <div>
                  <span className="font-semibold text-stone-800">5 Species</span> Supported
                </div>
                <span>·</span>
                <div>
                  <span className="font-semibold text-stone-800">Verified</span> Demo Network
                </div>
              </div>
            </div>

            {/* Hero Visual Asset */}
            <div className="lg:col-span-6 relative">
              <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-stone-200/90 aspect-16/10 bg-stone-100 group">
                <ImageWithFallback
                  src={heroAllPetsImg || '/assets/images/all_pets_realistic_1790933284668.jpg'}
                  fallbackSrc="https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=1200&auto=format&fit=crop&q=80"
                  alt="Realistic domestic pets including dogs, cats, rabbits, and birds gathered together in a sunlit home"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                
                {/* Floating Quick Insight Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white/80 backdrop-blur-xl p-4 rounded-2xl border border-white/80 shadow-[0_12px_32px_rgba(0,0,0,0.12),inset_0_1px_1px_rgba(255,255,255,0.95)] animate-float-gentle">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50/90 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
                      <PawPrint className="w-5 h-5 fill-emerald-800" />
                    </div>
                    <div>
                      <div className="flex items-center gap-1.5">
                        <span className="text-xs font-semibold text-stone-900">{activePet.name}</span>
                        <span className="text-[10px] font-bold text-emerald-800 bg-emerald-100/90 px-1.5 py-0.2 rounded-full border border-emerald-200/60">✦ AI Pet Insights</span>
                      </div>
                      <div className="text-[11px] text-stone-600">{activePet.breed} · Next meal 7:30 PM</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. CORE CAPABILITIES (BENTO GRID) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-3 mb-10 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-stone-900 text-balance">
            Everything your companion needs, in one unified place.
          </h2>
          <p className="text-stone-600 text-sm sm:text-base text-pretty">
            Designed to support every facet of pet parenthood with clinical precision and heartfelt care.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          
          {/* Card 1: Personalized Pet Care */}
          <div 
            onClick={() => setActiveTab('pet')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(6,78,59,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-emerald-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                  <Heart className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-100/90 text-emerald-900 text-[10px] font-bold border border-emerald-200/80">
                  ✦ Personalized by AI
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-emerald-900 transition-colors">
                Personalized Pet Care
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Comprehensive digital profile tailored to breed, age, weight, and lifestyle with an active wellness snapshot.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-emerald-800 group-hover:translate-x-1 transition-transform">
              <span>View Profile & Snapshot</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 2: Feeding Guidance */}
          <div 
            onClick={() => setActiveTab('feeding')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(217,119,6,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-amber-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                  <Utensils className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold border border-amber-200/80">
                  ✦ AI Calibrated Rhythms
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-900 transition-colors">
                Feeding Guidance
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Interactive meal schedules, hydration calculation, age-specific portion guidance, and safe food reference lists.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>Explore Smart Feeding</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 3: Veterinary Appointments */}
          <div 
            onClick={() => setActiveTab('vet')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(13,148,136,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-teal-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                  <Stethoscope className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-teal-100/90 text-teal-900 text-[10px] font-bold border border-teal-200/80">
                  ✦ AI Triage Assistant
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-teal-900 transition-colors">
                Veterinary Appointments
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Discover qualified veterinarians by specialty, check open consultation slots, and book seamless demo visits.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-teal-800 group-hover:translate-x-1 transition-transform">
              <span>Find Veterinarians</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 4: Vaccination Reminders */}
          <div 
            onClick={() => setActiveTab('reminders')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(225,29,72,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-rose-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                <Bell className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-rose-900 transition-colors">
                Vaccination & Health Reminders
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Stay punctual on DHPP boosters, heartworm chewables, grooming dates, and dental cleaning appointments.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-rose-800 group-hover:translate-x-1 transition-transform">
              <span>Manage Reminders</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 5: Pet Food & Supplies */}
          <div 
            onClick={() => setActiveTab('food')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(37,99,235,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-blue-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                <Utensils className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-blue-900 transition-colors">
                58+ Pet Food Pantry
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Veterinarian-approved dry kibbles, wet cans, raw bites, and clinical diets. Order online for delivery or 45-min store pickup.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-blue-800 group-hover:translate-x-1 transition-transform">
              <span>Explore Food Pantry (58+ Items)</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Seasonal Care & AI Assistant */}
          <div 
            onClick={() => setActiveTab('seasonal')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(234,88,12,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-orange-800 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                <SunMedium className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-orange-900 transition-colors">
                Seasonal Care & Weather Checklist
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Dynamic protection for hot pavements, monsoon paw fungal hygiene, winter draft protection, and spring allergens.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-orange-800 group-hover:translate-x-1 transition-transform">
              <span>View Seasonal Protocols</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 7: Accessories Boutique & Fashion Studio */}
          <div 
            onClick={() => setActiveTab('store')}
            className="group p-6 rounded-3xl bg-white/45 hover:bg-white/65 backdrop-blur-2xl border border-white/70 hover:border-white/90 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_10px_30px_-5px_rgba(0,0,0,0.05),0_4px_12px_-2px_rgba(0,0,0,0.02)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_20px_40px_-8px_rgba(217,119,6,0.08),0_6px_16px_-3px_rgba(0,0,0,0.03)] hover:-translate-y-1 active:scale-[0.99] transition-all duration-300 cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="w-12 h-12 rounded-2xl bg-white/70 backdrop-blur-md border border-white/80 text-amber-700 flex items-center justify-center shadow-[inset_0_1px_1px_rgba(255,255,255,0.95),0_2px_8px_rgba(0,0,0,0.04)]">
                  <Crown className="w-6 h-6 stroke-[1.8]" />
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-amber-100/90 text-amber-900 text-[10px] font-bold border border-amber-200/80">
                  ✦ AI Fit Matcher
                </span>
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-amber-800 transition-colors">
                Accessories & Fashion Studio
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Tuscan leather collars, custom brass tags, velvet step-in harnesses, and weather-proof apparel tailored to your pet's size.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-amber-800 group-hover:translate-x-1 transition-transform">
              <span>Explore Boutique & Apparel</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

        </div>

        {/* Feature Spotlight: PawCare AI */}
        <div className="mt-8 p-8 sm:p-10 rounded-3xl relative overflow-hidden bg-gradient-to-br from-emerald-950/85 via-emerald-900/75 to-stone-900/85 backdrop-blur-2xl border border-white/20 shadow-[0_20px_50px_-12px_rgba(6,78,59,0.35),inset_0_1px_1px_rgba(255,255,255,0.4),inset_0_-1px_1px_rgba(0,0,0,0.5)] text-white">
          {/* Realistic glass ambient light flares / refraction spheres */}
          <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-400/20 blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-amber-400/15 blur-3xl pointer-events-none" />
          <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-64 h-64 rounded-full bg-teal-300/10 blur-2xl pointer-events-none" />

          {/* Top specular reflection sheen layer */}
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.12] via-transparent to-black/[0.15] pointer-events-none" />

          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-medium shadow-xs">
              <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
              <span>✦ Ask PawCare AI</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white drop-shadow-xs">
              Instant answers tailored to your pet's exact profile.
            </h3>
            <p className="text-emerald-100/90 text-sm sm:text-base leading-relaxed text-pretty">
              Ask questions regarding dietary safety, puppy feeding rhythms, hydration tricks, or upload a pet photo for visual observations with responsible, non-diagnostic guidance.
            </p>
            <div className="pt-2">
              <div className="relative inline-flex group">
                {/* AI Neural Aura Glow Pulse behind the button */}
                <div 
                  className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-emerald-400 via-teal-300 to-amber-300 opacity-70 blur-md group-hover:opacity-100 transition duration-500 animate-ai-glow pointer-events-none" 
                  aria-hidden="true" 
                />

                {/* The Interactive AI Button */}
                <button
                  onClick={() => setActiveTab('assistant')}
                  className="relative px-6 py-3.5 rounded-2xl bg-white text-emerald-950 font-bold text-sm transition-all duration-300 shadow-[0_8px_24px_rgba(6,78,59,0.25),inset_0_1px_1px_rgba(255,255,255,1)] hover:shadow-[0_12px_32px_rgba(6,78,59,0.35)] hover:scale-[1.03] active:scale-[0.98] flex items-center gap-2.5 overflow-hidden cursor-pointer"
                >
                  {/* Continuous AI Shimmer Beam */}
                  <span 
                    className="absolute inset-0 w-2/3 h-full bg-gradient-to-r from-transparent via-emerald-100/70 to-transparent animate-ai-shimmer pointer-events-none" 
                    aria-hidden="true" 
                  />

                  {/* Pulsing AI Live Status Indicator */}
                  <span className="relative flex h-2.5 w-2.5 shrink-0" aria-hidden="true">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75" />
                    <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-600 shadow-xs" />
                  </span>

                  {/* Animated AI Sparkles */}
                  <Sparkles className="w-4 h-4 text-emerald-700 animate-pulse shrink-0" />

                  <span className="relative tracking-tight">Chat with PawCare AI</span>

                  <ArrowRight className="w-4 h-4 text-emerald-800 transition-transform duration-300 group-hover:translate-x-1.5 shrink-0" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW PAWCARE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white/60 backdrop-blur-2xl rounded-3xl p-8 sm:p-12 border border-white/80 shadow-[0_12px_40px_-8px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)]">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              How PawCare Works
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Three simple steps to proactive companion wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white/75 backdrop-blur-xl p-6 rounded-2xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200/90 shadow-2xs">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900">Create your pet profile</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Add species, breed, age, weight, and upload a photo for seamless identification across all care modules.
              </p>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-6 rounded-2xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200/90 shadow-2xs">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900">Tell us about your pet</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Record allergies, activity preferences, indoor/outdoor habits, and dietary restrictions to calibrate safety filters.
              </p>
            </div>

            <div className="bg-white/75 backdrop-blur-xl p-6 rounded-2xl border border-white/90 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-100/90 text-emerald-900 font-bold text-xs flex items-center justify-center border border-emerald-200/90 shadow-2xs">
                03
              </div>
              <h3 className="text-base font-bold text-stone-900">Get personalized guidance</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Receive customized feeding timelines, seasonal health alerts, and instant advice from PawCare AI.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. TESTIMONIALS (Clearly labeled demo content) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="space-y-2 mb-8 text-center">
          <div className="text-xs font-semibold uppercase tracking-wider text-emerald-800">
            Community Stories · Demo Showcase
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
            Trusted by modern pet guardians
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "Managing Bruno’s sensitive digestion was overwhelming before PawCare. The feeding planner and toxic food safety database give our family peace of mind every single morning."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Aryan Patil</span>
                <span>Guardian to Bruno (Golden Retriever)</span>
              </div>
              <span className="text-[10px] text-stone-600">Demo User</span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "The monsoon paw-care checklist saved Luna from chronic yeast infections. Having seasonal tips auto-adapt to our climate is sheer genius for cat parents."
            </p>
            <div className="pt-6 mt-4 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Zia Joshep</span>
                <span>Guardian to Luna (Persian Cat)</span>
              </div>
              <span className="text-[10px] text-stone-600 text-right leading-tight block">
                Demo<br />User
              </span>
            </div>
          </div>

          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_30px_-6px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 transition-all duration-300 space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "Booking appointments with vetted dermatologists and tracking Milo’s booster vaccinations on one clean dashboard feels like the future of veterinary tech."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Jeet Singh</span>
                <span>Guardian to Milo (Beagle Puppy)</span>
              </div>
              <span className="text-[10px] text-stone-600">Demo User</span>
            </div>
          </div>

        </div>
      </section>

      {/* 5. QUIET FOOTER */}
      <footer className="border-t border-stone-200 pt-12 pb-8 bg-white/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
            <div className="space-y-3 md:col-span-1">
              <div className="flex items-center gap-2.5">
                <div className="relative w-8 h-8 rounded-xl bg-linear-to-br from-emerald-600 via-emerald-800 to-stone-900 p-[1.5px] shadow-xs flex items-center justify-center">
                  <div className="w-full h-full rounded-[10px] bg-linear-to-br from-emerald-900 via-emerald-800 to-teal-950 flex items-center justify-center relative overflow-hidden">
                    <div className="absolute -top-1.5 -right-1.5 w-4 h-4 rounded-full bg-amber-400/30 blur-xs pointer-events-none" />
                    <svg
                      viewBox="0 0 32 32"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      className="w-4.5 h-4.5"
                      aria-label="PawCare Logo"
                    >
                      {/* Dog silhouette */}
                      <path
                        d="M7 14C6 11.5 7.5 8.5 10 7.5C12 6.8 14 7.8 15 9.5C13.8 11.8 13.2 14.5 13.2 17.5C13.2 20.8 14.2 23.5 15.8 25C11.8 25 8.5 21.8 7.5 17.8C7 16 6.8 15 7 14Z"
                        fill="#FAF9F5"
                      />
                      <path
                        d="M7.5 11.5C6 13.2 5.8 17 6.8 19C7.5 20.2 8.8 19.8 9.2 17.8C9.6 15.2 9.2 13 7.5 11.5Z"
                        fill="#E2E8F0"
                      />

                      {/* Cat silhouette */}
                      <path
                        d="M18 7.5L20.5 3.5L22.5 7C24.5 8.2 26.5 10.8 26.5 14.2C26.5 18.5 23.8 22.5 20 24.5C18.5 25.1 17 25.3 15.8 25.4C14.5 23.5 13.8 20.8 13.8 17.5C13.8 13.8 15.2 11 17.2 8.5L18 7.5Z"
                        fill="#F59E0B"
                      />
                      <path
                        d="M19.5 6.8L20.6 5L21.8 6.8C21.1 7.2 20.2 7.2 19.5 6.8Z"
                        fill="#B45309"
                      />

                      {/* Rabbit ears */}
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

                      {/* Companion bird accent */}
                      <path
                        d="M24.5 4.5C25.5 3.8 27 3.8 28 4.2C27.2 5 26.5 5.8 26.2 6.5C25.5 6 24.8 5.2 24.5 4.5Z"
                        fill="#FEF08A"
                      />

                      {/* Unified loving heart */}
                      <path
                        d="M14.5 17C14.5 15.5 15.5 14.8 16.2 15.5C17 14.8 18 15.5 18 17C18 18.8 16.2 20.2 16.2 20.2C16.2 20.2 14.5 18.8 14.5 17Z"
                        fill="#FAF9F5"
                      />
                    </svg>
                  </div>
                </div>
                <span className="font-['Outfit',sans-serif] text-[20px] font-black tracking-[-0.03em] text-stone-900 inline-flex items-center">
                  Paw<span className="text-emerald-800 font-extrabold ml-px">Care</span>
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 ml-1 mb-0.5 inline-block" />
                </span>
              </div>
              <p className="text-xs text-stone-500 leading-relaxed">
                Better care. Happier companions. Modern, AI-assisted health and lifestyle companion for pet owners worldwide.
              </p>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">Ecosystem</div>
              <div className="flex flex-col gap-1.5 text-stone-600">
                <button onClick={() => setActiveTab('pet')} className="hover:text-stone-900 text-left">Pet Profiles</button>
                <button onClick={() => setActiveTab('feeding')} className="hover:text-stone-900 text-left">Smart Feeding</button>
                <button onClick={() => setActiveTab('seasonal')} className="hover:text-stone-900 text-left">Seasonal Care</button>
                <button onClick={() => setActiveTab('vet')} className="hover:text-stone-900 text-left">Find Veterinarians</button>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">Pet Safety & Ethics</div>
              <div className="flex flex-col gap-1.5 text-stone-600">
                <span>Non-Diagnostic AI Standards</span>
                <span>Veterinary Advisory Alignment</span>
                <span>Ingredient Safety Database</span>
                <span>Emergency Triage Protocol</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <div className="font-semibold text-stone-900 uppercase tracking-wider text-[11px]">Legal & Project</div>
              <div className="flex flex-col gap-1.5 text-stone-600">
                <span>Terms of Service (Demo MVP)</span>
                <span>Privacy & Pet Data Integrity</span>
                <span>Student / Portfolio Showcase</span>
                <span>Open-Source Compliance</span>
              </div>
            </div>
          </div>

          <div className="pt-6 border-t border-stone-200/80 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-600">
            <div>
              © 2026 PawCare Inc. All rights reserved.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
