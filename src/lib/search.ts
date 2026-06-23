import type { Listing } from '../types';

export interface SearchResponse {
  query: string;
  count: number;
  results: Listing[];
}

/**
 * 통합 검색 — 같은 도메인의 Pages Function(/api/search)을 호출한다.
 * 워커가 마켓들을 실시간으로 가져와 통합 결과를 돌려준다.
 */
export async function searchListings(q: string): Promise<Listing[]> {
  const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
  if (!res.ok) throw new Error(`search failed: ${res.status}`);
  const data = (await res.json()) as SearchResponse;
  return data.results ?? [];
}
