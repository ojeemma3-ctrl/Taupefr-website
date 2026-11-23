// The assistant's scripted answers must fit the student (brief §8).

import assert from "node:assert/strict";
import test from "node:test";

import { sampleStudents } from "../content/sample-students.ts";
import { NOT_AI, opening, reply, suggestions } from "./assistant.ts";
import { buildPlan } from "./stage-engine.ts";

const ctxFor = (id: string, taskId: string | null = null) => {
  const s = sampleStudents.find((x) => x.id === id)!;
  return {
    situation: s.situation,
    plan: buildPlan(s.situation, new Set(s.doneTaskIds)),
    done: s.doneTaskIds,
    taskId,
  };
};

test("says plainly it is not a real AI", () => {
  assert.match(NOT_AI, /not a real AI/i);
});

test("'what next' differs by student and follows their plan", () => {
  const ada = reply(ctxFor("ada"), { quick: "next" });
  const chi = reply(ctxFor("chi"), { quick: "next" });
  assert.match(ada, /housing search/i);
  assert.match(ada, /don’t have a place secured/);
  assert.match(chi, /Book your journey/);
  assert.notEqual(ada, chi);
});

test("'why this stage' explains the situation, and that housing never sets the stage", () => {
  const ben = reply(ctxFor("ben"), { quick: "why_stage" });
  assert.match(ben, /not sure yet whether you need a visa/);
  assert.match(ben, /Housing doesn’t change your stage/);
  const femi = reply(ctxFor("femi"), { quick: "why_stage" });
  assert.match(femi, /feel settled/);
});

test("'what have I done' lists the student's done tasks", () => {
  assert.match(reply(ctxFor("femi"), { quick: "done" }), /Join a student/i);
  assert.match(reply(ctxFor("ada"), { quick: "done" }), /Nothing marked done/);
});

test("inside a task guide, answers are about that task", () => {
  const ctx = ctxFor("ada", "apply_visa");
  assert.match(opening(ctx), /Apply for your student visa/);
  assert.equal(suggestions(ctx)[0].id, "explain");
  assert.match(reply(ctx, { quick: "applies" }), /You told us you need a visa/);
  assert.match(reply(ctx, { quick: "where" }), /to be confirmed/);
  assert.match(reply(ctx, { quick: "after" }), /Next on your plan/);
});

test("typed questions: French terms and topics on or off the plan", () => {
  assert.match(
    reply(ctxFor("ada"), { text: "what is a RIB?" }),
    /bank details/,
  );
  // CAF waits until housing is secured: not on Eva's plan yet.
  assert.match(
    reply(ctxFor("eva"), { text: "can I get CAF?" }),
    /once you have a place secured/,
  );
  assert.match(
    reply(ctxFor("dami"), { text: "how do I get a sim" }),
    /on your plan: “Get a French phone number”/,
  );
  assert.match(
    reply(ctxFor("ada"), { text: "tell me a joke" }),
    /can’t answer that yet/,
  );
});
