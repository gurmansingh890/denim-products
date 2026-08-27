import React from 'react';

export default function ArtisanProfileSnippet({
  name = "Kenji Matsui",
  location = "Kyoto, Japan",
  specialty = "Master Selvedge Weaver",
  avatar = "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80",
  tag = "18oz SELVEDGE"
}) {
  return (
    <div className="bg-surface-container p-6 border border-primary/10 flex items-center space-x-6 max-w-md relative group cursor-pointer hover:bg-surface-container-high transition-colors rounded">
      <div className="relative w-20 h-20 rounded-full border-2 border-primary overflow-hidden flex-shrink-0">
        <img 
          src={avatar} 
          alt={name}
          className="w-full h-full object-cover" 
        />
      </div>
      <div>
        <span className="font-stitch-label text-stitch-label text-secondary">{specialty.toUpperCase()}</span>
        <h4 className="font-headline-md text-headline-md text-primary">{name}</h4>
        <p className="font-label-md text-label-md text-on-surface-variant italic text-xs">Handmade in {location}</p>
      </div>
      {tag && (
        <div className="absolute -top-3 -right-3 leather-patch px-3 py-1 font-stitch-label text-[10px] transform rotate-3">
          {tag}
        </div>
      )}
    </div>
  );
}
