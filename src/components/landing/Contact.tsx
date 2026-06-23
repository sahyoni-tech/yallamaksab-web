import { ar } from "../../content/strings";
import { Icon } from "./Icon";

// Founder fills real handles in the founder runbook. Until supplied, only email is live.
const TELEGRAM_URL = ""; // e.g. https://t.me/yallamaksab
const WHATSAPP_URL = ""; // e.g. https://wa.me/9639XXXXXXXX

export function Contact() {
  return (
    <section id="contact" className="section">
      <div className="container contact">
        <h2 className="h2">{ar.contactTitle}</h2>
        <div className="contact-channels">
          {TELEGRAM_URL && (
            <a className="btn-secondary" href={TELEGRAM_URL}>
              <Icon name="telegram" />
              {ar.contactTelegram}
            </a>
          )}
          {WHATSAPP_URL && (
            <a className="btn-secondary" href={WHATSAPP_URL}>
              <Icon name="whatsapp" />
              {ar.contactWhatsapp}
            </a>
          )}
          <a className="btn-secondary" href="mailto:hello@yallamaksab.com">
            <Icon name="mail" />
            hello@yallamaksab.com
          </a>
        </div>
      </div>
    </section>
  );
}
