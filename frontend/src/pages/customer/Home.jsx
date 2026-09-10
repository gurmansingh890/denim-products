import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import ArtisanProfileSnippet from '../../components/ArtisanProfileSnippet';
import FabricSwatchCard from '../../components/FabricSwatchCard';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

const MOCK_RECOMMENDATIONS = [
  {
    _id: 'bag-1',
    title: 'Kyoto Selvedge Heavy Tote Bag',
    category: 'Handcrafted Bags',
    base_price: 185.0,
    fabric_weight: '18oz SELVEDGE + LEATHER',
    images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80'],
    description: 'Hand-cut 18oz selvedge denim tote with full-grain vegetable tanned leather handles and copper rivets.',
  },
  {
    _id: 'bag-2',
    title: 'Okayama Boro Patchwork Duffle Bag',
    category: 'Handcrafted Bags',
    base_price: 295.0,
    fabric_weight: '16oz BORO SASHIKO',
    images: ['https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80'],
    description: 'Sashiko hand-stitched denim duffle bag with antique brass YKK hardware and reinforced leather base.',
  },
  {
    _id: 'p1',
    title: 'Kyoto Shuttle 18oz Heavy Selvedge',
    category: 'Raw Selvedge Denim',
    base_price: 240.0,
    fabric_weight: '18oz SELVEDGE',
    images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=800&auto=format&fit=crop&q=80'],
    description: 'Vintage shuttle loom woven raw denim jeans with Union Special chainstitched hem.',
  },
  {
    _id: 'bag-3',
    title: 'Kurashiki Roll-Top Denim Backpack',
    category: 'Handcrafted Bags',
    base_price: 240.0,
    fabric_weight: '15oz WATER-RESISTANT',
    images: ['https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80'],
    description: 'Rugged roll-top indigo denim backpack with padded leather shoulder straps and laptop compartment.',
  },
  {
    _id: 'p2',
    title: 'Natural Indigo Kakishibu Trucker Jacket',
    category: 'Artisanal Jackets',
    base_price: 320.0,
    fabric_weight: '15.5oz TWILL',
    images: ['https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800&auto=format&fit=crop&q=80'],
    description: 'Persimmon tannin over-dyed indigo trucker jacket with copper donut buttons.',
  },
];

const MOCK_BAGS = [
  {
    _id: 'bag-1',
    title: 'Kyoto Selvedge Heavy Tote Bag',
    weight: '18oz Selvedge',
    price: 185.0,
    image: 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80',
    tag: 'BESTSELLER',
    artisan: 'Kenji Matsui (Kyoto)',
  },
  {
    _id: 'bag-2',
    title: 'Okayama Boro Patchwork Duffle',
    weight: '16oz Boro Sashiko',
    price: 295.0,
    image: 'https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&auto=format&fit=crop&q=80',
    tag: 'HAND-STITCHED',
    artisan: 'Hiroshi Tanaka (Okayama)',
  },
  {
    _id: 'bag-3',
    title: 'Kurashiki Roll-Top Backpack',
    weight: '15oz Waxed Selvedge',
    price: 240.0,
    image: 'https://images.unsplash.com/photo-1622560480605-d83c853bc5c3?w=800&auto=format&fit=crop&q=80',
    tag: 'LEATHER ACCENT',
    artisan: 'Yuki Takahashi (Kurashiki)',
  },
  {
    _id: 'bag-4',
    title: 'Osaka Crossbody Messenger',
    weight: '14.5oz Slub Denim',
    price: 155.0,
    image: 'https://images.unsplash.com/photo-1590874103328-eac38a683ce7?w=800&auto=format&fit=crop&q=80',
    tag: 'DAILY COMMUTE',
    artisan: 'Mei Lin (Osaka)',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState(MOCK_RECOMMENDATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await api.get('/products/recommendations');
        if (Array.isArray(res.data) && res.data.length > 0) {
          setRecommended(res.data);
        } else {
          setRecommended(MOCK_RECOMMENDATIONS);
        }
      } catch (err) {
        console.warn('Backend API endpoint unavailable, displaying artisanal catalog:', err);
        setRecommended(MOCK_RECOMMENDATIONS);
      } finally {
        setLoading(false);
      }
    }
    fetchRecommended();
  }, []);

  const handleScroll = (direction) => {
    const el = document.getElementById('recommendations-carousel');
    if (el) {
      const scrollAmount = direction === 'left' ? -340 : 340;
      el.scrollBy({ left: scrollAmount, behavior: 'smooth' });
    }
  };

  const displayItems = Array.isArray(recommended) && recommended.length > 0 ? recommended : MOCK_RECOMMENDATIONS;

  return (
    <main className="pb-24 denim-pattern">
      {/* Hero Section */}
      <section className="px-4 md:px-margin-desktop my-8 md:my-16">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-12 gap-12 items-center">
          <div className="lg:col-span-7 space-y-8">
            <div className="inline-flex items-center space-x-3 text-secondary">
              <span className="copper-rivet" />
              <span className="font-stitch-label text-xs uppercase tracking-widest">HANDMADE DENIM & LEATHER BAG STUDIO</span>
            </div>

            <h2 className="font-display-lg text-4xl sm:text-5xl lg:text-6xl text-primary leading-tight font-bold">
              Artisanal Denim Garments & Handcrafted Bags
            </h2>

            <p className="font-body-lg text-lg text-on-surface-variant max-w-xl leading-relaxed">
              Every garment and bag is a dialogue between vintage shuttle looms, natural indigo dye, and master craftsmen. Hand-stitched with brass rivets, full-grain leather straps, and heavy selvedge denim built for generations.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <Link 
                to="/explore?category=Handcrafted Bags" 
                className="bg-secondary text-on-secondary px-8 py-4 font-headline-md text-sm rounded-lg hover:bg-secondary/90 active:scale-95 transition-all shadow-md flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-lg">shopping_bag</span>
                <span>Explore Handcrafted Bags</span>
              </Link>
              <Link 
                to="/customize/p1" 
                className="border border-primary text-primary px-8 py-4 font-headline-md text-sm rounded-lg hover:bg-primary/5 active:scale-95 transition-all flex items-center space-x-2"
              >
                <span className="material-symbols-outlined text-lg">tune</span>
                <span>Custom Configurator</span>
              </Link>
            </div>

            {/* Feature Highlights Badges */}
            <div className="grid grid-cols-3 gap-4 pt-6 border-t border-dashed border-outline-variant/60 max-w-lg">
              <div>
                <span className="font-headline-md text-xl text-primary font-bold">100%</span>
                <p className="font-stitch-label text-[11px] text-on-surface-variant">Shuttle-Loom Woven</p>
              </div>
              <div>
                <span className="font-headline-md text-xl text-secondary font-bold">Hand-Dyed</span>
                <p className="font-stitch-label text-[11px] text-on-surface-variant">Natural Hank Indigo</p>
              </div>
              <div>
                <span className="font-headline-md text-xl text-primary font-bold">Lifetime</span>
                <p className="font-stitch-label text-[11px] text-on-surface-variant">Stitch Guarantee</p>
              </div>
            </div>

            {/* Artisan Spotlight Snippet */}
            <ArtisanProfileSnippet 
              name="Kenji Matsui"
              location="Kyoto, Japan"
              specialty="Master Weaver & Leather Stitcher"
              tag="18oz SELVEDGE"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            />
          </div>

          {/* Hero Banner Grid (Bags + Denim Showcase) */}
          <div className="lg:col-span-5 grid gap-4">
            <div className="relative h-[320px] sm:h-[380px] bg-surface-container overflow-hidden rounded-xl border border-primary/10 shadow-xl group">
              <img 
                src="https://images.unsplash.com/photo-1544816155-12df9643f363?w=800&auto=format&fit=crop&q=80" 
                alt="Handcrafted Denim Tote Bag" 
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary/90 via-primary/20 to-transparent" />
              <LeatherTagBadge text="FEATURED CRAFT" className="absolute top-4 left-4" />
              <div className="absolute bottom-6 left-6 right-6 text-white space-y-1">
                <span className="font-stitch-label text-xs text-secondary-fixed">HANDCRAFTED BAG SERIES</span>
                <h3 className="font-headline-md text-2xl font-bold text-white">Kyoto Selvedge Carry-All Tote</h3>
                <p className="font-body-md text-xs text-primary-fixed-dim">18oz Selvedge • Full-grain Leather Straps • Solid Copper Rivets</p>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="relative h-[160px] bg-surface-container overflow-hidden rounded-lg border border-primary/10 shadow group">
                <img 
                  src="https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=600&auto=format&fit=crop&q=80" 
                  alt="Duffle Bag" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-stitch-label text-[10px] text-secondary-fixed">BORO PATCHWORK</p>
                  <p className="font-headline-md text-sm font-bold">Artisanal Duffle</p>
                </div>
              </div>

              <div className="relative h-[160px] bg-surface-container overflow-hidden rounded-lg border border-primary/10 shadow group">
                <img 
                  src="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80" 
                  alt="Selvedge Denim Jeans" 
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-primary/80 to-transparent" />
                <div className="absolute bottom-3 left-3 text-white">
                  <p className="font-stitch-label text-[10px] text-secondary-fixed">RAW SELVEDGE</p>
                  <p className="font-headline-md text-sm font-bold">Shuttle Loom Jeans</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Category Pills Filter */}
      <section className="px-4 md:px-margin-desktop mb-16">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center border-y border-dashed border-outline-variant/60 py-6">
          <Link to="/explore?category=All Crafts" className="px-6 py-2.5 rounded-full bg-primary text-white font-label-md text-xs shadow hover:bg-primary-container transition-colors">
            All Crafts
          </Link>
          <Link to="/explore?category=Handcrafted Bags" className="px-6 py-2.5 rounded-full bg-secondary text-white font-label-md text-xs font-bold shadow hover:bg-secondary/90 flex items-center space-x-1.5">
            <span className="material-symbols-outlined text-sm">shopping_bag</span>
            <span>Handcrafted Bags</span>
          </Link>
          <Link to="/explore?category=Raw Selvedge Denim" className="px-6 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-xs transition-colors">
            Raw Selvedge Denim
          </Link>
          <Link to="/explore?category=Artisanal Jackets" className="px-6 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-xs transition-colors">
            Artisanal Jackets
          </Link>
          <Link to="/explore?category=Accessories & Aprons" className="px-6 py-2.5 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-xs transition-colors">
            Accessories & Aprons
          </Link>
        </div>
      </section>

      {/* Dedicated Handcrafted Bags Showcase Section */}
      <section className="px-4 md:px-margin-desktop mb-24 max-w-7xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-12 border-b border-primary/10 pb-6">
          <div>
            <div className="inline-flex items-center space-x-2 text-secondary">
              <span className="copper-rivet" />
              <span className="font-stitch-label text-xs uppercase tracking-widest">HANDMADE LEATHER & DENIM BAGS</span>
            </div>
            <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold mt-1">
              Handcrafted Denim Bag Collection
            </h2>
            <p className="font-body-md text-sm text-on-surface-variant max-w-xl mt-1">
              Engineered with heavy vintage selvedge, full-grain vegetable-tanned leather straps, and solid copper rivets for extreme durability and timeless style.
            </p>
          </div>
          <Link 
            to="/explore?category=Handcrafted Bags" 
            className="mt-4 md:mt-0 font-label-md text-xs text-secondary font-bold hover:underline flex items-center space-x-1"
          >
            <span>View All Artisanal Bags</span>
            <span className="material-symbols-outlined text-sm">arrow_forward</span>
          </Link>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {MOCK_BAGS.map((bag) => (
            <div 
              key={bag._id}
              onClick={() => navigate(`/product/${bag._id}`)}
              className="bg-surface-container-lowest border border-primary/10 rounded-lg overflow-hidden group cursor-pointer craft-card"
            >
              <div className="aspect-[4/5] bg-surface relative overflow-hidden">
                <img 
                  src={bag.image} 
                  alt={bag.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <LeatherTagBadge text={bag.weight} className="absolute top-3 left-3" />
                <div className="absolute top-3 right-3 bg-secondary/90 backdrop-blur text-white text-[9px] font-stitch-label px-2 py-0.5 rounded font-bold">
                  {bag.tag}
                </div>
              </div>

              <div className="p-5 space-y-2">
                <p className="font-stitch-label text-[10px] text-secondary tracking-wider">{bag.artisan}</p>
                <h3 className="font-headline-md text-lg text-primary font-bold group-hover:text-secondary transition-colors line-clamp-1">
                  {bag.title}
                </h3>
                <div className="pt-2 flex justify-between items-center border-t border-dashed border-outline-variant/50">
                  <span className="font-headline-md text-lg text-primary font-bold">${bag.price.toFixed(2)}</span>
                  <span className="font-label-md text-[11px] text-secondary font-bold group-hover:underline">
                    Order Spec &rarr;
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Curated Recommendations Carousel */}
      <section className="mb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop flex justify-between items-end mb-8">
          <div>
            <span className="font-stitch-label text-xs text-secondary tracking-widest">CURATED SELECTION</span>
            <h2 className="font-headline-lg text-3xl text-primary font-bold">Artisanal Garments & Accessories</h2>
          </div>
          <div className="flex space-x-2">
            <button 
              onClick={() => handleScroll('left')}
              className="p-2 border border-outline-variant rounded-full hover:bg-primary hover:text-on-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_left</span>
            </button>
            <button 
              onClick={() => handleScroll('right')}
              className="p-2 border border-outline-variant rounded-full hover:bg-primary hover:text-on-primary transition-colors"
            >
              <span className="material-symbols-outlined text-sm">chevron_right</span>
            </button>
          </div>
        </div>

        <div 
          id="recommendations-carousel" 
          className="max-w-7xl mx-auto flex space-x-6 px-4 md:px-margin-desktop overflow-x-auto no-scrollbar pb-8"
        >
          {loading && displayItems.length === 0 ? (
            <p className="font-label-md text-on-surface-variant">Loading curated denim...</p>
          ) : (
            displayItems.map((item) => (
              <div 
                key={item._id} 
                onClick={() => navigate(`/product/${item._id}`)}
                className="flex-shrink-0 w-80 group cursor-pointer craft-card bg-surface-container-lowest p-4 rounded border border-primary/10"
              >
                <div className="aspect-square bg-surface-container relative overflow-hidden rounded">
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <LeatherTagBadge text={item.fabric_weight || '18oz SELVEDGE'} className="absolute top-3 left-3" />
                </div>
                <div className="mt-4 space-y-1">
                  <p className="font-stitch-label text-[10px] text-secondary font-bold">{(item.category || 'DENIM').toUpperCase()}</p>
                  <h3 className="font-headline-md text-lg text-primary font-bold line-clamp-1">{item.title}</h3>
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">{item.description}</p>
                  <p className="font-headline-md text-base text-primary font-bold pt-2">${typeof item.base_price === 'number' ? item.base_price.toFixed(2) : '240.00'}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Trending Textiles Swatch Focus */}
      <section className="px-4 md:px-margin-desktop mb-24 max-w-7xl mx-auto">
        <div className="mb-12 text-center md:text-left">
          <span className="font-stitch-label text-xs text-secondary tracking-widest uppercase">HERITAGE TEXTILE ARCHIVE</span>
          <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Artisanal Fabric & Leather Focus</h2>
          <p className="font-body-md text-sm text-on-surface-variant max-w-xl mt-1">
            Examine our shuttle loom woven fabrics, hand-dyed hank indigo yarn, and vegetable-tanned leather trims before customizing your bag or garment.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FabricSwatchCard 
            title="Kyoto Heavy Slub Selvedge"
            weight="18.0oz"
            description="Extreme vertical slub texture woven on vintage 1940s shuttle looms."
            image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
          <FabricSwatchCard 
            title="Okayama Boro Sashiko Patchwork"
            weight="16.0oz"
            description="Traditional Japanese sashiko hand-stitching with Indigo Hank dyed patches."
            image="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
          <FabricSwatchCard 
            title="Full-Grain Leather & Slub Blend"
            weight="15.0oz"
            description="Tanned with mimosa bark extract for deep patina on bags and jacket trims."
            image="https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
        </div>
      </section>

      {/* Brand Philosophy CTA */}
      <section className="px-4 md:px-margin-desktop py-20 bg-primary text-on-primary relative overflow-hidden rounded-2xl max-w-7xl mx-auto shadow-2xl">
        <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
          <span className="font-stitch-label text-xs text-secondary-fixed tracking-widest uppercase">OUR CRAFTSMANSHIP PLEDGE</span>
          <h2 className="font-display-lg text-3xl sm:text-4xl lg:text-5xl font-bold">Wear the soul of master weavers & bag stitchers.</h2>
          <p className="font-body-lg text-base md:text-lg text-primary-fixed/90 leading-relaxed">
            Indigo & Stitch connects you directly with master weavers and bag artisans. From shuttle loom selvage edge to hand-hammered copper rivets, every garment and bag is made to age gracefully with your journey.
          </p>
          <div className="pt-6 flex flex-wrap gap-4 justify-center">
            <Link 
              to="/explore?category=Handcrafted Bags" 
              className="bg-secondary text-on-secondary px-10 py-4 font-headline-md text-base rounded-lg hover:bg-secondary/90 active:scale-95 transition-transform shadow-lg"
            >
              Shop Handcrafted Bags
            </Link>
            <Link 
              to="/explore" 
              className="border border-white/40 text-white px-10 py-4 font-headline-md text-base rounded-lg hover:bg-white/10 active:scale-95 transition-transform"
            >
              Explore Entire Catalog
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
