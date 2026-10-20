/**
 * Shaders de l'univers Athéna (GLSL ES 1.00, compatibles WebGL 1 et 2).
 *
 * Chaque particule ne porte que son rang `a_t` et quatre aléas `a_r`.
 * Sa position est CALCULÉE sur la carte graphique pour chacune des six
 * scènes, puis interpolée selon `uScene`. Le processeur ne transmet que
 * quelques uniformes par image : aucune boucle JavaScript par particule.
 *
 * Scènes : 0 visage d'Athéna · 1 chaîne · 2 tissu · 3 réseau · 4 hélice · 5 noyau
 *
 * Le visage fait exception : sa géométrie vient d'une carte de relief
 * (voir face.ts). Chaque particule reçoit une fois pour toutes sa place sur
 * la sculpture (`a_f`) et sa normale (`a_n`). Sans cette carte, la scène 0
 * retombe sur le nœud torique.
 */

export const VERT = /* glsl */ `
precision highp float;
attribute float a_t;
attribute vec4 a_r;
attribute vec4 a_f;      // visage : position sur la sculpture (xyz) + ombrage (w)
attribute vec4 a_n;      // visage : normale (xy) + intensité de contour (z)

uniform float uTime;
uniform float uScene;
uniform highp float uThread;   // 1.0 = filaments (lignes), 0.0 = particules
uniform float uThreads;  // nombre de filaments
uniform float uCount;    // nombre de particules
uniform float uAspect;
uniform float uPx;       // taille de base des points (pixels physiques)
uniform float uWide;     // 1.0 = écran large, 0.0 = mobile
uniform float uMotion;   // 0.0 en mouvement réduit
uniform vec2  uMouse;
uniform float uMouseOn;
uniform mat4  uProj;
uniform float uHasFace;  // 1.0 quand la carte du visage est chargée

varying mediump float vA;
varying mediump vec3  vC;

const float PI  = 3.14159265;
const float TAU = 6.28318531;

vec3 rotY(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x + s*p.z, p.y, -s*p.x + c*p.z); }
vec3 rotX(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(p.x, c*p.y - s*p.z, s*p.y + c*p.z); }
vec3 rotZ(vec3 p, float a) { float c = cos(a), s = sin(a); return vec3(c*p.x - s*p.y, s*p.x + c*p.y, p.z); }
float h1(float n) { return fract(sin(n * 91.3458) * 47453.5453); }

// ── 0 · Le nœud : nœud torique (2,3), volume de particules, filaments en hélice autour du tube
vec3 sKnot(float t, vec4 r) {
  float s = t * TAU;
  float rr = cos(3.0 * s) + 2.25;
  vec3 c = vec3(rr * cos(2.0 * s), rr * sin(2.0 * s), -sin(3.0 * s) * 1.15) * 0.25;
  if (uThread > 0.5) {
    float a = r.x * TAU + s * 9.0 + uTime * 0.35;
    return c + normalize(vec3(cos(a), sin(a), cos(a * 1.7 + 1.3))) * 0.06;
  }
  vec3 d = normalize(vec3(r.x - 0.5, r.y - 0.5, r.z - 0.5) + 0.0001);
  // Un tube dense et net, plus un halo clairsemé (8 % des particules).
  float rad = r.y > 0.92 ? 0.08 + 0.22 * r.w : 0.018 + 0.085 * r.w * r.w * r.w;
  return c + d * rad;
}

// ── 0 · Le visage d'Athéna : relief reconstruit à partir de l'image de référence.
// Points sur la sculpture ; quelques-uns se détachent du casque et des cheveux,
// dérivent puis reviennent. Les filaments sont des orbites lentes autour de la tête.
vec3 sFace(float t, vec4 r) {
  float sc = mix(0.78, 1.16, uWide);
  if (uThread > 0.5) {
    float id = floor(r.x * uThreads);
    float a = r.y * TAU + uTime * (0.05 + 0.012 * id) * (mod(id, 2.0) * 2.0 - 1.0);
    float R = 0.62 + 0.07 * id;
    vec3 o = vec3(cos(a) * R, sin(a * 2.0 + id) * 0.025, sin(a) * R * 0.55);
    o = rotZ(rotX(o, 0.22 + 0.16 * mod(id, 3.0)), (id - 3.5) * 0.075);
    // Étagées du cimier au cou.
    return (o + vec3(0.02, 0.48 - 0.09 * id, 0.0)) * sc;
  }
  vec3 p = a_f.xyz;
  // Échappées : ~10 % des points du casque et des cheveux, jamais ceux du visage.
  float inFace = step(0.0, p.x) * step(p.x, 0.55) * step(-0.46, p.y) * step(p.y, 0.16);
  float drifter = step(r.z, 0.10) * (1.0 - inFace) * uMotion;
  float k = fract(uTime * (0.03 + 0.03 * r.w) + r.x * 7.0);
  float out1 = sin(PI * k);
  out1 *= out1;
  vec3 dir = normalize(p - vec3(-0.05, 0.05, -0.3) + vec3(0.0, 0.25 + 0.35 * step(0.35, p.y), 0.0));
  p += drifter * out1 * (dir * (0.1 + 0.32 * r.y)
       + 0.05 * vec3(sin(uTime * 0.7 + r.x * 30.0), cos(uTime * 0.5 + r.y * 20.0), sin(uTime * 0.4 + r.w * 9.0)));
  return p * sc;
}

// ── 1 · La chaîne : fils verticaux, les données y circulent vers le bas
vec3 sWarp(float t, vec4 r) {
  float cols = mix(9.0, 22.0, uWide);
  float col = floor((uThread > 0.5 ? r.x : r.x) * cols);
  float x = (col / (cols - 1.0) - 0.5) * mix(1.9, 3.4, uWide);
  float z = (h1(col + 3.0) - 0.5) * 0.9;
  if (uThread > 0.5) return vec3(x, (r.y - 0.5) * 2.8, z);
  float y = fract(r.y - uTime * 0.045 * (0.4 + r.z)) * 2.8 - 1.4;
  return vec3(x + (r.w - 0.5) * 0.012, y, z);
}

// ── 2 · Le tissu : trame et chaîne croisées, ondulation lente, vu en perspective
vec3 sWeave(float t, vec4 r) {
  float n = 16.0, W = 2.2;
  vec3 p;
  bool weft = uThread > 0.5 ? true : r.z < 0.5;
  if (weft) {
    float row = floor((uThread > 0.5 ? r.x : r.x) * n);
    float y = (row / (n - 1.0) - 0.5) * W;
    float x = ((uThread > 0.5 ? r.y : r.y) - 0.5) * W;
    p = vec3(x, y, 0.045 * sin((x / W + 0.5) * n * PI + row * PI));
  } else {
    float col = floor(r.x * n);
    float x = (col / (n - 1.0) - 0.5) * W;
    float y = (r.y - 0.5) * W;
    p = vec3(x, y, -0.045 * sin((y / W + 0.5) * n * PI + col * PI));
  }
  p.z += 0.13 * sin(p.x * 2.1 + uTime * 0.5) * cos(p.y * 1.6 - uTime * 0.3);
  return rotX(p, -0.78);
}

// ── 3 · Le réseau : des pôles reliés, l'information circule sur les liens
vec3 hub(float i) {
  return vec3(sin(i * 1.7 + 0.4) * 0.95, cos(i * 2.3 + 0.2) * 0.62, sin(i * 3.1 + 1.0) * 0.55);
}
vec3 sNet(float t, vec4 r) {
  float hubs = 10.0;
  float e = floor(r.x * hubs);
  if (uThread > 0.5) {
    float a = floor(r.x * uThreads);
    return mix(hub(a), hub(mod(a * 3.0 + 1.0, hubs)), r.y);
  }
  vec3 A = hub(e);
  if (r.y < 0.5) {
    vec3 d = normalize(vec3(r.z - 0.5, r.w - 0.5, h1(t * 77.0) - 0.5) + 0.0001);
    return A + d * 0.11 * pow(h1(t * 13.0), 1.6);
  }
  vec3 B = hub(mod(e * 3.0 + 1.0, hubs));
  float k = fract(r.z + uTime * 0.07 * (0.4 + r.w));
  return mix(A, B, k) + (vec3(h1(t * 5.0), h1(t * 9.0), h1(t * 3.0)) - 0.5) * 0.02;
}

// ── 4 · L'hélice : deux brins qui montent, des barreaux qui les relient
vec3 sHelix(float t, vec4 r) {
  float strand = uThread > 0.5 ? floor(r.x * 2.0) : step(0.5, r.x);
  float u = uThread > 0.5 ? r.y : t;
  float a = u * TAU * 3.2 + strand * PI + uTime * 0.18;
  vec3 p = vec3(cos(a) * 0.42, (u - 0.5) * 2.1, sin(a) * 0.42);
  if (uThread < 0.5 && r.y < 0.22) {
    float q = floor(t * 40.0) / 40.0;
    float a2 = q * TAU * 3.2 + uTime * 0.18;
    vec3 p1 = vec3(cos(a2) * 0.42, (q - 0.5) * 2.1, sin(a2) * 0.42);
    vec3 p2 = vec3(cos(a2 + PI) * 0.42, (q - 0.5) * 2.1, sin(a2 + PI) * 0.42);
    return mix(p1, p2, r.z);
  }
  if (uThread < 0.5) p += (vec3(r.y, r.z, r.w) - 0.5) * 0.06;
  return p;
}

// ── 5 · Le noyau : une sphère qui respire, des orbites autour
vec3 sCore(float t, vec4 r) {
  if (uThread > 0.5 || r.y < 0.24) {
    float ring = floor((uThread > 0.5 ? r.x : r.z) * 3.0);
    float a = (uThread > 0.5 ? r.y : r.w) * TAU + uTime * (0.12 + ring * 0.05);
    vec3 p = vec3(cos(a), 0.0, sin(a)) * (0.92 + ring * 0.16);
    return rotX(rotY(p, ring * 1.1), 0.5 + ring * 0.7);
  }
  float y = 1.0 - 2.0 * t;
  float rad = sqrt(max(0.0, 1.0 - y * y));
  float phi = h1(t * 917.0 + 3.0) * TAU;
  float breath = 1.0 + 0.035 * sin(uTime * 1.3 + y * 5.0);
  return vec3(cos(phi) * rad, y, sin(phi) * rad) * 0.6 * breath;
}

vec3 shape(float id, float t, vec4 r) {
  if (id < 0.5) return uHasFace > 0.5 ? sFace(t, r) : sKnot(t, r);
  if (id < 1.5) return sWarp(t, r);
  if (id < 2.5) return sWeave(t, r);
  if (id < 3.5) return sNet(t, r);
  if (id < 4.5) return sHelix(t, r);
  return sCore(t, r);
}

// Position de chaque scène dans le cadre : à droite sur grand écran (le texte vit à gauche),
// en haut et en retrait sur mobile.
vec3 place(float id) {
  vec3 w, m;
  if (id < 0.5)      {
    // Visage : à droite du texte sur grand écran, en haut sur mobile.
    if (uHasFace > 0.5) { w = vec3(0.93, -0.2, 0.0); m = vec3(-0.04, 0.3, -0.6); }
    else { w = vec3(0.96, 0.05, 0.0); m = vec3(0.0, 0.52, -0.5); }
  }
  else if (id < 1.5) { w = vec3(0.0, 0.0, -0.4);   m = vec3(0.0, 0.0, -0.5); }
  else if (id < 2.5) { w = vec3(0.85, -0.15, -0.5); m = vec3(0.0, 0.35, -1.0); }
  else if (id < 3.5) { w = vec3(0.92, 0.42, -0.4); m = vec3(0.0, 0.45, -1.0); }
  else if (id < 4.5) { w = vec3(1.3, 0.0, -0.2);   m = vec3(0.6, 0.1, -1.0); }
  else               { w = vec3(1.0, 0.1, -0.3);   m = vec3(0.0, 0.4, -0.9); }
  return mix(m, w, uWide);
}

// Intensité par scène : plus discrète derrière les passages de lecture.
float dim(float id) {
  if (id < 0.5) return 1.0;
  if (id < 1.5) return 0.6;
  if (id < 2.5) return 0.72;
  if (id < 3.5) return 0.8;
  if (id < 4.5) return 0.6;
  return 0.65;
}

void main() {
  float a = floor(uScene);
  float b = min(a + 1.0, 5.0);
  float f = uScene - a;
  // Chaque particule part à son heure : dispersion puis rassemblement.
  float fi = clamp(f * 1.7 - a_r.w * 0.7, 0.0, 1.0);
  fi = fi * fi * (3.0 - 2.0 * fi);

  // Balancement lent plutôt qu'une rotation continue : le nœud reste lisible de face.
  float ry = sin(uTime * 0.11) * 0.42 * uMotion + uMouse.x * 0.45 * uMouseOn;
  float rx = -0.12 - uMouse.y * 0.25 * uMouseOn;

  // Le visage est un relief vu de face : on le décale à l'écran (décentrement
  // d'objectif) plutôt que dans l'espace, sinon la perspective le verrait de
  // biais et écraserait ses traits contre le bord.
  vec2 lens = (a < 0.5 && uHasFace > 0.5) ? place(a).xy : vec2(0.0);
  // Le visage, relief vu de trois quarts, ne pivote que très peu et toujours
  // du côté qui dévoile ses traits : sinon ils s'écrasent contre la silhouette.
  bool isFace = a < 0.5 && uHasFace > 0.5;
  float ryA = isFace ? (-0.06 + sin(uTime * 0.11) * 0.035) * uMotion + (uMouse.x * 0.05 - 0.02) * uMouseOn : ry;
  float rxA = isFace ? -0.03 - uMouse.y * 0.07 * uMouseOn : rx;
  vec3 pa = rotX(rotY(shape(a, a_t, a_r), ryA), rxA) + place(a) - vec3(lens, 0.0);
  vec3 pb = rotX(rotY(shape(b, a_t, a_r), ry), rx) + place(b);
  vec3 p = mix(pa, pb, fi);

  // Pendant le trajet, un léger tourbillon : les fils se défont avant de se reformer.
  float tr = sin(PI * fi);
  p += tr * (0.18 + 0.32 * a_r.w) * vec3(
    sin(a_r.x * TAU + uTime * 0.6),
    cos(a_r.y * TAU + uTime * 0.45),
    sin(a_r.z * TAU)
  );

  vec4 clip = uProj * vec4(p.x, p.y, p.z - 3.4, 1.0);
  clip.xy += (1.0 - fi) * lens * vec2(uProj[0][0], uProj[1][1]) / 3.4 * clip.w;

  // Le pointeur écarte les particules (en espace écran) et les éclaire.
  vec2 ndc = clip.xy / clip.w;
  vec2 dl = ndc - uMouse;
  dl.x *= uAspect;
  float d = length(dl);
  float near = uMouseOn * (1.0 - uThread) * smoothstep(0.32, 0.0, d);
  ndc += normalize(dl + 0.00001) * near * 0.07 * vec2(1.0 / uAspect, 1.0);
  clip.xy = ndc * clip.w;
  gl_Position = clip;

  // Poids du visage dans le mélange courant (1 sur le hero, 0 ailleurs).
  float fw = (a < 0.5 ? 1.0 - fi : 0.0) * uHasFace;

  float ember = mix(step(0.972, a_r.x), step(0.995 - 0.012 * a_n.z, a_r.x), fw) * (1.0 - uThread);
  float depth = 0.3 + 0.7 * smoothstep(-1.4, 0.9, p.z);
  float tw = 0.78 + 0.22 * sin(uTime * 2.1 + a_r.x * 41.0);
  float sceneDim = mix(dim(a), dim(b), fi);

  // Visage : l'ombrage de la statue fixe la luminosité de chaque point ; une
  // lumière qui suit le curseur module le relief ; un balayage lent parcourt
  // la sculpture de haut en bas.
  float lum = a_f.w;
  vec3 nrm = normalize(vec3(a_n.xy, 1.0));
  vec3 L = normalize(vec3(0.3 + uMouse.x * 0.9 * uMouseOn, 0.35 + uMouse.y * 0.7 * uMouseOn, 1.0));
  float diff = max(dot(nrm, L), 0.0);
  float yb = 1.25 - mod(uTime * 0.11, 3.8);
  float scan = exp(-pow((a_f.y - yb) * 6.0, 2.0)) * 0.55 * uMotion;
  float faceA = (0.1 + 2.1 * pow(lum, 1.7)) * (0.58 + 0.62 * diff) + scan * (0.3 + lum);
  // Filaments du visage : des traînées lumineuses qui glissent le long des orbites.
  float trail = 0.25 + 0.75 * smoothstep(0.55, 1.0, fract(a_r.y - uTime * 0.04 + a_r.x * 3.0));

  float basePx = 0.85 + 2.4 * pow(a_r.y, 5.0) + ember * 1.4 + near * 1.6;
  float facePx = 1.75 + 0.9 * pow(a_r.y, 6.0) + ember * 0.6 + near * 1.0;
  gl_PointSize = uPx * mix(basePx, facePx, fw) * (3.4 / clip.w);
  float baseA = uThread > 0.5 ? 0.15 : 0.95 + 0.6 * near + ember * 0.6;
  float fA = uThread > 0.5 ? 0.3 * trail : 0.42 * faceA + 0.3 * near + ember * 0.9;
  vA = depth * tw * sceneDim * mix(baseA, fA, fw);

  vec3 glauk = vec3(0.56, 0.94, 0.86);
  vec3 lin   = vec3(0.91, 0.89, 0.85);
  vec3 braise= vec3(1.0, 0.48, 0.27);
  vec3 baseC = mix(glauk, lin, a_r.z * a_r.z * 0.7);
  vec3 faceC = mix(glauk, lin, clamp(lum * 0.8 + scan * 0.4, 0.0, 1.0));
  vC = mix(mix(baseC, faceC, fw), braise, ember);
}
`;

export const FRAG = /* glsl */ `
precision mediump float;
uniform highp float uThread;
varying mediump float vA;
varying mediump vec3  vC;
void main() {
  float a = vA;
  if (uThread < 0.5) {
    // Point lumineux : un cœur net et une petite auréole gaussienne.
    vec2 c = gl_PointCoord - 0.5;
    float d = dot(c, c) * 4.0;
    a *= exp(-d * 3.2) * step(d, 1.0);
  }
  gl_FragColor = vec4(vC * a, a);
}
`;
