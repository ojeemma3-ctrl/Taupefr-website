// Why a task is on the student's plan, in plain words. Used by the task
// guide and by the assistant.

import { stageInfo, type Task } from "../content/tasks.ts";
import type { Situation } from "./situation.ts";

/** Why this task is on the student's plan, in plain words. */
export function appliesNote(task: Task, s: Situation): string {
  switch (task.id) {
    case "check_visa":
      return "You told us you’re not sure whether you need a visa. It depends on your nationality, so check before anything else.";
    case "apply_visa":
    case "validate_visa":
      return "You told us you need a visa. The exact procedure depends on your nationality and your visa type.";
    case "health_insurance":
      return "You told us you need a visa or aren’t sure, so French health insurance registration may apply to you. Ameli decides.";
    case "ehic":
      return "You told us you don’t need a visa, which often means you’re an EU, EEA or Swiss citizen. Your home health card may cover you; check first.";
    case "caf":
      return "You have a place secured. CAF looks at your situation and decides who can get housing aid.";
    case "first_place_to_stay":
      return "You don’t have a place secured yet. Somewhere temporary for your first nights is fine.";
    case "book_journey":
      return "You haven’t told us your journey is booked yet.";
    case "cvec":
      return "Many students in higher education pay the CVEC, but not all. Check whether it applies to you.";
  }
  if (task.group === "housing")
    return s.accommodation === "temporary"
      ? "You have a temporary place, so this stays on your plan until you find somewhere longer term."
      : "You don’t have housing secured yet, so housing stays at the top of your plan in every stage.";
  return `This is part of ${stageInfo[task.group].title.toLowerCase()} for most international students. If it doesn’t fit you, you can mark it as done.`;
}
