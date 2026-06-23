import { useEffect, useState } from "react";
import { ar } from "../../content/strings";

export function Header() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);
  return (
    <header className={scrolled ? "site-header is-scrolled" : "site-header"}>
      <div className="container site-header-row">
        <a className="site-brand" href="#top">
          <img src="/icon-192.png" alt="" width={32} height={32} />
          <span>{ar.brand}</span>
        </a>
        <a className="btn-primary site-header-cta" href="#download">
          {ar.navDownload}
        </a>
      </div>
    </header>
  );
}
