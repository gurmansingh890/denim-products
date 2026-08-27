import React from 'react';

export function LeatherTagBadge({ text, className = "" }) {
  return (
    <div className={`leather-patch px-3 py-1 font-stitch-label text-[10px] uppercase tracking-wider ${className}`}>
      {text}
    </div>
  );
}

export function CopperRivet({ active = false, label = "", onClick }) {
  return (
    <div 
      onClick={onClick}
      className="flex items-center space-x-3 cursor-pointer group select-none"
    >
      <div className={`w-5 h-5 rounded-full border-2 transition-all flex items-center justify-center ${
        active 
          ? 'border-secondary bg-secondary-container shadow-inner scale-110' 
          : 'border-outline hover:border-secondary'
      }`}>
        {active && <div className="w-2.5 h-2.5 rounded-full bg-secondary" />}
      </div>
      {label && (
        <span className={`font-label-md text-sm ${active ? 'font-bold text-primary' : 'text-on-surface-variant group-hover:text-primary'}`}>
          {label}
        </span>
      )}
    </div>
  );
}
