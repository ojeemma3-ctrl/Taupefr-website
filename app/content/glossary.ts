// French terms explained once, in plain English (docs/PRODUCT_PLAN.md §7).
// Hedged on purpose: the organisation named always decides.

export type Term = { term: string; match: RegExp; meaning: string };

export const glossary: Term[] = [
  {
    term: "CAF",
    match: /\bcaf\b|\bapl\b|housing aid/i,
    meaning:
      "CAF (Caisse d’allocations familiales) is the public body that pays housing aid, such as APL. It looks at your situation and decides whether you can get it.",
  },
  {
    term: "CROUS",
    match: /\bcrous\b/i,
    meaning:
      "CROUS is the regional public student services body. It runs student residences and restaurants, and handles some grants.",
  },
  {
    term: "RIB",
    match: /\brib\b|\biban\b/i,
    meaning:
      "A RIB (relevé d’identité bancaire) is a document with your French bank details, including your IBAN. Landlords, employers and CAF often ask for one.",
  },
  {
    term: "VLS-TS",
    match: /vls[- ]?ts|validat\w* (my |your )?visa/i,
    meaning:
      "A VLS-TS is a long-stay visa that also works as a residence permit. Many of them must be validated online after you arrive in France. Check what your own visa says.",
  },
  {
    term: "CVEC",
    match: /\bcvec\b/i,
    meaning:
      "The CVEC (contribution de vie étudiante et de campus) is a student life fee. Many students pay it, some are exempt, and most need the certificate to enrol. The official site says who must pay.",
  },
  {
    term: "Visale",
    match: /visale|guarantor/i,
    meaning:
      "Visale is a guarantor scheme run by Action Logement. It can act as your guarantor for a rental if you’re eligible. The scheme decides who qualifies.",
  },
  {
    term: "Ameli",
    match: /\bameli\b|assurance maladie|health insurance/i,
    meaning:
      "Ameli is the website of the French national health insurance (Assurance Maladie). Some international students register there; it decides what applies to you.",
  },
];
