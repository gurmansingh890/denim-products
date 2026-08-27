import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import { useCartStore } from '../store/useCartStore';

export default function Navbar() {
  const { user, isAuthenticated, logout } = useAuthStore();
  const cartItems = useCartStore((state) => state.items);
  const cartCount = cartItems.reduce((acc, i) => acc + i.quantity, 0);
  const navigate = useNavigate();

  return (
    <header className="sticky top-0 left-0 w-full z-50 flex justify-between items-center px-4 md:px-margin-desktop h-20 bg-surface/95 backdrop-blur-sm border-b border-primary/10">
      <div className="flex items-center space-x-8">
        <Link to="/" className="flex items-center space-x-2">
          <span className="material-symbols-outlined text-secondary text-2xl font-bold">texture</span>
          <h1 className="font-headline-lg text-2xl md:text-headline-lg font-bold text-primary tracking-tight">
            Indigo & Stitch
          </h1>
        </Link>
        
        <nav className="hidden md:flex space-x-6">
          <Link to="/" className="font-label-md text-label-md text-primary border-b-2 border-secondary font-bold pb-1">
            Shop
          </Link>
          <Link to="/explore" className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
            Explore
          </Link>
          <Link to="/customize/p1" className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
            Custom Fit
          </Link>
          <Link to="/support" className="font-label-md text-label-md text-on-surface-variant hover:text-secondary transition-colors">
            Customer Care
          </Link>
          
          {user?.role === 'business' && (
            <Link to="/business/dashboard" className="font-label-md text-label-md text-secondary font-bold hover:underline">
              Artisan Studio
            </Link>
          )}
          {user?.role === 'admin' && (
            <Link to="/admin" className="font-label-md text-label-md text-error font-bold hover:underline">
              Admin Portal
            </Link>
          )}
        </nav>
      </div>

      <div className="flex items-center space-x-6">
        <Link to="/explore" className="hidden lg:flex items-center space-x-2 text-on-surface-variant font-label-md hover:text-primary">
          <span className="material-symbols-outlined">search</span>
          <span>Search</span>
        </Link>

        <div className="flex items-center space-x-4">
          {!user || user.role === 'customer' ? (
            <Link to="/business/register" className="hidden sm:flex items-center space-x-1 text-xs font-stitch-label text-secondary hover:underline">
              <span className="material-symbols-outlined text-sm">storefront</span>
              <span>Become an Artisan</span>
            </Link>
          ) : null}

          <Link to="/checkout" className="relative p-2 text-secondary hover:scale-105 active:scale-95 transition-transform" title="Shopping Bundle">
            <span className="material-symbols-outlined text-2xl">shopping_basket</span>
            {cartCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-secondary text-white text-[10px] font-bold w-5 h-5 rounded-full flex items-center justify-center border-2 border-surface">
                {cartCount}
              </span>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="flex items-center space-x-3">
              <Link to="/profile" className="flex items-center space-x-2 border border-outline-variant rounded-full px-3 py-1 bg-surface-container hover:bg-surface-container-high transition-colors">
                <span className="material-symbols-outlined text-primary text-sm">person</span>
                <span className="font-label-md text-xs text-primary max-w-[100px] truncate">{user.name}</span>
              </Link>
              <button 
                onClick={logout} 
                className="text-xs font-stitch-label text-on-surface-variant hover:text-error"
                title="Log Out"
              >
                Exit
              </button>
            </div>
          ) : (
            <Link 
              to="/login" 
              className="bg-primary text-on-primary px-4 py-2 font-label-md text-xs rounded hover:bg-primary-container transition-colors"
            >
              Sign In
            </Link>
          )}
        </div>
      </div>
    </header>
  );
}
