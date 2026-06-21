// Design tokens for Moa Search (Desktop, "Bold Editorial" direction)
// Extracted from the HTML design reference. Keep these as the single source of truth.

export const colors = {
  ink: '#14110A',        // primary text / dark surfaces
  inkSoft: '#333D4B',    // secondary text on cards
  yellow: '#F5C84C',     // primary accent (muted, non-glaring)
  yellowDeep: '#E5A600', // accent on white text (wordmark "서치")
  gold: '#A98A14',       // small editorial labels (section eyebrows)

  bg: '#FFFFFF',
  line: '#F0F0EE',       // hairline dividers
  line2: '#ECECEA',      // browser chrome / faint borders
  field: '#F4F5F7',      // input fill
  border: '#E5E8EB',     // input/chip outline

  textMuted: '#6B7684',
  textFaint: '#8B95A1',
  textGhost: '#B0B8C1',
} as const;

// One entry per supported marketplace. label is the Korean display name.
export const markets = {
  danggn:     { label: '당근',     bg: '#FFF0E6', fg: '#FF6600', dot: '#FF6600' },
  bunjang:    { label: '번개장터', bg: '#FFECEC', fg: '#D80C18', dot: '#D80C18' },
  joonggo:    { label: '중고나라', bg: '#E9F8EE', fg: '#0CB650', dot: '#0CB650' },
  hello:      { label: '헬로마켓', bg: '#EAF2FF', fg: '#2F6FE0', dot: '#2F6FE0' },
  secondwear: { label: '세컨웨어', bg: '#F1ECFF', fg: '#6D3FD4', dot: '#6D3FD4' },
} as const;

export type MarketKey = keyof typeof markets;

export const font = {
  // Pretendard is the key choice — load it globally (see README).
  family: `'Pretendard Variable', Pretendard, -apple-system, system-ui, sans-serif`,
} as const;

export const radius = {
  sm: 6,
  md: 11,
  lg: 14,
  xl: 18,
  pill: 999,
} as const;

export const shadow = {
  card: '0 4px 14px rgba(20,17,10,.06)',
  float: '0 22px 46px rgba(20,17,10,.20)',
  window: '0 16px 48px rgba(17,24,39,.16)',
} as const;
