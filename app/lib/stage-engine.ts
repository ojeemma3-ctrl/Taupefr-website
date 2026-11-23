// The TaupeFR stage engine. Three separate layers (docs/PRODUCT_PLAN.md §4):
//   1. Situation → stage. Only location and confirmed milestones count.
//      Task completion and housing never set the stage.
//   2. Outstanding tasks → priorities inside the stage.
//   3. Housing → a cross-stage overlay that changes priorities, never the stage.

import type { Situation, StageId } from "./situation.ts";
import {
  milestones,
  tasks,
  type Milestone,
  type MilestoneId,
  type Task,
} from "../content/tasks.ts";

// ── Layer 1: situation → stage ──

export function getStage(s: Situation): StageId {
  if (s.admission === "applying") return 0;
  if (s.location === "in_bordeaux") {
    if (s.settled) return 5;
    if (s.firstDaysDone) return 4;
    return 3;
  }
  // Already in France, not yet in Bordeaux: the journey to Bordeaux.
  if (s.location === "in_france") return 2;
  // Outside France.
  if (s.visaNeeded === "not_sure") return 1;
  if (s.visaNeeded === "yes" && s.visaStatus !== "received") return 1;
  return 2;
}

// ── Layer 3: housing overlay ──

export type HousingOverlay = "strong" | "soft" | null;

export function getHousingOverlay(s: Situation): HousingOverlay {
  if (s.accommodation === "none") return "strong";
  if (s.accommodation === "temporary") return "soft";
  return null;
}

// ── Layer 2: priorities inside the stage ──

const applies = (t: Task, s: Situation) =>
  t.appliesTo ? t.appliesTo(s) : true;

/** Housing tasks shown by the overlay right now (done or not). */
export function housingTasksFor(s: Situation): Task[] {
  const overlay = getHousingOverlay(s);
  if (!overlay) return [];
  return tasks.filter(
    (t) => t.group === "housing" && t.overlay === overlay && applies(t, s),
  );
}

/** Tasks that belong to the stage itself (housing tasks excluded). */
export function stageTasksFor(s: Situation, stage = getStage(s)): Task[] {
  if (stage === 0) return [];
  return tasks.filter((t) => t.group === stage && applies(t, s));
}

/** Milestones that can be confirmed right now, for this stage and the housing overlay. */
export function milestonesFor(s: Situation, stage = getStage(s)): Milestone[] {
  return milestones.filter(
    (m) =>
      (m.group === stage || (m.group === "housing" && getHousingOverlay(s))) &&
      m.appliesTo(s),
  );
}

export type Plan = {
  stage: StageId;
  overlay: HousingOverlay;
  /** Active housing tasks for the housing block (empty when no overlay). */
  housing: Task[];
  /** Every active task in priority order: housing, then "do first", then the rest. */
  priorities: Task[];
  /** Done tasks that still apply, for the compact Done list. */
  done: Task[];
  /** Progress for this stage only. Housing counts only in Stage 1. */
  progress: { done: number; total: number };
  milestones: Milestone[];
  /** Suggested when every routine task in the stage is done. Never applied automatically. */
  suggestion: Milestone | null;
};

export function buildPlan(s: Situation, doneIds: ReadonlySet<string>): Plan {
  const stage = getStage(s);
  const overlay = getHousingOverlay(s);
  const housingAll = housingTasksFor(s);
  const stageAll = stageTasksFor(s, stage);

  const isDone = (t: Task) => doneIds.has(t.id);
  const housing = housingAll.filter((t) => !isDone(t));
  const stageActive = stageAll.filter((t) => !isDone(t));

  const priorities = [
    ...housing,
    ...stageActive.filter((t) => t.doFirst),
    ...stageActive.filter((t) => !t.doFirst),
  ];

  const counted = stage === 1 ? [...housingAll, ...stageAll] : stageAll;
  const progress = {
    done: counted.filter(isDone).length,
    total: counted.length,
  };

  const available = milestonesFor(s, stage);
  const allRoutineDone = stageAll.length > 0 && stageActive.length === 0;
  const suggestion = allRoutineDone
    ? (available.find((m) => m.group === stage && m.advancesStage) ?? null)
    : null;

  return {
    stage,
    overlay,
    housing,
    priorities,
    done: [...housingAll, ...stageAll].filter(isDone),
    progress,
    milestones: available,
    suggestion,
  };
}

// ── Milestones ──

/** Student said yes: update the situation. The caller re-runs buildPlan. */
export function confirmMilestone(s: Situation, id: MilestoneId): Situation {
  const m = milestones.find((x) => x.id === id);
  if (!m || !m.appliesTo(s)) return s;
  return m.apply(s);
}

/** Student said no: nothing changes. Kept explicit so the rule is visible. */
export function declineMilestone(s: Situation): Situation {
  return s;
}

/**
 * Marking a routine task done. A task tied to a milestone must not be ticked
 * silently: the caller shows its question instead.
 */
export function completeTask(
  doneIds: ReadonlySet<string>,
  task: Task,
): { done: Set<string>; askMilestone: MilestoneId | null } {
  if (task.confirms)
    return { done: new Set(doneIds), askMilestone: task.confirms };
  const done = new Set(doneIds);
  done.add(task.id);
  return { done, askMilestone: null };
}
