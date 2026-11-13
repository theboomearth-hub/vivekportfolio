/**
 * Guardrails checked on every message before any tool runs (spec 05 §4).
 * The fairness check covers the person's request; the planner's own replies are templated from tool data,
 * and the evals (scripts/evals.mjs) check those replies for banned words.
 */

export type Guard =
  | { kind: "protected"; trait: "religion" | "caste" | "diet" | "marital status" }
  | { kind: "payment" }
  | { kind: "safety" }
  | { kind: "number" }
  | { kind: "id-docs" }
  | null;

const RELIGION = /\b(hindu|muslim|christian|sikh|jain|parsi|religio\w*)\b/i;
const CASTE = /\b(caste|brahmin\w*|dalit|sc\/st|reddy only|community only)\b/i;
const DIET = /\b(vegetarian|veg only|pure veg|non-?veg|eggetarian|no meat)\b/i;
const MARITAL = /\b(bachelor\w*|married|unmarried|spinster\w*|family only|families only|single (?:men|women|man|woman))\b/i;
const COOKING_QUESTION = /\b(ask|check)\b.*\b(cook|cooking|non-?veg|food)\b/i;

export function checkMessage(text: string): Guard {
  const t = text.toLowerCase();
  // Asking every owner a neutral house-rules question is allowed; filtering by protected traits isn't.
  if (!COOKING_QUESTION.test(t)) {
    if (RELIGION.test(t)) return { kind: "protected", trait: "religion" };
    if (CASTE.test(t)) return { kind: "protected", trait: "caste" };
    if (DIET.test(t)) return { kind: "protected", trait: "diet" };
    if (MARITAL.test(t)) return { kind: "protected", trait: "marital status" };
  }
  if (/\b(aadhaar|aadhar|pan card|passport|id proof|kyc)\b/i.test(t)) return { kind: "id-docs" };
  if (/\b(pay|transfer|send money)\b.*\b(token|advance|booking|deposit|money|amount|owner|him|her|them)\b|\bpay (the )?(token|advance|booking)/i.test(t)) return { kind: "payment" };
  if (/\b(safe|safety|unsafe|crime|dangerous)\b/i.test(t)) return { kind: "safety" };
  if (/\b(share|give|send)\b.*\bmy (number|phone|contact)\b|\bcall me\b/i.test(t)) return { kind: "number" };
  return null;
}

/** Words the agent must never use (06-content §1). Checked by the evals. */
export const BANNED_IN_OUTPUT = [/\bsafe\b/i, /\bunsafe\b/i, /\bgood area\b/i, /\bbad area\b/i, /\bguaranteed\b/i, /\brisk-free\b/i, /\bhurry\b/i, /\bhigh demand\b/i];

/**
 * Questions the agent drafts for owners. Asking every owner the same house-rules question about cooking is
 * allowed; a question about religion, caste or marital status isn't, whoever drafted it.
 */
export function checkOwnerQuestion(question: string): string | null {
  if (RELIGION.test(question)) return "religion";
  if (CASTE.test(question)) return "caste";
  if (MARITAL.test(question)) return "marital status";
  return null;
}
