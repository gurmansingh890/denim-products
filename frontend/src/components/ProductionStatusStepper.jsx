import React from 'react';

const STEPS = [
  { id: 'confirmed', label: 'Order Confirmed', icon: 'inventory_2', desc: 'Queued at Kyoto Craft House' },
  { id: 'in_production', label: 'Indigo Dyeing', icon: 'water_drop', desc: 'Natural indigo fermentation' },
  { id: 'stitching', label: 'Stitching & Tailoring', icon: 'content_cut', desc: 'Union Special 43200G hem' },
  { id: 'shipped', label: 'Shipped & Handled', icon: 'local_shipping', desc: 'Express courier dispatched' },
  { id: 'delivered', label: 'Delivered', icon: 'check_circle', desc: 'Arrived at your doorstep' }
];

export default function ProductionStatusStepper({ currentStatus = 'stitching', history = [] }) {
  const currentIndex = STEPS.findIndex(s => s.id === currentStatus);
  const activeIdx = currentIndex >= 0 ? currentIndex : 2;

  return (
    <div className="w-full bg-surface-container-low p-6 border border-primary/10 rounded my-6">
      <div className="flex justify-between items-center mb-8 border-b border-dashed border-outline-variant pb-4">
        <div>
          <span className="font-stitch-label text-xs text-secondary tracking-widest">LIVE CRAFT PIPELINE</span>
          <h3 className="font-headline-md text-xl text-primary font-bold">Production Status Tracker</h3>
        </div>
        <div className="bg-primary text-on-primary px-3 py-1 font-stitch-label text-xs rounded">
          CURRENT: {STEPS[activeIdx]?.label.toUpperCase()}
        </div>
      </div>

      {/* Stepper horizontal line */}
      <div className="relative flex justify-between items-center max-w-4xl mx-auto px-4 py-6">
        {/* Background dashed line */}
        <div className="absolute top-1/2 left-8 right-8 -translate-y-1/2 h-0.5 border-t-2 border-dashed border-primary/20 -z-0" />

        {STEPS.map((step, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center group">
              <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all ${
                isDone 
                  ? 'bg-primary text-white shadow' 
                  : isCurrent 
                  ? 'bg-secondary text-white shadow-lg ring-4 ring-secondary/20 animate-pulse' 
                  : 'bg-surface-container-highest text-outline border border-outline-variant'
              }`}>
                <span className="material-symbols-outlined text-xl">{step.icon}</span>
              </div>
              
              <p className={`mt-3 font-label-md text-xs text-center max-w-[100px] ${
                isCurrent ? 'font-bold text-secondary' : isDone ? 'text-primary font-semibold' : 'text-on-surface-variant'
              }`}>
                {step.label}
              </p>
              <p className="font-stitch-label text-[9px] text-on-surface-variant text-center max-w-[110px] hidden sm:block mt-1">
                {step.desc}
              </p>
            </div>
          );
        })}
      </div>

      {/* History Log Timeline */}
      {history.length > 0 && (
        <div className="mt-8 pt-6 border-t border-dashed border-outline-variant">
          <h4 className="font-stitch-label text-xs text-on-surface-variant mb-4 uppercase">Status Log History</h4>
          <div className="space-y-3 pl-4 border-l-2 border-secondary/40">
            {history.map((item, index) => (
              <div key={index} className="relative pl-4">
                <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-secondary" />
                <p className="font-label-md text-xs font-bold text-primary">
                  {item.status.toUpperCase()} — <span className="font-normal text-on-surface-variant">{new Date(item.timestamp).toLocaleString()}</span>
                </p>
                {item.note && <p className="font-body-md text-xs text-on-surface-variant italic mt-0.5">{item.note}</p>}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
