/**
 * GET /api/search?q=검색어
 *
 * Cloudflare Pages Function. 프론트와 같은 도메인이라 CORS·env변수 불필요.
 * 현재는 번개장터 1곳을 실시간으로 가져와 통합 포맷(Listing)으로 반환한다.
 * 마켓을 늘릴 땐 SEARCHERS 배열에 어댑터를 추가하면 된다.
 *
 * 주의(개인/포트폴리오 전제): 비공식 내부 엔드포인트를 사용하므로
 * - 결과를 캐시(기본 180초)해 호출 빈도를 낮추고
 * - 상품명·가격 등 매물 공개 정보만 다룬다(개인정보 미수집).
 */

interface Listing {
  id: string;
  title: string;
  price: number;
  market: string;
  location: string;
  postedAt: string;
  thumb: string;
  likes?: number;
  listingUrl?: string;
}

const CACHE_TTL = 180; // 초

export const onRequestGet: PagesFunction = async (context) => {
  const url = new URL(context.request.url);
  const q = (url.searchParams.get('q') ?? '').trim();

  if (!q) {
    return Response.json({ error: 'q (검색어) 가 필요해요', query: '', count: 0, results: [] }, { status: 400 });
  }

  // 같은 검색어는 캐시에서 즉시 응답 (호출 빈도·차단 위험 ↓)
  const cache = caches.default;
  const cacheKey = new Request(`https://moa-search.cache/api/search?q=${encodeURIComponent(q)}`);
  const hit = await cache.match(cacheKey);
  if (hit) return hit;

  // 마켓별 어댑터를 병렬 실행, 한 곳이 실패해도 나머지는 살린다.
  const SEARCHERS = [searchBunjang, searchHellomarket];
  const settled = await Promise.allSettled(SEARCHERS.map((fn) => fn(q)));
  const results = settled.flatMap((r) => (r.status === 'fulfilled' ? r.value : []));

  const res = Response.json(
    { query: q, count: results.length, results },
    { headers: { 'cache-control': `public, max-age=${CACHE_TTL}` } },
  );
  context.waitUntil(cache.put(cacheKey, res.clone()));
  return res;
};

// ---- 마켓 어댑터 ----

interface BunjangItem {
  pid: number | string;
  name: string;
  price: number | string;
  product_image?: string;
  location?: string;
  num_faved?: number;
  update_time?: number;
}

/** 긴 주소("서울특별시 송파구 방이2동")를 카드용 짧은 지명으로. */
function shortLocation(loc?: string): string {
  if (!loc) return '';
  const parts = loc.trim().split(/\s+/);
  return parts[parts.length - 1];
}

/** epoch(초 또는 ms) → "3분 전" 류 상대 시간. */
function relativeTime(epoch?: number): string {
  if (!epoch) return '';
  const sec = epoch > 1e12 ? Math.floor(epoch / 1000) : epoch;
  const diff = Math.floor(Date.now() / 1000) - sec;
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 번개장터 비공식 내부 검색 API → 통합 Listing. */
async function searchBunjang(q: string): Promise<Listing[]> {
  const api =
    `https://api.bunjang.co.kr/api/1/find_v2.json?q=${encodeURIComponent(q)}` +
    `&order=score&page=0&n=40&stat_device=w&version=4`;

  const r = await fetch(api, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; MoaSearch/0.1)',
      accept: 'application/json',
    },
  });
  if (!r.ok) throw new Error(`bunjang ${r.status}`);

  const data = (await r.json()) as { result?: string; list?: BunjangItem[] };
  const list = data.list ?? [];

  return list.map((it) => ({
    id: `bunjang-${it.pid}`,
    title: it.name,
    price: Number(it.price) || 0,
    market: 'bunjang',
    location: shortLocation(it.location),
    postedAt: relativeTime(it.update_time),
    // 번개 이미지 URL은 {cnt}(이미지 번호)·{res}(해상도) 토큰을 치환해야 함
    thumb: (it.product_image ?? '').replace('{cnt}', '1').replace('{res}', '300'),
    likes: it.num_faved,
    listingUrl: `https://m.bunjang.co.kr/products/${it.pid}`,
  }));
}

interface HelloItem {
  itemIdx: number;
  title: string;
  price: number;
  timestamp?: number; // ms epoch
  imageUrl?: string;
}

/**
 * 헬로마켓(=세컨웨어, 동일 도메인) — 공식 검색 JSON API가 없어 SSR HTML의
 * <script id="__NEXT_DATA__"> JSON을 파싱한다. 사이트 재배포 시 구조가 바뀔 수 있음.
 */
async function searchHellomarket(q: string): Promise<Listing[]> {
  const r = await fetch(`https://www.hellomarket.com/search?q=${encodeURIComponent(q)}`, {
    headers: {
      'user-agent': 'Mozilla/5.0 (compatible; MoaSearch/0.1)',
      accept: 'text/html',
    },
  });
  if (!r.ok) throw new Error(`hellomarket ${r.status}`);

  const html = await r.text();
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) throw new Error('hellomarket: __NEXT_DATA__ 누락');

  const data = JSON.parse(m[1]) as {
    props?: { initialState?: { searchData?: { itemList?: HelloItem[] } } };
  };
  const list = data.props?.initialState?.searchData?.itemList ?? [];

  return list.map((it) => ({
    id: `hello-${it.itemIdx}`,
    title: it.title,
    price: Number(it.price) || 0,
    market: 'hello',
    location: '', // 검색 응답에 매물별 지역 없음
    postedAt: relativeTime(it.timestamp),
    thumb: it.imageUrl ?? '', // 완전한 URL, 토큰 치환 불필요
    listingUrl: `https://www.hellomarket.com/item/${it.itemIdx}`,
  }));
}
