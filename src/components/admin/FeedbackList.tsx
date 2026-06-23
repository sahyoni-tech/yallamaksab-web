import { useEffect, useState } from "react";
import { ar } from "../../content/strings";
import { supabase } from "../../lib/supabase";
import { fetchFeedback, resolveFeedback, type FeedbackItem } from "../../lib/admin";

export function FeedbackList() {
  const [rows, setRows] = useState<FeedbackItem[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchFeedback(supabase)
      .then(setRows)
      .catch(() => setError(ar.adminError));
  }, []);

  const toggle = async (item: FeedbackItem) => {
    setBusyId(item.id);
    setError(null);
    try {
      await resolveFeedback(supabase, item.id, !item.resolved);
      setRows((cur) => (cur ? cur.map((r) => (r.id === item.id ? { ...r, resolved: !r.resolved } : r)) : cur));
    } catch {
      setError(ar.adminError);
    } finally {
      setBusyId(null);
    }
  };

  if (!rows) return <p className="container">…</p>;

  return (
    <div className="container" style={{ paddingBlock: 32 }}>
      <h1 style={{ fontSize: 24 }}>{ar.adminFeedbackTitle}</h1>
      {error && <p style={{ color: "var(--coral)" }}>{error}</p>}
      {rows.length === 0 && <p style={{ color: "var(--muted)" }}>{ar.adminFeedbackEmpty}</p>}
      {rows.map((f) => (
        <div key={f.id} style={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, padding: 16, marginBlock: 8, opacity: f.resolved ? 0.6 : 1 }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
            <strong>{f.type}</strong>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{[f.platform, f.app_version].filter(Boolean).join(" · ")}</span>
          </div>
          <p style={{ marginBlock: 8, whiteSpace: "pre-wrap" }}>{f.message}</p>
          {f.contact && <div style={{ color: "var(--muted)", fontSize: 14 }}>{f.contact}</div>}
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginTop: 8 }}>
            <span style={{ color: "var(--muted)", fontSize: 13 }}>{new Date(f.created_at).toLocaleString()}</span>
            <button className="btn-secondary" disabled={busyId === f.id} onClick={() => toggle(f)}>
              {f.resolved ? ar.adminFeedbackReopen : ar.adminFeedbackResolve}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
