import React from 'react';

export default function FabricSwatchCard({ title, weight, description, image, onOrderSwatch }) {
  return (
    <div className="bg-surface-container-low border border-dashed border-outline-variant p-2 group cursor-pointer transition-all hover:bg-white hover:shadow-xl rounded">
      <div className="aspect-[4/5] bg-surface overflow-hidden border border-primary/10 relative">
        <img 
          src={image} 
          alt={title}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
        />
        {weight && (
          <div className="absolute top-3 left-3 leather-patch px-3 py-1 text-[10px]">
            {weight}
          </div>
        )}
      </div>
      <div className="p-6 text-center">
        <h4 className="font-headline-md text-headline-md text-primary mb-2">{title}</h4>
        <div className="stitch-divider-h mb-4 opacity-20" />
        <p className="font-label-md text-label-md text-on-surface-variant text-xs line-clamp-2">
          {description}
        </p>
        <button 
          onClick={onOrderSwatch}
          className="mt-6 inline-block leather-patch px-4 py-2 font-stitch-label text-[11px] hover:scale-105 active:scale-95 transition-transform"
        >
          ORDER FABRIC SWATCH
        </button>
      </div>
    </div>
  );
}
