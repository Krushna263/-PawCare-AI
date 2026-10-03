import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, FoodType, AnimalType, PickupHub, Order } from '../types';
import { OFFLINE_PICKUP_HUBS } from '../data/petFoodData';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  Truck, 
  Store, 
  Check, 
  Plus, 
  Minus, 
  Star, 
  Sparkles, 
  ShieldCheck, 
  MapPin, 
  Clock, 
  Phone, 
  CreditCard, 
  QrCode, 
  ArrowRight, 
  X,
  Heart,
  Utensils,
  AlertCircle,
  PackageCheck
} from 'lucide-react';

export const PetFoodSection: React.FC = () => {
  const { 
    petFoods, 
    cart, 
    addToCart, 
    setIsCartOpen, 
    activePet, 
    placeOrder, 
    orders, 
    showToast 
  } = useApp();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecies, setSelectedSpecies] = useState<'All' | AnimalType>('All');
  const [selectedFoodType, setSelectedFoodType] = useState<'All' | FoodType>('All');
  const [selectedBenefit, setSelectedBenefit] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'price-asc' | 'price-desc' | 'rating'>('recommended');

  // Quantities state per product for inline adding
  const [itemQuantities, setItemQuantities] = useState<Record<string, number>>({});

  // Fast Order Modal State (Direct order from product card)
  const [orderingProduct, setOrderingProduct] = useState<Product | null>(null);
  const [orderQuantity, setOrderQuantity] = useState<number>(1);
  const [fulfillmentType, setFulfillmentType] = useState<'online' | 'offline_pickup'>('online');
  const [selectedHub, setSelectedHub] = useState<PickupHub>(OFFLINE_PICKUP_HUBS[0]);
  
  // Form fields
  const [deliveryAddress, setDeliveryAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477');
  const [deliverySpeed, setDeliverySpeed] = useState('Standard Courier (2-3 Business Days)');
  const [pickupContactName, setPickupContactName] = useState('Jane Doe');
  const [pickupContactPhone, setPickupContactPhone] = useState('+1 (555) 321-7654');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod' | 'pay_at_counter'>('card');
  
  // Confirmed Order Modal
  const [completedOrder, setCompletedOrder] = useState<Order | null>(null);
  const [showOrderHistory, setShowOrderHistory] = useState(false);

  // Distinct Health Benefits extracted from petFoods
  const healthBenefits = useMemo(() => {
    const set = new Set<string>();
    petFoods.forEach(p => {
      if (p.healthBenefit) set.add(p.healthBenefit);
    });
    return ['All', ...Array.from(set)];
  }, [petFoods]);

  // Filtered and Sorted Pet Foods
  const filteredFoods = useMemo(() => {
    return petFoods.filter((item) => {
      // Search
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = item.name.toLowerCase().includes(q);
        const matchesBrand = item.brand?.toLowerCase().includes(q);
        const matchesBenefit = item.healthBenefit?.toLowerCase().includes(q);
        const matchesDesc = item.shortDescription.toLowerCase().includes(q);
        if (!matchesName && !matchesBrand && !matchesBenefit && !matchesDesc) {
          return false;
        }
      }

      // Species
      if (selectedSpecies !== 'All' && !item.forSpecies.includes(selectedSpecies)) {
        return false;
      }

      // Food Type
      if (selectedFoodType !== 'All' && item.foodType !== selectedFoodType) {
        return false;
      }

      // Health Benefit
      if (selectedBenefit !== 'All' && item.healthBenefit !== selectedBenefit) {
        return false;
      }

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'rating') return b.rating - a.rating;
      return b.reviewCount - a.reviewCount; // Recommended
    });
  }, [petFoods, searchQuery, selectedSpecies, selectedFoodType, selectedBenefit, sortBy]);

  const handleQuantityChange = (productId: string, delta: number) => {
    setItemQuantities((prev) => {
      const current = prev[productId] || 1;
      const next = Math.max(1, current + delta);
      return { ...prev, [productId]: next };
    });
  };

  const handleAddToCart = (product: Product) => {
    const qty = itemQuantities[product.id] || 1;
    addToCart(product, qty);
    // Reset back to 1
    setItemQuantities((prev) => ({ ...prev, [product.id]: 1 }));
  };

  const openFastOrder = (product: Product) => {
    setOrderingProduct(product);
    setOrderQuantity(itemQuantities[product.id] || 1);
  };

  const handlePlaceFastOrder = (e: React.FormEvent) => {
    e.preventDefault();
    if (!orderingProduct) return;

    const subtotal = orderingProduct.price * orderQuantity;
    const deliveryFee = fulfillmentType === 'online' ? (subtotal > 45 ? 0 : 4.99) : 0;
    const total = subtotal + deliveryFee;

    const order = placeOrder({
      items: [{ product: orderingProduct, quantity: orderQuantity }],
      subtotal,
      deliveryFee,
      total,
      fulfillment: fulfillmentType,
      shippingAddress: fulfillmentType === 'online' ? deliveryAddress : undefined,
      deliverySpeed: fulfillmentType === 'online' ? deliverySpeed : undefined,
      pickupHub: fulfillmentType === 'offline_pickup' ? selectedHub : undefined,
      pickupContactName: fulfillmentType === 'offline_pickup' ? pickupContactName : undefined,
      pickupContactPhone: fulfillmentType === 'offline_pickup' ? pickupContactPhone : undefined,
      paymentMethod: fulfillmentType === 'offline_pickup' && paymentMethod === 'cod' ? 'pay_at_counter' : paymentMethod,
    });

    setOrderingProduct(null);
    setCompletedOrder(order);
  };

  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. HERO HEADER */}
      <div className="relative rounded-3xl overflow-hidden p-6 sm:p-10 bg-gradient-to-br from-emerald-950 via-emerald-900 to-stone-900 text-white shadow-2xl border border-white/20">
        {/* Ambient glow orbs */}
        <div className="absolute -top-24 -right-24 w-80 h-80 rounded-full bg-emerald-500/20 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-24 -left-20 w-72 h-72 rounded-full bg-amber-500/15 blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div className="space-y-3 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-emerald-200 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-emerald-300" />
              <span>Veterinary-Approved Nutritional Formulations · 58+ Recipes</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-white drop-shadow-xs">
              Pet Food Pantry & Vault
            </h1>

            <p className="text-emerald-100/90 text-xs sm:text-sm leading-relaxed">
              Wholesome dry kibble, single-protein wet pâté, freeze-dried raw bites, and clinical prescription diets tailored for <span className="font-semibold text-white">{activePet.name} ({activePet.animalType})</span>. Order with flexible <span className="font-semibold text-white">Online Doorstep Delivery</span> or <span className="font-semibold text-white">Instant Counter Pickup</span> at vetted clinic hubs.
            </p>

            {/* Dual Fulfillment Guarantee Badges */}
            <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-medium">
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <Truck className="w-4 h-4 text-emerald-300" />
                <span>Online Delivery: Free Over $45 (2-3 Days)</span>
              </div>
              <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/15">
                <Store className="w-4 h-4 text-amber-300" />
                <span>Offline Hub Pickup: Ready in 30-45 Mins</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="flex flex-col sm:flex-row lg:flex-col gap-3 shrink-0">
            <button
              onClick={() => setIsCartOpen(true)}
              className="px-5 py-3 rounded-2xl bg-white text-emerald-950 font-bold text-xs shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <ShoppingBag className="w-4 h-4 text-emerald-700" />
              <span>View Basket ({totalCartCount})</span>
            </button>

            {orders.length > 0 && (
              <button
                onClick={() => setShowOrderHistory(true)}
                className="px-5 py-3 rounded-2xl bg-white/15 hover:bg-white/25 text-white font-semibold text-xs border border-white/25 backdrop-blur-md transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <PackageCheck className="w-4 h-4 text-emerald-300" />
                <span>Past Orders ({orders.length})</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 2. DUAL FULFILLMENT SELECTOR BANNER */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 text-emerald-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Truck className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Doorstep Home Delivery</h4>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              Dispatched with temperature-controlled cold-chain packaging for wet & raw nutrition. Contactless delivery with SMS tracking.
            </p>
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-white/80 shadow-[0_4px_20px_rgba(0,0,0,0.03),inset_0_1px_1px_rgba(255,255,255,1)] flex items-start gap-3.5">
          <div className="w-10 h-10 rounded-xl bg-amber-50 text-amber-800 flex items-center justify-center shrink-0 shadow-2xs">
            <Store className="w-5 h-5" />
          </div>
          <div>
            <h4 className="text-xs font-bold text-stone-900">Direct Clinic & Store Pickup</h4>
            <p className="text-[11px] text-stone-600 mt-0.5 leading-relaxed">
              Order online, pick up at 4 local verified veterinary pharmacies and hubs within 45 mins. Pay online or cash/card at counter.
            </p>
          </div>
        </div>
      </div>

      {/* 3. SEARCH & FILTER CONTROLS */}
      <div className="p-5 rounded-3xl bg-white/60 backdrop-blur-2xl border border-white/80 shadow-[0_8px_32px_-4px_rgba(0,0,0,0.04),inset_0_1px_1px_rgba(255,255,255,1)] space-y-4">
        
        {/* Search Bar + Sort Row */}
        <div className="flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search 58+ foods by brand, ingredient, prescription need (e.g. Acana, salmon, kidney, puppy)..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-white/80 border border-stone-200 text-xs text-stone-900 outline-none focus:border-emerald-700 shadow-2xs"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <span className="text-xs font-semibold text-stone-500">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-3 py-2 rounded-xl bg-white/80 border border-stone-200 text-xs font-medium text-stone-800 outline-none shadow-2xs cursor-pointer"
            >
              <option value="recommended">Recommended · Most Popular</option>
              <option value="rating">Highest Rated</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>

        {/* Species Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Species:
          </span>
          {[
            { id: 'All', label: `All (${petFoods.length})` },
            { id: 'Dog', label: '🐕 Dogs (25)' },
            { id: 'Cat', label: '🐈 Cats (20)' },
            { id: 'Rabbit', label: '🐇 Rabbits (5)' },
            { id: 'Bird', label: '🦜 Birds (5)' },
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => setSelectedSpecies(item.id as any)}
              className={`px-3.5 py-1.5 rounded-xl text-xs font-semibold transition-all whitespace-nowrap cursor-pointer ${
                selectedSpecies === item.id
                  ? 'bg-emerald-800 text-white shadow-xs'
                  : 'bg-white/70 text-stone-600 hover:bg-white hover:text-stone-900 border border-white/80'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>

        {/* Food Type Categories */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
          <span className="text-[11px] font-bold text-stone-500 uppercase tracking-wider shrink-0 mr-1">
            Formulation:
          </span>
          {[
            'All',
            'Dry Kibble',
            'Wet & Canned',
            'Raw & Freeze-Dried',
            'Veterinary Diet',
            'Organic / Grain-Free',
            'Treats & Broths',
            'Small Pet & Bird',
          ].map((type) => (
            <button
              key={type}
              onClick={() => setSelectedFoodType(type as any)}
              className={`px-3 py-1 rounded-xl text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                selectedFoodType === type
                  ? 'bg-stone-900 text-white shadow-xs'
                  : 'bg-white/60 text-stone-600 hover:bg-white hover:text-stone-900 border border-stone-200/60'
              }`}
            >
              {type}
            </button>
          ))}
        </div>

        {/* Results Counter & Active Filters Clear */}
        <div className="flex items-center justify-between text-xs text-stone-500 pt-2 border-t border-stone-100">
          <div>
            Showing <span className="font-bold text-stone-900">{filteredFoods.length}</span> vet-approved pet foods
            {selectedSpecies !== 'All' && <span> for <span className="font-semibold text-emerald-800">{selectedSpecies}s</span></span>}
            {selectedFoodType !== 'All' && <span> in <span className="font-semibold text-stone-800">{selectedFoodType}</span></span>}
          </div>

          {(selectedSpecies !== 'All' || selectedFoodType !== 'All' || searchQuery !== '' || selectedBenefit !== 'All') && (
            <button
              onClick={() => {
                setSelectedSpecies('All');
                setSelectedFoodType('All');
                setSelectedBenefit('All');
                setSearchQuery('');
              }}
              className="text-xs font-semibold text-rose-700 hover:underline cursor-pointer"
            >
              Reset Filters
            </button>
          )}
        </div>
      </div>

      {/* 4. FOOD CATALOG GRID */}
      {filteredFoods.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white/60 backdrop-blur-xl border border-white/80 space-y-3">
          <AlertCircle className="w-10 h-10 text-stone-400 mx-auto" />
          <h3 className="text-base font-bold text-stone-800">No pet foods found matching your filter</h3>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, species selection, or reset filters to browse the entire 58+ food collection.
          </p>
          <button
            onClick={() => {
              setSelectedSpecies('All');
              setSelectedFoodType('All');
              setSelectedBenefit('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 transition-colors"
          >
            Show All 58+ Foods
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredFoods.map((food) => {
            const qty = itemQuantities[food.id] || 1;

            return (
              <div
                key={food.id}
                className="group rounded-3xl bg-white/50 hover:bg-white/75 backdrop-blur-2xl border border-white/70 hover:border-white/95 shadow-[inset_0_1.5px_1px_0_rgba(255,255,255,0.95),inset_0_-1px_1px_0_rgba(0,0,0,0.03),0_8px_24px_-4px_rgba(0,0,0,0.05)] hover:shadow-[inset_0_1.5px_1.5px_0_rgba(255,255,255,1),0_16px_36px_-6px_rgba(6,78,59,0.09)] hover:-translate-y-1 transition-all duration-300 flex flex-col justify-between overflow-hidden"
              >
                {/* Visual Image Header */}
                <div className="relative aspect-16/11 bg-stone-100 overflow-hidden">
                  <ImageWithFallback
                    src={food.image}
                    alt={food.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />

                  {/* Species & Tag Badges */}
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5">
                    {food.forSpecies.map((sp) => (
                      <span
                        key={sp}
                        className="px-2 py-0.5 rounded-full bg-stone-900/75 backdrop-blur-md text-white text-[10px] font-bold"
                      >
                        {sp === 'Dog' ? '🐕 Dog' : sp === 'Cat' ? '🐈 Cat' : sp === 'Rabbit' ? '🐇 Rabbit' : '🦜 Bird'}
                      </span>
                    ))}
                    {food.tag && (
                      <span className="px-2 py-0.5 rounded-full bg-emerald-800/85 backdrop-blur-md text-white text-[10px] font-bold">
                        {food.tag}
                      </span>
                    )}
                  </div>

                  {/* Pack Size & Calories */}
                  <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-[11px] font-semibold text-white px-2.5 py-1 rounded-xl bg-stone-900/70 backdrop-blur-md">
                    <span>{food.packSize}</span>
                    <span className="text-emerald-300">{food.calories}</span>
                  </div>
                </div>

                {/* Content Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Brand & Benefit Row */}
                    <div className="flex items-center justify-between text-[11px]">
                      <span className="font-bold text-emerald-800 uppercase tracking-wider">{food.brand}</span>
                      {food.healthBenefit && (
                        <span className="font-medium text-stone-600 bg-stone-100/90 px-2 py-0.5 rounded-full">
                          {food.healthBenefit}
                        </span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 group-hover:text-emerald-950 transition-colors line-clamp-2">
                      {food.name}
                    </h3>

                    <p className="text-xs text-stone-600 leading-relaxed line-clamp-2">
                      {food.shortDescription}
                    </p>

                    {/* Rating & Reviews */}
                    <div className="flex items-center gap-1.5 text-xs text-stone-600 pt-1">
                      <div className="flex items-center text-amber-500">
                        <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
                        <span className="font-bold ml-1 text-stone-900">{food.rating}</span>
                      </div>
                      <span>·</span>
                      <span className="text-[11px] text-stone-600">({food.reviewCount} verified reviews)</span>
                    </div>
                  </div>

                  {/* Pricing & Fulfillment Tags */}
                  <div className="pt-3 border-t border-stone-100/80 space-y-3">
                    <div className="flex items-baseline justify-between">
                      <div>
                        <div className="text-[10px] uppercase font-bold text-stone-500">Price</div>
                        <div className="text-lg font-extrabold text-stone-900 font-mono">
                          ${food.price.toFixed(2)}
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="text-[10px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-1">
                          <Check className="w-3 h-3 stroke-[2.5]" />
                          <span>In Stock</span>
                        </span>
                      </div>
                    </div>

                    {/* Dual Fulfillment Availability */}
                    <div className="flex items-center justify-between text-[10px] font-medium text-stone-600 bg-stone-50/80 p-2 rounded-xl">
                      <span className="flex items-center gap-1">
                        <Truck className="w-3 h-3 text-emerald-700" />
                        <span>Online: Doorstep</span>
                      </span>
                      <span>·</span>
                      <span className="flex items-center gap-1">
                        <Store className="w-3 h-3 text-amber-700" />
                        <span>Offline: 4 Hubs</span>
                      </span>
                    </div>

                    {/* Quantity Stepper & Buttons */}
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        {/* Quantity Counter */}
                        <div className="flex items-center border border-stone-200/80 rounded-xl bg-white/80 overflow-hidden text-xs shrink-0 shadow-2xs">
                          <button
                            onClick={() => handleQuantityChange(food.id, -1)}
                            className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
                            aria-label="Decrease quantity"
                          >
                            <Minus className="w-3 h-3" />
                          </button>
                          <span className="px-2 font-mono font-bold text-stone-800 tabular-nums">
                            {qty}
                          </span>
                          <button
                            onClick={() => handleQuantityChange(food.id, 1)}
                            className="p-2 hover:bg-stone-100 text-stone-600 transition-colors"
                            aria-label="Increase quantity"
                          >
                            <Plus className="w-3 h-3" />
                          </button>
                        </div>

                        {/* Add to Cart */}
                        <button
                          onClick={() => handleAddToCart(food)}
                          className="flex-1 py-2 px-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                        >
                          <ShoppingBag className="w-3.5 h-3.5" />
                          <span>Add to Cart</span>
                        </button>
                      </div>

                      {/* Fast Direct Order Button */}
                      <button
                        onClick={() => openFastOrder(food)}
                        className="w-full py-2 px-3 rounded-xl bg-white hover:bg-stone-50 text-stone-800 font-semibold text-xs border border-stone-200 transition-all shadow-2xs flex items-center justify-center gap-1.5 cursor-pointer"
                      >
                        <ZapIcon className="w-3.5 h-3.5 text-amber-600" />
                        <span>Order Now (Online or Offline)</span>
                      </button>
                    </div>

                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 5. FAST DUAL-FULFILLMENT CHECKOUT MODAL */}
      {orderingProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/80 overflow-hidden my-8 animate-in zoom-in-95 duration-200">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-stone-200/80 bg-white/70 backdrop-blur-md flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-stone-900">Direct Order Checkout</h3>
                <p className="text-xs text-stone-500">Choose Online Delivery or Offline Store Pickup</p>
              </div>
              <button
                onClick={() => setOrderingProduct(null)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handlePlaceFastOrder} className="p-6 space-y-5 text-xs">
              
              {/* Product Summary Row */}
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 flex items-center gap-3">
                <img
                  src={orderingProduct.image}
                  alt={orderingProduct.name}
                  className="w-14 h-14 rounded-xl object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <div className="text-[10px] font-bold text-emerald-800 uppercase">{orderingProduct.brand}</div>
                  <div className="text-xs font-bold text-stone-900 truncate">{orderingProduct.name}</div>
                  <div className="text-[11px] text-stone-600 mt-0.5">
                    {orderingProduct.packSize} · <span className="font-mono font-bold text-stone-900">${orderingProduct.price.toFixed(2)}</span>
                  </div>
                </div>
                
                {/* Quantity Controls in Modal */}
                <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden shrink-0">
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(Math.max(1, orderQuantity - 1))}
                    className="p-1 hover:bg-stone-100 text-stone-600"
                  >
                    <Minus className="w-3 h-3" />
                  </button>
                  <span className="px-2 font-mono font-bold text-stone-800">{orderQuantity}</span>
                  <button
                    type="button"
                    onClick={() => setOrderQuantity(orderQuantity + 1)}
                    className="p-1 hover:bg-stone-100 text-stone-600"
                  >
                    <Plus className="w-3 h-3" />
                  </button>
                </div>
              </div>

              {/* FULFILLMENT MODE TOGGLE TABS */}
              <div>
                <label className="block font-bold text-stone-800 mb-2 uppercase tracking-wider text-[10px]">
                  Select Fulfillment Mode:
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('online')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fulfillmentType === 'online'
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Truck className={`w-5 h-5 ${fulfillmentType === 'online' ? 'text-emerald-800' : 'text-stone-400'}`} />
                      {fulfillmentType === 'online' && <span className="w-2 h-2 rounded-full bg-emerald-700" />}
                    </div>
                    <div className="font-bold text-xs text-stone-900">Online Home Delivery</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Shipped directly to your doorstep</div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('offline_pickup')}
                    className={`p-3.5 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between ${
                      fulfillmentType === 'offline_pickup'
                        ? 'bg-amber-50/90 border-amber-600 shadow-xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <Store className={`w-5 h-5 ${fulfillmentType === 'offline_pickup' ? 'text-amber-800' : 'text-stone-400'}`} />
                      {fulfillmentType === 'offline_pickup' && <span className="w-2 h-2 rounded-full bg-amber-700" />}
                    </div>
                    <div className="font-bold text-xs text-stone-900">Offline Store Pickup</div>
                    <div className="text-[11px] text-stone-600 mt-0.5">Pick up at partner clinics / hubs</div>
                  </button>
                </div>
              </div>

              {/* ONLINE FIELDS */}
              {fulfillmentType === 'online' && (
                <div className="space-y-3 p-4 rounded-2xl bg-stone-50/80 border border-stone-200 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={deliveryAddress}
                      onChange={(e) => setDeliveryAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none focus:border-emerald-700"
                      required
                    />
                  </div>

                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Delivery Speed & Courier
                    </label>
                    <select
                      value={deliverySpeed}
                      onChange={(e) => setDeliverySpeed(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none"
                    >
                      <option value="Standard Courier (2-3 Business Days)">
                        Standard Courier (2-3 Business Days) - {orderingProduct.price * orderQuantity > 45 ? 'FREE' : '$4.99'}
                      </option>
                      <option value="Rush Courier (Same-Day Express Dispatch)">
                        Rush Courier (Same-Day Express Dispatch) - $9.99
                      </option>
                    </select>
                  </div>
                </div>
              )}

              {/* OFFLINE PICKUP FIELDS */}
              {fulfillmentType === 'offline_pickup' && (
                <div className="space-y-3 p-4 rounded-2xl bg-amber-50/60 border border-amber-200/80 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Choose Partner Pickup Hub
                    </label>
                    <div className="space-y-2">
                      {OFFLINE_PICKUP_HUBS.map((hub) => (
                        <label
                          key={hub.id}
                          className={`p-3 rounded-xl border flex items-start gap-2.5 cursor-pointer transition-colors ${
                            selectedHub.id === hub.id
                              ? 'bg-white border-amber-700 shadow-2xs'
                              : 'bg-white/60 border-stone-200 hover:bg-white'
                          }`}
                        >
                          <input
                            type="radio"
                            name="pickupHub"
                            checked={selectedHub.id === hub.id}
                            onChange={() => setSelectedHub(hub)}
                            className="mt-0.5 text-amber-700"
                          />
                          <div className="flex-1 text-[11px]">
                            <div className="font-bold text-stone-900">{hub.name}</div>
                            <div className="text-stone-600 flex items-center gap-1 mt-0.5">
                              <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                              <span>{hub.address}</span>
                            </div>
                            <div className="flex items-center gap-3 text-stone-500 mt-1 font-medium">
                              <span className="text-emerald-700 font-semibold">{hub.readyTime}</span>
                              <span>·</span>
                              <span>{hub.hours}</span>
                            </div>
                          </div>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Contact Person Name
                      </label>
                      <input
                        type="text"
                        value={pickupContactName}
                        onChange={(e) => setPickupContactName(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-1">
                        Mobile Phone (for SMS PIN)
                      </label>
                      <input
                        type="tel"
                        value={pickupContactPhone}
                        onChange={(e) => setPickupContactPhone(e.target.value)}
                        className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-xs text-stone-900 outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT METHOD SELECTION */}
              <div>
                <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wider text-[10px]">
                  Payment Method:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    Credit / Debit Card
                  </button>

                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    UPI / Digital QR
                  </button>

                  {fulfillmentType === 'offline_pickup' ? (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pay_at_counter')}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                        paymentMethod === 'pay_at_counter'
                          ? 'bg-amber-800 text-white border-amber-800 shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Pay at Counter
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2.5 rounded-xl border text-center font-medium transition-colors ${
                        paymentMethod === 'cod'
                          ? 'bg-stone-900 text-white border-stone-900 shadow-2xs'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Cash on Delivery
                    </button>
                  )}
                </div>
              </div>

              {/* Price Calculation Row */}
              <div className="pt-3 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <div className="text-[10px] text-stone-500">
                    Total Amount ({fulfillmentType === 'online' ? 'Includes Delivery' : 'Free Hub Pickup'}):
                  </div>
                  <div className="text-xl font-extrabold text-stone-900 font-mono">
                    ${(
                      orderingProduct.price * orderQuantity + 
                      (fulfillmentType === 'online' ? (orderingProduct.price * orderQuantity > 45 ? 0 : 4.99) : 0)
                    ).toFixed(2)}
                  </div>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setOrderingProduct(null)}
                    className="px-4 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-4 h-4" />
                    <span>Confirm Order</span>
                  </button>
                </div>
              </div>

            </form>
          </div>
        </div>
      )}

      {/* 6. ORDER CONFIRMATION & QR RECEIPT MODAL */}
      {completedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/80 overflow-hidden my-8 p-6 sm:p-8 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="w-16 h-16 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="text-center space-y-1">
              <span className="text-[11px] font-bold text-emerald-800 uppercase tracking-wider bg-emerald-50 px-3 py-1 rounded-full">
                {completedOrder.fulfillment === 'online' ? '🚚 Online Order Confirmed' : '🏪 Ready for Hub Pickup'}
              </span>
              <h3 className="text-xl font-bold text-stone-900 pt-1">
                Order #{completedOrder.orderNumber}
              </h3>
              <p className="text-xs text-stone-500">
                Created on {new Date(completedOrder.createdAt).toLocaleDateString()} at {new Date(completedOrder.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </p>
            </div>

            {/* DUAL MODE DETAILS CARD */}
            {completedOrder.fulfillment === 'online' ? (
              <div className="p-4 rounded-2xl bg-stone-50 border border-stone-200 space-y-2.5 text-xs text-stone-700">
                <div className="flex items-center justify-between font-semibold text-stone-900 border-b border-stone-200/80 pb-2">
                  <span className="flex items-center gap-1.5">
                    <Truck className="w-4 h-4 text-emerald-700" />
                    <span>Courier Tracking:</span>
                  </span>
                  <span className="font-mono text-emerald-800">{completedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Shipping Address:</span>
                  <span className="font-medium text-stone-900">{completedOrder.shippingAddress}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px] uppercase font-bold">Estimated Delivery:</span>
                  <span className="font-medium text-stone-900">{completedOrder.estimatedDelivery}</span>
                </div>
              </div>
            ) : (
              <div className="p-4 rounded-2xl bg-amber-50/80 border border-amber-200 space-y-3 text-xs text-amber-950">
                <div className="flex items-center justify-between border-b border-amber-200/80 pb-2">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800">Instant Pickup Pass PIN:</span>
                    <div className="text-xl font-mono font-extrabold text-amber-900">{completedOrder.pickupCode}</div>
                  </div>
                  <div className="w-12 h-12 bg-white rounded-xl border border-amber-300 flex items-center justify-center p-1">
                    <QrCode className="w-9 h-9 text-stone-800" />
                  </div>
                </div>

                <div>
                  <span className="text-[10px] uppercase font-bold text-amber-800 block">Pickup Location Hub:</span>
                  <div className="font-bold text-stone-900">{completedOrder.pickupHub?.name}</div>
                  <div className="text-[11px] text-stone-600">{completedOrder.pickupHub?.address}</div>
                </div>

                <div className="p-2.5 rounded-xl bg-white/80 border border-amber-200 text-[11px]">
                  <span className="font-bold text-amber-900 block">Pickup Counter Instructions:</span>
                  {completedOrder.pickupHub?.counterNotice || 'Show your QR code or 6-digit PIN at the dispensary counter.'}
                </div>
              </div>
            )}

            {/* Ordered Items Summary */}
            <div className="space-y-2 pt-2 border-t border-stone-100 text-xs">
              <div className="font-bold text-stone-800 uppercase tracking-wider text-[10px]">Package Contents:</div>
              {completedOrder.items.map((it) => (
                <div key={it.product.id} className="flex justify-between items-center text-stone-700">
                  <span className="truncate flex-1 pr-2">
                    {it.quantity}x {it.product.name}
                  </span>
                  <span className="font-mono font-semibold text-stone-900 shrink-0">
                    ${(it.product.price * it.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
              <div className="flex justify-between items-center pt-2 border-t border-stone-100 font-bold text-sm text-stone-900">
                <span>Total Paid (Demo)</span>
                <span className="font-mono text-emerald-900">${completedOrder.total.toFixed(2)}</span>
              </div>
            </div>

            <button
              onClick={() => setCompletedOrder(null)}
              className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-bold text-xs transition-colors shadow-xs cursor-pointer"
            >
              Done & Return to Pantry
            </button>

          </div>
        </div>
      )}

      {/* 7. PAST ORDERS DRAWER / MODAL */}
      {showOrderHistory && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-2xl bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.25),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/80 overflow-hidden my-8 p-6 space-y-5 animate-in zoom-in-95 duration-200">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <div className="flex items-center gap-2">
                <PackageCheck className="w-5 h-5 text-emerald-800" />
                <h3 className="text-base font-bold text-stone-900">Your Orders & Pickup Passes</h3>
              </div>
              <button
                onClick={() => setShowOrderHistory(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-1">
              {orders.map((ord) => (
                <div
                  key={ord.id}
                  className="p-4 rounded-2xl bg-white border border-stone-200 shadow-2xs space-y-3 text-xs"
                >
                  <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                    <div>
                      <span className="font-bold text-stone-900 block text-sm">{ord.orderNumber}</span>
                      <span className="text-[10px] text-stone-600">
                        {new Date(ord.createdAt).toLocaleDateString()} · {ord.items.length} items
                      </span>
                    </div>
                    <span className={`px-2.5 py-1 rounded-full text-[10px] font-bold ${
                      ord.fulfillment === 'online'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-200'
                        : 'bg-amber-50 text-amber-900 border border-amber-200'
                    }`}>
                      {ord.fulfillment === 'online' ? '🚚 Online Delivery' : '🏪 Hub Pickup'}
                    </span>
                  </div>

                  <div className="space-y-1">
                    {ord.items.map((it) => (
                      <div key={it.product.id} className="flex justify-between text-stone-600 text-[11px]">
                        <span className="truncate pr-2">{it.quantity}x {it.product.name}</span>
                        <span className="font-mono">${(it.product.price * it.quantity).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                    <div>
                      {ord.fulfillment === 'online' ? (
                        <span className="text-[11px] text-stone-600">Tracking: <span className="font-mono text-emerald-800">{ord.trackingNumber}</span></span>
                      ) : (
                        <span className="text-[11px] text-amber-900 font-semibold">Pickup Code: <span className="font-mono bg-amber-100 px-1.5 py-0.5 rounded">{ord.pickupCode}</span></span>
                      )}
                    </div>
                    <div className="font-bold font-mono text-stone-900 text-sm">
                      ${ord.total.toFixed(2)}
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button
              onClick={() => setShowOrderHistory(false)}
              className="w-full py-2.5 rounded-xl bg-stone-900 text-white font-semibold text-xs hover:bg-stone-800"
            >
              Close History
            </button>
          </div>
        </div>
      )}

    </div>
  );
};

// Simple ZapIcon for Quick Order
const ZapIcon: React.FC<{ className?: string }> = ({ className }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 24 24"
    fill="currentColor"
    className={className || 'w-4 h-4'}
  >
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2" />
  </svg>
);
