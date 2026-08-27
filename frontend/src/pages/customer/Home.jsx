import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import ArtisanProfileSnippet from '../../components/ArtisanProfileSnippet';
import FabricSwatchCard from '../../components/FabricSwatchCard';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function Home() {
  const navigate = useNavigate();
  const [recommended, setRecommended] = useState([]);
  const [loading, setLoading] = useState(true);
  const [scrollPos, setScrollPos] = useState(0);

  useEffect(() => {
    async function fetchRecommended() {
      try {
        const res = await api.get('/products/recommendations');
        setRecommended(res.data);
      } catch (err) {
        console.error('Failed to load recommendations', err);
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

  return (
    <main className="pb-24">
      {/* Hero Section */}
      <section className="px-4 md:px-margin-desktop my-12 md:my-20">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="inline-flex items-center space-x-3 text-secondary">
              <span className="stitch-divider-h w-8"></span>
              <span className="font-stitch-label text-stitch-label">ESTABLISHED 1892</span>
            </div>

            <h2 className="font-display-lg text-4xl lg:text-display-lg text-primary leading-tight">
              Crafted by Hands, Worn by You
            </h2>

            <p className="font-body-lg text-lg text-on-surface-variant max-w-lg">
              We believe in slow fashion. Every garment is a dialogue between the weaver, the indigo, and the wearer. Our denim is woven on vintage shuttle looms, creating a fabric that lives, breathes, and ages with your unique story.
            </p>

            <div className="flex flex-wrap gap-4 pt-4">
              <Link 
                to="/explore" 
                className="bg-primary text-on-primary px-8 py-4 font-label-md text-sm rounded-lg hover:bg-primary-container active:scale-95 transition-transform"
              >
                Explore Collection
              </Link>
              <Link 
                to="/customize/p1" 
                className="border border-primary text-primary px-8 py-4 font-label-md text-sm rounded-lg hover:bg-primary/5 active:scale-95 transition-transform"
              >
                Custom Fitting Configurator
              </Link>
            </div>

            {/* Artisan Spotlight Snippet */}
            <ArtisanProfileSnippet 
              name="Kenji Matsui"
              location="Kyoto, Japan"
              specialty="Master Selvedge Weaver"
              tag="18oz SELVEDGE"
              avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            />
          </div>

          <div className="relative h-[450px] lg:h-[600px] bg-surface-container-highest overflow-hidden rounded border border-primary/10">
            <img 
              src="https://images.unsplash.com/photo-1558769132-cb1aea458c5e?w=1000&auto=format&fit=crop&q=80" 
              alt="Indigo Workshop" 
              className="w-full h-full object-cover"
            />
            <div className="absolute bottom-8 left-8 bg-surface/90 backdrop-blur px-6 py-4 border-l-4 border-secondary rounded">
              <p className="font-stitch-label text-stitch-label text-primary">CURRENT PROCESS</p>
              <p className="font-headline-md text-headline-md text-primary">Natural Indigo Fermentation</p>
            </div>
          </div>
        </div>
      </section>

      {/* Category Filters */}
      <section className="px-4 md:px-margin-desktop mb-16">
        <div className="max-w-7xl mx-auto flex flex-wrap gap-4 items-center justify-center border-y border-dashed border-outline-variant py-8">
          <Link to="/explore?category=All Crafts" className="px-6 py-2 rounded-full bg-secondary text-on-secondary font-label-md text-sm shadow-sm hover:opacity-90">All Crafts</Link>
          <Link to="/explore?category=Raw Denim" className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-sm transition-colors">Raw Denim</Link>
          <Link to="/explore?category=Jackets" className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-sm transition-colors">Jackets</Link>
          <Link to="/explore?category=Custom Fits" className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-sm transition-colors">Custom Fits</Link>
          <Link to="/explore?category=Accessories" className="px-6 py-2 rounded-full border border-outline-variant hover:bg-surface-container font-label-md text-sm transition-colors">Accessories</Link>
        </div>
      </section>

      {/* Recommended for You Carousel */}
      <section className="mb-24 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 md:px-margin-desktop flex justify-between items-end mb-8">
          <div>
            <span className="font-stitch-label text-stitch-label text-secondary">CURATED SELECTION</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Recommended for You</h2>
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
          className="max-w-7xl mx-auto flex space-x-8 px-4 md:px-margin-desktop overflow-x-auto no-scrollbar pb-8"
        >
          {loading ? (
            <p className="font-label-md text-on-surface-variant">Loading curated denim...</p>
          ) : (
            recommended.map((item) => (
              <div 
                key={item._id} 
                onClick={() => navigate(`/product/${item._id}`)}
                className="flex-shrink-0 w-80 group cursor-pointer"
              >
                <div className="aspect-square bg-surface-container relative overflow-hidden border border-primary/5 rounded">
                  <img 
                    src={item.images?.[0] || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'} 
                    alt={item.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                  <div className="absolute top-4 left-4 leather-patch px-3 py-1 text-[10px]">
                    {item.fabric_weight}
                  </div>
                </div>
                <div className="mt-4 space-y-1">
                  <p className="font-stitch-label text-stitch-label text-on-surface-variant">{item.category.toUpperCase()}</p>
                  <h3 className="font-headline-md text-headline-md text-primary text-xl">{item.title}</h3>
                  <p className="font-body-md text-body-md text-primary font-bold">${item.base_price.toFixed(2)}</p>
                </div>
              </div>
            ))
          )}
        </div>
      </section>

      {/* Trending Textiles Swatch Section */}
      <section className="px-4 md:px-margin-desktop mb-24 max-w-7xl mx-auto">
        <div className="mb-12">
          <span className="font-stitch-label text-stitch-label text-secondary">FABRIC FOCUS</span>
          <h2 className="font-headline-lg text-headline-lg text-primary">Trending Textiles</h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          <FabricSwatchCard 
            title="Kyoto Slub Selvedge"
            weight="14.5oz"
            description="Characterized by irregular textures and high vertical fading potential."
            image="https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
          <FabricSwatchCard 
            title="Ocean Broken Twill"
            weight="15.0oz"
            description="Engineered for comfort and a unique salt-and-pepper fade profile."
            image="https://images.unsplash.com/photo-1582552938357-32b906df40cb?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
          <FabricSwatchCard 
            title="Obsidian Hemp Blend"
            weight="18.0oz"
            description="Sustainability meets extreme durability in this breathable heavyweight blend."
            image="https://images.unsplash.com/photo-1542272604-780c96856592?w=600&auto=format&fit=crop&q=80"
            onOrderSwatch={() => navigate('/customize/p1')}
          />
        </div>
      </section>

      {/* Brand Philosophy CTA */}
      <section className="px-4 md:px-margin-desktop py-24 bg-primary text-on-primary relative overflow-hidden">
        <div className="relative z-10 max-w-2xl mx-auto text-center space-y-8">
          <span className="font-stitch-label text-stitch-label text-secondary-fixed">THE PHILOSOPHY</span>
          <h2 className="font-display-lg text-3xl md:text-display-lg">Wear the soul of the artisan.</h2>
          <p className="font-body-lg text-body-lg text-primary-fixed/80">
            Indigo & Stitch is more than a marketplace; it's a movement back to quality and transparency. We track every yard of fabric from the shuttle loom to your doorstep.
          </p>
          <div className="pt-8">
            <Link 
              to="/explore" 
              className="bg-secondary text-on-secondary px-12 py-4 font-headline-md text-lg rounded-lg hover:bg-secondary/90 active:scale-95 transition-transform inline-block"
            >
              Start Your Journey
            </Link>
          </div>
        </div>
      </section>
    </main>
  );
}
