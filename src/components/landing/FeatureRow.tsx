import { Icon, type IconName } from "./Icon";
import { PhoneMockup } from "./PhoneMockup";
import { useReveal } from "../../hooks/useReveal";

type Point = { icon: IconName; text: string; desc: string };

type Props = {
  eyebrow: string;
  title: string;
  points: Point[];
  image: { src: string; alt: string };
  side: "start" | "end";
  cta?: { href: string; label: string };
};

export function FeatureRow({ eyebrow, title, points, image, side, cta }: Props) {
  const ref = useReveal<HTMLDivElement>();
  return (
    <section className="section">
      <div ref={ref} className={`container feature reveal feature-${side}`}>
        <div className="feature-visual">
          <PhoneMockup src={image.src} alt={image.alt} />
        </div>
        <div className="feature-text">
          <p className="eyebrow">{eyebrow}</p>
          <h2 className="h2">{title}</h2>
          <ul className="feature-points">
            {points.map((p) => (
              <li key={p.text}>
                <span className="feature-ic">
                  <Icon name={p.icon} />
                </span>
                <span>
                  <strong>{p.text}</strong>
                  <span className="lead feature-desc">{p.desc}</span>
                </span>
              </li>
            ))}
          </ul>
          {cta && (
            <a className="btn-secondary" href={cta.href}>
              {cta.label}
            </a>
          )}
        </div>
      </div>
    </section>
  );
}
