// The student's situation, stored as plain facts.
// Only these facts (location + confirmed milestones) decide the stage.
// See docs/PRODUCT_PLAN.md section 4 and docs/DECISIONS.md.

export type Location = "outside_france" | "in_france" | "in_bordeaux";
export type Admission = "accepted" | "applying";
export type VisaNeeded = "yes" | "no" | "not_sure";
export type VisaStatus = "not_started" | "applied" | "received";
export type Accommodation = "none" | "temporary" | "secured";

export type Situation = {
  /** Optional first name for the welcome. */
  name?: string;
  location: Location;
  admission: Admission;
  visaNeeded: VisaNeeded;
  /** Only meaningful when visaNeeded is "yes". */
  visaStatus: VisaStatus;
  travelBooked: boolean;
  accommodation: Accommodation;
  /** Student confirmed their first days in Bordeaux are done. */
  firstDaysDone: boolean;
  /** Student confirmed "I feel settled". Never assumed. */
  settled: boolean;
};

/** 0 = still applying (future "Applying" stage, not built yet). */
export type StageId = 0 | 1 | 2 | 3 | 4 | 5;

export const emptySituation: Situation = {
  location: "outside_france",
  admission: "accepted",
  visaNeeded: "not_sure",
  visaStatus: "not_started",
  travelBooked: false,
  accommodation: "none",
  firstDaysDone: false,
  settled: false,
};

export const needsVisa = (s: Situation) => s.visaNeeded === "yes";
