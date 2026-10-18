"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { loomTasks } from "@/content/scenarios";
import { weave } from "@/lib/weave";

type Phase = "weaving" | "checkpoint" | "validated";

const COLS = 30;
const ROWS_PER_STEP = 2;
const STEP_MS = 850;
const CELL = 12;

function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const update = () => setReduced(mq.matches);
    update();
    mq.addEventListener("change", update);
    return () => mq.removeEventListener("change", update);
  }, []);
  return reduced;
}

/**
 * Le métier du hero : démonstration ILLUSTRATIVE de la façon dont un
 * agent enchaîne des étapes puis s'arrête sur un point de validation.
 * Aucune donnée réelle n'est traitée.
 */
export function Loom() {
  const reduced = usePrefersReducedMotion();
  const [taskIndex, setTaskIndex] = useState(0);
  const [run, setRun] = useState(0);
  const [done, setDone] = useState(0);
  const [phase, setPhase] = useState<Phase>("weaving");
  const timers = useRef<number[]>([]);

  const task = loomTasks[taskIndex];
  const rows = task.steps.length * ROWS_PER_STEP;
  const grid = useMemo(() => weave(task.id + task.steps.join(), rows, COLS), [task, rows]);

  const clear = () => {
    timers.current.forEach((t) => window.clearTimeout(t));
    timers.current = [];
  };

  useEffect(() => {
    clear();
    if (reduced) {
      timers.current.push(
        window.setTimeout(() => {
          setDone(task.steps.length);
          setPhase("checkpoint");
        }, 0),
      );
      return clear;
    }
    timers.current.push(
      window.setTimeout(() => {
        setDone(0);
        setPhase("weaving");
      }, 0),
    );
    task.steps.forEach((_, i) => {
      timers.current.push(window.setTimeout(() => setDone(i + 1), STEP_MS * (i + 1)));
    });
    timers.current.push(
      window.setTimeout(() => setPhase("checkpoint"), STEP_MS * (task.steps.length + 1) - 300),
    );
    return clear;
  }, [task, run, reduced]);

  const choose = useCallback((i: number) => {
    setTaskIndex(i);
    setRun((r) => r + 1);
  }, []);

  const wovenRows = done * ROWS_PER_STEP;
  const activeRow = phase === "weaving" && done < task.steps.length ? wovenRows : -1;
  const w = COLS * CELL;
  const h = rows * CELL;

  return (
    <div className="loom" data-phase={phase}>
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
        <div className="loom-frame">
          <svg
            className="loom-svg"
            viewBox={`0 0 ${w} ${h}`}
            preserveAspectRatio="none"
            role="img"
            aria-label={`L'agent tisse la tâche « ${task.label} » étape par étape`}
          >
            {Array.from({ length: COLS }, (_, c) => (
              <line key={c} x1={c * CELL + CELL / 2} x2={c * CELL + CELL / 2} y1={0} y2={h} className="loom-warp" />
            ))}
            {grid.map((row, r) => (
              <g key={`${run}-${r}`} className={r < wovenRows ? "loom-row is-woven" : "loom-row"}>
                {row.map((over, c) =>
                  over ? (
                    <rect
                      key={c}
                      x={c * CELL}
                      y={r * CELL + 2.5}
                      width={CELL}
                      height={CELL - 5}
                      style={{ transitionDelay: `${(c / COLS) * 380}ms` }}
                    />
                  ) : null,
                )}
              </g>
            ))}
            {activeRow >= 0 ? (
              <rect
                key={`shuttle-${run}-${activeRow}`}
                className="loom-shuttle"
                x={-CELL * 3}
                y={activeRow * CELL + 1}
                width={CELL * 3}
                height={CELL * 2 - 2}
                rx={CELL}
              />
            ) : null}
          </svg>
        </div>

        <ol className="loom-log mono" aria-live="polite">
          {task.steps.map((s, i) => (
            <li key={`${run}-${s}`} className={i < done ? "is-done" : i === done && phase === "weaving" ? "is-active" : ""}>
              <span className="loom-log-index">{String(i + 1).padStart(2, "0")}</span>
              {s}
            </li>
          ))}
        </ol>
      </div>

      <div className={`loom-result ${phase !== "weaving" ? "is-visible" : ""}`}>
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
          {phase === "validated" ? (
            <p className="mono knot-status" role="status">
              Validé par vous
            </p>
          ) : (
            <button
              type="button"
              className="knot-button"
              disabled={phase !== "checkpoint"}
              onClick={() => setPhase("validated")}
            >
              <span className="mono">Nœud · </span>
              {task.checkpoint}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
