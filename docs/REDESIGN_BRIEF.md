# TAUPEFR — EXISTING PROJECT REVIEW AND SUPERVISOR-LED REDESIGN

> Supervisor's correction, as briefed by Emmanuel (23 Nov 2026). Read together with docs/PRODUCT_PLAN.md (the stage engine there is the agreed implementation of this brief).

## 1. DO NOT REBUILD FROM SCRATCH

Do not create an entirely new project or unnecessarily replace the existing design.

Before making changes:
- Inspect the entire existing project structure.
- Understand the current pages, components, navigation, styling, layout and user interactions.
- Identify what is already implemented and what is simulated.
- Understand the original product vision and its intended user journey.
- Preserve the existing visual identity, good design decisions, reusable components and working functionality.
- Do not delete existing features simply because you would implement them differently.
- Do not introduce a completely different design system.
- Do not scatter the interface with additional cards, sections, buttons or unnecessary features.

You may improve layouts, reorganise components and redesign specific screens where necessary to implement the supervisor's feedback properly, consistent with the existing TaupeFR identity.

## 2. THE ORIGINAL PRODUCT

TaupeFR is a digital platform designed to help international and external students moving to Bordeaux settle smoothly before and after arrival.

It helps students understand:
- What applies to their personal situation.
- What they need to do next.
- What documents or information they need.
- Where they should complete each task.
- Which official or trusted service can help them.

TaupeFR is a guidance and coordination platform. It does not replace official institutions, housing providers, CROUS, CAF, universities or government services.

## 3. THE SUPERVISOR'S CORRECTION — THE MAIN CHANGE

The supervisor wants the platform to be more personalised and easier to understand.

The original interface presents too much of the student's overall journey. It can expose several stages and tasks even when those stages are not relevant to the student's current situation.

The correction is to make the platform stage-based and situation-aware.

**A student should primarily see the stage they are currently in and the information relevant to that stage.**

Example: a student who has just received admission and is still in Nigeria should not see a dashboard full of tasks about settling into Bordeaux, getting a transport card or finding local services. The platform should prioritise information relevant to preparing to come to France. When that student's circumstances change, the guidance updates.

The experience should feel like a personal settlement guide, not a long checklist that every student must follow in the same order.

## 4. THE FIVE STAGES

Internal progression model:
1. Preparing to come to France.
2. Getting ready to travel.
3. Arriving in Bordeaux.
4. Settling into Bordeaux.
5. Settled and connected.

- Do not display all five stages as a permanent navigation menu.
- Do not force students to complete every task in a rigid sequence.
- A student may have completed certain tasks already.
- A student may enter the platform at a later stage.
- The system must adapt to the student's actual situation.

The student sees their current stage, its relevant tasks and the appropriate guidance.

## 5. STAGE PROGRESSION (HYBRID)

**A. Automatic task updates.** When a student completes a routine task: mark it completed, remove it from the active list, update progress, keep a compact record of completed tasks.

**B. Student confirmation for major changes.** Do not move a student into another major life stage based only on completing one task (e.g. finishing a visa checklist does not mean they have travelled). When a major change may have happened, ask: Have you received your visa? Have you booked your journey? Have you arrived in France? Have you arrived in Bordeaux? Have you secured accommodation? Yes → update situation and show the appropriate stage. No → keep the current stage.

**C. Students can correct their information** via an accessible "Update my situation" option.

## 6. THE NEW PERSONAL DASHBOARD

1. Personalised welcome.
2. Current stage.
3. Short explanation of what this stage means.
4. Prioritised list of relevant tasks.
5. Progress within the current stage.
6. Relevant official resources and useful links.
7. Access to Taupe Assistant.
8. Option to update their situation.

Clean and focused. Do not overwhelm the student with information they do not currently need.

## 7. TASK EXPERIENCE

Each task explains: what it means, why it matters, whether it applies to the student, what to prepare, the steps, where to complete it, the official or trusted resource, and what to do next.

Simple language. Do not invent official requirements, eligibility conditions, partnerships or guarantees. Where information depends on nationality, visa, status or circumstances, say so and point to the official source.

## 8. TAUPE ASSISTANT

Preserve it. It should be context-aware: profile, current stage, current task, completed tasks, current question. Explain simply, guide step by step, point to reliable resources, not the same generic reply for everyone. If it is a frontend simulation, do not pretend a real AI or backend exists.

## 9. DESIGN EXPECTATIONS

Clean, modern, welcoming, trustworthy, simple to navigate, professional enough for a university entrepreneurship project.

Avoid: generic AI dashboards, excessive gradients, too many cards, dense paragraphs, fake statistics, fake institutional partnerships, decorative features that don't help, buttons that do nothing.

## 10. IMPLEMENTATION APPROACH

- Phase 1 — Audit.
- Phase 2 — Redesign plan (how profile sets stage, dashboard changes, task filtering, automatic completion, milestone confirmation, updating situation, stages working internally).
- Phase 3 — Implementation in the existing project.
- Phase 4 — Testing.

### Test students (minimum)
1. Received admission, still outside France.
2. Obtained a visa, preparing to travel.
3. Just arrived in Bordeaux.
4. Already in Bordeaux, no accommodation secured.
5. Completed several tasks and settled.

Check each sees relevant guidance, not the whole journey. Also test: task completion, progress updates, major stage confirmation, declining a confirmation, updating the situation, navigation and existing features.

## 11. FINAL EXPECTATION

> "Based on where you are and your current situation, here is what matters to you now, what you should do next and where to do it."

Understand the existing project first, preserve its strengths, and implement the correction carefully and consistently.
