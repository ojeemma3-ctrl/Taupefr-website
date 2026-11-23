// Demo students for the jury, from docs/REDESIGN_BRIEF.md (five) plus "Ben".
// Sample data, for demonstration. Names are placeholders.

import type { Situation } from "../lib/situation.ts";

export type SampleStudent = {
  id: string;
  name: string;
  label: string;
  situation: Situation;
  doneTaskIds: string[];
};

export const sampleStudents: SampleStudent[] = [
  {
    id: "ada",
    name: "Ada",
    label: "Admitted, still outside France, needs a visa, no housing",
    situation: {
      name: "Ada",
      location: "outside_france",
      admission: "accepted",
      visaNeeded: "yes",
      visaStatus: "not_started",
      travelBooked: false,
      accommodation: "none",
      firstDaysDone: false,
      settled: false,
    },
    doneTaskIds: [],
  },
  {
    id: "chi",
    name: "Chi",
    label: "Visa received, preparing to travel, housing secured",
    situation: {
      name: "Chi",
      location: "outside_france",
      admission: "accepted",
      visaNeeded: "yes",
      visaStatus: "received",
      travelBooked: false,
      accommodation: "secured",
      firstDaysDone: false,
      settled: false,
    },
    doneTaskIds: ["housing_search", "housing_documents", "key_documents"],
  },
  {
    id: "dami",
    name: "Dami",
    label: "Just arrived in Bordeaux, temporary place",
    situation: {
      name: "Dami",
      location: "in_bordeaux",
      admission: "accepted",
      visaNeeded: "yes",
      visaStatus: "received",
      travelBooked: true,
      accommodation: "temporary",
      firstDaysDone: false,
      settled: false,
    },
    doneTaskIds: ["key_documents", "documents_to_carry"],
  },
  {
    id: "eva",
    name: "Eva",
    label: "In Bordeaux for a while, first days done, no accommodation",
    situation: {
      name: "Eva",
      location: "in_bordeaux",
      admission: "accepted",
      visaNeeded: "no",
      visaStatus: "not_started",
      travelBooked: true,
      accommodation: "none",
      firstDaysDone: true,
      settled: false,
    },
    doneTaskIds: ["phone_number", "university_registration"],
  },
  {
    id: "femi",
    name: "Femi",
    label: "Several tasks done, feels settled, housing secured",
    situation: {
      name: "Femi",
      location: "in_bordeaux",
      admission: "accepted",
      visaNeeded: "yes",
      visaStatus: "received",
      travelBooked: true,
      accommodation: "secured",
      firstDaysDone: true,
      settled: true,
    },
    doneTaskIds: [
      "health_insurance",
      "caf",
      "open_bank_account",
      "transport_pass",
      "student_association",
      "emergency_numbers",
    ],
  },
  {
    id: "ben",
    name: "Ben",
    label: "Outside France, not sure whether a visa is needed, no housing",
    situation: {
      name: "Ben",
      location: "outside_france",
      admission: "accepted",
      visaNeeded: "not_sure",
      visaStatus: "not_started",
      travelBooked: false,
      accommodation: "none",
      firstDaysDone: false,
      settled: false,
    },
    doneTaskIds: [],
  },
];
