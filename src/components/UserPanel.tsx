import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  Heart, 
  Calendar, 
  ShoppingBag, 
  Settings, 
  ShieldCheck, 
  Plus, 
  Edit2, 
  Clock, 
  MapPin, 
  QrCode, 
  Truck, 
  Store, 
  Phone, 
  Check, 
  Sparkles, 
  Bell, 
  LogOut, 
  UserCheck, 
  ArrowRight,
  Droplets,
  Utensils,
  User,
  KeyRound
} from 'lucide-react';

interface UserPanelProps {
  onOpenNewPetModal: () => void;
  onEditPet: () => void;
}

export const UserPanel: React.FC<UserPanelProps> = ({ onOpenNewPetModal, onEditPet }) => {
  const { 
    isAuthenticated,
    currentUser, 
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    updateUserProfile, 
    switchRole, 
    pets, 
    activePet, 
    setActivePetId, 
    appointments, 
    cancelAppointment, 
    orders,
    feedingSchedule,
    reminders,
    setActiveTab,
    showToast
  } = useApp();

  const [activeTabLocal, setActiveTabLocal] = useState<'pets' | 'appointments' | 'orders' | 'settings'>('pets');
  
  // Profile edit fields
  const [name, setName] = useState(currentUser?.name || '');
  const [phone, setPhone] = useState(currentUser?.phone || '');
  const [address, setAddress] = useState(currentUser?.address || '');
  const [emailAlerts, setEmailAlerts] = useState(currentUser?.notificationPreferences?.email ?? true);
  const [smsAlerts, setSmsAlerts] = useState(currentUser?.notificationPreferences?.sms ?? true);
  const [feedingAlerts, setFeedingAlerts] = useState(currentUser?.notificationPreferences?.feedingAlerts ?? true);
  const [appointmentAlerts, setAppointmentAlerts] = useState(currentUser?.notificationPreferences?.appointmentReminders ?? true);

  // If not authenticated, show sign-in gate
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-scale">
        <div className="w-16 h-16 rounded-3xl bg-emerald-50 text-emerald-700 flex items-center justify-center mx-auto border border-emerald-200/80 shadow-sm animate-float-gentle">
          <User className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
            Sign in to Your Pet Parent Portal
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Access your companion's health radar, vaccination timelines, clinic appointment schedules, and pickup pass codes.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-emerald-300" />
            <span>Sign In with ID & Password</span>
          </button>
          <button
            onClick={() => {
              setAuthModalMode('register');
              setIsAuthModalOpen(true);
            }}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs border border-stone-200 transition-all cursor-pointer"
          >
            Create New Account
          </button>
        </div>
      </div>
    );
  }

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    updateUserProfile({
      name,
      phone,
      address,
      notificationPreferences: {
        email: emailAlerts,
        sms: smsAlerts,
        feedingAlerts,
        appointmentReminders: appointmentAlerts,
      },
    });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. USER PORTAL WELCOME BANNER */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white shadow-2xl border border-white/20 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
        
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="flex items-center gap-4">
            <ImageWithFallback
              src={currentUser.avatarUrl}
              fallbackSrc="https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80"
              alt={currentUser.name}
              className="w-16 h-16 rounded-2xl object-cover border-2 border-emerald-400/60 shadow-md shrink-0"
            />
            <div className="space-y-1">
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[11px] font-semibold border border-emerald-500/30">
                <Sparkles className="w-3.5 h-3.5" />
                <span>Verified Pet Parent · Gold Wellness Tier</span>
              </div>
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
                {currentUser.name}’s Care Portal
              </h1>
              <p className="text-emerald-100/80 text-xs">
                {currentUser.email} · Member since {currentUser.memberSince}
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => switchRole('admin')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <ShieldCheck className="w-4 h-4 text-amber-300" />
              <span>Switch to Admin Panel</span>
            </button>
            <button
              onClick={onOpenNewPetModal}
              className="px-4 py-2.5 rounded-xl bg-white text-emerald-950 font-bold text-xs hover:bg-emerald-50 transition-all shadow-md flex items-center gap-1.5 cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Add Companion</span>
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-white/10 hover:bg-rose-500/20 text-stone-200 hover:text-rose-200 font-semibold text-xs border border-white/20 hover:border-rose-400/40 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Quick Quick Care Metrics Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 pt-6 border-t border-white/10 text-xs">
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Companions</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{pets.length} Pets</div>
            <span className="text-[10px] text-emerald-200/70">Active: {activePet.name}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Consultations</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{appointments.length} Booked</div>
            <span className="text-[10px] text-emerald-200/70">Next: {appointments[0]?.date || 'None'}</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Orders & Passes</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{orders.length} Orders</div>
            <span className="text-[10px] text-emerald-200/70">Online & Pickup</span>
          </div>

          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <span className="text-[10px] text-emerald-300 font-bold uppercase">Routine Alerts</span>
            <div className="text-xl font-bold font-mono text-white mt-0.5">{reminders.length} Active</div>
            <span className="text-[10px] text-emerald-200/70">{feedingSchedule.length} daily meals</span>
          </div>
        </div>
      </div>

      {/* 2. USER PORTAL NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        {[
          { id: 'pets', label: 'My Companions', icon: Heart, count: pets.length },
          { id: 'appointments', label: 'My Vet Consultations', icon: Calendar, count: appointments.length },
          { id: 'orders', label: 'My Orders & Pickup Passes', icon: ShoppingBag, count: orders.length },
          { id: 'settings', label: 'Account & Preferences', icon: Settings },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTabLocal === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTabLocal(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.count !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-white text-emerald-950 font-mono font-bold' : 'bg-stone-200 text-stone-800'
                }`}>
                  {tab.count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: MY COMPANIONS */}
      {activeTabLocal === 'pets' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Your Pet Family</h2>
              <p className="text-xs text-stone-500">Select any companion to switch active profile or view health logs.</p>
            </div>
            <button
              onClick={onOpenNewPetModal}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Pet</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {pets.map((pet) => {
              const isSelected = pet.id === activePet.id;
              return (
                <div
                  key={pet.id}
                  onClick={() => setActivePetId(pet.id)}
                  className={`p-5 rounded-3xl border transition-all cursor-pointer flex flex-col justify-between space-y-4 ${
                    isSelected
                      ? 'bg-white/90 border-emerald-600 shadow-md ring-2 ring-emerald-600/30'
                      : 'bg-white/70 border-stone-200 hover:bg-white hover:border-emerald-400 shadow-2xs'
                  }`}
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <ImageWithFallback
                        src={pet.photoUrl}
                        fallbackSrc={
                          pet.animalType === 'Dog'
                            ? 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=300&auto=format&fit=crop&q=80'
                            : 'https://images.unsplash.com/photo-1514888286974-6c03e2ca1dba?w=300&auto=format&fit=crop&q=80'
                        }
                        alt={pet.name}
                        className="w-14 h-14 rounded-2xl object-cover border border-stone-200 shrink-0"
                      />
                      <div>
                        <div className="flex items-center gap-1.5">
                          <h3 className="text-sm font-bold text-stone-900">{pet.name}</h3>
                          {isSelected && (
                            <span className="px-2 py-0.2 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                              Active
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-stone-500">{pet.breed}</p>
                        <p className="text-[11px] text-stone-400">{pet.age} years old · {pet.weight} kg</p>
                      </div>
                    </div>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActivePetId(pet.id);
                        onEditPet();
                      }}
                      className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors"
                      title="Edit Pet Profile"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Health Snapshot Micro-Bars */}
                  <div className="space-y-1.5 pt-3 border-t border-stone-100 text-[11px]">
                    <div className="flex justify-between text-stone-600">
                      <span>Nutrition Score:</span>
                      <span className="font-bold text-emerald-800">{pet.wellness.nutrition}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${pet.wellness.nutrition}%` }} />
                    </div>

                    <div className="flex justify-between text-stone-600 pt-1">
                      <span>Vaccination Defense:</span>
                      <span className="font-bold text-emerald-800">{pet.wellness.vaccinations}%</span>
                    </div>
                    <div className="w-full h-1.5 rounded-full bg-stone-100 overflow-hidden">
                      <div className="h-full bg-teal-600 rounded-full" style={{ width: `${pet.wellness.vaccinations}%` }} />
                    </div>
                  </div>

                  <div className="pt-2 flex items-center justify-between text-xs text-emerald-800 font-semibold">
                    <span onClick={() => setActiveTab('pet')} className="hover:underline flex items-center gap-1">
                      <span>View Health Records</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* 4. TAB 2: MY VET CONSULTATIONS */}
      {activeTabLocal === 'appointments' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Your Clinic Bookings</h2>
              <p className="text-xs text-stone-500">Live consultation appointments with registered veterinarians.</p>
            </div>
            <button
              onClick={() => setActiveTab('vet')}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Book New Consultation</span>
            </button>
          </div>

          {appointments.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500 space-y-2">
              <p className="text-sm font-semibold text-stone-800">No appointments scheduled</p>
              <p className="text-xs text-stone-500">Connect with expert veterinarians for in-clinic checkups or telehealth.</p>
              <button
                onClick={() => setActiveTab('vet')}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
              >
                Schedule Checkup
              </button>
            </div>
          ) : (
            <div className="space-y-3">
              {appointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                    <div>
                      <span className="font-bold text-stone-900 text-sm">{apt.vetName}</span>
                      <span className="text-stone-500 text-xs ml-1.5">({apt.specialty})</span>
                    </div>
                    <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold self-start sm:self-auto ${
                      apt.status === 'Confirmed'
                        ? 'bg-emerald-100 text-emerald-800'
                        : apt.status === 'Awaiting confirmation'
                        ? 'bg-amber-100 text-amber-800'
                        : 'bg-stone-100 text-stone-700'
                    }`}>
                      {apt.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">Date & Slot</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{apt.date} at {apt.time}</p>
                      <span className="text-[11px] text-stone-500">{apt.consultationType} ({apt.currency}{apt.consultationFee})</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">Patient & Reason</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{apt.petName} ({apt.petBreed})</p>
                      <span className="text-[11px] text-stone-500 truncate block">{apt.reason}</span>
                    </div>

                    <div>
                      <span className="text-[10px] uppercase font-bold text-stone-400">Clinic Location</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{apt.clinic}</p>
                      <p className="text-[11px] text-emerald-800 font-mono mt-0.5">Direct: {apt.vetPhone || '+1 (555) 923-4411'}</p>
                    </div>
                  </div>

                  {apt.status !== 'Cancelled' && (
                    <div className="pt-2 border-t border-stone-100 flex justify-end">
                      <button
                        onClick={() => cancelAppointment(apt.id)}
                        className="text-xs text-rose-700 hover:text-rose-900 font-semibold cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 5. TAB 3: MY ORDERS & PICKUP PASSES */}
      {activeTabLocal === 'orders' && (
        <div className="space-y-5">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Orders & In-Store Passes</h2>
              <p className="text-xs text-stone-500">Track online deliveries or show instant QR codes for counter pickup.</p>
            </div>
            <button
              onClick={() => setActiveTab('food')}
              className="px-3.5 py-2 rounded-xl bg-emerald-800 text-white font-semibold text-xs flex items-center gap-1.5 hover:bg-emerald-900 transition-colors shadow-2xs"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Browse Food & Store</span>
            </button>
          </div>

          {orders.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500 space-y-2">
              <p className="text-sm font-semibold text-stone-800">No orders placed yet</p>
              <p className="text-xs text-stone-500">Order from our 58+ vet-approved foods or pet accessories for doorstep delivery or 45-min counter pickup.</p>
              <button
                onClick={() => setActiveTab('food')}
                className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900"
              >
                Explore Pet Food Vault
              </button>
            </div>
          ) : (
            <div className="space-y-4">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-4 text-xs"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div>
                      <span className="font-mono font-bold text-stone-900 text-sm">{ord.orderNumber}</span>
                      <span className="text-[11px] text-stone-400 ml-2">
                        {new Date(ord.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                        ord.fulfillment === 'online'
                          ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                          : 'bg-amber-50 text-amber-800 border border-amber-200'
                      }`}>
                        {ord.fulfillment === 'online' ? '🚚 Online Home Delivery' : '🏪 Offline Store Pickup'}
                      </span>
                      <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-stone-100 text-stone-800">
                        {ord.status}
                      </span>
                    </div>
                  </div>

                  {/* Detail Cards */}
                  {ord.fulfillment === 'offline_pickup' ? (
                    <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 flex flex-col sm:flex-row items-center justify-between gap-4">
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold uppercase text-amber-800">Your Instant Pickup Pass:</span>
                        <div className="text-xl font-mono font-extrabold text-amber-950">{ord.pickupCode}</div>
                        <p className="text-[11px] text-amber-900">
                          Pickup Counter: <span className="font-semibold text-stone-900">{ord.pickupHub?.name}</span>
                        </p>
                        <p className="text-[11px] text-stone-600">{ord.pickupHub?.address}</p>
                      </div>

                      <div className="w-20 h-20 bg-white rounded-xl border border-amber-300 flex items-center justify-center p-2 shadow-xs shrink-0">
                        <QrCode className="w-full h-full text-stone-800" />
                      </div>
                    </div>
                  ) : (
                    <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-1.5">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Tracking ID:</span>
                        <span className="font-mono font-bold text-emerald-800">{ord.trackingNumber}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Destination:</span>
                        <span className="font-medium text-stone-800 truncate max-w-xs">{ord.shippingAddress}</span>
                      </div>
                      <div className="text-[11px] text-stone-500 pt-1 border-t border-stone-200">
                        {ord.estimatedDelivery || 'Courier dispatch in progress'}
                      </div>
                    </div>
                  )}

                  {/* Items summary */}
                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between text-xs">
                    <span className="text-stone-600">
                      {ord.items.map(i => `${i.quantity}x ${i.product.name}`).join(', ')}
                    </span>
                    <span className="font-mono font-bold text-stone-900 text-sm shrink-0 ml-3">
                      ${ord.total.toFixed(2)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: PROFILE & NOTIFICATION SETTINGS */}
      {activeTabLocal === 'settings' && (
        <div className="p-6 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-6 max-w-2xl">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Account & Care Alerts</h2>
            <p className="text-xs text-stone-500">Update your contact information and customized pet reminders.</p>
          </div>

          <form onSubmit={handleSaveProfile} className="space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-stone-800 mb-1">Full Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                required
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">Contact Phone</label>
                <input
                  type="tel"
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none font-mono"
                />
              </div>

              <div>
                <label className="block font-semibold text-stone-800 mb-1">Account Role</label>
                <input
                  type="text"
                  value={currentUser.role === 'admin' ? 'Clinic Administrator' : 'Pet Parent (User)'}
                  disabled
                  className="w-full px-3 py-2 rounded-xl bg-stone-100 border border-stone-300 text-stone-600 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block font-semibold text-stone-800 mb-1">Default Home Delivery Address</label>
              <input
                type="text"
                value={address}
                onChange={(e) => setAddress(e.target.value)}
                className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
              />
            </div>

            {/* Notification Toggles */}
            <div className="pt-3 border-t border-stone-100 space-y-3">
              <span className="font-bold text-stone-800 block text-[11px] uppercase tracking-wider">
                Notification Preferences:
              </span>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={smsAlerts}
                  onChange={(e) => setSmsAlerts(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="text-stone-700">SMS Courier Dispatch & Pickup Pass Codes</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={feedingAlerts}
                  onChange={(e) => setFeedingAlerts(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="text-stone-700">Daily Smart Feeding Schedule Reminders</span>
              </label>

              <label className="flex items-center gap-2.5 cursor-pointer">
                <input
                  type="checkbox"
                  checked={appointmentAlerts}
                  onChange={(e) => setAppointmentAlerts(e.target.checked)}
                  className="rounded text-emerald-800"
                />
                <span className="text-stone-700">Vet Appointment Confirmations & Health Alerts</span>
              </label>
            </div>

            <div className="pt-4 flex justify-between items-center">
              <button
                type="button"
                onClick={() => switchRole('admin')}
                className="text-xs text-amber-800 hover:underline font-semibold flex items-center gap-1 cursor-pointer"
              >
                <ShieldCheck className="w-3.5 h-3.5" />
                <span>Switch to Admin Command Center</span>
              </button>

              <button
                type="submit"
                className="px-5 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
              >
                Save Preferences
              </button>
            </div>
          </form>
        </div>
      )}

    </div>
  );
};
