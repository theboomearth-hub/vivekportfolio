/**
 * Homepage content (Nov 2026 "Calm + agentic" redesign).
 *
 * Every number here is taken from the matching case study in
 * src/lib/work/project-data.ts — keep them in sync when a case study changes.
 * Plain data (no JSX), so both the server page and the client agent can import it.
 */

export type CardId = "nocode" | "ehr" | "civ" | "ds";
export type RoleKey = "recruiter" | "hiring" | "founder" | "designer";
export type Sketch = "agentic" | "builder" | "timeline" | "gantt" | "tokens";

export interface Metric {
  value: string;
  label: string;
  /** Render as "label value" (e.g. "NPS 32 → 71") instead of "value label". */
  labelFirst?: boolean;
}

export const credentials = [
  { term: "Currently", detail: "Agentic AdTech at Moving Walls, across a 7-product DOOH portfolio" },
  { term: "Previously", detail: "ConstructivIQ, Slate Technologies, Quinnox, Microland and Knowledge Lens" },
];

/**
 * Flagship: the MW-Inventory agent use case (designed and built solo, live prototype).
 * Figures are product facts, not outcomes — there is no usage data for a prototype.
 * The previous flagship (the NDA agentic DSP, mw-activate) is in the "Also" row.
 */
export const flagship = {
  slug: "agentic-inventory",
  domain: "Agentic AI · Design and build",
  status: "Use case · live prototype",
  title: "An agent that takes a DOOH campaign from search to debrief",
  desc: "MW-Inventory, designed and built end to end: planners ask in plain language, and the agent calls typed tools and answers with interactive views for every stage of the campaign.",
  image: {
    src: "/work/agentic-inventory/product-frame.jpg",
    width: 2000,
    height: 1250,
    alt: "MW-Inventory desktop app showing an AI-built media plan for $5,000 a day across six screens and three cities.",
  },
  figures: [
    { value: "18", label: "agent tools across the campaign" },
    { value: "6", label: "stages in one conversation" },
    { value: "Solo", label: "design and engineering" },
  ],
  summary: [
    "Problem: planning one DOOH campaign meant juggling inventory sheets, maps, audience data, rate cards, proposals and pacing reports across tools.",
    "Approach: one conversation backed by 18 typed tools. Every answer renders as an interactive view with next steps, and booking stays an explicit step the planner takes.",
    "Result: a working prototype I designed and built end to end, covering search, planning, proposals, booking, pacing and debriefs.",
  ],
};

export interface ProjectCardData {
  id: CardId;
  slug: string;
  domain: string;
  years: string;
  title: string;
  metrics: Metric[];
  sketch: Sketch;
}

export const projectCards: ProjectCardData[] = [
  {
    id: "nocode",
    slug: "nocode-platform",
    domain: "Platform design · NoCode / LowCode",
    years: "2018–22",
    title: "Cut engineering dependency 60% with a visual app builder",
    metrics: [{ value: "3×", label: "faster go-to-market" }, { value: "32 → 71", label: "NPS", labelFirst: true }],
    sketch: "builder",
  },
  {
    id: "ehr",
    slug: "ehr-platform",
    domain: "Healthcare · EHR",
    years: "2024–26",
    title: "Saved clinicians 2+ hours a shift in daycare surgery",
    metrics: [{ value: "7 → 2", label: "clicks to patient data" }, { value: "588", label: "procedures covered" }],
    sketch: "timeline",
  },
  {
    id: "civ",
    slug: "constructiviq-construction-cloud",
    domain: "ConstructivIQ · Construction cloud",
    years: "2023–24",
    title: "Took a construction cloud from zero to $1.2M ARR",
    metrics: [{ value: "15+", label: "enterprise contracts" }, { value: "12 → 7 weeks", label: "Onboarding", labelFirst: true }],
    sketch: "gantt",
  },
  {
    id: "ds",
    slug: "design-systems-scale",
    domain: "Design systems · 6 product types",
    years: "2023–25",
    title: "One design-system spine for six products",
    metrics: [{ value: "99%", label: "WCAG AA" }, { value: "−50%", label: "Handoff time", labelFirst: true }],
    sketch: "tokens",
  },
];

export const DEFAULT_ORDER: CardId[] = ["nocode", "ehr", "civ", "ds"];

export const alsoProjects = [
  { slug: "hosamane", label: "Hosamane", note: "use case" },
  { slug: "healthai", label: "HealthAI", note: "use case" },
  { slug: "mw-activate", label: "Agentic DSP", note: "in flight · NDA" },
  { slug: "iiot-smart-factory", label: "IIoT Smart Factory" },
  { slug: "ott-platform", label: "OTT Streaming", note: "use case" },
  { slug: "bigdata-analytics", label: "Big Data Analytics" },
  { slug: "ev-bike-platform", label: "EV Bike OEM", note: "in flight · NDA" },
  { slug: "mw-posterops", label: "MW PosterOps", note: "in flight · NDA" },
];

export const processSteps = [
  { n: "01", title: "Understand", body: "Check the problem is real, write the brief with its kill criteria, then research." },
  { n: "02", title: "Decide", body: "Map findings to psychology principles, then choose the right paradigm: agentic, hybrid, traditional or zero-UI." },
  { n: "03", title: "Design", body: "Flows that include failure paths, and interfaces built on the token system." },
  { n: "04", title: "Ship", body: "Launch against metrics that can’t be gamed, and stop when the numbers say so." },
];

/** Labels must match the facts list rendered on the homepage (used for highlighting). */
export type FactLabel = "Experience" | "Currently" | "Focus" | "Builds with" | "Research" | "Based in";

/**
 * Footer quotes moved here. Names and companies aren’t on the site yet, so the
 * attribution is role-only until they’re added (with each person’s permission).
 */
export const quotes = [
  { quote: "Brings engineering discipline to design work.", role: "CTO" },
  { quote: "Rare blend of design craft and systems thinking.", role: "Product Manager" },
  { quote: "Transforms chaos into clarity with design rigor.", role: "Design Leader" },
];

/** What the agent changes on the page when a visitor says who they are. */
export const roles: Record<
  RoleKey,
  { who: string; label: string; order: CardId[]; facts: FactLabel[]; cta: string; note: string; changes: string[] }
> = {
  recruiter: {
    who: "I’m a recruiter",
    label: "recruiters",
    order: ["ehr", "civ", "ds", "nocode"],
    facts: ["Experience", "Currently", "Based in"],
    cta: "Share a role",
    note: "Open to Senior and Lead design roles, full-time, in Bengaluru or remote. Replies within 24 hours.",
    changes: [
      "Added a hiring snapshot under the intro",
      "Highlighted experience, current role and location",
      "Sorted the project cards newest first",
      "Changed the contact button to “Share a role”",
    ],
  },
  hiring: {
    who: "I’m a hiring manager",
    label: "hiring managers",
    order: ["ds", "civ", "nocode", "ehr"],
    facts: ["Focus", "Builds with"],
    cta: "Discuss the role",
    note: "Designs the system, writes the production React and measures the outcome. Has led teams of up to four designers.",
    changes: [
      "Added a note on how he works with engineering",
      "Moved the design-systems work to the top",
      "Highlighted focus and tools",
      "Changed the contact button to “Discuss the role”",
    ],
  },
  founder: {
    who: "I’m a founder",
    label: "founders",
    order: ["civ", "nocode", "ehr", "ds"],
    facts: ["Builds with", "Currently"],
    cta: "Discuss a project",
    note: "Takes products from first research to shipped code. ConstructivIQ went from zero to $1.2M ARR on his designs.",
    changes: [
      "Added a note on zero-to-revenue work",
      "Moved the zero-to-$1.2M ARR build to the top",
      "Highlighted tools and current role",
      "Changed the contact button to “Discuss a project”",
    ],
  },
  designer: {
    who: "I’m a designer",
    label: "designers",
    order: ["ds", "ehr", "nocode", "civ"],
    facts: ["Research", "Focus"],
    cta: "Say hello",
    note: "Start with the token-psychology post, then the process page. Both explain the why, not just the what.",
    changes: [
      "Added a reading path: token post, then process",
      "Moved design systems and healthcare UX up",
      "Highlighted research and focus",
      "Changed the contact button to “Say hello”",
    ],
  },
};

/** DOM ids the agent scrolls to (sources, tour stops). */
export const anchors = {
  heroTitle: "hero-title",
  heroAsk: "hero-ask",
  flagship: "flagship",
  card: (id: CardId) => `card-${id}`,
  processSteps: "process-steps",
  facts: "facts",
  post: (slug: string) => `post-${slug}`,
  contactTitle: "contact-title",
};
