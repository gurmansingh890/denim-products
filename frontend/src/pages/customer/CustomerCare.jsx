import React, { useState, useEffect } from 'react';
import api from '../../api/client';
import { useAuthStore } from '../../store/useAuthStore';
import { LeatherTagBadge } from '../../components/LeatherTagBadge';

export default function CustomerCare() {
  const { user } = useAuthStore();
  const [tickets, setTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);

  const [newTicket, setNewTicket] = useState({
    subject: '',
    category: 'Sizing & Shrinkage',
    message: '',
    order_id: ''
  });

  useEffect(() => {
    async function loadTickets() {
      try {
        const res = await api.get('/support/tickets');
        setTickets(res.data);
      } catch (err) {
        console.error('Failed to load tickets', err);
      } finally {
        setLoading(false);
      }
    }
    loadTickets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/support/tickets', newTicket);
      setTickets([res.data, ...tickets]);
      setShowForm(false);
      setNewTicket({ subject: '', category: 'Sizing & Shrinkage', message: '', order_id: '' });
    } catch (err) {
      console.error('Failed to create ticket', err);
      alert('Could not submit ticket');
    }
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-dashed border-outline-variant pb-6 gap-4">
        <div>
          <span className="font-stitch-label text-xs text-secondary tracking-widest">ARTISANAL HELP & SUPPORT</span>
          <h2 className="font-headline-lg text-3xl text-primary font-bold">Customer Care Portal</h2>
          <p className="font-body-md text-xs text-on-surface-variant">
            Connect directly with master tailors and customer care specialists regarding sizing, repairs, or order inquiries.
          </p>
        </div>

        <button 
          onClick={() => setShowForm(!showForm)}
          className="bg-secondary text-white px-6 py-3 font-label-md text-xs rounded hover:bg-secondary/90 shadow"
        >
          {showForm ? 'Close Ticket Form' : 'Submit New Ticket'}
        </button>
      </div>

      {/* Ticket Creation Form */}
      {showForm && (
        <form onSubmit={handleSubmit} className="bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-6 max-w-2xl">
          <h3 className="font-headline-md text-xl text-primary font-bold">New Support Inquiry</h3>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Subject</label>
            <input 
              type="text"
              required
              placeholder="e.g., Advice on unsanforized shrink-to-fit sizing"
              value={newTicket.subject}
              onChange={(e) => setNewTicket({ ...newTicket, subject: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Category</label>
              <select 
                value={newTicket.category}
                onChange={(e) => setNewTicket({ ...newTicket, category: e.target.value })}
                className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
              >
                <option value="Sizing & Shrinkage">Sizing & Shrinkage</option>
                <option value="Order Tracking">Order Tracking</option>
                <option value="Custom Spec Alteration">Custom Spec Alteration</option>
                <option value="Garment Repair">Garment Repair & Hemming</option>
              </select>
            </div>

            <div>
              <label className="block font-label-md text-xs text-on-surface-variant mb-1">Associated Order ID (Optional)</label>
              <input 
                type="text"
                placeholder="e.g., ord_1001"
                value={newTicket.order_id}
                onChange={(e) => setNewTicket({ ...newTicket, order_id: e.target.value })}
                className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
              />
            </div>
          </div>

          <div>
            <label className="block font-label-md text-xs text-on-surface-variant mb-1">Detailed Message</label>
            <textarea 
              rows={4}
              required
              placeholder="Describe your inquiry or sizing requirements..."
              value={newTicket.message}
              onChange={(e) => setNewTicket({ ...newTicket, message: e.target.value })}
              className="w-full p-3 bg-surface border border-outline-variant rounded font-label-md text-sm"
            />
          </div>

          <button 
            type="submit"
            className="bg-primary text-white py-3 px-8 font-label-md text-xs rounded hover:bg-primary-container"
          >
            Dispatch Ticket to Craft Team
          </button>
        </form>
      )}

      {/* Ticket History */}
      <div className="space-y-4">
        <h3 className="font-headline-md text-xl text-primary font-bold">My Support Tickets</h3>

        {loading ? (
          <p className="font-label-md text-on-surface-variant">Loading support tickets...</p>
        ) : tickets.length === 0 ? (
          <div className="p-8 bg-surface-container text-center rounded border border-dashed border-outline-variant">
            <p className="font-body-md text-on-surface-variant">No active support tickets.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {tickets.map((t) => (
              <div key={t._id} className="bg-surface-container-low p-6 border border-outline-variant rounded space-y-4">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-stitch-label text-[10px] text-secondary">{t.category?.toUpperCase()}</span>
                    <h4 className="font-headline-md text-lg text-primary font-bold">{t.subject}</h4>
                    <p className="font-stitch-label text-[10px] text-on-surface-variant">
                      Created: {new Date(t.created_at || Date.now()).toLocaleString()}
                    </p>
                  </div>
                  <LeatherTagBadge text={t.status || 'open'} />
                </div>

                <div className="bg-surface p-4 rounded border border-primary/10 space-y-3">
                  {t.messages?.map((m, idx) => (
                    <div key={idx} className="text-xs">
                      <p className="font-label-md font-bold text-primary">
                        {m.sender_name} <span className="font-normal text-on-surface-variant">({m.sender_role})</span>:
                      </p>
                      <p className="font-body-md text-on-surface-variant mt-0.5">{m.message}</p>
                    </div>
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
