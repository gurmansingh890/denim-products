import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function SellerDashboard() {
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showAddProduct, setShowAddProduct] = useState(false);
  const [newProd, setNewProd] = useState({
    title: '',
    description: '',
    base_price: 280,
    category: 'Raw Denim',
    fabric_weight: '14.5oz',
    is_customizable: true,
    ready_made_stock: 10
  });

  useEffect(() => {
    async function loadData() {
      try {
        const [ordRes, prodRes] = await Promise.all([
          api.get('/orders/'),
          api.get('/products/')
        ]);
        setOrders(ordRes.data);
        setProducts(prodRes.data);
      } catch (err) {
        console.error('Failed to load seller dashboard', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleUpdateStatus = async (orderId, newStatus) => {
    try {
      const res = await api.patch(`/orders/${orderId}/status`, {
        production_status: newStatus,
        note: `Production step advanced to ${newStatus} by artisan.`
      });
      setOrders(orders.map(o => (o._id === orderId ? res.data : o)));
    } catch (err) {
      console.error('Failed to update status', err);
      alert('Could not update status');
    }
  };

  const handleCreateProduct = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/products/', newProd);
      setProducts([res.data, ...products]);
      setShowAddProduct(false);
      alert('Product created!');
    } catch (err) {
      console.error('Failed to create product', err);
      alert('Could not create product');
    }
  };

  const totalEarnings = orders.reduce((sum, o) => sum + (o.total || 0), 0);

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      {/* Header & Stats */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-dashed border-outline-variant pb-6 gap-4">
        <div>
          <span className="font-stitch-label text-xs text-secondary tracking-widest">ARTISAN WORKSHOP CONTROL</span>
          <h2 className="font-headline-lg text-3xl text-primary font-bold">Matsui Dye House Studio Dashboard</h2>
        </div>

        <button 
          onClick={() => setShowAddProduct(!showAddProduct)}
          className="bg-secondary text-white px-6 py-3 font-label-md text-xs rounded hover:bg-secondary/90 shadow"
        >
          {showAddProduct ? 'Close Form' : '+ Add New Heritage Garment'}
        </button>
      </div>

      {/* Metrics Cards */}
      <div className="grid md:grid-cols-3 gap-6">
        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-xs text-on-surface-variant">TOTAL CRAFT EARNINGS</span>
          <h3 className="font-headline-md text-3xl text-primary font-bold mt-1">${totalEarnings.toFixed(2)}</h3>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-xs text-on-surface-variant">ACTIVE ORDERS IN PIPELINE</span>
          <h3 className="font-headline-md text-3xl text-primary font-bold mt-1">{orders.length}</h3>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-xs text-on-surface-variant">ACTIVE CATALOG PRODUCTS</span>
          <h3 className="font-headline-md text-3xl text-primary font-bold mt-1">{products.length}</h3>
        </div>
      </div>

      {/* Add Product Form */}
      {showAddProduct && (
        <form onSubmit={handleCreateProduct} className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4 max-w-2xl">
          <h3 className="font-headline-md text-xl text-primary font-bold">New Product Listing</h3>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Title</label>
              <input 
                type="text" required
                value={newProd.title}
                onChange={(e) => setNewProd({...newProd, title: e.target.value})}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Base Price ($)</label>
              <input 
                type="number" required
                value={newProd.base_price}
                onChange={(e) => setNewProd({...newProd, base_price: parseFloat(e.target.value)})}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Category</label>
              <select 
                value={newProd.category}
                onChange={(e) => setNewProd({...newProd, category: e.target.value})}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
              >
                <option value="Raw Denim">Raw Denim</option>
                <option value="Jackets">Jackets</option>
                <option value="Custom Fits">Custom Fits</option>
                <option value="Accessories">Accessories</option>
              </select>
            </div>
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Fabric Weight (oz)</label>
              <input 
                type="text" required
                value={newProd.fabric_weight}
                onChange={(e) => setNewProd({...newProd, fabric_weight: e.target.value})}
                className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Description</label>
            <textarea 
              rows={3} required
              value={newProd.description}
              onChange={(e) => setNewProd({...newProd, description: e.target.value})}
              className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <button type="submit" className="bg-primary text-white px-6 py-2.5 font-label-md text-xs rounded">
            Publish Product to Catalog
          </button>
        </form>
      )}

      {/* Production Pipeline Control Queue */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-2xl text-primary font-bold">Artisan Production Queue</h3>

        {loading ? (
          <p className="font-label-md text-on-surface-variant">Loading orders queue...</p>
        ) : orders.length === 0 ? (
          <div className="p-8 bg-surface-container text-center rounded border border-dashed border-outline-variant">
            <p className="font-body-md text-on-surface-variant">No orders assigned to workshop.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((ord) => (
              <div key={ord._id} className="bg-surface-container-low p-6 border border-outline-variant rounded space-y-4">
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 border-b border-primary/10 pb-4">
                  <div>
                    <span className="font-stitch-label text-xs text-secondary">ORDER #{ord._id?.slice(-8).toUpperCase()}</span>
                    <h4 className="font-headline-md text-lg text-primary font-bold">Customer: {ord.user_name || 'Maya Lin'}</h4>
                    <p className="font-body-md text-xs text-on-surface-variant">
                      Placed: {new Date(ord.created_at || Date.now()).toLocaleDateString()} • Items: {ord.items?.length || 1} • Total: ${ord.total?.toFixed(2)}
                    </p>
                  </div>
                  <LeatherTagBadge text={ord.production_status || 'confirmed'} />
                </div>

                {/* Status Update Buttons */}
                <div className="flex flex-wrap items-center gap-2 pt-2">
                  <span className="font-stitch-label text-xs text-on-surface-variant mr-2">ADVANCE PIPELINE:</span>
                  {['confirmed', 'in_production', 'stitching', 'shipped', 'delivered'].map((st) => (
                    <button
                      key={st}
                      onClick={() => handleUpdateStatus(ord._id, st)}
                      className={`px-3 py-1 font-stitch-label text-[10px] rounded uppercase transition-colors ${
                        ord.production_status === st 
                          ? 'bg-secondary text-white font-bold' 
                          : 'bg-surface border border-outline-variant text-primary hover:bg-surface-container-high'
                      }`}
                    >
                      {st.replace('_', ' ')}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
