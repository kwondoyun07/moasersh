import type { MarketKey } from './tokens';

export interface Listing {
  id: string;
  title: string;
  price: number;          // in KRW, e.g. 1150000
  market: MarketKey;
  location: string;       // e.g. "역삼동"
  postedAt: string;       // human relative time, e.g. "3분 전"
  /**
   * Thumbnail. In the design these are CSS gradients standing in for real
   * product photos — replace with an image URL (object-fit: cover) in production.
   */
  thumb: string;
  likes?: number;
  /** 실제 매물 원본 링크. 검색 결과에서 채워지며 찜의 고유 키로 쓰인다. */
  listingUrl?: string;
}

export interface MarketFacet {
  key: MarketKey;
  count: number;
  selected: boolean;
}

export interface SearchFilters {
  query: string;
  priceMin: number;       // in 원 (KRW) — e.g. 100000 = 100,000원
  priceMax: number;
  markets: MarketFacet[];
  region: string;         // e.g. "서울 강남구"
  condition: '전체' | '새상품급' | '사용감 적음' | '사용감 있음';
  sort: '최신순' | '낮은 가격순' | '인기순';
}

export interface NotificationItem {
  id: string;
  dot: string;            // accent dot color (hex)
  group: '오늘' | '이전';
  title: string;
  desc: string;
  time: string;
  unread: boolean;
}

export type SaleStatus = '판매중' | '예약중' | '거래완료';

export interface SaleItem {
  id: string;
  title: string;
  price: number;
  market: MarketKey;
  status: SaleStatus;
  date: string;
  chats: number;
  likes: number;
  views: number;
  thumb: string;
}

export interface PriceRule {
  id: string;
  keyword: string;
  targetMin?: number;     // optional KRW lower bound ("이상"); 0/undefined = no minimum
  target: number;         // KRW upper bound ("이하")
  markets: MarketKey[];
  on: boolean;
}

export const formatPrice = (krw: number): string => krw.toLocaleString('ko-KR') + '원';

// Splits a price so "원" can be rendered smaller, matching the design.
export const splitPrice = (krw: number): { num: string; unit: '원' } => ({
  num: krw.toLocaleString('ko-KR'),
  unit: '원',
});
