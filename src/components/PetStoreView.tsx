import React, { useState, useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { Product, ProductCategory, AnimalType } from '../types';
import { ImageWithFallback } from './common/ImageWithFallback';
import { 
  ShoppingBag, 
  Star, 
  Plus, 
  Check, 
  Sparkles,
  Search,
  X,
  Smile,
  ShieldCheck,
  Droplets,
  Heart
} from 'lucide-react';

export const PetStoreView: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    setIsCartOpen,
    activePet,
  } = useApp();

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpecies, setSelectedSpecies] = useState<'All' | AnimalType>('All');
  const [searchQuery, setSearchQuery] = useState('');

  const categories: (string | ProductCategory)[] = [
    'All',
    'Toys',
    'Skincare',
    'Hygiene',
    'Grooming',
    'Food',
    'Treats',
    'Beds',
    'Bowls',
    'Leashes',
  ];

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Category filter
      if (selectedCategory !== 'All' && p.category !== selectedCategory) {
        return false;
      }

      // Species filter
      if (selectedSpecies !== 'All' && !p.forSpecies.includes(selectedSpecies)) {
        return false;
      }

      // Search query
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchesName = p.name.toLowerCase().includes(q);
        const matchesDesc = p.shortDescription.toLowerCase().includes(q);
        const matchesCategory = p.category.toLowerCase().includes(q);
        const matchesBrand = p.brand?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesBrand) {
          return false;
        }
      }

      return true;
    });
  }, [products, selectedCategory, selectedSpecies, searchQuery]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
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
            Durable interactive toys, clinical skincare remedies, and veterinary hygiene essentials for <span className="font-semibold text-stone-800">{activePet.name}</span>.
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

      {/* Featured Department Badges (Toys, Skincare, Hygiene) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <button
          onClick={() => setSelectedCategory('Toys')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
            selectedCategory === 'Toys'
              ? 'bg-amber-50/90 border-amber-600 shadow-xs ring-1 ring-amber-500'
              : 'bg-white/80 border-stone-200 hover:bg-white hover:border-amber-400'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-amber-100 text-amber-900 flex items-center justify-center shrink-0">
            <Smile className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <span>Interactive Toys</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-amber-200/80 text-amber-950 font-semibold">New</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">Durable chews, brain teasers, and feather lures</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedCategory('Skincare')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
            selectedCategory === 'Skincare'
              ? 'bg-emerald-50/90 border-emerald-600 shadow-xs ring-1 ring-emerald-500'
              : 'bg-white/80 border-stone-200 hover:bg-white hover:border-emerald-400'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-emerald-100 text-emerald-900 flex items-center justify-center shrink-0">
            <Droplets className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <span>Clinical Skincare</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-emerald-200/80 text-emerald-950 font-semibold">Vet Choice</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">Paw balms, oatmeal sprays & wound hydrogels</p>
          </div>
        </button>

        <button
          onClick={() => setSelectedCategory('Hygiene')}
          className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex items-center gap-3.5 ${
            selectedCategory === 'Hygiene'
              ? 'bg-teal-50/90 border-teal-600 shadow-xs ring-1 ring-teal-500'
              : 'bg-white/80 border-stone-200 hover:bg-white hover:border-teal-400'
          }`}
        >
          <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-900 flex items-center justify-center shrink-0">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <div className="text-xs font-bold text-stone-900 flex items-center gap-1.5">
              <span>Hygiene & Oral Care</span>
              <span className="text-[10px] px-1.5 py-0.2 rounded bg-teal-200/80 text-teal-950 font-semibold">Essential</span>
            </div>
            <p className="text-[11px] text-stone-600 mt-0.5">Water additives, ear solutions & tear wipes</p>
          </div>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 rounded-2xl bg-white/70 backdrop-blur-xl border border-stone-200/80 shadow-2xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search toys, paw balms, dental hygiene, ear cleaners..."
              className="w-full pl-9 pr-8 py-2 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 outline-none focus:border-emerald-700"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Species Pills */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-stone-500 mr-1 shrink-0">For:</span>
            {(['All', 'Dog', 'Cat', 'Rabbit', 'Bird'] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSpecies(sp)}
                className={`px-2.5 py-1 rounded-lg text-xs font-medium transition-all shrink-0 cursor-pointer ${
                  selectedSpecies === sp
                    ? 'bg-stone-900 text-white'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {sp === 'All' ? 'All Pets' : sp}
              </button>
            ))}
          </div>

        </div>

        {/* Category Filter Pills */}
        <div className="flex items-center gap-2 overflow-x-auto pt-1 scrollbar-none border-t border-stone-100">
          {categories.map((cat) => {
            const isSelected = selectedCategory === cat;
            return (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
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
      </div>

      {/* Product Cards Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-12 p-6 rounded-3xl bg-white border border-stone-200 text-stone-500 space-y-2">
          <p className="text-sm font-semibold text-stone-800">No products found matching your search</p>
          <p className="text-xs text-stone-500">Try clearing your search term or switching to "All" categories.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedSpecies('All');
              setSearchQuery('');
            }}
            className="px-3.5 py-1.5 rounded-xl bg-emerald-800 text-white text-xs font-medium hover:bg-emerald-900"
          >
            Reset Filters
          </button>
        </div>
      ) : (
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
                  {prod.brand && (
                    <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-md bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold">
                      {prod.brand}
                    </div>
                  )}
                </div>

                {/* Product Info */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-stone-500">
                    <span className="font-semibold text-emerald-800 uppercase tracking-wider text-[10px]">
                      {prod.category}
                    </span>
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
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 hover:bg-emerald-100 active:scale-95 text-emerald-900 text-xs font-semibold transition-all cursor-pointer border border-emerald-200/80"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add to Cart</span>
                </button>
              </div>

            </div>
          ))}
        </div>
      )}

    </div>
  );
};

