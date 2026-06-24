import { supabase } from './supabase';

/** notifications 테이블 행. */
export interface NotiRow {
  id: string;
  title: string;
  body: string | null;
  listing_url: string | null;
  dot: string | null;
  created_at: string;
  read: boolean;
}

export async function fetchNotifications(): Promise<NotiRow[]> {
  const { data, error } = await supabase
    .from('notifications')
    .select('id, title, body, listing_url, dot, created_at, read')
    .order('created_at', { ascending: false })
    .limit(100);
  if (error) throw error;
  return (data ?? []) as NotiRow[];
}

export async function markAllRead(): Promise<void> {
  const { error } = await supabase.from('notifications').update({ read: true }).eq('read', false);
  if (error) throw error;
}

/** ISO 시각 → "3분 전" 류 상대 시간. */
export function relativeTime(iso: string): string {
  const diff = Math.floor((Date.now() - Date.parse(iso)) / 1000);
  if (Number.isNaN(diff)) return '';
  if (diff < 60) return '방금 전';
  if (diff < 3600) return `${Math.floor(diff / 60)}분 전`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}시간 전`;
  if (diff < 172800) return '어제';
  return `${Math.floor(diff / 86400)}일 전`;
}

/** 오늘(자정 이후) 생성된 알림인지. */
export function isToday(iso: string): boolean {
  const d = new Date(iso);
  const now = new Date();
  return d.getFullYear() === now.getFullYear() && d.getMonth() === now.getMonth() && d.getDate() === now.getDate();
}
