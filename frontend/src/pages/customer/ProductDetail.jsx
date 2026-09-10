import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';
import ArtisanProfileSnippet from '../../components/ArtisanProfileSnippet';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

const CATALOG_ITEMS = {
  'bag-1': {
    _id: 'bag-1',
    title: 'Kyoto Selvedge Heavy Tote Bag',
    category: 'Handcrafted Bags',
    base_price: 185.0,
    fabric_weight: '18oz SELVEDGE + LEATHER',
    artisan_location: 'Kyoto, Japan',
    business_name: 'Kenji Matsui Studio',
    description: 'Hand-cut 18oz selvedge denim tote bag featuring full-grain vegetable-tanned leather handles, solid copper rivets, double-stitched indigo canvas lining, and a dedicated padded 15" laptop compartment.',
    is_customizable: true,
    images: [
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'bag-2': {
    _id: 'bag-2',
    title: 'Okayama Boro Patchwork Duffle Bag',
    category: 'Handcrafted Bags',
    base_price: 295.0,
    fabric_weight: '16oz BORO SASHIKO',
    artisan_location: 'Okayama, Japan',
    business_name: 'Hiroshi Tanaka Workshop',
    description: 'Artisanal travel duffle bag created from hand-selected Indigo Sashiko boro patches. Reinforced with full-grain leather base, heavy antique brass YKK zipper, and detachable shoulder strap.',
    is_customizable: true,
    images: [
      'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'bag-3': {
    _id: 'bag-3',
    title: 'Kurashiki Roll-Top Denim Backpack',
    category: 'Handcrafted Bags',
    base_price: 240.0,
    fabric_weight: '15oz WATER-RESISTANT',
    artisan_location: 'Kurashiki, Japan',
    business_name: 'Yuki Takahashi Loom',
    description: 'Rugged roll-top backpack constructed from water-resistant waxed indigo selvedge denim. Includes padded leather back straps, brass buckle closure, and side water bottle pocket.',
    is_customizable: true,
    images: [
      'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
    ],
  },
  'p1': {
    _id: 'p1',
    title: 'Kyoto Shuttle 18oz Heavy Selvedge Jeans',
    category: 'Raw Selvedge Denim',
    base_price: 240.0,
    fabric_weight: '18oz SELVEDGE',
    artisan_location: 'Kyoto, Japan',
    business_name: 'Kenji Matsui Studio',
    description: 'Woven on vintage 1940s shuttle looms in Kyoto using 100% natural indigo rope-dyed yarn. Features deep indigo hue, intense slub texture, Union Special 43200G chainstitched hem, and solid copper rivets.',
    is_customizable: true,
    images: [
      'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
      'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
    ],
  },
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);

  const fallbackItem = CATALOG_ITEMS[id] || CATALOG_ITEMS['bag-1'];
  const [product, setProduct] = useState(fallbackItem);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data && typeof res.data === 'object' && res.data.title) {
          setProduct(res.data);
        } else {
          setProduct(CATALOG_ITEMS[id] || CATALOG_ITEMS['bag-1']);
        }
      } catch (err) {
        console.warn('Using detailed fallback product manifest:', err);
        setProduct(CATALOG_ITEMS[id] || CATALOG_ITEMS['bag-1']);
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  const p = product || fallbackItem;
  const basePrice = typeof p.base_price === 'number' ? p.base_price : 185.0;
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : fallbackItem.images;

  const handleAddToCart = () => {
    addItemToCart(p, [], 1);
    navigate('/checkout');
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      {/* Breadcrumb */}
      <div className="flex items-center space-x-2 text-xs font-stitch-label text-on-surface-variant mb-8">
        <Link to="/" className="hover:text-secondary">HOME</Link>
        <span>/</span>
        <Link to="/explore" className="hover:text-secondary">CATALOG</Link>
        <span>/</span>
        <span className="text-primary font-bold">{(p.title || 'SPECIFICATION').toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-12 gap-12 items-start">
        {/* Left: Images Showcase (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[4/3] bg-surface-container relative overflow-hidden border border-primary/10 rounded-xl shadow-md">
            <img 
              src={images[selectedImage] || images[0]} 
              alt={p.title} 
              className="w-full h-full object-cover"
            />
            <LeatherTagBadge text={p.fabric_weight || '18oz SELVEDGE'} className="absolute top-4 left-4" />
          </div>

          {images.length > 1 && (
            <div className="flex space-x-4">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-24 h-24 rounded-lg border-2 overflow-hidden shadow-sm transition-all ${selectedImage === idx ? 'border-secondary scale-105' : 'border-outline-variant opacity-70 hover:opacity-100'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}

          {/* Craftsmanship Details Card */}
          <div className="bg-surface-container-low p-6 rounded-lg border border-dashed border-outline-variant/60 space-y-3 mt-6">
            <h4 className="font-headline-md text-lg text-primary font-bold">Artisanal Material Specifications</h4>
            <div className="grid grid-cols-2 gap-4 text-xs font-stitch-label text-on-surface-variant">
              <div><span className="text-secondary font-bold">MATERIAL:</span> Vintage Shuttle Loom Denim</div>
              <div><span className="text-secondary font-bold">HARDWARE:</span> Solid Copper & Antique Brass</div>
              <div><span className="text-secondary font-bold">LEATHER:</span> Full-Grain Vegetable-Tanned</div>
              <div><span className="text-secondary font-bold">STITCHING:</span> Chainstitched Cotton Thread</div>
            </div>
          </div>
        </div>

        {/* Right: Spec & Manifest (5 cols) */}
        <div className="lg:col-span-5 space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-secondary mb-2">
              <span className="copper-rivet" />
              <span className="font-stitch-label text-xs uppercase tracking-wider">{p.category || 'Handcrafted Bag'}</span>
            </div>
            <h1 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">{p.title}</h1>
            <p className="font-headline-md text-3xl text-primary font-bold mt-2">${basePrice.toFixed(2)}</p>
          </div>

          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {p.description}
          </p>

          {/* Maker Snippet */}
          <ArtisanProfileSnippet 
            name={p.business_name || "Kenji Matsui Studio"}
            location={p.artisan_location || "Kyoto, Japan"}
            specialty="Shuttle Loom Weaver & Leather Craftsman"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            tag={p.fabric_weight || '18oz SELVEDGE'}
          />

          {/* Manifest Table */}
          <PriceBreakdownTable 
            basePrice={basePrice}
            selections={[]}
            artisanFee={25.0}
            deliveryFee={15.0}
            tax={roundTax(basePrice)}
          />

          {/* Action CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 pt-2">
            {p.is_customizable && (
              <Link 
                to={`/customize/${p._id}`}
                className="flex-1 bg-secondary text-on-secondary py-4 px-6 text-center font-headline-md text-sm rounded-lg hover:bg-secondary/90 active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                <span>Configure Custom Spec</span>
              </Link>
            )}
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-on-primary py-4 px-6 font-headline-md text-sm rounded-lg hover:bg-primary-container active:scale-95 transition-all shadow-md flex items-center justify-center space-x-2"
            >
              <span className="material-symbols-outlined text-lg">shopping_basket</span>
              <span>Add to Cart</span>
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}

function roundTax(price) {
  return Math.round((price + 25.0) * 0.08 * 100) / 100;
}
