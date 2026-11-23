// One reusable guide for every task (docs/PRODUCT_PLAN.md §6): what it is,
// why it matters, whether it applies to you, what to prepare, the steps,
// where to do it, sources with "Last checked", who decides, and what's next.

import { useState } from "react";
import { lastCheckedLabel, sources } from "../content/sources.ts";
import type { MilestoneId, Task } from "../content/tasks.ts";
import { appliesNote } from "../lib/applies.ts";
import type { Situation } from "../lib/situation.ts";
import { taskPlaces, type Place } from "./Dashboard.tsx";

export function TaskGuide({
  task,
  situation,
  next,
  onClose,
  onDone,
  onAsk,
  onOpenNext,
  onOpenPlace,
}: {
  task: Task;
  situation: Situation;
  /** The next task on the plan, if any. */
  next: Task | null;
  onClose: () => void;
  onDone: (id: string) => void;
  onAsk: (id: MilestoneId) => void;
  onOpenNext: (id: string) => void;
  onOpenPlace: (place: Place) => void;
}) {
  const place = taskPlaces[task.id];
  const [checked, setChecked] = useState<Set<string>>(new Set());
  const links = task.sources.map((id) => sources[id]);
  const official = links.some((s) => s.kind === "official");
  return (
    <div className="guide-backdrop" onClick={onClose}>
      <aside
        className="task-guide caf-guide"
        role="dialog"
        aria-modal="true"
        aria-labelledby="guide-title"
        onClick={(e) => e.stopPropagation()}
      >
        <header>
          <div>
            <p className="eyebrow">
              TaupeFR guide ·{" "}
              {task.group === "housing"
                ? "Housing"
                : `Stage ${task.group} of 5`}
            </p>
            <h2 id="guide-title">{task.title}</h2>
            <p>{task.summary}</p>
          </div>
          <button onClick={onClose} aria-label="Close guide">
            ×
          </button>
        </header>

        <section className="guide-why">
          <p className="eyebrow">Why it matters</p>
          <p>{task.why}</p>
        </section>

        <section className="guide-why applies">
          <p className="eyebrow">Does it apply to you?</p>
          <p>{appliesNote(task, situation)}</p>
        </section>

        {task.prepare && (
          <section className="before">
            <p className="eyebrow">What to prepare</p>
            {task.prepare.map((x) => (
              <label key={x}>
                <input
                  type="checkbox"
                  checked={checked.has(x)}
                  onChange={() =>
                    setChecked((c) => {
                      const n = new Set(c);
                      if (n.has(x)) n.delete(x);
                      else n.add(x);
                      return n;
                    })
                  }
                />{" "}
                <span>{x}</span>
              </label>
            ))}
            <small>
              What’s asked for can vary with your nationality and situation.
            </small>
          </section>
        )}

        {task.steps && (
          <section className="caf-steps guide-steps">
            <p className="eyebrow">Steps</p>
            {task.steps.map((s, i) => (
              <article key={s}>
                <div>
                  <b>{String(i + 1).padStart(2, "0")}</b>
                  <span>
                    <small>{s}</small>
                  </span>
                </div>
              </article>
            ))}
          </section>
        )}

        <section className="guide-where">
          <p className="eyebrow">Where to do it</p>
          {links.length ? (
            <ul className="guide-sources">
              {links.map((s) => (
                <li key={s.name}>
                  {s.url ? (
                    <a href={s.url} target="_blank" rel="noreferrer">
                      {s.name} ↗
                    </a>
                  ) : (
                    <b>{s.name}</b>
                  )}
                  <small>
                    {s.kind === "official" ? "Official source" : "Platform"} ·{" "}
                    {s.url ? lastCheckedLabel(s) : "Link to be added"}
                  </small>
                </li>
              ))}
            </ul>
          ) : (
            <h3>This is your own choice. Compare options yourself.</h3>
          )}
          {place && (
            <button onClick={() => onOpenPlace(place.place)}>
              {place.label}
            </button>
          )}
          <button
            onClick={() =>
              window.dispatchEvent(
                new CustomEvent("taupe-context", {
                  detail: { taskId: task.id },
                }),
              )
            }
          >
            Ask Taupe about this
          </button>
          <small>
            {official
              ? "The official organisation decides what applies to you. TaupeFR explains the process; it doesn’t make decisions."
              : "TaupeFR doesn’t recommend or partner with any provider. You choose and sign up directly."}
          </small>
        </section>

        <button
          className="mark-caf"
          onClick={() =>
            task.confirms ? onAsk(task.confirms) : onDone(task.id)
          }
        >
          {task.confirms ? "I’ve done this" : "Mark as done"}
        </button>

        {next && (
          <section className="guide-whats-next">
            <p className="eyebrow">What’s next</p>
            <button className="plain link" onClick={() => onOpenNext(next.id)}>
              {next.title} →
            </button>
          </section>
        )}
      </aside>
    </div>
  );
}
