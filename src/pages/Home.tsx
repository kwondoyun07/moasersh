import React, { useState } from 'react';
import { colors, font, markets, radius } from '../tokens';
import { trending } from '../data';
import type { Listing } from '../types';
import { ProductCard } from '../components/ProductCard';
import type { NavTarget } from '../components/AppHeader';
import { BellIcon, SearchIcon } from '../components/icons';

const NAV: { label: string; target: NavTarget }[] = [
  { label: '통합검색', target: 'search' },
  { label: '가격알림', target: 'alerts' },
  { label: '관심목록', target: 'wishlist' },
];

interface Props {
  loggedIn?: boolean;
  onHome?: () => void;
  onNavigate?: (target: NavTarget) => void;
  onSearch?: (query: string) => void;
  onBell?: () => void;
  onLogin?: () => void;
  onOpenItem?: (item: Listing) => void;
}

/**
 * Home / landing — big editorial hero with the unified search bar,
 * a yellow visual panel, and a "지금 뜨는 매물" grid.
 *
 * Width is fixed to 1440 to match the design reference; in production make the
 * outer container fluid (max-width + horizontal padding) and the hero stack
 * responsive below ~960px.
 */
export const Home: React.FC<Props> = ({ loggedIn, onHome, onNavigate, onSearch, onBell, onLogin, onOpenItem }) => {
  const [query, setQuery] = useState('');
  const submit = () => onSearch?.(query.trim());

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, background: colors.bg, maxWidth: 1440, width: '100%', margin: '0 auto' }}>
      {/* top nav */}
      <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 56px', borderBottom: `1px solid ${colors.line}` }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
          <div onClick={onHome} style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', cursor: 'pointer' }}>
            모아<span style={{ color: colors.yellowDeep }}>서치</span>
          </div>
          <nav style={{ display: 'flex', gap: 30, fontWeight: 600, fontSize: 15, color: colors.textMuted }}>
            {NAV.map((n, i) => (
              <span
                key={n.target}
                onClick={() => onNavigate?.(n.target)}
                style={{ cursor: 'pointer', ...(i === 0 ? { color: colors.ink } : null) }}
              >
                {n.label}
              </span>
            ))}
          </nav>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18 }}>
          <span onClick={onBell} style={{ display: 'inline-flex', cursor: 'pointer' }} aria-label="알림">
            <BellIcon />
          </span>
          {loggedIn ? (
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C84C,#E5A600)' }} />
          ) : (
            <button onClick={onLogin} style={{ height: 42, padding: '0 22px', border: 0, borderRadius: radius.md, background: colors.ink, color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}>
              로그인
            </button>
          )}
        </div>
      </header>

      {/* hero */}
      <section style={{ padding: '76px 56px 60px', display: 'flex', gap: 72, alignItems: 'center' }}>
        <div style={{ flex: 1 }}>
          <h1 style={{ fontWeight: 800, fontSize: 62, lineHeight: 1.06, letterSpacing: '-.045em', margin: 0 }}>
            중고 5곳을,<br />
            <span style={{ background: colors.yellow, padding: '0 12px', borderRadius: 8, WebkitBoxDecorationBreak: 'clone', boxDecorationBreak: 'clone' }}>
              한 번에 모아서.
            </span>
          </h1>
          <p style={{ fontWeight: 500, fontSize: 18, color: colors.textMuted, margin: '24px 0 0', lineHeight: 1.5 }}>
            당근 · 번개장터 · 중고나라 · 헬로마켓 · 세컨웨어를<br />한 번의 검색으로 모아 봅니다.
          </p>

          <div style={{ display: 'flex', alignItems: 'center', height: 70, background: colors.ink, borderRadius: radius.xl, padding: '0 8px 0 26px', marginTop: 36, maxWidth: 580 }}>
            <input
              className="moa-hero-search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => { if (e.key === 'Enter') submit(); }}
              placeholder="찾는 물건을 검색해 보세요"
              style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'inherit', fontWeight: 500, fontSize: 17, color: '#fff' }}
            />
            <button onClick={submit} aria-label="검색" style={{ width: 54, height: 54, border: 0, borderRadius: 13, background: colors.yellow, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <SearchIcon size={24} color={colors.ink} strokeWidth={2.6} />
            </button>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 9, marginTop: 22 }}>
            <span style={{ fontWeight: 600, fontSize: 13, color: colors.textFaint, marginRight: 2 }}>검색 마켓</span>
            {(Object.keys(markets) as (keyof typeof markets)[]).map((k) => {
              const m = markets[k];
              return (
                <span key={k} style={{ padding: '6px 11px', borderRadius: radius.md, fontWeight: 700, fontSize: 13, background: m.bg, color: m.fg }}>
                  {m.label}
                </span>
              );
            })}
          </div>
        </div>

        {/* yellow visual panel with floating cards */}
        <div style={{ flex: 'none', width: 440, height: 400, position: 'relative' }}>
          <div style={{ position: 'absolute', inset: 0, background: colors.yellow, borderRadius: 30 }} />
          <div style={{ position: 'absolute', left: 36, top: 44, width: 236, background: '#fff', borderRadius: radius.xl, padding: 13, boxShadow: '0 22px 46px rgba(20,17,10,.20)' }}>
            <div style={{ height: 150, borderRadius: 12, background: 'linear-gradient(135deg,#E2E6EA,#C9D0D7)' }} />
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, margin: '11px 0 6px' }}>
              <span style={{ padding: '3px 8px', borderRadius: radius.sm, fontWeight: 700, fontSize: 11, background: markets.danggn.bg, color: markets.danggn.fg }}>당근</span>
              <span style={{ fontWeight: 500, fontSize: 11, color: colors.textFaint }}>역삼동 · 3분 전</span>
            </div>
            <div style={{ fontWeight: 600, fontSize: 13, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>아이폰 15 Pro 256 자연티탄</div>
            <div style={{ fontWeight: 800, fontSize: 18, marginTop: 3 }}>1,150,000원</div>
          </div>
          <div style={{ position: 'absolute', right: 30, bottom: 40, width: 212, background: colors.ink, color: '#fff', borderRadius: radius.xl, padding: 18, boxShadow: '0 22px 46px rgba(20,17,10,.28)' }}>
            <div style={{ fontWeight: 800, fontSize: 44, letterSpacing: '-.03em', lineHeight: 1 }}>1,284<span style={{ fontSize: 18, fontWeight: 700 }}>건</span></div>
            <div style={{ fontWeight: 500, fontSize: 13, color: '#A8A399', marginTop: 6, lineHeight: 1.4 }}>5개 마켓의 매물을<br />한 화면에 모았어요</div>
            <div style={{ display: 'flex', gap: 5, marginTop: 14 }}>
              {(Object.keys(markets) as (keyof typeof markets)[]).map((k) => (
                <span key={k} style={{ width: 9, height: 9, borderRadius: '50%', background: markets[k].dot }} />
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* trending */}
      <section style={{ padding: '8px 56px 68px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 26 }}>
          <h2 style={{ fontWeight: 800, fontSize: 27, letterSpacing: '-.025em', margin: 0 }}>지금 뜨는 매물</h2>
          <span onClick={() => onNavigate?.('search')} style={{ fontWeight: 700, fontSize: 14, color: colors.textFaint, cursor: 'pointer' }}>전체보기 ›</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 24 }}>
          {trending.map((item) => <ProductCard key={item.id} item={item} onClick={onOpenItem} />)}
        </div>
      </section>
    </div>
  );
};
