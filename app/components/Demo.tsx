// Demo mode for the jury: pick one of six sample students, switch between
// them, reset, and exit. Sample data, for demonstration. Demo progress is
// never saved, so a visitor's own saved plan stays untouched.

import {
  sampleStudents,
  type SampleStudent,
} from "../content/sample-students.ts";
import { buildPlan } from "../lib/stage-engine.ts";
import { stageLabel } from "./Dashboard.tsx";

const stageOf = (s: SampleStudent) =>
  stageLabel(buildPlan(s.situation, new Set(s.doneTaskIds)).stage);

export function DemoPicker({
  logo,
  onPick,
  onBack,
}: {
  logo: React.ReactNode;
  onPick: (s: SampleStudent) => void;
  onBack: () => void;
}) {
  return (
    <main className="demo-picker">
      <nav>
        {logo}
        <button className="plain" onClick={onBack}>
          ← Back
        </button>
      </nav>
      <section>
        <p className="eyebrow">Demo mode</p>
        <h1>Try a sample student.</h1>
        <p className="lede">
          Each one is in a different situation, so you can see how TaupeFR
          changes the plan. You can switch at any time.
        </p>
        <p className="sample-label">
          Sample students, for demonstration. They aren’t real people.
        </p>
        <div className="demo-students">
          {sampleStudents.map((s) => (
            <button key={s.id} onClick={() => onPick(s)}>
              <b>{s.name}</b>
              <span>{s.label}</span>
              <small>{stageOf(s)}</small>
            </button>
          ))}
        </div>
      </section>
    </main>
  );
}

export function DemoBar({
  current,
  onSwitch,
  onReset,
  onExit,
}: {
  current: SampleStudent;
  onSwitch: (s: SampleStudent) => void;
  onReset: () => void;
  onExit: () => void;
}) {
  return (
    <div className="demo-controls" role="region" aria-label="Demo mode">
      <span>Demo · sample student</span>
      <select
        value={current.id}
        aria-label="Switch sample student"
        onChange={(e) => {
          const next = sampleStudents.find((s) => s.id === e.target.value);
          if (next) onSwitch(next);
        }}
      >
        {sampleStudents.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}: {s.label}
          </option>
        ))}
      </select>
      <div>
        <button onClick={onReset}>Reset</button>
        <button onClick={onExit}>Exit demo</button>
      </div>
    </div>
  );
}
