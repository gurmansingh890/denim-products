import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';

export default function BusinessRegistration() {
  const navigate = useNavigate();
  const { user, fetchProfile } = useAuthStore();
  const [step, setStep] = useState(1);

  const [form, setForm] = useState({
    business_type: 'artisan', // artisan, bulk_buyer, both
    business_name: '',
    tax_id: '',
    city: 'Kyoto, Japan',
    bio: '',
    portfolio_images: [
      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600&auto=format&fit=crop&q=80'
    ]
  });

  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      await api.post('/businesses/register', {
        business_type: form.business_type,
        business_name: form.business_name,
        tax_id: form.tax_id,
        location: {
          lat: 35.0116,
          lng: 135.7681,
          city: form.city
        },
        bio: form.bio,
        portfolio_images: form.portfolio_images
      });

      await fetchProfile();
      setStep(3); // Pending confirmation screen
    } catch (err) {
      console.error('Business registration error', err);
      alert(err.response?.data?.detail || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <main className="max-w-4xl mx-auto px-4 py-12 space-y-8">
      {/* Header */}
      <div className="text-center space-y-2">
        <span className="font-stitch-label text-xs text-secondary tracking-widest">ARTISAN ONBOARDING PORTAL</span>
        <h2 className="font-headline-lg text-3xl text-primary font-bold">Register Your Craft Studio</h2>
        <p className="font-body-md text-on-surface-variant max-w-xl mx-auto">
          Join Indigo & Stitch to offer handcrafted selvedge denim, custom tailoring, or wholesale bulk roll goods directly to global enthusiasts.
        </p>
      </div>

      {/* Stepper Header */}
      <div className="flex justify-center items-center space-x-4 border-y border-dashed border-outline-variant py-4 font-label-md text-xs">
        <span className={`px-4 py-1 rounded-full ${step === 1 ? 'bg-secondary text-white font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
          1. Studio Type
        </span>
        <span>→</span>
        <span className={`px-4 py-1 rounded-full ${step === 2 ? 'bg-secondary text-white font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
          2. Tax & Portfolio
        </span>
        <span>→</span>
        <span className={`px-4 py-1 rounded-full ${step === 3 ? 'bg-secondary text-white font-bold' : 'bg-surface-container text-on-surface-variant'}`}>
          3. Verification
        </span>
      </div>

      {step === 1 && (
        <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded space-y-6">
          <h3 className="font-headline-md text-xl text-primary font-bold">Select Business Role</h3>

          <div className="grid md:grid-cols-2 gap-6">
            <div 
              onClick={() => setForm({ ...form, business_type: 'artisan' })}
              className={`p-6 border-2 rounded cursor-pointer space-y-3 transition-all ${
                form.business_type === 'artisan' 
                  ? 'border-secondary bg-surface-container-low' 
                  : 'border-outline-variant bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-3xl text-secondary">texture</span>
              <h4 className="font-headline-md text-lg text-primary font-bold">Artisan Studio / Dye House</h4>
              <p className="font-body-md text-xs text-on-surface-variant">
                Craft custom shuttle-loom jeans, jackets, and handmade selvedge garments for direct customers.
              </p>
            </div>

            <div 
              onClick={() => setForm({ ...form, business_type: 'bulk_buyer' })}
              className={`p-6 border-2 rounded cursor-pointer space-y-3 transition-all ${
                form.business_type === 'bulk_buyer' 
                  ? 'border-secondary bg-surface-container-low' 
                  : 'border-outline-variant bg-surface'
              }`}
            >
              <span className="material-symbols-outlined text-3xl text-secondary">inventory</span>
              <h4 className="font-headline-md text-lg text-primary font-bold">Bulk Denim Supplier / Mill</h4>
              <p className="font-body-md text-xs text-on-surface-variant">
                Supply raw denim fabric bolts, hardware, and B2B wholesale denim products to ateliers.
              </p>
            </div>
          </div>

          <button 
            onClick={() => setStep(2)}
            className="w-full bg-primary text-white py-3 font-label-md text-xs rounded hover:bg-primary-container"
          >
            Continue to Studio Details
          </button>
        </div>
      )}

      {step === 2 && (
        <form onSubmit={handleSubmit} className="bg-surface-container p-8 border border-dashed border-outline-variant rounded space-y-6">
          <h3 className="font-headline-md text-xl text-primary font-bold">Studio & Verification Details</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Business Name</label>
              <input 
                type="text"
                required
                placeholder="e.g., Matsui Dye House & Loom"
                value={form.business_name}
                onChange={(e) => setForm({ ...form, business_name: e.target.value })}
                className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Tax ID / Business Registration Number</label>
              <input 
                type="text"
                required
                placeholder="e.g., JP-88492019"
                value={form.tax_id}
                onChange={(e) => setForm({ ...form, tax_id: e.target.value })}
                className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Workshop City & Country</label>
            <input 
              type="text"
              required
              placeholder="e.g., Kyoto, Japan"
              value={form.city}
              onChange={(e) => setForm({ ...form, city: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Studio Craft Biography & Heritage</label>
            <textarea 
              rows={3}
              required
              placeholder="Describe your weaving technique, indigo vats, and loom setup..."
              value={form.bio}
              onChange={(e) => setForm({ ...form, bio: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div className="flex space-x-4 pt-2">
            <button 
              type="button" 
              onClick={() => setStep(1)} 
              className="border border-outline-variant py-3 px-6 font-label-md text-xs rounded"
            >
              Back
            </button>
            <button 
              type="submit"
              disabled={submitting}
              className="flex-1 bg-secondary text-white py-3 font-label-md text-xs rounded hover:bg-secondary/90 shadow"
            >
              {submitting ? 'Submitting Application...' : 'Submit Studio Application'}
            </button>
          </div>
        </form>
      )}

      {step === 3 && (
        <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded text-center space-y-6">
          <span className="material-symbols-outlined text-5xl text-secondary">hourglass_top</span>
          <h3 className="font-headline-lg text-2xl text-primary font-bold">Application Pending Admin Verification</h3>
          <p className="font-body-md text-sm text-on-surface-variant max-w-lg mx-auto">
            Your business registration for <strong>{form.business_name}</strong> has been received! Our platform administrators will verify your tax ID and portfolio before approving your studio storefront.
          </p>

          <button 
            onClick={() => navigate('/business/dashboard')}
            className="bg-primary text-white px-8 py-3 font-label-md text-xs rounded hover:bg-primary-container"
          >
            Go to Artisan Studio Dashboard
          </button>
        </div>
      )}
    </main>
  );
}
