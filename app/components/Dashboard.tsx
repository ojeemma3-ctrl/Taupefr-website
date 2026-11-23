// The student's main workspace (docs/PRODUCT_PLAN.md §6). One screen whose
// content comes from the stage engine: stage, housing block, priorities,
// progress, milestone questions, official links and a compact Done list.

import { useState } from "react";
import {
  sources,
  lastCheckedLabel,
  type SourceId,
} from "../content/sources.ts";
import {
  milestones,
  stageInfo,
  type MilestoneId,
  type Task,
} from "../content/tasks.ts";
import type { Situation, StageId } from "../lib/situation.ts";
import type { Plan } from "../lib/stage-engine.ts";
import { Button, Heading } from "./ui.tsx";

/** Screens a task can point to. They are reached from tasks, not a menu. */
export type Place = "housing" | "market" | "community";

export const taskPlaces: Partial<
  Record<string, { place: Place; label: string }>
> = {
  housing_search: { place: "housing", label: "Open the housing guide" },
  housing_long_term: { place: "housing", label: "Open the housing guide" },
  essentials_marketplace: { place: "market", label: "Open the marketplace" },
  pass_on_items: { place: "market", label: "Open the marketplace" },
  student_association: { place: "community", label: "Open community" },
  language_exchange: { place: "community", label: "Open community" },
};

export const stageLabel = (stage: StageId) =>
  stage === 0
    ? "Coming later"
    : `Stage ${stage} of 5 · ${stageInfo[stage].title}`;

const situationSummary = (s: Situation) => [
  {
    outside_france: "Outside France",
    in_france: "In France, not yet in Bordeaux",
    in_bordeaux: "In Bordeaux",
  }[s.location],
  {
    yes: {
      not_started: "Visa not started",
      applied: "Visa applied for",
      received: "Visa received",
    }[s.visaStatus],
    no: "No visa needed",
    not_sure: "Not sure about a visa",
  }[s.visaNeeded],
  {
    none: "No housing yet",
    temporary: "Temporary housing",
    secured: "Housing secured",
  }[s.accommodation],
];

function SourceLinks({ ids }: { ids: SourceId[] }) {
  const list = ids.filter((id) => sources[id].url);
  if (!list.length) return null;
  return (
    <ul className="source-links">
      {list.map((id) => (
        <li key={id}>
          <a href={sources[id].url} target="_blank" rel="noreferrer">
            {sources[id].name} ↗
          </a>
          <small>{lastCheckedLabel(sources[id])}</small>
        </li>
      ))}
    </ul>
  );
}

function TaskRow({
  task,
  onDone,
  onAsk,
  onGuide,
}: {
  task: Task;
  onDone: (id: string) => void;
  onAsk: (id: MilestoneId) => void;
  onGuide: (id: string) => void;
}) {
  return (
    <li className="task-row">
      <div className="task-main">
        <div>
          {task.doFirst && <span className="tag">Do first</span>}
          <h3>{task.title}</h3>
          <p>{task.summary}</p>
        </div>
        <div className="task-actions">
          <button className="plain" onClick={() => onGuide(task.id)}>
            Open guide
          </button>
          <button
            className="mark"
            onClick={() =>
              task.confirms ? onAsk(task.confirms) : onDone(task.id)
            }
          >
            {task.confirms ? "I’ve done this" : "Mark as done"}
          </button>
        </div>
      </div>
    </li>
  );
}

export function Dashboard({
  situation,
  plan,
  onUpdate,
  onToggleDone,
  onAsk,
  onGuide,
}: {
  situation: Situation;
  plan: Plan;
  onUpdate: () => void;
  onToggleDone: (id: string) => void;
  onAsk: (id: MilestoneId) => void;
  onGuide: (id: string) => void;
}) {
  const [hideSuggestion, setHideSuggestion] = useState<string | null>(null);
  const { stage, overlay } = plan;
  const header = (
    <Heading
      stage={stageLabel(stage)}
      title={situation.name ? `Hi ${situation.name}` : "Hi there"}
      copy={stageInfo[stage].meaning}
      action={
        <button className="update-situation" onClick={onUpdate}>
          Update my situation
        </button>
      }
    />
  );
  if (stage === 0)
    return (
      <>
        {header}
        <section className="coming-later">
          <p className="eyebrow">Still applying?</p>
          <h2>Guidance for applying is coming later.</h2>
          <p>
            For now, TaupeFR helps once you&rsquo;ve been accepted by a school
            or university in Bordeaux. When that happens, update your situation
            and your plan will appear here.
          </p>
          <Button onClick={onUpdate}>Update my situation</Button>
        </section>
      </>
    );

  const stageTasks = plan.priorities.filter((t) => t.group !== "housing");
  const rowProps = { onDone: onToggleDone, onAsk, onGuide };
  const suggestion =
    plan.suggestion && plan.suggestion.id !== hideSuggestion
      ? plan.suggestion
      : null;
  const otherMilestones = plan.milestones.filter(
    (m) => m.group !== "housing" && m.id !== suggestion?.id,
  );
  const housingQuestions = plan.milestones.filter((m) => m.group === "housing");
  const linkIds = [...new Set(plan.priorities.flatMap((t) => t.sources))]
    .filter((id) => sources[id].url)
    .slice(0, 6);
  const pct = plan.progress.total
    ? Math.round((plan.progress.done / plan.progress.total) * 100)
    : 0;

  return (
    <>
      {header}
      {suggestion && (
        <section className="suggestion">
          <div>
            <p className="eyebrow">Looks like you’re ready</p>
            <h2>{suggestion.question}</h2>
            <p>
              You’ve done the tasks for this stage. Your plan only moves on if
              you say yes.
            </p>
          </div>
          <div className="suggestion-actions">
            <button className="mark" onClick={() => onAsk(suggestion.id)}>
              Answer
            </button>
            <button
              className="plain"
              onClick={() => setHideSuggestion(suggestion.id)}
            >
              Not now
            </button>
          </div>
        </section>
      )}
      {overlay && (
        <section className={"housing-priority " + overlay}>
          <p className="eyebrow">
            {overlay === "strong" ? "Top priority · Housing" : "Housing"}
          </p>
          <h2>
            {overlay === "strong"
              ? "Sort your housing early."
              : "You have a temporary place. Keep looking."}
          </h2>
          <p>
            {overlay === "strong"
              ? "Many later steps ask for an address; some accept a temporary one. Check the official source. TaupeFR doesn’t list, check or rent homes."
              : "A temporary place is a good start. Some later steps, such as CAF housing aid, usually ask about your main home."}
          </p>
          <ul className="task-list">
            {plan.housing.map((t) => (
              <TaskRow key={t.id} task={t} {...rowProps} />
            ))}
          </ul>
          <div className="housing-questions">
            {housingQuestions.map((m) => (
              <button key={m.id} onClick={() => onAsk(m.id)}>
                {m.question}
              </button>
            ))}
          </div>
        </section>
      )}
      <div className="plan-grid">
        <section className="priorities">
          <p className="eyebrow">Your priorities</p>
          <h2>What matters now.</h2>
          {stageTasks.length ? (
            <ul className="task-list">
              {stageTasks.map((t) => (
                <TaskRow key={t.id} task={t} {...rowProps} />
              ))}
            </ul>
          ) : (
            <p className="empty">
              You’ve done everything on your list for this stage.
            </p>
          )}
          {plan.done.length > 0 && (
            <details className="done-list">
              <summary>Done ({plan.done.length})</summary>
              <ul>
                {plan.done.map((t) => (
                  <li key={t.id}>
                    <span>✓ {t.title}</span>
                    <button
                      className="plain"
                      onClick={() => onToggleDone(t.id)}
                    >
                      Undo
                    </button>
                  </li>
                ))}
              </ul>
            </details>
          )}
        </section>
        <aside className="plan-side">
          <div className="progress-card">
            <p className="eyebrow">Progress in this stage</p>
            <b>
              {plan.progress.done} of {plan.progress.total} done
            </b>
            <div className="setup-bar">
              <i style={{ width: `${pct}%` }} />
            </div>
            <small>
              {stage === 1
                ? "Housing tasks count here while you prepare."
                : "Only this stage’s tasks count here."}
            </small>
          </div>
          {otherMilestones.length > 0 && (
            <div className="milestones">
              <p className="eyebrow">Has something changed?</p>
              {otherMilestones.map((m) => (
                <button key={m.id} onClick={() => onAsk(m.id)}>
                  {m.question}
                  <span>→</span>
                </button>
              ))}
            </div>
          )}
          <div className="situation-card">
            <p className="eyebrow">Your situation</p>
            <b>{situationSummary(situation).join(" · ")}</b>
            <button className="plain link" onClick={onUpdate}>
              Update my situation →
            </button>
          </div>
          {linkIds.length > 0 && (
            <div className="links-card">
              <p className="eyebrow">Useful links for now</p>
              <SourceLinks ids={linkIds} />
            </div>
          )}
        </aside>
      </div>
    </>
  );
}

/** The confirmation question for a milestone. "Not yet" changes nothing. */
export function ConfirmMilestone({
  id,
  onYes,
  onNo,
}: {
  id: MilestoneId;
  onYes: () => void;
  onNo: () => void;
}) {
  const m = milestones.find((x) => x.id === id);
  if (!m) return null;
  return (
    <div className="confirm-backdrop" onClick={onNo}>
      <div
        className="confirm-card"
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        onClick={(e) => e.stopPropagation()}
      >
        <p className="eyebrow">Quick check</p>
        <h2 id="confirm-title">{m.question}</h2>
        <p>Your plan updates only if you say yes. You can change it later.</p>
        <div>
          <button className="mark" onClick={onYes}>
            Yes
          </button>
          <button className="plain" onClick={onNo}>
            Not yet
          </button>
        </div>
      </div>
    </div>
  );
}
