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
  Heart,
  Crown,
  Gem,
  Tag,
  Eye,
  SlidersHorizontal,
  ArrowRight,
  Info,
  Layers,
  Ruler
} from 'lucide-react';

export const PetStoreView: React.FC = () => {
  const { 
    products, 
    cart, 
    addToCart, 
    setIsCartOpen,
    activePet,
    showToast
  } = useApp();

  // Primary store department mode
  const [activeDepartment, setActiveDepartment] = useState<'all' | 'accessories' | 'fashion' | 'wellness' | 'toys'>('all');
  const [selectedSubCategory, setSelectedSubCategory] = useState<string>('All');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedSpecies, setSelectedSpecies] = useState<'All' | AnimalType>('All');
  const [searchQuery, setSearchQuery] = useState('');
  
  // Selected options per product (size & color)
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({});
  const [selectedColors, setSelectedColors] = useState<Record<string, string>>({});
  
  // Quick View Modal
  const [quickViewProduct, setQuickViewProduct] = useState<Product | null>(null);

  // Sub-categories mapped to department
  const accessorySubCategories = [
    'All',
    'Collars & Chokers',
    'Harnesses',
    'Tags & Charms',
    'Travel & Carriers',
    'Bows & Bandanas',
    'Eyewear & Sun',
    'Tech & Safety'
  ];

  const fashionSubCategories = [
    'All',
    'Knitwear & Sweaters',
    'Rainwear & Weather',
    'Jackets & Coats',
    'Formal & Occasion',
    'Summer & Active',
    'Footwear & Boots',
    'Hoodies & Casual'
  ];

  const generalCategories: (string | ProductCategory)[] = [
    'All',
    'Accessories',
    'Fashion',
    'Toys',
    'Skincare',
    'Hygiene',
    'Grooming',
    'Beds',
    'Bowls',
    'Leashes',
    'Food',
    'Treats',
  ];

  // Set department and sync category filter
  const handleDepartmentSwitch = (dept: 'all' | 'accessories' | 'fashion' | 'wellness' | 'toys') => {
    setActiveDepartment(dept);
    setSelectedSubCategory('All');
    if (dept === 'accessories') {
      setSelectedCategory('Accessories');
    } else if (dept === 'fashion') {
      setSelectedCategory('Fashion');
    } else if (dept === 'toys') {
      setSelectedCategory('Toys');
    } else if (dept === 'wellness') {
      setSelectedCategory('Skincare');
    } else {
      setSelectedCategory('All');
    }
  };

  const filteredProducts = useMemo(() => {
    return products.filter((p) => {
      // Department / Category filter
      if (activeDepartment === 'accessories') {
        if (p.category !== 'Accessories') return false;
        if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) return false;
      } else if (activeDepartment === 'fashion') {
        if (p.category !== 'Fashion') return false;
        if (selectedSubCategory !== 'All' && p.subCategory !== selectedSubCategory) return false;
      } else if (activeDepartment === 'toys') {
        if (p.category !== 'Toys') return false;
      } else if (activeDepartment === 'wellness') {
        if (p.category !== 'Skincare' && p.category !== 'Hygiene' && p.category !== 'Grooming') return false;
      } else if (selectedCategory !== 'All' && p.category !== selectedCategory) {
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
        const matchesSub = p.subCategory?.toLowerCase().includes(q);
        const matchesMaterial = p.material?.toLowerCase().includes(q);
        if (!matchesName && !matchesDesc && !matchesCategory && !matchesBrand && !matchesSub && !matchesMaterial) {
          return false;
        }
      }

      return true;
    });
  }, [products, activeDepartment, selectedCategory, selectedSubCategory, selectedSpecies, searchQuery]);

  // Cart Calculations
  const subtotal = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);

  const handleAddToCartWithOptions = (product: Product) => {
    const chosenSize = selectedSizes[product.id] || (product.sizes && product.sizes[0]);
    const chosenColor = selectedColors[product.id] || (product.colors && product.colors[0]);

    // Build enriched product instance if size/color picked
    const enrichedProduct: Product = {
      ...product,
      name: chosenSize || chosenColor 
        ? `${product.name} (${[chosenSize, chosenColor].filter(Boolean).join(' · ')})`
        : product.name,
    };

    addToCart(enrichedProduct, 1);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8 animate-in fade-in duration-300">
      
      {/* 1. Header & Cart Status */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-stone-200/80 pb-6">
        <div>
          <div className="flex items-center gap-2 text-xs font-semibold text-emerald-800 uppercase tracking-wider mb-1">
            <ShoppingBag className="w-3.5 h-3.5" />
            <span>Curated Lifestyle, Accessories & Apparel</span>
            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-900 text-[10px] font-bold border border-emerald-200">
              ✦ AI Fit Matcher
            </span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-900">
            PawCare Boutique & Store
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Handcrafted leather accessories, haute couture apparel, and veterinary care essentials tailored for <span className="font-semibold text-stone-800">{activePet.name} ({activePet.breed})</span>.
          </p>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setIsCartOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-stone-900 hover:bg-stone-800 active:scale-95 text-white text-xs font-semibold transition-all shadow-md cursor-pointer self-start sm:self-center"
        >
          <ShoppingBag className="w-4 h-4 text-emerald-400" />
          <span>Cart ({cart.reduce((sum, i) => sum + i.quantity, 0)})</span>
          <span className="font-mono text-stone-300 ml-1">· ${subtotal.toFixed(2)}</span>
        </button>
      </div>

      {/* 2. Primary Department Mode Switcher */}
      <div className="p-1.5 rounded-2xl bg-stone-100/90 border border-stone-200/90 flex flex-wrap items-center gap-1 shadow-inner">
        <button
          onClick={() => handleDepartmentSwitch('all')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeDepartment === 'all'
              ? 'bg-white text-stone-900 shadow-xs ring-1 ring-stone-900/5'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>All Store Catalog</span>
        </button>

        <button
          onClick={() => handleDepartmentSwitch('accessories')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeDepartment === 'accessories'
              ? 'bg-amber-900 text-amber-200 shadow-xs ring-1 ring-amber-700'
              : 'text-stone-700 hover:text-amber-900'
          }`}
        >
          <Gem className="w-3.5 h-3.5 text-amber-400" />
          <span>Accessories Boutique</span>
          <span className="px-1.5 py-0.2 rounded-full bg-amber-400/20 text-amber-300 text-[10px] font-bold">New</span>
        </button>

        <button
          onClick={() => handleDepartmentSwitch('fashion')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeDepartment === 'fashion'
              ? 'bg-emerald-950 text-emerald-200 shadow-xs ring-1 ring-emerald-800'
              : 'text-stone-700 hover:text-emerald-900'
          }`}
        >
          <Crown className="w-3.5 h-3.5 text-emerald-300" />
          <span>Fashion & Apparel Studio</span>
          <span className="px-1.5 py-0.2 rounded-full bg-emerald-400/20 text-emerald-300 text-[10px] font-bold">Haute Couture</span>
        </button>

        <button
          onClick={() => handleDepartmentSwitch('toys')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeDepartment === 'toys'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Smile className="w-3.5 h-3.5" />
          <span>Toys & Play</span>
        </button>

        <button
          onClick={() => handleDepartmentSwitch('wellness')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-2 ${
            activeDepartment === 'wellness'
              ? 'bg-white text-stone-900 shadow-xs'
              : 'text-stone-600 hover:text-stone-900'
          }`}
        >
          <Droplets className="w-3.5 h-3.5" />
          <span>Skincare & Hygiene</span>
        </button>
      </div>

      {/* 3. Editorial Spotlight Banners (When in Accessories or Fashion) */}
      {activeDepartment === 'accessories' && (
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-stone-900 via-stone-850 to-amber-950 text-white shadow-xl border border-amber-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/30 text-amber-300 text-xs font-semibold">
              <Gem className="w-3.5 h-3.5 text-amber-400" />
              <span>Artisan Leather Atelier & Solid Brass Hardware</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Bespoke Pet Accessories Boutique
            </h2>
            <p className="text-amber-100/80 text-xs sm:text-sm leading-relaxed">
              Hand-finished vegetable-tanned Tuscan leathers, custom laser-engraved brass identification tags, velvet step-in harnesses, and TSA-compliant travel carriers crafted for lifelong durability.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-amber-200/90 font-medium">
              <span>✦ Custom Laser Name Engraving</span>
              <span>✦ Solid Rust-Proof Brass</span>
              <span>✦ Lifetime Hardware Guarantee</span>
            </div>
          </div>
        </div>
      )}

      {activeDepartment === 'fashion' && (
        <div className="relative rounded-3xl overflow-hidden p-6 sm:p-8 bg-gradient-to-r from-emerald-950 via-teal-950 to-stone-950 text-white shadow-xl border border-emerald-500/20">
          <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/15 rounded-full blur-3xl pointer-events-none" />
          <div className="relative z-10 max-w-2xl space-y-2.5">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/30 text-emerald-300 text-xs font-semibold">
              <Crown className="w-3.5 h-3.5 text-emerald-400" />
              <span>Haute Couture · Weather-Proof & Seasonal Knits</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
              Pet Fashion & Runway Apparel Studio
            </h2>
            <p className="text-emerald-100/80 text-xs sm:text-sm leading-relaxed">
              Keep your companion comfortable through every season with chunky merino wool sweaters, stormproof reflective raincoats, winter fleece puffers, black-tie wedding tuxedos, and heat-protective paw boots.
            </p>
            <div className="pt-2 flex items-center gap-4 text-xs text-emerald-200/90 font-medium">
              <span>✦ Multi-size Comfort Range (XS to 2XL)</span>
              <span>✦ Leash & Harness Access Ports</span>
              <span>✦ Machine Washable</span>
            </div>
          </div>
        </div>
      )}

      {/* 4. Filter & Search Controls */}
      <div className="p-4 rounded-3xl bg-white/75 backdrop-blur-xl border border-stone-200/80 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
          
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder={
                activeDepartment === 'accessories'
                  ? 'Search leather collars, brass tags, velvet harnesses, carriers...'
                  : activeDepartment === 'fashion'
                  ? 'Search pet sweaters, raincoats, puffers, tuxedos, boots...'
                  : 'Search by product name, brand, material, or category...'
              }
              className="w-full pl-9 pr-8 py-2.5 rounded-xl bg-white border border-stone-200 text-xs text-stone-900 outline-none focus:border-emerald-700 transition-colors shadow-2xs"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Species Target Filter */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 sm:pb-0 scrollbar-none">
            <span className="text-[11px] font-semibold text-stone-500 mr-1 shrink-0">Species:</span>
            {(['All', 'Dog', 'Cat', 'Rabbit'] as const).map((sp) => (
              <button
                key={sp}
                onClick={() => setSelectedSpecies(sp)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all shrink-0 cursor-pointer ${
                  selectedSpecies === sp
                    ? 'bg-stone-900 text-white shadow-2xs'
                    : 'bg-white text-stone-600 border border-stone-200 hover:bg-stone-50'
                }`}
              >
                {sp === 'All' ? 'All Pets' : sp}
              </button>
            ))}
          </div>

        </div>

        {/* Dynamic Sub-Category Filter Chips */}
        {activeDepartment === 'accessories' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-stone-100">
            <span className="text-[11px] font-semibold text-stone-400 shrink-0">Boutique:</span>
            {accessorySubCategories.map((sub) => {
              const isSelected = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-amber-900 text-amber-200 shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-amber-400'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {activeDepartment === 'fashion' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-stone-100">
            <span className="text-[11px] font-semibold text-stone-400 shrink-0">Apparel:</span>
            {fashionSubCategories.map((sub) => {
              const isSelected = selectedSubCategory === sub;
              return (
                <button
                  key={sub}
                  onClick={() => setSelectedSubCategory(sub)}
                  className={`px-3 py-1 rounded-full text-xs font-semibold shrink-0 transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-emerald-950 text-emerald-200 shadow-2xs'
                      : 'bg-white text-stone-600 border border-stone-200 hover:border-emerald-500'
                  }`}
                >
                  {sub}
                </button>
              );
            })}
          </div>
        )}

        {activeDepartment === 'all' && (
          <div className="flex items-center gap-2 overflow-x-auto pt-2 scrollbar-none border-t border-stone-100">
            {generalCategories.map((cat) => {
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
                  {cat === 'Accessories' ? '💎 Accessories' : cat === 'Fashion' ? '👗 Fashion' : cat}
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 5. Product Grid */}
      {filteredProducts.length === 0 ? (
        <div className="text-center py-16 p-8 rounded-3xl bg-white border border-stone-200 text-stone-500 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-stone-100 text-stone-400 flex items-center justify-center mx-auto">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <p className="text-base font-bold text-stone-900">No items found in this section</p>
          <p className="text-xs text-stone-500 max-w-sm mx-auto">
            Try adjusting your search keywords, clearing sub-category filters, or switching departments.
          </p>
          <button
            onClick={() => {
              setActiveDepartment('all');
              setSelectedCategory('All');
              setSelectedSubCategory('All');
              setSelectedSpecies('All');
              setSearchQuery('');
            }}
            className="px-4 py-2 rounded-xl bg-emerald-800 text-white text-xs font-semibold hover:bg-emerald-900 cursor-pointer transition-colors"
          >
            Reset All Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {filteredProducts.map((prod) => {
            const currentSize = selectedSizes[prod.id] || (prod.sizes && prod.sizes[0]);
            const currentColor = selectedColors[prod.id] || (prod.colors && prod.colors[0]);

            return (
              <div
                key={prod.id}
                className="p-5 rounded-3xl bg-white border border-stone-200/80 shadow-xs hover:border-emerald-600/40 hover:shadow-lg transition-all flex flex-col justify-between group"
              >
                <div className="space-y-3.5">
                  
                  {/* Real Image Card with Quick View Trigger */}
                  <div className="relative rounded-2xl overflow-hidden aspect-4/3 bg-stone-100 border border-stone-200/80 group">
                    <ImageWithFallback
                      src={prod.image}
                      alt={prod.name}
                      fallbackText={prod.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />

                    {/* Tag badge */}
                    {prod.tag && (
                      <div className="absolute top-2.5 left-2.5 px-2.5 py-0.5 rounded-full bg-stone-900/85 backdrop-blur-md text-white text-[10px] font-semibold tracking-wide">
                        {prod.tag}
                      </div>
                    )}

                    {/* Brand badge */}
                    {prod.brand && (
                      <div className="absolute bottom-2.5 right-2.5 px-2 py-0.5 rounded-lg bg-white/90 backdrop-blur-md text-stone-800 text-[10px] font-bold shadow-2xs">
                        {prod.brand}
                      </div>
                    )}

                    {/* Quick View Button on Hover */}
                    <button
                      onClick={() => setQuickViewProduct(prod)}
                      className="absolute inset-0 bg-stone-900/40 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-1.5 text-white text-xs font-bold cursor-pointer"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Quick View</span>
                    </button>
                  </div>

                  {/* Product Details */}
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[11px] text-stone-500">
                      <span className={`font-semibold uppercase tracking-wider text-[10px] ${
                        prod.category === 'Accessories' ? 'text-amber-700' : prod.category === 'Fashion' ? 'text-emerald-700' : 'text-stone-500'
                      }`}>
                        {prod.category} {prod.subCategory && `· ${prod.subCategory}`}
                      </span>
                      <div className="flex items-center gap-1 font-semibold text-amber-700">
                        <Star className="w-3 h-3 fill-amber-500 stroke-amber-500" />
                        <span>{prod.rating}</span>
                        <span className="text-stone-400 font-normal">({prod.reviewCount})</span>
                      </div>
                    </div>

                    <h3 className="text-sm font-bold text-stone-900 line-clamp-1 group-hover:text-emerald-800 transition-colors">
                      {prod.name}
                    </h3>

                    <p className="text-xs text-stone-600 line-clamp-2 leading-relaxed">
                      {prod.shortDescription}
                    </p>

                    {/* Material Tag */}
                    {prod.material && (
                      <div className="pt-1 flex items-center gap-1 text-[11px] text-stone-500">
                        <Tag className="w-3 h-3 text-stone-400" />
                        <span className="truncate">{prod.material}</span>
                      </div>
                    )}

                    {/* Size Selector Chips if available */}
                    {prod.sizes && prod.sizes.length > 0 && (
                      <div className="pt-1.5 space-y-1">
                        <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-wider">Size:</span>
                        <div className="flex flex-wrap gap-1">
                          {prod.sizes.map((sz) => (
                            <button
                              key={sz}
                              onClick={() => setSelectedSizes(prev => ({ ...prev, [prod.id]: sz }))}
                              className={`px-2 py-0.5 rounded-md text-[10px] font-bold transition-all cursor-pointer ${
                                currentSize === sz
                                  ? 'bg-stone-900 text-white shadow-2xs'
                                  : 'bg-stone-100 text-stone-600 hover:bg-stone-200'
                              }`}
                            >
                              {sz}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Color Swatches if available */}
                    {prod.colors && prod.colors.length > 0 && (
                      <div className="pt-1 flex items-center gap-1.5 text-[11px] text-stone-500">
                        <span className="text-[10px] font-semibold text-stone-400">Color:</span>
                        <span className="font-medium text-stone-700 truncate">{currentColor}</span>
                      </div>
                    )}

                  </div>

                </div>

                {/* Price & Add to Cart Action */}
                <div className="pt-4 mt-3 border-t border-stone-100 flex items-center justify-between gap-2">
                  <div className="font-mono text-base font-bold text-stone-900 tabular-nums">
                    ${prod.price.toFixed(2)}
                  </div>

                  <button
                    onClick={() => handleAddToCartWithOptions(prod)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white text-xs font-semibold transition-all cursor-pointer shadow-2xs"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 6. Quick View Modal */}
      {quickViewProduct && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="bg-white rounded-3xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl border border-stone-200/80 space-y-6 relative max-h-[90vh] overflow-y-auto">
            
            <button
              onClick={() => setQuickViewProduct(null)}
              className="absolute top-5 right-5 p-2 rounded-full hover:bg-stone-100 text-stone-500 hover:text-stone-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
              
              {/* Product Large Real Image */}
              <div className="relative rounded-2xl overflow-hidden aspect-square bg-stone-100 border border-stone-200">
                <ImageWithFallback
                  src={quickViewProduct.image}
                  alt={quickViewProduct.name}
                  fallbackText={quickViewProduct.name}
                  className="w-full h-full object-cover"
                />
                {quickViewProduct.tag && (
                  <span className="absolute top-3 left-3 px-3 py-1 rounded-full bg-stone-900 text-white text-xs font-bold">
                    {quickViewProduct.tag}
                  </span>
                )}
              </div>

              {/* Product Full Details */}
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-xs text-stone-500 mb-1">
                    <span className="font-bold text-emerald-800 uppercase tracking-wider">
                      {quickViewProduct.category} · {quickViewProduct.subCategory || 'Essentials'}
                    </span>
                    <div className="flex items-center gap-1 font-semibold text-amber-700">
                      <Star className="w-3.5 h-3.5 fill-amber-500 stroke-amber-500" />
                      <span>{quickViewProduct.rating}</span>
                      <span className="text-stone-400">({quickViewProduct.reviewCount})</span>
                    </div>
                  </div>
                  <h2 className="text-xl font-bold text-stone-900">
                    {quickViewProduct.name}
                  </h2>
                  {quickViewProduct.brand && (
                    <p className="text-xs text-stone-500 font-medium">By {quickViewProduct.brand}</p>
                  )}
                </div>

                <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                  {quickViewProduct.shortDescription}
                </p>

                {quickViewProduct.material && (
                  <div className="p-3 rounded-xl bg-stone-50 border border-stone-200/80 text-xs text-stone-700 space-y-1">
                    <div className="font-bold text-stone-900 flex items-center gap-1.5">
                      <Tag className="w-3.5 h-3.5 text-stone-500" />
                      <span>Materials & Craftsmanship</span>
                    </div>
                    <p className="text-stone-600">{quickViewProduct.material}</p>
                  </div>
                )}

                {/* Fit Guide for Active Pet */}
                <div className="p-3 rounded-xl bg-emerald-50/80 border border-emerald-200/80 text-xs text-emerald-900 flex items-center gap-2">
                  <Ruler className="w-4 h-4 text-emerald-700 shrink-0" />
                  <span>
                    Fit calibrated for <strong>{activePet.name}</strong> ({activePet.weight} kg {activePet.breed}).
                  </span>
                </div>

                <div className="pt-2 flex items-center justify-between">
                  <div className="font-mono text-2xl font-extrabold text-stone-900">
                    ${quickViewProduct.price.toFixed(2)}
                  </div>

                  <button
                    onClick={() => {
                      handleAddToCartWithOptions(quickViewProduct);
                      setQuickViewProduct(null);
                    }}
                    className="px-6 py-3 rounded-2xl bg-emerald-800 hover:bg-emerald-900 active:scale-95 text-white font-bold text-xs shadow-md transition-all flex items-center gap-2 cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add to Cart</span>
                  </button>
                </div>

              </div>

            </div>

          </div>
        </div>
      )}

    </div>
  );
};
