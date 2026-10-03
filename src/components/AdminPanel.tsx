import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { AppointmentStatus, Order, Product, ProductCategory, AnimalType } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  ShieldCheck, 
  Stethoscope, 
  ShoppingBag, 
  PackageCheck, 
  Users, 
  Search, 
  Filter, 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  XCircle, 
  Truck, 
  Store, 
  QrCode, 
  Plus, 
  Trash2, 
  Edit3, 
  ArrowUpRight, 
  RefreshCw, 
  Eye, 
  Check, 
  Sparkles,
  Phone,
  Calendar,
  Layers,
  ChevronRight,
  TrendingUp,
  DollarSign,
  LogOut,
  Lock,
  KeyRound
} from 'lucide-react';

export const AdminPanel: React.FC = () => {
  const { 
    isAuthenticated,
    currentUser, 
    switchRole, 
    logout,
    setIsAuthModalOpen,
    setAuthModalMode,
    pets, 
    appointments, 
    updateAppointmentStatus, 
    orders, 
    updateOrderStatus,
    products, 
    toggleProductStock, 
    addProduct, 
    deleteProduct,
    showToast,
    setActiveTab
  } = useApp();

  const [activeAdminTab, setActiveAdminTab] = useState<'appointments' | 'orders' | 'inventory' | 'pets'>('appointments');
  const [appointmentFilter, setAppointmentFilter] = useState<string>('All');
  const [orderFulfillmentFilter, setOrderFulfillmentFilter] = useState<'All' | 'online' | 'offline_pickup'>('All');
  const [inventorySearch, setInventorySearch] = useState('');
  const [pickupCodeQuery, setPickupCodeQuery] = useState('');
  const [verifiedPickupOrder, setVerifiedPickupOrder] = useState<Order | null>(null);

  // New Product Modal State
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [newProdName, setNewProdName] = useState('');
  const [newProdCategory, setNewProdCategory] = useState<ProductCategory>('Toys');
  const [newProdPrice, setNewProdPrice] = useState('19.99');
  const [newProdSpecies, setNewProdSpecies] = useState<AnimalType[]>(['Dog']);
  const [newProdDesc, setNewProdDesc] = useState('');
  const [newProdBrand, setNewProdBrand] = useState('PawCare Clinic');

  // KPI Calculations
  const totalRevenue = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.total, 0);
  }, [orders]);

  const pendingAppointmentsCount = useMemo(() => {
    return appointments.filter(a => a.status === 'Awaiting confirmation').length;
  }, [appointments]);

  const activeOrdersCount = useMemo(() => {
    return orders.filter(o => o.status !== 'Delivered' && o.status !== 'Picked Up').length;
  }, [orders]);

  const outOfStockCount = useMemo(() => {
    return products.filter(p => !p.inStock).length;
  }, [products]);

  // Filtered Appointments
  const filteredAppointments = useMemo(() => {
    if (appointmentFilter === 'All') return appointments;
    return appointments.filter(a => a.status === appointmentFilter);
  }, [appointments, appointmentFilter]);

  // Filtered Orders
  const filteredOrders = useMemo(() => {
    if (orderFulfillmentFilter === 'All') return orders;
    return orders.filter(o => o.fulfillment === orderFulfillmentFilter);
  }, [orders, orderFulfillmentFilter]);

  // Filtered Products
  const filteredInventory = useMemo(() => {
    if (!inventorySearch.trim()) return products;
    const q = inventorySearch.toLowerCase();
    return products.filter(p => 
      p.name.toLowerCase().includes(q) || 
      p.category.toLowerCase().includes(q) ||
      p.brand?.toLowerCase().includes(q)
    );
  }, [products, inventorySearch]);

  const handleVerifyPickupCode = (e: React.FormEvent) => {
    e.preventDefault();
    if (!pickupCodeQuery.trim()) return;

    const clean = pickupCodeQuery.trim().toUpperCase();
    const found = orders.find(o => 
      o.fulfillment === 'offline_pickup' && 
      (o.pickupCode?.toUpperCase().includes(clean) || o.orderNumber.toUpperCase().includes(clean))
    );

    if (found) {
      setVerifiedPickupOrder(found);
      showToast(`Pass Verified: ${found.orderNumber} for ${found.pickupContactName || 'Customer'}`, 'success');
    } else {
      setVerifiedPickupOrder(null);
      showToast('No matching pickup code found in dispensary system', 'error');
    }
  };

  const handleCreateProduct = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProdName.trim()) return;

    const newProd: Product = {
      id: `prod-${Date.now()}`,
      name: newProdName.trim(),
      brand: newProdBrand.trim(),
      category: newProdCategory,
      price: parseFloat(newProdPrice) || 15.00,
      shortDescription: newProdDesc.trim() || 'Veterinary approved companion formula.',
      rating: 5.0,
      reviewCount: 1,
      image: 'https://images.unsplash.com/photo-1548767797-d8c844163c4c?w=600&auto=format&fit=crop&q=80',
      forSpecies: newProdSpecies,
      inStock: true,
      tag: 'New Arrival',
    };

    addProduct(newProd);
    setIsAddingProduct(false);
    setNewProdName('');
    setNewProdDesc('');
  };

  // Auth gate if logged out
  if (!isAuthenticated || !currentUser) {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-scale">
        <div className="w-16 h-16 rounded-3xl bg-amber-500/10 text-amber-700 flex items-center justify-center mx-auto border border-amber-500/20 shadow-sm animate-float-gentle">
          <ShieldCheck className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
            Administrator Access Restricted
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            Please log in with verified clinic director credentials (e.g. <span className="font-mono font-bold text-stone-800">admin / admin123</span>) to access hospital operations, patient triage, and inventory catalog controls.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => {
              setAuthModalMode('login');
              setIsAuthModalOpen(true);
            }}
            className="px-6 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <KeyRound className="w-4 h-4 text-amber-400" />
            <span>Sign In to Admin Center</span>
          </button>
        </div>
      </div>
    );
  }

  // Role gate if logged in as regular user
  if (currentUser.role !== 'admin') {
    return (
      <div className="max-w-xl mx-auto px-4 py-20 text-center space-y-6 animate-fade-scale">
        <div className="w-16 h-16 rounded-3xl bg-rose-50 text-rose-600 flex items-center justify-center mx-auto border border-rose-200 shadow-sm">
          <Lock className="w-8 h-8" />
        </div>
        <div className="space-y-2">
          <h2 className="text-2xl sm:text-3xl font-black text-stone-900 font-display">
            Elevated Role Required
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
            You are currently signed in as Pet Parent <span className="font-bold text-stone-800">{currentUser.name}</span>. Access to the hospital operations database is restricted to clinic administrators.
          </p>
        </div>
        <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
          <button
            onClick={() => switchRole('admin')}
            className="px-6 py-2.5 rounded-2xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-all shadow-md active:scale-95 cursor-pointer flex items-center gap-2"
          >
            <ShieldCheck className="w-4 h-4 text-emerald-300" />
            <span>Switch to Admin Account (Dr. Marcus Vance)</span>
          </button>
          <button
            onClick={() => setActiveTab('user_panel')}
            className="px-5 py-2.5 rounded-2xl bg-white hover:bg-stone-50 text-stone-700 font-semibold text-xs border border-stone-200 transition-all cursor-pointer"
          >
            Return to User Panel
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. ADMIN HEADER BAR */}
      <div className="rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-850 to-emerald-950 text-white shadow-2xl border border-stone-800 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-semibold border border-emerald-500/30">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span>PawCare Clinic Operations & Enterprise Control Center</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Administrative Command Center
            </h1>
            <p className="text-stone-300 text-xs sm:text-sm max-w-2xl leading-relaxed">
              Logged in as <span className="text-white font-semibold">{currentUser.name}</span>. Manage clinic appointments, dispatch orders, verify counter pickup passes, and supervise catalog inventory.
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <button
              onClick={() => switchRole('user')}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold text-xs border border-white/20 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Users className="w-4 h-4 text-emerald-300" />
              <span>Switch to User View</span>
            </button>
            <button
              onClick={() => setActiveTab('user_panel')}
              className="px-4 py-2.5 rounded-xl bg-emerald-700 hover:bg-emerald-600 text-white font-bold text-xs transition-all shadow-xs flex items-center gap-2 cursor-pointer"
            >
              <span>User Panel</span>
              <ArrowUpRight className="w-4 h-4" />
            </button>
            <button
              onClick={logout}
              className="px-3.5 py-2.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-200 font-semibold text-xs border border-rose-500/30 transition-all flex items-center gap-1.5 cursor-pointer"
              title="Sign Out of Session"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Real-time KPI Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8 pt-6 border-t border-stone-800/80">
          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Total Revenue</span>
              <DollarSign className="w-4 h-4 text-emerald-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              ${totalRevenue.toFixed(2)}
            </div>
            <div className="text-[11px] text-emerald-400 mt-0.5">
              {orders.length} orders recorded
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Pending Bookings</span>
              <Clock className="w-4 h-4 text-amber-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {pendingAppointmentsCount}
            </div>
            <div className="text-[11px] text-amber-300 mt-0.5">
              Requires clinic triage
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Active Orders</span>
              <ShoppingBag className="w-4 h-4 text-blue-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {activeOrdersCount}
            </div>
            <div className="text-[11px] text-blue-300 mt-0.5">
              Delivery & Pickup in progress
            </div>
          </div>

          <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-md">
            <div className="flex items-center justify-between text-xs text-stone-400">
              <span>Registered Patients</span>
              <Users className="w-4 h-4 text-purple-400" />
            </div>
            <div className="text-2xl font-bold font-mono text-white mt-1">
              {pets.length} Pets
            </div>
            <div className="text-[11px] text-purple-300 mt-0.5">
              Across dogs, cats & small pets
            </div>
          </div>
        </div>
      </div>

      {/* 2. ADMIN NAVIGATION TABS */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 scrollbar-none">
        {[
          { id: 'appointments', label: 'Clinic Appointments', icon: Stethoscope, badge: pendingAppointmentsCount },
          { id: 'orders', label: 'Order Fulfillment & Counter Verification', icon: PackageCheck, badge: activeOrdersCount },
          { id: 'inventory', label: 'Product & Food Catalog Manager', icon: ShoppingBag, badge: outOfStockCount ? `${outOfStockCount} OOS` : undefined },
          { id: 'pets', label: 'Patient Medical Roster', icon: Users, badge: pets.length },
        ].map((tab) => {
          const Icon = tab.icon;
          const isActive = activeAdminTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveAdminTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              <Icon className="w-4 h-4" />
              <span>{tab.label}</span>
              {tab.badge !== undefined && (
                <span className={`px-1.5 py-0.2 rounded-full text-[10px] ${
                  isActive ? 'bg-emerald-500 text-stone-950 font-mono font-bold' : 'bg-stone-200 text-stone-800'
                }`}>
                  {tab.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* 3. TAB 1: CLINIC APPOINTMENTS MANAGER */}
      {activeAdminTab === 'appointments' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Veterinary Consultations & Triage</h2>
              <p className="text-xs text-stone-500">Review patient symptoms, confirm calendar slots, and issue status updates.</p>
            </div>

            {/* Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
              {['All', 'Awaiting confirmation', 'Confirmed', 'Completed', 'Cancelled'].map((st) => (
                <button
                  key={st}
                  onClick={() => setAppointmentFilter(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors whitespace-nowrap ${
                    appointmentFilter === st
                      ? 'bg-emerald-800 text-white font-semibold'
                      : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {filteredAppointments.length === 0 ? (
            <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500">
              No appointments matching status "{appointmentFilter}".
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4">
              {filteredAppointments.map((apt) => (
                <div
                  key={apt.id}
                  className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs hover:shadow-xs transition-all space-y-4"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center font-bold text-sm">
                        {apt.petName[0]}
                      </div>
                      <div>
                        <div className="flex items-center gap-2">
                          <h3 className="text-sm font-bold text-stone-900">{apt.petName}</h3>
                          <span className="text-xs text-stone-500">({apt.petBreed}, {apt.petAge} yrs)</span>
                        </div>
                        <p className="text-xs text-stone-600">
                          Doctor: <span className="font-semibold text-stone-800">{apt.vetName}</span> · {apt.clinic}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className={`px-2.5 py-1 rounded-full text-xs font-semibold ${
                        apt.status === 'Confirmed'
                          ? 'bg-emerald-100 text-emerald-800'
                          : apt.status === 'Awaiting confirmation'
                          ? 'bg-amber-100 text-amber-800'
                          : apt.status === 'Completed'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}>
                        {apt.status}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                    <div className="p-3 rounded-xl bg-stone-50">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Date & Time</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{apt.date} at {apt.time}</p>
                      <span className="text-[11px] text-stone-500">{apt.consultationType} ({apt.currency}{apt.consultationFee})</span>
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Consultation Reason</span>
                      <p className="font-semibold text-stone-800 mt-0.5">{apt.reason}</p>
                      {apt.additionalInfo && (
                        <p className="text-[11px] text-stone-500 truncate mt-0.5">{apt.additionalInfo}</p>
                      )}
                    </div>

                    <div className="p-3 rounded-xl bg-stone-50">
                      <span className="text-[10px] font-bold text-stone-400 uppercase">Doctor Direct Contact</span>
                      <p className="font-semibold text-stone-800 mt-0.5 flex items-center gap-1 font-mono">
                        <Phone className="w-3 h-3 text-stone-400" />
                        <span>{apt.vetPhone || '+1 (555) 923-4411'}</span>
                      </p>
                    </div>
                  </div>

                  {/* Admin Actions */}
                  <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-stone-100">
                    {apt.status !== 'Confirmed' && apt.status !== 'Completed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Confirmed')}
                        className="px-3.5 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Confirm Appointment</span>
                      </button>
                    )}

                    {apt.status === 'Confirmed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Completed')}
                        className="px-3.5 py-1.5 rounded-xl bg-blue-700 hover:bg-blue-800 text-white font-semibold text-xs transition-colors flex items-center gap-1.5 cursor-pointer"
                      >
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        <span>Mark as Completed</span>
                      </button>
                    )}

                    {apt.status !== 'Cancelled' && apt.status !== 'Completed' && (
                      <button
                        onClick={() => updateAppointmentStatus(apt.id, 'Cancelled')}
                        className="px-3.5 py-1.5 rounded-xl bg-rose-50 hover:bg-rose-100 text-rose-700 font-semibold text-xs transition-colors cursor-pointer"
                      >
                        Cancel Booking
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* 4. TAB 2: ORDER FULFILLMENT & COUNTER PICKUP VERIFICATION */}
      {activeAdminTab === 'orders' && (
        <div className="space-y-6">
          
          {/* OFFLINE COUNTER VERIFICATION BOX */}
          <div className="p-6 rounded-3xl bg-amber-50/70 border border-amber-200 space-y-4">
            <div className="flex items-center gap-2">
              <QrCode className="w-5 h-5 text-amber-800" />
              <h3 className="text-sm font-bold text-amber-950 uppercase tracking-wider">
                Store Counter Pickup Verification Terminal
              </h3>
            </div>
            <p className="text-xs text-amber-900 leading-relaxed">
              When a pet parent arrives at the dispensary counter, enter their 6-digit pickup PIN or Order Number to verify release.
            </p>

            <form onSubmit={handleVerifyPickupCode} className="flex gap-2 max-w-md">
              <input
                type="text"
                value={pickupCodeQuery}
                onChange={(e) => setPickupCodeQuery(e.target.value)}
                placeholder="Enter 6-digit PIN (e.g. 842190 or PCPASS-842190)..."
                className="flex-1 px-3 py-2 rounded-xl bg-white border border-amber-300 text-xs text-stone-900 outline-none uppercase font-mono"
              />
              <button
                type="submit"
                className="px-4 py-2 rounded-xl bg-amber-800 hover:bg-amber-900 text-white text-xs font-bold transition-colors cursor-pointer"
              >
                Verify Pass
              </button>
            </form>

            {verifiedPickupOrder && (
              <div className="p-4 rounded-2xl bg-white border border-amber-300 space-y-3 animate-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-emerald-700">Valid Pass Found</span>
                    <h4 className="text-sm font-bold text-stone-900">Order #{verifiedPickupOrder.orderNumber}</h4>
                  </div>
                  <span className="font-mono font-bold text-amber-900 bg-amber-100 px-2 py-0.5 rounded">
                    {verifiedPickupOrder.pickupCode}
                  </span>
                </div>
                <div className="text-xs text-stone-600">
                  Customer: <span className="font-semibold text-stone-900">{verifiedPickupOrder.pickupContactName || 'Pet Parent'}</span> ({verifiedPickupOrder.pickupContactPhone || 'N/A'})
                </div>
                <div className="text-xs font-semibold text-stone-800">
                  Items to hand over:
                  <ul className="list-disc pl-4 font-normal text-stone-600 mt-1">
                    {verifiedPickupOrder.items.map(it => (
                      <li key={it.product.id}>{it.quantity}x {it.product.name}</li>
                    ))}
                  </ul>
                </div>
                {verifiedPickupOrder.status !== 'Picked Up' ? (
                  <button
                    onClick={() => {
                      updateOrderStatus(verifiedPickupOrder.id, 'Picked Up');
                      setVerifiedPickupOrder({ ...verifiedPickupOrder, status: 'Picked Up' });
                    }}
                    className="w-full py-2 rounded-xl bg-emerald-800 text-white font-bold text-xs hover:bg-emerald-900 transition-colors"
                  >
                    Confirm Release & Mark Picked Up
                  </button>
                ) : (
                  <div className="text-xs font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg text-center">
                    ✓ Order has already been released to customer.
                  </div>
                )}
              </div>
            )}
          </div>

          {/* ALL ORDERS TABLE / CARDS */}
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Order Dispatch Registry</h3>
                <p className="text-xs text-stone-500">Live order queue with real-time status controls.</p>
              </div>

              <div className="flex items-center gap-1.5">
                {(['All', 'online', 'offline_pickup'] as const).map(mode => (
                  <button
                    key={mode}
                    onClick={() => setOrderFulfillmentFilter(mode)}
                    className={`px-3 py-1 rounded-xl text-xs font-medium transition-colors ${
                      orderFulfillmentFilter === mode
                        ? 'bg-stone-900 text-white font-semibold'
                        : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    {mode === 'All' ? 'All Orders' : mode === 'online' ? '🚚 Online Delivery' : '🏪 Hub Pickup'}
                  </button>
                ))}
              </div>
            </div>

            {filteredOrders.length === 0 ? (
              <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500">
                No orders found in this fulfillment view.
              </div>
            ) : (
              <div className="space-y-3">
                {filteredOrders.map((ord) => (
                  <div
                    key={ord.id}
                    className="p-5 rounded-2xl bg-white border border-stone-200/80 shadow-2xs space-y-3 text-xs"
                  >
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-stone-100 pb-2.5">
                      <div>
                        <span className="font-mono font-bold text-stone-900 text-sm">{ord.orderNumber}</span>
                        <span className="text-stone-400 text-[11px] ml-2">
                          {new Date(ord.createdAt).toLocaleDateString()} at {new Date(ord.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold ${
                          ord.fulfillment === 'online' ? 'bg-emerald-50 text-emerald-800' : 'bg-amber-50 text-amber-800'
                        }`}>
                          {ord.fulfillment === 'online' ? '🚚 Online Delivery' : '🏪 Store Pickup'}
                        </span>

                        {/* Real-time Status Dropdown */}
                        <select
                          value={ord.status}
                          onChange={(e) => updateOrderStatus(ord.id, e.target.value as any)}
                          className="px-2.5 py-1 rounded-lg bg-stone-100 border border-stone-300 text-xs font-semibold text-stone-800 outline-none cursor-pointer"
                        >
                          <option value="Processing">Processing</option>
                          <option value="Out for Delivery">Out for Delivery</option>
                          <option value="Delivered">Delivered</option>
                          <option value="Ready for Pickup">Ready for Pickup</option>
                          <option value="Picked Up">Picked Up</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">Order Items</span>
                        <div className="font-medium text-stone-800 mt-0.5">
                          {ord.items.map(it => (
                            <div key={it.product.id} className="truncate">
                              {it.quantity}x {it.product.name}
                            </div>
                          ))}
                        </div>
                      </div>

                      <div>
                        <span className="text-[10px] uppercase font-bold text-stone-400">
                          {ord.fulfillment === 'online' ? 'Shipping Destination' : 'Pickup Hub Location'}
                        </span>
                        <p className="font-medium text-stone-800 mt-0.5">
                          {ord.fulfillment === 'online' ? ord.shippingAddress : ord.pickupHub?.name}
                        </p>
                        {ord.trackingNumber && (
                          <p className="text-[11px] text-emerald-800 font-mono mt-0.5">Tracking: {ord.trackingNumber}</p>
                        )}
                        {ord.pickupCode && (
                          <p className="text-[11px] text-amber-900 font-mono mt-0.5">PIN: {ord.pickupCode}</p>
                        )}
                      </div>

                      <div className="text-right sm:text-right">
                        <span className="text-[10px] uppercase font-bold text-stone-400">Total Amount</span>
                        <div className="font-mono text-base font-extrabold text-stone-900 mt-0.5">
                          ${ord.total.toFixed(2)}
                        </div>
                        <span className="text-[10px] text-stone-500 uppercase font-semibold">
                          Pay: {ord.paymentMethod}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      )}

      {/* 5. TAB 3: INVENTORY, STORE & FOOD CATALOG MANAGER */}
      {activeAdminTab === 'inventory' && (
        <div className="space-y-5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h2 className="text-lg font-bold text-stone-900">Catalog & Stock Control</h2>
              <p className="text-xs text-stone-500">Live toggle in-stock status, adjust catalog items, and add new inventory.</p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setIsAddingProduct(true)}
                className="px-4 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs flex items-center gap-1.5 cursor-pointer shadow-2xs"
              >
                <Plus className="w-4 h-4" />
                <span>Add Product / Food</span>
              </button>
            </div>
          </div>

          {/* Search bar */}
          <div className="relative max-w-md">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={inventorySearch}
              onChange={(e) => setInventorySearch(e.target.value)}
              placeholder="Search catalog by name, brand, or category..."
              className="w-full pl-9 pr-3 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 outline-none"
            />
          </div>

          {/* Inventory Table */}
          <div className="bg-white rounded-3xl border border-stone-200/80 overflow-hidden shadow-2xs">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-stone-700">
                <thead className="bg-stone-50 border-b border-stone-200/80 font-bold uppercase text-[10px] text-stone-500">
                  <tr>
                    <th className="p-3.5">Product</th>
                    <th className="p-3.5">Category</th>
                    <th className="p-3.5">Species</th>
                    <th className="p-3.5">Price</th>
                    <th className="p-3.5">Stock Status</th>
                    <th className="p-3.5 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-stone-100">
                  {filteredInventory.map((item) => (
                    <tr key={item.id} className="hover:bg-stone-50/70 transition-colors">
                      <td className="p-3.5 font-medium text-stone-900">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={item.image}
                            alt={item.name}
                            className="w-9 h-9 rounded-lg object-cover border border-stone-200 shrink-0"
                          />
                          <div className="truncate max-w-[220px]">
                            <div className="font-bold text-stone-900 truncate">{item.name}</div>
                            <div className="text-[10px] text-stone-500">{item.brand || 'PawCare'}</div>
                          </div>
                        </div>
                      </td>
                      <td className="p-3.5">
                        <span className="px-2 py-0.5 rounded-full bg-stone-100 text-stone-800 text-[10px] font-semibold">
                          {item.category}
                        </span>
                      </td>
                      <td className="p-3.5">
                        <span className="text-[11px] text-stone-600">
                          {item.forSpecies.join(', ')}
                        </span>
                      </td>
                      <td className="p-3.5 font-mono font-bold text-stone-900">
                        ${item.price.toFixed(2)}
                      </td>
                      <td className="p-3.5">
                        <button
                          onClick={() => toggleProductStock(item.id)}
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold cursor-pointer transition-colors ${
                            item.inStock
                              ? 'bg-emerald-100 text-emerald-800 hover:bg-rose-100 hover:text-rose-800'
                              : 'bg-rose-100 text-rose-800 hover:bg-emerald-100 hover:text-emerald-800'
                          }`}
                        >
                          {item.inStock ? '✓ In Stock' : '✕ Out of Stock'}
                        </button>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => deleteProduct(item.id)}
                          className="p-1 text-stone-400 hover:text-rose-600 rounded transition-colors"
                          title="Delete from Catalog"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Add Product Modal */}
          {isAddingProduct && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md">
              <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 p-6 space-y-4 text-xs animate-in zoom-in-95">
                <div className="flex items-center justify-between border-b border-stone-100 pb-3">
                  <h3 className="text-base font-bold text-stone-900">Add New Catalog Product</h3>
                  <button onClick={() => setIsAddingProduct(false)} className="text-stone-400 hover:text-stone-700">
                    ✕
                  </button>
                </div>

                <form onSubmit={handleCreateProduct} className="space-y-3">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Product Title</label>
                    <input
                      type="text"
                      value={newProdName}
                      onChange={(e) => setNewProdName(e.target.value)}
                      placeholder="e.g. Ultra Dental Chews or Probiotic Salmon"
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">Category</label>
                      <select
                        value={newProdCategory}
                        onChange={(e) => setNewProdCategory(e.target.value as any)}
                        className="w-full px-2.5 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                      >
                        <option value="Food">Food</option>
                        <option value="Toys">Toys</option>
                        <option value="Skincare">Skincare</option>
                        <option value="Hygiene">Hygiene</option>
                        <option value="Treats">Treats</option>
                        <option value="Grooming">Grooming</option>
                        <option value="Beds">Beds</option>
                      </select>
                    </div>

                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">Price ($ USD)</label>
                      <input
                        type="number"
                        step="0.01"
                        value={newProdPrice}
                        onChange={(e) => setNewProdPrice(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none font-mono"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Brand Name</label>
                    <input
                      type="text"
                      value={newProdBrand}
                      onChange={(e) => setNewProdBrand(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">Short Description</label>
                    <textarea
                      value={newProdDesc}
                      onChange={(e) => setNewProdDesc(e.target.value)}
                      rows={2}
                      className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none"
                    />
                  </div>

                  <div className="pt-2 flex justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => setIsAddingProduct(false)}
                      className="px-3 py-1.5 rounded-xl text-stone-600 hover:bg-stone-100"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-1.5 rounded-xl bg-emerald-800 text-white font-bold hover:bg-emerald-900 shadow-xs"
                    >
                      Publish Product
                    </button>
                  </div>
                </form>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 6. TAB 4: PATIENT MEDICAL ROSTER */}
      {activeAdminTab === 'pets' && (
        <div className="space-y-4">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Hospital Patient Directory</h2>
            <p className="text-xs text-stone-500">Registered companion animals, allergies, and clinical wellness snapshots.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.map((p) => (
              <div
                key={p.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-2xs space-y-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={p.photoUrl}
                    alt={p.name}
                    className="w-12 h-12 rounded-2xl object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h3 className="text-sm font-bold text-stone-900">{p.name}</h3>
                    <p className="text-xs text-stone-500">{p.breed} · {p.age} years ({p.gender})</p>
                    <span className="text-[10px] font-mono text-emerald-800 bg-emerald-50 px-1.5 py-0.2 rounded">
                      Weight: {p.weight} kg
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs pt-2 border-t border-stone-100">
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Allergies:</span>
                    <span className="font-semibold text-rose-700">{p.allergies || 'None reported'}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Dietary:</span>
                    <span className="font-semibold text-stone-800 truncate max-w-[160px]">{p.dietaryRestrictions || 'Standard'}</span>
                  </div>
                  <div className="flex justify-between text-stone-600">
                    <span className="text-stone-400">Environment:</span>
                    <span>{p.indoorOutdoor}</span>
                  </div>
                </div>

                <div className="p-2.5 rounded-xl bg-stone-50 text-[11px] text-stone-700 flex items-center justify-between">
                  <span>Vaccination Health Score:</span>
                  <span className="font-bold text-emerald-800 font-mono">{p.wellness.vaccinations}%</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
