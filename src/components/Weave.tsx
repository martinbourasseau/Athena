import { weave } from "@/lib/weave";

type Props = {
  seed: string;
  rows?: number;
  cols?: number;
  className?: string;
  /** Nombre de rangées tissées en couleur de signature (le reste reste au repos). */
  accentRows?: number;
};

/** Motif tissé statique, généré depuis une graine (signature d'un agent). */
export function Weave({ seed, rows = 10, cols = 28, className, accentRows }: Props) {
  const grid = weave(seed, rows, cols);
  const cell = 10;
  const w = cols * cell;
  const h = rows * cell;
  return (
    <svg
      className={className}
      viewBox={`0 0 ${w} ${h}`}
      preserveAspectRatio="none"
      aria-hidden="true"
      focusable="false"
    >
      {Array.from({ length: cols }, (_, c) => (
        <line
          key={`w${c}`}
          x1={c * cell + cell / 2}
          x2={c * cell + cell / 2}
          y1={0}
          y2={h}
          className="weave-warp"
        />
      ))}
      {grid.map((row, r) =>
        row.map((over, c) =>
          over ? (
            <rect
              key={`${r}-${c}`}
              x={c * cell}
              y={r * cell + 2}
              width={cell}
              height={cell - 4}
              className={accentRows !== undefined && r >= accentRows ? "weave-weft weave-weft--rest" : "weave-weft"}
            />
          ) : null,
        ),
      )}
    </svg>
  );
}
