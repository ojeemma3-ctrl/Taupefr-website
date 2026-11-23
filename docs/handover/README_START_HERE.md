# TaupeFR — Claude Handover Pack

## What this pack contains

This handover captures the **original TaupeFR MVP direction before the latest supervisor-requested stage-based dashboard redesign**.

It is intended to help continue the existing prototype in Claude without losing the product's original purpose, scope, user journey, design direction, or business decisions.

### Files

1. `PROJECT_BASELINE.md` — original product concept, audience, value proposition and scope.
2. `ORIGINAL_MVP_BUILD_PROMPT.md` — reconstructed master prompt for the original interactive MVP.
3. `REFINEMENT_PROMPTS.md` — five refinement prompts covering administration, guides, journey personalisation, Taupe Assistant and jury/demo readiness.
4. `SCREEN_AND_USER_FLOW.md` — original screen map and user journey.
5. `PRODUCT_AND_BUSINESS_RULES.md` — important product boundaries and business model decisions.
6. `DESIGN_AND_INTERACTION_GUIDE.md` — original visual and interaction direction.
7. `TECHNICAL_MVP_NOTES.md` — prototype architecture and honest implementation limits.
8. `LATER_SUPERVISOR_FEEDBACK_NOT_IN_BASELINE.md` — separate record of the later stage-based / hybrid progression feedback. This is intentionally NOT merged into the original baseline.

## Provenance and accuracy note

This pack is a **handover reconstruction from the recoverable TaupeFR project history**, not a source-code export.

The project history confirms the original master prompt title, core screens, journey, brand line and five refinement topics. The complete verbatim master prompt and all five verbatim refinement prompts were not all available in the retrieved archive. Therefore:
- The master prompt below is reconstructed to preserve the recovered original requirements.
- The five refinement prompts are usable, carefully reconstructed prompts, not falsely labelled as verbatim historical copies.
- No TaupeFR-specific original `.md` source files were found in the accessible Library search. These Markdown files have been created now as a portable handover pack.
- The exact existing application source code, component names, package versions and repository structure have not been exported here.

## How to continue in Claude

1. Open the **existing TaupeFR project/repository** in Claude.
2. Add this Markdown pack to the project knowledge or upload the files.
3. Start with `README_START_HERE.md` and `PROJECT_BASELINE.md`.
4. Ask Claude to inspect the existing codebase before changing anything.
5. Do not ask Claude to rebuild the product from scratch.
6. Keep the original baseline separate from the supervisor feedback file until you deliberately implement the redesign.

### Recommended first message to Claude

> I am continuing an existing project called TaupeFR. Read all the supplied Markdown files, especially the original MVP baseline, screen map, product rules and technical notes. These documents describe the product before the latest supervisor-requested redesign. First inspect the actual repository and explain its current structure, routes, components, state management and working interactions. Compare the repository with the baseline and report what is already implemented, incomplete or different. Do not edit or rebuild anything yet. Do not implement the later supervisor feedback until I explicitly ask. Preserve the existing brand, working functionality and project structure.
