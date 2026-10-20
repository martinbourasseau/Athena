/**
 * Données du visage d'Athéna pour l'univers WebGL.
 *
 * La sculpture est décrite par une petite carte (256 × 384, WebP, ~25 Ko,
 * servie en six fragments dans `public/relief/`) produite hors ligne à partir de l'image de référence
 * (`scripts/relief/relief.py`) :
 * - R : ombrage de la sculpture (clair = surface éclairée) ;
 * - G : profondeur reconstruite (relief 2,5D, 1 = au plus près) ;
 * - B : contours (yeux, nez, lèvres, ornements du casque) ;
 * - A : silhouette.
 *
 * Ici, on y tire une seule fois des milliers de points (échantillonnage
 * pondéré : plus dense sur les surfaces claires et les contours), puis on
 * les confie à la carte graphique. Aucun calcul par image côté processeur.
 */

export type FaceData = {
  /** x, y, z (repère de la scène, hauteur 2) et luminosité, par particule. */
  pos: Float32Array;
  /** normale (x, y), intensité de contour, réservé, par particule. */
  aux: Float32Array;
};

/** La carte WebP est servie en six fragments, réassemblés ici. */
const MAP_PARTS = 6;

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

async function readMap(): Promise<{ w: number; h: number; px: Uint8ClampedArray }> {
  const parts = await Promise.all(
    Array.from({ length: MAP_PARTS }, async (_, i) => {
      const res = await fetch(`/relief/${i}.bin`);
      if (!res.ok) throw new Error(`Carte du visage : ${res.status}`);
      return res.arrayBuffer();
    }),
  );
  const bmp = await createImageBitmap(new Blob(parts, { type: "image/webp" }), {
    premultiplyAlpha: "none",
    colorSpaceConversion: "none",
  });
  const canvas = document.createElement("canvas");
  canvas.width = bmp.width;
  canvas.height = bmp.height;
  const ctx = canvas.getContext("2d", { willReadFrequently: true });
  if (!ctx) throw new Error("Canvas 2D indisponible");
  ctx.drawImage(bmp, 0, 0);
  bmp.close();
  const { data } = ctx.getImageData(0, 0, canvas.width, canvas.height);
  return { w: canvas.width, h: canvas.height, px: data };
}

/** Tire `count` particules sur la sculpture. */
export async function loadFace(count: number): Promise<FaceData> {
  const { w, h, px } = await readMap();
  await new Promise<void>((r) => setTimeout(r, 0));
  const n = w * h;
  const shade = new Float32Array(n);
  const depth = new Float32Array(n);
  const edge = new Float32Array(n);
  const cdf = new Float32Array(n);
  let acc = 0;
  for (let i = 0; i < n; i++) {
    const o = i * 4;
    const m = px[o + 3] / 255;
    const s = (px[o] / 255) * (m > 0.02 ? 1 : 0);
    shade[i] = s;
    depth[i] = px[o + 1] / 255;
    edge[i] = px[o + 2] / 255;
    // Densité : surfaces éclairées et contours, un fond léger pour le volume,
    // renforcée sur le visage (yeux, nez, lèvres) et allégée sur les épaules.
    const u = (i % w) / w - 0.68;
    const v = ((i / w) | 0) / h - 0.55;
    const focus = 1 + 0.7 * Math.exp(-(u * u) / 0.018 - (v * v) / 0.03);
    const shoulders = Math.min(1, Math.max(0.25, (0.86 - (i / w) / h) / 0.12));
    acc += (0.06 + s * s + 0.3 * edge[i]) * m * focus * shoulders;
    cdf[i] = acc;
  }

  const at = (a: Float32Array, x: number, y: number) => {
    const fx = Math.min(w - 1.001, Math.max(0, x - 0.5));
    const fy = Math.min(h - 1.001, Math.max(0, y - 0.5));
    const x0 = fx | 0;
    const y0 = fy | 0;
    const tx = fx - x0;
    const ty = fy - y0;
    const i = y0 * w + x0;
    return (
      a[i] * (1 - tx) * (1 - ty) + a[i + 1] * tx * (1 - ty) + a[i + w] * (1 - tx) * ty + a[i + w + 1] * tx * ty
    );
  };

  const rand = rng(20261020);
  const pos = new Float32Array(count * 4);
  const aux = new Float32Array(count * 4);
  const scale = 2 / h; // hauteur de la sculpture : 2 unités
  const DEPTH = 0.76; // amplitude du relief (même unité)
  // Tirage par lots : on rend la main au navigateur entre deux lots pour ne
  // jamais bloquer le défilement ou la saisie pendant la préparation.
  const yieldNow = () => new Promise<void>((r) => setTimeout(r, 0));
  for (let k = 0; k < count; k++) {
    if (k > 0 && k % 5000 === 0) await yieldNow();
    // Recherche dichotomique dans la fonction de répartition.
    const target = rand() * acc;
    let lo = 0;
    let hi = n - 1;
    while (lo < hi) {
      const mid = (lo + hi) >> 1;
      if (cdf[mid] < target) lo = mid + 1;
      else hi = mid;
    }
    const x = (lo % w) + rand();
    const y = ((lo / w) | 0) + rand();
    const z = at(depth, x, y);
    const o = k * 4;
    pos[o] = (x - w / 2) * scale;
    pos[o + 1] = -(y - h / 2) * scale;
    pos[o + 2] = (z - 0.5) * DEPTH;
    pos[o + 3] = at(shade, x, y);
    // Normale approchée par différences centrées sur la profondeur.
    const dx = (at(depth, x + 1.5, y) - at(depth, x - 1.5, y)) * DEPTH / (3 * scale);
    const dy = (at(depth, x, y + 1.5) - at(depth, x, y - 1.5)) * DEPTH / (3 * scale);
    aux[o] = -dx;
    aux[o + 1] = dy;
    aux[o + 2] = at(edge, x, y);
    aux[o + 3] = 0;
  }
  return { pos, aux };
}
