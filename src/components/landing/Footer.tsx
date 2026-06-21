import { ar } from "../../content/strings";

export function Footer() {
  return (
    <footer className="container" style={{ paddingBlock: 32, color: "var(--muted)", borderTop: "1px solid var(--border)" }}>
      <a className="btn-secondary" href="https://maksab.link/privacy">{ar.privacy}</a>{" "}
      <a className="btn-secondary" href="https://maksab.link/terms">{ar.terms}</a>
      <p>{ar.rights}</p>
    </footer>
  );
}
