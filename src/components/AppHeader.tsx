import React from 'react';
import { colors, radius } from '../tokens';
import { BellIcon } from './icons';

/** Shared top nav for the content-only pages (관심목록 / 가격알림 / 알림 / 상품상세). */
export type NavTarget = 'search' | 'alerts' | 'wishlist';

interface Props {
  /** Highlights the matching nav link. */
  active?: NavTarget;
  loggedIn?: boolean;
  onHome?: () => void;
  onNavigate?: (target: NavTarget) => void;
  onBell?: () => void;
  onLogin?: () => void;
}

const NAV: { key: NavTarget; label: string }[] = [
  { key: 'search', label: '통합검색' },
  { key: 'alerts', label: '가격알림' },
  { key: 'wishlist', label: '관심목록' },
];

export const AppHeader: React.FC<Props> = ({ active, loggedIn, onHome, onNavigate, onBell, onLogin }) => (
  <header style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '22px 56px', borderBottom: `1px solid ${colors.line}` }}>
    <div style={{ display: 'flex', alignItems: 'center', gap: 44 }}>
      <div onClick={onHome} style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', cursor: 'pointer' }}>
        모아<span style={{ color: colors.yellowDeep }}>서치</span>
      </div>
      <nav style={{ display: 'flex', gap: 30, fontWeight: 600, fontSize: 15, color: colors.textMuted }}>
        {NAV.map((n) => (
          <span
            key={n.key}
            onClick={() => onNavigate?.(n.key)}
            style={{ cursor: 'pointer', color: active === n.key ? colors.ink : undefined }}
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
        <button
          onClick={onLogin}
          style={{ height: 42, padding: '0 22px', border: 0, borderRadius: radius.md, background: colors.ink, color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          로그인
        </button>
      )}
    </div>
  </header>
);
