import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';
import { CopperRivet } from '../../components/LeatherTagBadge';

const FALLBACK_PRODUCT = {
  _id: 'p1',
  title: 'Kyoto Shuttle 18oz Heavy Selvedge',
  category: 'Raw Denim',
  base_price: 240.0,
  fabric_weight: '18oz SELVEDGE',
  images: ['https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'],
};

const MOCK_OPTION_GROUPS = [
  {
    id: 'fit',
    name: 'Silhouette & Cut',
    description: 'Select vintage shuttle loom pattern fit.',
    options: [
      { id: 'slim-tapered', name: 'Slim Tapered', description: 'Snug fit through hip with narrow leg opening.', price_delta: 0 },
      { id: 'classic-straight', name: 'Classic Straight', description: 'Traditional 1950s workwear relaxed straight fit.', price_delta: 15.0 },
      { id: 'relaxed-wide', name: 'Relaxed Wide Leg', description: 'Spacious vintage wide leg cut.', price_delta: 20.0 },
    ],
  },
  {
    id: 'wash',
    name: 'Indigo Dye Finish',
    description: 'Natural hank-dyed indigo saturation process.',
    options: [
      { id: 'raw-unwashed', name: 'Raw Unwashed (Rigid)', description: 'Unwashed dark indigo selvedge with maximum fading potential.', price_delta: 0 },
      { id: 'kyoto-wash', name: 'Kyoto Hand Rinse', description: 'One-wash softened with Kyoto mountain spring water.', price_delta: 25.0 },
      { id: 'vintage-fade', name: 'Vintage Artisan Fade', description: 'Hand-distressed whiskering by Kyoto dyers.', price_delta: 45.0 },
    ],
  },
  {
    id: 'hardware',
    name: 'Hand-Hammered Hardware',
    description: 'Custom metal rivets and button fly buttons.',
    options: [
      { id: 'copper-rivet', name: 'Solid Copper Rivets', description: 'Hand-hammered solid copper rivets and donut buttons.', price_delta: 0 },
      { id: 'black-iron', name: 'Black Iron Hardware', description: 'Matte black iron hardware with anti-rust oil treatment.', price_delta: 10.0 },
      { id: 'brass-vintage', name: 'Aged Vintage Brass', description: 'Custom engraved aged brass button fly set.', price_delta: 15.0 },
    ],
  },
  {
    id: 'stitching',
    name: 'Chainstitch Thread Color',
    description: 'Union Special 43200G chainstitch hem and seams.',
    options: [
      { id: 'golden-tobacco', name: 'Golden Tobacco', description: 'Classic 100% cotton golden tobacco thread.', price_delta: 0 },
      { id: 'indigo-tonal', name: 'Indigo Tonal Thread', description: 'Deep indigo dyed cotton thread matching fabric.', price_delta: 10.0 },
      { id: 'crimson-selvedge', name: 'Crimson Accent Stitch', description: 'Red selvedge matching accent thread.', price_delta: 15.0 },
    ],
  },
];

export default function Customization() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(FALLBACK_PRODUCT);
  const [optionGroups, setOptionGroups] = useState(MOCK_OPTION_GROUPS);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, optRes] = await Promise.allSettled([
          api.get(`/products/${productId || 'p1'}`),
          api.get('/customizations/options')
        ]);

        let loadedProd = FALLBACK_PRODUCT;
        if (prodRes.status === 'fulfilled' && prodRes.value.data && prodRes.value.data.title) {
          loadedProd = prodRes.value.data;
        }
        setProduct(loadedProd);

        let loadedGroups = MOCK_OPTION_GROUPS;
        if (optRes.status === 'fulfilled' && Array.isArray(optRes.value.data) && optRes.value.data.length > 0) {
          loadedGroups = optRes.value.data;
        }
        setOptionGroups(loadedGroups);

        const defaults = {};
        loadedGroups.forEach(group => {
          if (Array.isArray(group.options) && group.options.length > 0) {
            defaults[group.id] = group.options[0];
          }
        });
        setSelections(defaults);
      } catch (err) {
        console.warn('Configurator API error, loading mock configurator preset:', err);
        setProduct(FALLBACK_PRODUCT);
        setOptionGroups(MOCK_OPTION_GROUPS);
        const defaults = {};
        MOCK_OPTION_GROUPS.forEach(group => {
          defaults[group.id] = group.options[0];
        });
        setSelections(defaults);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const handleSelectOption = (groupId, option) => {
    setSelections(prev => ({ ...prev, [groupId]: option }));
  };

  const formattedSelections = Object.entries(selections)
    .filter(([_, opt]) => opt && typeof opt === 'object')
    .map(([groupId, opt]) => ({
      group: groupId,
      option_name: opt.name || groupId,
      price_delta: typeof opt.price_delta === 'number' ? opt.price_delta : 0
    }));

  const handleAddCustomToCart = () => {
    addItemToCart(product || FALLBACK_PRODUCT, formattedSelections, 1);
    navigate('/checkout');
  };

  const displayGroups = Array.isArray(optionGroups) ? optionGroups : MOCK_OPTION_GROUPS;
  const currentProd = product || FALLBACK_PRODUCT;
  const basePrice = typeof currentProd.base_price === 'number' ? currentProd.base_price : 240.0;

  if (loading && displayGroups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-label-md text-on-surface-variant">
        Initializing Shuttle Loom Configurator...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      {/* Configurator Banner Header */}
      <div className="mb-10 text-center md:text-left">
        <span className="font-stitch-label text-xs text-secondary tracking-widest">CUSTOM DENIM CONFIGURATOR</span>
        <h2 className="font-headline-lg text-3xl md:text-headline-lg text-primary">Tailor Your Heritage Garment</h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl mt-2">
          Select fit silhouette, indigo wash finish, hand-hammered hardware, thread stitching, and waistband leather patch. Every option is hand-tailored in Kyoto.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Multi-Step Configurator Options (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {displayGroups.map((group, gIdx) => (
            <div key={group.id} className="bg-surface-container p-6 border border-dashed border-outline-variant rounded">
              <div className="flex items-center space-x-3 mb-4 pb-3 border-b border-primary/10">
                <span className="w-7 h-7 rounded-full bg-primary text-white text-xs font-stitch-label flex items-center justify-center font-bold">
                  0{gIdx + 1}
                </span>
                <div>
                  <h3 className="font-headline-md text-xl text-primary font-bold">{group.name}</h3>
                  <p className="font-body-md text-xs text-on-surface-variant">{group.description}</p>
                </div>
              </div>

              <div className="space-y-4">
                {(Array.isArray(group.options) ? group.options : []).map((opt) => {
                  const isSelected = selections[group.id]?.id === opt.id;
                  const priceDelta = typeof opt.price_delta === 'number' ? opt.price_delta : 0;
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleSelectOption(group.id, opt)}
                      className={`p-4 border rounded cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-secondary bg-surface-container-low shadow-sm' 
                          : 'border-outline-variant bg-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <CopperRivet active={isSelected} label={opt.name} />
                        <span className="font-label-md text-xs font-bold text-primary">
                          {priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : 'Base Standard'}
                        </span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-2 pl-8">
                        {opt.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Live 2D Visual Spec & Manifest Price Breakdown (5 cols) */}
        <div className="lg:col-span-5 space-y-8 sticky top-28 h-fit">
          {/* Live Visual Spec Box */}
          <div className="bg-primary text-on-primary p-6 rounded shadow-lg relative overflow-hidden">
            <span className="font-stitch-label text-xs text-secondary-fixed">2D GARMENT SPECIFICATION</span>
            <h4 className="font-headline-md text-2xl text-white mt-1">{currentProd.title}</h4>

            {/* Simulated Garment Sketch with Stitch Overlay */}
            <div className="my-6 relative h-64 bg-primary-container rounded flex items-center justify-center border border-primary-fixed/20 overflow-hidden">
              <img 
                src={currentProd.images?.[0] || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'} 
                alt="Denim preview"
                className="w-full h-full object-cover opacity-80"
              />
              <div className="absolute inset-0 bg-primary/40 backdrop-blur-[1px]" />
              
              {/* Overlay Tags */}
              <div className="absolute top-4 left-4 leather-patch px-2 py-0.5 text-[9px]">
                {selections.fit?.name || 'Selvedge Fit'}
              </div>
              <div className="absolute bottom-4 right-4 bg-secondary text-white font-stitch-label px-2 py-1 text-[9px] rounded">
                {selections.wash?.name || 'Kyoto Wash'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-stitch-label text-primary-fixed/80 border-t border-primary-fixed/20 pt-4">
              <div><span className="text-secondary-fixed">FIT:</span> {selections.fit?.name || 'Slim Tapered'}</div>
              <div><span className="text-secondary-fixed">WASH:</span> {selections.wash?.name || 'Raw Rigid'}</div>
              <div><span className="text-secondary-fixed">HARDWARE:</span> {selections.hardware?.name || 'Solid Copper'}</div>
              <div><span className="text-secondary-fixed">STITCHING:</span> {selections.stitching?.name || 'Golden Tobacco'}</div>
            </div>
          </div>

          {/* Live Manifest Price Table */}
          <PriceBreakdownTable 
            basePrice={basePrice}
            selections={formattedSelections}
            artisanFee={25.0}
            deliveryFee={15.0}
            tax={Math.round((basePrice + formattedSelections.reduce((a, b) => a + b.price_delta, 0) + 25.0) * 0.08 * 100) / 100}
          />

          <button 
            onClick={handleAddCustomToCart}
            className="w-full bg-secondary text-on-secondary py-4 font-headline-md text-lg rounded hover:bg-secondary/90 active:scale-95 transition-transform shadow-md"
          >
            Add Custom Spec to Shopping Basket
          </button>
        </div>
      </div>
    </main>
  );
}
