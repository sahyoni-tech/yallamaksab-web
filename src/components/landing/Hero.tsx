import { ar } from "../../content/strings";
import { Icon } from "./Icon";
import { PhoneMockup } from "./PhoneMockup";
import { useReveal } from "../../hooks/useReveal";

export function Hero() {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section id="top" className="section">
      <div ref={ref} className="container hero reveal">
        <div className="hero-text">
          <img className="hero-icon" src="/icon-192.png" alt={ar.brand} width={72} height={72} />
          <div className="hero-brand">{ar.brand}</div>
          <h1 className="hero-title">{ar.tagline}</h1>
          <p className="hero-pitch">{ar.heroPitch}</p>
          <div className="hero-cta">
            <a className="btn-primary" href="#download">
              {ar.downloadCta}
            </a>
            <span className="chip">
              <Icon name="check" />
              {ar.androidChip}
            </span>
          </div>
          <p className="hero-note">{ar.playSoon}</p>
        </div>
        <div className="hero-visual">
          <PhoneMockup src="/screens/hero.png" alt={ar.heroShot} />
        </div>
      </div>
    </section>
  );
}
