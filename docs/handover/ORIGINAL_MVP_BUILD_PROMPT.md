# TAUPEFR — Interactive MVP Prototype

> Historical status: reconstructed master build prompt based on the original project brief and recovered conversation details. It is intended to reproduce the original baseline, not the later supervisor redesign.

You are a senior product designer, UX/UI designer and frontend engineer. Help me create an **interactive MVP prototype** for TaupeFR, a digital platform concept for international and external students moving to Bordeaux, France.

This is an interactive product prototype for a university entrepreneurship programme. It is **not merely a marketing website**. The prototype should let a reviewer understand the student problem, explore the product, and experience the main user journey through working frontend interactions.

## 1. Project and brand

Product name: **TaupeFR**

Brand line: **“Your Home. Your Start. Your France.”**

Location focus: Bordeaux Métropole, France.

Core purpose: help international and external students prepare for their move to Bordeaux and navigate practical steps before and after arrival.

The product should organise useful information, guidance and links to existing services. It should not pretend to replace official organisations or housing providers.

## 2. Core user question

Build the experience around the student's practical question:

**“What should I do next?”**

The platform should make the student's journey understandable and help them find relevant next actions, guidance and resources.

## 3. Main audience

Design primarily for international students who:
- Have received or are pursuing admission to a Bordeaux institution.
- Are preparing to move to Bordeaux from another country.
- Need help understanding housing, arrival, administrative and student-life steps.
- May be unfamiliar with French systems, local services or the French language.

Use clear, welcoming and accessible language. Avoid assuming that every student has the same nationality, visa status, accommodation situation or administrative needs.

## 4. Original student journey

Represent the broad journey:

**Admission → Accommodation → Arrival → Administration → Furniture / Marketplace → Community → Settled**

The journey should feel connected. A student should be able to understand where they are in the overall experience and explore useful modules.

Do not force every student to complete every task in a rigid order. The prototype can demonstrate personalisation through sample profile information and simulated state.

## 5. Screens to build

Create the following connected screens or views. Use the existing project's routing and component conventions where possible.

### A. Landing / Welcome
- Introduce TaupeFR and its purpose.
- Use the brand line “Your Home. Your Start. Your France.”
- Explain that TaupeFR helps students prepare for life in Bordeaux before and after arrival.
- Provide a clear action to start or explore the student journey.
- Do not make this feel like a generic property-listing homepage.

### B. Journey
- Show the broad student journey from admission through settling in.
- Use clear steps, progress cues or a timeline.
- Let the user explore journey areas.
- Keep the journey understandable on mobile.

### C. Student Profile
- Let the prototype user provide or edit relevant information about their student situation.
- Example information may include study destination, arrival timing, accommodation situation, and areas where support is needed.
- Do not request unnecessary personal or sensitive information.
- Use profile information to demonstrate how the experience can adapt.

### D. Dashboard
- Provide a central overview of the student's journey and useful next actions.
- Surface relevant information from the sample student profile.
- Include access to the major product modules.
- Keep the dashboard organised and easy to scan.

### E. Housing
- Explain housing options and practical considerations for students in Bordeaux.
- Help users understand where to search and what to prepare.
- Provide links or clearly labelled examples of existing housing platforms and trusted resources.
- Include scam-awareness and document-preparation guidance where appropriate.
- Do not imply TaupeFR owns or verifies a listing unless the prototype genuinely demonstrates a verified partner/feed.

### F. Arrival
- Provide practical arrival guidance for Bordeaux.
- Include useful local orientation and preparation information.
- Help students understand immediate priorities after arrival.
- Keep information clearly separated from official administrative advice.

### G. Administration
- Organise relevant administrative topics into understandable guidance.
- Potential topics may include residence-permit information, health-insurance/social-security steps, CAF housing assistance, banking, SIM/mobile service and university procedures.
- Clearly state that applicability depends on the student's status and circumstances.
- Link to official sources for authoritative information.
- Never promise approval or eligibility.

### H. Marketplace
- Demonstrate a student-to-student marketplace concept for useful second-hand items.
- Example categories: furniture, kitchen items, bicycles, appliances and other student essentials.
- Show a simple browse/listing interaction using sample data.
- Make it clear that listings and transactions are illustrative if no real marketplace backend exists.

### I. Community
- Demonstrate ways students can connect, find peer support or discover relevant student communities.
- Use sample content only; do not imply real groups or members exist unless connected to real services.

### J. Settled
- Show ongoing student-life support and useful resources once a student is more established in Bordeaux.
- Include community, local discovery and ongoing practical information.

## 6. Reusable Taupe Assistant

Include a reusable assistant called **Taupe Assistant**.

The assistant should support the student while they explore the platform. It should be context-aware in the prototype:
- It should know which product area the student is viewing.
- It should know the selected task or topic.
- It should be able to explain a task in simple steps.
- It should help the student understand what to do next.
- It should direct the student to relevant information or the appropriate external service.
- It should make clear when information is general guidance and when the student should check an official source.

For the MVP, simulate the assistant interaction with well-written sample responses and frontend state. Do not claim that a real AI model, database or live service integration exists unless it has actually been implemented.

## 7. Business model concepts to represent carefully

The original concept explored:
- Free basic access for students.
- Possible referral or partnership revenue from relevant service providers.
- Potential housing partner or listing arrangements.
- Possible marketplace transaction or service fees.
- University or institutional partnerships.
- Optional premium services, if validated.

Do not present unvalidated revenue streams as secured partnerships or existing revenue.

## 8. Product and service boundaries

TaupeFR should connect students to existing services rather than rebuild them.

Examples:
- Housing platforms and providers remain responsible for their own listings, contracts and accommodation decisions.
- CROUS remains responsible for its own housing services and decisions.
- CAF remains responsible for its own eligibility rules and decisions.
- Campus France and universities remain responsible for their own official information and processes.
- Government and prefecture services remain the authority for administrative procedures.

Use trusted external links where appropriate. Avoid scraping websites or copying data without permission. Prefer official links, referral/deep links, approved feeds/APIs or formal partnerships.

## 9. Design direction

Create a clean, modern, welcoming and credible student-support product.

The interface should feel:
- Clear and reassuring.
- Human and supportive.
- Modern and premium without feeling luxurious or inaccessible.
- Easy for international students to understand.
- Consistent across desktop and mobile.

Use a restrained TaupeFR visual identity. Use the existing project logo, palette and components if they are already present in the repository. Do not invent a completely new identity or replace working design decisions without a reason.

Avoid:
- Generic AI dashboard appearance.
- Excessive gradients and decorative effects.
- Too many cards competing for attention.
- Dense paragraphs.
- Fake statistics, fake reviews or fake partnerships.
- Overcomplicated navigation.

Use strong hierarchy, readable typography, consistent spacing, clear buttons and purposeful empty states.

## 10. Interaction requirements

The MVP must be genuinely explorable:
- Navigation between screens must work.
- Profile fields should update frontend state.
- Dashboard content should reflect sample profile information where feasible.
- Journey steps should be clickable.
- Housing and administration resources should open relevant details or external links.
- Marketplace categories and sample listings should be explorable.
- Taupe Assistant should open and respond to sample questions.
- Buttons should have meaningful behaviour.
- Include useful empty, loading or confirmation states where relevant.

Do not add controls that look functional but do nothing.

## 11. Technical requirements

Before implementation:
1. Inspect the existing repository.
2. Identify the framework, routing, component structure and current state management.
3. Reuse existing code and design tokens.
4. Preserve working features.
5. Avoid replacing the project with a new scaffold unless the existing project is unusable.

Build the simplest frontend architecture that supports the prototype.

Use realistic sample data and local frontend state for interactions that do not yet have a backend. Keep the distinction between simulated and real functionality clear.

Ensure:
- Responsive desktop and mobile layouts.
- Accessible labels and keyboard navigation for important controls.
- Adequate contrast.
- Clear focus states.
- No horizontal overflow.
- No broken routes or dead buttons.
- No unsupported claims about integrations.
- No unnecessary dependencies.

## 12. Deliverable

Deliver a coherent, working interactive TaupeFR MVP prototype that can be demonstrated to a university entrepreneurship supervisor or jury.

After implementation, provide:
- A summary of the screens and interactions implemented.
- What is simulated versus genuinely connected.
- Any known limitations.
- A short walkthrough for demonstrating the prototype.
- A list of suggested next improvements.

**Important:** Build on the existing project. Do not turn this into a generic marketing website. Preserve the original TaupeFR concept and make the student journey the centre of the product.
