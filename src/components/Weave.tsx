import type { CSSProperties } from "react";
import { rowBackground, weave } from "@/lib/weave";

type Props = {
  seed: string;
  rows?: number;
  cols?: number;
  className?: string;
  /** Rangs déjà tissés en couleur de signature ; les suivants restent « au repos ». */
  accentRows?: number;
};

/**
 * Motif tissé, généré depuis une graine (signature d'un agent).
 * Un élément par rang ; la chaîne est un simple fond répété.
 * Quand un ancêtre `[data-reveal]` entre dans l'écran, chaque rang est
 * « passé » à son tour, en alternant le sens comme une vraie navette.
 */
export function Weave({ seed, rows = 8, cols = 28, className, accentRows }: Props) {
  const { period, rows: pattern } = weave(seed, rows);
  return (
    <div
      className={`weave${className ? ` ${className}` : ""}`}
      style={{ "--cols": cols } as CSSProperties}
      aria-hidden="true"
    >
      {pattern.map((segments, r) => {
        const rest = accentRows !== undefined && r >= accentRows;
        return (
          <span
            key={r}
            className={`weave-row${r % 2 ? " weave-row--back" : ""}${rest ? " weave-row--rest" : ""}`}
            style={{ "--r": r, backgroundImage: rowBackground(period, segments, cols) } as CSSProperties}
          />
        );
      })}
    </div>
  );
}
