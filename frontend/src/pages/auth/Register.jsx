import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Register() {
  const navigate = useNavigate();
  const register = useAuthStore((state) => state.register);

  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'customer' // customer, business, admin
  });

  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await register(form);
      if (user.role === 'business') {
        navigate('/business/register');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <span className="font-stitch-label text-xs text-secondary tracking-widest">JOIN THE MOVEMENT</span>
          <h2 className="font-headline-lg text-2xl text-primary font-bold">Create Account</h2>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-xs rounded border border-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Full Name</label>
            <input 
              type="text" required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Email Address</label>
            <input 
              type="email" required
              value={form.email}
              onChange={(e) => setForm({ ...form, email: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Password</label>
            <input 
              type="password" required
              value={form.password}
              onChange={(e) => setForm({ ...form, password: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Account Role</label>
            <select 
              value={form.role}
              onChange={(e) => setForm({ ...form, role: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            >
              <option value="customer">Customer (Garment Wearer)</option>
              <option value="business">Business (Artisan Weaver / Bulk Seller)</option>
            </select>
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-secondary text-white py-3.5 font-label-md text-sm rounded hover:bg-secondary/90 transition-colors shadow"
          >
            {loading ? 'Creating Account...' : 'Register Account'}
          </button>
        </form>

        <div className="text-center pt-2 text-xs font-label-md">
          <p className="text-on-surface-variant">
            Already registered? <Link to="/login" className="text-primary font-bold underline">Sign In</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
