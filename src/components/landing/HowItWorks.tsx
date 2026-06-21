import { ar } from "../../content/strings";

export function HowItWorks() {
  return (
    <section className="container" style={{ paddingBlock: 32 }}>
      <h2 style={{ fontSize: 24 }}>{ar.howTitle}</h2>
      <ol style={{ color: "var(--muted)", fontSize: 17 }}>
        {ar.howSteps.map((s) => <li key={s}>{s}</li>)}
      </ol>
    </section>
  );
}
