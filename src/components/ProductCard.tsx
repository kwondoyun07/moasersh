import React from 'react';
import { colors, radius } from '../tokens';
import { splitPrice, type Listing } from '../types';
import { MarketBadge } from './MarketBadge';

interface Props {
  item: Listing;
  /** Renders the floating heart button over the photo. */
  showLike?: boolean;
  /** Filled red heart when true. */
  liked?: boolean;
  onClick?: (item: Listing) => void;
  onToggleLike?: (item: Listing) => void;
}

const ellipsis: React.CSSProperties = {
  whiteSpace: 'nowrap',
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};

/**
 * Vertical product card used in the Home "trending" grid, the search-results
 * grid, and the wishlist. Photo on top, marketplace badge + meta, title, price.
 */
export const ProductCard: React.FC<Props> = ({ item, showLike, liked, onClick, onToggleLike }) => {
  const { num, unit } = splitPrice(item.price);
  return (
    <div style={{ cursor: onClick ? 'pointer' : 'default' }} onClick={() => onClick?.(item)}>
      <div style={{ position: 'relative', height: 188, borderRadius: radius.lg, background: item.thumb }}>
        {showLike && (
          <button
            aria-label={liked ? '관심 해제' : '관심 등록'}
            onClick={(e) => { e.stopPropagation(); onToggleLike?.(item); }}
            style={{
              position: 'absolute', right: 12, top: 12, width: 34, height: 34,
              border: 0, borderRadius: '50%',
              background: liked ? '#FFE9E9' : 'rgba(255,255,255,.88)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 16, color: liked ? '#E8453C' : colors.textFaint, cursor: 'pointer',
            }}
          >
            {liked ? '♥' : '♡'}
          </button>
        )}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 7, margin: '13px 0 7px' }}>
        <MarketBadge market={item.market} />
        <span style={{ fontWeight: 500, fontSize: 12, color: colors.textFaint }}>
          {item.location} · {item.postedAt}
        </span>
      </div>

      <div style={{ ...ellipsis, fontWeight: 600, fontSize: 15, color: colors.ink }}>{item.title}</div>

      <div style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.02em', marginTop: 5, color: colors.ink }}>
        {num}
        <span style={{ fontSize: 14, fontWeight: 700 }}>{unit}</span>
      </div>
    </div>
  );
};
