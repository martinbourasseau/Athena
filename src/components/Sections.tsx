import { Loom } from "./Loom";
import { Weave } from "./Weave";
import { scenarios } from "@/content/scenarios";
import { realisations } from "@/content/realisations";
import { site } from "@/content/site";

export function Hero() {
  return (
    <section className="hero" aria-labelledby="hero-title">
      <div className="hero-warp" aria-hidden="true" />
      <div className="wrap hero-grid">
        <div className="hero-copy">
          <p className="eyebrow mono">Agents IA sur mesure · {site.location.city}</p>
          <h1 id="hero-title" className="hero-title">
            L&apos;intelligence,
            <br />
            <em>mise à l&apos;ouvrage.</em>
          </h1>
          <p className="hero-lead">
            Nous concevons, développons et personnalisons des agents IA qui exécutent de vraies tâches dans votre
            entreprise. Ils partent de vos outils et de vos règles, et s&apos;arrêtent là où vous voulez garder la main.
          </p>
          <div className="hero-actions">
            <a href="#contact" className="button">
              Parler de votre projet
            </a>
            <a href="#scenarios" className="button button--ghost">
              Voir des scénarios
            </a>
          </div>
        </div>
        <Loom />
      </div>
    </section>
  );
}

const pillars = [
  {
    word: "La chaîne",
    title: "Sur mesure",
    body: "L'agent part de vos outils, de vos documents et de votre façon de travailler. Pas l'inverse.",
  },
  {
    word: "La navette",
    title: "Exécution",
    body: "Il agit vraiment : il lit, classe, rédige, met à jour et vous rend compte de ce qu'il a fait.",
  },
  {
    word: "Le nœud",
    title: "Contrôle",
    body: "Aux étapes que vous choisissez, l'agent s'arrête et attend votre validation avant d'aller plus loin.",
  },
];

export function Pillars() {
  return (
    <section className="section pillars" aria-labelledby="pillars-title">
      <div className="wrap">
        <p className="eyebrow mono" data-reveal>
          Le principe
        </p>
        <h2 id="pillars-title" className="section-title" data-reveal>
          Vos tâches sont les fils. <em>L&apos;agent tisse.</em>
        </h2>
        <div className="pillars-grid">
          {pillars.map((p, i) => (
            <article key={p.title} className="pillar" data-reveal style={{ transitionDelay: `${i * 90}ms` }}>
              <PillarGlyph index={i} />
              <p className="mono pillar-word">{p.word}</p>
              <h3>{p.title}</h3>
              <p>{p.body}</p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function PillarGlyph({ index }: { index: number }) {
  return (
    <svg viewBox="0 0 120 56" className="pillar-glyph" aria-hidden="true" focusable="false">
      {Array.from({ length: 9 }, (_, c) => (
        <line key={c} x1={8 + c * 13} x2={8 + c * 13} y1={4} y2={52} className="glyph-warp" />
      ))}
      {index >= 1 ? <path d="M0 28 H120" className="glyph-weft" /> : null}
      {index === 1 ? <rect x="66" y="22" width="26" height="12" rx="6" className="glyph-shuttle" /> : null}
      {index === 2 ? (
        <>
          <path d="M0 28 H48 C 54 28, 54 18, 60 18 C 66 18, 66 28, 72 28 H120" className="glyph-weft" />
          <circle cx="60" cy="28" r="4" className="glyph-knot" />
        </>
      ) : null}
    </svg>
  );
}

export function Services() {
  return (
    <section id="services" className="section services" aria-labelledby="services-title">
      <div className="wrap services-grid">
        <div className="services-intro">
          <p className="eyebrow mono" data-reveal>
            Services
          </p>
          <h2 id="services-title" className="section-title" data-reveal>
            Un agent pensé pour <em>votre</em> travail.
          </h2>
          <p className="section-lead" data-reveal>
            Chaque agent est construit pour une tâche précise, dans votre contexte. Nous l&apos;accompagnons de la
            première idée jusqu&apos;à son usage au quotidien.
          </p>
        </div>
        <ol className="services-list">
          <li data-reveal>
            <span className="mono services-num">01</span>
            <div>
              <h3>Concevoir</h3>
              <p>
                Nous identifions avec vous la tâche à confier, les informations dont l&apos;agent a besoin, ses
                limites et les moments où il doit vous solliciter.
              </p>
            </div>
          </li>
          <li data-reveal>
            <span className="mono services-num">02</span>
            <div>
              <h3>Développer</h3>
              <p>
                Nous construisons l&apos;agent et le relions aux outils nécessaires, puis nous le testons sur des
                cas réels avant tout usage courant.
              </p>
            </div>
          </li>
          <li data-reveal>
            <span className="mono services-num">03</span>
            <div>
              <h3>Personnaliser</h3>
              <p>
                Nous ajustons son ton, ses règles et son périmètre à votre activité, et nous le faisons évoluer avec
                vos retours.
              </p>
            </div>
          </li>
        </ol>
        <div className="can-cannot" data-reveal>
          <div>
            <p className="mono can-label">Ce qu&apos;un agent sait faire</p>
            <ul>
              <li>Lire, trier et résumer des informations</li>
              <li>Rédiger des brouillons dans votre ton</li>
              <li>Appliquer des règles que vous définissez</li>
              <li>Agir dans les outils auxquels il a accès</li>
            </ul>
          </div>
          <div>
            <p className="mono can-label can-label--no">Ce qu&apos;il ne fait pas</p>
            <ul>
              <li>Décider seul de ce qui engage votre entreprise</li>
              <li>Accéder à ce que vous n&apos;avez pas autorisé</li>
              <li>Remplacer votre jugement sur les cas sensibles</li>
              <li>Être infaillible : il est conçu pour être vérifié</li>
            </ul>
          </div>
        </div>
      </div>
    </section>
  );
}

export function Scenarios() {
  return (
    <section id="scenarios" className="section scenarios" aria-labelledby="scenarios-title">
      <div className="wrap">
        <div className="scenarios-head">
          <div>
            <p className="eyebrow mono" data-reveal>
              Scénarios illustratifs
            </p>
            <h2 id="scenarios-title" className="section-title" data-reveal>
              Ce qu&apos;un agent <em>pourrait</em> prendre en charge.
            </h2>
          </div>
          <p className="notice" data-reveal>
            Les exemples ci-dessous sont des cas d&apos;usage possibles. Ce ne sont ni des clients, ni des projets
            réalisés, ni des résultats mesurés.
          </p>
        </div>
        <div className="scenarios-grid">
          {scenarios.map((s) => (
            <article key={s.id} className="scenario" data-reveal>
              <Weave seed={s.id + s.steps.join()} className="scenario-weave" rows={6} cols={34} />
              <p className="tag mono">Scénario illustratif</p>
              <h3>{s.title}</h3>
              <p className="scenario-situation">{s.situation}</p>
              <ol className="scenario-steps mono">
                {s.steps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="scenario-check">
                <span className="mono">Nœud</span> {s.checkpoint}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

export function Realisations() {
  const hasItems = realisations.length > 0;
  return (
    <section id="realisations" className="section realisations" aria-labelledby="realisations-title">
      <div className="wrap">
        <p className="eyebrow mono" data-reveal>
          Réalisations
        </p>
        <h2 id="realisations-title" className="section-title" data-reveal>
          Sur le métier.
        </h2>
        {hasItems ? (
          <div className="realisations-grid">
            {realisations.map((r) => (
              <article key={r.title} className="realisation" data-reveal>
                <Weave seed={r.title} className="realisation-weave" rows={8} cols={30} />
                {r.client ? <p className="mono tag">{r.client}</p> : null}
                <h3>{r.title}</h3>
                <p>{r.context}</p>
                <p>{r.whatTheAgentDoes}</p>
                {r.outcome ? <p className="realisation-outcome">{r.outcome}</p> : null}
                {r.link ? (
                  <a className="text-link" href={r.link}>
                    En savoir plus
                  </a>
                ) : null}
              </article>
            ))}
          </div>
        ) : (
          <div className="realisations-empty" data-reveal>
            <Weave seed="realisations-a-venir" className="empty-weave" rows={9} cols={48} accentRows={2} />
            <p>
              Les réalisations détaillées seront présentées ici dès qu&apos;elles pourront être documentées et
              validées avec les personnes concernées.
            </p>
          </div>
        )}
      </div>
    </section>
  );
}

const phases = [
  {
    name: "Diagnostic",
    body: "Nous partons d'une tâche concrète : ce qu'elle demande, les outils en jeu, les risques et ce qu'il faut garder sous contrôle.",
  },
  {
    name: "Prototype",
    body: "Une première version de l'agent est testée sur des exemples réels, avec vous, pour vérifier qu'il fait ce qui est attendu.",
  },
  {
    name: "Déploiement",
    body: "L'agent est installé dans votre environnement, avec ses accès limités au nécessaire et ses points de validation.",
  },
  {
    name: "Suivi",
    body: "Nous observons son fonctionnement, corrigeons ce qui doit l'être et l'ajustons à mesure que vos besoins évoluent.",
  },
];

export function Method() {
  return (
    <section id="methode" className="section method" aria-labelledby="method-title">
      <div className="wrap">
        <p className="eyebrow mono" data-reveal>
          Méthode
        </p>
        <h2 id="method-title" className="section-title" data-reveal>
          Quatre rangées, <em>une carte perforée.</em>
        </h2>
        <ol className="punchcard">
          {phases.map((p, i) => (
            <li key={p.name} className="punch-row" data-reveal style={{ transitionDelay: `${i * 80}ms` }}>
              <span className="punch-holes" aria-hidden="true">
                {Array.from({ length: 4 }, (_, h) => (
                  <span key={h} className={h <= i ? "hole is-punched" : "hole"} />
                ))}
              </span>
              <span className="mono punch-index">{String(i + 1).padStart(2, "0")}</span>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section id="confiance" className="section trust" aria-labelledby="trust-title">
      <div className="wrap">
        <p className="eyebrow mono" data-reveal>
          Confiance et données
        </p>
        <h2 id="trust-title" className="section-title" data-reveal>
          Voir clair, <em>même dans le noir.</em>
        </h2>
        <div className="trust-grid">
          <article data-reveal>
            <h3>Vous gardez la main</h3>
            <p>
              Les points de validation sont définis avec vous. Ce qui engage votre entreprise passe par une décision
              humaine.
            </p>
          </article>
          <article data-reveal>
            <h3>Des accès limités</h3>
            <p>
              Nous recensons ensemble les données dont l&apos;agent a besoin, et seulement celles-là. Le traitement
              des données personnelles est cadré dès le diagnostic.
            </p>
          </article>
          <article data-reveal>
            <h3>Des limites assumées</h3>
            <p>
              Une IA peut se tromper. Chaque agent est conçu pour être vérifiable : il cite ses sources, signale ses
              doutes et rend compte de ce qu&apos;il fait.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

export function Synatrap() {
  return (
    <section id="synatrap" className="section synatrap" aria-labelledby="synatrap-title">
      <div className="wrap synatrap-inner" data-reveal>
        <div>
          <p className="eyebrow mono">Plateforme complémentaire</p>
          <h2 id="synatrap-title" className="synatrap-title">
            {site.synatrap.name}
          </h2>
        </div>
        <div className="synatrap-copy">
          <p>
            SYNATRAP est une plateforme indépendante qui permet de découvrir des agents IA. C&apos;est un projet
            distinct d&apos;Athéna, avec son propre site.
          </p>
          <p>Athéna, de son côté, conçoit des agents sur mesure pour votre entreprise.</p>
          <a className="text-link" href={site.synatrap.url} target="_blank" rel="noopener">
            Découvrir SYNATRAP sur synatrap.com <span aria-hidden="true">↗</span>
            <span className="sr-only">(site externe, nouvel onglet)</span>
          </a>
        </div>
      </div>
    </section>
  );
}
