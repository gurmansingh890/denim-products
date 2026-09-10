import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

const MOCK_EXPLORE_PRODUCTS = [
  {
    _id: 'bag-1',
    title: 'Kyoto Selvedge Heavy Tote Bag',
    category: 'Handcrafted Bags',
    base_price: 185.0,
    fabric_weight: '18oz SELVEDGE + LEATHER',
    artisan_location: 'Kyoto, Japan',
    description: 'Hand-cut 18oz selvedge denim tote with full-grain vegetable tanned leather handles and copper rivets.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'bag-2',
    title: 'Okayama Boro Patchwork Duffle Bag',
    category: 'Handcrafted Bags',
    base_price: 295.0,
    fabric_weight: '16oz BORO SASHIKO',
    artisan_location: 'Okayama, Japan',
    description: 'Sashiko hand-stitched denim duffle bag with antique brass YKK hardware and reinforced leather base.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'bag-3',
    title: 'Kurashiki Roll-Top Denim Backpack',
    category: 'Handcrafted Bags',
    base_price: 240.0,
    fabric_weight: '15oz WATER-RESISTANT',
    artisan_location: 'Kurashiki, Japan',
    description: 'Rugged roll-top indigo denim backpack with padded leather shoulder straps and laptop compartment.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'bag-4',
    title: 'Osaka Crossbody Indigo Messenger Bag',
    category: 'Handcrafted Bags',
    base_price: 155.0,
    fabric_weight: '14.5oz SLUB DENIM',
    artisan_location: 'Osaka, Japan',
    description: 'Adjustable cotton webbing strap with magnetic brass clasp and heritage leather patch.',
    is_customizable: false,
    images: ['https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'p1',
    title: 'Kyoto Shuttle 18oz Heavy Selvedge',
    category: 'Raw Selvedge Denim',
    base_price: 240.0,
    fabric_weight: '18oz SELVEDGE',
    artisan_location: 'Kyoto, Japan',
    description: 'Woven on vintage shuttle looms using 100% natural indigo rope-dyed yarn.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'p2',
    title: 'Natural Indigo Kakishibu Trucker Jacket',
    category: 'Artisanal Jackets',
    base_price: 320.0,
    fabric_weight: '15.5oz TWILL',
    artisan_location: 'Okayama, Japan',
    description: 'Persimmon tannin (Kakishibu) over-dyed indigo trucker jacket with copper hardware.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'p3',
    title: 'Osaka Hand-Dye Slub Tapered Fit',
    category: 'Raw Selvedge Denim',
    base_price: 280.0,
    fabric_weight: '16oz SLUB',
    artisan_location: 'Osaka, Japan',
    description: 'Ultra-textured slub yarn creating intense vertical fade lines over time.',
    is_customizable: true,
    images: ['https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80'],
  },
  {
    _id: 'p4',
    title: 'Artisan Loom Master Indigo Apron',
    category: 'Accessories & Aprons',
    base_price: 110.0,
    fabric_weight: '12oz RAW CANVAS',
    artisan_location: 'Kurashiki, Japan',
    description: 'Cross-back leather straps, utility chest pockets, brass towel ring, hand-cut raw selvedge edge.',
    is_customizable: false,
    images: ['https://images.unsplash.com/photo-1542272604-780c96856592?w=800&auto=format&fit=crop&q=80'],
  },
];

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState(MOCK_EXPLORE_PRODUCTS);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Crafts');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [customizableOnly, setCustomizableOnly] = useState(false);

  useEffect(() => {
    const categoryParam = searchParams.get('category');
    if (categoryParam) {
      setSelectedCategory(categoryParam);
    }
  }, [searchParams]);

  useEffect(() => {
    async function loadProducts() {
      setLoading(true);
      try {
        const params = {};
        if (selectedCategory && selectedCategory !== 'All Crafts') params.category = selectedCategory;
        if (searchQuery) params.search = searchQuery;
        if (selectedSort) params.sort = selectedSort;
        if (customizableOnly) params.is_customizable = true;

        const res = await api.get('/products/', { params });
        if (Array.isArray(res.data) && res.data.length > 0) {
          setProducts(res.data);
        } else {
          setProducts(filterMockProducts(selectedCategory, searchQuery, customizableOnly));
        }
      } catch (err) {
        console.warn('Failed to load products from API, filtering artisanal catalog:', err);
        setProducts(filterMockProducts(selectedCategory, searchQuery, customizableOnly));
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery, selectedSort, customizableOnly]);

  function filterMockProducts(cat, search, customOnly) {
    return MOCK_EXPLORE_PRODUCTS.filter(item => {
      const matchCat = cat === 'All Crafts' || !cat || item.category.toLowerCase().includes(cat.toLowerCase());
      const matchSearch = !search || item.title.toLowerCase().includes(search.toLowerCase()) || item.description.toLowerCase().includes(search.toLowerCase());
      const matchCustom = !customOnly || item.is_customizable;
      return matchCat && matchSearch && matchCustom;
    });
  }

  const displayList = Array.isArray(products) ? products : MOCK_EXPLORE_PRODUCTS;

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 text-secondary mb-1">
          <span className="copper-rivet" />
          <span className="font-stitch-label text-xs uppercase tracking-widest">HANDMADE DENIM & BAG CATALOG</span>
        </div>
        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Explore Handcrafted Products</h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl mt-1">
          Discover shuttle-loom woven raw selvedge jeans, heavy indigo tote bags, duffle bags, and custom heritage outerwear.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-low p-6 border border-dashed border-outline-variant rounded-lg mb-10 space-y-6 shadow-sm">
        <div className="grid md:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3.5 top-1/2 -translate-y-1/2 text-on-surface-variant text-lg">search</span>
            <input 
              type="text"
              placeholder="Search bags, totes, jeans, jackets, or artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 bg-surface border border-outline-variant rounded font-label-md text-xs text-primary focus:outline-none focus:border-secondary transition-colors"
            />
          </div>

          {/* Sort Dropdown */}
          <div>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-3 bg-surface border border-outline-variant rounded font-label-md text-xs text-primary focus:outline-none focus:border-secondary cursor-pointer"
            >
              <option value="trending">Sort: Trending Crafts</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
              <option value="newest">Sort: Newest Arrivals</option>
            </select>
          </div>

          {/* Customizable Toggle */}
          <div className="flex items-center space-x-3 cursor-pointer select-none bg-surface p-2.5 rounded border border-outline-variant/60 hover:border-secondary transition-colors" onClick={() => setCustomizableOnly(!customizableOnly)}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${customizableOnly ? 'bg-secondary border-secondary text-white' : 'border-outline'}`}>
              {customizableOnly && <span className="material-symbols-outlined text-xs">check</span>}
            </div>
            <span className="font-label-md text-xs text-primary font-bold">Customizable Specs Only</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-3 border-t border-dashed border-outline-variant/60">
          {[
            { label: 'All Crafts', val: 'All Crafts' },
            { label: '👜 Handcrafted Bags', val: 'Handcrafted Bags' },
            { label: '👖 Raw Selvedge Denim', val: 'Raw Selvedge Denim' },
            { label: '🧥 Artisanal Jackets', val: 'Artisanal Jackets' },
            { label: '🎽 Accessories & Aprons', val: 'Accessories & Aprons' },
          ].map((cat) => (
            <button
              key={cat.val}
              onClick={() => setSelectedCategory(cat.val)}
              className={`px-5 py-2 rounded-full font-label-md text-xs transition-all ${
                selectedCategory === cat.val
                  ? 'bg-secondary text-white font-bold shadow-sm scale-105'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading && displayList.length === 0 ? (
        <div className="text-center py-20 font-label-md text-on-surface-variant">
          Loading artisanal catalog...
        </div>
      ) : displayList.length === 0 ? (
        <div className="text-center py-20 bg-surface-container rounded border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
          <h3 className="font-headline-md text-xl text-primary font-bold">No artisanal products found</h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayList.map((product) => (
            <div 
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-surface-container-lowest border border-primary/10 rounded-lg overflow-hidden group cursor-pointer craft-card"
            >
              <div className="aspect-[4/3] bg-surface relative overflow-hidden">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <LeatherTagBadge text={product.fabric_weight || '18oz SELVEDGE'} className="absolute top-3 left-3" />
                
                {product.is_customizable && (
                  <div className="absolute top-3 right-3 bg-primary/90 backdrop-blur text-white px-2.5 py-1 font-stitch-label text-[10px] rounded font-bold">
                    CUSTOMIZABLE
                  </div>
                )}
              </div>

              <div className="p-6 space-y-3">
                <div className="flex justify-between items-center text-[10px] font-stitch-label text-secondary font-bold">
                  <span>{(product.category || 'DENIM CRAFT').toUpperCase()}</span>
                  <span>{product.artisan_location || 'Kyoto, Japan'}</span>
                </div>

                <h3 className="font-headline-md text-xl text-primary font-bold group-hover:text-secondary transition-colors line-clamp-1">
                  {product.title}
                </h3>

                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-4 flex justify-between items-center border-t border-dashed border-outline-variant/40">
                  <span className="font-headline-md text-xl text-primary font-bold">
                    ${typeof product.base_price === 'number' ? product.base_price.toFixed(2) : '185.00'}
                  </span>
                  <span className="font-label-md text-xs text-secondary font-bold group-hover:underline flex items-center">
                    Inspect Spec <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
