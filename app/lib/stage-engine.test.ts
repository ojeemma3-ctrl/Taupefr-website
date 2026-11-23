// Run with: npm test  (Node's built-in test runner, no extra dependencies)

import assert from "node:assert/strict";
import test from "node:test";

import { sampleStudents } from "../content/sample-students.ts";
import { sources, lastCheckedLabel } from "../content/sources.ts";
import { milestones, tasks } from "../content/tasks.ts";
import { emptySituation, type Situation } from "./situation.ts";
import {
  buildPlan,
  completeTask,
  confirmMilestone,
  declineMilestone,
  getHousingOverlay,
  getStage,
} from "./stage-engine.ts";

const student = (id: string) => {
  const s = sampleStudents.find((x) => x.id === id);
  assert.ok(s, `missing sample student ${id}`);
  return s;
};
const planFor = (id: string) => {
  const s = student(id);
  return buildPlan(s.situation, new Set(s.doneTaskIds));
};
const ids = (list: { id: string }[]) => list.map((t) => t.id);
const sit = (patch: Partial<Situation>): Situation => ({
  ...emptySituation,
  ...patch,
});

// ── The five test students from the brief, plus Ben ──

test("1. admitted, outside France, needs a visa, no housing → Stage 1, strong housing", () => {
  const p = planFor("ada");
  assert.equal(p.stage, 1);
  assert.equal(p.overlay, "strong");
  assert.deepEqual(ids(p.priorities).slice(0, 3), [
    "housing_search",
    "housing_documents",
    "housing_guarantor",
  ]);
  assert.ok(ids(p.priorities).includes("apply_visa"));
  assert.ok(!ids(p.priorities).includes("check_visa"));
});

test("2. visa received, preparing to travel, housing secured → Stage 2, no housing block", () => {
  const p = planFor("chi");
  assert.equal(p.stage, 2);
  assert.equal(p.overlay, null);
  assert.deepEqual(p.housing, []);
  assert.equal(p.priorities[0].id, "book_journey");
  // Housing secured: no "where you'll stay on arrival" task.
  assert.ok(!ids(p.priorities).includes("first_place_to_stay"));
});

test("3. just arrived in Bordeaux, temporary place → Stage 3, soft housing", () => {
  const p = planFor("dami");
  assert.equal(p.stage, 3);
  assert.equal(p.overlay, "soft");
  assert.deepEqual(ids(p.housing), ["housing_long_term"]);
  assert.equal(p.priorities[0].id, "housing_long_term");
  assert.ok(ids(p.priorities).includes("validate_visa"));
});

test("4. in Bordeaux a while, first days done, no accommodation → Stage 4, strong housing at the top", () => {
  const p = planFor("eva");
  assert.equal(p.stage, 4);
  assert.equal(p.overlay, "strong");
  assert.equal(p.priorities[0].id, "housing_search");
  // No visa needed: EU health card task, not French registration.
  assert.ok(ids(p.priorities).includes("ehic"));
  assert.ok(!ids(p.priorities).includes("health_insurance"));
  // CAF waits until housing is secured.
  assert.ok(!ids(p.priorities).includes("caf"));
});

test("5. feels settled, housing secured → Stage 5, no housing block, Done list visible", () => {
  const p = planFor("femi");
  assert.equal(p.stage, 5);
  assert.equal(p.overlay, null);
  assert.ok(p.done.length > 0);
  assert.ok(ids(p.done).includes("student_association"));
});

test("Ben: not sure about a visa → Stage 1, 'Check whether you need a visa' first after housing", () => {
  const p = planFor("ben");
  assert.equal(p.stage, 1);
  assert.equal(p.overlay, "strong");
  const firstStageTask = p.priorities.find((t) => t.group !== "housing");
  assert.equal(firstStageTask?.id, "check_visa");
  assert.ok(!ids(p.priorities).includes("apply_visa"));
});

// ── Stage rules ──

test("in France but not Bordeaux is Stage 2, whatever the visa status", () => {
  assert.equal(getStage(sit({ location: "in_france", visaNeeded: "yes" })), 2);
  assert.equal(
    getStage(sit({ location: "in_france", visaNeeded: "not_sure" })),
    2,
  );
});

test("outside France with no visa needed is Stage 2", () => {
  assert.equal(getStage(sit({ visaNeeded: "no" })), 2);
});

test("visa applied but not received stays in Stage 1", () => {
  assert.equal(getStage(sit({ visaNeeded: "yes", visaStatus: "applied" })), 1);
});

test("still applying returns the future Stage 0 (coming later)", () => {
  assert.equal(getStage(sit({ admission: "applying" })), 0);
  assert.deepEqual(
    buildPlan(sit({ admission: "applying" }), new Set()).priorities.filter(
      (t) => t.group !== "housing",
    ),
    [],
  );
});

test("task completion never changes the stage", () => {
  const s = student("ada").situation;
  const allDone = new Set(tasks.map((t) => t.id));
  assert.equal(buildPlan(s, allDone).stage, 1);
});

test("housing never changes the stage", () => {
  for (const accommodation of ["none", "temporary", "secured"] as const) {
    assert.equal(getStage(sit({ visaNeeded: "yes", accommodation })), 1);
    assert.equal(
      getStage(
        sit({ location: "in_bordeaux", firstDaysDone: true, accommodation }),
      ),
      4,
    );
  }
});

// ── Housing overlay ──

test("housing overlay: none → strong, temporary → soft, secured → gone", () => {
  assert.equal(getHousingOverlay(sit({ accommodation: "none" })), "strong");
  assert.equal(getHousingOverlay(sit({ accommodation: "temporary" })), "soft");
  assert.equal(getHousingOverlay(sit({ accommodation: "secured" })), null);
});

test("with no accommodation, housing is the top priority in every stage", () => {
  const situations: Situation[] = [
    sit({ visaNeeded: "yes" }),
    sit({ visaNeeded: "no" }),
    sit({ location: "in_bordeaux" }),
    sit({ location: "in_bordeaux", firstDaysDone: true }),
    sit({ location: "in_bordeaux", firstDaysDone: true, settled: true }),
  ];
  for (const s of situations) {
    const p = buildPlan(s, new Set());
    assert.equal(p.priorities[0].group, "housing", `stage ${p.stage}`);
  }
});

test("housing counts toward progress only in Stage 1", () => {
  const stage1 = buildPlan(
    sit({ visaNeeded: "yes" }),
    new Set(["housing_search"]),
  );
  assert.equal(stage1.progress.done, 1);
  const stage4 = buildPlan(
    sit({ location: "in_bordeaux", firstDaysDone: true }),
    new Set(["housing_search"]),
  );
  assert.equal(stage4.progress.done, 0);
});

// ── Routine tasks and milestones ──

test("a routine task is marked done and leaves the active list", () => {
  const s = student("chi").situation;
  const task = tasks.find((t) => t.id === "documents_to_carry")!;
  const { done, askMilestone } = completeTask(new Set(), task);
  assert.equal(askMilestone, null);
  const p = buildPlan(s, done);
  assert.ok(!ids(p.priorities).includes("documents_to_carry"));
  assert.ok(ids(p.done).includes("documents_to_carry"));
  assert.equal(p.progress.done, 1);
});

test("a task tied to a milestone asks the question instead of ticking silently", () => {
  const task = tasks.find((t) => t.id === "book_journey")!;
  const { done, askMilestone } = completeTask(new Set(), task);
  assert.equal(askMilestone, "journey_booked");
  assert.ok(!done.has("book_journey"));
});

test("confirming a milestone updates the situation and can move the stage", () => {
  const chi = student("chi").situation;
  const arrived = confirmMilestone(chi, "arrived_bordeaux");
  assert.equal(arrived.location, "in_bordeaux");
  assert.equal(getStage(arrived), 3);
  const firstDays = confirmMilestone(arrived, "first_days_done");
  assert.equal(getStage(firstDays), 4);
  const settled = confirmMilestone(firstDays, "feel_settled");
  assert.equal(getStage(settled), 5);
});

test("declining a milestone changes nothing", () => {
  const ada = student("ada").situation;
  assert.deepEqual(declineMilestone(ada), ada);
  assert.equal(getStage(declineMilestone(ada)), 1);
});

test("securing housing removes the overlay but keeps the stage", () => {
  const eva = student("eva").situation;
  const secured = confirmMilestone(eva, "accommodation_secured");
  assert.equal(getHousingOverlay(secured), null);
  assert.equal(getStage(secured), getStage(eva));
});

test("the next milestone is suggested once all routine tasks in the stage are done", () => {
  const s = sit({
    location: "in_bordeaux",
    accommodation: "secured",
    visaNeeded: "yes",
    visaStatus: "received",
  });
  const stageTaskIds = tasks.filter((t) => t.group === 3).map((t) => t.id);
  const none = buildPlan(s, new Set());
  assert.equal(none.suggestion, null);
  const all = buildPlan(s, new Set(stageTaskIds));
  assert.equal(all.suggestion?.id, "first_days_done");
  // A suggestion never moves the stage by itself.
  assert.equal(all.stage, 3);
});

// ── Content checks ──

test("every task's sources exist, and no source has an unconfirmed date", () => {
  for (const t of tasks) {
    for (const id of t.sources)
      assert.ok(id in sources, `${t.id}: unknown source ${id}`);
  }
  for (const [id, src] of Object.entries(sources)) {
    assert.equal(
      src.lastChecked,
      null,
      `${id} has a date; only Emmanuel confirms dates`,
    );
    assert.equal(lastCheckedLabel(src), "Last checked: to be confirmed");
  }
});

test("task and milestone ids are unique", () => {
  assert.equal(new Set(ids(tasks)).size, tasks.length);
  assert.equal(new Set(ids(milestones)).size, milestones.length);
});

test("no task wording uses 'verified' or 'unlock'", () => {
  for (const t of tasks) {
    const text = [
      t.title,
      t.summary,
      t.why,
      ...(t.prepare ?? []),
      ...(t.steps ?? []),
    ].join(" ");
    assert.ok(!/verified|unlock/i.test(text), `${t.id}: ${text}`);
  }
});
