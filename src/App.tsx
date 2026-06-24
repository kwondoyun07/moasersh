import React, { useEffect } from 'react';
import { Routes, Route, Navigate, useNavigate, useLocation, useSearchParams } from 'react-router-dom';
import {
  Home,
  SearchResults,
  Login,
  Notifications,
  Wishlist,
  PriceAlerts,
  ProductDetail,
} from './index';
import { AppHeader, type NavTarget } from './components/AppHeader';
import { defaultFilters } from './data';
import type { Listing } from './types';
import { colors, font } from './tokens';
import { useAuth } from './lib/useAuth';
import { WishlistProvider, useWishlist } from './lib/wishlist';
import { useResolvedListing } from './lib/useResolvedListing';

/** 헤더 nav 타깃 → URL 경로 매핑. */
const NAV_PATH: Record<NavTarget, string> = {
  search: '/search',
  alerts: '/price-alerts',
  wishlist: '/wishlist',
};

/** 페이지 전반에서 공유하는 이동 핸들러 — 라우터 navigate 로 구현. */
function useNavHandlers() {
  const navigate = useNavigate();
  const location = useLocation();
  return {
    onHome: () => navigate('/main'),
    onNavigate: (t: NavTarget) => navigate(NAV_PATH[t]),
    onBell: () => navigate('/notifications'),
    // 로그인 후 돌아올 위치를 state 로 전달.
    onLogin: () => navigate('/login', { state: { from: location.pathname + location.search } }),
    onSearch: (q: string) => navigate(`/search?q=${encodeURIComponent(q)}`),
    // 매물은 state 로 즉시 전달. 현재 검색어(?q)를 상세 URL 에 실어, 새로고침/공유로
    // 열어도(cold-load) 재검색으로 매물을 복원할 수 있게 한다.
    openDetail: (item: Listing) => {
      const q = new URLSearchParams(location.search).get('q');
      const base = `/product/${encodeURIComponent(item.id)}`;
      navigate(q ? `${base}?q=${encodeURIComponent(q)}` : base, { state: { item } });
    },
  };
}

/** 콘텐츠 전용 페이지(관심목록/가격알림/알림/상세)를 공유 헤더로 감싼다. */
function Shell({ active, loggedIn, children }: { active?: NavTarget; loggedIn: boolean; children: React.ReactNode }) {
  const nav = useNavHandlers();
  return (
    <>
      <AppHeader active={active} loggedIn={loggedIn} onHome={nav.onHome} onNavigate={nav.onNavigate} onBell={nav.onBell} onLogin={nav.onLogin} />
      {children}
    </>
  );
}

function HomeRoute({ loggedIn }: { loggedIn: boolean }) {
  const nav = useNavHandlers();
  return (
    <Home
      loggedIn={loggedIn}
      onHome={nav.onHome}
      onNavigate={nav.onNavigate}
      onSearch={nav.onSearch}
      onBell={nav.onBell}
      onLogin={nav.onLogin}
      onOpenItem={nav.openDetail}
    />
  );
}

function SearchRoute({ loggedIn }: { loggedIn: boolean }) {
  const nav = useNavHandlers();
  const [params, setParams] = useSearchParams();
  const raw = params.get('q')?.trim();
  const q = raw || defaultFilters.query;
  // ?q 가 없으면(헤더 '통합검색' 클릭 등) 기본 검색어로 URL 을 채워 URL↔화면을 일치시킨다.
  useEffect(() => {
    if (!raw) setParams({ q }, { replace: true });
  }, [raw, q, setParams]);
  return (
    <SearchResults
      loggedIn={loggedIn}
      initialQuery={q}
      onHome={nav.onHome}
      onBell={nav.onBell}
      onLogin={nav.onLogin}
      onOpenItem={nav.openDetail}
      onSearch={(nq) => setParams({ q: nq })}
    />
  );
}

function LoginRoute() {
  const navigate = useNavigate();
  const location = useLocation();
  const from = (location.state as { from?: string } | null)?.from;
  return (
    <Login
      onHome={() => navigate('/main')}
      onAuth={() => navigate(from ?? '/main', { replace: true })}
    />
  );
}

function WishlistRoute({ loggedIn }: { loggedIn: boolean }) {
  const nav = useNavHandlers();
  return (
    <Shell active="wishlist" loggedIn={loggedIn}>
      <Wishlist onOpen={nav.openDetail} />
    </Shell>
  );
}

/** 상세 로딩/실패 시 헤더 아래 표시하는 안내 블록. */
function DetailMessage({ text, sub, action }: { text: string; sub?: string; action?: { label: string; onClick: () => void } }) {
  return (
    <div style={{ padding: '120px 0', textAlign: 'center' }}>
      <div style={{ fontWeight: 700, fontSize: 18, color: colors.inkSoft }}>{text}</div>
      {sub && <div style={{ fontWeight: 500, fontSize: 14, color: colors.textFaint, marginTop: 8 }}>{sub}</div>}
      {action && (
        <button
          onClick={action.onClick}
          style={{ marginTop: 22, height: 44, padding: '0 22px', border: 0, borderRadius: 12, background: colors.ink, color: '#fff', fontWeight: 700, fontSize: 14, fontFamily: 'inherit', cursor: 'pointer' }}
        >
          {action.label}
        </button>
      )}
    </div>
  );
}

function DetailRoute({ loggedIn }: { loggedIn: boolean }) {
  const navigate = useNavigate();
  const location = useLocation();
  const { isLiked, toggle } = useWishlist();
  const { item, status, query } = useResolvedListing();

  // '목록으로'는 앱 내부 직전 페이지로. 단, 딥링크로 바로 진입(앱 내부 history 없음,
  // location.key === 'default')했으면 navigate(-1)이 앱 밖으로 나가므로 안전한 곳으로 폴백.
  const goBack = () =>
    location.key !== 'default'
      ? navigate(-1)
      : navigate(query ? `/search?q=${encodeURIComponent(query)}` : '/main');

  return (
    <Shell loggedIn={loggedIn}>
      {status === 'loading' ? (
        <DetailMessage text="매물을 불러오는 중…" />
      ) : status === 'notfound' || !item ? (
        <DetailMessage
          text="매물 정보를 불러올 수 없어요"
          sub="이미 판매되었거나 링크가 만료되었을 수 있어요."
          action={{ label: query ? '검색으로 돌아가기' : '홈으로', onClick: goBack }}
        />
      ) : (
        <ProductDetail
          item={item}
          liked={isLiked(item)}
          onToggleLike={toggle}
          onBack={goBack}
          onChat={(it) => window.alert(`${it.title} — 채팅 시작 (데모)`)}
        />
      )}
    </Shell>
  );
}

/**
 * Application shell + router. URL 경로로 페이지를 전환하므로 브라우저
 * 이전/다음 가기가 그대로 동작한다. 각 페이지는 기존 콜백 인터페이스를
 * 유지하고, 여기서 navigate 로 연결한다. Home(/main)이 진입점.
 */
export default function App() {
  const { user } = useAuth();
  const loggedIn = !!user; // 세션에서 파생 — 새로고침해도 유지

  return (
    <WishlistProvider>
      <div style={{ fontFamily: font.family, color: colors.ink, background: colors.bg, minHeight: '100vh' }}>
        <Routes>
          <Route path="/" element={<Navigate to="/main" replace />} />
          <Route path="/main" element={<HomeRoute loggedIn={loggedIn} />} />
          <Route path="/search" element={<SearchRoute loggedIn={loggedIn} />} />
          <Route path="/login" element={<LoginRoute />} />
          <Route path="/wishlist" element={<WishlistRoute loggedIn={loggedIn} />} />
          <Route path="/price-alerts" element={<Shell active="alerts" loggedIn={loggedIn}><PriceAlerts /></Shell>} />
          <Route path="/notifications" element={<Shell loggedIn={loggedIn}><Notifications /></Shell>} />
          <Route path="/product/:id" element={<DetailRoute loggedIn={loggedIn} />} />
          <Route path="*" element={<Navigate to="/main" replace />} />
        </Routes>
      </div>
    </WishlistProvider>
  );
}
