# TaupeFR: notes for Claude

TaupeFR is a frontend-only prototype of a guidance tool for international students moving to Bordeaux ("Your Home. Your Start. Your France."). It shows a student their current stage, what matters now, what to do next and where to do it, with links to the real services. Owner: Emmanuel.

## Read first

1. `docs/PRODUCT_PLAN.md`: the product plan and the stage engine (source of truth for the redesign).
2. `docs/REDESIGN_BRIEF.md`: the supervisor's correction. If it conflicts with the plan, ask Emmanuel before building.
3. `docs/DECISIONS.md`: decisions already made. Don't reopen them.
4. `docs/STATUS.md`: where the work is and what's next.
5. `docs/handover/`: the original MVP baseline from before the redesign (background only).

## Hard rules

- **Never deploy.** Don't run any publish or deploy command.
- **Don't touch hosting or deploy config**: `.openai/hosting.json`, `vite.config.ts` plugins (`nitro`, `sites`, Cloudflare), `wrangler`, Netlify settings. Emmanuel decides this separately.
- **Don't rebuild from scratch.** Inspect the existing code first and keep the existing look, brand and working features.
- **One small pull request at a time**, in the order in `docs/STATUS.md`. Send Emmanuel the summary with screenshots and wait for his OK before starting the next one.
- Develop on the branch named for the session; never push to `main`.

## Honesty rules (every screen)

- No "verified" labels, fake numbers, fake users, reviews, partners or events.
- No implied link with the University of Bordeaux or any other organisation.
- Label all sample content "Sample, for demonstration".
- No buttons that do nothing and no `alert()` pop-ups.
- Never say an address "unlocks" other steps or is always required. Use: "Sort housing early. Many later steps ask for an address; some accept a temporary one. Check the official source."
- Hedge requirements that depend on nationality, visa or situation, and say the official organisation decides.
- Every official link lives in `app/content/sources.ts` and shows "Last checked: to be confirmed" until Emmanuel confirms the link and date himself. Don't invent dates.
- The Taupe Assistant is a simulation and must say it's a prototype.
- Plain English; explain French terms (CAF, CROUS, RIB, VLS-TS, CVEC) once.

## Stage engine (summary, details in the plan)

- **Situation sets the stage.** Location plus confirmed milestones only. Task completion and housing never set the stage.
- **Tasks set priorities inside the stage**: housing overlay, then "do first" tasks, then the rest. Tasks that don't apply are hidden. Progress counts this stage only.
- **Housing is an overlay**: strong block when there's no accommodation, softer block when temporary, gone when secured. It changes priorities, never the stage.
- **Routine tasks** are marked done directly. **Milestones** always ask a confirmation question; "no" changes nothing.
- "Update my situation" is always reachable from the dashboard.
- The five stages are internal logic, not pages or a menu. The student sees only their current stage.

## Commands

Node 22 or newer.

```bash
npm ci          # install
npm run dev     # local dev server (vinext / Vite)
npm run build   # production build (doesn't type-check)
npx tsc --noEmit  # type check
npx eslint app  # lint the app code (whole-repo lint also scans generated .output/)
```

There are no automated tests yet. The plan is Node's built-in test runner for the stage engine (`npm test`), with no new dependencies.

## Layout

- `app/page.tsx`: today the whole app (about 1,800 lines, one client component).
- `app/globals.css`: all styles.
- `app/layout.tsx`: fonts and page metadata.
- Planned: `app/lib/` (situation and stage engine), `app/content/` (tasks, sources, sample students), `app/components/`.
