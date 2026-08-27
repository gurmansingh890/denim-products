import React from 'react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-surface-container py-12 px-4 md:px-margin-desktop border-t border-dashed border-outline-variant">
      <div className="max-w-7xl mx-auto grid md:grid-cols-4 gap-12">
        <div className="col-span-2 space-y-6">
          <div className="flex items-center space-x-2">
            <span className="material-symbols-outlined text-secondary text-2xl font-bold">texture</span>
            <h2 className="font-headline-lg text-headline-lg text-primary">Indigo & Stitch</h2>
          </div>
          <p className="font-body-md text-body-md text-on-surface-variant max-w-sm">
            Preserving the heritage of textile craftsmanship through digital transparency, shuttle-loom selvedge, and artisanal collaboration.
          </p>
          <div className="flex space-x-4">
            <span className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">share</span>
            </span>
            <span className="w-10 h-10 border border-outline-variant rounded-full flex items-center justify-center hover:bg-primary hover:text-on-primary transition-colors cursor-pointer">
              <span className="material-symbols-outlined text-sm">language</span>
            </span>
          </div>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md text-primary font-bold mb-4">Workshop</h4>
          <ul className="space-y-2 font-label-md text-label-md text-on-surface-variant">
            <li><Link to="/explore" className="hover:text-secondary">Our Artisans</Link></li>
            <li><Link to="/customize/p1" className="hover:text-secondary">Dye Process</Link></li>
            <li><Link to="/explore" className="hover:text-secondary">Shuttle Loom Weave</Link></li>
            <li><Link to="/business/register" className="hover:text-secondary">Artisan Onboarding</Link></li>
          </ul>
        </div>
        
        <div>
          <h4 className="font-label-md text-label-md text-primary font-bold mb-4">Support & Care</h4>
          <ul className="space-y-2 font-label-md text-label-md text-on-surface-variant">
            <li><Link to="/support" className="hover:text-secondary">Customer Care Hub</Link></li>
            <li><Link to="/orders" className="hover:text-secondary">Track Production</Link></li>
            <li><Link to="/profile" className="hover:text-secondary">Saved Denim Specs</Link></li>
            <li><Link to="/support" className="hover:text-secondary">Sizing & Shrinkage Guide</Link></li>
          </ul>
        </div>
      </div>
      
      <div className="max-w-7xl mx-auto mt-12 pt-8 border-t border-outline-variant/20 flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
        <p className="font-stitch-label text-[10px] text-on-surface-variant">© 2026 INDIGO & STITCH CO. REGISTERED CRAFT HOUSE.</p>
        <p className="font-stitch-label text-[10px] text-on-surface-variant">KYOTO • OKAYAMA • BROOKLYN</p>
      </div>
    </footer>
  );
}
