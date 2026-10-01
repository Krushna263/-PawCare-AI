import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  ShoppingBag, 
  Star, 
  Plus, 
  Minus, 
  Trash2, 
  ArrowRight, 
  Check, 
  ShieldCheck, 
  Sparkles,
  Package,
  X,
  CreditCard,
  Truck
} from 'lucide-react';

export const PetStoreView: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    updateCartQuantity, 
    removeFromCart, 
    clearCart,
    isCartOpen, 
    setIsCartOpen,
    activePet,
    showToast 
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutComplete, setCheckoutComplete] = useState(false);
  const [shippingAddress, setShippingAddress] = useState('742 Evergreen Terrace, Springfield, OR');

  const categories: (string | ProductCategory)[] = [
    'All',
    'Food',
    'Treats',
    'Toys',
    'Grooming',
    'Beds',
    'Bowls',
    'Leashes',
    'Hygiene',
  ];

  const filteredProducts = products.filter((p) => {
    if (selectedCategory === 'All') return true;
    return p.category === selectedCategory;
  });

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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Curated Wellness Marketplace</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            PawCare Store
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Veterinarian-vetted nutritional staples, durable toys, and hypoallergenic grooming essentials for <span className="font-semibold text-stone-800">{activePet.name}</span>.
          </p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-2xs cursor-pointer self-start sm:self-center"
        >
          <ShoppingBag className="w-4 h-4" />
          <span>Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
          <span className="font-mono text-stone-300 ml-1">· ${subtotal.toFixed(2)}</span>
        </button>
      </div>

      {/* Category Pills (Interactive Filter Controls allowed per Constitution) */}
      <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
        {categories.map((cat) => {
          const isSelected = selectedCategory === cat;
          return (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3.5 py-1.5 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                isSelected
                  ? 'bg-emerald-800 text-white shadow-2xs'
                  : 'bg-white text-stone-600 border border-stone-200 hover:border-stone-300'
              }`}
            >
              {cat}
            </button>
          );
        })}
      </div>

      {/* Product Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {filteredProducts.map((prod) => (
          <div
            key={prod.id}
            className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-700/40 hover:shadow-md transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              
              {/* Product Image with Fallback */}
              <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200/80">
                <ImageWithFallback
                  src={prod.image}
                  alt={prod.name}
                  fallbackText={prod.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {prod.tag && (
                  <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/80 backdrop-blur-md text-white text-[10px] font-semibold">
                    {prod.tag}
                  </div>
                )}
              </div>

              {/* Product Info */}
              <div className="space-y-1">
                <div className="flex items-center justify-between text-[11px] text-stone-500">
                  <span>{prod.category}</span>
                  <div className="flex items-center gap-1 font-semibold text-amber-700">
                    <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                    <span>{prod.rating}</span>
                    <span className="text-stone-400 font-normal">({prod.reviewCount})</span>
                  </div>
                </div>

                <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-900 transition-colors">
                  {prod.name}
                </h3>

                <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                  {prod.shortDescription}
                </p>
              </div>

            </div>

            {/* Price & Add to Cart */}
            <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
              <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                ${prod.price.toFixed(2)}
              </div>

              <button
                onClick={() => addToCart(prod, 1)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 text-emerald-900 text-xs font-semibold transition-colors cursor-pointer border border-emerald-200/80"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add to Cart</span>
              </button>
            </div>

          </div>
        ))}
      </div>

    </div>
  );
};
