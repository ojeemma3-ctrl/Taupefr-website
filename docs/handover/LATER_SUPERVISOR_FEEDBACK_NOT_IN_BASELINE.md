# Later Supervisor Feedback — Separate from Original Baseline

> Important: This file records the later feedback discussed after the original MVP prompts. It is intentionally separate so that Claude can distinguish the pre-change product from the proposed redesign.

## 1. Supervisor's direction

The supervisor advised simplifying the interface into stages based on information supplied by the student.

The student should see only the stage they are currently in and the information relevant to that stage. They should not be shown every future step or every service category at once.

This supports TaupeFR's central purpose:

**Deliver personalised information at the right time, based on the student's actual situation.**

## 2. Proposed stage-based approach

A proposed five-stage model was discussed:

1. Preparing to come to France.
2. Getting ready to travel.
3. Arriving in Bordeaux.
4. Settling into Bordeaux.
5. Settled and connected.

These are proposed product stages and require validation. They are not part of the original baseline screen structure.

## 3. Chosen progression behaviour: Hybrid

The user selected a hybrid progression model.

### Routine task progress
- Ordinary task completion updates automatically.
- Completed tasks should no longer appear as active tasks.
- Completed items can remain available in a compact progress history.

### Major life changes
For important changes, TaupeFR should ask the student to confirm before moving them to another stage.

Examples:
- Confirming visa outcome.
- Confirming travel booking where relevant.
- Confirming actual arrival in Bordeaux.
- Confirming a major change in accommodation situation.

If the student confirms, reassess their stage and relevant guidance. If they say the change has not happened, keep their current stage.

## 4. Proposed new dashboard

The dashboard should focus on:
- Personalised welcome.
- Current stage.
- Short explanation of what matters now.
- Prioritised tasks relevant to the student.
- Progress within the current stage.
- Appropriate official services, platforms and resources.
- Taupe Assistant access.
- “Update my situation” option.

Do not display all five stages as a set of competing navigation sections. The stages are internal journey logic; the student sees their current stage and relevant tasks.

## 5. Important flexibility

Do not force a rigid linear journey.

A student may already have accommodation before receiving a visa, or may have completed some tasks independently. The product should use their actual circumstances and avoid showing tasks that do not apply.

Allow students to correct their information. Major stage changes should be confirmed by the student.

## 6. Implementation status

This is a proposed redesign brief, not evidence that the existing prototype already implements it.

Before implementation:
1. Inspect the original repository.
2. Map existing components and state.
3. Compare existing profile fields with the information needed for stage selection.
4. Decide how to represent task applicability and completion.
5. Implement the hybrid progression in focused steps.
6. Test at least three distinct student profiles.
7. Preserve the original brand, working features and product boundaries.
