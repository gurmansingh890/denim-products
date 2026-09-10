import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';
import { CopperRivet } from '../../components/LeatherTagBadge';

const FALLBACK_BAG = {
  _id: 'bag-1',
  title: 'Kyoto Selvedge Heavy Tote Bag',
  category: 'Handcrafted Bags',
  base_price: 185.0,
  fabric_weight: '18oz SELVEDGE + LEATHER',
  images: ['https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'],
};

const MOCK_BAG_OPTION_GROUPS = [
  {
    id: 'body',
    name: '01 / Bag Body Denim Weight',
    description: 'Select vintage shuttle loom indigo body denim.',
    options: [
      { id: '18oz-heavy', name: '18oz Kyoto Heavy Selvedge', description: 'Rigid heavyweight selvedge denim for maximum structure.', price_delta: 0 },
      { id: '16oz-boro', name: '16oz Boro Sashiko Patchwork', description: 'Traditional Japanese hand-stitched sashiko indigo patches.', price_delta: 35.0 },
      { id: '15oz-waxed', name: '15oz Waxed Water-Resistant Denim', description: 'Paraffin waxed selvedge denim repelling rain and dirt.', price_delta: 25.0 },
    ],
  },
  {
    id: 'handles',
    name: '02 / Full-Grain Leather Handles',
    description: 'Hand-cut vegetable-tanned leather straps.',
    options: [
      { id: 'natural-tan', name: 'Natural Chestnut Tan Leather', description: 'Un-dyed 4mm thick Bridle leather that patinas richly over time.', price_delta: 0 },
      { id: 'dark-brown', name: 'Dark Mahogany Espresso Leather', description: 'Oil-tanned dark espresso brown leather handles.', price_delta: 15.0 },
      { id: 'matte-black', name: 'Matte Obsidian Black Leather', description: 'Blackened vegetable-tanned leather with burnished edges.', price_delta: 15.0 },
    ],
  },
  {
    id: 'hardware',
    name: '03 / Metal Hardware & Rivets',
    description: 'Hand-hammered structural metal hardware.',
    options: [
      { id: 'solid-copper', name: 'Hand-Hammered Solid Copper Rivets', description: 'Traditional solid copper rivets and burrs.', price_delta: 0 },
      { id: 'antique-brass', name: 'Aged Antique Brass Hardware', description: 'Custom engraved antique brass rivets and swivel hooks.', price_delta: 10.0 },
      { id: 'iron-black', name: 'Matte Black Structural Hardware', description: 'High-durability black iron rivets and key ring attachment.', price_delta: 12.0 },
    ],
  },
  {
    id: 'lining',
    name: '04 / Interior Canvas Lining & Monogram',
    description: 'Double-stitched inner lining & leather patch.',
    options: [
      { id: 'indigo-canvas', name: 'Indigo Heavy Cotton Canvas', description: 'Durable 10oz indigo canvas with dual slip pockets.', price_delta: 0 },
      { id: 'red-selvedge-lining', name: 'Red-Line Selvedge Trimmed Lining', description: 'Includes red selvedge ID accent trim and zippered pocket.', price_delta: 20.0 },
      { id: 'custom-monogram', name: 'Embossed Leather Monogram Patch', description: 'Personalized 3-initial hot-stamped leather patch inside.', price_delta: 25.0 },
    ],
  },
];

export default function Customization() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(FALLBACK_BAG);
  const [optionGroups, setOptionGroups] = useState(MOCK_BAG_OPTION_GROUPS);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, optRes] = await Promise.allSettled([
          api.get(`/products/${productId || 'bag-1'}`),
          api.get('/customizations/options')
        ]);

        let loadedProd = FALLBACK_BAG;
        if (prodRes.status === 'fulfilled' && prodRes.value.data && prodRes.value.data.title) {
          loadedProd = prodRes.value.data;
        }
        setProduct(loadedProd);

        let loadedGroups = MOCK_BAG_OPTION_GROUPS;
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
        console.warn('Configurator API fallback to artisanal bag options preset:', err);
        setProduct(FALLBACK_BAG);
        setOptionGroups(MOCK_BAG_OPTION_GROUPS);
        const defaults = {};
        MOCK_BAG_OPTION_GROUPS.forEach(group => {
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
    addItemToCart(product || FALLBACK_BAG, formattedSelections, 1);
    navigate('/checkout');
  };

  const displayGroups = Array.isArray(optionGroups) ? optionGroups : MOCK_BAG_OPTION_GROUPS;
  const currentProd = product || FALLBACK_BAG;
  const basePrice = typeof currentProd.base_price === 'number' ? currentProd.base_price : 185.0;

  if (loading && displayGroups.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-label-md text-on-surface-variant">
        Initializing Shuttle Loom & Leather Bag Configurator...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      {/* Configurator Banner Header */}
      <div className="mb-10 text-center md:text-left">
        <div className="inline-flex items-center space-x-2 text-secondary mb-1">
          <span className="copper-rivet" />
          <span className="font-stitch-label text-xs uppercase tracking-widest">ARTISANAL DENIM & BAG CONFIGURATOR</span>
        </div>
        <h2 className="font-headline-lg text-3xl md:text-4xl text-primary font-bold">Tailor Your Custom Craft</h2>
        <p className="font-body-md text-on-surface-variant max-w-2xl mt-1">
          Select body denim weight, full-grain leather handles, solid copper rivets, interior canvas lining, and personalized embossed leather patch. Hand-crafted in Kyoto.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Multi-Step Configurator Options (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {displayGroups.map((group) => (
            <div key={group.id} className="bg-surface-container-lowest p-6 border border-dashed border-outline-variant rounded-lg space-y-4 shadow-sm">
              <div>
                <h3 className="font-headline-md text-xl text-primary font-bold">{group.name}</h3>
                <p className="font-body-md text-xs text-on-surface-variant mt-0.5">{group.description}</p>
              </div>

              <div className="space-y-3">
                {(Array.isArray(group.options) ? group.options : []).map((opt) => {
                  const isSelected = selections[group.id]?.id === opt.id;
                  const priceDelta = typeof opt.price_delta === 'number' ? opt.price_delta : 0;
                  return (
                    <div 
                      key={opt.id}
                      onClick={() => handleSelectOption(group.id, opt)}
                      className={`p-4 border rounded-lg cursor-pointer transition-all ${
                        isSelected 
                          ? 'border-secondary bg-surface-container-low shadow' 
                          : 'border-outline-variant bg-surface hover:bg-surface-container-high'
                      }`}
                    >
                      <div className="flex justify-between items-start">
                        <CopperRivet active={isSelected} label={opt.name} />
                        <span className="font-label-md text-xs font-bold text-primary">
                          {priceDelta > 0 ? `+$${priceDelta.toFixed(2)}` : 'Base Standard'}
                        </span>
                      </div>
                      <p className="font-body-md text-xs text-on-surface-variant mt-2 pl-7 leading-relaxed">
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
          <div className="bg-primary text-on-primary p-6 rounded-xl shadow-xl relative overflow-hidden">
            <span className="font-stitch-label text-xs text-secondary-fixed tracking-widest uppercase">2D CRAFT SPECIFICATION</span>
            <h4 className="font-headline-md text-2xl text-white font-bold mt-1">{currentProd.title}</h4>

            {/* Simulated Garment / Bag Sketch with Stitch Overlay */}
            <div className="my-6 relative h-64 bg-primary-container rounded-lg flex items-center justify-center border border-primary-fixed/20 overflow-hidden shadow-inner">
              <img 
                src={currentProd.images?.[0] || 'https://images.unsplash.com/photo-1544816155-12df9643f363?w=600&auto=format&fit=crop&q=80'} 
                alt="Craft preview"
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-primary/30 backdrop-blur-[1px]" />
              
              {/* Overlay Tags */}
              <div className="absolute top-4 left-4 leather-patch px-3 py-1 text-[10px]">
                {selections.body?.name || '18oz Heavy Selvedge'}
              </div>
              <div className="absolute bottom-4 right-4 bg-secondary text-white font-stitch-label px-3 py-1 text-[10px] rounded font-bold">
                {selections.handles?.name || 'Natural Tan Leather'}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 text-xs font-stitch-label text-primary-fixed/90 border-t border-primary-fixed/20 pt-4">
              <div><span className="text-secondary-fixed font-bold">BODY:</span> {selections.body?.name || '18oz Selvedge'}</div>
              <div><span className="text-secondary-fixed font-bold">LEATHER:</span> {selections.handles?.name || 'Natural Tan'}</div>
              <div><span className="text-secondary-fixed font-bold">HARDWARE:</span> {selections.hardware?.name || 'Solid Copper'}</div>
              <div><span className="text-secondary-fixed font-bold">LINING:</span> {selections.lining?.name || 'Indigo Canvas'}</div>
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
            className="w-full bg-secondary text-on-secondary py-4 font-headline-md text-base rounded-lg hover:bg-secondary/90 active:scale-95 transition-transform shadow-lg flex items-center justify-center space-x-2"
          >
            <span className="material-symbols-outlined text-lg">shopping_bag</span>
            <span>Add Custom Bag Spec to Cart</span>
          </button>
        </div>
      </div>
    </main>
  );
}
