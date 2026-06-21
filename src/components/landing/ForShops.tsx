import { ar } from "../../content/strings";

export function ForShops() {
  return (
    <section className="container" style={{ paddingBlock: 32 }}>
      <h2 style={{ fontSize: 24 }}>{ar.shopsTitle}</h2>
      <ul style={{ color: "var(--muted)", fontSize: 17 }}>
        {ar.shopsPoints.map((p) => <li key={p}>{p}</li>)}
      </ul>
      <a href="#download" className="btn-secondary">{ar.shopsCta}</a>
    </section>
  );
}
