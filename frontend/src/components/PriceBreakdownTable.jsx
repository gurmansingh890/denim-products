import React from 'react';

export default function PriceBreakdownTable({ 
  basePrice = 280, 
  selections = [], 
  artisanFee = 25, 
  deliveryFee = 15, 
  tax = 28.40 
}) {
  const customizationTotal = selections.reduce((sum, s) => sum + (s.price_delta || 0), 0);
  const total = basePrice + customizationTotal + artisanFee + deliveryFee + tax;

  return (
    <div className="w-full bg-surface-container/50 p-6 border border-dashed border-outline-variant rounded">
      <div className="flex justify-between items-center mb-4 border-b border-primary/10 pb-2">
        <span className="font-stitch-label text-xs text-secondary tracking-widest uppercase">MANIFEST SPEC & COST BREAKDOWN</span>
        <span className="font-stitch-label text-[10px] text-on-surface-variant">SERIAL ID: #IND-{Math.floor(1000 + Math.random() * 9000)}</span>
      </div>

      <table className="w-full text-left font-label-md text-sm border-collapse">
        <tbody>
          <tr className="border-b border-dashed border-outline-variant/40 py-2">
            <td className="py-2.5 text-on-surface-variant">Base Garment (Shuttle Loom Woven)</td>
            <td className="py-2.5 text-right font-bold text-primary">${basePrice.toFixed(2)}</td>
          </tr>

          {selections.map((sel, idx) => (
            <tr key={idx} className="border-b border-dashed border-outline-variant/30 text-xs">
              <td className="py-2 pl-3 text-on-surface-variant">
                <span className="text-secondary font-bold uppercase mr-1">[{sel.group}]</span> {sel.option_name}
              </td>
              <td className="py-2 text-right text-primary">
                {sel.price_delta > 0 ? `+$${sel.price_delta.toFixed(2)}` : 'Included'}
              </td>
            </tr>
          ))}

          <tr className="border-b border-dashed border-outline-variant/40 py-2">
            <td className="py-2.5 text-on-surface-variant">Artisan Shuttle Loom Setup & Craft Fee</td>
            <td className="py-2.5 text-right text-primary">+${artisanFee.toFixed(2)}</td>
          </tr>
          
          <tr className="border-b border-dashed border-outline-variant/40 py-2">
            <td className="py-2.5 text-on-surface-variant">Estimated Courier Delivery</td>
            <td className="py-2.5 text-right text-primary">+${deliveryFee.toFixed(2)}</td>
          </tr>

          <tr className="border-b border-dashed border-outline-variant/40 py-2">
            <td className="py-2.5 text-on-surface-variant">Est. Sales Tax (8%)</td>
            <td className="py-2.5 text-right text-primary">+${tax.toFixed(2)}</td>
          </tr>
        </tbody>
      </table>

      <div className="mt-4 pt-4 border-t-2 border-primary flex justify-between items-center">
        <div>
          <p className="font-stitch-label text-[10px] text-secondary">FINAL CRAFT TOTAL</p>
          <p className="font-headline-md text-xl text-primary font-bold">${total.toFixed(2)}</p>
        </div>
        <div className="leather-patch px-3 py-1 text-[11px]">
          GUARANTEED SELVEDGE
        </div>
      </div>
    </div>
  );
}
