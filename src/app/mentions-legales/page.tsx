import type { Metadata } from "next";
import { site } from "@/content/site";

export const metadata: Metadata = {
  title: "Mentions légales",
  alternates: { canonical: "/mentions-legales" },
};

const rows: { label: string; value: string | null }[] = [
  { label: "Éditeur", value: site.legal.publisher },
  { label: "Statut", value: site.legal.status },
  { label: "SIRET", value: site.legal.siret },
  { label: "Adresse", value: site.legal.address },
  { label: "Contact", value: site.contact.email },
  { label: "Hébergeur", value: site.legal.host },
];

export default function MentionsLegales() {
  const complete = rows.every((r) => r.value);
  return (
    <section className="section legal">
      <div className="wrap legal-inner">
        <p className="eyebrow mono">Informations</p>
        <h1 className="section-title">Mentions légales</h1>
        {!complete ? (
          <p className="notice">Certaines informations légales sont en cours de complétion.</p>
        ) : null}
        <dl className="legal-list">
          {rows
            .filter((r) => r.value)
            .map((r) => (
              <div key={r.label}>
                <dt className="mono">{r.label}</dt>
                <dd>{r.value}</dd>
              </div>
            ))}
        </dl>
        <h2>Données personnelles</h2>
        <p>
          Les informations transmises via le formulaire de contact servent uniquement à répondre à votre demande.
          Vous pouvez demander leur consultation, leur rectification ou leur suppression en écrivant à
          l&apos;adresse de contact du site.
        </p>
      </div>
    </section>
  );
}
