import React, { useState } from 'react';
import { colors, font, markets, type MarketKey } from '../tokens';
import { priceRules as defaultRules } from '../data';
import { formatPrice, type PriceRule } from '../types';
import { Toggle } from '../components/Toggle';
import { RangeSlider } from '../components/RangeSlider';
import { CloseIcon } from '../components/icons';

const MK_ORDER: MarketKey[] = ['danggn', 'bunjang', 'joonggo', 'hello', 'secondwear'];

interface Draft {
  keyword: string;
  min: number;      // 원
  max: number;      // 원
  markets: Record<MarketKey, boolean>;
}
const emptyDraft = (): Draft => ({
  keyword: '', min: 0, max: 1000000,
  markets: { danggn: true, bunjang: true, joonggo: false, hello: false, secondwear: false },
});

const ruleRangeText = (r: PriceRule) =>
  r.targetMin ? `${formatPrice(r.targetMin)} ~ ${formatPrice(r.target)}` : `${formatPrice(r.target)} 이하`;

/** 가격 알림 — rules with on/off, add-form modal (keyword / price range / markets) and delete confirm. */
export const PriceAlerts: React.FC<{ rules?: PriceRule[] }> = ({ rules = defaultRules }) => {
  const [list, setList] = useState<PriceRule[]>(rules);
  const [formOpen, setFormOpen] = useState(false);
  const [draft, setDraft] = useState<Draft>(emptyDraft);
  const [confirmId, setConfirmId] = useState<string | null>(null);

  const toggle = (id: string) => setList((l) => l.map((r) => (r.id === id ? { ...r, on: !r.on } : r)));
  const openForm = () => { setDraft(emptyDraft()); setFormOpen(true); };
  const toggleDraftMarket = (k: MarketKey) => setDraft((d) => ({ ...d, markets: { ...d.markets, [k]: !d.markets[k] } }));

  const submit = () => {
    const kw = draft.keyword.trim();
    const mks = MK_ORDER.filter((k) => draft.markets[k]);
    if (!kw || !draft.max || draft.min > draft.max || !mks.length) return; // validate in production with messages
    setList((l) => [...l, { id: 'p' + Date.now(), keyword: kw, targetMin: draft.min, target: draft.max, markets: mks, on: true }]);
    setFormOpen(false);
  };

  const confirmKeyword = list.find((r) => r.id === confirmId)?.keyword ?? '';
  const doDelete = () => { setList((l) => l.filter((r) => r.id !== confirmId)); setConfirmId(null); };

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, padding: '40px 56px 60px', maxWidth: 720, margin: '0 auto', position: 'relative' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between' }}>
        <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: 0 }}>가격 알림</h2>
        <button onClick={openForm} style={{ height: 42, padding: '0 18px', border: 0, borderRadius: 11, background: colors.ink, color: '#fff', fontWeight: 700, fontSize: 14, cursor: 'pointer', fontFamily: 'inherit' }}>＋ 새 알림</button>
      </div>
      <p style={{ fontWeight: 500, fontSize: 14.5, color: colors.textMuted, margin: '12px 0 28px', lineHeight: 1.5 }}>
        설정한 가격 범위로 매물이 올라오면 바로 알려드려요. 키워드와 마켓을 조합해 원하는 조건을 만들어 보세요.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {list.map((r) => (
          <div key={r.id} style={{ display: 'flex', alignItems: 'center', gap: 18, background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 16, padding: '20px 22px' }}>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: 700, fontSize: 16 }}>{r.keyword}</div>
              <div style={{ fontWeight: 500, fontSize: 13.5, color: colors.textMuted, marginTop: 5 }}>
                목표가 <b style={{ color: colors.ink, fontWeight: 700 }}>{ruleRangeText(r)}</b> · {r.markets.map((k) => markets[k].label).join(' · ')}
              </div>
            </div>
            <span style={{ fontWeight: 700, fontSize: 12, color: r.on ? colors.ink : colors.textGhost }}>{r.on ? '켜짐' : '꺼짐'}</span>
            <Toggle on={r.on} onToggle={() => toggle(r.id)} />
            <button aria-label="알림 삭제" onClick={() => setConfirmId(r.id)} style={{ width: 36, height: 36, border: 0, borderRadius: 10, background: '#F8F8F6', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}>
              <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke={colors.textGhost} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6" /><path d="M8 6V4h8v2" /><path d="M6 6l1 14h10l1-14" /></svg>
            </button>
          </div>
        ))}
      </div>

      {/* Add-rule modal */}
      {formOpen && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 20, background: 'rgba(20,17,10,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 460, background: '#fff', borderRadius: 22, overflow: 'hidden', boxShadow: '0 30px 70px rgba(0,0,0,.32)', fontFamily: font.family }}>
            <div style={{ padding: '24px 30px 0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div style={{ fontWeight: 800, fontSize: 20, letterSpacing: '-.02em' }}>가격 알림 추가</div>
              <button onClick={() => setFormOpen(false)} style={{ width: 34, height: 34, border: 0, borderRadius: '50%', background: colors.field, display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}><CloseIcon size={18} color={colors.textMuted} /></button>
            </div>
            <div style={{ padding: '22px 30px 30px' }}>
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontWeight: 600, fontSize: 12.5, color: colors.textFaint, marginBottom: 7 }}>키워드</div>
                <input value={draft.keyword} onChange={(e) => setDraft((d) => ({ ...d, keyword: e.target.value }))} placeholder="예: 아이폰 15 프로" style={{ width: '100%', height: 48, border: `1.5px solid ${colors.border}`, borderRadius: 12, padding: '0 14px', fontSize: 14, fontFamily: 'inherit', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: 18 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, border: `1.5px solid ${colors.border}`, borderRadius: 12, padding: '0 14px' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: colors.textFaint, flex: 'none' }}>최소</span>
                    <input value={draft.min.toLocaleString('ko-KR')} inputMode="numeric" onChange={(e) => setDraft((d) => ({ ...d, min: Math.min(+e.target.value.replace(/[^0-9]/g, '') || 0, d.max) }))} style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', fontWeight: 700, fontSize: 15, color: colors.ink, fontFamily: 'inherit', background: 'transparent', textAlign: 'right' }} />
                    <span style={{ fontWeight: 600, fontSize: 13, color: colors.textFaint, flex: 'none' }}>원 이상</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, height: 48, border: `1.5px solid ${colors.border}`, borderRadius: 12, padding: '0 14px' }}>
                    <span style={{ fontWeight: 600, fontSize: 13, color: colors.textFaint, flex: 'none' }}>목표</span>
                    <input value={draft.max.toLocaleString('ko-KR')} inputMode="numeric" onChange={(e) => setDraft((d) => ({ ...d, max: Math.max(+e.target.value.replace(/[^0-9]/g, '') || 0, d.min) }))} style={{ flex: 1, minWidth: 0, border: 0, outline: 'none', fontWeight: 700, fontSize: 15, color: colors.ink, fontFamily: 'inherit', background: 'transparent', textAlign: 'right' }} />
                    <span style={{ fontWeight: 600, fontSize: 13, color: colors.textFaint, flex: 'none' }}>원 이하</span>
                  </div>
                </div>
                <RangeSlider value={[draft.min, draft.max]} onChange={([lo, hi]) => setDraft((d) => ({ ...d, min: lo, max: hi }))} />
                <div style={{ display: 'flex', justifyContent: 'space-between', fontWeight: 500, fontSize: 11, color: colors.textGhost }}><span>0원</span><span>3,000,000원+</span></div>
              </div>

              <div style={{ marginBottom: 24 }}>
                <div style={{ fontWeight: 600, fontSize: 12.5, color: colors.textFaint, marginBottom: 9 }}>알림 받을 마켓</div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {MK_ORDER.map((k) => {
                    const on = draft.markets[k];
                    const m = markets[k];
                    return (
                      <span key={k} onClick={() => toggleDraftMarket(k)} style={{ padding: '9px 14px', borderRadius: 11, fontWeight: 700, fontSize: 13.5, cursor: 'pointer', transition: 'all .12s', background: on ? m.fg : colors.field, color: on ? '#fff' : colors.ink }}>
                        {m.label}
                      </span>
                    );
                  })}
                </div>
              </div>

              <div style={{ display: 'flex', gap: 10 }}>
                <button onClick={() => setFormOpen(false)} style={{ flex: 'none', width: 110, height: 52, border: `1.5px solid ${colors.border}`, borderRadius: 13, background: '#fff', fontWeight: 700, fontSize: 15, color: colors.inkSoft, cursor: 'pointer', fontFamily: 'inherit' }}>취소</button>
                <button onClick={submit} style={{ flex: 1, height: 52, border: 0, borderRadius: 13, background: colors.yellow, fontWeight: 800, fontSize: 16, color: colors.ink, cursor: 'pointer', fontFamily: 'inherit' }}>알림 추가하기</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Delete confirm */}
      {confirmId && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 25, background: 'rgba(20,17,10,.45)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ width: 360, background: '#fff', borderRadius: 20, padding: '28px 26px 22px', boxShadow: '0 30px 70px rgba(0,0,0,.32)', fontFamily: font.family }}>
            <div style={{ fontWeight: 800, fontSize: 18, letterSpacing: '-.02em' }}>알림을 삭제할까요?</div>
            <div style={{ fontWeight: 500, fontSize: 14, color: colors.textMuted, margin: '10px 0 22px', lineHeight: 1.5 }}>‘{confirmKeyword}’ 가격 알림이 삭제돼요. 이 작업은 되돌릴 수 없어요.</div>
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setConfirmId(null)} style={{ flex: 1, height: 50, border: `1.5px solid ${colors.border}`, borderRadius: 13, background: '#fff', fontWeight: 700, fontSize: 15, color: colors.inkSoft, cursor: 'pointer', fontFamily: 'inherit' }}>취소</button>
              <button onClick={doDelete} style={{ flex: 1, height: 50, border: 0, borderRadius: 13, background: '#E8453C', fontWeight: 800, fontSize: 15, color: '#fff', cursor: 'pointer', fontFamily: 'inherit' }}>삭제</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
