/**
 * Génère une armure de tissage déterministe à partir d'une graine.
 * Chaque agent (ou scénario) obtient ainsi son propre motif :
 * deux suites d'étapes différentes donnent deux tissus différents.
 *
 * Retourne une grille rows × cols : `true` = la trame passe dessus,
 * `false` = le fil de chaîne est visible.
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

export function weave(seed: string, rows: number, cols: number): boolean[][] {
  const rand = rng(hash(seed));
  // Armure de base : sergé de période 3 à 5, décalage variable.
  const period = 3 + Math.floor(rand() * 3);
  const float = 1 + Math.floor(rand() * (period - 1));
  const shift = rand() > 0.5 ? 1 : period - 1;
  const grid: boolean[][] = [];
  for (let r = 0; r < rows; r++) {
    // Une ligne sur quelques-unes change de sens : la « signature ».
    const reversed = rand() > 0.82;
    const row: boolean[] = [];
    for (let c = 0; c < cols; c++) {
      const pos = (c + (reversed ? -r : r) * shift + period * 8) % period;
      row.push(pos < float);
    }
    grid.push(row);
  }
  return grid;
}
