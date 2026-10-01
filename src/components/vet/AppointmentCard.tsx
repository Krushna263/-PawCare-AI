import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { VetAppointment, AppointmentStatus } from '../../types';
import { 
  Calendar, 
  Clock, 
  MapPin, 
  MessageSquare, 
  CheckCircle2, 
  AlertCircle, 
  XCircle, 
  HelpCircle, 
  ExternalLink, 
  RotateCw,
  X,
  ChevronDown
} from 'lucide-react';

interface AppointmentCardProps {
  appointment: VetAppointment;
}

export const AppointmentCard: React.FC<AppointmentCardProps> = ({ appointment }) => {
  const { updateAppointmentStatus, cancelAppointment } = useApp();
  const [isDetailsOpen, setIsDetailsOpen] = useState(false);
  const [isSimulateOpen, setIsSimulateOpen] = useState(false);

  const getStatusBadge = (status: AppointmentStatus) => {
    switch (status) {
      case 'Awaiting confirmation':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-amber-50 text-amber-900 border border-amber-200">
            <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <span>Awaiting confirmation</span>
          </span>
        );
      case 'Confirmed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-900 border border-emerald-200">
            <span className="w-2 h-2 rounded-full bg-emerald-600" />
            <span>Confirmed</span>
          </span>
        );
      case 'Cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-rose-50 text-rose-900 border border-rose-200">
            <span className="w-2 h-2 rounded-full bg-rose-600" />
            <span>Cancelled</span>
          </span>
        );
      case 'Completed':
        return (
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-semibold bg-stone-100 text-stone-700 border border-stone-200">
            <span className="w-2 h-2 rounded-full bg-stone-400" />
            <span>Completed</span>
          </span>
        );
      default:
        return null;
    }
  };

  const statusOptions: AppointmentStatus[] = [
    'Awaiting confirmation',
    'Confirmed',
    'Completed',
    'Cancelled',
  ];

  return (
    <>
      <div className="p-4 sm:p-5 rounded-2xl bg-white border border-stone-200/90 shadow-2xs hover:border-emerald-700/30 transition-all flex flex-col justify-between space-y-4">
        
        {/* Top Header Row */}
        <div className="flex items-start justify-between gap-3">
          <div>
            <div className="text-[11px] font-semibold text-stone-500 uppercase tracking-wider">
              {appointment.clinic}
            </div>
            <h4 className="text-base font-bold text-stone-900 mt-0.5">
              {appointment.vetName}
            </h4>
            <div className="text-xs text-emerald-800 font-medium">
              Specialty: {appointment.specialty}
            </div>
          </div>

          <div className="shrink-0">
            {getStatusBadge(appointment.status)}
          </div>
        </div>

        {/* Appointment Details Grid */}
        <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs space-y-1.5 text-stone-700">
          <div className="flex items-center justify-between">
            <span className="text-stone-500">Patient:</span>
            <span className="font-bold text-stone-900">
              🐶 {appointment.petName} {appointment.petBreed ? `(${appointment.petBreed})` : ''}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500">Schedule:</span>
            <span className="font-mono font-bold text-emerald-950">
              {appointment.date} · {appointment.time}
            </span>
          </div>

          <div className="flex items-center justify-between">
            <span className="text-stone-500">Reason:</span>
            <span className="font-medium text-stone-800">{appointment.reason}</span>
          </div>

          {appointment.consultationFee && (
            <div className="flex items-center justify-between pt-1 border-t border-stone-200/60">
              <span className="text-stone-500">Consultation Fee:</span>
              <span className="font-mono font-bold text-stone-900">
                {appointment.currency || '₹'}{appointment.consultationFee}
              </span>
            </div>
          )}
        </div>

        {/* Bottom Actions Row */}
        <div className="pt-2 border-t border-stone-100 flex flex-wrap items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsDetailsOpen(true)}
              className="py-1.5 px-3 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 font-semibold transition-colors cursor-pointer"
            >
              View Details
            </button>

            {/* Simulated Demo Status Switcher */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setIsSimulateOpen(!isSimulateOpen)}
                className="py-1.5 px-2.5 rounded-lg border border-dashed border-stone-300 text-stone-600 hover:text-stone-900 text-[11px] font-medium flex items-center gap-1 cursor-pointer"
                title="Demo: simulate clinic status update"
              >
                <RotateCw className="w-3 h-3 text-stone-400" />
                <span>Simulate Status</span>
                <ChevronDown className="w-3 h-3 text-stone-400" />
              </button>

              {isSimulateOpen && (
                <div 
                  className="absolute left-0 mt-1 w-44 rounded-xl bg-white border border-stone-200 shadow-lg p-1.5 z-30 text-xs"
                  onMouseLeave={() => setIsSimulateOpen(false)}
                >
                  <div className="px-2 py-1 text-[10px] font-bold text-stone-400 uppercase tracking-wider">
                    Demo Clinic Simulator
                  </div>
                  {statusOptions.map((st) => (
                    <button
                      key={st}
                      type="button"
                      onClick={() => {
                        updateAppointmentStatus(appointment.id, st);
                        setIsSimulateOpen(false);
                      }}
                      className={`w-full text-left px-2 py-1.5 rounded-lg transition-colors text-[11px] ${
                        appointment.status === st ? 'bg-emerald-50 text-emerald-900 font-bold' : 'hover:bg-stone-50 text-stone-700'
                      }`}
                    >
                      {st}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Re-open WhatsApp */}
            {appointment.whatsAppUrl && (
              <a
                href={appointment.whatsAppUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="p-1.5 rounded-lg text-emerald-700 hover:bg-emerald-50 transition-colors"
                title="Open WhatsApp chat"
              >
                <MessageSquare className="w-4 h-4 fill-emerald-600 stroke-none" />
              </a>
            )}

            {appointment.status === 'Awaiting confirmation' && (
              <button
                onClick={() => cancelAppointment(appointment.id)}
                className="py-1 px-2.5 text-rose-600 hover:text-rose-800 text-xs font-semibold hover:bg-rose-50 rounded-lg transition-colors cursor-pointer"
              >
                Cancel Request
              </button>
            )}
          </div>

        </div>

      </div>

      {/* FULL DETAILS MODAL */}
      {isDetailsOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-4 animate-in zoom-in-95 duration-200 text-xs">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Appointment Request Details</h3>
                <p className="text-[11px] text-stone-500">ID: {appointment.id}</p>
              </div>
              <button
                onClick={() => setIsDetailsOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-2.5">
              <div className="flex justify-between">
                <span className="text-stone-500">Status:</span>
                <div>{getStatusBadge(appointment.status)}</div>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Doctor:</span>
                <span className="font-bold text-stone-900">{appointment.vetName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Clinic:</span>
                <span className="font-semibold text-stone-800">{appointment.clinic}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Pet:</span>
                <span className="font-semibold text-stone-900">
                  {appointment.petName} ({appointment.petBreed || 'Companion'})
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Date & Time:</span>
                <span className="font-mono font-bold text-emerald-900">
                  {appointment.date} at {appointment.time}
                </span>
              </div>
              <div className="flex justify-between">
                <span className="text-stone-500">Reason:</span>
                <span className="font-medium text-stone-800">{appointment.reason}</span>
              </div>
              {appointment.additionalInfo && (
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-stone-500 block mb-0.5">Additional Notes:</span>
                  <p className="text-stone-700 bg-stone-50 p-2.5 rounded-xl border border-stone-200/70">
                    {appointment.additionalInfo}
                  </p>
                </div>
              )}
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              {appointment.whatsAppUrl ? (
                <a
                  href={appointment.whatsAppUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="py-2 px-3 rounded-xl bg-[#25D366] text-white font-bold text-xs flex items-center gap-1.5"
                >
                  <MessageSquare className="w-4 h-4 fill-white stroke-none" />
                  <span>Open WhatsApp</span>
                </a>
              ) : <div />}

              <button
                type="button"
                onClick={() => setIsDetailsOpen(false)}
                className="py-2 px-4 rounded-xl bg-stone-900 text-white font-semibold"
              >
                Close
              </button>
            </div>

          </div>
        </div>
      )}
    </>
  );
};
