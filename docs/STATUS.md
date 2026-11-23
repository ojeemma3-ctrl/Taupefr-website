# Status

Last updated: 23 Nov 2026.

## Where things are

- The plan and the readiness answers are approved by Emmanuel (23 Nov 2026).
- The live prototype (taupefr.ojeemma3.workers.dev) still runs the old one-page build from `main` at commit 857bdfb.
- How the live site is published is not settled. Emmanuel is checking. Don't deploy.
  - The workers.dev site appears to be published from Codex / OpenAI Sites (`.openai/hosting.json`). Nothing in the repo deploys on merge.
  - A Netlify project called "taupefr" is connected to this GitHub repo outside the repo: it built a deploy preview for PR #1 automatically (23 Nov 2026). Merging to `main` may also trigger a Netlify production deploy (taupefr.netlify.app). To confirm in Netlify's settings.

## Pull request plan

Each PR is small, leaves the site working, and waits for Emmanuel's OK (with screenshots) before the next starts.

| # | Pull request | Status |
|---|---|---|
| 1 | Docs: brief, plan, handover pack, CLAUDE.md, STATUS.md, DECISIONS.md | In review |
| 2 | Honesty cleanup on today's screens, plus type and lint errors | Not started |
| 3 | Stage engine and content (situation, engine, tasks, sources) with tests | Not started |
| 4 | New profile (6 questions) and "Update my situation" | Not started |
| 5 | New dashboard (stage card, housing block, prioritised tasks, progress, Done list, milestone confirmation) | Not started |
| 6 | One reusable task guide pattern; Housing, Marketplace and Community reached from tasks | Not started |
| 7 | Context-aware Taupe Assistant, clearly labelled as a prototype | Not started |
| 8 | Demo mode with six sample students | Not started |

## Known issues in the current code (commit 857bdfb)

- No Arrival screen; the profile can't be edited after sign-up.
- Dead buttons, `alert()` pop-ups, "verified" housing labels, made-up numbers (readiness %, "+ 48 students", "12 verified matches"), unlabelled sample data, address "unlocks" wording, hardcoded "Emmanuel" and "University of Bordeaux". The full list with line numbers is in the readiness answers doc and is PR 2's scope.
- 5 TypeScript errors and 8 lint errors in `app/page.tsx`.
- No automated tests.
- `npm ci` reports 26 dependency vulnerabilities (build and dev tools). Out of scope unless Emmanuel asks.

## Waiting on Emmanuel

- Confirming every official link and its "last checked" date (all show "Last checked: to be confirmed" until then).
- Deciding how the redesigned version is published, and whether to keep the Netlify adapter.
