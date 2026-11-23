// Taupe Assistant: a frontend simulation with scripted answers. It is not an
// AI and has no backend. It uses the student's situation, stage, current
// task and done tasks so the answers fit them (brief §8).

import { glossary } from "../content/glossary.ts";
import { sources, lastCheckedLabel } from "../content/sources.ts";
import { stageInfo, tasks, type Task } from "../content/tasks.ts";
import { appliesNote } from "./applies.ts";
import type { Situation } from "./situation.ts";
import type { Plan } from "./stage-engine.ts";

export type AssistantContext = {
  situation: Situation | null;
  plan: Plan | null;
  /** The task whose guide the student is reading, if any. */
  taskId: string | null;
  done: readonly string[];
};

export type Quick = { id: string; label: string };

const taskById = (id: string | null) =>
  id ? (tasks.find((t) => t.id === id) ?? null) : null;

export const NOT_AI =
  "Prototype with scripted answers. Not a real AI, and nothing you type is sent anywhere.";

export function contextLabel(ctx: AssistantContext): string {
  const task = taskById(ctx.taskId);
  if (task) return task.title;
  if (!ctx.plan) return "Getting started";
  return ctx.plan.stage === 0
    ? "Coming later"
    : `Stage ${ctx.plan.stage} · ${stageInfo[ctx.plan.stage].title}`;
}

export function opening(ctx: AssistantContext): string {
  const task = taskById(ctx.taskId);
  const name = ctx.situation?.name ? `, ${ctx.situation.name}` : "";
  if (task)
    return `Hi${name}. You’re looking at “${task.title}”. What would help?`;
  if (!ctx.plan)
    return `Hi${name}. Answer a few questions first and I can help with your own plan.`;
  return `Hi${name}. I can explain your plan, your stage and French terms. What would help?`;
}

export function suggestions(ctx: AssistantContext): Quick[] {
  if (taskById(ctx.taskId))
    return [
      { id: "explain", label: "Explain this simply" },
      { id: "applies", label: "Does this apply to me?" },
      { id: "prepare", label: "What do I need to prepare?" },
      { id: "where", label: "Where do I do it?" },
      { id: "after", label: "What comes after this?" },
    ];
  if (!ctx.plan) return [{ id: "terms", label: "Explain a French term" }];
  return [
    { id: "next", label: "What should I do next?" },
    { id: "why_stage", label: "Why am I in this stage?" },
    { id: "done", label: "What have I done so far?" },
    { id: "terms", label: "Explain a French term" },
  ];
}

/** Follow-up buttons after an answer (French terms list their words). */
export function followUps(id: string): Quick[] {
  return id === "terms"
    ? glossary.map((g) => ({ id: `term:${g.term}`, label: g.term }))
    : [];
}

function whyStage(s: Situation, plan: Plan): string {
  const reason = {
    0: "you told us you’re still applying. Guidance for applying is coming later.",
    1:
      s.visaNeeded === "not_sure"
        ? "you’re outside France and not sure yet whether you need a visa."
        : "you’re outside France and your visa isn’t in your hands yet.",
    2:
      s.location === "in_france"
        ? "you’re in France but not in Bordeaux yet."
        : s.visaNeeded === "no"
          ? "you’re outside France and don’t need a visa, so the next step is a safe journey."
          : "you have your visa, so the next step is a safe journey.",
    3: "you’re in Bordeaux and haven’t told us your first days are done.",
    4: "you’re in Bordeaux and told us your first days are done.",
    5: "you told us you feel settled in Bordeaux.",
  }[plan.stage];
  const housing = plan.overlay
    ? " Housing doesn’t change your stage. It only moves housing to the top of your list until you have a place."
    : "";
  return `You’re in ${stageInfo[plan.stage].title} because ${reason}${housing} If something changed, use Update my situation.`;
}

function nextStep(plan: Plan): string {
  if (plan.stage === 0)
    return "For now TaupeFR starts once you’re accepted. When that happens, update your situation and your plan appears.";
  const first = plan.priorities[0];
  if (!first)
    return plan.suggestion
      ? `You’ve done everything on your list for this stage. When you’re ready, answer: “${plan.suggestion.question}”`
      : "You’ve done everything on your list for this stage.";
  const why =
    first.group === "housing"
      ? plan.overlay === "strong"
        ? " Housing is at the top because you don’t have a place secured yet."
        : " You have a temporary place, so finding somewhere longer term stays near the top."
      : first.doFirst
        ? " It’s one of the first things to do in this stage."
        : "";
  return `Start with “${first.title}”.${why} You don’t have to follow a fixed order. Open its guide for the steps and the official link.`;
}

function doneSoFar(plan: Plan): string {
  if (!plan.done.length)
    return `Nothing marked done in this stage yet. You have ${plan.priorities.length} things on your list.`;
  const titles = plan.done.map((t) => t.title);
  return `You’ve marked ${titles.length} done: ${titles.join("; ")}. That’s ${plan.progress.done} of ${plan.progress.total} for this stage.`;
}

function aboutTask(id: string, task: Task, ctx: AssistantContext): string {
  switch (id) {
    case "explain":
      return `${task.summary} ${task.why}`;
    case "applies":
      return ctx.situation
        ? appliesNote(task, ctx.situation)
        : "It depends on your situation. The official source decides.";
    case "prepare":
      return task.prepare?.length
        ? `Usually: ${task.prepare.join("; ")}. What’s asked for can vary, so check the official source.`
        : "No set list for this one. The official source or the provider tells you what they need.";
    case "where": {
      const list = task.sources
        .map((s) => sources[s])
        .filter((s) => s.url)
        .map((s) => `${s.name} (${lastCheckedLabel(s).toLowerCase()})`);
      return list.length
        ? `Go through ${list.join(", ")}. The links are in the guide.`
        : "This is your own choice. Compare options yourself; TaupeFR doesn’t partner with any provider.";
    }
    case "after": {
      const list = ctx.plan?.priorities ?? [];
      const at = list.findIndex((t) => t.id === task.id);
      const next =
        list.slice(at + 1).find((t) => t.id !== task.id) ??
        list.find((t) => t.id !== task.id);
      return next
        ? `Next on your plan: “${next.title}”.`
        : "That’s the last thing on your list for this stage.";
    }
  }
  return "";
}

// Typed questions: matched against French terms and plan topics only.
const topics: [RegExp, string[]][] = [
  [/visa/i, ["check_visa", "apply_visa", "validate_visa"]],
  [/\bcaf\b|\bapl\b|housing aid/i, ["caf"]],
  [
    /hous|accommodation|flat|apartment|room|rent|landlord|lease/i,
    [
      "housing_search",
      "housing_documents",
      "housing_guarantor",
      "housing_scams",
      "housing_long_term",
      "first_place_to_stay",
    ],
  ],
  [/bank|account/i, ["bank_options", "open_bank_account"]],
  [/phone|sim\b|mobile/i, ["phone_number"]],
  [/transport|tram|bus|tbm/i, ["transport_pass", "route_to_place"]],
  [/doctor|médecin|medecin/i, ["choose_doctor"]],
  [/budget|money|cash|cost/i, ["budget", "money_for_arrival"]],
  [/journey|flight|train|travel|ticket/i, ["book_journey"]],
  [/regist|enrol|university|welcome/i, ["university_registration"]],
  [/health|insurance|ehic|card/i, ["health_insurance", "ehic"]],
  [
    /market|furniture|second[- ]hand|swap/i,
    ["essentials_marketplace", "pass_on_items"],
  ],
  [
    /friend|community|association|club|language/i,
    ["student_association", "language_exchange"],
  ],
  [/emergenc|112|police|ambulance/i, ["emergency_numbers"]],
];

function typed(text: string, ctx: AssistantContext): string {
  const term = glossary.find((g) => g.match.test(text));
  const topic = topics.find(([re]) => re.test(text));
  const parts: string[] = [];
  if (term) parts.push(term.meaning);
  if (topic) {
    const onPlan = (ctx.plan?.priorities ?? []).filter((t) =>
      topic[1].includes(t.id),
    );
    const done = (ctx.plan?.done ?? []).filter((t) => topic[1].includes(t.id));
    if (onPlan.length)
      parts.push(
        `That’s on your plan: “${onPlan[0].title}”. Open its guide for the steps and the official link.`,
      );
    else if (done.length)
      parts.push(`You’ve already marked “${done[0].title}” as done.`);
    else if (
      topic[1].includes("caf") &&
      ctx.situation?.accommodation !== "secured"
    )
      parts.push(
        "CAF usually asks about your main home, so it shows on your plan once you have a place secured.",
      );
    else if (ctx.plan)
      parts.push(
        "That isn’t on your plan right now. It may come up in a later stage, or not apply to what you told us. If something changed, use Update my situation.",
      );
  }
  if (parts.length) return parts.join(" ");
  return "I’m a prototype with scripted answers, so I can’t answer that yet. Try a suggested question, or open the guide for your task.";
}

export function reply(
  ctx: AssistantContext,
  input: { quick: string } | { text: string },
): string {
  if ("text" in input) return typed(input.text, ctx);
  const id = input.quick;
  if (id.startsWith("term:"))
    return glossary.find((g) => `term:${g.term}` === id)?.meaning ?? "";
  if (id === "terms")
    return "Pick a word below, or type it. These are the French terms students ask about most.";
  const task = taskById(ctx.taskId);
  if (task) return aboutTask(id, task, ctx);
  if (!ctx.plan || !ctx.situation)
    return "Answer the profile questions first and I can help with your plan.";
  if (id === "next") return nextStep(ctx.plan);
  if (id === "why_stage") return whyStage(ctx.situation, ctx.plan);
  if (id === "done") return doneSoFar(ctx.plan);
  return "";
}
