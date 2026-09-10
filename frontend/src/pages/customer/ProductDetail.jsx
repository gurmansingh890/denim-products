import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';
import ArtisanProfileSnippet from '../../components/ArtisanProfileSnippet';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

const FALLBACK_PRODUCT = {
  _id: 'p1',
  title: 'Kyoto Shuttle 18oz Heavy Selvedge',
  category: 'Raw Denim',
  base_price: 240.0,
  fabric_weight: '18oz SELVEDGE',
  artisan_location: 'Kyoto, Japan',
  business_name: 'Kenji Matsui',
  description: 'Woven on vintage shuttle looms in Kyoto using 100% natural indigo rope-dyed yarn. Features dark indigo hue, high slub texture, and copper hardware.',
  is_customizable: true,
  images: [
    'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80',
    'https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=800&auto=format&fit=crop&q=80',
  ],
};

export default function ProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(FALLBACK_PRODUCT);
  const [loading, setLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    async function fetchProduct() {
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data && typeof res.data === 'object' && res.data.title) {
          setProduct(res.data);
        } else {
          setProduct({ ...FALLBACK_PRODUCT, _id: id || 'p1' });
        }
      } catch (err) {
        console.warn('Failed to load product detail from API, using fallback product detail:', err);
        setProduct({ ...FALLBACK_PRODUCT, _id: id || 'p1' });
      } finally {
        setLoading(false);
      }
    }
    fetchProduct();
  }, [id]);

  if (loading && !product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-label-md text-on-surface-variant">
        Loading heritage product manifest...
      </div>
    );
  }

  const p = product || FALLBACK_PRODUCT;
  const basePrice = typeof p.base_price === 'number' ? p.base_price : 240.0;
  const images = Array.isArray(p.images) && p.images.length > 0 ? p.images : FALLBACK_PRODUCT.images;

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
        <span className="text-primary font-bold">{(p.title || 'GARMENT SPEC').toUpperCase()}</span>
      </div>

      <div className="grid lg:grid-cols-2 gap-12 items-start">
        {/* Left: Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-surface-container relative overflow-hidden border border-primary/10 rounded">
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
                  className={`w-20 h-20 rounded border-2 overflow-hidden ${selectedImage === idx ? 'border-secondary' : 'border-outline-variant opacity-70'}`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Spec & Manifest */}
        <div className="space-y-8">
          <div>
            <div className="inline-flex items-center space-x-2 text-secondary mb-2">
              <span className="stitch-divider-h w-6" />
              <span className="font-stitch-label text-xs uppercase">{p.category || 'Raw Denim'}</span>
            </div>
            <h1 className="font-headline-lg text-3xl md:text-headline-lg text-primary font-bold">{p.title}</h1>
            <p className="font-headline-md text-2xl text-primary font-bold mt-2">${basePrice.toFixed(2)}</p>
          </div>

          <p className="font-body-md text-on-surface-variant leading-relaxed">
            {p.description}
          </p>

          {/* Maker Snippet */}
          <ArtisanProfileSnippet 
            name={p.business_name || "Kenji Matsui"}
            location={p.artisan_location || "Kyoto, Japan"}
            specialty="Shuttle Loom Selvedge Weaver"
            avatar={p.artisan_avatar || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"}
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
          <div className="flex flex-col sm:flex-row gap-4 pt-4">
            {p.is_customizable && (
              <Link 
                to={`/customize/${p._id}`}
                className="flex-1 bg-secondary text-on-secondary py-4 px-6 text-center font-label-md text-sm rounded hover:bg-secondary/90 active:scale-95 transition-all shadow"
              >
                Configure Custom Spec
              </Link>
            )}
            <button 
              onClick={handleAddToCart}
              className="flex-1 bg-primary text-on-primary py-4 px-6 font-label-md text-sm rounded hover:bg-primary-container active:scale-95 transition-all"
            >
              Add Standard Fit to Cart
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
