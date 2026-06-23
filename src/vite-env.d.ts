/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_SUPABASE_URL: string;
  readonly VITE_SUPABASE_ANON_KEY: string;
  /** 검색 워커/Functions 주소 (없으면 검색은 추후 연동). */
  readonly VITE_SEARCH_API_URL?: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
