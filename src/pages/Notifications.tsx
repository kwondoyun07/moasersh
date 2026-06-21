import React, { useMemo, useState } from 'react';
import { colors, font } from '../tokens';
import { notifications as defaultNotifications } from '../data';
import type { NotificationItem } from '../types';

interface Props {
  items?: NotificationItem[];
}

const eyebrow: React.CSSProperties = { fontWeight: 800, fontSize: 13, letterSpacing: '.04em', color: colors.gold, marginBottom: 12 };

const Row: React.FC<{ n: NotificationItem; muted?: boolean }> = ({ n, muted }) => (
  <div style={{ display: 'flex', gap: 13, padding: '18px 20px', borderBottom: '1px solid #F6F6F4' }}>
    <span style={{ width: 10, height: 10, borderRadius: '50%', background: n.dot, marginTop: 6, flex: 'none' }} />
    <div style={{ flex: 1, minWidth: 0 }}>
      <div style={{ fontWeight: 700, fontSize: 15, color: muted ? colors.inkSoft : colors.ink }}>{n.title}</div>
      <div style={{ fontWeight: 500, fontSize: 13.5, color: muted ? colors.textFaint : colors.textMuted, margin: '3px 0 5px', lineHeight: 1.45 }}>{n.desc}</div>
      <div style={{ fontWeight: 500, fontSize: 12, color: muted ? '#C4CAD0' : colors.textGhost }}>{n.time}</div>
    </div>
  </div>
);

/** 알림 — full notifications page (content area; renders inside the shared header/shell). */
export const Notifications: React.FC<Props> = ({ items = defaultNotifications }) => {
  const [list, setList] = useState(items);
  const today = useMemo(() => list.filter((n) => n.group === '오늘'), [list]);
  const earlier = useMemo(() => list.filter((n) => n.group === '이전'), [list]);
  const markAllRead = () => setList((l) => l.map((n) => ({ ...n, unread: false })));

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, padding: '40px 56px 60px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: 0 }}>알림</h2>
        <span onClick={markAllRead} style={{ fontWeight: 700, fontSize: 13, color: colors.textFaint, cursor: 'pointer' }}>모두 읽음</span>
      </div>

      <div style={eyebrow}>오늘</div>
      <div style={{ background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 18, overflow: 'hidden', marginBottom: 26 }}>
        {today.map((n) => <Row key={n.id} n={n} />)}
      </div>

      <div style={eyebrow}>이전 알림</div>
      <div style={{ background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 18, overflow: 'hidden' }}>
        {earlier.map((n) => <Row key={n.id} n={n} muted />)}
      </div>
    </div>
  );
};
