import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import api from '../../api/client';
import ProductionStatusStepper from '../../components/ProductionStatusStepper';
import ArtisanProfileSnippet from '../../components/ArtisanProfileSnippet';

export default function OrderTracking() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchOrder() {
      try {
        const res = await api.get(`/orders/${orderId || 'ord_1001'}`);
        setOrder(res.data);
      } catch (err) {
        console.error('Failed to load order', err);
      } finally {
        setLoading(false);
      }
    }
    fetchOrder();
  }, [orderId]);

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-label-md text-on-surface-variant">
        Fetching live shuttle loom pipeline status...
      </div>
    );
  }

  if (!order) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <h2 className="font-headline-lg text-2xl text-primary font-bold">Order Not Found</h2>
        <Link to="/profile" className="mt-4 inline-block text-secondary font-label-md text-sm underline">View My Profile</Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      {/* Header Info */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-dashed border-outline-variant pb-6">
        <div>
          <span className="font-stitch-label text-xs text-secondary tracking-widest">LIVE CRAFT TRACKER</span>
          <h2 className="font-headline-lg text-3xl text-primary font-bold">Order #{order._id?.slice(-8).toUpperCase()}</h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Placed on {new Date(order.created_at || Date.now()).toLocaleDateString()} • Artisan: {order.business_name || 'Matsui Dye House'}
          </p>
        </div>

        <div className="mt-4 md:mt-0 flex space-x-3">
          <Link 
            to="/support" 
            className="border border-outline-variant px-4 py-2 rounded font-label-md text-xs hover:bg-surface-container"
          >
            Request Fit Support
          </Link>
          <div className="leather-patch px-4 py-2 font-stitch-label text-xs">
            EST. DELIVERY: {order.delivery_estimate || '4-6 Days'}
          </div>
        </div>
      </div>

      {/* Production Status Stepper */}
      <ProductionStatusStepper 
        currentStatus={order.production_status || 'stitching'}
        history={order.status_history || []}
      />

      {/* Grid: Artisan Snippet & Order Items */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Artisan Assignment Card */}
        <div className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4">
          <h3 className="font-headline-md text-xl text-primary font-bold">Assigned Craft Workshop</h3>
          <ArtisanProfileSnippet 
            name={order.business_name || "Matsui Dye House"}
            location="Kyoto, Japan"
            specialty="Natural Indigo & Union Special Stitching"
            avatar="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80"
            tag="ASSIGNED MAKER"
          />
          <p className="font-body-md text-xs text-on-surface-variant">
            Your denim is currently undergoing custom chain-stitching on an authentic vintage Union Special 43200G hemming machine.
          </p>
        </div>

        {/* Itemized Order Summary */}
        <div className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4">
          <h3 className="font-headline-md text-xl text-primary font-bold">Garment Spec Manifest</h3>
          
          <div className="space-y-3">
            {order.items?.map((item, idx) => (
              <div key={idx} className="flex justify-between items-center py-2 border-b border-outline-variant/30 text-xs">
                <div>
                  <p className="font-headline-md text-sm text-primary font-bold">{item.product_title}</p>
                  {item.customization_selections?.length > 0 && (
                    <p className="font-stitch-label text-secondary text-[10px]">
                      {item.customization_selections.map(s => s.option_name).join(' • ')}
                    </p>
                  )}
                </div>
                <p className="font-label-md text-sm text-primary font-bold">${((item.unit_price + item.customization_price) * item.quantity).toFixed(2)}</p>
              </div>
            ))}
          </div>

          <div className="pt-4 border-t border-primary flex justify-between font-headline-md text-lg text-primary font-bold">
            <span>Total Paid</span>
            <span>${order.total?.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </main>
  );
}
