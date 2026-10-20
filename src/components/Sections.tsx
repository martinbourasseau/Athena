import type { CSSProperties } from "react";
import { Kinetic, Decode } from "./Kinetic";
import { Orchestration } from "./Orchestration";
import { realisations } from "@/content/realisations";
import { capabilities } from "@/content/capabilities";
import { site } from "@/content/site";

/* Chaque section porte `data-scene` : la forme que prend l'univers derrière elle.
   0 visage d'Athéna · 1 chaîne · 2 tissu · 3 réseau · 4 hélice · 5 noyau

   Le récit : ce que les agents rendent possible → les missions qu'ils
   accomplissent → comment nous les concevons → des scénarios pour se
   projeter → la méthode → deux voies pour continuer (sur mesure ou SYNATRAP). */

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
          parts={["Des agents\u00a0IA", { br: true }, { tense: "qui font avancer votre entreprise." }]}
        />
        <p className="hero-lead hero-in" style={{ "--d": "700ms" } as CSSProperties}>
          De la tâche répétitive au processus complet, nous concevons des agents qui recherchent, analysent,
          rédigent, organisent et agissent dans vos outils, selon vos objectifs et vos règles.
        </p>
        <div className="hero-actions hero-in" style={{ "--d": "820ms" } as CSSProperties}>
          <a href="#projet" className="button">
            Décrire mon projet
          </a>
          <a href="#capacites" className="button button--ghost">
            Ce qu&apos;un agent peut faire
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
    body: "Chaque agent est construit autour de vos outils, de vos documents et de votre façon de travailler.",
  },
  {
    word: "La navette",
    title: "Action",
    body: "Il ne se contente pas de répondre : il lit, classe, rédige, met à jour vos outils et rend compte de son travail.",
  },
  {
    word: "Le nœud",
    title: "Maîtrise",
    body: "Vous fixez son périmètre, ses accès et les étapes qui passent par votre validation.",
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

export function Capabilities() {
  return (
    <section id="capacites" className="section capabilities" data-scene="2" aria-labelledby="capacites-title">
      <div className="wrap">
        <div className="capabilities-head">
          <div>
            <p className="section-label">Ce qu&apos;un agent peut accomplir</p>
            <Kinetic
              id="capacites-title"
              className="section-title"
              parts={["Bien plus qu’un chatbot. ", { tense: "Un agent qui agit." }]}
            />
          </div>
          <p className="section-lead" data-reveal>
            Un agent IA ne se limite pas à répondre à des questions. Il recherche, analyse, produit et enchaîne des
            actions dans vos outils, pour prendre en charge une partie réelle de vos processus.
          </p>
        </div>
        <div className="capabilities-grid">
          {capabilities.map((c, i) => (
            <article
              key={c.id}
              className="capability"
              data-reveal
              style={{ "--d": `${(i % 3) * 90}ms` } as CSSProperties}
            >
              <h3>{c.name}</h3>
              <p className="capability-promise">{c.promise}</p>
              <ul>
                {c.missions.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <p className="capabilities-note" data-reveal>
          Ce sont des possibilités de conception. Ce qu&apos;un agent accomplit concrètement dépend de la façon dont
          nous le construisons, des outils que nous lui connectons, des données disponibles et des autorisations que
          vous lui accordez.
        </p>
      </div>
    </section>
  );
}

const services = [
  {
    name: "Concevoir",
    body: "Nous définissons avec vous les missions à confier, les informations dont l'agent a besoin, son périmètre et les moments où il vous sollicite.",
  },
  {
    name: "Développer",
    body: "Nous construisons l'agent, le relions à vos outils et le mettons à l'épreuve sur vos cas réels avant son usage quotidien.",
  },
  {
    name: "Personnaliser",
    body: "Nous accordons son ton, ses règles et ses missions à votre activité, puis nous le faisons grandir avec vos retours.",
  },
];

export function Services() {
  return (
    <section id="services" className="section services" data-scene="2" aria-labelledby="services-title">
      <div className="wrap services-grid">
        <div className="services-intro">
          <p className="section-label">Services</p>
          <Kinetic id="services-title" className="section-title" parts={["Conçu pour ", { tense: "votre entreprise." }]} />
          <p className="section-lead" data-reveal>
            Athéna conçoit des agents sur mesure : pour vos missions, dans vos outils, selon vos règles. Nous vous
            accompagnons de la première idée jusqu&apos;à l&apos;usage quotidien.
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
            <h3 className="can-label">Ce que vous lui confiez</h3>
            <ul>
              <li>Lire, trier et synthétiser l&apos;information</li>
              <li>Rédiger dans votre ton, sur chaque support</li>
              <li>Appliquer vos règles métier, à chaque fois</li>
              <li>Agir dans les outils que vous lui connectez</li>
            </ul>
          </div>
          <div>
            <h3 className="can-label can-label--keep">Ce que vous gardez en main</h3>
            <ul>
              <li>Les décisions qui engagent votre entreprise</li>
              <li>Les accès accordés, et seulement ceux-là</li>
              <li>Les étapes qui passent par votre validation</li>
              <li>L&apos;évolution de ses missions</li>
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
            Des scénarios pour vous projeter : ce sont des cas d&apos;usage possibles, pas des clients, des projets
            réalisés ou des résultats mesurés.
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
            Nos réalisations seront présentées ici, en détail, dès qu&apos;elles auront été documentées et validées
            avec les entreprises concernées.
          </p>
        )}
      </div>
    </section>
  );
}

const phases = [
  {
    name: "Diagnostic",
    body: "Nous partons de vos missions concrètes : ce qu'elles demandent, les outils et données en jeu, les étapes à valider.",
  },
  {
    name: "Prototype",
    body: "Une première version de l'agent travaille sur vos exemples réels, avec vous, jusqu'à faire exactement ce qui est attendu.",
  },
  {
    name: "Déploiement",
    body: "L'agent rejoint votre environnement de travail, avec les accès nécessaires et ses points de validation.",
  },
  {
    name: "Suivi",
    body: "Nous suivons son travail, affinons ses réglages et lui confions de nouvelles missions à mesure que vos besoins évoluent.",
  },
];

export function Method() {
  return (
    <section id="methode" className="section method" data-scene="4" aria-labelledby="method-title">
      <div className="wrap method-grid">
        <div className="method-intro">
          <p className="section-label">Méthode</p>
          <Kinetic id="method-title" className="section-title" parts={["De l’idée à l’usage, ", { tense: "un seul fil." }]} />
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
        <Kinetic id="trust-title" className="section-title" parts={["Puissant, ", { tense: "et sous votre contrôle." }]} />
        <div className="trust-grid">
          <article data-reveal>
            <h3>Vous gardez la main</h3>
            <p>
              Les points de validation sont définis avec vous : ce qui engage votre entreprise passe par une décision
              humaine.
            </p>
          </article>
          <article data-reveal style={{ "--d": "100ms" } as CSSProperties}>
            <h3>Des accès maîtrisés</h3>
            <p>
              L&apos;agent accède aux outils et aux données que vous lui ouvrez, et seulement à ceux-là. Le traitement
              des données personnelles est cadré dès le diagnostic.
            </p>
          </article>
          <article data-reveal style={{ "--d": "200ms" } as CSSProperties}>
            <h3>Un travail vérifiable</h3>
            <p>
              Chaque agent cite ses sources, signale ses incertitudes et rend compte de ce qu&apos;il a fait : vous
              savez toujours sur quoi il s&apos;appuie.
            </p>
          </article>
        </div>
      </div>
    </section>
  );
}

/* Secteurs présentés sur synatrap.com (relevés sur le site officiel). */
const synatrapSectors = [
  "Opérations et gestion",
  "Support client",
  "Données et Excel",
  "Développement",
  "E-commerce",
  "Marketing",
  "Recherche et veille",
  "Ventes",
];

/**
 * SYNATRAP : plateforme indépendante, avec sa propre identité. La section
 * change volontairement de registre graphique (trame, tuiles, accent froid)
 * pour ne pas laisser croire qu'il s'agit d'une page d'Athéna.
 * Contenu limité à ce que présente synatrap.com.
 */
export function Synatrap() {
  return (
    <section id="synatrap" className="section synatrap" data-scene="5" aria-labelledby="synatrap-title">
      <div className="wrap">
        <div className="syn-panel" data-reveal>
          <div className="syn-copy">
            <p className="syn-kicker">Plateforme indépendante</p>
            <p className="syn-mark" aria-hidden="true">
              {site.synatrap.name}
            </p>
            <h2 id="synatrap-title" className="syn-title">
              Les agents IA ont leur plateforme.
            </h2>
            <p className="syn-lead">
              {site.synatrap.name} est une plateforme entièrement consacrée aux agents IA. On y découvre des agents
              professionnels prêts à installer sur son ordinateur, et un atelier pour créer le sien.
            </p>
            <a className="syn-cta" href={site.synatrap.url} target="_blank" rel="noopener">
              Découvrir {site.synatrap.name} <span aria-hidden="true">↗</span>
              <span className="sr-only">(synatrap.com, nouvel onglet)</span>
            </a>
          </div>
          <div className="syn-atlas">
            <p className="syn-atlas-label">Des agents classés par secteur</p>
            <ul>
              {synatrapSectors.map((sector) => (
                <li key={sector}>{sector}</li>
              ))}
            </ul>
          </div>
        </div>

        <div className="syn-compare" data-reveal>
          <div className="syn-side syn-side--athena">
            <p className="syn-side-name">{site.name}</p>
            <h3>Un agent conçu pour vous</h3>
            <ul>
              <li>Un projet accompagné, de l&apos;idée à l&apos;intégration</li>
              <li>Un agent construit pour vos outils, vos données et vos règles</li>
              <li>Pour un besoin propre à votre entreprise</li>
            </ul>
          </div>
          <div className="syn-side syn-side--platform">
            <p className="syn-side-name">{site.synatrap.name}</p>
            <h3>Une plateforme à explorer</h3>
            <ul>
              <li>Des agents professionnels prêts à installer</li>
              <li>Un atelier pour créer votre propre agent</li>
              <li>Pour découvrir les agents IA à votre rythme</li>
            </ul>
          </div>
        </div>
        <p className="syn-note">
          {site.name} et {site.synatrap.name} sont deux projets distincts, chacun avec son propre site.
        </p>
      </div>
    </section>
  );
}
