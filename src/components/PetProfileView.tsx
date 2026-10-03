import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  Heart, 
  Utensils, 
  Bell, 
  Stethoscope, 
  Calendar, 
  Scale, 
  Clock, 
  Edit3, 
  Plus, 
  ShieldAlert, 
  Info,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  PawPrint
} from 'lucide-react';

interface PetProfileViewProps {
  onOpenNewPetModal: () => void;
  onEditPet: () => void;
}

export const PetProfileView: React.FC<PetProfileViewProps> = ({ onOpenNewPetModal, onEditPet }) => {
  const { 
    pets, 
    activePet, 
    setActivePetId, 
    feedingSchedule, 
    reminders, 
    appointments, 
    setActiveTab 
  } = useApp();

  const [activeTabSub, setActiveTabSub] = useState<'overview' | 'lifestyle' | 'history'>('overview');

  // Next feeding
  const nextFeeding = feedingSchedule.find((m) => !m.completed) || feedingSchedule[0];
  
  // Upcoming reminder
  const upcomingReminders = reminders.filter((r) => !r.completed && r.petId === activePet.id);
  const nextReminder = upcomingReminders[0];

  // Upcoming vaccination
  const upcomingVaccination = reminders.find(
    (r) => !r.completed && r.petId === activePet.id && r.type === 'vaccination'
  );

  // Next vet appointment
  const nextAppointment = appointments.find(
    (a) => a.petId === activePet.id && (a.status === 'Confirmed' || a.status === 'Awaiting confirmation')
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* 1. Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <PawPrint className="w-3.5 h-3.5 fill-emerald-800" />
            <span>Companion Dossier</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200/80">
              ✦ AI Pet Insights
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900 flex items-center gap-3">
            <span>Welcome back, {activePet.name}</span>
            <span className="text-emerald-800 text-2xl sm:text-3xl">🐾</span>
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Personalized dashboard tailored to {activePet.name}’s biology, routine, and clinical appointments.
          </p>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-center">
          <button
            onClick={onEditPet}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-white border border-stone-200 hover:bg-stone-50 text-stone-700 text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>Edit Profile</span>
          </button>
          
          <button
            onClick={onOpenNewPetModal}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Companion</span>
          </button>
        </div>
      </div>

      {/* 2. Switcher Carousel if multiple pets */}
      {pets.length > 1 && (
        <div className="flex items-center gap-3 overflow-x-auto pb-2 scrollbar-none">
          {pets.map((p) => (
            <button
              key={p.id}
              onClick={() => setActivePetId(p.id)}
              className={`flex items-center gap-2.5 px-3 py-1.5 rounded-full border text-xs font-medium shrink-0 transition-all cursor-pointer ${
                p.id === activePet.id
                  ? 'bg-emerald-50 border-emerald-700 text-emerald-900 shadow-2xs'
                  : 'bg-white border-stone-200 text-stone-600 hover:border-stone-300'
              }`}
            >
              <ImageWithFallback
                src={p.photoUrl}
                fallbackSrc={
                  p.animalType === 'Dog'
                    ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=200&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=200&auto=format&fit=crop&q=80'
                }
                alt={p.name}
                className="w-5 h-5 rounded-full object-cover"
              />
              <span>{p.name}</span>
              <span className="text-stone-400">·</span>
              <span className="text-[11px] text-stone-500">{p.breed}</span>
            </button>
          ))}
        </div>
      )}

      {/* 3. Hero Companion Card & Key Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Left Column: Visual Profile Card */}
        <div className="lg:col-span-5 bg-white/70 backdrop-blur-xl rounded-3xl p-6 border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] flex flex-col justify-between">
          <div className="space-y-6">
            <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200/90 shadow-inner">
              <ImageWithFallback
                src={activePet.photoUrl}
                fallbackSrc={
                  activePet.animalType === 'Dog'
                    ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=800&auto=format&fit=crop&q=80'
                    : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=800&auto=format&fit=crop&q=80'
                }
                alt={activePet.name}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-stone-900/70 backdrop-blur-md text-white text-[11px] font-semibold">
                {activePet.animalType}
              </div>
            </div>

            <div className="space-y-1">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-stone-900">{activePet.name}</h2>
                <span className="text-xs font-medium text-stone-500">{activePet.gender}</span>
              </div>
              <p className="text-sm text-stone-600 font-medium">{activePet.breed}</p>
            </div>

            {/* Core Stats Row */}
            <div className="grid grid-cols-3 gap-2 p-3 rounded-2xl bg-stone-50 border border-stone-100 text-center">
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-600">Age</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">{activePet.age} yrs</div>
              </div>
              <div className="border-x border-stone-200">
                <div className="text-[10px] uppercase font-semibold text-stone-600">Weight</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5">{activePet.weight} kg</div>
              </div>
              <div>
                <div className="text-[10px] uppercase font-semibold text-stone-600">Activity</div>
                <div className="text-sm font-bold text-stone-900 mt-0.5 truncate">{activePet.activityLevel}</div>
              </div>
            </div>

            {/* Quick Context Details */}
            <div className="space-y-2.5 text-xs text-stone-600 pt-2 border-t border-stone-100">
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-600 shrink-0">Environment:</span>
                <span className="font-medium text-stone-800 text-right">{activePet.indoorOutdoor}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-600 shrink-0">Allergies:</span>
                <span className="font-medium text-stone-800 text-right">{activePet.allergies}</span>
              </div>
              <div className="flex items-start justify-between gap-2">
                <span className="text-stone-600 shrink-0">Diet Base:</span>
                <span className="font-medium text-stone-800 text-right max-w-[200px] truncate">
                  {activePet.dietaryRestrictions}
                </span>
              </div>
              {activePet.microchipId && (
                <div className="flex items-start justify-between gap-2">
                  <span className="text-stone-600 shrink-0">Microchip:</span>
                  <span className="font-mono text-stone-800 text-[11px] text-right">{activePet.microchipId}</span>
                </div>
              )}
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-stone-100 flex items-center justify-between">
            <span className="text-[11px] text-stone-600">PawCare Dossier #PC-{activePet.id.replace('pet-', '')}</span>
            <button
              onClick={() => setActiveTab('assistant')}
              className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-800 hover:text-emerald-950 transition-colors"
            >
              <span>✦ Ask PawCare AI</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right Column: Routine At-A-Glance & Wellness Indicators */}
        <div className="lg:col-span-7 space-y-6">
          
          {/* Quick Schedule Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            
            {/* Card A: Next Feeding */}
            <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:border-amber-600/30 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shadow-2xs">
                  <Utensils className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-amber-800 bg-amber-50/80 px-2.5 py-0.5 rounded-full">
                  Next Meal
                </span>
              </div>
              <div className="my-3">
                <div className="text-xs text-stone-500 font-medium">Scheduled Meal</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">
                  {nextFeeding ? `${nextFeeding.time} · ${nextFeeding.name}` : 'Schedule Complete'}
                </div>
                {nextFeeding && (
                  <p className="text-xs text-stone-600 mt-1 line-clamp-1">
                    {nextFeeding.portion}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveTab('feeding')}
                className="text-xs font-semibold text-stone-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>Open Feeding Planner</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card B: Upcoming Reminder */}
            <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:border-emerald-600/30 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shadow-2xs">
                  <Bell className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-emerald-800 bg-emerald-50/80 px-2.5 py-0.5 rounded-full">
                  Upcoming
                </span>
              </div>
              <div className="my-3">
                <div className="text-xs text-stone-500 font-medium">Next Action Item</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">
                  {nextReminder ? nextReminder.title : 'All Reminders Caught Up'}
                </div>
                {nextReminder && (
                  <p className="text-xs text-stone-600 mt-1">
                    Due: {nextReminder.date} at {nextReminder.time}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveTab('reminders')}
                className="text-xs font-semibold text-stone-700 hover:text-emerald-800 inline-flex items-center gap-1 pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>Manage Reminders</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card C: Upcoming Vaccination */}
            <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:border-rose-600/30 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-rose-50 text-rose-800 flex items-center justify-center shadow-2xs">
                  <Heart className="w-4 h-4 stroke-[2]" />
                </div>
                <span className="text-[11px] font-semibold text-rose-800 bg-rose-50/80 px-2.5 py-0.5 rounded-full">
                  Immunization
                </span>
              </div>
              <div className="my-3">
                <div className="text-xs text-stone-500 font-medium">Booster Due</div>
                <div className="text-base font-bold text-stone-900 mt-0.5">
                  {upcomingVaccination ? upcomingVaccination.title : 'Vaccinations Up To Date'}
                </div>
                {upcomingVaccination && (
                  <p className="text-xs text-stone-600 mt-1">
                    Scheduled: {upcomingVaccination.date}
                  </p>
                )}
              </div>
              <button
                onClick={() => setActiveTab('reminders')}
                className="text-xs font-semibold text-stone-700 hover:text-rose-800 inline-flex items-center gap-1 pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>View Vaccination Log</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

            {/* Card D: Vet Appointment */}
            <div className="p-5 rounded-2xl bg-white/75 backdrop-blur-xl border border-white/80 shadow-[0_6px_24px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,0.95)] hover:bg-white/90 hover:border-teal-600/30 transition-all flex flex-col justify-between">
              <div className="flex items-center justify-between">
                <div className="w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center shadow-2xs">
                  <Stethoscope className="w-4 h-4 stroke-[2]" />
                </div>
                <span className={`text-[11px] font-semibold px-2.5 py-0.5 rounded-full ${
                  nextAppointment?.status === 'Awaiting confirmation'
                    ? 'text-amber-800 bg-amber-50 border border-amber-200'
                    : 'text-teal-800 bg-teal-50/80'
                }`}>
                  {nextAppointment?.status === 'Awaiting confirmation' ? '🟡 Awaiting Confirmation' : 'Clinical Visit'}
                </span>
              </div>
              <div className="my-3">
                <div className="text-xs text-stone-500 font-medium">Veterinary Care</div>
                <div className="text-base font-bold text-stone-900 mt-0.5 truncate">
                  {nextAppointment ? nextAppointment.vetName : 'No Upcoming Booking'}
                </div>
                <p className="text-xs text-stone-600 mt-1">
                  {nextAppointment
                    ? `${nextAppointment.date} · ${nextAppointment.time}`
                    : 'Schedule routine preventive checkup'}
                </p>
              </div>
              <button
                onClick={() => setActiveTab('vet')}
                className="text-xs font-semibold text-stone-700 hover:text-teal-800 inline-flex items-center gap-1 pt-2 border-t border-stone-100 cursor-pointer"
              >
                <span>{nextAppointment ? 'View Appointment' : 'Book a Vet'}</span>
                <ArrowRight className="w-3 h-3" />
              </button>
            </div>

          </div>

          {/* 4. PET WELLNESS SNAPSHOT (Section 9) */}
          <div className="p-6 rounded-3xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.05),inset_0_1px_1px_rgba(255,255,255,1)] space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold text-stone-900">
                    Pet Wellness Snapshot
                  </h3>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-900 text-[10px] font-bold border border-emerald-200">
                    ✦ Personalized by AI
                  </span>
                </div>
                <p className="text-xs text-stone-500">
                  Daily tracking and engagement completion metrics for {activePet.name}.
                </p>
              </div>
              <div className="inline-flex items-center gap-1 text-[11px] font-medium text-stone-500 bg-stone-100 px-2.5 py-1 rounded-full">
                <Info className="w-3 h-3 text-stone-400" />
                <span>Organizational Index</span>
              </div>
            </div>

            <div className="space-y-4 pt-2">
              
              {/* Nutrition */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">Nutrition Plan Adherence</span>
                  <span className="font-mono text-stone-600">{activePet.wellness.nutrition}%</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-600 rounded-full transition-all duration-500" 
                    style={{ width: `${activePet.wellness.nutrition}%` }} 
                  />
                </div>
              </div>

              {/* Hydration */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">Hydration Target</span>
                  <span className="font-mono text-stone-600">{activePet.wellness.hydration}%</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-teal-600 rounded-full transition-all duration-500" 
                    style={{ width: `${activePet.wellness.hydration}%` }} 
                  />
                </div>
              </div>

              {/* Activity */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">Physical Activity & Walks</span>
                  <span className="font-mono text-stone-600">{activePet.wellness.activity}%</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-amber-600 rounded-full transition-all duration-500" 
                    style={{ width: `${activePet.wellness.activity}%` }} 
                  />
                </div>
              </div>

              {/* Vaccinations */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">Vaccination Records Complete</span>
                  <span className="font-mono text-stone-600">{activePet.wellness.vaccinations}%</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-emerald-700 rounded-full transition-all duration-500" 
                    style={{ width: `${activePet.wellness.vaccinations}%` }} 
                  />
                </div>
              </div>

              {/* Reminders */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="font-semibold text-stone-800">Routine Care Reminders</span>
                  <span className="font-mono text-stone-600">{activePet.wellness.reminders}%</span>
                </div>
                <div className="h-2.5 w-full bg-stone-100 rounded-full overflow-hidden">
                  <div 
                    className="h-full bg-stone-700 rounded-full transition-all duration-500" 
                    style={{ width: `${activePet.wellness.reminders}%` }} 
                  />
                </div>
              </div>

            </div>

            {/* Explicit Non-Diagnostic Disclaimer as required in Section 9 */}
            <div className="p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200/70 text-amber-900 text-xs flex items-start gap-2.5 leading-relaxed">
              <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
              <div>
                <span className="font-semibold">Important Transparency Notice:</span> These indicators reflect your personal routine tracking and engagement compliance within PawCare. They are <span className="font-semibold">NOT medical health scores, diagnoses, or clinical evaluations</span>. Consult your veterinarian for medical assessments.
              </div>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
