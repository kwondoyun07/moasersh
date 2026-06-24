import { supabase } from './supabase';
import type { MarketKey } from '../tokens';

/** price_alerts 테이블 행. */
export interface AlertRow {
  id: string;
  keyword: string;
  target_min: number | null;
  target_price: number;
  markets: MarketKey[];
  enabled: boolean;
}

export async function fetchAlerts(): Promise<AlertRow[]> {
  const { data, error } = await supabase
    .from('price_alerts')
    .select('id, keyword, target_min, target_price, markets, enabled')
    .order('created_at', { ascending: false });
  if (error) throw error;
  return (data ?? []) as AlertRow[];
}

export async function addAlert(
  a: { keyword: string; target_min: number; target_price: number; markets: MarketKey[] },
  userId: string,
): Promise<AlertRow> {
  const { data, error } = await supabase
    .from('price_alerts')
    .insert({ user_id: userId, keyword: a.keyword, target_min: a.target_min, target_price: a.target_price, markets: a.markets, enabled: true })
    .select('id, keyword, target_min, target_price, markets, enabled')
    .single();
  if (error) throw error;
  return data as AlertRow;
}

export async function setAlertEnabled(id: string, enabled: boolean): Promise<void> {
  const { error } = await supabase.from('price_alerts').update({ enabled }).eq('id', id);
  if (error) throw error;
}

export async function removeAlert(id: string): Promise<void> {
  const { error } = await supabase.from('price_alerts').delete().eq('id', id);
  if (error) throw error;
}
