"use client";

import { useEffect } from "react";
import { setPointer, setScene } from "@/lib/universe/bus";

const GLYPHS = "░▒▓/\\<>{}[]=+*01·";

/**
 * Moteur de mouvement d'Athéna v3, sans bibliothèque. Une seule boucle de
 * défilement cadencée sur l'affichage (rAF) qui :
 * - calcule la scène de l'univers WebGL à partir des sections `[data-scene]`
 *   (valeur continue : les formes se transforment pendant le défilement) ;
 * - écrit une progression `--p` sur les seuls éléments `[data-progress]` ;
 * - masque l'en-tête en descendant.
 * Les révélations passent par un IntersectionObserver, le pointeur par un
 * seul écouteur passif. Sans JavaScript ou en mouvement réduit, tout le
 * contenu reste visible et immobile.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const finePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    root.classList.add("motion-ready");

    // ── Décodage des petites étiquettes de données ──────────────────
    const decode = (el: HTMLElement) => {
      const text = el.dataset.text ?? el.textContent ?? "";
      el.dataset.text = text;
      if (reduced) return;
      const start = performance.now();
      const dur = 260 + text.length * 18;
      const step = (now: number) => {
        const k = Math.min(1, (now - start) / dur);
        let out = "";
        for (let i = 0; i < text.length; i++) {
          const ch = text[i];
          out += ch === " " || i / text.length < k ? ch : GLYPHS[(Math.random() * GLYPHS.length) | 0];
        }
        el.textContent = out;
        if (k < 1) requestAnimationFrame(step);
      };
      requestAnimationFrame(step);
    };

    // ── Révélations ───────────────────────────────────────────────
    let io: IntersectionObserver | null = null;
    const targets = document.querySelectorAll<HTMLElement>("[data-reveal]");
    // Éléments pas encore révélés : un saut de défilement (ancre, touche Fin)
    // peut les survoler sans que l'observateur ne les voie jamais à l'écran.
    const pending = new Set<Element>(targets);
    const reveal = (el: Element) => {
      pending.delete(el);
      el.classList.add("is-in");
      el.querySelectorAll<HTMLElement>("[data-decode]").forEach(decode);
      if ((el as HTMLElement).dataset.decode !== undefined) decode(el as HTMLElement);
    };
    if (reduced || !("IntersectionObserver" in window)) {
      targets.forEach((el) => el.classList.add("is-in"));
      pending.clear();
    } else {
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              reveal(e.target);
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.15 },
      );
      targets.forEach((el) => io!.observe(el));
    }

    // ── Défilement : une mise à jour par image au plus ────────────
    const scenes = Array.from(document.querySelectorAll<HTMLElement>("[data-scene]"));
    const hosts = Array.from(document.querySelectorAll<HTMLElement>("[data-progress]"));
    const bar = document.querySelector<HTMLElement>(".progress-fill");
    const header = document.querySelector<HTMLElement>(".header");
    let lastY = window.scrollY;
    let ticking = false;

    let lastSweep = 0;
    const update = () => {
      ticking = false;
      const vh = window.innerHeight;
      const now = performance.now();
      if (pending.size && now - lastSweep > 150) {
        lastSweep = now;
        pending.forEach((el) => {
          if (el.getBoundingClientRect().top < vh * 0.9) reveal(el);
        });
      }
      const y = window.scrollY;
      const center = vh * 0.5;

      // Scène de l'univers : on glisse d'une forme à la suivante quand la
      // frontière entre deux sections traverse le milieu de l'écran.
      if (scenes.length) {
        let i = 0;
        for (let k = 0; k < scenes.length; k++) {
          if (scenes[k].getBoundingClientRect().top <= center) i = k;
        }
        const A = scenes[i];
        const sA = Number(A.dataset.scene);
        const B = scenes[i + 1];
        let value = sA;
        if (B) {
          const sB = Number(B.dataset.scene);
          const boundary = A.getBoundingClientRect().bottom;
          const frac = Math.min(1, Math.max(0, (center - (boundary - vh * 0.35)) / (vh * 0.7)));
          value = sA + (sB - sA) * frac;
        }
        setScene(value);
      }

      // Progressions locales (manifeste, frise de la méthode).
      for (const el of hosts) {
        const r = el.getBoundingClientRect();
        if (r.bottom < -vh || r.top > vh * 2) continue;
        const p = Math.min(1, Math.max(0, (vh * 0.75 - r.top) / Math.max(1, r.height)));
        el.style.setProperty("--p", p.toFixed(4));
        el.querySelectorAll<HTMLElement>("[data-lit-at]").forEach((s) => {
          s.classList.toggle("is-lit", p >= Number(s.dataset.litAt));
        });
      }

      const max = root.scrollHeight - vh;
      if (bar) bar.style.transform = `scaleX(${(max > 0 ? Math.min(1, y / max) : 0).toFixed(4)})`;

      if (header) {
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

    // ── Pointeur : univers + lumière locale des éléments [data-spot] ──
    let spot: HTMLElement | null = null;
    const onPointer = (e: PointerEvent) => {
      setPointer((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1), true);
      const target = (e.target as HTMLElement | null)?.closest<HTMLElement>("[data-spot]") ?? null;
      if (target !== spot) {
        spot?.style.removeProperty("--spot");
        spot = target;
      }
      if (spot) {
        const r = spot.getBoundingClientRect();
        spot.style.setProperty("--mx", `${(e.clientX - r.left).toFixed(0)}px`);
        spot.style.setProperty("--my", `${(e.clientY - r.top).toFixed(0)}px`);
        spot.style.setProperty("--spot", "1");
      }
    };
    const onLeave = () => setPointer(0, 0, false);

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    header?.addEventListener("focusin", onFocusIn);
    if (finePointer && !reduced) {
      window.addEventListener("pointermove", onPointer, { passive: true });
      document.documentElement.addEventListener("pointerleave", onLeave);
    }

    return () => {
      io?.disconnect();
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      header?.removeEventListener("focusin", onFocusIn);
      window.removeEventListener("pointermove", onPointer);
      document.documentElement.removeEventListener("pointerleave", onLeave);
    };
  }, []);

  return (
    <div className="progress" aria-hidden="true">
      <div className="progress-fill" />
    </div>
  );
}
