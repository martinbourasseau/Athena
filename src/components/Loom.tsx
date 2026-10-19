"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type CSSProperties } from "react";
import { loomTasks } from "@/content/scenarios";
import { rowBackground, weave } from "@/lib/weave";

type Phase = "idle" | "weaving" | "checkpoint" | "validated";

const COLS = 30;
const ROWS_PER_STEP = 2;
/** Durée d'un passage de navette (un rang). */
const PASS_MS = 340;
/** Délai avant le premier passage, le temps que le navigateur pose l'état initial. */
const LEAD_MS = 60;

function prefersReducedMotion() {
  return typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

/**
 * Le métier du hero : démonstration ILLUSTRATIVE de la façon dont un agent
 * enchaîne des étapes puis s'arrête sur un point de validation.
 * Aucune donnée réelle n'est traitée.
 *
 * Mouvement : chaque rang est un passage de navette, en alternant le sens.
 * La navette et le fil révélé partagent la même durée et la même courbe :
 * le fil apparaît exactement sous le nez de la navette. Tout est animé en
 * CSS (transform et clip-path), React ne fait que poser des classes.
 */
export function Loom() {
  const rootRef = useRef<HTMLDivElement>(null);
  const [taskIndex, setTaskIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [visible, setVisible] = useState(false);
  const [started, setStarted] = useState(0);
  const [phase, setPhase] = useState<Phase>("idle");

  const task = loomTasks[taskIndex];
  const rows = task.steps.length * ROWS_PER_STEP;
  const pattern = useMemo(() => weave(task.id + task.steps.join(), rows), [task, rows]);

  // Ne tisser que lorsque le métier est visible (page ouverte plus bas, onglet en arrière-plan…).
  useEffect(() => {
    const el = rootRef.current;
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
      { threshold: 0.25 },
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
        setStarted(rows);
        setPhase("checkpoint");
      });
    } else {
      at(0, () => {
        setStarted(0);
        setPhase("weaving");
      });
      for (let r = 0; r < rows; r++) at(LEAD_MS + r * PASS_MS, () => setStarted(r + 1));
      at(LEAD_MS + rows * PASS_MS + 60, () => setPhase("checkpoint"));
    }
    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [visible, run, rows]);

  const choose = useCallback((i: number) => {
    // Remise à zéro dans le même rendu que le changement de tâche :
    // le nouveau métier monte vide, sans dérouler l'ancien tissu à l'envers.
    setTaskIndex(i);
    setStarted(0);
    setPhase(prefersReducedMotion() ? "checkpoint" : "weaving");
    setRun((n) => n + 1);
  }, []);

  const steps = task.steps.length;
  const weaving = phase === "weaving";
  const activeStep = weaving && started > 0 ? Math.floor((started - 1) / ROWS_PER_STEP) : -1;
  const doneSteps = phase === "checkpoint" || phase === "validated" ? steps : Math.max(0, activeStep);
  const resultReady = phase === "checkpoint" || phase === "validated";

  return (
    <div className="loom" data-phase={phase} ref={rootRef}>
      <div className="loom-head">
        <span className="mono loom-label">Démonstration illustrative</span>
        <div className="loom-chips" role="group" aria-label="Choisir une tâche à confier à l'agent">
          {loomTasks.map((t, i) => (
            <button
              key={t.id}
              type="button"
              className="chip"
              aria-pressed={i === taskIndex}
              onClick={() => choose(i)}
            >
              {t.label}
            </button>
          ))}
        </div>
      </div>

      <div className="loom-body">
        <div className="loom-frame" role="img" aria-label={`L'agent tisse la tâche « ${task.label} » étape par étape`}>
          {/* `key` : un nouveau métier à chaque tâche, sans détricoter l'ancien à l'écran. */}
          <div
            key={`${task.id}-${run}`}
            className="loom-rows"
            style={{ "--rows": rows, "--cols": COLS, "--pass": `${PASS_MS}ms` } as CSSProperties}
          >
            {pattern.rows.map((segments, r) => (
              <div
                key={r}
                className={[
                  "loom-row",
                  r % 2 ? "loom-row--back" : "",
                  r < started ? "is-woven" : "",
                  weaving && r === started - 1 ? "is-current" : "",
                ].join(" ")}
              >
                <span
                  className="loom-weft"
                  style={{ backgroundImage: rowBackground(pattern.period, segments, COLS) }}
                />
                <span className="loom-track">
                  <span className="loom-shuttle" />
                </span>
              </div>
            ))}
          </div>
        </div>

        <ol className="loom-log mono">
          {task.steps.map((s, i) => (
            <li key={`${run}-${s}`} className={i < doneSteps ? "is-done" : i === activeStep ? "is-active" : ""}>
              <span className="loom-log-index">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className={`loom-result${resultReady ? " is-visible" : ""}`}>
        <div>
          <p className="loom-result-title">{task.result.title}</p>
          <ul>
            {task.result.lines.map((l) => (
              <li key={l}>{l}</li>
            ))}
          </ul>
        </div>
        <div className="loom-knot">
          <svg viewBox="0 0 40 40" aria-hidden="true" className="knot-svg">
            <path d="M4 20 C 12 20, 14 12, 20 12 C 26 12, 28 20, 36 20" />
            <path d="M4 20 C 12 20, 14 28, 20 28 C 26 28, 28 20, 36 20" />
            <circle cx="20" cy="20" r="3.2" />
          </svg>
          {/* Le bouton reste en place une fois validé : le focus clavier n'est jamais perdu. */}
          <button
            type="button"
            className="knot-button"
            disabled={!resultReady}
            aria-disabled={phase === "validated" || undefined}
            onClick={() => {
              if (phase === "checkpoint") setPhase("validated");
            }}
          >
            <span className="mono">Nœud · </span>
            {phase === "validated" ? "Validé par vous" : task.checkpoint}
          </button>
        </div>
      </div>

      <p className="sr-only" aria-live="polite">
        {phase === "checkpoint"
          ? `Résultat prêt : ${task.result.title}. ${task.checkpoint}`
          : phase === "validated"
            ? "Étape validée."
            : ""}
      </p>
    </div>
  );
}
