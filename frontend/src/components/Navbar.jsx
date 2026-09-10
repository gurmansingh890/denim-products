import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 left-0 w-full z-50 bg-surface/95 backdrop-blur-md border-b border-primary/10 transition-all shadow-sm">
      {/* Top Artisanal Guarantee Bar */}
      <div className="bg-primary text-on-primary py-1.5 px-4 text-center text-xs font-stitch-label tracking-wider flex justify-between items-center border-b border-primary-container">
        <div className="hidden sm:flex items-center space-x-2 text-[11px] text-primary-fixed-dim">
          <span className="w-2 h-2 rounded-full bg-secondary inline-block animate-pulse" />
          <span>SHUTTLE-LOOM WOVEN & HAND-STITCHED BAGS</span>
        </div>
        <div className="mx-auto sm:mx-0 text-[11px] font-medium text-surface">
          Complimentary Worldwide Shipping on Artisanal Bags & Custom Fits
        </div>
        <div className="hidden lg:flex items-center space-x-4 text-[11px] text-primary-fixed-dim">
          <Link to="/explore?category=Handcrafted Bags" className="hover:text-white transition-colors">Artisanal Bags</Link>
          <span>•</span>
          <Link to="/support" className="hover:text-white transition-colors">Artisan Registry</Link>
        </div>
      </div>

      {/* Main Navigation */}
      <div className="max-w-7xl mx-auto flex justify-between items-center px-4 md:px-margin-desktop h-20">
        <div className="flex items-center space-x-8">
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded bg-primary flex items-center justify-center text-white shadow-sm group-hover:bg-secondary transition-colors">
              <span className="material-symbols-outlined text-2xl">texture</span>
            </div>
            <div>
              <h1 className="font-headline-lg text-xl md:text-2xl font-bold text-primary tracking-tight leading-none">
                Indigo & Stitch
              </h1>
              <span className="font-stitch-label text-[10px] text-secondary tracking-widest uppercase">
                HANDMADE DENIM & BAG STUDIO
              </span>
            </div>
          </Link>
          
          <nav className="hidden md:flex space-x-6">
            <Link 
              to="/" 
              className={`font-label-md text-xs py-1 transition-all ${
                isActive('/') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              Home
            </Link>

            <Link 
              to="/explore?category=Handcrafted Bags" 
              className={`font-label-md text-xs py-1 transition-all flex items-center space-x-1 ${
                location.search.includes('Handcrafted') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              <span>Handcrafted Bags</span>
              <span className="bg-secondary/10 text-secondary text-[10px] px-1.5 py-0.5 rounded font-bold">HOT</span>
            </Link>

            <Link 
              to="/explore" 
              className={`font-label-md text-xs py-1 transition-all ${
                isActive('/explore') && !location.search.includes('Handcrafted') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              All Crafts
            </Link>

            <Link 
              to="/customize/p1" 
              className={`font-label-md text-xs py-1 transition-all ${
                isActive('/customize/p1') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              Custom Configurator
            </Link>

            <Link 
              to="/support" 
              className={`font-label-md text-xs py-1 transition-all ${
                isActive('/support') ? 'text-secondary font-bold border-b-2 border-secondary' : 'text-primary hover:text-secondary'
              }`}
            >
              Artisan Care
            </Link>
            
            {user?.role === 'business' && (
              <Link to="/business/dashboard" className="font-label-md text-xs text-secondary font-bold hover:underline py-1">
                Artisan Studio
              </Link>
            )}
            {user?.role === 'admin' && (
              <Link to="/admin" className="font-label-md text-xs text-error font-bold hover:underline py-1">
                Admin Portal
              </Link>
            )}
          </nav>
        </div>

        <div className="flex items-center space-x-5">
          <Link to="/explore" className="hidden lg:flex items-center space-x-1.5 text-on-surface-variant font-label-md text-xs hover:text-primary transition-colors">
            <span className="material-symbols-outlined text-lg">search</span>
            <span>Search Catalog</span>
          </Link>

          {!user || user.role === 'customer' ? (
            <Link to="/business/register" className="hidden sm:flex items-center space-x-1 text-xs font-stitch-label text-secondary hover:underline">
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span>Become an Artisan</span>
            </Link>
          ) : null}

          {/* Cart Icon with badge */}
          <Link to="/checkout" className="relative p-2 text-primary hover:text-secondary transition-all" title="Artisanal Basket">
            <span className="material-symbols-outlined text-2xl">shopping_bag</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center shadow-md">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 border border-outline-variant rounded-full px-3 py-1 bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-primary text-sm">person</span>
                <span className="font-label-md text-xs text-primary max-w-[90px] truncate">{user.name}</span>
              </Link>
              <button 
                onClick={logout} 
                className="text-xs font-stitch-label text-on-surface-variant hover:text-error transition-colors"
                title="Log Out"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-primary text-on-primary px-4 py-2 font-label-md text-xs rounded hover:bg-primary-container transition-all shadow-sm"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
