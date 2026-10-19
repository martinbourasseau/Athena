import { FRAG, VERT } from "./shaders";
import { universe } from "./bus";

/**
 * Moteur WebGL de l'univers Athéna — écrit à la main, sans bibliothèque.
 *
 * Coût par image côté processeur : une dizaine d'uniformes et deux appels
 * de dessin. Tout le reste (formes, transitions, pointeur) est calculé par
 * la carte graphique.
 *
 * Cycle de vie :
 * - pause complète quand l'onglet est caché ;
 * - une image sur deux au repos (ni défilement ni pointeur depuis 2,5 s) ;
 * - qualité adaptative : si les images dépassent ~26 ms en moyenne, on réduit
 *   le nombre de particules et la densité de pixels ;
 * - gestion de la perte de contexte WebGL ;
 * - mouvement réduit : temps figé, rendu uniquement quand la scène change.
 */

export type UniverseOptions = {
  count: number;
  dprCap: number;
  reducedMotion: boolean;
};

export type UniverseHandle = {
  destroy: () => void;
};

const THREADS = 8;
const THREAD_SEGMENTS = 280;

function perspective(fovy: number, aspect: number, near: number, far: number) {
  const f = 1 / Math.tan(fovy / 2);
  const nf = 1 / (near - far);
  // prettier-ignore
  return new Float32Array([
    f / aspect, 0, 0, 0,
    0, f, 0, 0,
    0, 0, (far + near) * nf, -1,
    0, 0, 2 * far * near * nf, 0,
  ]);
}

function compile(gl: WebGLRenderingContext, type: number, src: string) {
  const sh = gl.createShader(type)!;
  gl.shaderSource(sh, src);
  gl.compileShader(sh);
  if (!gl.getShaderParameter(sh, gl.COMPILE_STATUS)) {
    const log = gl.getShaderInfoLog(sh);
    gl.deleteShader(sh);
    throw new Error(`Shader : ${log}`);
  }
  return sh;
}

/** Pseudo-aléatoire déterministe : le même univers à chaque visite. */
function mulberry(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function createUniverse(canvas: HTMLCanvasElement, opts: UniverseOptions): UniverseHandle | null {
  const attrs: WebGLContextAttributes = {
    alpha: true,
    antialias: false,
    depth: false,
    stencil: false,
    premultipliedAlpha: true,
    powerPreference: "high-performance",
  };
  const gl = (canvas.getContext("webgl2", attrs) || canvas.getContext("webgl", attrs)) as WebGLRenderingContext | null;
  if (!gl) {
    console.warn("WebGL indisponible, fond de repli utilisé.");
    return null;
  }

  let program: WebGLProgram;
  let pointBuf: WebGLBuffer, threadBuf: WebGLBuffer, threadIdx: WebGLBuffer;
  let threadIndexCount = 0;
  const U: Record<string, WebGLUniformLocation | null> = {};
  let loc = { t: 0, r: 1 };

  let count = opts.count;
  let drawCount = count;
  let dpr = Math.min(window.devicePixelRatio || 1, opts.dprCap);
  let width = 0;
  let height = 0;

  function init() {
    const vs = compile(gl!, gl!.VERTEX_SHADER, VERT);
    const fs = compile(gl!, gl!.FRAGMENT_SHADER, FRAG);
    program = gl!.createProgram()!;
    gl!.attachShader(program, vs);
    gl!.attachShader(program, fs);
    gl!.bindAttribLocation(program, 0, "a_t");
    gl!.bindAttribLocation(program, 1, "a_r");
    gl!.linkProgram(program);
    if (!gl!.getProgramParameter(program, gl!.LINK_STATUS)) throw new Error(gl!.getProgramInfoLog(program) || "link");
    gl!.useProgram(program);
    loc = { t: 0, r: 1 };
    for (const n of [
      "uTime", "uScene", "uThread", "uThreads", "uCount", "uAspect", "uPx",
      "uWide", "uMotion", "uMouse", "uMouseOn", "uProj",
    ]) U[n] = gl!.getUniformLocation(program, n);

    // Particules : rang + 4 aléas, entrelacés (5 flottants).
    const rnd = mulberry(20261019);
    const pts = new Float32Array(count * 5);
    for (let i = 0; i < count; i++) {
      const o = i * 5;
      // Suite de Weyl (nombre d'or) : tout préfixe couvre uniformément la
      // forme, ce qui permet de réduire le nombre de particules sans l'amputer.
      pts[o] = (i * 0.6180339887498949) % 1;
      pts[o + 1] = rnd();
      pts[o + 2] = rnd();
      pts[o + 3] = rnd();
      pts[o + 4] = rnd();
    }
    pointBuf = gl!.createBuffer()!;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, pointBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, pts, gl!.STATIC_DRAW);

    // Filaments : THREADS courbes continues, dessinées en segments.
    const per = THREAD_SEGMENTS + 1;
    const th = new Float32Array(THREADS * per * 5);
    const idx = new Uint16Array(THREADS * THREAD_SEGMENTS * 2);
    let k = 0;
    for (let f = 0; f < THREADS; f++) {
      const hash = rnd();
      for (let s = 0; s < per; s++) {
        const o = (f * per + s) * 5;
        const u = s / THREAD_SEGMENTS;
        th[o] = u;
        th[o + 1] = (f + 0.5) / THREADS;
        th[o + 2] = u;
        th[o + 3] = 0.5;
        th[o + 4] = hash * 0.6;
        if (s < THREAD_SEGMENTS) {
          idx[k++] = f * per + s;
          idx[k++] = f * per + s + 1;
        }
      }
    }
    threadIndexCount = k;
    threadBuf = gl!.createBuffer()!;
    gl!.bindBuffer(gl!.ARRAY_BUFFER, threadBuf);
    gl!.bufferData(gl!.ARRAY_BUFFER, th, gl!.STATIC_DRAW);
    threadIdx = gl!.createBuffer()!;
    gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, threadIdx);
    gl!.bufferData(gl!.ELEMENT_ARRAY_BUFFER, idx, gl!.STATIC_DRAW);

    gl!.disable(gl!.DEPTH_TEST);
    gl!.enable(gl!.BLEND);
    gl!.blendFunc(gl!.ONE, gl!.ONE); // lumière additive
    gl!.clearColor(0, 0, 0, 0);
    gl!.uniform1f(U.uThreads, THREADS);
    gl!.uniform1f(U.uCount, count);
    gl!.uniform1f(U.uMotion, opts.reducedMotion ? 0 : 1);
  }

  function bindAttribs(buf: WebGLBuffer) {
    gl!.bindBuffer(gl!.ARRAY_BUFFER, buf);
    gl!.enableVertexAttribArray(loc.t);
    gl!.vertexAttribPointer(loc.t, 1, gl!.FLOAT, false, 20, 0);
    gl!.enableVertexAttribArray(loc.r);
    gl!.vertexAttribPointer(loc.r, 4, gl!.FLOAT, false, 20, 4);
  }

  function resize() {
    const w = Math.max(1, Math.round(canvas.clientWidth * dpr));
    const h = Math.max(1, Math.round(canvas.clientHeight * dpr));
    if (w === width && h === height) return;
    width = w;
    height = h;
    canvas.width = w;
    canvas.height = h;
    gl!.viewport(0, 0, w, h);
    const aspect = w / h;
    gl!.uniformMatrix4fv(U.uProj, false, perspective((36 * Math.PI) / 180, aspect, 0.1, 20));
    gl!.uniform1f(U.uAspect, aspect);
    gl!.uniform1f(U.uWide, canvas.clientWidth >= 900 ? 1 : 0);
    gl!.uniform1f(U.uPx, (canvas.clientWidth >= 900 ? 3.4 : 3.0) * dpr);
    dirty = true;
  }

  // ── État animé ────────────────────────────────────────────────
  let scene = universe.scene;
  let mx = 0;
  let my = 0;
  let mouseOn = 0;
  let time = 7.0; // départ décalé : le nœud est déjà formé et vivant
  let last = performance.now();
  let raf = 0;
  let running = false;
  let dirty = true;
  let frame = 0;
  let acc = 0;
  let accN = 0;

  function draw() {
    gl!.clear(gl!.COLOR_BUFFER_BIT);
    gl!.uniform1f(U.uTime, time);
    gl!.uniform1f(U.uScene, scene);
    gl!.uniform2f(U.uMouse, mx, my);
    gl!.uniform1f(U.uMouseOn, mouseOn);

    gl!.uniform1f(U.uThread, 1);
    bindAttribs(threadBuf);
    gl!.bindBuffer(gl!.ELEMENT_ARRAY_BUFFER, threadIdx);
    gl!.drawElements(gl!.LINES, threadIndexCount, gl!.UNSIGNED_SHORT, 0);

    gl!.uniform1f(U.uThread, 0);
    bindAttribs(pointBuf);
    gl!.drawArrays(gl!.POINTS, 0, drawCount);
  }

  function tick(now: number) {
    raf = requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    frame++;

    const idle = now - universe.lastInput > 2500 && Math.abs(universe.scene - scene) < 0.002;
    if (opts.reducedMotion) {
      // Mouvement réduit : pas d'horloge, pas de transition animée.
      if (Math.abs(universe.scene - scene) > 0.0001) {
        scene = universe.scene;
        dirty = true;
      }
      if (!dirty) return;
      dirty = false;
      draw();
      return;
    }
    if (idle && frame % 2) return; // au repos : 30 images/s suffisent

    // Inerties : la scène suit le défilement avec un temps de réponse
    // « cinématographique », le pointeur un peu plus vite.
    const ks = 1 - Math.exp(-dt * 2.4);
    const kp = 1 - Math.exp(-dt * 5);
    scene += (universe.scene - scene) * ks;
    mx += ((universe.pointer ? universe.mx : 0) - mx) * kp;
    my += ((universe.pointer ? universe.my : 0) - my) * kp;
    mouseOn += ((universe.pointer ? 1 : 0) - mouseOn) * kp;
    time += dt * (idle ? 2 : 1);

    draw();

    // Qualité adaptative sur ~90 images.
    acc += dt;
    accN++;
    if (accN >= 90) {
      const avg = (acc / accN) * 1000;
      acc = 0;
      accN = 0;
      if (avg > 26 && drawCount > count * 0.35) {
        drawCount = Math.floor(drawCount * 0.7);
        if (dpr > 1) {
          dpr = Math.max(1, dpr * 0.8);
          resize();
        }
      }
    }
  }

  function start() {
    if (running) return;
    running = true;
    last = performance.now();
    raf = requestAnimationFrame(tick);
  }
  function stop() {
    running = false;
    cancelAnimationFrame(raf);
  }

  const onVisibility = () => (document.hidden ? stop() : start());
  const onResize = () => resize();
  const onLost = (e: Event) => {
    e.preventDefault();
    stop();
  };
  const onRestored = () => {
    init();
    width = 0;
    resize();
    start();
  };

  try {
    init();
  } catch (err) {
    console.warn("Univers WebGL indisponible, fond de repli utilisé.", err);
    return null;
  }
  resize();
  draw();
  start();

  window.addEventListener("resize", onResize, { passive: true });
  document.addEventListener("visibilitychange", onVisibility);
  canvas.addEventListener("webglcontextlost", onLost);
  canvas.addEventListener("webglcontextrestored", onRestored);

  return {
    destroy() {
      stop();
      window.removeEventListener("resize", onResize);
      document.removeEventListener("visibilitychange", onVisibility);
      canvas.removeEventListener("webglcontextlost", onLost);
      canvas.removeEventListener("webglcontextrestored", onRestored);
    },
  };
}
