"use client";

import { useEffect, useRef, useState } from "react";

/**
 * L'univers Athéna : une toile WebGL fixe derrière tout le site.
 * Le moteur est chargé après le premier affichage (import dynamique) pour
 * ne pas retarder le texte. Sans WebGL, un fond lumineux statique prend le relais.
 */
export function Universe() {
  const ref = useRef<HTMLCanvasElement>(null);
  const [state, setState] = useState<"pending" | "on" | "off">("pending");

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let handle: { destroy: () => void } | null = null;
    let cancelled = false;

    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const wide = window.innerWidth >= 900;
    const nav = navigator as Navigator & { deviceMemory?: number };
    const modest = (nav.hardwareConcurrency ?? 8) < 4 || (nav.deviceMemory ?? 8) < 4;
    // Le visage demande un peu plus de points que les formes abstraites pour
    // rester lisible ; le coût reste faible (un seul appel de dessin).
    const count = !wide ? 16000 : modest ? 20000 : 42000;

    const boot = () =>
      Promise.all([
        import("@/lib/universe/engine"),
        // Sans la carte du visage, la scène 0 retombe sur le nœud abstrait.
        import("@/lib/universe/face").then(({ loadFace }) => loadFace(count)).catch((err) => {
          console.warn("Visage d'Athéna indisponible, forme abstraite utilisée.", err);
          return null;
        }),
      ]).then(([{ createUniverse }, face]) => {
        if (cancelled) return;
        handle = createUniverse(canvas, { count, dprCap: wide ? 1.75 : 1.5, reducedMotion: reduced, face });
        setState(handle ? "on" : "off");
      });

    const w = window as Window & { requestIdleCallback?: (cb: () => void, o?: { timeout: number }) => number };
    if (w.requestIdleCallback) w.requestIdleCallback(boot, { timeout: 600 });
    else window.setTimeout(boot, 120);

    return () => {
      cancelled = true;
      handle?.destroy();
    };
  }, []);

  return (
    <div className="universe" data-state={state} aria-hidden="true">
      <div className="universe-glow" />
      <canvas ref={ref} className="universe-canvas" />
      <div className="universe-vignette" />
    </div>
  );
}
