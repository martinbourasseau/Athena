import { site } from "@/content/site";
import { bookingUrl, isFormConfigured } from "@/lib/env";
import { QualificationForm } from "./QualificationForm";
import { Woven } from "./Woven";

/**
 * Trois parcours : formulaire de qualification (principal), email et
 * réservation (alternatives). Chacun n'est actif que s'il est réellement
 * configuré ; sinon il l'indique clairement.
 */
export function Contact() {
  const formEnabled = isFormConfigured();
  const booking = bookingUrl();
  const email = site.contact.email;

  return (
    <section id="contact" className="section contact" aria-labelledby="contact-title">
      <div className="wrap contact-grid">
        <div className="contact-intro">
          <p className="eyebrow mono" data-reveal>
            Contact
          </p>
          <Woven id="contact-title" className="section-title" parts={["Parlons de ", { em: "votre" }, " agent."]} />
          <p className="section-lead" data-reveal>
            Décrivez la tâche que vous aimeriez confier à un agent. Quelques lignes suffisent pour démarrer
            l&apos;échange.
          </p>

          <div className="contact-alts" data-reveal>
            <p className="mono contact-alts-label">Ou, si vous préférez</p>

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
