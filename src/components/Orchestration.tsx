"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { scenarios } from "@/content/scenarios";

type Phase = "idle" | "running" | "checkpoint" | "validated";

const STEP_MS = 700;

/* Géométrie du schéma (viewBox 0 0 1000 220) : quatre étapes puis le nœud. */
const NODES = [
  { x: 100, y: 130 },
  { x: 300, y: 70 },
  { x: 500, y: 140 },
  { x: 700, y: 70 },
  { x: 900, y: 120 },
];
const link = (a: (typeof NODES)[number], b: (typeof NODES)[number]) => {
  const mx = (a.x + b.x) / 2;
  return `M${a.x} ${a.y} C ${mx} ${a.y}, ${mx} ${b.y}, ${b.x} ${b.y}`;
};

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Démonstration ILLUSTRATIVE : comment un agent enchaîne des étapes puis
 * s'arrête sur un point de validation humaine. Aucune donnée réelle n'est
 * traitée. Le schéma SVG est décoratif ; la liste d'étapes est le contenu.
 */
export function Orchestration() {
  const ref = useRef<HTMLDivElement>(null);
  const [index, setIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const [step, setStep] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");
  const s = scenarios[index];

  useEffect(() => {
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      const t = window.setTimeout(() => setVisible(true), 0);
      return () => window.clearTimeout(t);
    }
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          io.disconnect();
        }
      },
      { threshold: 0.3 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => {
    if (!visible) return;
    const timers: number[] = [];
    const at = (ms: number, fn: () => void) => timers.push(window.setTimeout(fn, ms));
    if (prefersReducedMotion()) {
      at(0, () => {
        setStep(s.steps.length);
        setPhase("checkpoint");
      });
    } else {
      at(0, () => {
        setStep(0);
        setPhase("running");
      });
      s.steps.forEach((_, i) => at(120 + (i + 1) * STEP_MS, () => setStep(i + 1)));
      at(120 + (s.steps.length + 1) * STEP_MS - 200, () => setPhase("checkpoint"));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [visible, run, s.steps]);

  const choose = (i: number) => {
    setIndex(i);
    setStep(0);
    setPhase(prefersReducedMotion() ? "checkpoint" : "running");
    setRun((n) => n + 1);
  };

  const ready = phase === "checkpoint" || phase === "validated";

  return (
    <div className="orch" ref={ref} data-phase={phase}>
      <div className="orch-list" role="group" aria-label="Choisir un scénario illustratif">
        {scenarios.map((sc, i) => (
          <button
            key={sc.id}
            type="button"
            className="orch-choice"
            aria-pressed={i === index}
            onClick={() => choose(i)}
          >
            {sc.title}
          </button>
        ))}
      </div>

      <div className="orch-panel" data-spot>
        <p className="orch-tag">Scénario illustratif</p>
        <h3 className="orch-title">{s.title}</h3>
        <p className="orch-situation">{s.situation}</p>

        <div className="orch-stage" key={`${s.id}-${run}`}>
          <svg className="orch-diagram" viewBox="0 0 1000 220" aria-hidden="true" focusable="false">
            {NODES.slice(0, -1).map((n, i) => (
              <path key={`b${i}`} d={link(n, NODES[i + 1])} className="orch-wire" />
            ))}
            {NODES.slice(0, -1).map((n, i) => (
              <path
                key={`l${i}`}
                d={link(n, NODES[i + 1])}
                pathLength={1}
                className={`orch-wire-lit${step > i ? " is-on" : ""}`}
              />
            ))}
            {NODES.map((n, i) =>
              i < NODES.length - 1 ? (
                <g key={`n${i}`} className={`orch-node${step > i ? " is-done" : step === i && phase === "running" ? " is-active" : ""}`}>
                  <circle cx={n.x} cy={n.y} r={22} className="orch-halo" />
                  <circle cx={n.x} cy={n.y} r={7} className="orch-core" />
                </g>
              ) : (
                <g key="knot" className={`orch-knot${ready ? " is-ready" : ""}`} style={{ "--x": `${n.x}px`, "--y": `${n.y}px` } as CSSProperties}>
                  <circle cx={n.x} cy={n.y} r={30} className="orch-halo" />
                  <path
                    d={`M${n.x - 24} ${n.y} C ${n.x - 12} ${n.y}, ${n.x - 10} ${n.y - 12}, ${n.x} ${n.y - 12} C ${n.x + 10} ${n.y - 12}, ${n.x + 12} ${n.y}, ${n.x + 24} ${n.y}`}
                    className="orch-knot-a"
                  />
                  <path
                    d={`M${n.x - 24} ${n.y} C ${n.x - 12} ${n.y}, ${n.x - 10} ${n.y + 12}, ${n.x} ${n.y + 12} C ${n.x + 10} ${n.y + 12}, ${n.x + 12} ${n.y}, ${n.x + 24} ${n.y}`}
                    className="orch-knot-b"
                  />
                  <circle cx={n.x} cy={n.y} r={4} className="orch-core" />
                </g>
              ),
            )}
          </svg>

          <ol className="orch-steps">
            {s.steps.map((label, i) => (
              <li key={label} className={step > i ? "is-done" : step === i && phase === "running" ? "is-active" : ""}>
                <span className="orch-step-n" aria-hidden="true">
                  {String(i + 1).padStart(2, "0")}
                </span>
                {label}
              </li>
            ))}
            <li className={`orch-check${ready ? " is-ready" : ""}`}>
              <span className="orch-step-n" aria-hidden="true">
                ⟡
              </span>
              {s.checkpoint}
            </li>
          </ol>
        </div>

        <div className="orch-actions">
          <button
            type="button"
            className="knot-button"
            disabled={!ready}
            aria-disabled={phase === "validated" || undefined}
            onClick={() => {
              if (phase === "checkpoint") setPhase("validated");
            }}
          >
            {phase === "validated" ? "Validé par vous" : ready ? "Valider cette étape" : "L'agent travaille…"}
          </button>
          <p className="orch-note">Démonstration illustrative : aucune donnée réelle n&apos;est traitée.</p>
        </div>

        <p className="sr-only" aria-live="polite">
          {phase === "checkpoint" ? `Point de validation : ${s.checkpoint}` : phase === "validated" ? "Étape validée." : ""}
        </p>
      </div>
    </div>
  );
}
