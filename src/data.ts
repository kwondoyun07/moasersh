import type { Listing, NotificationItem, PriceRule, SaleItem, SearchFilters } from './types';

// Gradient placeholders standing in for real product photos.
const G = {
  steel: 'linear-gradient(135deg,#E2E6EA,#C9D0D7)',
  sand: 'linear-gradient(135deg,#EBE3D2,#D8CBB2)',
  sage: 'linear-gradient(135deg,#D9E3DC,#BFCDC4)',
  mauve: 'linear-gradient(135deg,#E8DCDF,#D2BEC4)',
  peri: 'linear-gradient(135deg,#DBE0EA,#C2CADB)',
  lilac: 'linear-gradient(135deg,#E4E0EA,#CBC3D6)',
  clay: 'linear-gradient(135deg,#E6E2D6,#D0C8B4)',
} as const;

// Home › "지금 뜨는 매물"
export const trending: Listing[] = [
  { id: 't1', title: '다이슨 V12 디텍트 슬림',     price: 420000, market: 'danggn',     location: '강남구', postedAt: '10분 전', thumb: G.steel },
  { id: 't2', title: '스탠바이미 2세대 풀박',       price: 780000, market: 'bunjang',    location: '서초구', postedAt: '25분 전', thumb: G.sand },
  { id: 't3', title: '닌텐도 스위치 OLED 화이트',   price: 270000, market: 'joonggo',    location: '송파구', postedAt: '1시간 전', thumb: G.sage },
  { id: 't4', title: '헬리녹스 체어원 캠핑 의자',   price: 95000,  market: 'hello',      location: '분당',   postedAt: '2시간 전', thumb: G.mauve },
];

// Search results for "아이폰 15 프로"
export const searchResults: Listing[] = [
  { id: 'r1', title: '아이폰 15 Pro 256 자연티타늄 풀박',  price: 1150000, market: 'danggn',     location: '역삼동', postedAt: '3분 전',  thumb: G.steel, likes: 24 },
  { id: 'r2', title: '아이폰15프로 128 블루티탄 깨끗',     price: 980000,  market: 'bunjang',    location: '서초구', postedAt: '12분 전', thumb: G.peri,  likes: 9 },
  { id: 'r3', title: '아이폰 15 Pro 미개봉 새제품 256',    price: 1290000, market: 'joonggo',    location: '송파구', postedAt: '1시간 전', thumb: G.sage,  likes: 41 },
  { id: 'r4', title: '아이폰15프로 256 잔기스 급처',       price: 890000,  market: 'hello',      location: '강남구', postedAt: '2시간 전', thumb: G.mauve, likes: 7 },
  { id: 'r5', title: '아이폰 15 Pro Max 교환 가능',        price: 1340000, market: 'secondwear', location: '분당',   postedAt: '3시간 전', thumb: G.lilac, likes: 12 },
  { id: 'r6', title: '아이폰15프로 256 화이트티탄 풀박',   price: 1090000, market: 'danggn',     location: '마포구', postedAt: '4시간 전', thumb: G.clay,  likes: 18 },
];

// Combined pool used for wishlist / product detail lookups.
export const allListings: Listing[] = [...searchResults, ...trending];

// Seeded "liked" ids (so the wishlist isn't empty in the demo).
export const seededLikes: Record<string, boolean> = { r1: true, r3: true, t2: true };

export const notifications: NotificationItem[] = [
  { id: 'n1', dot: '#F5C84C', group: '오늘', title: '가격이 내려갔어요', desc: '관심 매물 ‘다이슨 V12’ 40,000원 인하 (460,000 → 420,000원)', time: '5분 전', unread: true },
  { id: 'n2', dot: '#2F6FE0', group: '오늘', title: '새 매물 알림', desc: '‘아이폰 15 프로’ 새 매물 12건이 올라왔어요', time: '1시간 전', unread: true },
  { id: 'n3', dot: '#1F9D4D', group: '오늘', title: '거래 메시지', desc: '역삼동 판매자가 메시지를 보냈어요', time: '3시간 전', unread: true },
  { id: 'n4', dot: '#6D3FD4', group: '이전', title: '찜한 매물이 팔렸어요', desc: '‘스탠바이미 2세대’가 거래 완료되었어요', time: '어제', unread: false },
  { id: 'n5', dot: '#F4641E', group: '이전', title: '키워드 알림', desc: '‘닌텐도 스위치’ 조건에 맞는 매물이 등록됐어요', time: '2일 전', unread: false },
];

export const salesItems: SaleItem[] = [
  { id: 'sa1', title: '아이패드 프로 11 5세대 셀룰러', price: 720000, market: 'danggn',  status: '판매중',   date: '3일 전 등록', chats: 4, likes: 12, views: 210, thumb: G.steel },
  { id: 'sa2', title: '소니 WH-1000XM5 헤드폰',       price: 280000, market: 'bunjang', status: '예약중',   date: '6일 전 등록', chats: 9, likes: 25, views: 480, thumb: G.sand },
  { id: 'sa3', title: '한샘 책상 1400 화이트',         price: 90000,  market: 'joonggo', status: '거래완료', date: '2주 전 거래', chats: 6, likes: 8,  views: 150, thumb: G.sage },
  { id: 'sa4', title: '나이키 에어포스1 270mm',        price: 70000,  market: 'hello',   status: '거래완료', date: '3주 전 거래', chats: 3, likes: 5,  views: 95,  thumb: G.mauve },
];

export const priceRules: PriceRule[] = [
  { id: 'p1', keyword: '아이폰 15 프로', target: 1000000, markets: ['danggn', 'bunjang', 'joonggo'], on: true },
  { id: 'p2', keyword: '다이슨 V12',     target: 400000,  markets: ['danggn', 'hello'],              on: true },
  { id: 'p3', keyword: '스탠바이미',     target: 700000,  markets: ['bunjang'],                      on: false },
];

export const defaultFilters: SearchFilters = {
  query: '아이폰 15 프로',
  priceMin: 100000,
  priceMax: 1500000,
  region: '서울 강남구',
  condition: '전체',
  sort: '최신순',
  markets: [
    { key: 'danggn',     count: 412, selected: true },
    { key: 'bunjang',    count: 338, selected: true },
    { key: 'joonggo',    count: 301, selected: true },
    { key: 'hello',      count: 142, selected: false },
    { key: 'secondwear', count: 91,  selected: false },
  ],
};

export const totalCount = 1284;
