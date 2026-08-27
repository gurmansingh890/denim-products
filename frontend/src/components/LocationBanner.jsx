import React from 'react';

export default function LocationBanner({ city = "Brooklyn, NY", artisanCount = 12, onDetect }) {
  return (
    <div className="w-full bg-primary text-on-primary py-2 px-4 md:px-margin-desktop flex justify-between items-center text-xs z-[60]">
      <div className="flex items-center space-x-2 mx-auto md:mx-0">
        <span className="material-symbols-outlined text-[16px] text-secondary-container">location_on</span>
        <p className="font-label-md text-label-md">
          Delivering to <span className="font-bold underline cursor-pointer" onClick={onDetect}>{city}</span> • Explore {artisanCount} Artisans near you
        </p>
      </div>
      <button 
        onClick={onDetect}
        className="hidden md:flex items-center space-x-1 text-[11px] font-stitch-label bg-primary-container px-3 py-0.5 rounded hover:bg-secondary transition-colors"
      >
        <span className="material-symbols-outlined text-[14px]">my_location</span>
        <span>Detect Location</span>
      </button>
    </div>
  );
}
