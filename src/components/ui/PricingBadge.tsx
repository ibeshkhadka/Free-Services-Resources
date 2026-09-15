import React from 'react';
import { PricingModel } from '../../types/resource';

const pricingStyles: Record<PricingModel, string> = {
  Free: 'bg-accent-soft text-accent border-accent/30',
  Freemium: 'bg-paper text-ink-2 border-hairline-2',
  Paid: 'bg-ink text-paper border-ink',
};

/** Single source for the pricing pill — replaces three copy-pasted color maps. */
export const PricingBadge: React.FC<{ pricing: PricingModel; className?: string }> = ({
  pricing,
  className = '',
}) => (
  <span
    className={`inline-flex items-center rounded-sm border px-1.5 py-px font-mono text-[10px] uppercase tracking-wider font-medium ${
      pricingStyles[pricing] || pricingStyles.Freemium
    } ${className}`}
  >
    {pricing}
  </span>
);
