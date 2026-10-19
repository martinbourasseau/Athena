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
    const count = !wide ? 9000 : modest ? 12000 : 26000;

    const boot = () =>
      import("@/lib/universe/engine").then(({ createUniverse }) => {
        if (cancelled) return;
        handle = createUniverse(canvas, { count, dprCap: wide ? 1.75 : 1.5, reducedMotion: reduced });
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
