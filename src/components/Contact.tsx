import { site } from "@/content/site";
import { bookingUrl, isFormConfigured } from "@/lib/env";
import { QualificationForm } from "./QualificationForm";
import { Kinetic } from "./Kinetic";

/**
 * Fin de page : deux voies pour continuer.
 * A — un besoin propre à l'entreprise : décrire son projet à Athéna.
 * B — découvrir SYNATRAP, plateforme indépendante, sur son propre site.
 *
 * Pour la voie A, trois moyens de contact : formulaire de qualification
 * (principal), email et réservation. Chacun n'est actif que s'il est
 * réellement configuré ; sinon il l'indique clairement.
 */
export function Contact() {
  const formEnabled = isFormConfigured();
  const booking = bookingUrl();
  const email = site.contact.email;

  return (
    <section id="contact" className="section contact" data-scene="5" aria-labelledby="contact-title">
      <div className="wrap">
        <p className="section-label">Pour continuer</p>
        <Kinetic id="contact-title" className="section-title" parts={["Deux voies, ", { tense: "à vous de choisir." }]} />
        <div className="paths" data-reveal>
          <div className="path path--athena">
            <p className="path-for">J&apos;ai un besoin spécifique pour mon entreprise</p>
            <p className="path-text">
              Décrivez votre projet : nous étudions avec vous l&apos;agent sur mesure qui peut y répondre.
            </p>
            <a className="button" href="#projet">
              Décrire mon projet
            </a>
          </div>
          <div className="path path--synatrap">
            <p className="path-for">Je veux découvrir {site.synatrap.name}</p>
            <p className="path-text">
              Explorez des agents prêts à installer ou créez le vôtre sur la plateforme {site.synatrap.name}.
            </p>
            <a className="syn-cta" href={site.synatrap.url} target="_blank" rel="noopener">
              Découvrir {site.synatrap.name} <span aria-hidden="true">↗</span>
              <span className="sr-only">(synatrap.com, nouvel onglet)</span>
            </a>
          </div>
        </div>
      </div>

      <div className="wrap contact-grid" id="projet">
        <div className="contact-intro">
          <h3 className="contact-title">Décrire votre projet</h3>
          <p className="section-lead" data-reveal>
            Quelles missions aimeriez-vous confier à un agent ? Quelques lignes suffisent pour démarrer
            l&apos;échange.
          </p>

          <div className="contact-alts" data-reveal>
            <p className="contact-alts-label">Ou, si vous préférez</p>

            <div className={`alt ${email ? "" : "is-pending"}`}>
              <p className="alt-title">Écrire directement</p>
              {email ? (
                <a className="text-link" href={`mailto:${email}`}>
                  {email}
                </a>
              ) : (
                <p className="alt-note">L&apos;adresse email de contact sera publiée prochainement.</p>
              )}
            </div>

            <div className={`alt ${booking ? "" : "is-pending"}`}>
              <p className="alt-title">Réserver un rendez-vous</p>
              {booking ? (
                <a className="text-link" href={booking} target="_blank" rel="noopener">
                  Choisir un créneau <span aria-hidden="true">↗</span>
                  <span className="sr-only">(outil de réservation externe, nouvel onglet)</span>
                </a>
              ) : (
                <p className="alt-note">La réservation en ligne n&apos;est pas encore ouverte.</p>
              )}
            </div>
          </div>
        </div>

        <QualificationForm enabled={formEnabled} />
      </div>
    </section>
  );
}
