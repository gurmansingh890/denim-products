import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useCartStore } from '../../store/useCartStore';
import { useAuthStore } from '../../store/useAuthStore';
import { useGeolocation } from '../../hooks/useGeolocation';
import api from '../../api/client';
import PriceBreakdownTable from '../../components/PriceBreakdownTable';

export default function Checkout() {
  const navigate = useNavigate();
  const { items, removeItem, clearCart, getSubtotal, getCustomizationTotal } = useCartStore();
  const { user, isAuthenticated } = useAuthStore();
  const { city: geoCity, detectLocation, loading: geoLoading } = useGeolocation();

  const [address, setAddress] = useState({
    name: user?.name || '',
    street: '142 Bedford Ave, Apt 3B',
    city: 'Brooklyn',
    state: 'NY',
    zip_code: '11211',
    country: 'USA'
  });

  const [deliveryEstimate, setDeliveryEstimate] = useState({
    delivery_fee: 15.0,
    estimated_delivery_days: '3-5 Business Days'
  });

  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    async function estimate() {
      try {
        const res = await api.post('/location/estimate-delivery', {
          city: address.city || geoCity
        });
        setDeliveryEstimate(res.data);
      } catch (err) {
        console.error('Location estimation error', err);
      }
    }
    estimate();
  }, [address.city, geoCity]);

  const subtotal = getSubtotal();
  const customizationTotal = getCustomizationTotal();
  const deliveryFee = deliveryEstimate.delivery_fee || 15.0;
  const tax = Math.round((subtotal + customizationTotal) * 0.08 * 100) / 100;
  const grandTotal = subtotal + customizationTotal + deliveryFee + tax;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();
    if (items.length === 0) return;
    setPlacingOrder(true);

    try {
      const orderPayload = {
        business_id: items[0]?.business_id || 'b1',
        items: items.map(item => ({
          product_id: item.product_id,
          product_title: item.product_title,
          product_image: item.product_image,
          customization_selections: item.customization_selections,
          quantity: item.quantity,
          unit_price: item.unit_price,
          customization_price: item.customization_price
        })),
        delivery_address: address,
        payment_method: 'credit_card'
      };

      const res = await api.post('/orders/', orderPayload);
      clearCart();
      navigate(`/orders/${res.data._id || res.data.id}`);
    } catch (err) {
      console.error('Order placement failed', err);
      alert('Could not place order. Please try again.');
    } finally {
      setPlacingOrder(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center">
        <span className="material-symbols-outlined text-5xl text-on-surface-variant mb-4">shopping_basket</span>
        <h2 className="font-headline-lg text-2xl text-primary font-bold">Your Bundle is Empty</h2>
        <p className="font-body-md text-on-surface-variant mt-2">Explore our artisanal collection or configure a custom denim fit.</p>
        <Link to="/explore" className="mt-6 inline-block bg-primary text-on-primary px-8 py-3 rounded font-label-md text-sm">
          Explore Collection
        </Link>
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12">
      <div className="mb-8">
        <span className="font-stitch-label text-xs text-secondary tracking-widest">CHECKOUT & DELIVERY</span>
        <h2 className="font-headline-lg text-3xl md:text-headline-lg text-primary">Finalize Your Order</h2>
      </div>

      <div className="grid lg:grid-cols-12 gap-12">
        {/* Left Column: Form & Items (7 cols) */}
        <div className="lg:col-span-7 space-y-8">
          {/* Cart Items List */}
          <div className="bg-surface-container p-6 border border-dashed border-outline-variant rounded">
            <h3 className="font-headline-md text-xl text-primary font-bold mb-4">Craft Bundle Items ({items.length})</h3>

            <div className="space-y-4">
              {items.map((item) => (
                <div key={item.cart_item_id} className="flex space-x-4 p-4 bg-surface border border-outline-variant rounded items-center">
                  <img 
                    src={item.product_image || 'https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=200&auto=format&fit=crop&q=80'} 
                    alt={item.product_title}
                    className="w-20 h-20 object-cover rounded border border-primary/10" 
                  />
                  <div className="flex-1 space-y-1">
                    <h4 className="font-headline-md text-lg text-primary font-bold">{item.product_title}</h4>
                    {item.customization_selections?.length > 0 ? (
                      <div className="text-xs font-stitch-label text-secondary">
                        Custom Specs: {item.customization_selections.map(s => s.option_name).join(' • ')}
                      </div>
                    ) : (
                      <div className="text-xs font-stitch-label text-on-surface-variant">Standard Heritage Fit</div>
                    )}
                    <p className="font-label-md text-sm text-primary font-bold">
                      ${(item.unit_price + item.customization_price).toFixed(2)} x {item.quantity}
                    </p>
                  </div>
                  <button 
                    onClick={() => removeItem(item.cart_item_id)}
                    className="text-on-surface-variant hover:text-error p-2"
                    title="Remove item"
                  >
                    <span className="material-symbols-outlined text-sm">delete</span>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Delivery Address Form */}
          <form onSubmit={handlePlaceOrder} className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-6">
            <div className="flex justify-between items-center border-b border-primary/10 pb-3">
              <h3 className="font-headline-md text-xl text-primary font-bold">Shipping Destination</h3>
              <button 
                type="button" 
                onClick={detectLocation} 
                className="text-xs font-stitch-label text-secondary hover:underline flex items-center space-x-1"
              >
                <span className="material-symbols-outlined text-sm">my_location</span>
                <span>{geoLoading ? 'Detecting...' : 'Detect Geolocation'}</span>
              </button>
            </div>

            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Full Name</label>
                <input 
                  type="text" 
                  required
                  value={address.name}
                  onChange={(e) => setAddress({...address, name: e.target.value})}
                  className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
                />
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Street Address</label>
                <input 
                  type="text" 
                  required
                  value={address.street}
                  onChange={(e) => setAddress({...address, street: e.target.value})}
                  className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
                />
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">City</label>
                <input 
                  type="text" 
                  required
                  value={address.city}
                  onChange={(e) => setAddress({...address, city: e.target.value})}
                  className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-label-md text-xs text-on-surface-variant mb-1">State</label>
                  <input 
                    type="text" 
                    required
                    value={address.state}
                    onChange={(e) => setAddress({...address, state: e.target.value})}
                    className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
                  />
                </div>
                <div>
                  <label className="block font-label-md text-xs text-on-surface-variant mb-1">ZIP Code</label>
                  <input 
                    type="text" 
                    required
                    value={address.zip_code}
                    onChange={(e) => setAddress({...address, zip_code: e.target.value})}
                    className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
                  />
                </div>
              </div>
            </div>

            {/* Delivery Estimate Box */}
            <div className="bg-surface-container-low p-4 border border-outline-variant/60 rounded flex items-center justify-between text-xs font-stitch-label text-primary">
              <div className="flex items-center space-x-2">
                <span className="material-symbols-outlined text-secondary">local_shipping</span>
                <span>ESTIMATED TIMELINE: <strong>{deliveryEstimate.estimated_delivery_days}</strong></span>
              </div>
              <span className="text-secondary font-bold">${deliveryFee.toFixed(2)} Express</span>
            </div>

            <button 
              type="submit"
              disabled={placingOrder}
              className="w-full bg-secondary text-on-secondary py-4 font-headline-md text-lg rounded hover:bg-secondary/90 active:scale-95 transition-transform shadow-md"
            >
              {placingOrder ? 'Confirming & Registering Loom...' : `Place Order • $${grandTotal.toFixed(2)}`}
            </button>
          </form>
        </div>

        {/* Right Column: Price Manifest (5 cols) */}
        <div className="lg:col-span-5 space-y-8 sticky top-28 h-fit">
          <PriceBreakdownTable 
            basePrice={subtotal}
            selections={items.flatMap(i => i.customization_selections || [])}
            artisanFee={25.0}
            deliveryFee={deliveryFee}
            tax={tax}
          />
        </div>
      </div>
    </main>
  );
}
