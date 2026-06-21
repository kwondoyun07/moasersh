import React, { useMemo, useState } from 'react';
import { colors, font, radius, type MarketKey } from '../tokens';
import { defaultFilters, searchResults, totalCount } from '../data';
import type { Listing, SearchFilters } from '../types';
import { ProductCard } from '../components/ProductCard';
import { FilterSidebar } from '../components/FilterSidebar';
import { BellIcon, CloseIcon, SearchIcon } from '../components/icons';

const SORTS: SearchFilters['sort'][] = ['최신순', '낮은 가격순', '인기순'];

interface Props {
  loggedIn?: boolean;
  initialQuery?: string;
  onHome?: () => void;
  onBell?: () => void;
  onLogin?: () => void;
  onOpenItem?: (item: Listing) => void;
}

/**
 * Search results — top search bar, left filter rail, 3-column product grid.
 * State is local for demo purposes; wire `filters` to your query layer and
 * refetch `searchResults` when it changes.
 */
export const SearchResults: React.FC<Props> = ({ loggedIn, initialQuery, onHome, onBell, onLogin, onOpenItem }) => {
  const [filters, setFilters] = useState<SearchFilters>(() => ({
    ...defaultFilters,
    query: initialQuery?.trim() ? initialQuery.trim() : defaultFilters.query,
  }));
  const [draft, setDraft] = useState(filters.query);

  const toggleMarket = (key: MarketKey) =>
    setFilters((f) => ({ ...f, markets: f.markets.map((m) => (m.key === key ? { ...m, selected: !m.selected } : m)) }));

  const setSort = (sort: SearchFilters['sort']) => setFilters((f) => ({ ...f, sort }));
  const setPrice = (priceMin: number, priceMax: number) => setFilters((f) => ({ ...f, priceMin, priceMax }));
  const runSearch = () => setFilters((f) => ({ ...f, query: draft.trim() || f.query }));

  const sorted = useMemo(() => {
    const list = [...searchResults];
    if (filters.sort === '낮은 가격순') list.sort((a, b) => a.price - b.price);
    if (filters.sort === '인기순') list.sort((a, b) => (b.likes ?? 0) - (a.likes ?? 0));
    return list;
  }, [filters.sort]);

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, background: colors.bg, width: 1440, margin: '0 auto' }}>
      {/* nav with search */}
      <header style={{ display: 'flex', alignItems: 'center', gap: 36, padding: '18px 56px', borderBottom: `1px solid ${colors.line}` }}>
        <div onClick={onHome} style={{ fontWeight: 800, fontSize: 22, letterSpacing: '-.03em', cursor: 'pointer' }}>
          모아<span style={{ color: colors.yellowDeep }}>서치</span>
        </div>
        <div style={{ flex: 1, maxWidth: 640, display: 'flex', alignItems: 'center', height: 50, background: colors.field, borderRadius: 13, padding: '0 18px', gap: 11 }}>
          <SearchIcon size={20} color={colors.textFaint} />
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') runSearch(); }}
            placeholder="찾는 물건을 검색해 보세요"
            style={{ flex: 1, background: 'transparent', border: 0, outline: 'none', fontFamily: 'inherit', fontWeight: 600, fontSize: 16, color: colors.ink }}
          />
          {draft && (
            <span onClick={() => setDraft('')} style={{ display: 'inline-flex', cursor: 'pointer' }} aria-label="지우기">
              <CloseIcon />
            </span>
          )}
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 18, marginLeft: 'auto' }}>
          <span onClick={onBell} style={{ display: 'inline-flex', cursor: 'pointer' }} aria-label="알림">
            <BellIcon />
          </span>
          {loggedIn ? (
            <div style={{ width: 38, height: 38, borderRadius: '50%', background: 'linear-gradient(135deg,#F5C84C,#E5A600)' }} />
          ) : (
            <button onClick={onLogin} style={{ height: 38, padding: '0 18px', border: 0, borderRadius: radius.md, background: colors.ink, color: '#fff', fontWeight: 700, fontSize: 13, fontFamily: 'inherit', cursor: 'pointer' }}>
              로그인
            </button>
          )}
        </div>
      </header>

      {/* body */}
      <div style={{ display: 'flex', alignItems: 'flex-start' }}>
        <FilterSidebar filters={filters} onToggleMarket={toggleMarket} onPriceChange={setPrice} />

        <main style={{ flex: 1, minWidth: 0, padding: '34px 48px 48px' }}>
          <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
            <div>
              <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: 0 }}>{filters.query}</h2>
              <div style={{ fontWeight: 600, fontSize: 14, color: colors.textMuted, marginTop: 8 }}>
                총 <b style={{ color: colors.ink, fontWeight: 800, fontSize: 16 }}>{totalCount.toLocaleString('ko-KR')}</b>건 ·{' '}
                <span style={{ color: colors.gold }}>{filters.region.replace('서울 ', '')}</span> · {filters.priceMin.toLocaleString('ko-KR')}–{filters.priceMax.toLocaleString('ko-KR')}원
              </div>
            </div>
            <div style={{ display: 'flex', gap: 22, fontWeight: 700, fontSize: 14 }}>
              {SORTS.map((s) => {
                const active = filters.sort === s;
                return (
                  <span
                    key={s}
                    onClick={() => setSort(s)}
                    style={{
                      color: active ? colors.ink : colors.textGhost,
                      borderBottom: active ? `2.5px solid ${colors.yellow}` : '2.5px solid transparent',
                      paddingBottom: 6, cursor: 'pointer',
                    }}
                  >
                    {s}
                  </span>
                );
              })}
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: '26px 24px', marginTop: 30 }}>
            {sorted.map((item) => <ProductCard key={item.id} item={item} showLike onClick={onOpenItem} />)}
          </div>
        </main>
      </div>
    </div>
  );
};
