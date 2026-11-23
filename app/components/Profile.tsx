// The situation questions (docs/PRODUCT_PLAN.md §4 and docs/DECISIONS.md).
// Used for the first sign-up and for "Update my situation".

import { useState } from "react";
import { emptySituation, type Situation } from "../lib/situation.ts";

type Choice = { label: string; value: string | boolean };
type Question = {
  id: string;
  field: keyof Situation;
  title: string;
  help?: string;
  show: (d: Situation) => boolean;
  options: Choice[];
};

const questions: Question[] = [
  {
    id: "location",
    field: "location",
    title: "Where are you right now?",
    show: () => true,
    options: [
      { label: "Outside France", value: "outside_france" },
      { label: "In France, but not in Bordeaux yet", value: "in_france" },
      { label: "In Bordeaux", value: "in_bordeaux" },
    ],
  },
  {
    id: "bordeaux_time",
    field: "firstDaysDone",
    title: "How long have you been in Bordeaux?",
    show: (d) => d.location === "in_bordeaux",
    options: [
      { label: "Just arrived (first few weeks)", value: false },
      { label: "I’ve been here a while", value: true },
    ],
  },
  {
    id: "admission",
    field: "admission",
    title: "Have you been accepted by a school or university in Bordeaux?",
    show: () => true,
    options: [
      { label: "Yes, I’ve been accepted", value: "accepted" },
      { label: "Not yet, I’m still applying", value: "applying" },
    ],
  },
  {
    id: "visa_needed",
    field: "visaNeeded",
    title: "Do you need a visa to study in France?",
    help: "It depends on your nationality. If you’re not sure, TaupeFR will show you where to check.",
    show: (d) => d.admission === "accepted",
    options: [
      { label: "Yes", value: "yes" },
      { label: "No (for example EU, EEA or Swiss citizens)", value: "no" },
      { label: "I’m not sure", value: "not_sure" },
    ],
  },
  {
    id: "visa_status",
    field: "visaStatus",
    title: "Where are you with your visa?",
    show: (d) => d.admission === "accepted" && d.visaNeeded === "yes",
    options: [
      { label: "I haven’t started", value: "not_started" },
      { label: "I’ve applied and I’m waiting", value: "applied" },
      { label: "I have my visa", value: "received" },
    ],
  },
  {
    id: "travel",
    field: "travelBooked",
    title: "Have you booked your journey to Bordeaux?",
    show: (d) => d.admission === "accepted" && d.location !== "in_bordeaux",
    options: [
      { label: "Yes", value: true },
      { label: "Not yet", value: false },
    ],
  },
  {
    id: "accommodation",
    field: "accommodation",
    title: "What’s your housing situation in Bordeaux?",
    show: (d) => d.admission === "accepted",
    options: [
      { label: "I don’t have a place yet", value: "none" },
      {
        label: "I have a temporary place (friend, hostel or short stay)",
        value: "temporary",
      },
      {
        label: "I have a place secured (signed or confirmed)",
        value: "secured",
      },
    ],
  },
];

// Only in "Update my situation": never asked at sign-up (docs/DECISIONS.md).
const settledQuestion: Question = {
  id: "settled",
  field: "settled",
  title: "Do you feel settled in Bordeaux?",
  show: (d) =>
    d.admission === "accepted" &&
    d.location === "in_bordeaux" &&
    d.firstDaysDone,
  options: [
    { label: "Yes, I feel settled", value: true },
    { label: "Not yet", value: false },
  ],
};

export function Profile({
  initial,
  mode,
  onDone,
  onCancel,
  logo,
}: {
  initial: Situation | null;
  mode: "new" | "update";
  onDone: (s: Situation) => void;
  onCancel: () => void;
  logo: React.ReactNode;
}) {
  const [draft, setDraft] = useState<Situation>(initial ?? emptySituation);
  // Which questions the student has answered on this run (so nothing is pre-picked at sign-up).
  const [answered, setAnswered] = useState<Set<string>>(
    () =>
      new Set(
        mode === "update"
          ? [...questions, settledQuestion].map((q) => q.id)
          : [],
      ),
  );
  const [name, setName] = useState(initial?.name ?? "");
  const [step, setStep] = useState(0);

  const all = mode === "update" ? [...questions, settledQuestion] : questions;
  const visible = all.filter((q) => q.show(draft));
  // Step 0 is the optional name; then one step per visible question.
  const total = visible.length + 1;
  const index = Math.min(step, total - 1);
  const q = index === 0 ? null : visible[index - 1];
  const isLast = index === total - 1;

  const finish = () => {
    const trimmed = name.trim();
    const result: Situation = { ...draft, name: trimmed || undefined };
    // Facts that don't apply to the answers given are reset, so the engine
    // never acts on a stale answer.
    if (result.location !== "in_bordeaux") {
      result.firstDaysDone = false;
      result.settled = false;
    }
    if (result.visaNeeded !== "yes") result.visaStatus = "not_started";
    if (result.location === "in_bordeaux") result.travelBooked = true;
    onDone(result);
  };
  const next = () => (isLast ? finish() : setStep(index + 1));
  const back = () => (index === 0 ? onCancel() : setStep(index - 1));

  const pick = (question: Question, value: string | boolean) => {
    setDraft((d) => ({ ...d, [question.field]: value }));
    setAnswered((a) => new Set(a).add(question.id));
  };
  const selected = (question: Question, value: string | boolean) =>
    answered.has(question.id) && draft[question.field] === value;

  return (
    <main className="onboard">
      <header>
        {logo}
        <b>
          Step {index + 1} of {total}
        </b>
        <div className="bar">
          <i style={{ width: `${((index + 1) / total) * 100}%` }} />
        </div>
      </header>
      <section>
        <p className="eyebrow">
          {mode === "update"
            ? "Update my situation"
            : "Let’s make this personal"}
        </p>
        {q === null ? (
          <>
            <h1>What should we call you?</h1>
            <p>
              Optional. It’s only used to greet you, and stays in this browser.
            </p>
            <input
              className="name-input"
              value={name}
              maxLength={40}
              onChange={(e) => setName(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && next()}
              placeholder="Your first name"
              aria-label="Your first name (optional)"
            />
          </>
        ) : (
          <>
            <h1>{q.title}</h1>
            <p>
              {q.help ??
                "Choose the option that best fits your situation. You can change it later."}
            </p>
            <div className="choices">
              {q.options.map((o) => (
                <button
                  onClick={() => pick(q, o.value)}
                  className={selected(q, o.value) ? "selected" : ""}
                  key={o.label}
                >
                  {selected(q, o.value) ? "✓" : "○"} <span>{o.label}</span>
                </button>
              ))}
            </div>
          </>
        )}
        <footer>
          <button className="plain" onClick={back}>
            {index === 0 && mode === "update" ? "Cancel" : "← Back"}
          </button>
          <button disabled={q !== null && !answered.has(q.id)} onClick={next}>
            {q === null && !name.trim()
              ? "Skip →"
              : isLast
                ? mode === "update"
                  ? "Save →"
                  : "See my plan →"
                : "Continue →"}
          </button>
        </footer>
      </section>
    </main>
  );
}
