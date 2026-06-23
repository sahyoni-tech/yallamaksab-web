import { ar } from "../../content/strings";
import { useReveal } from "../../hooks/useReveal";

export function HowItWorks() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section band-tint">
      <div ref={ref} className="container how reveal">
        <h2 className="h2 how-title">{ar.howTitle}</h2>
        <ol className="how-steps">
          {ar.howSteps.map((s, i) => (
            <li className="how-step" key={s}>
              <span className="how-num">{i + 1}</span>
              <h3 className="how-step-title">{s}</h3>
              <p className="lead">{ar.howDesc[i]}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
