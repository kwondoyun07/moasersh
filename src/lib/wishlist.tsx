import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { supabase } from './supabase';
import { useAuth } from './useAuth';
import type { MarketKey } from '../tokens';
import type { Listing } from '../types';

/** wishlist 테이블의 한 행(매물 스냅샷). */
interface WishRow {
  market: MarketKey;
  listing_url: string;
  title: string;
  price: number;
  thumb: string;
  location: string;
  posted_at: string | null;
}

/** 매물의 고유 키. 실제 검색 매물은 listingUrl, 데모 매물은 id 를 사용. */
const keyOf = (item: Listing): string => item.listingUrl ?? item.id;

const listingToRow = (item: Listing): WishRow => ({
  market: item.market,
  listing_url: keyOf(item),
  title: item.title,
  price: item.price,
  thumb: item.thumb,
  location: item.location,
  posted_at: item.postedAt ?? null,
});

const rowToListing = (r: WishRow): Listing => ({
  id: r.listing_url,
  listingUrl: r.listing_url,
  title: r.title,
  price: r.price,
  market: r.market,
  location: r.location,
  postedAt: r.posted_at ?? '',
  thumb: r.thumb,
});

interface WishlistContextValue {
  /** 찜한 매물 목록(최신순). */
  items: Listing[];
  /** 해당 매물이 찜되어 있는지. */
  isLiked: (item: Listing) => boolean;
  /** 찜 토글(낙관적 업데이트 + Supabase 반영). */
  toggle: (item: Listing) => Promise<void>;
  loading: boolean;
}

const WishlistContext = createContext<WishlistContextValue | null>(null);

const SELECT_COLS = 'market, listing_url, title, price, thumb, location, posted_at';

export const WishlistProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading: authLoading } = useAuth();
  const userId = user?.id ?? null;
  const [rows, setRows] = useState<WishRow[]>([]);
  const [loading, setLoading] = useState(true);

  // 사용자가 바뀌면(로그인/로그아웃) 찜 목록을 다시 불러온다.
  useEffect(() => {
    let active = true;

    async function load() {
      if (!userId) {
        if (active) {
          setRows([]);
          setLoading(false);
        }
        return;
      }
      if (active) setLoading(true);
      const { data, error } = await supabase
        .from('wishlist')
        .select(SELECT_COLS)
        .order('created_at', { ascending: false });
      if (!active) return;
      if (error) console.warn('[wishlist] 불러오기 실패:', error.message);
      else setRows((data ?? []) as WishRow[]);
      setLoading(false);
    }

    load();
    return () => {
      active = false;
    };
  }, [userId]);

  const likedKeys = useMemo(() => new Set(rows.map((r) => r.listing_url)), [rows]);

  const isLiked = useCallback((item: Listing) => likedKeys.has(keyOf(item)), [likedKeys]);

  const toggle = useCallback(
    async (item: Listing) => {
      if (!userId) {
        window.alert('찜하려면 로그인이 필요해요');
        return;
      }
      const key = keyOf(item);
      const row = listingToRow(item);

      if (likedKeys.has(key)) {
        setRows((rs) => rs.filter((r) => r.listing_url !== key)); // 낙관적 제거
        const { error } = await supabase
          .from('wishlist')
          .delete()
          .eq('user_id', userId)
          .eq('listing_url', key);
        if (error) {
          setRows((rs) => [row, ...rs]); // 롤백
          window.alert('찜 해제에 실패했어요');
        }
      } else {
        setRows((rs) => [row, ...rs]); // 낙관적 추가
        const { error } = await supabase.from('wishlist').insert({ user_id: userId, ...row });
        if (error) {
          setRows((rs) => rs.filter((r) => r.listing_url !== key)); // 롤백
          window.alert('찜 등록에 실패했어요');
        }
      }
    },
    [userId, likedKeys],
  );

  const items = useMemo(() => rows.map(rowToListing), [rows]);

  // 세션 복원(authLoading) 중에도 loading 을 유지해야, cold-load 시 '비로그인'으로
  // 오판해 찜 매물 상세가 notfound 로 깜빡이는 것을 막는다.
  const value = useMemo<WishlistContextValue>(
    () => ({ items, isLiked, toggle, loading: authLoading || loading }),
    [items, isLiked, toggle, authLoading, loading],
  );

  return <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>;
};

// Provider와 같은 파일에 둔다(컨텍스트 공유). fast-refresh 경고만 끔.
// eslint-disable-next-line react-refresh/only-export-components
export const useWishlist = (): WishlistContextValue => {
  const ctx = useContext(WishlistContext);
  if (!ctx) throw new Error('useWishlist 는 <WishlistProvider> 안에서만 쓸 수 있어요.');
  return ctx;
};
