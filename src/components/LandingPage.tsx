import React from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './common/ImageWithFallback';
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
  PawPrint
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
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-900 text-xs font-medium">
                <Sparkles className="w-3.5 h-3.5 text-emerald-700" />
                <span>Modern Veterinary-Tech Ecosystem</span>
                <span className="text-emerald-400">·</span>
                <span>AI-Assisted</span>
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
                  className="px-6 py-3.5 rounded-xl bg-emerald-800 text-white font-semibold text-sm hover:bg-emerald-900 transition-all shadow-md shadow-emerald-900/10 active:scale-[0.98] flex items-center gap-2 cursor-pointer"
                >
                  <PawPrint className="w-4 h-4 fill-white" />
                  <span>Create Pet Profile</span>
                  <ArrowRight className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setActiveTab('pet')}
                  className="px-6 py-3.5 rounded-xl bg-white border border-stone-300 text-stone-800 font-semibold text-sm hover:bg-stone-50 transition-colors shadow-2xs active:scale-[0.98] cursor-pointer"
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
                  src="/src/assets/images/hero_pawcare_pets_1790874508015.jpg"
                  alt="Healthy golden retriever and cat in modern sunlit living room"
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.02]"
                />
                
                {/* Floating Quick Insight Card */}
                <div className="absolute bottom-4 left-4 right-4 sm:left-6 sm:right-auto sm:max-w-xs bg-white/95 backdrop-blur-md p-4 rounded-2xl border border-stone-200 shadow-xl">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0">
                      <PawPrint className="w-5 h-5 fill-emerald-800" />
                    </div>
                    <div>
                      <div className="text-xs font-semibold text-stone-900">Current Companion: {activePet.name}</div>
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
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center">
                <Heart className="w-6 h-6 stroke-[1.8]" />
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
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center">
                <Utensils className="w-6 h-6 stroke-[1.8]" />
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
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
                <Stethoscope className="w-6 h-6 stroke-[1.8]" />
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
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center">
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

          {/* Card 5: Pet Products */}
          <div 
            onClick={() => setActiveTab('store')}
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-blue-50 text-blue-800 flex items-center justify-center">
                <ShoppingBag className="w-6 h-6 stroke-[1.8]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900 group-hover:text-blue-900 transition-colors">
                Curated Pet Products
              </h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Veterinarian-approved nutrition, hypoallergenic grooming essentials, enrichment toys, and orthopedic beds.
              </p>
            </div>
            <div className="pt-6 flex items-center gap-1 text-xs font-semibold text-blue-800 group-hover:translate-x-1 transition-transform">
              <span>Browse Pet Store</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </div>
          </div>

          {/* Card 6: Seasonal Care & AI Assistant */}
          <div 
            onClick={() => setActiveTab('seasonal')}
            className="group p-6 rounded-2xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all cursor-pointer flex flex-col justify-between"
          >
            <div className="space-y-4">
              <div className="w-12 h-12 rounded-xl bg-orange-50 text-orange-800 flex items-center justify-center">
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

        </div>

        {/* Feature Spotlight: PawCare AI */}
        <div className="mt-8 p-8 rounded-3xl bg-linear-to-r from-emerald-950 via-emerald-900 to-stone-900 text-white relative overflow-hidden shadow-xl">
          <div className="relative z-10 max-w-2xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-800/80 text-emerald-200 text-xs font-medium">
              <Bot className="w-3.5 h-3.5" />
              <span>Context-Aware Pet Companion AI</span>
            </div>
            <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white">
              Instant answers tailored to your pet's exact profile.
            </h3>
            <p className="text-emerald-100 text-sm sm:text-base leading-relaxed">
              Ask questions regarding dietary safety, puppy feeding rhythms, hydration tricks, or upload a pet photo for visual observations with responsible, non-diagnostic guidance.
            </p>
            <div className="pt-2">
              <button
                onClick={() => setActiveTab('assistant')}
                className="px-5 py-3 rounded-xl bg-white text-emerald-950 font-bold text-sm hover:bg-stone-100 transition-colors shadow-sm flex items-center gap-2"
              >
                <span>Chat with PawCare AI</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* 3. HOW PAWCARE WORKS */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-stone-100/80 rounded-3xl p-8 sm:p-12 border border-stone-200/80">
          <div className="text-center max-w-xl mx-auto space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-900">
              How PawCare Works
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Three simple steps to proactive companion wellness.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                01
              </div>
              <h3 className="text-base font-bold text-stone-900">Create your pet profile</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Add species, breed, age, weight, and upload a photo for seamless identification across all care modules.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
                02
              </div>
              <h3 className="text-base font-bold text-stone-900">Tell us about your pet</h3>
              <p className="text-xs text-stone-600 leading-relaxed">
                Record allergies, activity preferences, indoor/outdoor habits, and dietary restrictions to calibrate safety filters.
              </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-stone-200 shadow-2xs space-y-3">
              <div className="w-8 h-8 rounded-full bg-emerald-800 text-white font-bold text-xs flex items-center justify-center">
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
          
          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "Managing Bruno’s sensitive digestion was overwhelming before PawCare. The feeding planner and toxic food safety database give our family peace of mind every single morning."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Camila Ramos</span>
                <span>Guardian to Bruno (Golden Retriever)</span>
              </div>
              <span className="text-[10px] text-stone-600">Demo User</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "The monsoon paw-care checklist saved Luna from chronic yeast infections. Having seasonal tips auto-adapt to our climate is sheer genius for cat parents."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Julian Mercer</span>
                <span>Guardian to Luna (Persian Cat)</span>
              </div>
              <span className="text-[10px] text-stone-600">Demo User</span>
            </div>
          </div>

          <div className="p-6 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-4">
            <div className="flex items-center gap-1 text-amber-500">
              {'★★★★★'}
            </div>
            <p className="text-xs sm:text-sm text-stone-700 leading-relaxed italic">
              "Booking appointments with vetted dermatologists and tracking Milo’s booster vaccinations on one clean dashboard feels like the future of veterinary tech."
            </p>
            <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs text-stone-500">
              <div>
                <span className="font-semibold text-stone-900 block">Aria Thornton</span>
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
              <div className="flex items-center gap-2">
                <div className="w-7 h-7 rounded-lg bg-emerald-800 text-white flex items-center justify-center">
                  <PawPrint className="w-3.5 h-3.5 fill-white" />
                </div>
                <span className="text-lg font-bold text-stone-900">PawCare</span>
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
              © 2026 PawCare Inc. All rights reserved. Built as a prototype for veterinary-care innovation.
            </div>
            <div className="text-[11px] text-stone-600 text-center sm:text-right max-w-md">
              Disclaimer: Simulated features (vet booking, store checkout) are for prototype demonstration and not affiliated with actual medical clinics or payment gateways.
            </div>
          </div>

        </div>
      </footer>

    </div>
  );
};
