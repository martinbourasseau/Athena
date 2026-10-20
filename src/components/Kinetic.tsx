import { Fragment, type CSSProperties, type ElementType } from "react";

/** Un segment de titre : texte « détendu » (large, léger) ou `tense` (condensé, dense). */
export type KineticPart = string | { tense: string } | { br: true };

/**
 * Titre cinétique. Chaque mot pivote depuis sa ligne de base, comme un
 * panneau qui se lève, en décalé. Le texte complet est rendu côté serveur ;
 * seul l'affichage est animé, en CSS (transform et opacité).
 *
 * Système typographique : la première idée s'écrit large et légère, la
 * seconde condensée et dense — le fil se tend. Ce contraste vaut pour tous
 * les titres du site.
 *
 * - par défaut : révélé à l'entrée dans l'écran ;
 * - `intro` : joué dès le premier affichage, sans attendre JavaScript.
 */
export function Kinetic({
  as: Tag = "h2",
  parts,
  className,
  id,
  intro = false,
}: {
  as?: ElementType;
  parts: KineticPart[];
  className?: string;
  id?: string;
  intro?: boolean;
}) {
  let i = 0;
  const words = (text: string) =>
    // Seules les espaces ordinaires séparent les mots : une espace insécable
    // garde deux mots ensemble (« agents IA »).
    text.split(/([ \n\t]+)/).map((w, wi) => {
      if (!w) return null;
      if (/^[ \n\t]+$/.test(w)) return <Fragment key={wi}> </Fragment>;
      const idx = i++;
      return (
        <span key={wi} className="w">
          <span style={{ "--i": idx } as CSSProperties}>{w}</span>
        </span>
      );
    });

  return (
    <Tag
      id={id}
      className={`kinetic${intro ? " kinetic--intro" : ""}${className ? ` ${className}` : ""}`}
      data-reveal={intro ? undefined : "kinetic"}
    >
      {parts.map((part, pi) => {
        if (typeof part === "string") return <Fragment key={pi}>{words(part)}</Fragment>;
        if ("br" in part) return <br key={pi} />;
        return (
          <span key={pi} className="tense">
            {words(part.tense)}
          </span>
        );
      })}
    </Tag>
  );
}

/**
 * Petite étiquette de données « décodée » à l'apparition. Les lecteurs
 * d'écran lisent le texte réel ; la version animée leur est masquée.
 */
export function Decode({ text, className }: { text: string; className?: string }) {
  return (
    <span className={`decode${className ? ` ${className}` : ""}`}>
      <span className="sr-only">{text}</span>
      <span aria-hidden="true" data-decode>
        {text}
      </span>
    </span>
  );
}
