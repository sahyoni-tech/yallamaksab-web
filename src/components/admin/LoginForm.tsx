import { useState } from "react";
import { ar } from "../../content/strings";
import { supabase } from "../../lib/supabase";

const inputStyle = {
  width: "100%",
  height: 44,
  borderRadius: 12,
  border: "1px solid var(--border)",
  padding: "0 12px",
} as const;

export function LoginForm() {
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithOtp({
        email: email.trim(),
        // Don't provision a new account from the login screen — only
        // already-registered users can request an admin code.
        options: { shouldCreateUser: false },
      });
      if (error) throw new Error(error.message);
      setSent(true);
    } catch {
      setError(ar.adminError);
    } finally {
      setBusy(false);
    }
  };

  // verifyOtp validates the code length server-side per the project's
  // "Email OTP Length" setting, so we don't hardcode a digit count here.
  const verify = async () => {
    setError(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.verifyOtp({
        email: email.trim(),
        token: code.trim(),
        type: "email",
      });
      if (error) throw new Error(error.message);
      // On success onAuthStateChange sets the session and Admin swaps this out.
    } catch {
      setError(ar.adminError);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="container" style={{ maxWidth: 380, paddingBlock: 48 }}>
      <h1 style={{ fontSize: 24 }}>{ar.adminTitle}</h1>

      {!sent ? (
        <>
          <label style={{ display: "block", color: "var(--muted)", marginBottom: 6 }}>{ar.adminEmailLabel}</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            dir="ltr"
            style={inputStyle}
          />
          <button className="btn-primary" onClick={send} disabled={busy || !email.trim()} style={{ marginTop: 16, width: "100%" }}>
            {ar.adminSendLink}
          </button>
        </>
      ) : (
        <>
          <p style={{ color: "var(--muted)", marginBottom: 16 }}>{ar.adminLinkSent}</p>
          <label style={{ display: "block", color: "var(--muted)", marginBottom: 6 }}>{ar.adminCodeLabel}</label>
          <input
            type="text"
            inputMode="numeric"
            autoComplete="one-time-code"
            maxLength={10}
            value={code}
            onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
            dir="ltr"
            style={{ ...inputStyle, letterSpacing: "0.3em", textAlign: "center" }}
          />
          <button className="btn-primary" onClick={verify} disabled={busy || !code.trim()} style={{ marginTop: 16, width: "100%" }}>
            {ar.adminVerify}
          </button>
        </>
      )}

      {error && <p style={{ color: "var(--coral)" }}>{error}</p>}
    </div>
  );
}
