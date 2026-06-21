import React from 'react';
import { colors } from '../tokens';

interface Props {
  /** Current [min, max] in 원 (KRW). */
  value: [number, number];
  min?: number;
  max?: number;
  step?: number;
  onChange: (next: [number, number]) => void;
}

/**
 * Dual-handle range slider in 원 (KRW). Two stacked native range inputs share
 * one track; the fill between the handles is highlighted. Handles can't cross.
 *
 * The thumb styling relies on a global stylesheet rule (see RangeSlider.css or
 * the snippet in README) because pseudo-elements (::-webkit-slider-thumb) can't
 * be expressed as inline styles. Add this once globally:
 *
 *   .moa-range{ -webkit-appearance:none; appearance:none; position:absolute;
 *     left:0; width:100%; height:18px; background:transparent; pointer-events:none;
 *     margin:0; padding:0; }
 *   .moa-range::-webkit-slider-thumb{ -webkit-appearance:none; appearance:none;
 *     width:18px; height:18px; border-radius:50%; background:#14110A;
 *     border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,.3); cursor:pointer;
 *     pointer-events:auto; }
 *   .moa-range::-moz-range-thumb{ width:18px; height:18px; border-radius:50%;
 *     background:#14110A; border:2px solid #fff; box-shadow:0 1px 4px rgba(0,0,0,.3);
 *     cursor:pointer; pointer-events:auto; }
 */
export const RangeSlider: React.FC<Props> = ({ value, min = 0, max = 3_000_000, step = 50_000, onChange }) => {
  const [lo, hi] = value;
  const pct = (v: number) => ((v - min) / (max - min)) * 100;

  const onLo = (e: React.ChangeEvent<HTMLInputElement>) => onChange([Math.min(+e.target.value, hi), hi]);
  const onHi = (e: React.ChangeEvent<HTMLInputElement>) => onChange([lo, Math.max(+e.target.value, lo)]);

  return (
    <div style={{ position: 'relative', height: 18, margin: '18px 2px 4px' }}>
      <div style={{ position: 'absolute', top: 6, left: 0, right: 0, height: 6, background: colors.line, borderRadius: 3 }} />
      <div style={{ position: 'absolute', top: 6, height: 6, background: colors.yellow, borderRadius: 3, left: `${pct(lo)}%`, right: `${100 - pct(hi)}%` }} />
      <input className="moa-range" type="range" min={min} max={max} step={step} value={lo} onChange={onLo} />
      <input className="moa-range" type="range" min={min} max={max} step={step} value={hi} onChange={onHi} />
    </div>
  );
};
