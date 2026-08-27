import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function Explore() {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();

  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get('category') || 'All Crafts');
  const [selectedSort, setSelectedSort] = useState('trending');
  const [customizableOnly, setCustomizableOnly] = useState(false);

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
        setProducts(res.data);
      } catch (err) {
        console.error('Failed to load products', err);
      } finally {
        setLoading(false);
      }
    }
    loadProducts();
  }, [selectedCategory, searchQuery, selectedSort, customizableOnly]);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      {/* Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="font-stitch-label text-xs text-secondary tracking-widest">HANDMADE DENIM CATALOG</span>
        <h2 className="font-headline-lg text-3xl md:text-headline-lg text-primary">Explore Artisanal Crafts</h2>
        <p className="font-body-md text-on-surface-variant max-w-xl mt-2">
          Discover shuttle-loom woven raw denim, hand-dyed jackets, and custom heritage garments crafted by master weavers.
        </p>
      </div>

      {/* Filter & Search Bar */}
      <div className="bg-surface-container-low p-6 border border-dashed border-outline-variant rounded mb-10 space-y-6">
        <div className="grid md:grid-cols-4 gap-4 items-center">
          {/* Search Input */}
          <div className="md:col-span-2 relative">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">search</span>
            <input 
              type="text"
              placeholder="Search denim wash, weight, fit or artisan..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm text-primary focus:outline-none focus:border-secondary"
            />
          </div>

          {/* Sort Dropdown */}
          <div>
            <select 
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value)}
              className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm text-primary focus:outline-none focus:border-secondary"
            >
              <option value="trending">Sort: Trending Crafts</option>
              <option value="price_asc">Sort: Price (Low to High)</option>
              <option value="price_desc">Sort: Price (High to Low)</option>
              <option value="newest">Sort: Newest Arrivals</option>
            </select>
          </div>

          {/* Customizable Toggle */}
          <div className="flex items-center space-x-3 cursor-pointer select-none" onClick={() => setCustomizableOnly(!customizableOnly)}>
            <div className={`w-5 h-5 rounded border flex items-center justify-center ${customizableOnly ? 'bg-secondary border-secondary text-white' : 'border-outline'}`}>
              {customizableOnly && <span className="material-symbols-outlined text-xs">check</span>}
            </div>
            <span className="font-label-md text-xs text-primary font-semibold">Customizable Only</span>
          </div>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap gap-2 pt-2 border-t border-dashed border-outline-variant/60">
          {['All Crafts', 'Raw Denim', 'Jackets', 'Custom Fits', 'Accessories'].map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-1.5 rounded-full font-label-md text-xs transition-colors ${
                selectedCategory === cat
                  ? 'bg-secondary text-white font-bold'
                  : 'bg-surface border border-outline-variant text-on-surface-variant hover:bg-surface-container'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      {loading ? (
        <div className="text-center py-20 font-label-md text-on-surface-variant">
          Loading artisanal catalog...
        </div>
      ) : products.length === 0 ? (
        <div className="text-center py-20 bg-surface-container rounded border border-dashed border-outline-variant">
          <span className="material-symbols-outlined text-4xl text-on-surface-variant mb-2">search_off</span>
          <h3 className="font-headline-md text-xl text-primary font-bold">No denim garments found</h3>
          <p className="font-body-md text-sm text-on-surface-variant mt-1">Try adjusting your filters or search terms.</p>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {products.map((product) => (
            <div 
              key={product._id}
              onClick={() => navigate(`/product/${product._id}`)}
              className="bg-surface-container-low border border-primary/10 rounded overflow-hidden group cursor-pointer hover:shadow-xl transition-all"
            >
              <div className="aspect-square bg-surface relative overflow-hidden">
                <img 
                  src={product.images?.[0] || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'} 
                  alt={product.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <LeatherTagBadge text={product.fabric_weight} className="absolute top-4 left-4" />
                
                {product.is_customizable && (
                  <div className="absolute top-4 right-4 bg-primary/90 backdrop-blur text-white px-2 py-1 font-stitch-label text-[10px] rounded">
                    CUSTOMIZABLE
                  </div>
                )}
              </div>

              <div className="p-6 space-y-2">
                <div className="flex justify-between items-center text-xs font-stitch-label text-secondary">
                  <span>{product.category.toUpperCase()}</span>
                  <span>{product.artisan_location || 'Kyoto, Japan'}</span>
                </div>

                <h3 className="font-headline-md text-xl text-primary font-bold group-hover:text-secondary transition-colors">
                  {product.title}
                </h3>

                <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">
                  {product.description}
                </p>

                <div className="pt-4 flex justify-between items-center border-t border-dashed border-outline-variant/40">
                  <span className="font-headline-md text-lg text-primary font-bold">${product.base_price.toFixed(2)}</span>
                  <span className="font-label-md text-xs text-secondary font-bold group-hover:underline flex items-center">
                    View Spec <span className="material-symbols-outlined text-sm ml-1">arrow_forward</span>
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
