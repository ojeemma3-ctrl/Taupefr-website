# TaupeFR — Product Plan (v2, 23 Nov 2026)

Owner: Emmanuel. Read this with docs/REDESIGN_BRIEF.md. If the two conflict, ask before building.

## 1. What TaupeFR is

A personal guidance platform for international students moving to Bordeaux.

It finds out **where the student is right now**, works out their **stage**, and shows only **what matters now, what to do next and where to do it**, with links to the existing services that actually do the job.

Central line for the product:
> "Based on where you are and your situation, here is what matters to you now, what to do next and where to do it."

### TaupeFR is NOT
- A housing provider, landlord, listing site or guarantor. It never says a home is "verified".
- A replacement for CROUS, CAF, Campus France, Ameli, ANEF/prefecture, banks or the university.
- A promise of any outcome (housing, visa, CAF, residence permit).
- Officially linked to the University of Bordeaux or any organisation, unless a real agreement exists.

## 2. Who it is for
- Main: international students with admission to a Bordeaux institution, from before departure to settled.
- First interview/test group: Nigerian students (easy to reach). Product wording stays open to all nationalities.

## 3. The stage model

Stages are internal logic. The student sees **their current stage only**, plus its tasks.

| # | Stage | Main focus | Example task topics (wording must stay hedged; link official sources) |
|---|---|---|---|
| (0) | *Later: Applying* | Admission applications, visa guidance | Not built now. Logic must allow adding it before Stage 1. |
| 1 | Preparing to come to France | **Housing first**, then documents | Find housing via existing platforms (CROUS, Studapart, others); what landlords usually ask for; guarantor options to check (e.g. Visale, check eligibility); scam awareness; visa application where it applies; budget for first months |
| 2 | Getting ready to travel | Safe arrival plan | Travel booked; where you'll stay on arrival (temporary is fine); documents to carry; first-week plan; money on arrival |
| 3 | Arriving in Bordeaux | First days | Getting to your accommodation; SIM/phone; university welcome and registration; visa validation if your visa requires it; bank account options |
| 4 | Settling into Bordeaux | Essentials | Health insurance registration; CAF if you may be eligible; long-term housing if still temporary; essentials (marketplace) |
| 5 | Settled and connected | Belonging | Community, student associations, language exchange, give/swap marketplace, reminders (renewals) |

### Rules
- The five stages are **not** five pages and **not** a menu. They are an internal progression and personalisation system. The student never navigates between stages.
- Tasks that don't apply (e.g. visa for students who don't need one) are hidden.
- A student can enter at any stage.
- Never say an address "unlocks" other steps or is always required. Say: "Sort housing early. Many later steps ask for an address; some accept a temporary one. Check the official source."

## 4. The stage engine (three separate layers)

Keep these three things separate in the logic. Mixing them is the main design mistake to avoid.

### Layer 1: Situation → main stage
The student's **location and confirmed life milestones** decide the stage. Nothing else does.
**Task completion never sets the stage. Housing never sets the stage.**

Situation is stored as facts:
- location: outside France / in France, not Bordeaux / in Bordeaux
- admission: accepted / still applying (still applying = "coming later" message for now; future Stage 0)
- visa needed: yes / no / not sure
- visa: not started / applied / received
- travel booked: yes / no
- accommodation: none / temporary / secured
- settled: yes / no (asked, never assumed)

Profile questions (about 6, from the facts above): where are you now, admission, visa needed, visa status (only if needed), travel booked, accommodation. "Settled" is asked later, not at sign-up.

Stage rules (one simple function, easy to change):
- Outside France or not in Bordeaux yet, visa not received (when needed) → **1 Preparing to come to France**
- Outside France, visa received or not needed → **2 Getting ready to travel**
- In France but not Bordeaux yet → **2 Getting ready to travel** (journey to Bordeaux)
- In Bordeaux, not yet confirmed past first days → **3 Arriving in Bordeaux**
- In Bordeaux, student confirmed first days are done → **4 Settling into Bordeaux**
- Student confirmed "I feel settled" → **5 Settled and connected**
- Not sure about visa → stay in Stage 1, with a task to check whether a visa is needed (official link).

### Layer 2: Outstanding tasks → priorities inside the stage
Within the current stage, tasks are ordered by:
1. Housing overlay (see Layer 3), if active
2. Tasks marked "do first" for this stage
3. Remaining relevant tasks
Done tasks leave the active list and go to a compact "Done" list. Progress = done ÷ relevant tasks **for this stage only**.

### Layer 3: Housing = cross-stage priority overlay
- If accommodation is **none**, housing guidance stays prominent on the dashboard **in every stage**, at the top of priorities.
- If accommodation is **temporary**, show a softer "find long-term housing" priority.
- If **secured**, the overlay disappears.
- Housing guidance = existing platforms (CROUS, Studapart, others), what landlords usually ask for, guarantor options to check, scam awareness. TaupeFR never owns, lists or verifies housing.
- The overlay changes priorities only, never the stage.

## 5. Two kinds of task (do not confuse them)

| | Routine task | Milestone (major life change) |
|---|---|---|
| Examples | Prepare housing documents, get a SIM, register for health insurance, read scam guide | Visa received, journey booked, arrived in France, arrived in Bordeaux, accommodation secured, first days done, feel settled |
| How it's completed | Student marks it done directly | Student must answer a confirmation question |
| What changes | Task status, active list, stage progress | A situation fact → engine re-runs → stage and/or housing overlay may change |
| If student says no | n/a | Nothing changes; stay in current stage |

- When the student finishes all routine tasks in a stage, the system may **suggest** the milestone ("Looks like you're ready. Have you arrived in Bordeaux?"). It never moves them on by itself.
- A routine task linked to a milestone (e.g. "Book your journey") opens the confirmation question instead of silently changing the stage.
- **Update my situation**: always reachable from the dashboard; lets the student edit any situation fact; the engine re-runs.

## 6. Screens
- Welcome: what TaupeFR does, honest scope line, Start / Try a sample student.
- Profile (6 questions).
- **Dashboard = the student's main workspace** (one screen, content changes with the engine): welcome (student's own name or "Hi there"), current stage + one-line meaning, housing priority block (only when the overlay is active), prioritised tasks, progress for this stage, relevant official links, Taupe Assistant, Update my situation. No list of all five stages; at most a small "Stage 2 of 5" label.
- Task guide (one reusable pattern): what it is, why it matters, does it apply to you, what to prepare, steps, where to do it, "Source · Last checked [date]", "the official organisation decides", what's next.
- Housing, Marketplace, Community: kept, but reached from tasks in the right stage, not a permanent menu. All sample content labelled "Sample — for demonstration".
- Taupe Assistant: simulated, but uses profile, stage, current task and done tasks. Says clearly it is a prototype.
- Demo mode: 5 sample students (one per test case) to switch between for the jury.

## 7. Trust rules (every screen)
- Official sources linked, with last-checked dates.
- No fake numbers, users, partners, reviews or "verified" labels.
- Sample data labelled.
- Plain English; explain French terms (CAF, CROUS, RIB, VLS-TS) once.
- No buttons that do nothing, no alert() pop-ups.

## 8. Business model (hypotheses — not facts)
- Free for students.
- To test: university/institution partnerships, referral deals with housing and service platforms, marketplace fees, optional premium help.
- Do not present any of these as signed or earning.

## 9. Roadmap
1. **Now:** clean up honesty issues + stage-based redesign of the prototype (for supervisor/jury and as a test tool).
2. **Validate:** 5–10 student interviews; test the stage questions and task lists with real students.
3. **Manual pilot:** short questionnaire → personal checklist by email/WhatsApp → follow-up on the next task.
4. **Then:** decide what to build for real (accounts, content updating, partners). Add Stage 0 (applying/visa) if validated.

## 10. Open questions for Emmanuel
- Republishing: the live site was published via ChatGPT Codex / OpenAI Sites on Cloudflare. Decide how to publish the redesigned version.
- Which official links and "last checked" dates to use. Each should be checked by hand before the demo.
