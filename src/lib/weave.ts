/**
 * Armure de tissage déterministe, générée à partir d'une graine :
 * deux suites d'étapes différentes donnent deux tissus différents.
 *
 * Chaque rang d'un sergé est périodique : il se décrit entièrement par une
 * période (en colonnes) et les flottés qu'il contient dans cette période.
 * Un rang peut donc être dessiné par UN seul élément et un dégradé répété,
 * au lieu d'un rectangle SVG par case (plus de 1 000 nœuds auparavant).
 */

function hash(input: string): number {
  let h = 2166136261;
  for (let i = 0; i < input.length; i++) {
    h ^= input.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

function rng(seed: number) {
  let s = seed || 1;
  return () => {
    s ^= s << 13;
    s ^= s >>> 17;
    s ^= s << 5;
    return ((s >>> 0) % 10000) / 10000;
  };
}

const mod = (n: number, m: number) => ((n % m) + m) % m;

export type Weave = {
  /** Période de l'armure, en colonnes. */
  period: number;
  /** Pour chaque rang : segments flottés [début, fin[ dans la période. */
  rows: [number, number][][];
};

export function weave(seed: string, rowCount: number): Weave {
  const rand = rng(hash(seed));
  const period = 3 + Math.floor(rand() * 4); // 3 à 6
  // Flotté d'environ la moitié de la période : un tissu lisible, pas des points.
  const float = Math.max(1, Math.min(period - 1, Math.round(period / 2 + (rand() - 0.5))));
  const shift = rand() > 0.5 ? 1 : period - 1;
  const rows: [number, number][][] = [];
  let start = Math.floor(rand() * period);
  for (let r = 0; r < rowCount; r++) {
    // De temps en temps, le sergé change de sens : la « signature » du motif.
    if (r > 0) start = mod(start + (rand() > 0.84 ? -shift : shift), period);
    const end = start + float;
    rows.push(end <= period ? [[start, end]] : [[start, period], [0, end - period]]);
  }
  return { period, rows };
}

/**
 * Dégradé répété représentant un rang, aligné sur `cols` fils de chaîne.
 * Les positions sont en pourcentage de la largeur : le motif suit la
 * taille du conteneur sans calcul en JavaScript.
 */
export function rowBackground(period: number, segments: [number, number][], cols: number, color = "var(--weft)") {
  const cell = 100 / cols;
  const pct = (n: number) => `${+(n * cell).toFixed(4)}%`;
  const stops: string[] = [];
  let cursor = 0;
  for (const [a, b] of [...segments].sort((x, y) => x[0] - y[0])) {
    if (a > cursor) stops.push(`transparent ${pct(cursor)} ${pct(a)}`);
    stops.push(`${color} ${pct(a)} ${pct(b)}`);
    cursor = b;
  }
  if (cursor < period) stops.push(`transparent ${pct(cursor)} ${pct(period)}`);
  return `repeating-linear-gradient(90deg, ${stops.join(", ")})`;
}
