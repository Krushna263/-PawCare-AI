import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { Veterinarian, Pet, VetAppointment } from '../../types';
import { TimeSlotPicker } from './TimeSlotPicker';
import { createWhatsAppAppointmentMessage, generateWhatsAppBookingUrl } from '../../utils/whatsapp';
import { 
  X, 
  Calendar, 
  Clock, 
  Heart, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  ChevronRight, 
  ChevronLeft, 
  Building2, 
  ExternalLink,
  ShieldAlert,
  Sparkles
} from 'lucide-react';

interface AppointmentBookingModalProps {
  vet: Veterinarian;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (appointment: VetAppointment) => void;
}

const CONSULTATION_REASONS = [
  'General check-up',
  'Vaccination',
  'Nutrition consultation',
  'Skin/coat concern',
  'Digestive concern',
  'Behavioral concern',
  'Follow-up',
  'Other',
];

export const AppointmentBookingModal: React.FC<AppointmentBookingModalProps> = ({
  vet,
  isOpen,
  onClose,
  onSuccess,
}) => {
  const { pets, activePet, bookAppointment, showToast } = useApp();

  const [currentStep, setCurrentStep] = useState<1 | 2 | 3 | 4 | 5 | 6>(1);

  // Form State
  const [selectedPet, setSelectedPet] = useState<Pet>(activePet || pets[0]);
  
  // Format default date: e.g. "5 October 2026" or YYYY-MM-DD
  const todayIso = new Date().toISOString().split('T')[0];
  const [dateIso, setDateIso] = useState<string>(todayIso);
  const [displayDate, setDisplayDate] = useState<string>('5 October 2026');
  
  const [selectedSlot, setSelectedSlot] = useState<string>(vet.availableSlots[0] || '10:00 AM');
  const [consultationType, setConsultationType] = useState<'In-person' | 'Tele-Health Video'>('In-person');
  const [reason, setReason] = useState<string>('General check-up');
  const [additionalInfo, setAdditionalInfo] = useState<string>('');
  
  // Resulting created appointment & WhatsApp URL
  const [createdAppointment, setCreatedAppointment] = useState<VetAppointment | null>(null);
  const [whatsAppUrl, setWhatsAppUrl] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');

  if (!isOpen) return null;

  const handleDateChange = (val: string) => {
    setDateIso(val);
    try {
      const d = new Date(val);
      if (!isNaN(d.getTime())) {
        const options: Intl.DateTimeFormatOptions = { day: 'numeric', month: 'long', year: 'numeric' };
        setDisplayDate(d.toLocaleDateString('en-US', options));
      } else {
        setDisplayDate(val);
      }
    } catch {
      setDisplayDate(val);
    }
  };

  const handleConfirmAndBookWhatsApp = () => {
    setErrorMessage('');

    // Validation
    if (!selectedPet) {
      setErrorMessage('No pet selected. Please select or add a pet profile before proceeding.');
      return;
    }
    if (!displayDate) {
      setErrorMessage('Please pick an appointment date.');
      return;
    }
    if (!selectedSlot) {
      setErrorMessage('Please select a time slot.');
      return;
    }

    try {
      // 1. Prepare WhatsApp Message
      const messageText = createWhatsAppAppointmentMessage({
        vetName: vet.name,
        clinic: vet.clinic,
        phone: vet.whatsAppPhone,
        petName: selectedPet.name,
        petBreed: selectedPet.breed,
        petAge: selectedPet.age,
        petSpecies: selectedPet.animalType,
        date: displayDate,
        time: selectedSlot,
        reason: reason,
        additionalInfo: additionalInfo.trim(),
        consultationType: consultationType,
        consultationFee: vet.consultationFee,
        currency: vet.currency,
      });

      // 2. Generate WhatsApp URL
      const url = generateWhatsAppBookingUrl(vet.whatsAppPhone, messageText);
      setWhatsAppUrl(url);

      // 3. Save Appointment locally as 'Awaiting confirmation'
      const newApt = bookAppointment({
        petId: selectedPet.id,
        petName: selectedPet.name,
        petBreed: selectedPet.breed,
        petAge: selectedPet.age,
        vetId: vet.id,
        vetName: vet.name,
        clinic: vet.clinic,
        specialty: vet.specialty,
        date: displayDate,
        time: selectedSlot,
        consultationType: consultationType,
        consultationFee: vet.consultationFee,
        currency: vet.currency,
        reason: reason,
        additionalInfo: additionalInfo.trim(),
        status: 'Awaiting confirmation',
        bookingMethod: 'whatsapp',
        whatsAppUrl: url,
        vetPhone: vet.whatsAppPhone,
      });

      setCreatedAppointment(newApt);

      // 4. Open WhatsApp directly via window.open
      try {
        window.open(url, '_blank', 'noopener,noreferrer');
      } catch (e) {
        console.warn('Popup blocked, fallback available on success screen', e);
      }

      // 5. Advance to Success screen (Step 6)
      setCurrentStep(6);
      onSuccess(newApt);
    } catch (err: any) {
      console.error('WhatsApp booking error:', err);
      setErrorMessage('Failed to generate WhatsApp link. Please check the inputs and try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-stone-950/60 backdrop-blur-xs overflow-y-auto">
      <div className="relative w-full max-w-xl bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden my-6 animate-in zoom-in-95 duration-200 flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="px-5 sm:px-6 py-4 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between shrink-0">
          <div>
            <div className="flex items-center gap-1.5 text-[11px] font-bold text-emerald-800 uppercase tracking-wider">
              <MessageSquare className="w-3.5 h-3.5" />
              <span>WhatsApp Veterinary Booking</span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-stone-900 mt-0.5">
              {currentStep === 6 ? 'Appointment Request Prepared' : `Consultation with ${vet.name}`}
            </h2>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Step Progress Indicators (Steps 1 to 5) */}
        {currentStep <= 5 && (
          <div className="px-6 pt-3 pb-2 bg-stone-50 border-b border-stone-100 flex items-center justify-between gap-1 text-[11px] font-semibold text-stone-500 overflow-x-auto">
            {[
              { num: 1, label: 'Pet' },
              { num: 2, label: 'Date' },
              { num: 3, label: 'Time' },
              { num: 4, label: 'Reason' },
              { num: 5, label: 'Summary' },
            ].map((s) => (
              <button
                key={s.num}
                type="button"
                onClick={() => setCurrentStep(s.num as any)}
                className={`flex items-center gap-1.5 py-1 px-2 rounded-lg transition-colors whitespace-nowrap cursor-pointer ${
                  currentStep === s.num
                    ? 'text-emerald-900 bg-white shadow-2xs font-bold'
                    : currentStep > s.num
                    ? 'text-emerald-700 hover:text-emerald-900'
                    : 'text-stone-400 hover:text-stone-600'
                }`}
              >
                <span className={`w-4 h-4 rounded-full flex items-center justify-center text-[10px] ${
                  currentStep === s.num
                    ? 'bg-emerald-800 text-white font-bold'
                    : currentStep > s.num
                    ? 'bg-emerald-100 text-emerald-800 font-semibold'
                    : 'bg-stone-200 text-stone-600'
                }`}>
                  {s.num}
                </span>
                <span>{s.label}</span>
              </button>
            ))}
          </div>
        )}

        {/* Error Alert */}
        {errorMessage && (
          <div className="mx-6 mt-3 p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{errorMessage}</span>
          </div>
        )}

        {/* Body Content */}
        <div className="p-5 sm:p-6 overflow-y-auto flex-1 space-y-5">
          
          {/* STEP 1: SELECT PET */}
          {currentStep === 1 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Step 1: Select Your Pet</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose which companion needs this veterinary appointment.
                </p>
              </div>

              {pets.length === 0 ? (
                <div className="p-4 rounded-2xl bg-amber-50 border border-amber-200 text-xs text-amber-900">
                  No companion profile found. Please create a pet profile first.
                </div>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {pets.map((pet) => {
                    const isSelected = selectedPet?.id === pet.id;
                    const emoji = pet.animalType === 'Dog' ? '🐶' : pet.animalType === 'Cat' ? '🐱' : '🐾';
                    return (
                      <button
                        key={pet.id}
                        type="button"
                        onClick={() => setSelectedPet(pet)}
                        className={`p-3.5 rounded-2xl border text-left transition-all flex items-center gap-3 cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50/70 border-emerald-700 ring-2 ring-emerald-700/40 shadow-xs'
                            : 'bg-white border-stone-200 hover:border-stone-300'
                        }`}
                      >
                        <img
                          src={pet.photoUrl}
                          alt={pet.name}
                          className="w-11 h-11 rounded-xl object-cover shrink-0 border border-stone-200"
                        />
                        <div className="min-w-0 flex-1">
                          <div className="text-xs font-bold text-stone-900 flex items-center gap-1">
                            <span>{emoji}</span>
                            <span className="truncate">{pet.name}</span>
                          </div>
                          <div className="text-[11px] text-stone-500 truncate">{pet.breed}</div>
                          <div className="text-[10px] text-stone-400">{pet.age} years old · {pet.weight} kg</div>
                        </div>
                      </button>
                    );
                  })}
                </div>
              )}

              {/* Consultation Format Selection */}
              <div className="pt-2 border-t border-stone-100">
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Preferred Consultation Format
                </label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setConsultationType('In-person')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      consultationType === 'In-person'
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    🏥 In-person Clinic Visit
                  </button>
                  <button
                    type="button"
                    onClick={() => setConsultationType('Tele-Health Video')}
                    className={`py-2 px-3 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                      consultationType === 'Tele-Health Video'
                        ? 'bg-emerald-50 border-emerald-700 text-emerald-900 ring-1 ring-emerald-700'
                        : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                    }`}
                  >
                    📹 Tele-Health Video
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* STEP 2: SELECT DATE */}
          {currentStep === 2 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Step 2: Select Appointment Date</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Pick a convenient calendar date for the consultation.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1.5">
                  Calendar Date Picker
                </label>
                <div className="relative">
                  <input
                    type="date"
                    min={todayIso}
                    value={dateIso}
                    onChange={(e) => handleDateChange(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl border border-stone-300 text-sm font-medium text-stone-900 bg-white outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700 shadow-xs cursor-pointer"
                  />
                </div>
              </div>

              {/* Quick Date Chips */}
              <div>
                <span className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider mb-2">
                  Or choose a quick demo date:
                </span>
                <div className="flex flex-wrap gap-2">
                  {vet.availableDates.map((d) => (
                    <button
                      key={d}
                      type="button"
                      onClick={() => setDisplayDate(d)}
                      className={`px-3 py-1.5 rounded-xl border text-xs font-semibold transition-all cursor-pointer ${
                        displayDate === d
                          ? 'bg-emerald-800 text-white border-emerald-800 shadow-2xs'
                          : 'bg-stone-50 text-stone-700 border-stone-200 hover:bg-stone-100'
                      }`}
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>Selected Date:</span>
                <span className="font-bold text-stone-900">{displayDate}</span>
              </div>
            </div>
          )}

          {/* STEP 3: SELECT TIME */}
          {currentStep === 3 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Step 3: Select Available Time</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Choose from available clinic slots for {displayDate}.
                </p>
              </div>

              <TimeSlotPicker
                availableSlots={vet.availableSlots}
                unavailableSlots={vet.unavailableSlots || ['01:00 PM', '02:30 PM']}
                selectedSlot={selectedSlot}
                onSelectSlot={(slot) => setSelectedSlot(slot)}
              />

              <div className="p-3 rounded-xl bg-stone-50 border border-stone-200 text-xs text-stone-600 flex items-center justify-between">
                <span>Selected Time Slot:</span>
                <span className="font-mono font-bold text-emerald-900 text-sm">{selectedSlot}</span>
              </div>
            </div>
          )}

          {/* STEP 4: CONSULTATION REASON */}
          {currentStep === 4 && (
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Step 4: Consultation Reason</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Let Dr. {vet.name.split(' ')[1] || vet.name} know what symptoms or routine care you are addressing.
                </p>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-2">
                  Select Primary Reason
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {CONSULTATION_REASONS.map((r) => {
                    const isSelected = reason === r;
                    return (
                      <button
                        key={r}
                        type="button"
                        onClick={() => setReason(r)}
                        className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all cursor-pointer ${
                          isSelected
                            ? 'bg-emerald-50 border-emerald-700 text-emerald-950 font-bold ring-1 ring-emerald-700'
                            : 'bg-white border-stone-200 text-stone-700 hover:border-stone-300'
                        }`}
                      >
                        {r}
                      </button>
                    );
                  })}
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-stone-800 mb-1">
                  Additional Information (Optional)
                </label>
                <textarea
                  rows={2}
                  value={additionalInfo}
                  onChange={(e) => setAdditionalInfo(e.target.value)}
                  placeholder="e.g. Mild itching around left ear for 2 days; please advise if fasting is needed."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
                />
              </div>
            </div>
          )}

          {/* STEP 5: APPOINTMENT SUMMARY (Ready for WhatsApp) */}
          {currentStep === 5 && (
            <div className="space-y-5">
              <div>
                <h3 className="text-sm font-bold text-stone-900">Step 5: Review Appointment Summary</h3>
                <p className="text-xs text-stone-500 mt-0.5">
                  Confirm all details before initiating WhatsApp booking.
                </p>
              </div>

              {/* Exact structured summary required by prompt */}
              <div className="p-4 sm:p-5 rounded-2xl bg-stone-50 border border-stone-200 space-y-3 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Veterinarian:</span>
                  <span className="font-bold text-stone-900">{vet.name}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Clinic:</span>
                  <span className="font-semibold text-stone-800">{vet.clinic}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Pet:</span>
                  <span className="font-semibold text-stone-800">
                    {selectedPet?.name} ({selectedPet?.breed}, {selectedPet?.age} yrs)
                  </span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Date:</span>
                  <span className="font-semibold text-stone-900">{displayDate}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Time:</span>
                  <span className="font-mono font-bold text-emerald-900">{selectedSlot}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Reason:</span>
                  <span className="font-medium text-stone-800">{reason}</span>
                </div>
                <div className="flex items-center justify-between pb-2 border-b border-stone-200">
                  <span className="text-stone-500">Consultation:</span>
                  <span className="font-medium text-stone-800">{consultationType}</span>
                </div>
                <div className="flex items-center justify-between pt-1 text-sm">
                  <span className="font-bold text-stone-900">Estimated Fee:</span>
                  <span className="font-mono font-bold text-emerald-950">
                    {vet.currency}{vet.consultationFee}
                  </span>
                </div>
              </div>

              {/* Section 6: WhatsApp Button & Helper Text */}
              <div className="space-y-2 pt-2">
                <button
                  type="button"
                  onClick={handleConfirmAndBookWhatsApp}
                  className="w-full py-3.5 px-5 rounded-2xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-sm shadow-md shadow-emerald-900/10 flex items-center justify-center gap-2.5 transition-all duration-200 cursor-pointer active:scale-[0.98]"
                >
                  <MessageSquare className="w-5 h-5 fill-white stroke-none" />
                  <span>💬 Book via WhatsApp</span>
                </button>

                <p className="text-[11px] text-stone-500 text-center leading-relaxed px-2">
                  WhatsApp will open with your appointment details. Review the message before sending.
                </p>
              </div>

              {/* Safety notice */}
              <div className="p-3 rounded-xl bg-amber-50/80 border border-amber-200/80 text-[11px] text-amber-900 leading-relaxed flex items-start gap-2">
                <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold">Clinic Notice:</span> Availability and confirmation depend on the veterinary clinic. PawCare does not provide veterinary diagnosis or emergency medical services.
                </div>
              </div>
            </div>
          )}

          {/* STEP 6: SUCCESS STATE (Section 7 requirement) */}
          {currentStep === 6 && (
            <div className="space-y-5 text-center py-4">
              <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
                <CheckCircle2 className="w-9 h-9 stroke-[2.2]" />
              </div>

              <div className="space-y-1">
                <h3 className="text-xl font-bold text-stone-900">
                  ✓ Appointment Request Prepared
                </h3>
                <p className="text-xs text-stone-600">
                  Your WhatsApp message has been prepared successfully.
                </p>
              </div>

              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 max-w-sm mx-auto text-xs space-y-1.5 text-left">
                <div className="text-[10px] uppercase font-bold text-stone-500 tracking-wider">
                  Appointment Dossier
                </div>
                <div className="font-bold text-stone-900 text-sm">{vet.name}</div>
                <div className="text-stone-600">{vet.clinic}</div>
                <div className="font-semibold text-emerald-900 pt-1">
                  📅 {displayDate} · {selectedSlot}
                </div>
                <div className="text-stone-500 text-[11px]">
                  Patient: {selectedPet?.name} ({reason})
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200/80 text-xs text-amber-900 max-w-sm mx-auto">
                Please wait for the clinic to confirm your appointment.
              </div>

              {/* Action buttons */}
              <div className="flex flex-col sm:flex-row gap-2.5 pt-2 max-w-sm mx-auto">
                {whatsAppUrl && (
                  <a
                    href={whatsAppUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 py-2.5 px-4 rounded-xl bg-[#25D366] hover:bg-[#1EBE5D] text-white font-bold text-xs flex items-center justify-center gap-1.5 transition-colors shadow-xs"
                  >
                    <span>Open WhatsApp Again</span>
                    <ExternalLink className="w-3.5 h-3.5" />
                  </a>
                )}
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 px-4 rounded-xl bg-stone-900 hover:bg-stone-800 text-white font-semibold text-xs transition-colors cursor-pointer"
                >
                  View My Appointments
                </button>
              </div>
            </div>
          )}

        </div>

        {/* Footer Navigation (Steps 1 to 4) */}
        {currentStep < 5 && (
          <div className="px-6 py-3.5 border-t border-stone-100 bg-[#FAF9F5] flex items-center justify-between shrink-0">
            {currentStep > 1 ? (
              <button
                type="button"
                onClick={() => setCurrentStep((prev) => (prev - 1) as any)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-stone-600 hover:text-stone-900 py-1.5 px-3 rounded-lg hover:bg-stone-200/50 cursor-pointer"
              >
                <ChevronLeft className="w-4 h-4" />
                <span>Back</span>
              </button>
            ) : (
              <div />
            )}

            <button
              type="button"
              onClick={() => setCurrentStep((prev) => (prev + 1) as any)}
              className="inline-flex items-center gap-1 text-xs font-semibold text-white bg-emerald-800 hover:bg-emerald-900 py-2 px-4 rounded-xl shadow-2xs transition-colors cursor-pointer"
            >
              <span>Next Step</span>
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </div>
  );
};
