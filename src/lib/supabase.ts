import { createClient } from '@supabase/supabase-js';

const url = import.meta.env.VITE_SUPABASE_URL;
const anonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // .env / Cloudflare Pages 환경변수에 두 값을 넣어야 합니다.
  console.warn('[supabase] VITE_SUPABASE_URL 또는 VITE_SUPABASE_ANON_KEY 가 비어 있어요.');
}

/** 앱 전역에서 쓰는 Supabase 클라이언트. anon 키는 공개돼도 RLS가 보호합니다. */
export const supabase = createClient(url, anonKey);
