import { ar } from "../../content/strings";

export function Footer() {
  return (
    <footer className="site-footer">
      <div className="container site-footer-row">
        <div className="site-brand">
          <img src="/icon-192.png" alt="" width={28} height={28} />
          <span>{ar.brand}</span>
        </div>
        <nav className="site-footer-links">
          <a href="https://maksab.link/privacy">{ar.privacy}</a>
          <a href="https://maksab.link/terms">{ar.terms}</a>
        </nav>
        <p className="site-footer-rights">{ar.rights}</p>
      </div>
    </footer>
  );
}
