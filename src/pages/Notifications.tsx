import React, { useEffect, useState } from 'react';
import { colors, font } from '../tokens';
import { useAuth } from '../lib/useAuth';
import { fetchNotifications, markAllRead as markAllReadApi, relativeTime, isToday, type NotiRow } from '../lib/notifications';

const eyebrow: React.CSSProperties = { fontWeight: 800, fontSize: 13, letterSpacing: '.04em', color: colors.gold, marginBottom: 12 };

const Row: React.FC<{ n: NotiRow; muted?: boolean }> = ({ n, muted }) => {
  const open = () => { if (n.listing_url) window.open(n.listing_url, '_blank', 'noopener,noreferrer'); };
  return (
    <div onClick={open} style={{ display: 'flex', gap: 13, padding: '18px 20px', borderBottom: '1px solid #F6F6F4', cursor: n.listing_url ? 'pointer' : 'default' }}>
      <span style={{ width: 10, height: 10, borderRadius: '50%', background: n.dot ?? colors.yellow, marginTop: 6, flex: 'none' }} />
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontWeight: 700, fontSize: 15, color: muted ? colors.inkSoft : colors.ink }}>{n.title}</div>
        {n.body && <div style={{ fontWeight: 500, fontSize: 13.5, color: muted ? colors.textFaint : colors.textMuted, margin: '3px 0 5px', lineHeight: 1.45 }}>{n.body}</div>}
        <div style={{ fontWeight: 500, fontSize: 12, color: muted ? '#C4CAD0' : colors.textGhost }}>{relativeTime(n.created_at)}</div>
      </div>
    </div>
  );
};

/** 알림 — Supabase notifications 연동. 가격 알림이 발동되면 여기에 쌓인다. 로그인 필요. */
export const Notifications: React.FC = () => {
  const { user, loading: authLoading } = useAuth();
  const [list, setList] = useState<NotiRow[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    async function load() {
      if (!user) {
        if (active) {
          setList([]);
          setLoading(false);
        }
        return;
      }
      if (active) setLoading(true);
      try {
        const rows = await fetchNotifications();
        if (active) setList(rows);
      } catch (e) {
        console.error(e);
      } finally {
        if (active) setLoading(false);
      }
    }
    load();
    return () => {
      active = false;
    };
  }, [user]);

  const markAllRead = async () => {
    setList((l) => l.map((n) => ({ ...n, read: true })));
    try {
      await markAllReadApi();
    } catch (e) {
      console.error(e);
    }
  };

  const today = list.filter((n) => isToday(n.created_at));
  const earlier = list.filter((n) => !isToday(n.created_at));

  if (!authLoading && !user) {
    return (
      <div style={{ fontFamily: font.family, color: colors.ink, padding: '80px 56px', maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
        <h2 style={{ fontWeight: 800, fontSize: 26, letterSpacing: '-.03em' }}>알림</h2>
        <p style={{ fontWeight: 500, fontSize: 15, color: colors.textMuted, marginTop: 12 }}>로그인하면 가격 알림 등 내 알림을 확인할 수 있어요.</p>
      </div>
    );
  }

  return (
    <div style={{ fontFamily: font.family, color: colors.ink, padding: '40px 56px 60px', maxWidth: 800, margin: '0 auto' }}>
      <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28 }}>
        <h2 style={{ fontWeight: 800, fontSize: 30, letterSpacing: '-.03em', margin: 0 }}>알림</h2>
        <span onClick={markAllRead} style={{ fontWeight: 700, fontSize: 13, color: colors.textFaint, cursor: 'pointer' }}>모두 읽음</span>
      </div>

      {loading ? (
        <div style={{ padding: '60px 0', textAlign: 'center', fontWeight: 600, fontSize: 14, color: colors.textFaint }}>불러오는 중…</div>
      ) : list.length === 0 ? (
        <div style={{ padding: '80px 0', textAlign: 'center' }}>
          <div style={{ fontWeight: 700, fontSize: 17, color: colors.inkSoft }}>아직 알림이 없어요</div>
          <div style={{ fontWeight: 500, fontSize: 14, color: colors.textFaint, marginTop: 8 }}>가격 알림을 만들어 두면 조건에 맞는 매물이 올라올 때 알려드려요.</div>
        </div>
      ) : (
        <>
          {today.length > 0 && (
            <>
              <div style={eyebrow}>오늘</div>
              <div style={{ background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 18, overflow: 'hidden', marginBottom: 26 }}>
                {today.map((n) => <Row key={n.id} n={n} />)}
              </div>
            </>
          )}
          {earlier.length > 0 && (
            <>
              <div style={eyebrow}>이전 알림</div>
              <div style={{ background: '#fff', border: `1px solid ${colors.line}`, borderRadius: 18, overflow: 'hidden' }}>
                {earlier.map((n) => <Row key={n.id} n={n} muted />)}
              </div>
            </>
          )}
        </>
      )}
    </div>
  );
};
