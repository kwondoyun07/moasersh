import React from 'react';
import { colors, font } from '../tokens';
import { ProductCard } from '../components/ProductCard';
import { useWishlist } from '../lib/wishlist';
import type { Listing } from '../types';

interface Props {
  onOpen?: (item: Listing) => void;
}

/** 관심목록 — Supabase에 저장된 찜 매물 그리드. */
export const Wishlist: React.FC<Props> = ({ onOpen }) => {
  const { items, toggle, loading } = useWishlist();

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, padding: '40px 56px 60px' }}>
      <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: '0 0 6px' }}>관심목록</h2>
      <div style={{ fontWeight: 600, fontSize: 14, color: colors.textMuted, marginBottom: 30 }}>
        찜한 매물 <b style={{ color: colors.ink, fontWeight: 800 }}>{items.length}</b>개
      </div>

      {loading ? (
        <div style={{ padding: '90px 0', textAlign: 'center', fontWeight: 600, fontSize: 15, color: colors.textFaint }}>
          불러오는 중…
        </div>
      ) : items.length > 0 ? (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,minmax(0,1fr))', gap: '28px 24px' }}>
          {items.map((it) => (
            <ProductCard key={it.id} item={it} showLike liked onClick={onOpen} onToggleLike={toggle} />
          ))}
        </div>
      ) : (
        <div style={{ padding: '90px 0', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 18, color: colors.inkSoft }}>아직 찜한 매물이 없어요</div>
          <div style={{ fontWeight: 500, fontSize: 14, color: colors.textFaint, marginTop: 8 }}>매물 카드의 ♡ 를 눌러 관심목록에 담아 보세요</div>
        </div>
      )}
    </div>
  );
};
