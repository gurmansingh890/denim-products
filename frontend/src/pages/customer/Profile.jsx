import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function Profile() {
  const { user } = useAuthStore();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadOrders() {
      try {
        const res = await api.get('/orders/');
        setOrders(res.data);
      } catch (err) {
        console.error('Failed to load user orders', err);
      } finally {
        setLoading(false);
      }
    }
    loadOrders();
  }, []);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      {/* User Banner */}
      <div className="bg-surface-container p-8 border border-dashed border-outline-variant rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center space-x-4">
          <div className="w-16 h-16 rounded-full bg-primary text-white font-headline-md text-2xl flex items-center justify-center font-bold">
            {user?.name?.[0] || 'U'}
          </div>
          <div>
            <span className="font-stitch-label text-xs text-secondary">REGISTERED GARMENT WEARER</span>
            <h2 className="font-headline-lg text-2xl text-primary font-bold">{user?.name || 'Valued Customer'}</h2>
            <p className="font-body-md text-xs text-on-surface-variant">{user?.email} • Role: {user?.role}</p>
          </div>
        </div>

        <div className="flex space-x-3">
          <Link to="/support" className="border border-outline-variant px-4 py-2 rounded font-label-md text-xs hover:bg-surface-container-high">
            Support Hub
          </Link>
          {user?.role === 'business' && (
            <Link to="/business/dashboard" className="bg-secondary text-white px-4 py-2 rounded font-label-md text-xs">
              Go to Artisan Studio
            </Link>
          )}
        </div>
      </div>

      {/* Order History Section */}
      <div className="space-y-6">
        <h3 className="font-headline-md text-2xl text-primary font-bold">Order & Production History</h3>

        {loading ? (
          <p className="font-label-md text-on-surface-variant">Loading orders...</p>
        ) : orders.length === 0 ? (
          <div className="p-8 bg-surface-container text-center rounded border border-dashed border-outline-variant">
            <p className="font-body-md text-on-surface-variant">No orders placed yet.</p>
            <Link to="/explore" className="mt-4 inline-block text-secondary font-label-md text-sm underline">Explore Collection</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-surface-container-low p-6 border border-outline-variant rounded flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div className="space-y-1">
                  <div className="flex items-center space-x-3">
                    <span className="font-headline-md text-lg text-primary font-bold">Order #{ord._id?.slice(-8).toUpperCase()}</span>
                    <LeatherTagBadge text={ord.production_status || 'confirmed'} />
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant">
                    Placed: {new Date(ord.created_at || Date.now()).toLocaleDateString()} • Items: {ord.items?.length || 1} • Total: ${ord.total?.toFixed(2)}
                  </p>
                </div>

                <Link 
                  to={`/orders/${ord._id}`}
                  className="bg-primary text-white px-4 py-2 font-label-md text-xs rounded hover:bg-primary-container"
                >
                  Track Pipeline
                </Link>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
