import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { ImageWithFallback } from './ImageWithFallback';
import { 
  ShoppingBag, 
  X, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Check, 
  CreditCard 
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
    showToast 
  } = useApp();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Springfield, OR');

  if (!isCartOpen) return null;

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const deliveryFee = subtotal === 0 ? 0 : subtotal > 50 ? 0 : 5.99;
  const total = subtotal + deliveryFee;

  const handleSimulatedCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setCheckoutComplete(true);
    clearCart();
    showToast('Demo order placed successfully!', 'success');
  };

  return (
    <>
      {/* SHOPPING CART DRAWER */}
      <div className="fixed inset-0 z-50 flex justify-end bg-stone-950/40 backdrop-blur-xs animate-in fade-in duration-200">
        <div className="w-full max-w-md bg-white h-full shadow-2xl flex flex-col justify-between animate-in slide-in-from-right duration-200">
          
          {/* Cart Header */}
          <div className="p-5 border-b border-stone-100 bg-[#FAF9F5] flex items-center justify-between">
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

      {/* DEMO CHECKOUT MODAL */}
      {isCheckingOut && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-lg bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-5 animate-in zoom-in-95 duration-200">
            
            <div className="flex items-center justify-between border-b border-stone-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-stone-900">Demo Order Checkout</h3>
                <p className="text-xs text-stone-500">Shipping for {activePet.name}’s supplies</p>
              </div>
              <button
                onClick={() => setIsCheckingOut(false)}
                className="p-1.5 rounded-full text-stone-400 hover:text-stone-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSimulatedCheckout} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-stone-800 mb-1">
                  Delivery Destination
                </label>
                <input
                  type="text"
                  value={shippingAddress}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  className="w-full px-3 py-2 rounded-xl border border-stone-300 text-stone-900 outline-none focus:border-emerald-700"
                  required
                />
              </div>

              <div className="p-3.5 rounded-2xl bg-stone-50 border border-stone-200 space-y-2">
                <div className="font-semibold text-stone-800 flex items-center gap-1.5">
                  <CreditCard className="w-4 h-4 text-emerald-800" />
                  <span>Simulated Payment Gateway (Test Card)</span>
                </div>
                <div className="font-mono text-stone-600 text-[11px]">
                  •••• •••• •••• 4242 (PawCare Sandbox)
                </div>
              </div>

              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-[11px] leading-relaxed">
                <span className="font-bold">Disclaimer:</span> This is a simulated checkout. PawCare does not connect to real credit card payment processors or physical delivery logistics.
              </div>

              <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                <div>
                  <span className="text-stone-500 block text-[10px]">Total Demo Amount:</span>
                  <span className="font-mono text-base font-bold text-stone-900 tabular-nums">${total.toFixed(2)}</span>
                </div>

                <div className="flex gap-2">
                  <button
                    type="button"
                    onClick={() => setIsCheckingOut(false)}
                    className="px-3.5 py-2 rounded-xl text-stone-600 hover:bg-stone-100"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold shadow-xs flex items-center gap-1.5"
                  >
                    <Check className="w-3.5 h-3.5" />
                    <span>Place Demo Order</span>
                  </button>
                </div>
              </div>
            </form>

          </div>
        </div>
      )}

      {/* CHECKOUT RECEIPT MODAL */}
      {checkoutComplete && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-950/60 backdrop-blur-xs">
          <div className="relative w-full max-w-md bg-white rounded-3xl shadow-2xl border border-stone-200 overflow-hidden p-6 space-y-4 text-center animate-in zoom-in-95 duration-200">
            <div className="w-14 h-14 rounded-full bg-emerald-100 text-emerald-800 flex items-center justify-center mx-auto">
              <Check className="w-8 h-8 stroke-[2.5]" />
            </div>

            <div className="space-y-1">
              <h3 className="text-lg font-bold text-stone-900">
                Order Confirmed!
              </h3>
              <p className="text-xs text-stone-500">
                Demo receipt #PC-ORD-{Date.now().toString().slice(-6)}
              </p>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Supplies scheduled for simulated delivery to <span className="font-semibold text-stone-800">{shippingAddress}</span>.
            </p>

            <button
              onClick={() => {
                setCheckoutComplete(false);
                setIsCheckingOut(false);
                setIsCartOpen(false);
              }}
              className="w-full py-2.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 text-white font-semibold text-xs transition-colors cursor-pointer"
            >
              Continue Shopping
            </button>
          </div>
        </div>
      )}
    </>
  );
};
