import Link from "next/link";
import { site } from "@/content/site";
import { Mark } from "./Mark";

export function Footer() {
  const group = site.group.url ? (
    <a href={site.group.url} className="text-link">
      {site.group.name}
    </a>
  ) : (
    <span>{site.group.name}</span>
  );

  return (
    <footer className="footer">
      <div className="wrap footer-inner">
        <div className="footer-brand">
          <Mark className="footer-mark" />
          <div>
            <p className="footer-name">{site.name}</p>
            <p className="footer-sub">Une maison du {group}</p>
          </div>
        </div>
        <nav aria-label="Liens de pied de page" className="footer-links">
          <Link href="/#contact">Contact</Link>
          <a href={site.synatrap.url} rel="noopener" target="_blank">
            SYNATRAP <span className="sr-only">(site externe, nouvel onglet)</span>↗
          </a>
          <Link href="/mentions-legales">Mentions légales</Link>
        </nav>
        <p className="footer-loc mono">{site.location.label}</p>
      </div>
    </footer>
  );
}
