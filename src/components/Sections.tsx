import type { CSSProperties } from "react";
import { Kinetic, Decode } from "./Kinetic";
import { Orchestration } from "./Orchestration";
import { realisations } from "@/content/realisations";
import { site } from "@/content/site";

/* Chaque section porte `data-scene` : la forme que prend l'univers derrière elle.
   0 visage d'Athéna · 1 chaîne · 2 tissu · 3 réseau · 4 hélice · 5 noyau */

export function Hero() {
  return (
    <section className="hero" data-scene="0" aria-labelledby="hero-title">
      <div className="wrap hero-inner">
        <p className="hero-kicker" data-reveal="fade">
          <Decode text={`Agents IA sur mesure · ${site.location.city}`} />
        </p>
        <Kinetic
          as="h1"
          id="hero-title"
          className="hero-title"
          intro
          parts={["L’intelligence,", { br: true }, { tense: "mise à l’ouvrage." }]}
        />
        <p className="hero-lead hero-in" style={{ "--d": "700ms" } as CSSProperties}>
          Nous concevons, développons et personnalisons des agents IA qui exécutent de vraies tâches dans votre
          entreprise. Ils partent de vos outils et de vos règles, et s&apos;arrêtent là où vous voulez garder la main.
        </p>
        <div className="hero-actions hero-in" style={{ "--d": "820ms" } as CSSProperties}>
          <a href="#contact" className="button">
            Parler de votre projet
          </a>
          <a href="#scenarios" className="button button--ghost">
            Voir des scénarios
          </a>
        </div>
      </div>
      <p className="hero-legend hero-in" style={{ "--d": "1100ms" } as CSSProperties}>
        <span className="hero-legend-line" aria-hidden="true" />
        Athéna, déesse de l&apos;intelligence et de l&apos;ouvrage, sculptée en points de lumière.
      </p>
      <a className="scroll-cue hero-in" href="#principe" style={{ "--d": "1300ms" } as CSSProperties}>
        <span className="sr-only">Aller au principe</span>
        <span className="scroll-cue-line" aria-hidden="true" />
      </a>
    </section>
  );
}

const manifesto = "Vos tâches sont les fils. L’agent tisse.".split(" ");

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
    <section id="principe" className="section principle" data-scene="1" aria-labelledby="pillars-title">
      <div className="principle-sticky" data-progress>
        <div className="wrap">
          <p className="section-label">Le principe</p>
          <h2 id="pillars-title" className="manifesto" style={{ "--n": manifesto.length } as CSSProperties}>
            {manifesto.map((w, i) => (
              <span key={i} className={i >= 5 ? "tense" : undefined} style={{ "--i": i } as CSSProperties}>
                {w}{" "}
              </span>
            ))}
          </h2>
        </div>
      </div>
      <div className="wrap">
        <div className="pillars">
          {pillars.map((p, i) => (
            <article key={p.title} className="pillar" data-reveal style={{ "--d": `${i * 120}ms` } as CSSProperties}>
              <PillarGlyph index={i} />
              <p className="pillar-word">{p.word}</p>
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
        <line
          key={c}
          x1={8 + c * 13}
          x2={8 + c * 13}
          y1={4}
          y2={52}
          className="glyph-warp"
          pathLength={1}
          style={{ "--c": c } as CSSProperties}
        />
      ))}
      {index === 1 ? <path d="M0 28 H120" className="glyph-weft" pathLength={1} /> : null}
      {index === 1 ? <rect x="66" y="23" width="26" height="10" rx="5" className="glyph-shuttle" /> : null}
      {index === 2 ? (
        <>
          <path d="M0 28 H48 C 54 28, 54 18, 60 18 C 66 18, 66 28, 72 28 H120" className="glyph-weft" pathLength={1} />
          <circle cx="60" cy="28" r="4" className="glyph-knot" />
        </>
      ) : null}
    </svg>
  );
}

const services = [
  {
    name: "Concevoir",
    body: "Nous identifions avec vous la tâche à confier, les informations dont l'agent a besoin, ses limites et les moments où il doit vous solliciter.",
  },
  {
    name: "Développer",
    body: "Nous construisons l'agent et le relions aux outils nécessaires, puis nous le testons sur des cas réels avant tout usage courant.",
  },
  {
    name: "Personnaliser",
    body: "Nous ajustons son ton, ses règles et son périmètre à votre activité, et nous le faisons évoluer avec vos retours.",
  },
];

export function Services() {
  return (
    <section id="services" className="section services" data-scene="2" aria-labelledby="services-title">
      <div className="wrap services-grid">
        <div className="services-intro">
          <p className="section-label">Services</p>
          <Kinetic id="services-title" className="section-title" parts={["Un agent pensé ", { tense: "pour votre travail." }]} />
          <p className="section-lead" data-reveal>
            Chaque agent est construit pour une tâche précise, dans votre contexte. Nous l&apos;accompagnons de la
            première idée jusqu&apos;à son usage au quotidien.
          </p>
        </div>
        <ol className="services-list">
          {services.map((sv, i) => (
            <li key={sv.name} data-reveal data-spot style={{ "--d": `${i * 100}ms` } as CSSProperties}>
              <span className="services-num" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{sv.name}</h3>
              <p>{sv.body}</p>
            </li>
          ))}
        </ol>
      </div>
      <div className="wrap">
        <div className="can-cannot" data-reveal>
          <div>
            <h3 className="can-label">Ce qu&apos;un agent sait faire</h3>
            <ul>
              <li>Lire, trier et résumer des informations</li>
              <li>Rédiger des brouillons dans votre ton</li>
              <li>Appliquer des règles que vous définissez</li>
              <li>Agir dans les outils auxquels il a accès</li>
            </ul>
          </div>
          <div>
            <h3 className="can-label can-label--no">Ce qu&apos;il ne fait pas</h3>
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
    <section id="scenarios" className="section scenarios" data-scene="3" aria-labelledby="scenarios-title">
      <div className="wrap">
        <div className="scenarios-head">
          <div>
            <p className="section-label">Scénarios illustratifs</p>
            <Kinetic
              id="scenarios-title"
              className="section-title"
              parts={["Ce qu’un agent pourrait ", { tense: "prendre en charge." }]}
            />
          </div>
          <p className="notice" data-reveal>
            Les exemples ci-dessous sont des cas d&apos;usage possibles. Ce ne sont ni des clients, ni des projets
            réalisés, ni des résultats mesurés.
          </p>
        </div>
        <div data-reveal>
          <Orchestration />
        </div>
      </div>
    </section>
  );
}

export function Realisations() {
  const hasItems = realisations.length > 0;
  return (
    <section id="realisations" className="section realisations" data-scene="3" aria-labelledby="realisations-title">
      <div className="wrap realisations-inner">
        <p className="section-label">Réalisations</p>
        <Kinetic id="realisations-title" className="section-title" parts={["Sur le ", { tense: "métier." }]} />
        {hasItems ? (
          <div className="realisations-grid">
            {realisations.map((r) => (
              <article key={r.title} className="realisation" data-reveal>
                {r.client ? <p className="orch-tag">{r.client}</p> : null}
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
          <p className="realisations-empty" data-reveal>
            Les réalisations détaillées seront présentées ici dès qu&apos;elles pourront être documentées et validées
            avec les personnes concernées.
          </p>
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
    <section id="methode" className="section method" data-scene="4" aria-labelledby="method-title">
      <div className="wrap method-grid">
        <div className="method-intro">
          <p className="section-label">Méthode</p>
          <Kinetic id="method-title" className="section-title" parts={["Quatre étapes, ", { tense: "un seul fil." }]} />
        </div>
        <div className="timeline" data-progress>
          <span className="timeline-rail" aria-hidden="true">
            <span className="timeline-fill" />
          </span>
          <ol className="timeline-list">
          {phases.map((p, i) => (
            <li key={p.name} className="timeline-step" data-lit-at={(0.08 + i * 0.22).toFixed(2)}>
              <span className="timeline-dot" aria-hidden="true" />
              <span className="timeline-n" aria-hidden="true">
                {String(i + 1).padStart(2, "0")}
              </span>
              <h3>{p.name}</h3>
              <p>{p.body}</p>
            </li>
          ))}
          </ol>
        </div>
      </div>
    </section>
  );
}

export function Trust() {
  return (
    <section id="confiance" className="section trust" data-scene="4" aria-labelledby="trust-title">
      <div className="wrap">
        <p className="section-label">Confiance et données</p>
        <Kinetic id="trust-title" className="section-title" parts={["Voir clair, ", { tense: "même dans le noir." }]} />
        <div className="trust-grid">
          <article data-reveal>
            <h3>Vous gardez la main</h3>
            <p>
              Les points de validation sont définis avec vous. Ce qui engage votre entreprise passe par une décision
              humaine.
            </p>
          </article>
          <article data-reveal style={{ "--d": "100ms" } as CSSProperties}>
            <h3>Des accès limités</h3>
            <p>
              Nous recensons ensemble les données dont l&apos;agent a besoin, et seulement celles-là. Le traitement
              des données personnelles est cadré dès le diagnostic.
            </p>
          </article>
          <article data-reveal style={{ "--d": "200ms" } as CSSProperties}>
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
    <section id="synatrap" className="section synatrap" data-scene="5" aria-labelledby="synatrap-title">
      <div className="wrap synatrap-inner" data-reveal>
        <div>
          <p className="section-label">Plateforme complémentaire</p>
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
