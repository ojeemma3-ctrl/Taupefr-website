// Every routine task and milestone, per stage.
// Wording stays hedged: the official organisation decides what applies.
// See docs/PRODUCT_PLAN.md sections 3 and 5, and docs/DECISIONS.md.

import { needsVisa, type Situation, type StageId } from "../lib/situation.ts";
import type { SourceId } from "./sources.ts";

/** "housing" = the cross-stage housing overlay, not a stage. */
export type TaskGroup = Exclude<StageId, 0> | "housing";

export type MilestoneId =
  | "visa_applied"
  | "visa_received"
  | "journey_booked"
  | "arrived_france"
  | "arrived_bordeaux"
  | "first_days_done"
  | "feel_settled"
  | "accommodation_temporary"
  | "accommodation_secured";

export type Task = {
  id: string;
  group: TaskGroup;
  title: string;
  /** One line shown in the task list. */
  summary: string;
  /** Sorted to the top of its stage. */
  doFirst?: boolean;
  /** Hidden when this returns false. Default: always applies. */
  appliesTo?: (s: Situation) => boolean;
  /** Housing overlay only: which strength of the block shows this task. */
  overlay?: "strong" | "soft";
  /** A routine task tied to a milestone opens its question instead of being ticked silently. */
  confirms?: MilestoneId;
  why: string;
  prepare?: string[];
  steps?: string[];
  sources: SourceId[];
};

export type Milestone = {
  id: MilestoneId;
  group: TaskGroup;
  question: string;
  /** Moves the student to the next stage when confirmed. */
  advancesStage?: boolean;
  appliesTo: (s: Situation) => boolean;
  /** The new situation if the student says yes. "No" changes nothing. */
  apply: (s: Situation) => Situation;
};

export const stageInfo: Record<StageId, { title: string; meaning: string }> = {
  0: {
    title: "Applying",
    meaning:
      "Guidance for students who are still applying is coming later. For now, TaupeFR starts once you've been accepted.",
  },
  1: {
    title: "Preparing to come to France",
    meaning: "Housing first, then your documents and visa if you need one.",
  },
  2: {
    title: "Getting ready to travel",
    meaning:
      "Plan a safe arrival: your journey, where you'll stay and what to carry.",
  },
  3: {
    title: "Arriving in Bordeaux",
    meaning: "Your first days: get settled in, get connected and register.",
  },
  4: {
    title: "Settling into Bordeaux",
    meaning:
      "Sort the essentials: health cover, housing aid and everyday life.",
  },
  5: {
    title: "Settled and connected",
    meaning: "Find your people and keep on top of renewals.",
  },
};

const noHousingYet = (s: Situation) => s.accommodation === "none";

export const tasks: Task[] = [
  // ── Housing pack (overlay, shown in any stage while housing isn't secured) ──
  {
    id: "housing_search",
    group: "housing",
    overlay: "strong",
    doFirst: true,
    title: "Start your housing search on existing platforms",
    summary:
      "CROUS, Studapart and other platforms. TaupeFR doesn't list homes.",
    why: "Sort housing early. Many later steps ask for an address; some accept a temporary one. Check the official source.",
    steps: [
      "Check CROUS student residences and their application dates.",
      "Compare private platforms such as Studapart, and read their terms and fees.",
      "Keep a list of what you've applied for and when.",
    ],
    sources: ["crousHousing", "crousBordeaux", "studapart"],
  },
  {
    id: "housing_documents",
    group: "housing",
    overlay: "strong",
    doFirst: true,
    title: "Prepare what landlords usually ask for",
    summary: "ID, proof of studies, proof of funds and a guarantor, often.",
    why: "Having your documents ready makes it quicker to apply. Requirements vary between landlords and platforms.",
    prepare: [
      "ID document (passport)",
      "Proof of studies (admission letter)",
      "Proof of income or funds",
      "Guarantor details, if you have one",
    ],
    sources: ["landlordDocuments"],
  },
  {
    id: "housing_guarantor",
    group: "housing",
    overlay: "strong",
    title: "Check guarantor options",
    summary: "Schemes such as Visale exist. Check whether you're eligible.",
    why: "Many landlords ask for a guarantor. Some schemes can act as one for eligible students. The scheme decides who qualifies.",
    sources: ["visale"],
  },
  {
    id: "housing_scams",
    group: "housing",
    overlay: "strong",
    title: "Learn how to spot housing scams",
    summary: "Never pay before you've seen the place and signed a lease.",
    why: "Scams often target students searching from abroad. Be wary of prices far below the area, pressure to decide fast, or requests to pay by money transfer.",
    sources: ["housingScams"],
  },
  {
    id: "housing_long_term",
    group: "housing",
    overlay: "soft",
    title: "Find long-term housing",
    summary:
      "You have a temporary place. Keep looking for somewhere longer term.",
    why: "A temporary place is a good start. Some later steps, such as CAF housing aid, usually ask about your main home.",
    sources: ["crousHousing", "studapart"],
  },

  // ── Stage 1: Preparing to come to France ──
  {
    id: "check_visa",
    group: 1,
    doFirst: true,
    title: "Check whether you need a visa",
    summary: "It depends on your nationality. The official site tells you.",
    appliesTo: (s) => s.visaNeeded === "not_sure",
    why: "Whether you need a student visa depends on your nationality and your situation. Once you know, update your situation so TaupeFR shows the right steps.",
    sources: ["franceVisas"],
  },
  {
    id: "apply_visa",
    group: 1,
    doFirst: true,
    title: "Apply for your student visa",
    summary: "Through the official procedure for your country.",
    appliesTo: (s) => needsVisa(s) && s.visaStatus === "not_started",
    confirms: "visa_applied",
    why: "In many countries the student visa goes through Campus France and Études en France before the visa appointment. The procedure depends on your country.",
    sources: ["campusFrance", "etudesEnFrance", "franceVisas"],
  },
  {
    id: "key_documents",
    group: 1,
    title: "Gather your key documents",
    summary: "Passport, admission letter, proof of funds.",
    why: "You'll need these for housing, your visa (if you need one) and registration.",
    prepare: ["Passport", "Admission letter", "Proof of funds"],
    sources: ["campusFrance"],
  },
  {
    id: "budget",
    group: 1,
    title: "Plan your budget for the first months",
    summary: "Rent, deposit, food, transport and setup costs.",
    why: "The first months often cost more: deposits, setup and waiting for any aid you may be eligible for.",
    sources: ["costOfLiving"],
  },

  // ── Stage 2: Getting ready to travel ──
  {
    id: "book_journey",
    group: 2,
    doFirst: true,
    title: "Book your journey",
    summary: "Your travel to Bordeaux.",
    appliesTo: (s) => !s.travelBooked,
    confirms: "journey_booked",
    why: "Booking early can help with cost and with planning your first days.",
    sources: [],
  },
  {
    id: "first_place_to_stay",
    group: 2,
    doFirst: true,
    title: "Arrange where you'll stay when you arrive",
    summary: "A temporary place is fine to start with.",
    appliesTo: noHousingYet,
    why: "Knowing where you'll sleep on your first nights makes arrival much safer.",
    sources: ["crousHousing"],
  },
  {
    id: "documents_to_carry",
    group: 2,
    doFirst: true,
    title: "Prepare the documents to carry in your hand luggage",
    summary:
      "Passport, visa if you have one, admission letter, housing details.",
    why: "Keep originals with you, not in checked luggage. Border checks may ask for them.",
    prepare: [
      "Passport (and visa, if you have one)",
      "Admission letter",
      "Housing or first-night address",
      "Proof of funds",
    ],
    sources: ["franceVisas"],
  },
  {
    id: "cvec",
    group: 2,
    title: "Pay the CVEC student fee, if it applies to you",
    summary: "Paid online. The certificate is asked for at enrolment.",
    why: "Many students must get a CVEC certificate (by paying or by exemption) before enrolling. The official site advises paying close to your actual enrolment. Some students are exempt but still need the certificate.",
    sources: ["cvec"],
  },
  {
    id: "route_to_place",
    group: 2,
    title: "Plan your route from the airport or station",
    summary: "How you'll get to your place in Bordeaux.",
    why: "Planning the last part of your journey avoids stress when you land.",
    sources: ["tbm"],
  },
  {
    id: "money_for_arrival",
    group: 2,
    title: "Arrange money for your first days",
    summary: "A card that works in France and some cash.",
    why: "Opening a French bank account can take time. Make sure you can pay for your first days.",
    sources: [],
  },
  {
    id: "first_week_plan",
    group: 2,
    title: "Plan your first week",
    summary: "What to do in your first days in Bordeaux.",
    why: "A short plan helps: getting a phone number, going to the university welcome and registering.",
    sources: [],
  },

  // ── Stage 3: Arriving in Bordeaux ──
  {
    id: "get_to_place",
    group: 3,
    doFirst: true,
    title: "Get to your accommodation",
    summary: "Your home or your temporary place.",
    why: "Settle in first. Everything else can follow.",
    sources: ["tbm"],
  },
  {
    id: "phone_number",
    group: 3,
    doFirst: true,
    title: "Get a French phone number",
    summary: "A commercial choice. Compare providers yourself.",
    why: "A French number makes everyday life and some services easier. TaupeFR doesn't recommend or partner with any provider.",
    sources: [],
  },
  {
    id: "university_registration",
    group: 3,
    doFirst: true,
    title: "Go to the university welcome and complete your registration",
    summary: "Your institution tells you what to bring.",
    why: "Registration (inscription administrative) is how you become officially enrolled. Your institution decides what it needs.",
    sources: ["uBordeaux", "uBordeauxMontaigne"],
  },
  {
    id: "validate_visa",
    group: 3,
    doFirst: true,
    title: "Validate your visa online, if your visa requires it",
    summary:
      "Some long-stay student visas (VLS-TS) must be validated online after arrival.",
    appliesTo: needsVisa,
    why: "A VLS-TS is a long-stay visa that can act as a residence permit once validated. Check what your visa says. The official portal decides which route applies.",
    sources: ["anef"],
  },
  {
    id: "bank_options",
    group: 3,
    title: "Compare bank account options",
    summary: "A commercial choice. Requirements vary between banks.",
    why: "A French account can make rent and everyday payments easier. In France there is a legal right to a basic bank account.",
    sources: ["bankAccountRight"],
  },

  // ── Stage 4: Settling into Bordeaux ──
  {
    id: "health_insurance",
    group: 4,
    doFirst: true,
    title: "Register for French health insurance",
    summary: "Through Ameli's service for foreign students.",
    appliesTo: (s) => s.visaNeeded !== "no",
    why: "Registering lets you get part of your healthcare costs reimbursed. Ameli decides who is eligible.",
    sources: ["ameliStudents"],
  },
  {
    id: "ehic",
    group: 4,
    doFirst: true,
    title: "Check your European Health Insurance Card covers you",
    summary: "For EU, EEA and Swiss students.",
    appliesTo: (s) => s.visaNeeded === "no",
    why: "Students from the EU, EEA or Switzerland may be covered by their European Health Insurance Card. Check what applies to you.",
    sources: ["ameliEhic"],
  },
  {
    id: "caf",
    group: 4,
    doFirst: true,
    title: "Check whether you may be eligible for CAF housing aid",
    summary:
      "CAF (Caisse d'allocations familiales) can help with rent. CAF decides.",
    appliesTo: (s) => s.accommodation === "secured",
    why: "If you're eligible, housing aid can reduce part of your rent. CAF usually asks about your housing, so this comes once your housing is secured.",
    sources: ["caf"],
  },
  {
    id: "open_bank_account",
    group: 4,
    title: "Open a bank account, if you haven't yet",
    summary: "Many services ask for French bank details (a RIB).",
    why: "A RIB (relevé d'identité bancaire) is the document with your French bank details. CAF and landlords often ask for it.",
    sources: ["bankAccountRight"],
  },
  {
    id: "transport_pass",
    group: 4,
    title: "Get a local transport pass",
    summary: "TBM runs buses and trams in Bordeaux.",
    why: "A pass can be cheaper than single tickets if you travel often.",
    sources: ["tbm"],
  },
  {
    id: "choose_doctor",
    group: 4,
    title: "Choose a doctor (médecin traitant)",
    summary: "Your regular doctor in France.",
    why: "Declaring a regular doctor can affect how much of your care is reimbursed.",
    sources: ["ameliDoctor"],
  },
  {
    id: "essentials_marketplace",
    group: 4,
    title: "Find essentials through the student marketplace",
    summary: "Sample listings, for demonstration.",
    why: "Second-hand furniture and kitchen items can save money. The marketplace is an idea we're testing.",
    sources: [],
  },

  // ── Stage 5: Settled and connected ──
  {
    id: "student_association",
    group: 5,
    title: "Join a student association",
    summary: "Clubs, sport and international student groups.",
    why: "A good way to meet people and feel at home.",
    sources: ["studentLife"],
  },
  {
    id: "language_exchange",
    group: 5,
    title: "Try a language exchange",
    summary: "Practise French without pressure.",
    why: "Speaking French day to day makes life in Bordeaux easier.",
    sources: ["languageCentre"],
  },
  {
    id: "pass_on_items",
    group: 5,
    title: "Give, swap or pass on items",
    summary: "Help the next students. Sample marketplace, for demonstration.",
    why: "Passing things on helps new students settle.",
    sources: [],
  },
  {
    id: "renewal_reminders",
    group: 5,
    title: "Set reminders for renewals",
    summary:
      "Residence permit (if you have one), CAF yearly update, contracts.",
    why: "Some documents and benefits must be renewed or updated each year. The official organisations set the dates.",
    sources: ["anef", "caf"],
  },
  {
    id: "emergency_numbers",
    group: 5,
    title: "Save the emergency numbers",
    summary: "112, 15 (medical), 17 (police), 18 (fire).",
    why: "They're free from any phone in France.",
    sources: ["emergencyNumbers"],
  },
];

export const milestones: Milestone[] = [
  {
    id: "visa_applied",
    group: 1,
    question: "Have you submitted your visa application?",
    appliesTo: (s) => needsVisa(s) && s.visaStatus === "not_started",
    apply: (s) => ({ ...s, visaStatus: "applied" }),
  },
  {
    id: "visa_received",
    group: 1,
    question: "Have you received your visa?",
    advancesStage: true,
    appliesTo: (s) => needsVisa(s) && s.visaStatus !== "received",
    apply: (s) => ({ ...s, visaStatus: "received" }),
  },
  {
    id: "journey_booked",
    group: 2,
    question: "Have you booked your journey?",
    appliesTo: (s) => !s.travelBooked,
    apply: (s) => ({ ...s, travelBooked: true }),
  },
  {
    id: "arrived_france",
    group: 2,
    question: "Have you arrived in France?",
    appliesTo: (s) => s.location === "outside_france",
    apply: (s) => ({ ...s, location: "in_france" }),
  },
  {
    id: "arrived_bordeaux",
    group: 2,
    question: "Have you arrived in Bordeaux?",
    advancesStage: true,
    appliesTo: (s) => s.location !== "in_bordeaux",
    apply: (s) => ({
      ...s,
      location: "in_bordeaux",
      travelBooked: true,
      firstDaysDone: false,
    }),
  },
  {
    id: "first_days_done",
    group: 3,
    question: "Are your first days in Bordeaux done?",
    advancesStage: true,
    appliesTo: (s) => s.location === "in_bordeaux" && !s.firstDaysDone,
    apply: (s) => ({ ...s, firstDaysDone: true }),
  },
  {
    id: "feel_settled",
    group: 4,
    question: "Do you feel settled in Bordeaux?",
    advancesStage: true,
    appliesTo: (s) => s.location === "in_bordeaux" && !s.settled,
    apply: (s) => ({ ...s, settled: true }),
  },
  {
    id: "accommodation_temporary",
    group: "housing",
    question: "Do you have a temporary place to stay?",
    appliesTo: (s) => s.accommodation === "none",
    apply: (s) => ({ ...s, accommodation: "temporary" }),
  },
  {
    id: "accommodation_secured",
    group: "housing",
    question: "Have you secured a place to live?",
    appliesTo: (s) => s.accommodation !== "secured",
    apply: (s) => ({ ...s, accommodation: "secured" }),
  },
];
