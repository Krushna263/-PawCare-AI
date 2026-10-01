import React from 'react';
import { Clock } from 'lucide-react';

interface TimeSlotPickerProps {
  availableSlots: string[];
  unavailableSlots?: string[];
  selectedSlot: string;
  onSelectSlot: (slot: string) => void;
}

export const TimeSlotPicker: React.FC<TimeSlotPickerProps> = ({
  availableSlots,
  unavailableSlots = [],
  selectedSlot,
  onSelectSlot,
}) => {
  return (
    <div className="space-y-2">
      <div className="flex items-center justify-between text-xs text-stone-500">
        <span className="font-semibold text-stone-700 flex items-center gap-1.5">
          <Clock className="w-3.5 h-3.5 text-stone-500" />
          <span>Available Time Slots</span>
        </span>
        <span className="text-[11px] text-stone-400">Tap to select your preferred time</span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
        {availableSlots.map((slot) => {
          const isSelected = selectedSlot === slot;
          return (
            <button
              key={slot}
              type="button"
              onClick={() => onSelectSlot(slot)}
              className={`min-h-[44px] py-2 px-3 rounded-xl font-mono text-xs font-semibold text-center transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-sm ring-2 ring-emerald-700/50 scale-[1.02]'
                  : 'bg-stone-50 border border-stone-200 text-stone-800 hover:border-emerald-600 hover:bg-emerald-50/50'
              }`}
            >
              {slot}
            </button>
          );
        })}

        {/* Disabled/Unavailable slots */}
        {unavailableSlots.map((slot) => (
          <button
            key={`unavailable-${slot}`}
            type="button"
            disabled
            className="min-h-[44px] py-2 px-3 rounded-xl font-mono text-xs font-medium text-stone-400 bg-stone-100/60 border border-dashed border-stone-200 cursor-not-allowed line-through relative group"
            title="Slot already booked by another pet parent"
          >
            <span>{slot}</span>
            <span className="block text-[9px] font-sans no-underline text-stone-400 uppercase tracking-tighter">
              Booked
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
