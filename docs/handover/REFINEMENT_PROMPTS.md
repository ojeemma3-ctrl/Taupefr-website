# TaupeFR — Original Refinement Prompt Pack

> These are reconstructed, copy-ready versions of the five refinement topics recorded in the original project history. They are not represented as verbatim historical transcripts. Apply them one at a time to the existing codebase.

## Prompt 1 — Improve the Administration Checklist

```text
Improve the existing TaupeFR Administration experience without rebuilding the application.

Inspect the current Administration screen and its components first. Preserve the current brand, navigation, layout system and working interactions.

The goal is to make administrative information easier for international students to understand and act on.

Organise relevant topics into a clear checklist or guide structure. Possible topics include:
- Residence permit / visa-related steps, only where applicable.
- Health insurance and social-security registration.
- CAF housing assistance, only where the student's status may qualify.
- Bank account preparation.
- SIM/mobile service.
- University registration and student services.
- Housing-related documents and address evidence.

For each topic, show:
1. What the task is.
2. Why it may matter.
3. Who it applies to or what conditions affect applicability.
4. What information or documents may be needed.
5. The general steps.
6. The official organisation or service responsible.
7. A link to the official source.

Use careful language. Do not imply that every task applies to every student. Do not promise eligibility, approval or a specific outcome. TaupeFR provides guidance and links; the official organisation makes the decision.

Use sample content and frontend state where there is no real backend. Make the checklist interactive and easy to scan on mobile.
```

## Prompt 2 — Create Reusable Step-by-Step Task Guides

```text
Improve TaupeFR by creating a reusable step-by-step task guide pattern.

Do not redesign the entire platform. First inspect the existing screens, components and current task interactions. Build one reusable guide component or pattern that can be used across Housing, Arrival and Administration.

Every guide should help a student understand:
- What the task means.
- Why it matters.
- Whether it applies to their situation.
- What to prepare before starting.
- The steps to follow.
- Where the actual task can be completed.
- The official or trusted source to consult.
- Common mistakes or points to check.
- What to do after completing the task.

Use progressive disclosure so the student is not overwhelmed by all the detail at once. Keep the language simple and practical. Make steps readable and actionable.

Where requirements vary by nationality, visa/status, institution or individual circumstances, state that clearly and direct the student to the relevant official source.

Do not invent legal requirements, processing times, eligibility rules or guarantees. Distinguish TaupeFR explanations from official instructions.

The guide component should be reusable, responsive and consistent with the existing TaupeFR design.
```

## Prompt 3 — Improve the Original Personalised Journey Engine

```text
Improve the existing TaupeFR student journey so it can reflect information supplied by the student.

IMPORTANT: This is the original journey-personalisation refinement, not the later supervisor-requested stage-only dashboard redesign. Do not introduce the later five-stage/hybrid progression model unless explicitly asked.

Inspect the existing profile, journey and dashboard state first.

Use relevant information already supplied by the student, such as:
- Admission or study status.
- Planned arrival timing.
- Whether the student has arrived.
- Accommodation situation.
- Areas where the student needs help.
- Relevant profile answers already present in the prototype.

Use this information to make the journey and recommended actions more relevant. Avoid asking for information that is already known.

Allow students to see their overall journey and explore relevant journey areas. Make completed, current and upcoming items understandable. Do not force a rigid sequence when tasks can happen in a different order.

Use simulated profile data and frontend state for the MVP. Clearly distinguish simulated personalisation from a real recommendation engine or backend.

Preserve the existing screens, design system and working features. Make focused changes only.
```

## Prompt 4 — Taupe Assistant Prototype

```text
Improve the existing Taupe Assistant in the TaupeFR MVP.

The Taupe Assistant is a reusable student-support assistant within the TaupeFR platform. It should help students understand their situation, the task they are viewing, what they should do next and where they can complete that task.

Do not create a disconnected chatbot page. Integrate the assistant into the existing product experience and preserve the current design.

The assistant should be context-aware:
- Current screen or product area.
- Selected task or topic.
- Relevant student profile information already supplied.
- Current step in a task guide.

The assistant should:
1. Explain information in clear, simple language.
2. Break complex processes into manageable steps.
3. Explain why a task may matter.
4. Identify what documents or information the student may need to prepare, without inventing requirements.
5. Point to official or trusted external sources.
6. Explain when the student should contact the relevant institution or provider.
7. Avoid making decisions or guarantees on behalf of official organisations.
8. Avoid repeating questions where the student has already provided the answer.

Provide useful example questions and sample responses for the frontend prototype. Include a clear human/help handoff pattern where the assistant cannot safely answer.

For this MVP, use simulated responses and frontend state unless a real AI integration already exists. Do not claim that the assistant is connected to live AI, external databases or official services if it is not.

Keep the assistant reusable across the product rather than building a different assistant for every page.
```

## Prompt 5 — Jury-Ready Product Audit and Demo Mode

```text
Prepare the existing TaupeFR MVP for a demonstration to the university entrepreneurship supervisor or jury.

Do not rebuild the application or introduce a new visual identity.

First inspect the whole prototype and test the main user flows.

Review:
- Landing and welcome.
- Student profile.
- Journey.
- Dashboard.
- Housing.
- Arrival.
- Administration.
- Marketplace.
- Community.
- Settled.
- Taupe Assistant.

Check that:
1. Navigation works.
2. Buttons have meaningful actions.
3. Forms and profile answers update the interface where expected.
4. The journey and dashboard use the available sample profile state.
5. Task guides are understandable.
6. External links are clearly labelled.
7. The assistant gives relevant sample responses.
8. Mobile layouts are usable.
9. There are no broken screens, dead controls or obvious visual inconsistencies.
10. Simulated functionality is not presented as a real integration.

Create a simple demo mode or provide a reliable demo path using clearly labelled sample student profiles. The reviewer should be able to understand the problem, see how TaupeFR works and explore its value without needing a real account or backend.

Provide a concise audit report:
- Working features.
- Simulated features.
- Incomplete features.
- Bugs or UX issues.
- Priority fixes before the presentation.
- A suggested 3–5 minute demonstration script.

Do not fabricate user numbers, partnerships, listings, testimonials or product outcomes.
```

## Prompt application order

Recommended sequence:
1. Administration checklist.
2. Reusable task guides.
3. Original journey personalisation.
4. Taupe Assistant.
5. Jury-ready audit and demo.

Apply one prompt at a time. Review the result before moving to the next prompt.
