import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [pendingBiz, setPendingBiz] = useState([]);
  const [tickets, setTickets] = useState([]);
  const [offers, setOffers] = useState([]);
  const [loading, setLoading] = useState(true);

  const [newOffer, setNewOffer] = useState({
    code: 'FALL20',
    description: '20% off fall heritage selvedge',
    discount_type: 'percent',
    value: 20
  });

  useEffect(() => {
    async function loadAdminData() {
      try {
        const [analyticRes, bizRes, tickRes, offRes] = await Promise.all([
          api.get('/admin/analytics'),
          api.get('/businesses/pending'),
          api.get('/support/tickets'),
          api.get('/offers/')
        ]);
        setAnalytics(analyticRes.data);
        setPendingBiz(bizRes.data);
        setTickets(tickRes.data);
        setOffers(offRes.data);
      } catch (err) {
        console.error('Admin data load error', err);
      } finally {
        setLoading(false);
      }
    }
    loadAdminData();
  }, []);

  const handleVerifyBusiness = async (bizId, action) => {
    try {
      await api.patch(`/businesses/${bizId}/verify?action=${action}`);
      setPendingBiz(pendingBiz.filter(b => b._id !== bizId && b.id !== bizId));
      alert(`Business ${action}d successfully`);
    } catch (err) {
      console.error('Failed to verify business', err);
    }
  };

  const handleCreateOffer = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/offers/', newOffer);
      setOffers([...offers, res.data]);
      alert('Discount offer created!');
    } catch (err) {
      console.error('Failed to create offer', err);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center font-label-md text-on-surface-variant">
        Loading Platform Executive Control Center...
      </div>
    );
  }

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      {/* Admin Header */}
      <div className="border-b border-dashed border-outline-variant pb-6">
        <span className="font-stitch-label text-xs text-error tracking-widest">PLATFORM ADMINISTRATION PANEL</span>
        <h2 className="font-headline-lg text-3xl text-primary font-bold">Executive Control & Moderation</h2>
      </div>

      {/* Analytics Overview Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-[10px] text-on-surface-variant">TOTAL GROSS VOLUME</span>
          <h3 className="font-headline-md text-2xl text-primary font-bold mt-1">${analytics?.total_revenue?.toFixed(2)}</h3>
        </div>
        
        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-[10px] text-on-surface-variant">TOTAL ORDERS PLACED</span>
          <h3 className="font-headline-md text-2xl text-primary font-bold mt-1">{analytics?.total_orders}</h3>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-[10px] text-on-surface-variant">PENDING VERIFICATIONS</span>
          <h3 className="font-headline-md text-2xl text-secondary font-bold mt-1">{pendingBiz.length}</h3>
        </div>

        <div className="bg-surface-container-low p-6 border border-outline-variant rounded">
          <span className="font-stitch-label text-[10px] text-on-surface-variant">OPEN SUPPORT TICKETS</span>
          <h3 className="font-headline-md text-2xl text-error font-bold mt-1">{tickets.length}</h3>
        </div>
      </div>

      {/* Grid: Business Verification & Discount Offers */}
      <div className="grid lg:grid-cols-2 gap-8">
        {/* Pending Business Verification Queue */}
        <div className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4">
          <h3 className="font-headline-md text-xl text-primary font-bold">Pending Artisan Approvals</h3>

          {pendingBiz.length === 0 ? (
            <p className="font-body-md text-xs text-on-surface-variant">No pending business applications.</p>
          ) : (
            <div className="space-y-4">
              {pendingBiz.map((b) => (
                <div key={b._id} className="p-4 bg-surface border border-outline-variant rounded space-y-2">
                  <div className="flex justify-between items-start">
                    <div>
                      <h4 className="font-headline-md text-base text-primary font-bold">{b.business_name}</h4>
                      <p className="font-stitch-label text-[10px] text-secondary">TAX ID: {b.tax_id} • Location: {b.location?.city}</p>
                    </div>
                    <LeatherTagBadge text={b.business_type} />
                  </div>
                  <p className="font-body-md text-xs text-on-surface-variant line-clamp-2">{b.bio}</p>
                  
                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => handleVerifyBusiness(b._id, 'approve')}
                      className="bg-primary text-white px-4 py-1.5 font-label-md text-xs rounded hover:bg-primary-container"
                    >
                      Approve Studio
                    </button>
                    <button 
                      onClick={() => handleVerifyBusiness(b._id, 'reject')}
                      className="border border-error text-error px-4 py-1.5 font-label-md text-xs rounded hover:bg-error/10"
                    >
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Offers Manager */}
        <div className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4">
          <h3 className="font-headline-md text-xl text-primary font-bold">Discount Offers Manager</h3>

          <form onSubmit={handleCreateOffer} className="space-y-3 bg-surface p-4 border border-outline-variant rounded">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block font-label-md text-[10px] text-on-surface-variant">Promo Code</label>
                <input 
                  type="text" required
                  value={newOffer.code}
                  onChange={(e) => setNewOffer({...newOffer, code: e.target.value})}
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded font-label-md text-xs"
                />
              </div>
              <div>
                <label className="block font-label-md text-[10px] text-on-surface-variant">Discount Value</label>
                <input 
                  type="number" required
                  value={newOffer.value}
                  onChange={(e) => setNewOffer({...newOffer, value: parseFloat(e.target.value)})}
                  className="w-full p-2 bg-surface-container-low border border-outline-variant rounded font-label-md text-xs"
                />
              </div>
            </div>

            <div>
              <label className="block font-label-md text-[10px] text-on-surface-variant">Description</label>
              <input 
                type="text" required
                value={newOffer.description}
                onChange={(e) => setNewOffer({...newOffer, description: e.target.value})}
                className="w-full p-2 bg-surface-container-low border border-outline-variant rounded font-label-md text-xs"
              />
            </div>

            <button type="submit" className="bg-secondary text-white py-2 px-4 font-label-md text-xs rounded">
              Create Active Offer Code
            </button>
          </form>

          {/* Active Offers List */}
          <div className="space-y-2">
            {offers.map((off) => (
              <div key={off._id || off.code} className="p-3 bg-surface border border-outline-variant rounded flex justify-between items-center text-xs">
                <div>
                  <span className="font-stitch-label font-bold text-secondary">{off.code}</span> — {off.description}
                </div>
                <span className="font-label-md font-bold text-primary">{off.discount_type === 'percent' ? `${off.value}% OFF` : `$${off.value} OFF`}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </main>
  );
}
