import { ar } from "../../content/strings";

export function Hero() {
  return (
    <header className="container" style={{ textAlign: "center", paddingBlock: 56 }}>
      <img src="/wordmark.svg" alt={ar.brand} style={{ height: 64 }} />
      <h1 style={{ fontSize: 34, margin: "20px 0 8px" }}>{ar.tagline}</h1>
      <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 560, marginInline: "auto" }}>
        {ar.heroPitch}
      </p>
      <a href="#download" className="btn-primary" style={{ marginTop: 24 }}>
        {ar.downloadCta}
      </a>
    </header>
  );
}
