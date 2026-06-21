import { ar } from "../../content/strings";

export function Hero() {
  return (
    <header className="container" style={{ textAlign: "center", paddingBlock: 56 }}>
      {/* App icon as a rounded tile (the brand mark is dark-paneled by design —
          a rounded tile + shadow reads as "the app", not a clipped square on cream).
          Brand name renders as text below in Tajawal (loaded in index.html). */}
      <img
        src="/icon-192.png"
        alt={ar.brand}
        width={80}
        height={80}
        style={{ borderRadius: 20, boxShadow: "0 6px 20px rgba(0,0,0,0.12)" }}
      />
      <div style={{ fontSize: 30, fontWeight: 700, marginTop: 16 }}>{ar.brand}</div>
      <h1 style={{ fontSize: 34, margin: "8px 0 8px" }}>{ar.tagline}</h1>
      <p style={{ color: "var(--muted)", fontSize: 18, maxWidth: 560, marginInline: "auto" }}>
        {ar.heroPitch}
      </p>
      <a href="#download" className="btn-primary" style={{ marginTop: 24 }}>
        {ar.downloadCta}
      </a>
    </header>
  );
}
