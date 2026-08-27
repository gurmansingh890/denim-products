import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useCartStore } from '../../store/useCartStore';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';
import { CopperRivet } from '../../components/CopperRivet';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function Customization() {
  const { productId } = useParams();
  const navigate = useNavigate();
  const addItemToCart = useCartStore((state) => state.addItem);

  const [product, setProduct] = useState(null);
  const [optionGroups, setOptionGroups] = useState([]);
  const [selections, setSelections] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [prodRes, optRes] = await Promise.all([
          api.get(`/products/${productId || 'p1'}`),
          api.get('/customizations/options')
        ]);
        setProduct(prodRes.data);
        setOptionGroups(optRes.data);

        // Set default selections for each group
        const defaults = {};
        optRes.data.forEach(group => {
          if (group.options?.length > 0) {
            defaults[group.id] = group.options[0];
          }
        });
        setSelections(defaults);
      } catch (err) {
        console.error('Failed to load configurator data', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [productId]);

  const handleSelectOption = (groupId, option) => {
    setSelections(prev => ({ ...prev, [groupId]: option }));
  };

  const formattedSelections = Object.entries(selections).map(([groupId, opt]) => ({
    group: groupId,
    option_name: opt.name,
    price_delta: opt.price_delta || 0
  }));

  const handleAddCustomToCart = () => {
    if (!product) return;
    addItemToCart(product, formattedSelections, 1);
    navigate('/checkout');
  };

  if (loading) {
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
          {optionGroups.map((group, gIdx) => (
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
                {group.options.map((opt) => {
                  const isSelected = selections[group.id]?.id === opt.id;
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
                          {opt.price_delta > 0 ? `+$${opt.price_delta.toFixed(2)}` : 'Base Standard'}
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
            <h4 className="font-headline-md text-2xl text-white mt-1">{product?.title || 'Custom Selvedge Spec'}</h4>

            {/* Simulated Garment Sketch with Stitch Overlay */}
            <div className="my-6 relative h-64 bg-primary-container rounded flex items-center justify-center border border-primary-fixed/20 overflow-hidden">
              <img 
                src={product?.images?.[0] || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=600&auto=format&fit=crop&q=80'} 
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
              <div><span className="text-secondary-fixed">FIT:</span> {selections.fit?.name}</div>
              <div><span className="text-secondary-fixed">WASH:</span> {selections.wash?.name}</div>
              <div><span className="text-secondary-fixed">HARDWARE:</span> {selections.hardware?.name}</div>
              <div><span className="text-secondary-fixed">STITCHING:</span> {selections.stitching?.name}</div>
            </div>
          </div>

          {/* Live Manifest Price Table */}
          <PriceBreakdownTable 
            basePrice={product?.base_price || 280.0}
            selections={formattedSelections}
            artisanFee={25.0}
            deliveryFee={15.0}
            tax={Math.round(((product?.base_price || 280.0) + formattedSelections.reduce((a, b) => a + b.price_delta, 0) + 25.0) * 0.08 * 100) / 100}
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
