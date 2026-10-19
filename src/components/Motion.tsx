"use client";

import { useEffect } from "react";

/**
 * Moteur de mouvement d'Athéna, sans bibliothèque :
 * - un IntersectionObserver pose `is-in` sur les éléments `[data-reveal]` ;
 * - une seule boucle de défilement, cadencée sur l'affichage (rAF), met à
 *   jour la bande de trame et l'en-tête — uniquement via `transform` et des
 *   attributs locaux, jamais via une variable posée sur la racine (ce qui
 *   recalculait le style de toute la page à chaque événement).
 * Sans JavaScript, ou en mouvement réduit, tout le contenu reste visible.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    root.classList.add("motion-ready");

    // ── Révélations ───────────────────────────────────────────────
    let io: IntersectionObserver | null = null;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -8% 0px", threshold: 0.12 },
      );
      targets.forEach((el) => io!.observe(el));
    }

    // ── Défilement : une mise à jour par image au plus ────────────
    const bar = document.querySelector<HTMLElement>(".scroll-weave-fill");
    const header = document.querySelector<HTMLElement>(".header");
    let lastY = window.scrollY;
    let lastP = -1;
    let ticking = false;

    const update = () => {
      ticking = false;
      const y = window.scrollY;
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
      if (bar && Math.abs(p - lastP) > 0.001) {
        bar.style.transform = `scaleY(${p.toFixed(4)})`;
        lastP = p;
      }
      if (header) {
        // L'en-tête s'efface quand on descend, revient dès qu'on remonte.
        // Il reste visible tant qu'un élément à l'intérieur a le focus.
        const down = y > lastY + 6;
        const up = y < lastY - 6;
        let hidden = header.dataset.hidden === "true";
        if (y < 140 || up || header.contains(document.activeElement)) hidden = false;
        else if (down) hidden = true;
        if (header.dataset.hidden !== String(hidden)) header.dataset.hidden = String(hidden);
        if (down || up) lastY = y;
      }
    };
    const onScroll = () => {
      if (!ticking) {
        ticking = true;
        requestAnimationFrame(update);
      }
    };
    const onFocusIn = () => {
      if (header) header.dataset.hidden = "false";
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    header?.addEventListener("focusin", onFocusIn);

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      header?.removeEventListener("focusin", onFocusIn);
    };
  }, []);

  return (
    <div className="scroll-weave" aria-hidden="true">
      <div className="scroll-weave-fill" />
    </div>
  );
}
