import { ar } from "../../content/strings";

export function ForShoppers() {
  return (
    <section className="container" style={{ paddingBlock: 32 }}>
      <h2 style={{ fontSize: 24 }}>{ar.shoppersTitle}</h2>
      <ul style={{ color: "var(--muted)", fontSize: 17 }}>
        {ar.shoppersPoints.map((p) => <li key={p}>{p}</li>)}
      </ul>
    </section>
  );
}
