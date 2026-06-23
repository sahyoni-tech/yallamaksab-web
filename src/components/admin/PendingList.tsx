import { useEffect, useState } from "react";
import { ar } from "../../content/strings";
import { supabase } from "../../lib/supabase";
import {
  fetchPendingMerchants,
  approveMerchant,
  rejectMerchant,
  type PendingMerchant,
} from "../../lib/admin";

export function PendingList() {
  const [rows, setRows] = useState<PendingMerchant[] | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busyId, setBusyId] = useState<string | null>(null);

  useEffect(() => {
    fetchPendingMerchants(supabase)
      .then(setRows)
      .catch(() => setError(ar.adminError));
  }, []);

  const act = async (id: string, fn: (id: string) => Promise<void>) => {
    setBusyId(id);
    setError(null);
    try {
      await fn(id);
      setRows((cur) => (cur ? cur.filter((r) => r.id !== id) : cur));
    } catch {
      setError(ar.adminError);
    } finally {
      setBusyId(null);
    }
  };

  if (!rows) return <p className="container">…</p>;

  return (
    <div className="container" style={{ paddingBlock: 32 }}>
      <h1 style={{ fontSize: 24 }}>{ar.adminPendingTitle}</h1>
      {error && <p style={{ color: "var(--coral)" }}>{error}</p>}
      {rows.length === 0 && <p style={{ color: "var(--muted)" }}>{ar.adminEmpty}</p>}
      {rows.map((m) => (
        <div
          key={m.id}
          style={{
            background: "var(--card)",
            border: "1px solid var(--border)",
            borderRadius: 12,
            padding: 16,
            marginBlock: 8,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            gap: 12,
          }}
        >
          <div>
            <strong>{m.business_name}</strong>
            <div style={{ color: "var(--muted)", fontSize: 14 }}>{m.category}</div>
          </div>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn-primary"
              disabled={busyId === m.id}
              onClick={() => act(m.id, (id) => approveMerchant(supabase, id))}
            >
              {ar.adminApprove}
            </button>
            <button
              className="btn-secondary"
              disabled={busyId === m.id}
              onClick={() => act(m.id, (id) => rejectMerchant(supabase, id))}
            >
              {ar.adminReject}
            </button>
          </div>
        </div>
      ))}
    </div>
  );
}
