import { ar } from "../../content/strings";

export function Contact() {
  return (
    <section id="contact" className="container" style={{ paddingBlock: 32 }}>
      <h2 style={{ fontSize: 24 }}>{ar.contactTitle}</h2>
      {/* Founder fills real handles in the founder runbook. Telegram + WhatsApp added when supplied. */}
      <a className="btn-secondary" href="mailto:hello@yallamaksab.com">hello@yallamaksab.com</a>
    </section>
  );
}
