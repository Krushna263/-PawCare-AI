import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from './ImageWithFallback';
import { OFFLINE_PICKUP_HUBS } from '../../data/petFoodData';
import { PickupHub, Order } from '../../types';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Check, 
  CreditCard,
  Truck,
  Store,
  MapPin,
  QrCode
} from 'lucide-react';

export const CartDrawer: React.FC = () => {
  const { 
    cart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    isCartOpen, 
    setIsCartOpen,
    activePet,
    placeOrder,
    showToast 
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [fulfillmentType, setFulfillmentType] = useState<'online' | 'offline_pickup'>('online');
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Springfield, OR 97477');
  const [selectedHub, setSelectedHub] = useState<PickupHub>(OFFLINE_PICKUP_HUBS[0]);
  const [pickupContactName, setPickupContactName] = useState('Jane Doe');
  const [pickupContactPhone, setPickupContactPhone] = useState('+1 (555) 321-7654');
  const [paymentMethod, setPaymentMethod] = useState<'card' | 'upi' | 'cod' | 'pay_at_counter'>('card');
  const [lastPlacedOrder, setLastPlacedOrder] = useState<Order | null>(null);

  if (!isCartOpen) return null;

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = fulfillmentType === 'online' ? (subtotal === 0 || subtotal > 45 ? 0 : 4.99) : 0;
  const total = subtotal + deliveryFee;

  const handleSimulatedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    if (cart.length === 0) return;

    const newOrder = placeOrder({
      items: [...cart],
      subtotal,
      deliveryFee,
      total,
      fulfillment: fulfillmentType,
      shippingAddress: fulfillmentType === 'online' ? shippingAddress : undefined,
      deliverySpeed: fulfillmentType === 'online' ? 'Standard Priority Courier (2-3 Business Days)' : undefined,
      pickupHub: fulfillmentType === 'offline_pickup' ? selectedHub : undefined,
      pickupContactName: fulfillmentType === 'offline_pickup' ? pickupContactName : undefined,
      pickupContactPhone: fulfillmentType === 'offline_pickup' ? pickupContactPhone : undefined,
      paymentMethod: fulfillmentType === 'offline_pickup' && paymentMethod === 'cod' ? 'pay_at_counter' : paymentMethod,
    });

    setLastPlacedOrder(newOrder);
    setIsCheckingOut(false);
  };

  return (
    <>
      {/* SHOPPING CART DRAWER */}
      <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-md animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white/90 backdrop-blur-2xl border-l border-white/80 h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-stone-200/60 bg-white/70 backdrop-blur-md flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ShoppingBag className="w-5 h-5 text-emerald-800" />
              <h3 className="text-base font-bold text-stone-900">Your Companion Basket</h3>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="p-1.5 rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-200/50 transition-colors cursor-pointer"
              aria-label="Close cart"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Cart Items List */}
          <div className="p-5 flex-1 overflow-y-auto space-y-4">
            {cart.length === 0 ? (
              <div className="text-center py-16 space-y-3">
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
                  <ShoppingBag className="w-6 h-6" />
                </div>
                <p className="text-sm font-semibold text-stone-700">Your basket is empty</p>
                <p className="text-xs text-stone-400 max-w-xs mx-auto">
                  Explore curated nutrition, supplements, and wellness essentials.
                </p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.product.id} className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200/80 flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl overflow-hidden bg-stone-200 shrink-0 border border-stone-200">
                      <ImageWithFallback
                        src={item.product.image}
                        alt={item.product.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <div className="text-xs font-bold text-stone-900 line-clamp-1 max-w-[170px]">
                        {item.product.name}
                      </div>
                      <div className="font-mono text-xs font-semibold text-stone-600 tabular-nums">
                        ${item.product.price.toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <div className="flex items-center border border-stone-300 rounded-lg bg-white overflow-hidden text-xs">
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity - 1)}
                        className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                        aria-label="Decrease quantity"
                      >
                        <Minus className="w-3 h-3" />
                      </button>
                      <span className="px-2 font-mono font-bold text-stone-800 tabular-nums">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateCartQuantity(item.product.id, item.quantity + 1)}
                        className="p-1 hover:bg-stone-100 text-stone-600 transition-colors"
                        aria-label="Increase quantity"
                      >
                        <Plus className="w-3 h-3" />
                      </button>
                    </div>

                    <button
                      onClick={() => removeFromCart(item.product.id)}
                      className="text-stone-400 hover:text-rose-600 p-1 transition-colors"
                      title="Remove"
                      aria-label="Remove item"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Cart Footer & Subtotal */}
          {cart.length > 0 && (
            <div className="p-5 border-t border-stone-200 bg-[#FAF9F5] space-y-3">
              <div className="space-y-1.5 text-xs text-stone-600">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-mono font-bold text-stone-900 tabular-nums">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Delivery Fee</span>
                  <span className="font-mono text-stone-900 tabular-nums">
                    {deliveryFee === 0 ? <span className="text-emerald-700 font-bold">FREE (Over $50)</span> : `$${deliveryFee.toFixed(2)}`}
                  </span>
                </div>
                <div className="flex justify-between text-sm font-bold text-stone-900 pt-2 border-t border-stone-200">
                  <span>Total (Demo)</span>
                  <span className="font-mono text-emerald-900 tabular-nums">${total.toFixed(2)}</span>
                </div>
              </div>

              <button
                onClick={() => setIsCheckingOut(true)}
                className="w-full py-3 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors shadow-xs flex items-center justify-center gap-2 cursor-pointer"
              >
                <span>Proceed to Demo Checkout</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <p className="text-[10px] text-stone-400 text-center">
                *Simulated Checkout · No actual charge will be made.
              </p>
            </div>
          )}

        </div>
      </div>

      {/* DUAL FULFILLMENT CHECKOUT MODAL */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-lg bg-white/95 backdrop-blur-2xl rounded-3xl shadow-2xl border border-white/80 overflow-hidden p-6 space-y-4 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-stone-200/80 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Checkout Basket ({cart.length} items)</h3>
                <p className="text-xs text-stone-500">Choose Online Home Delivery or Offline Store Pickup</p>
              </div>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulatedCheckout} className="space-y-4 text-xs">
              
              {/* FULFILLMENT MODE TOGGLE */}
              <div>
                <label className="block font-bold text-stone-800 mb-1.5 uppercase tracking-wider text-[10px]">
                  Fulfillment Mode:
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    type="button"
                    onClick={() => setFulfillmentType('online')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      fulfillmentType === 'online'
                        ? 'bg-emerald-50/90 border-emerald-600 shadow-2xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Truck className={`w-5 h-5 ${fulfillmentType === 'online' ? 'text-emerald-800' : 'text-stone-400'}`} />
                    <div>
                      <div className="font-bold text-stone-900">Online Delivery</div>
                      <div className="text-[10px] text-stone-500">Shipped to door</div>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setFulfillmentType('offline_pickup')}
                    className={`p-3 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-2.5 ${
                      fulfillmentType === 'offline_pickup'
                        ? 'bg-amber-50/90 border-amber-600 shadow-2xs'
                        : 'bg-white border-stone-200 hover:bg-stone-50'
                    }`}
                  >
                    <Store className={`w-5 h-5 ${fulfillmentType === 'offline_pickup' ? 'text-amber-800' : 'text-stone-400'}`} />
                    <div>
                      <div className="font-bold text-stone-900">Store Pickup</div>
                      <div className="text-[10px] text-stone-500">Ready in 45m</div>
                    </div>
                  </button>
                </div>
              </div>

              {/* ONLINE FIELDS */}
              {fulfillmentType === 'online' ? (
                <div className="space-y-3 p-3.5 rounded-2xl bg-stone-50 border border-stone-200 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Delivery Address
                    </label>
                    <input
                      type="text"
                      value={shippingAddress}
                      onChange={(e) => setShippingAddress(e.target.value)}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 outline-none focus:border-emerald-700"
                      required
                    />
                  </div>
                  <div className="flex items-center justify-between text-[11px] text-stone-600 font-medium">
                    <span>Priority Dispatch (2-3 Business Days)</span>
                    <span className="text-emerald-700 font-bold">{subtotal > 45 ? 'FREE' : '$4.99'}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 p-3.5 rounded-2xl bg-amber-50/70 border border-amber-200 animate-in fade-in">
                  <div>
                    <label className="block font-semibold text-stone-800 mb-1">
                      Select Partner Pickup Hub
                    </label>
                    <select
                      value={selectedHub.id}
                      onChange={(e) => {
                        const h = OFFLINE_PICKUP_HUBS.find(x => x.id === e.target.value);
                        if (h) setSelectedHub(h);
                      }}
                      className="w-full px-3 py-2 rounded-xl bg-white border border-stone-300 text-stone-900 outline-none font-medium cursor-pointer"
                    >
                      {OFFLINE_PICKUP_HUBS.map(h => (
                        <option key={h.id} value={h.id}>
                          {h.name} ({h.readyTime})
                        </option>
                      ))}
                    </select>
                    <p className="text-[11px] text-stone-600 mt-1 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 shrink-0" />
                      <span>{selectedHub.address}</span>
                    </p>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block font-semibold text-stone-800 mb-0.5 text-[11px]">
                        Contact Name
                      </label>
                      <input
                        type="text"
                        value={pickupContactName}
                        onChange={(e) => setPickupContactName(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-900 outline-none"
                        required
                      />
                    </div>
                    <div>
                      <label className="block font-semibold text-stone-800 mb-0.5 text-[11px]">
                        Mobile Phone
                      </label>
                      <input
                        type="tel"
                        value={pickupContactPhone}
                        onChange={(e) => setPickupContactPhone(e.target.value)}
                        className="w-full px-2.5 py-1.5 rounded-lg bg-white border border-stone-300 text-stone-900 outline-none font-mono"
                        required
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PAYMENT SELECTION */}
              <div>
                <label className="block font-bold text-stone-800 mb-1 uppercase tracking-wider text-[10px]">
                  Payment Method:
                </label>
                <div className="grid grid-cols-3 gap-2 text-[11px]">
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('card')}
                    className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                      paymentMethod === 'card'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    Card
                  </button>
                  <button
                    type="button"
                    onClick={() => setPaymentMethod('upi')}
                    className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                      paymentMethod === 'upi'
                        ? 'bg-stone-900 text-white border-stone-900'
                        : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    UPI / QR
                  </button>
                  {fulfillmentType === 'offline_pickup' ? (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('pay_at_counter')}
                      className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                        paymentMethod === 'pay_at_counter'
                          ? 'bg-amber-800 text-white border-amber-800'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      Pay at Counter
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => setPaymentMethod('cod')}
                      className={`p-2 rounded-xl border text-center font-medium transition-colors ${
                        paymentMethod === 'cod'
                          ? 'bg-stone-900 text-white border-stone-900'
                          : 'bg-white border-stone-200 text-stone-700 hover:bg-stone-50'
                      }`}
                    >
                      COD
                    </button>
                  )}
                </div>
              </div>

              {/* TOTAL & SUBMIT ROW */}
              <div className="pt-2 border-t border-stone-200 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[10px]">Total Amount:</span>
                  <span className="font-mono text-base font-bold text-stone-900 tabular-nums">${total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-xs flex items-center gap-1.5 cursor-pointer"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Confirm Order</span>
                  </button>
                </div>
              </div>

            </form>

          </div>
        </div>
      )}

      {/* CHECKOUT RECEIPT & PASS MODAL */}
      {lastPlacedOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-md overflow-y-auto">
          <div className="relative w-full max-w-md bg-white/95 backdrop-blur-2xl rounded-3xl shadow-[0_24px_64px_rgba(0,0,0,0.2),inset_0_1px_1px_rgba(255,255,255,1)] border border-white/80 overflow-hidden p-6 space-y-4 text-center animate-in zoom-in-95 duration-200 my-8">
            <div className="w-14 h-14 rounded-full bg-emerald-100/90 text-emerald-800 flex items-center justify-center mx-auto shadow-xs">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-emerald-50 text-emerald-800">
                {lastPlacedOrder.fulfillment === 'online' ? '🚚 Online Delivery Placed' : '🏪 Ready for Store Pickup'}
              </span>
              <h3 className="text-lg font-bold text-stone-900 pt-1">
                Order #{lastPlacedOrder.orderNumber}
              </h3>
            </div>

            {lastPlacedOrder.fulfillment === 'online' ? (
              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 text-left text-xs space-y-1.5">
                <div className="flex justify-between">
                  <span className="text-stone-500">Tracking Code:</span>
                  <span className="font-mono font-bold text-emerald-800">{lastPlacedOrder.trackingNumber}</span>
                </div>
                <div>
                  <span className="text-stone-500 block text-[10px]">Destination:</span>
                  <span className="font-medium text-stone-800">{lastPlacedOrder.shippingAddress}</span>
                </div>
                <div className="text-[11px] text-stone-600 pt-1 border-t border-stone-200">
                  {lastPlacedOrder.estimatedDelivery} via Priority Dispatch.
                </div>
              </div>
            ) : (
              <div className="p-3.5 rounded-2xl bg-amber-50/80 border border-amber-200 text-left text-xs space-y-2">
                <div className="flex items-center justify-between">
                  <div>
                    <span className="text-[10px] uppercase font-bold text-amber-800 block">Pickup Pass Code:</span>
                    <span className="font-mono text-base font-extrabold text-amber-900">{lastPlacedOrder.pickupCode}</span>
                  </div>
                  <div className="w-10 h-10 bg-white rounded-lg border border-amber-300 flex items-center justify-center">
                    <QrCode className="w-7 h-7 text-stone-800" />
                  </div>
                </div>
                <div>
                  <span className="text-[10px] text-amber-800 font-bold block">Pickup Counter:</span>
                  <span className="font-semibold text-stone-900">{lastPlacedOrder.pickupHub?.name}</span>
                  <p className="text-[10px] text-stone-600">{lastPlacedOrder.pickupHub?.address}</p>
                </div>
                <p className="text-[10px] text-stone-500 italic">
                  Show your PIN at the dispensary counter for instant package collection.
                </p>
              </div>
            )}

            <button
              onClick={() => {
                setLastPlacedOrder(null);
                setIsCartOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors cursor-pointer shadow-xs"
            >
              Done & Return to Store
            </button>
          </div>
        </div>
      )}
    </>
  );
};
