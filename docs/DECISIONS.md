# Decisions

Newest first. Each entry says what was decided, by whom and why. Don't reopen a decision without asking Emmanuel.

## 23 Nov 2026: redesign plan approved (Emmanuel)

**Scope and process**
- Build the stage-based redesign described in `docs/PRODUCT_PLAN.md` (v2) and `docs/REDESIGN_BRIEF.md`, inside the existing project. Don't rebuild from scratch.
- Work in 8 small pull requests, in the order in `docs/STATUS.md`. Send each summary with screenshots and wait for Emmanuel's OK before the next.
- Never deploy. Don't touch the Netlify adapter or any hosting or deploy config until Emmanuel has checked how publishing works.

**Stage rules**
- Anyone already in France but not yet in Bordeaux is in Stage 2 (Getting ready to travel), whatever their visa status.
- Students who answer "In Bordeaux" get a follow-up, "How long have you been in Bordeaux?" (Just arrived / I've been here a while), so they can start at Stage 3 or 4.
- Visa "applied" is recorded when the student confirms they've submitted their application. It doesn't change the stage.
- "Do you feel settled?" is not asked at sign-up. It's suggested once Stage 4's routine tasks are done, and is always available in "Update my situation".

**Profile**
- Six situation questions as in the plan, plus an optional first name for the "Hi [name]" welcome (otherwise "Hi there").

**Progress and housing**
- Housing tasks count toward progress only in Stage 1. In Stages 2 to 5 they sit in their own housing block and don't count.
- Remove the sample homes and the fake map. Keep housing guidance with links to the real platforms (TaupeFR never lists housing).

**Tasks**
- CVEC (student life fee) goes in Stage 2, hedged ("if it applies to you"). Emmanuel asked for Stage 1 or 2. The official site (cvec.etudiant.gouv.fr, read 23 Nov 2026) says the certificate must be shown at enrolment, payment can be made online, and it advises paying close to your actual enrolment. It also says some students are exempt but still need the certificate. That fits Stage 2 better than Stage 1. Link still needs Emmanuel to check.

**Content and links**
- Every official link lives in `app/content/sources.ts`. Each one shows "Last checked: to be confirmed" until Emmanuel confirms the link and date himself.

**Saving**
- Profile and progress are saved in the browser so a refresh keeps them. Demo mode has a "Reset" button.

**Demo mode and test students**
- Use the five test students from the brief, which cover all five stages:
  1. Admission, still outside France, needs a visa, no housing: Stage 1, strong housing block.
  2. Visa received, preparing to travel, housing secured: Stage 2, no housing block.
  3. Just arrived in Bordeaux, temporary place: Stage 3, soft housing block.
  4. In Bordeaux for a while, first days done, no accommodation: Stage 4, strong housing block at the top.
  5. Several tasks done, confirmed "I feel settled", housing secured: Stage 5, no housing block, Done list visible.
- Add a sixth demo student, "Ben": outside France, not sure whether a visa is needed, no housing (Stage 1, with "Check whether you need a visa" first).

**Docs**
- `docs/REDESIGN_BRIEF.md` and `docs/PRODUCT_PLAN.md` are committed to the repo, with the original handover pack in `docs/handover/` kept separate as background.

## Earlier (from the handover pack)

- TaupeFR is a guidance layer, not a housing provider, guarantor or replacement for official services. See `docs/handover/PRODUCT_AND_BUSINESS_RULES.md`.
- Business model ideas (partnerships, referrals, marketplace fees, premium help) are hypotheses, never presented as signed or earning.
