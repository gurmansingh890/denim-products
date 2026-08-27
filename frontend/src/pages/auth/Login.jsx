import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuthStore } from '../../store/useAuthStore';

export default function Login() {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);

  const [email, setEmail] = useState('maya@example.com');
  const [password, setPassword] = useState('password123');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const user = await login(email, password);
      if (user.role === 'admin') {
        navigate('/admin');
      } else if (user.role === 'business') {
        navigate('/business/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <span className="font-stitch-label text-xs text-secondary tracking-widest">INDIGO & STITCH CO.</span>
          <h2 className="font-headline-lg text-2xl text-primary font-bold">Sign In to Workshop</h2>
        </div>

        {error && (
          <div className="p-3 bg-error-container text-on-error-container text-xs rounded border border-error">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Email Address</label>
            <input 
              type="email" required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Password</label>
            <input 
              type="password" required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <button 
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-white py-3.5 font-label-md text-sm rounded hover:bg-primary-container transition-colors"
          >
            {loading ? 'Authenticating...' : 'Sign In'}
          </button>
        </form>

        {/* Quick Demo Credentials Assistant */}
        <div className="p-4 bg-surface-container-low border border-outline-variant/60 rounded text-xs space-y-1">
          <p className="font-stitch-label font-bold text-secondary">DEMO LOGINS FOR TESTING:</p>
          <p className="text-on-surface-variant">Customer: <code>maya@example.com</code> / <code>password123</code></p>
          <p className="text-on-surface-variant">Artisan: <code>kenji@matsuidye.jp</code> / <code>artisan123</code></p>
          <p className="text-on-surface-variant">Admin: <code>admin@indigostitch.com</code> / <code>admin123</code></p>
        </div>

        <div className="text-center pt-2 text-xs font-label-md">
          <p className="text-on-surface-variant">
            Don't have an account? <Link to="/register" className="text-secondary font-bold underline">Create Account</Link>
          </p>
        </div>
      </div>
    </main>
  );
}
