# TaupeFR — Technical MVP Notes

## 1. Known implementation status from project history

The prototype was described as an interactive frontend prototype created with a ChatGPT Codex / Sites-style workflow.

The recovered project history indicates:
- Frontend screens and simulated interactions.
- Sample profile information and local interface state.
- A reusable Taupe Assistant concept.
- No confirmed real AI backend or LLM integration.
- No confirmed production database.
- No confirmed live housing, administrative or marketplace integrations.

These notes describe what was known from the conversation. They do not prove the current repository has exactly this architecture. Inspect the actual code before making changes.

## 2. First step in Claude: repository audit

Before editing, inspect:
- Framework and build tool.
- `package.json` and scripts.
- Routes and page structure.
- Components and shared layouts.
- State management.
- Sample data and content sources.
- Styling system and design tokens.
- Existing assistant implementation.
- Form behaviour.
- External links.
- Deployment configuration.
- Tests and known errors.

Return a short architecture map before changing anything.

## 3. Prototype implementation approach

For an interactive MVP:
- Use local state for profile answers and task progress if no backend exists.
- Use clearly labelled sample data.
- Keep content separate from presentational components where practical.
- Use reusable components for task guides and assistant interactions.
- Keep external resources as explicit links.
- Avoid adding dependencies unless needed.
- Preserve the current app structure.

## 4. Real vs simulated functionality

The interface must not imply that a simulated feature is a production service.

Examples:
- Sample housing cards are not verified live listings.
- Sample marketplace items are not real listings.
- A simulated assistant is not a connected AI assistant.
- Local profile state is not a secure user account.
- A sample checklist is not an official administrative decision.

## 5. Quality checklist

- All main routes open.
- Navigation works.
- No dead buttons.
- Profile answers update the interface.
- Sample journey is understandable.
- Task guide interactions work.
- Assistant opens and responds in the prototype.
- External links are clearly identified.
- Mobile layout works.
- Keyboard and focus states are usable.
- No horizontal overflow.
- No fake integrations or unsupported claims.
- Existing working code is preserved.
