import { Fragment, type CSSProperties, type ElementType } from "react";

export type WovenPart = string | { em: string } | { br: true };

/**
 * Titre « tissé » : chaque mot est passé de gauche à droite, à la façon
 * d'un fil tiré par la navette. Le texte complet est rendu côté serveur
 * (lisible par les moteurs et les lecteurs d'écran) ; seul l'affichage
 * est animé, en CSS.
 *
 * - par défaut, le titre se révèle quand il entre dans l'écran ;
 * - `intro` : joué dès le premier affichage, sans attendre JavaScript.
 */
export function Woven({
  as: Tag = "h2",
  parts,
  className,
  id,
  intro = false,
  delay = 0,
}: {
  as?: ElementType;
  parts: WovenPart[];
  className?: string;
  id?: string;
  intro?: boolean;
  /** Décalage de départ, en millisecondes. */
  delay?: number;
}) {
  let i = 0;
  const words = (text: string) =>
    text.split(/(\s+)/).map((w, wi) => {
      if (!w) return null;
      if (/^\s+$/.test(w)) return <Fragment key={wi}> </Fragment>;
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
      className={`woven${intro ? " woven--intro" : ""}${className ? ` ${className}` : ""}`}
      data-reveal={intro ? undefined : "woven"}
      style={{ "--d": `${delay}ms` } as CSSProperties}
    >
      {parts.map((part, pi) => {
        if (typeof part === "string") return <Fragment key={pi}>{words(part)}</Fragment>;
        if ("br" in part) return <br key={pi} />;
        return <em key={pi}>{words(part.em)}</em>;
      })}
    </Tag>
  );
}
