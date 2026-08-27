import React, { useState } from 'react';

export default function BulkBuyerDashboard() {
  const [quoteSubmitted, setQuoteSubmitted] = useState(false);
  const [quoteForm, setQuoteForm] = useState({
    company: '',
    yards_needed: 500,
    fabric_type: '14.5oz Kyoto Slub Selvedge',
    target_delivery: 'October 2026'
  });

  const handleSubmitQuote = (e) => {
    e.preventDefault();
    setQuoteSubmitted(true);
  };

  return (
    <main className="max-w-7xl mx-auto px-4 md:px-margin-desktop py-12 space-y-10">
      <div className="border-b border-dashed border-outline-variant pb-6">
        <span className="font-stitch-label text-xs text-secondary tracking-widest">B2B WHOLESALE DENIM PORTAL</span>
        <h2 className="font-headline-lg text-3xl text-primary font-bold">Bulk Denim Purchaser Dashboard</h2>
        <p className="font-body-md text-xs text-on-surface-variant">
          Source wholesale shuttle-loom selvedge roll goods, custom fabric developments, and volume manufacturing contracts.
        </p>
      </div>

      <div className="grid lg:grid-cols-12 gap-8">
        {/* Bulk Catalog Summary (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <h3 className="font-headline-md text-xl text-primary font-bold">Wholesale Fabric Roll Goods</h3>

          <div className="grid sm:grid-cols-2 gap-4">
            <div className="bg-surface-container-low p-4 border border-outline-variant rounded space-y-2">
              <span className="leather-patch px-2 py-0.5 text-[9px]">100 YARD BOLT</span>
              <h4 className="font-headline-md text-lg text-primary font-bold">Kyoto Slub Selvedge Roll</h4>
              <p className="font-body-md text-xs text-on-surface-variant">14.5oz Unsanforized. Width: 31 inches.</p>
              <p className="font-label-md text-sm text-secondary font-bold">$18.50 / yard</p>
            </div>

            <div className="bg-surface-container-low p-4 border border-outline-variant rounded space-y-2">
              <span className="leather-patch px-2 py-0.5 text-[9px]">250 YARD BOLT</span>
              <h4 className="font-headline-md text-lg text-primary font-bold">Ocean Broken Twill Roll</h4>
              <p className="font-body-md text-xs text-on-surface-variant">15.0oz Deep Indigo. Width: 30.5 inches.</p>
              <p className="font-label-md text-sm text-secondary font-bold">$16.80 / yard</p>
            </div>
          </div>
        </div>

        {/* Bulk Quote Request Form (5 cols) */}
        <div className="lg:col-span-5 bg-surface-container p-6 border border-dashed border-outline-variant rounded space-y-4">
          <h3 className="font-headline-md text-xl text-primary font-bold">Request Wholesale Quote</h3>

          {quoteSubmitted ? (
            <div className="p-6 bg-surface text-center rounded border border-secondary text-secondary space-y-2">
              <span className="material-symbols-outlined text-3xl">mark_email_read</span>
              <h4 className="font-headline-md text-lg font-bold">Quote Request Submitted</h4>
              <p className="font-body-md text-xs text-on-surface-variant">
                Our mill liaison will prepare custom yardage pricing for <strong>{quoteForm.company}</strong> within 24 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmitQuote} className="space-y-4">
              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Company / Atelier Name</label>
                <input 
                  type="text" required
                  placeholder="e.g., Brooklyn Craft Atelier"
                  value={quoteForm.company}
                  onChange={(e) => setQuoteForm({...quoteForm, company: e.target.value})}
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
                />
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Fabric Weight / Weave</label>
                <select 
                  value={quoteForm.fabric_type}
                  onChange={(e) => setQuoteForm({...quoteForm, fabric_type: e.target.value})}
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
                >
                  <option value="14.5oz Kyoto Slub Selvedge">14.5oz Kyoto Slub Selvedge</option>
                  <option value="15.0oz Ocean Broken Twill">15.0oz Ocean Broken Twill</option>
                  <option value="18.0oz Heavy Obsidian Hemp">18.0oz Heavy Obsidian Hemp</option>
                </select>
              </div>

              <div>
                <label className="block font-label-md text-xs text-on-surface-variant mb-1">Estimated Yardage Needed</label>
                <input 
                  type="number" required min={50} step={50}
                  value={quoteForm.yards_needed}
                  onChange={(e) => setQuoteForm({...quoteForm, yards_needed: parseInt(e.target.value)})}
                  className="w-full p-2.5 bg-surface border border-outline-variant rounded font-label-md text-sm"
                />
              </div>

              <button type="submit" className="w-full bg-secondary text-white py-3 font-label-md text-xs rounded hover:bg-secondary/90 shadow">
                Submit Bulk RFQ
              </button>
            </form>
          )}
        </div>
      </div>
    </main>
  );
}
