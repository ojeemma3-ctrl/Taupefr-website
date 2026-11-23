"use client";
import { useEffect, useState } from "react";
import {
  ConfirmMilestone,
  Dashboard,
  stageLabel,
} from "./components/Dashboard.tsx";
import { Assistant } from "./components/Assistant.tsx";
import { Profile } from "./components/Profile.tsx";
import { TaskGuide } from "./components/TaskGuide.tsx";
import { Button, Heading } from "./components/ui.tsx";
import { sampleStudents } from "./content/sample-students.ts";
import { tasks, type MilestoneId } from "./content/tasks.ts";
import type { Situation } from "./lib/situation.ts";
import {
  buildPlan,
  confirmMilestone,
  getStage,
  type Plan,
} from "./lib/stage-engine.ts";
import { parseSaved, save, useSavedRaw } from "./lib/storage.ts";
type View =
  | "welcome"
  | "profile"
  | "dashboard"
  | "housing"
  | "found"
  | "market"
  | "community"
  | "settled";
const housingPlatforms = [
  {
    name: "CROUS housing",
    copy: "Public student residences. Check the application dates and whether you can apply from abroad.",
    url: "https://trouverunlogement.lescrous.fr",
  },
  {
    name: "Studapart",
    copy: "A private platform for student rentals. Read its terms and fees before you commit.",
    url: "https://www.studapart.com",
  },
  {
    name: "Other platforms",
    copy: "Private landlords, agencies and shared-housing sites. Compare carefully and never pay before signing a lease.",
    url: "",
  },
];
function Logo() {
  return (
    <div className="logo">
      <span>τ</span>
      <b>Taupe</b>
      <i>FR</i>
    </div>
  );
}
export default function Home() {
  const [view, setView] = useState<View>("welcome"),
    [situation, setSituation] = useState<Situation | null>(null),
    [profileMode, setProfileMode] = useState<"new" | "update">("new"),
    [done, setDone] = useState<string[]>([]),
    [demo, setDemo] = useState(false),
    [demoStage, setDemoStage] = useState(0),
    [asking, setAsking] = useState<MilestoneId | null>(null),
    [notice, setNotice] = useState<string | null>(null),
    [guideId, setGuideId] = useState<string | null>(null);
  const nav = (v: View) => setView(v);
  const saved = parseSaved(useSavedRaw());
  // Keep the profile and progress in this browser (see app/lib/storage.ts).
  useEffect(() => {
    if (situation) save({ situation, done });
  }, [situation, done]);
  const plan: Plan | null = situation
    ? buildPlan(situation, new Set(done))
    : null;
  const guide = tasks.find((t) => t.id === guideId) ?? null;
  // What's next: the task after this one on the plan, else the first other one.
  const others = plan?.priorities ?? [];
  const at = others.findIndex((t) => t.id === guideId);
  const guideNext =
    others.slice(at + 1).find((t) => t.id !== guideId) ??
    others.find((t) => t.id !== guideId) ??
    null;
  const toggleDone = (id: string) =>
    setDone((d) => (d.includes(id) ? d.filter((x) => x !== id) : [...d, id]));
  // Milestones always ask first. Yes updates the situation and the engine
  // re-runs; "Not yet" changes nothing (docs/PRODUCT_PLAN.md §5).
  const answer = (yes: boolean) => {
    const id = asking;
    setAsking(null);
    if (!id || !situation) return;
    const before = getStage(situation);
    if (!yes) {
      setNotice(`No change. You’re still in ${stageLabel(before)}.`);
      return;
    }
    const next = confirmMilestone(situation, id);
    setSituation(next);
    const after = getStage(next);
    if (id === "accommodation_secured" && view === "housing") {
      setNotice(null);
      nav("found");
      return;
    }
    if (id === "feel_settled" && view === "community") {
      setNotice(null);
      nav("settled");
      return;
    }
    setNotice(
      after !== before
        ? `Your plan has moved on. You’re now in ${stageLabel(after)}.`
        : "Thanks. Your plan has been updated.",
    );
  };
  const startProfile = (mode: "new" | "update") => {
    setProfileMode(mode);
    setView("profile");
  };
  const flow: View[] = [
    "welcome",
    "profile",
    "dashboard",
    "housing",
    "found",
    "dashboard",
    "market",
    "community",
    "settled",
  ];
  const moveDemo = (delta: number) => {
    const n = Math.max(0, Math.min(flow.length - 1, demoStage + delta));
    setDemoStage(n);
    if (flow[n] === "profile") setProfileMode("new");
    // The old click-through demo needs a situation past the profile step.
    // Sample data, for demonstration (replaced by demo mode in PR 8).
    if (n > 1 && !situation) setSituation(sampleStudents[0].situation);
    setView(flow[n]);
  };
  if (view === "welcome")
    return (
      <main className="welcome">
        <nav>
          <Logo />
        </nav>
        <section className="hero">
          <p className="eyebrow">
            For international students moving to Bordeaux
          </p>
          <h1>
            Welcome to France,
            <br />
            <em>before you arrive.</em>
          </h1>
          <p className="lede">
            TaupeFR helps international students see what matters now, what to
            do next and where to do it, from preparing to move to settling into
            life in Bordeaux.
          </p>
          <p className="scope-note">
            TaupeFR is an independent guide and a prototype. It links to
            official services and housing platforms; it doesn&rsquo;t replace
            them or promise any outcome.
          </p>
          <div className="actions">
            {saved && !situation ? (
              <Button
                onClick={() => {
                  setSituation(saved.situation);
                  setDone(saved.done);
                  nav("dashboard");
                }}
              >
                Continue
                {saved.situation.name ? ` as ${saved.situation.name}` : ""}
              </Button>
            ) : null}
            <Button
              quiet={Boolean(saved && !situation)}
              onClick={() => startProfile("new")}
            >
              {saved && !situation ? "Start again" : "Start your journey"}
            </Button>
            <Button
              quiet
              onClick={() => {
                setDemo(true);
                moveDemo(1);
              }}
            >
              View student journey
            </Button>
          </div>
        </section>
        <div className="skyline">
          <div className="river" />
          <div className="building a" />
          <div className="building b" />
          <div className="building c" />
          <i className="pin p1">⌖</i>
          <i className="pin p2">⌖</i>
          <small>Your next chapter starts here</small>
        </div>
      </main>
    );
  if (view === "profile")
    return (
      <>
        <Profile
          key={profileMode}
          initial={profileMode === "update" ? situation : null}
          mode={profileMode}
          logo={<Logo />}
          onDone={(next) => {
            if (profileMode === "new") setDone([]);
            setSituation(next);
            setNotice(
              profileMode === "update"
                ? `Situation saved. You’re in ${stageLabel(getStage(next))}.`
                : null,
            );
            nav("dashboard");
          }}
          onCancel={() =>
            nav(profileMode === "update" ? "dashboard" : "welcome")
          }
        />
        {demo && (
          <DemoControls
            stage={demoStage}
            move={moveDemo}
            onExit={() => setDemo(false)}
          />
        )}
      </>
    );
  if (view === "found")
    return (
      <>
        <Celebrate
          home
          onNext={() => {
            setSituation((x) => (x ? { ...x, accommodation: "secured" } : x));
            nav("dashboard");
          }}
        />
        {demo && (
          <DemoControls
            stage={demoStage}
            move={moveDemo}
            onExit={() => setDemo(false)}
          />
        )}
      </>
    );
  if (view === "settled")
    return (
      <>
        <Celebrate onNext={() => nav("dashboard")} />
        {demo && (
          <DemoControls
            stage={demoStage}
            move={moveDemo}
            onExit={() => setDemo(false)}
          />
        )}
      </>
    );
  return (
    <>
      <Shell view={view} nav={nav} plan={plan} name={situation?.name}>
        {notice && view === "dashboard" && (
          <p className="notice" role="status">
            {notice}
            <button className="plain" onClick={() => setNotice(null)}>
              Close
            </button>
          </p>
        )}
        {view === "dashboard" && situation && plan && (
          <Dashboard
            situation={situation}
            plan={plan}
            onUpdate={() => startProfile("update")}
            onToggleDone={toggleDone}
            onAsk={setAsking}
            onGuide={setGuideId}
          />
        )}{" "}
        {view === "housing" && (
          <Housing
            secured={situation?.accommodation === "secured"}
            onSecured={() => setAsking("accommodation_secured")}
          />
        )}{" "}
        {view === "market" && <Market nav={nav} />}{" "}
        {view === "community" && (
          <Community
            canConfirmSettled={Boolean(
              situation?.location === "in_bordeaux" && !situation.settled,
            )}
            onSettled={() => setAsking("feel_settled")}
          />
        )}
      </Shell>
      <Assistant situation={situation} plan={plan} done={done} />
      {guide && situation && (
        <TaskGuide
          key={guide.id}
          task={guide}
          situation={situation}
          next={guideNext}
          onClose={() => setGuideId(null)}
          onDone={(id) => {
            toggleDone(id);
            setGuideId(null);
          }}
          onAsk={(id) => {
            setGuideId(null);
            setAsking(id);
          }}
          onOpenNext={setGuideId}
          onOpenPlace={(p) => {
            setGuideId(null);
            nav(p);
          }}
        />
      )}
      {asking && (
        <ConfirmMilestone
          id={asking}
          onYes={() => answer(true)}
          onNo={() => answer(false)}
        />
      )}
      {demo && (
        <DemoControls
          stage={demoStage}
          move={moveDemo}
          onExit={() => setDemo(false)}
        />
      )}
    </>
  );
}
function DemoControls({
  stage,
  move,
  onExit,
}: {
  stage: number;
  move: (delta: number) => void;
  onExit: () => void;
}) {
  const names = [
    "Welcome",
    "Student profile",
    "Personal plan",
    "Housing",
    "Housing secured",
    "Updated plan",
    "Marketplace",
    "Community",
    "Settled",
  ];
  return (
    <div className="demo-controls">
      <span>
        Student journey · {stage + 1}/{names.length} · {names[stage]}
      </span>
      <div>
        <button onClick={() => move(-1)} disabled={!stage}>
          ← Previous
        </button>
        <button onClick={onExit}>Exit</button>
        <button onClick={() => move(1)} disabled={stage === names.length - 1}>
          Next →
        </button>
      </div>
    </div>
  );
}
function Shell({
  view,
  nav,
  plan,
  name,
  children,
}: {
  view: View;
  nav: (v: View) => void;
  plan: Plan | null;
  name?: string;
  children: React.ReactNode;
}) {
  // No menu of stages or sections: everything starts from the plan, and
  // other screens are reached from the task that needs them.
  return (
    <main className="app">
      <aside>
        <Logo />
        <b className="name">
          {name ? `Hi ${name}` : "Hi there"}
          <small>Prototype · saved in this browser</small>
        </b>
        <nav>
          <button
            onClick={() => nav("dashboard")}
            className={view === "dashboard" ? "active" : ""}
          >
            <span>⌂</span>
            {view === "dashboard" ? "My plan" : "Back to my plan"}
          </button>
        </nav>
        {plan && plan.stage !== 0 && (
          <div className="mini">
            <small>Stage {plan.stage} of 5</small>
            <b>
              {plan.progress.done} of {plan.progress.total} done
            </b>
          </div>
        )}
        <button
          className="help"
          onClick={() =>
            window.dispatchEvent(
              new CustomEvent("taupe-context", { detail: {} }),
            )
          }
        >
          ? Need help?
        </button>
      </aside>
      <section className="content">{children}</section>
    </main>
  );
}
function Housing({
  secured,
  onSecured,
}: {
  secured: boolean;
  onSecured: () => void;
}) {
  return (
    <>
      <Heading
        stage="Housing"
        title="Let’s find your home."
        copy="Housing is offered by CROUS and other platforms. TaupeFR helps you search safely; it doesn’t list, check or rent homes."
      />
      <section className="housing-guide">
        <div className="alert">
          <b>⚠ Avoid housing scams</b>
          <span>
            Be careful with any offer that asks for money before you have seen
            the place (or someone you trust has) and signed a lease. Be wary of
            prices far below the area, pressure to decide fast, or requests to
            pay by money transfer.
          </span>
        </div>
        <p className="sample-label">
          Where students often search · links to be checked
        </p>
        <div className="housing-options">
          {housingPlatforms.map((h) => (
            <article key={h.name}>
              <h3>{h.name}</h3>
              <p>{h.copy}</p>
              {h.url && (
                <a href={h.url} target="_blank" rel="noreferrer">
                  Open {h.name} ↗
                </a>
              )}
              <small>Last checked: to be confirmed</small>
            </article>
          ))}
        </div>
        <div className="landlord-docs">
          <p className="eyebrow">What landlords usually ask for</p>
          <p>
            Often: an ID document, proof of studies, proof of income or funds,
            and a guarantor. Requirements vary between landlords and platforms.
            Guarantor schemes such as Visale exist; check whether you are
            eligible on the official site.
          </p>
        </div>
        {!secured && (
          <button onClick={onSecured} className="wide button">
            I’ve secured a place <span>→</span>
          </button>
        )}
      </section>
    </>
  );
}
function Market({ nav }: { nav: (v: View) => void }) {
  const [saved, setSaved] = useState<string[]>([]);
  const goods = [
    ["Desk & chair", "€35", "Talence", "▤"],
    ["Kitchen starter kit", "€18", "Bordeaux", "♨"],
    ["City bike", "€75", "Pessac", "♢"],
    ["French textbooks", "Free", "Victoire", "▥"],
  ];
  return (
    <>
      <Heading
        stage="Marketplace"
        title="Settle into your new home."
        copy="An idea we’re testing: students passing on useful things to the next students."
      />
      <p className="sample-label">
        Sample listings, for demonstration. These items aren’t real.
      </p>
      <section className="goods">
        {goods.map(([n, p, l, i]) => (
          <article key={n}>
            <div>{i}</div>
            <small>{l}</small>
            <h3>{n}</h3>
            <b>{p}</b>
            <button
              onClick={() => setSaved((x) => (x.includes(n) ? x : [...x, n]))}
            >
              {saved.includes(n) ? "Saved ✓" : "Save item"}
            </button>
          </article>
        ))}
      </section>
      <section className="banner exchange">
        <b>↔</b>
        <div>
          <p className="eyebrow">Not just buying</p>
          <h2>
            Give, swap and help
            <br />
            the next student.
          </h2>
        </div>
        <button onClick={() => nav("community")}>
          Explore the community →
        </button>
      </section>
    </>
  );
}
function Community({
  canConfirmSettled,
  onSettled,
}: {
  canConfirmSettled: boolean;
  onSettled: () => void;
}) {
  const cards = [
    [
      "⌁",
      "Student groups",
      "Course, campus and language groups, often run by students or student associations.",
    ],
    [
      "◌",
      "Local events",
      "Meet people over coffee, sport and shared discoveries.",
    ],
    ["A", "Language exchange", "Practise French without pressure."],
    ["⌂", "University communities", "Know where to turn on campus."],
  ];
  return (
    <>
      <Heading
        stage="Community"
        title="You’re not alone."
        copy="Ideas for finding your people in Bordeaux."
      />
      <section className="feature">
        <div>
          <p className="eyebrow">Idea we’re exploring</p>
          <h2>Student ambassadors.</h2>
          <p>
            We’d like to connect you with students who’ve made the same move.
            This doesn’t exist yet.
          </p>
        </div>
      </section>
      <p className="sample-label">Sample ideas, for demonstration.</p>
      <section className="community">
        {cards.map(([i, n, c]) => (
          <article key={n}>
            <span>{i}</span>
            <b>{n}</b>
            <p>{c}</p>
          </article>
        ))}
        <article className="emergency">
          <span>+</span>
          <b>Emergency numbers in France</b>
          <p>
            112 (any emergency), 15 (medical), 17 (police), 18 (fire). Free from
            any phone.
          </p>
        </article>
      </section>
      {canConfirmSettled && (
        <section className="banner">
          <div>
            <p className="eyebrow">When you feel settled</p>
            <h2>You’re ready to feel at home.</h2>
          </div>
          <Button onClick={onSettled}>I feel settled</Button>
        </section>
      )}
    </>
  );
}
function Celebrate({
  home = false,
  onNext,
}: {
  home?: boolean;
  onNext: () => void;
}) {
  return (
    <main className="celebrate">
      <Logo />
      <div className="spark">✦　·　✧　·　✦</div>
      <b className="badge">{home ? "⌂" : "✦"}</b>
      <p className="eyebrow">
        {home ? "Housing secured" : "You’ve worked through the main steps"}
      </p>
      <h1>{home ? "Your housing is sorted." : "Welcome to Bordeaux."}</h1>
      <p className="lede">
        {home
          ? "Your plan has been updated. Housing guidance steps back, and your next tasks move up."
          : "Keep TaupeFR handy for renewals, new questions and links to the official services."}
      </p>
      <Button onClick={onNext}>Back to my plan</Button>
    </main>
  );
}
