/**
 * Canal minimal entre le moteur de défilement (Motion) et l'univers WebGL.
 * Aucune dépendance, aucun rendu React : de simples valeurs lues à chaque image.
 */
export const universe = {
  /** Scène visée (valeur continue : 2.4 = 40 % du chemin entre la scène 2 et la 3). */
  scene: 0,
  /** Pointeur en coordonnées normalisées (-1 → 1). */
  mx: 0,
  my: 0,
  pointer: false,
  /** Horodatage de la dernière interaction, pour ralentir au repos. */
  lastInput: 0,
};

export function setScene(value: number) {
  if (Math.abs(value - universe.scene) > 0.0005) {
    universe.scene = value;
    universe.lastInput = performance.now();
  }
}

export function setPointer(x: number, y: number, active: boolean) {
  universe.mx = x;
  universe.my = y;
  universe.pointer = active;
  universe.lastInput = performance.now();
}
