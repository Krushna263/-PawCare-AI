import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Reminder, ReminderType } from '../types';
import { 
  Bell, 
  Calendar, 
  Clock, 
  Plus, 
  Check, 
  Trash2, 
  Edit3, 
  AlertCircle, 
  Sparkles,
  ShieldAlert,
  X,
  Heart,
  Utensils,
  Scissors,
  Pill,
  Stethoscope,
  SmilePlus
} from 'lucide-react';

export const RemindersView: React.FC = () => {
  const { 
    activePet, 
    reminders, 
    addReminder, 
    toggleReminder, 
    deleteReminder,
    showToast 
  } = useApp();

  const [selectedType, setSelectedType] = useState<string>('All');
  const [filterStatus, setFilterStatus] = useState<'all' | 'pending' | 'completed'>('pending');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);

  // Form State
  const [title, setTitle] = useState('');
  const [type, setType] = useState<ReminderType>('vaccination');
  const [date, setDate] = useState('2026-10-15');
  const [time, setTime] = useState('09:00 AM');
  const [frequency, setFrequency] = useState<'once' | 'daily' | 'weekly' | 'monthly' | 'yearly'>('monthly');
  const [notes, setNotes] = useState('');

  const petReminders = reminders.filter((r) => r.petId === activePet.id);

  const filteredReminders = petReminders.filter((r) => {
    if (selectedType !== 'All' && r.type !== selectedType) return false;
    if (filterStatus === 'pending' && r.completed) return false;
    if (filterStatus === 'completed' && !r.completed) return false;
    return true;
  });

  const upcomingReminders = petReminders.filter((r) => !r.completed);

  const getTypeIcon = (t: ReminderType) => {
    switch (t) {
      case 'vaccination': return Heart;
      case 'feeding': return Utensils;
      case 'grooming': return Scissors;
      case 'medication': return Pill;
      case 'vet': return Stethoscope;
      case 'dental': return SmilePlus;
      default: return Bell;
    }
  };

  const getTypeColor = (t: ReminderType) => {
    switch (t) {
      case 'vaccination': return 'bg-rose-50 text-rose-700 border-rose-200';
      case 'feeding': return 'bg-amber-50 text-amber-700 border-amber-200';
      case 'grooming': return 'bg-purple-50 text-purple-700 border-purple-200';
      case 'medication': return 'bg-emerald-50 text-emerald-700 border-emerald-200';
      case 'vet': return 'bg-teal-50 text-teal-700 border-teal-200';
      case 'dental': return 'bg-blue-50 text-blue-700 border-blue-200';
      default: return 'bg-stone-50 text-stone-700 border-stone-200';
    }
  };

  const handleOpenCreate = () => {
    setEditingReminder(null);
    setTitle('');
    setType('vaccination');
    setDate('2026-10-15');
    setTime('09:00 AM');
    setFrequency('monthly');
    setNotes('');
    setIsModalOpen(true);
  };

  const handleOpenEdit = (rem: Reminder) => {
    setEditingReminder(rem);
    setTitle(rem.title);
    setType(rem.type);
    setDate(rem.date);
    setTime(rem.time);
    setFrequency(rem.frequency);
    setNotes(rem.notes || '');
    setIsModalOpen(true);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;

    if (editingReminder) {
      deleteReminder(editingReminder.id);
      addReminder({
        petId: activePet.id,
        type,
        title: title.trim(),
        date,
        time,
        frequency,
        notes: notes.trim(),
      });
      showToast(`Updated reminder: "${title}"`, 'success');
    } else {
      addReminder({
        petId: activePet.id,
        type,
        title: title.trim(),
        date,
        time,
        frequency,
        notes: notes.trim(),
      });
    }

    setIsModalOpen(false);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-rose-800 uppercase tracking-wider mb-1">
            <Bell className="w-3.5 h-3.5" />
            <span>Preventive Calendar</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            Care Reminders & Protocols
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Stay aligned with scheduled boosters, prescribed veterinary regimens, and hygiene cycles for <span className="font-semibold text-stone-800">{activePet.name}</span>.
          </p>
        </div>

        <button
          onClick={handleOpenCreate}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-center"
        >
          <Plus className="w-4 h-4" />
          <span>Create Reminder</span>
        </button>
      </div>

      {/* Prominent Next Upcoming Banner (Section 7 requirement) */}
      {upcomingReminders.length > 0 && (
        <div className="p-6 rounded-3xl bg-linear-to-r from-emerald-900 to-teal-900 text-white shadow-md space-y-4">
          <div className="flex items-center justify-between text-xs text-emerald-200">
            <span className="font-semibold uppercase tracking-wider">Top Priority Upcoming Reminder</span>
            <span className="bg-emerald-800/80 px-2.5 py-0.5 rounded-full font-mono text-[11px] text-emerald-100">
              {upcomingReminders[0].date} at {upcomingReminders[0].time}
            </span>
          </div>

          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-white">
                {upcomingReminders[0].title}
              </h2>
              {upcomingReminders[0].notes && (
                <p className="text-xs text-emerald-100/90 leading-relaxed max-w-xl">
                  {upcomingReminders[0].notes}
                </p>
              )}
            </div>

            <button
              onClick={() => toggleReminder(upcomingReminders[0].id)}
              className="px-4 py-2 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-stone-100 transition-colors shadow-xs flex items-center gap-1.5 self-start sm:self-auto cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Mark Completed</span>
            </button>
          </div>
        </div>
      )}

      {/* Filter Tabs & Status Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        
        {/* Status segment buttons */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 rounded-xl border border-stone-200 self-start">
          <button
            onClick={() => setFilterStatus('pending')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'pending'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Pending ({petReminders.filter((r) => !r.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('completed')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'completed'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Completed ({petReminders.filter((r) => r.completed).length})
          </button>
          <button
            onClick={() => setFilterStatus('all')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              filterStatus === 'all'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            All ({petReminders.length})
          </button>
        </div>

        {/* Type select */}
        <div className="flex items-center gap-2">
          <span className="text-xs text-stone-500 font-medium">Category:</span>
          <select
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="px-3 py-1.5 rounded-xl border border-stone-300 text-xs text-stone-800 bg-white outline-none cursor-pointer"
          >
            <option value="All">All Categories</option>
            <option value="vaccination">💉 Vaccination</option>
            <option value="feeding">🍖 Feeding</option>
            <option value="grooming">🛁 Grooming</option>
            <option value="medication">💊 Medication</option>
            <option value="vet">🏥 Vet Appointment</option>
            <option value="dental">🪥 Dental Care</option>
          </select>
        </div>
      </div>

      {/* Reminders List */}
      <div className="space-y-3">
        {filteredReminders.length === 0 ? (
          <div className="p-12 text-center bg-white rounded-3xl border border-stone-200 space-y-2">
            <Bell className="w-8 h-8 text-stone-400 mx-auto" />
            <p className="text-sm font-semibold text-stone-700">No reminders match this view</p>
            <p className="text-xs text-stone-400">Tap "Create Reminder" to schedule upcoming care routines.</p>
          </div>
        ) : (
          filteredReminders.map((rem) => {
            const Icon = getTypeIcon(rem.type);
            const colorClass = getTypeColor(rem.type);

            return (
              <div
                key={rem.id}
                className={`p-4 sm:p-5 rounded-2xl border transition-all flex items-center justify-between gap-4 ${
                  rem.completed
                    ? 'bg-stone-50/70 border-stone-200 opacity-70'
                    : 'bg-white border-stone-200/90 shadow-2xs hover:border-emerald-700/40'
                }`}
              >
                <div className="flex items-center gap-3.5 flex-1 min-w-0">
                  {/* Complete Checkbox */}
                  <button
                    onClick={() => toggleReminder(rem.id)}
                    className={`w-6 h-6 rounded-full flex items-center justify-center shrink-0 transition-colors cursor-pointer ${
                      rem.completed
                        ? 'bg-emerald-700 text-white'
                        : 'border-2 border-stone-300 text-transparent hover:border-emerald-700'
                    }`}
                  >
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </button>

                  <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 border ${colorClass}`}>
                    <Icon className="w-5 h-5" />
                  </div>

                  <div className="space-y-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold truncate ${rem.completed ? 'line-through text-stone-500' : 'text-stone-900'}`}>
                        {rem.title}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-2 text-xs text-stone-500">
                      <span className="font-mono text-stone-700 font-semibold">{rem.date}</span>
                      <span>·</span>
                      <span className="font-mono text-stone-700">{rem.time}</span>
                      <span>·</span>
                      <span className="capitalize">{rem.frequency}</span>
                      {rem.notes && (
                        <>
                          <span>·</span>
                          <span className="text-stone-600 truncate max-w-xs">{rem.notes}</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Edit and Delete Actions */}
                <div className="flex items-center gap-1 shrink-0">
                  <button
                    onClick={() => handleOpenEdit(rem)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                    title="Edit Reminder"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => deleteReminder(rem.id)}
                    className="p-1.5 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-rose-50 transition-colors"
                    title="Delete Reminder"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* MEDICATION REMINDER DISCLAIMER (Section 7 requirement) */}
      <div className="p-4 rounded-2xl bg-amber-50/70 border border-amber-200/80 text-amber-900 text-xs leading-relaxed flex items-start gap-3">
        <ShieldAlert className="w-4 h-4 text-amber-700 shrink-0 mt-0.5" />
        <div>
          <span className="font-bold">Medication Schedule Disclaimer:</span> PawCare helps pet owners remember the administration schedule of treatments prescribed by their licensed veterinarian. <span className="font-semibold">The application does not recommend medications, suggest active pharmaceutical agents, or calculate dosages.</span> Always adhere strictly to the prescription instructions provided on your veterinary clinic label.
        </div>
      </div>

      {/* CREATE / EDIT REMINDER MODAL */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">
                  {editingReminder ? 'Edit Care Reminder' : 'Create New Care Reminder'}
                </h3>
                <p className="text-xs text-stone-500">For {activePet.name} ({activePet.breed})</p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Reminder Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  placeholder="e.g. Rabies Booster Shot, Monthly Tick Chew"
                  className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Care Category
                  </label>
                  <select
                    value={type}
                    onChange={(e) => setType(e.target.value as ReminderType)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white outline-none focus:border-emerald-700"
                  >
                    <option value="vaccination">Vaccination (Booster)</option>
                    <option value="medication">Medication (Vet Prescribed)</option>
                    <option value="feeding">Feeding & Supplements</option>
                    <option value="grooming">Grooming & Bath</option>
                    <option value="vet">Veterinary Consultation</option>
                    <option value="dental">Dental Cleaning</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Frequency
                  </label>
                  <select
                    value={frequency}
                    onChange={(e) => setFrequency(e.target.value as any)}
                    className="w-full px-3 py-2.5 rounded-xl border border-stone-300 text-stone-900 bg-white outline-none focus:border-emerald-700"
                  >
                    <option value="once">Once</option>
                    <option value="daily">Daily</option>
                    <option value="weekly">Weekly</option>
                    <option value="monthly">Monthly</option>
                    <option value="yearly">Yearly</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Date
                  </label>
                  <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                    required
                  />
                </div>

                <div>
                  <label className="block font-semibold text-stone-800 mb-1">
                    Time
                  </label>
                  <input
                    type="text"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    placeholder="e.g. 09:00 AM"
                    className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none font-mono"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Veterinarian Notes / Details
                </label>
                <textarea
                  rows={2}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="e.g. Administer with morning meal as directed by Dr. Lin."
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                />
              </div>

              <div className="pt-3 border-t border-stone-100 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-xs"
                >
                  {editingReminder ? 'Save Changes' : 'Schedule Reminder'}
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
