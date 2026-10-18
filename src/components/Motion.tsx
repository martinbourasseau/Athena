"use client";

import { useEffect } from "react";

/**
 * Apparitions au scroll (« tirer le fil ») et bande de trame de progression.
 * Sans JavaScript ou avec mouvement réduit, tout reste visible.
 */
export function Motion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const onScroll = () => {
      const max = root.scrollHeight - window.innerHeight;
      const p = max > 0 ? Math.min(1, Math.max(0, window.scrollY / max)) : 0;
      root.style.setProperty("--progress", p.toFixed(4));
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);

    let io: IntersectionObserver | null = null;
    if (!reduced && "IntersectionObserver" in window) {
      root.classList.add("motion");
      io = new IntersectionObserver(
        (entries) => {
          for (const e of entries) {
            if (e.isIntersecting) {
              e.target.classList.add("is-in");
              io?.unobserve(e.target);
            }
          }
        },
        { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
      );
      document.querySelectorAll("[data-reveal]").forEach((el) => io!.observe(el));
    }

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      io?.disconnect();
    };
  }, []);

  return <div className="scroll-weave" aria-hidden="true" />;
}
