import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Veterinarian, VetSpecialty, VetAppointment } from '../types';
import { AppointmentBookingModal } from './vet/AppointmentBookingModal';
import { AppointmentCard } from './vet/AppointmentCard';
import { 
  Stethoscope, 
  Search, 
  MapPin, 
  Calendar, 
  Clock, 
  Star, 
  Video, 
  Building2, 
  ShieldCheck, 
  AlertCircle,
  MessageSquare,
  Sparkles,
  CalendarCheck,
  Filter
} from 'lucide-react';

export const VetCareView: React.FC = () => {
  const { 
    vets, 
    activePet, 
    appointments 
  } = useApp();

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('All');
  const [selectedConsultationType, setSelectedConsultationType] = useState<string>('All');
  
  // Appointment modal state
  const [bookingVet, setBookingVet] = useState<Veterinarian | null>(null);
  const [appointmentsTab, setAppointmentsTab] = useState<'upcoming' | 'past'>('upcoming');

  const specialties: (string | VetSpecialty)[] = [
    'All',
    'General Practice',
    'Dermatology',
    'Clinical Nutrition',
    'Dental Health',
    'Orthopedics & Surgery',
  ];

  const filteredVets = vets.filter((v) => {
    const matchesSearch = 
      v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.clinic.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.specialty.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.location.toLowerCase().includes(searchQuery.toLowerCase()) ||
      v.qualification.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesSpecialty = selectedSpecialty === 'All' || v.specialty === selectedSpecialty;
    const matchesConsultation = 
      selectedConsultationType === 'All' ||
      v.consultationType.includes(selectedConsultationType) ||
      (selectedConsultationType === 'In-person' && v.consultationType.includes('In-person'));

    return matchesSearch && matchesSpecialty && matchesConsultation;
  });

  // Separate upcoming requests vs past appointments
  const upcomingAppointments = appointments.filter(
    (a) => a.status === 'Awaiting confirmation' || a.status === 'Confirmed'
  );

  const pastAppointments = appointments.filter(
    (a) => a.status === 'Completed' || a.status === 'Cancelled'
  );

  const displayedAppointments = appointmentsTab === 'upcoming' 
    ? upcomingAppointments 
    : pastAppointments;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      
      {/* 1. Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <Stethoscope className="w-3.5 h-3.5" />
            <span>Clinical Healthcare Network</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Veterinary Care & Appointments
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1 max-w-2xl leading-relaxed">
            Browse verified clinical practitioners, select appointment details, and request bookings directly via WhatsApp for <span className="font-semibold text-stone-800">{activePet.name}</span>.
          </p>
        </div>

        {/* Demo status & WhatsApp indicator */}
        <div className="flex flex-col sm:items-end gap-1.5 self-start sm:self-center">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-emerald-50 text-emerald-900 text-xs font-semibold border border-emerald-200 shadow-2xs">
            <MessageSquare className="w-3.5 h-3.5 text-emerald-700 fill-emerald-600 stroke-none" />
            <span>WhatsApp Click-to-Chat Booking</span>
          </div>
          <span className="text-[11px] text-stone-400">Simulated MVP Demo Network</span>
        </div>
      </div>

      {/* 2. My Appointments Section (Section 8 of prompt) */}
      <section className="bg-[#FAF9F5] rounded-3xl p-5 sm:p-7 border border-stone-200 shadow-xs space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <CalendarCheck className="w-5 h-5 text-emerald-800" />
              <h2 className="text-lg font-bold text-stone-900">
                My Appointments & Requests
              </h2>
            </div>
            <p className="text-xs text-stone-500 mt-0.5">
              Track upcoming WhatsApp booking requests and past clinical history for your companions.
            </p>
          </div>

          {/* Tab selector for Upcoming vs Past */}
          <div className="flex items-center gap-1 p-1 bg-stone-200/70 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setAppointmentsTab('upcoming')}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                appointmentsTab === 'upcoming'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Upcoming Requests ({upcomingAppointments.length})
            </button>
            <button
              onClick={() => setAppointmentsTab('past')}
              className={`py-1.5 px-3 rounded-lg transition-all cursor-pointer ${
                appointmentsTab === 'past'
                  ? 'bg-white text-stone-900 shadow-xs font-bold'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              Past Appointments ({pastAppointments.length})
            </button>
          </div>
        </div>

        {/* Appointments Grid */}
        {displayedAppointments.length === 0 ? (
          <div className="text-center py-10 bg-white rounded-2xl border border-dashed border-stone-200 space-y-2">
            <Calendar className="w-8 h-8 text-stone-300 mx-auto" />
            <div className="text-xs font-semibold text-stone-700">
              No {appointmentsTab === 'upcoming' ? 'upcoming requests' : 'past appointments'} found
            </div>
            <p className="text-[11px] text-stone-400 max-w-sm mx-auto">
              Select a veterinarian below and click "Book Appointment" to initiate an appointment request via WhatsApp.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {displayedAppointments.map((apt) => (
              <AppointmentCard key={apt.id} appointment={apt} />
            ))}
          </div>
        )}
      </section>

      {/* 3. Search & Filter Bar */}
      <div className="bg-white rounded-2xl p-4 sm:p-5 border border-stone-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-3">
          
          {/* Search Input */}
          <div className="md:col-span-6 relative">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by doctor name, clinic, qualification, or city..."
              className="w-full pl-9 pr-4 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700 focus:ring-1 focus:ring-emerald-700"
            />
          </div>

          {/* Specialty Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedSpecialty}
              onChange={(e) => setSelectedSpecialty(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700 bg-white cursor-pointer"
            >
              {specialties.map((spec) => (
                <option key={spec} value={spec}>
                  {spec === 'All' ? 'All Specialties' : spec}
                </option>
              ))}
            </select>
          </div>

          {/* Consultation Type Filter */}
          <div className="md:col-span-3">
            <select
              value={selectedConsultationType}
              onChange={(e) => setSelectedConsultationType(e.target.value)}
              className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700 bg-white cursor-pointer"
            >
              <option value="All">All Formats</option>
              <option value="In-person">In-person Visit</option>
              <option value="Tele-Health Video">Tele-Health Video</option>
            </select>
          </div>

        </div>
      </div>

      {/* 4. Veterinarian Cards Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-stone-900">
            Available Practitioners ({filteredVets.length})
          </h3>
          <span className="text-[11px] text-stone-500">
            Click "Book Appointment" to initiate WhatsApp booking
          </span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {filteredVets.map((vet) => (
            <div
              key={vet.id}
              className="p-6 rounded-3xl bg-white border border-stone-200/90 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all flex flex-col justify-between space-y-5"
            >
              <div className="space-y-4">
                
                {/* Vet Header Row */}
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-start gap-3.5">
                    {/* Profile Avatar / Photo */}
                    <div className={`w-14 h-14 rounded-2xl flex items-center justify-center font-bold text-lg shrink-0 shadow-2xs ${vet.avatarColor}`}>
                      {vet.name.replace('Dr. ', '')[0] || 'V'}
                    </div>

                    <div className="space-y-0.5">
                      <div className="flex items-center gap-2">
                        <h4 className="text-base font-bold text-stone-900">{vet.name}</h4>
                        <span className="px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-800 text-[10px] font-semibold">
                          Verified
                        </span>
                      </div>
                      
                      <p className="text-xs font-semibold text-emerald-900">{vet.qualification}</p>
                      
                      <div className="text-xs text-stone-600 font-medium">
                        {vet.clinic}
                      </div>

                      <div className="flex items-center gap-2 text-[11px] text-stone-500 pt-0.5">
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{vet.location}</span>
                        </span>
                        <span>·</span>
                        <span className="font-semibold text-stone-700">{vet.specialty}</span>
                      </div>
                    </div>
                  </div>

                  {/* Rating Badge */}
                  <div className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-full border border-amber-200/80 text-amber-900 text-xs font-bold shrink-0">
                    <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                    <span>{vet.rating}</span>
                    <span className="text-[10px] text-stone-400 font-normal">({vet.reviewCount})</span>
                  </div>
                </div>

                {/* Bio Prose */}
                <p className="text-xs text-stone-600 leading-relaxed">
                  {vet.bio}
                </p>

                {/* Consultation details & fee */}
                <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-100 flex flex-wrap items-center justify-between gap-3 text-xs">
                  <div className="flex items-center gap-2 text-stone-700">
                    {vet.consultationType.includes('Video') ? (
                      <Video className="w-4 h-4 text-emerald-700" />
                    ) : (
                      <Building2 className="w-4 h-4 text-stone-600" />
                    )}
                    <span className="font-medium">{vet.consultationType}</span>
                  </div>

                  <div className="text-stone-900 font-bold">
                    <span className="font-mono text-sm">{vet.currency}{vet.consultationFee}</span>
                    <span className="text-[10px] font-normal text-stone-500 ml-1">consultation</span>
                  </div>
                </div>

                {/* Available Slots Preview (Section 2 Requirement) */}
                <div className="space-y-1.5 pt-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-500 font-semibold uppercase tracking-wider">
                    <span>Available Today:</span>
                    <span className="font-normal text-stone-400 text-[10px]">Tap to book</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-1.5">
                    {vet.availableSlots.map((slot) => (
                      <span
                        key={slot}
                        className="py-1 px-2.5 rounded-lg bg-stone-50 border border-stone-200 text-stone-800 font-mono text-xs font-semibold"
                      >
                        {slot}
                      </span>
                    ))}
                    {vet.unavailableSlots && vet.unavailableSlots.length > 0 && (
                      <span className="text-[11px] text-stone-400 italic">
                        ({vet.unavailableSlots.length} slots booked)
                      </span>
                    )}
                  </div>
                </div>

              </div>

              {/* Action Button: Book Appointment via WhatsApp */}
              <div className="pt-3 border-t border-stone-100">
                <button
                  type="button"
                  onClick={() => setBookingVet(vet)}
                  className="w-full py-3 px-4 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-2 cursor-pointer active:scale-[0.99]"
                >
                  <Calendar className="w-4 h-4" />
                  <span>Book Appointment</span>
                  <span className="text-emerald-300 font-normal text-[11px]">· via WhatsApp</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      </div>

      {/* 5. Booking Modal (WhatsApp click-to-chat flow) */}
      {bookingVet && (
        <AppointmentBookingModal
          vet={bookingVet}
          isOpen={Boolean(bookingVet)}
          onClose={() => setBookingVet(null)}
          onSuccess={() => {
            // Keep modal on success step; user can close when ready
          }}
        />
      )}

      {/* 6. Medical Disclaimer & Demo Notice */}
      <div className="p-4 sm:p-5 rounded-3xl bg-stone-100 border border-stone-200 text-stone-600 text-xs leading-relaxed space-y-2">
        <div className="flex items-center gap-2 font-bold text-stone-800">
          <AlertCircle className="w-4 h-4 text-emerald-800" />
          <span>Real-World Safety & Appointment Availability Notice</span>
        </div>
        <p>
          Appointment availability and confirmation depend on the veterinary clinic. PawCare does not provide veterinary diagnosis or emergency medical services.
        </p>
        <p className="text-stone-500 text-[11px]">
          All clinic listings, doctor phone numbers, and time slots are provided as realistic demo data for prototype evaluation. In an acute medical emergency, contact your nearest local 24/7 veterinary emergency hospital immediately.
        </p>
      </div>

    </div>
  );
};
