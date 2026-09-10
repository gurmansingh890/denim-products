import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container py-16 px-4 md:px-margin-desktop border-t border-dashed border-outline-variant">
      <div className="max-w-7xl mx-auto grid md:grid-cols-12 gap-12">
        <div className="md:col-span-5 space-y-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white shadow-sm">
              <span className="material-symbols-outlined text-2xl">texture</span>
            </div>
            <div>
              <h2 className="font-headline-lg text-2xl text-primary font-bold">Indigo & Stitch</h2>
              <p className="font-stitch-label text-[10px] text-secondary tracking-widest uppercase">HANDMADE DENIM & BAG STUDIO</p>
            </div>
          </div>

          <p className="font-body-md text-sm text-on-surface-variant max-w-md leading-relaxed">
            Preserving the heritage of shuttle-loom selvedge denim weaving and handcrafted leather bag stitching through digital transparency and direct artisan collaboration.
          </p>

          <div className="flex items-center space-x-4">
            <span className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">share</span>
            </span>
            <span className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">location_on</span>
            </span>
            <span className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center hover:bg-primary hover:text-white transition-colors cursor-pointer shadow-sm">
              <span className="material-symbols-outlined text-sm">mail</span>
            </span>
          </div>
        </div>
        
        <div className="md:col-span-3">
          <h4 className="font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-4">Artisanal Collections</h4>
          <ul className="space-y-2.5 font-label-md text-xs text-on-surface-variant">
            <li><Link to="/explore?category=Handcrafted Bags" className="hover:text-secondary font-bold text-primary">👜 Handcrafted Bags</Link></li>
            <li><Link to="/explore?category=Raw Selvedge Denim" className="hover:text-secondary">👖 Raw Selvedge Jeans</Link></li>
            <li><Link to="/explore?category=Artisanal Jackets" className="hover:text-secondary">🧥 Hand-Dyed Jackets</Link></li>
            <li><Link to="/explore?category=Accessories & Aprons" className="hover:text-secondary">🎽 Indigo Aprons & Pouches</Link></li>
            <li><Link to="/customize/p1" className="hover:text-secondary">✂️ Custom Bag & Fitting Studio</Link></li>
          </ul>
        </div>
        
        <div className="md:col-span-4">
          <h4 className="font-label-md text-xs text-primary font-bold uppercase tracking-wider mb-4">Artisan Registry Dispatch</h4>
          <p className="font-body-md text-xs text-on-surface-variant mb-4">
            Subscribe for limited batch denim bag drops, weaver stories, and exclusive shuttle loom fabric releases.
          </p>

          <form onSubmit={(e) => { e.preventDefault(); alert('Subscribed to Artisan Registry!'); }} className="space-y-2">
            <div className="flex">
              <input 
                type="email" 
                placeholder="Enter your email address..."
                className="w-full px-4 py-2.5 bg-surface border border-outline-variant rounded-l font-label-md text-xs text-primary focus:outline-none focus:border-secondary"
                required
              />
              <button 
                type="submit"
                className="bg-secondary text-white px-5 py-2.5 rounded-r font-label-md text-xs font-bold hover:bg-secondary/90 transition-colors"
              >
                Join
              </button>
            </div>
            <p className="font-stitch-label text-[10px] text-on-surface-variant">NO SPAM. ONLY HERITAGE DENIM DROPS.</p>
          </form>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/30 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="font-stitch-label text-[10px] text-on-surface-variant">© 2026 INDIGO & STITCH CO. REGISTERED CRAFT HOUSE.</p>
        <p className="font-stitch-label text-[10px] text-on-surface-variant">KYOTO • OKAYAMA • KURASHIKI • BROOKLYN</p>
      </div>
    </footer>
  );
}
