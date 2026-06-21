import { useState } from "react";
import { ar } from "../../content/strings";
import { supabase } from "../../lib/supabase";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        options: { emailRedirectTo: window.location.origin + "/admin" },
      });
      if (error) throw new Error(error.message);
      setSent(true);
    } catch {
      setError(ar.adminError);
    } finally {
      setBusy(false);
    }
  };

  if (sent) return <p className="container">{ar.adminLinkSent}</p>;

  return (
    <div className="container" style={{ maxWidth: 380, paddingBlock: 48 }}>
      <h1 style={{ fontSize: 24 }}>{ar.adminTitle}</h1>
      <label style={{ display: "block", color: "var(--muted)", marginBottom: 6 }}>{ar.adminEmailLabel}</label>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        dir="ltr"
        style={{ width: "100%", height: 44, borderRadius: 12, border: "1px solid var(--border)", padding: "0 12px" }}
      />
      <button className="btn-primary" onClick={send} disabled={busy || !email.trim()} style={{ marginTop: 16, width: "100%" }}>
        {ar.adminSendLink}
      </button>
      {error && <p style={{ color: "var(--coral)" }}>{error}</p>}
    </div>
  );
}
