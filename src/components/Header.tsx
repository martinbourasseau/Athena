import Link from "next/link";
import { site } from "@/content/site";
import { Mark } from "./Mark";

const nav = [
  { href: "/#services", label: "Services" },
  { href: "/#scenarios", label: "Scénarios" },
  { href: "/#methode", label: "Méthode" },
  { href: "/#synatrap", label: "SYNATRAP" },
];

export function Header() {
  return (
    <header className="header">
      <div className="wrap header-inner">
        <Link href="/" className="brand" aria-label={`${site.name}, accueil`}>
          <Mark className="brand-mark" />
          <span className="brand-name">{site.name}</span>
          <span className="brand-sub mono">{site.tagline}</span>
        </Link>
        <nav aria-label="Navigation principale" className="nav">
          {nav.map((n) => (
            <Link key={n.href} href={n.href}>
              {n.label}
            </Link>
          ))}
        </nav>
        <Link href="/#contact" className="button button--small">
          Parler de votre projet
        </Link>
      </div>
    </header>
  );
}
