import React, { useState } from 'react';
import { Link } from 'react-router-dom';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="max-w-md mx-auto px-4 py-16">
      <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded space-y-6 shadow-md">
        <div className="text-center space-y-2">
          <span className="font-stitch-label text-xs text-secondary tracking-widest">PASSWORD RECOVERY</span>
          <h2 className="font-headline-lg text-2xl text-primary font-bold">Reset Password</h2>
        </div>

        {submitted ? (
          <div className="p-4 bg-surface text-center rounded border border-secondary text-secondary space-y-2">
            <span className="material-symbols-outlined text-3xl">mark_email_read</span>
            <h4 className="font-headline-md text-lg font-bold">Reset Link Dispatched</h4>
            <p className="font-body-md text-xs text-on-surface-variant">
              If an account exists for <strong>{email}</strong>, a password reset link has been dispatched.
            </p>
            <Link to="/login" className="mt-4 inline-block text-xs font-label-md text-primary font-bold underline">
              Return to Login
            </Link>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Registered Email Address</label>
              <input 
                type="email" required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>

            <button 
              type="submit"
              className="w-full bg-primary text-white py-3.5 font-label-md text-sm rounded hover:bg-primary-container"
            >
              Send Password Reset Instructions
            </button>
          </form>
        )}
      </div>
    </main>
  );
}
