import React from 'react';
import { markets, radius, type MarketKey } from '../tokens';

interface Props {
  market: MarketKey;
  /** Show the full label (e.g. "번개장터") vs short. Design uses full labels. */
}

export const MarketBadge: React.FC<Props> = ({ market }) => {
  const m = markets[market];
  return (
    <span
      style={{
        padding: '3px 8px',
        borderRadius: radius.sm,
        fontWeight: 700,
        fontSize: 11,
        background: m.bg,
        color: m.fg,
        whiteSpace: 'nowrap',
      }}
    >
      {m.label}
    </span>
  );
};
