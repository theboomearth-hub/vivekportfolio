/**
 * The portfolio agent's script.
 *
 * Answers are pre-written and grounded only in this site's content; every reply
 * names its sources so a visitor can check it. Swapping this module for a model
 * call later only has to keep the `Reply` shape — the UI doesn't change.
 */
import { anchors, roles, type RoleKey } from "@/lib/home";

export interface Source {
  label: string;
  /** Element id on the homepage to scroll to and highlight. */
  target?: string;
  /** Or a page to open. */
  href?: string;
}

export type AgentCard =
  | { kind: "tour" }
  | { kind: "email"; subject: string; body: string }
  | { kind: "slots" }
  | { kind: "undo" };

export type AgentAction =
  | { type: "ask"; text: string }
  | { type: "tailor"; role: RoleKey };

export interface Reply {
  /** Visible work steps, ticked off one by one before the answer appears. */
  steps: string[];
  text?: string;
  list?: string[];
  after?: string;
  sources?: Source[];
  card?: AgentCard;
  options?: { label: string; action: AgentAction }[];
  /** Page change the agent makes once its steps finish. */
  act?: { type: "applyRole"; role: RoleKey };
  /** Answered by Claude from the site's content (the panel says so); scripted replies leave this unset. */
  by?: "claude";
  /** Placeholder while the model is answering: shows the working state, never finishes on its own. */
  pending?: boolean;
}

export const GREETING =
  "Hi. I’m Vivekanand’s portfolio agent. I answer only from what’s on this site and show my sources. I can also do things for you: give you a tour, tailor this page to you, or draft an email for you to approve.";

export const SUGGESTIONS = [
  { label: "2-minute tour", text: "Give me a 2-minute tour" },
  { label: "Tailor this page", text: "Tailor this page for me" },
  { label: "What has he shipped?", text: "What has he shipped?" },
  { label: "See real screens", text: "Show me the design gallery" },
  { label: "Find a time", text: "Find a time to talk" },
  { label: "How he uses AI", text: "How does he use AI?" },
];

const TOPIC: Record<RoleKey, string> = {
  recruiter: "a Senior or Lead design role",
  hiring: "a design role on my team",
  founder: "a product we’re building",
  designer: "design systems",
};

export function draftBody(role: RoleKey | null, extra: string) {
  return `Hi Vivekanand,\n\nI came across your portfolio and would like to talk about ${role ? TOPIC[role] : "working together"}.${extra}\n\nThanks,\n[Your name]`;
}

const ask = (label: string, text = label) => ({ label, action: { type: "ask", text } as AgentAction });
const askTime = ask("Find a time to talk");
const askEmail = ask("Draft an intro email");
const askTour = ask("Give me a tour");
const askTailor = ask("Tailor this page for me");

export function tailorQuestion(): Reply {
  return {
    steps: ["Reading the page layout"],
    text: "Who should I tailor it for? I’ll reorder and highlight what matters to you, and you can undo it in one click.",
    options: (Object.keys(roles) as RoleKey[]).map((role) => ({
      label: roles[role].who,
      action: { type: "tailor", role },
    })),
  };
}

export function tailorReply(role: RoleKey): Reply {
  const r = roles[role];
  return {
    steps: [`Re-ranking projects for ${r.label}`, "Writing a short note for the intro", "Highlighting the relevant facts"],
    act: { type: "applyRole", role },
    text: `Done. I made ${r.changes.length} changes for ${r.label}, all highlighted on the page:`,
    list: r.changes,
    card: { kind: "undo" },
  };
}

export function slotEmailReply(role: RoleKey | null, mine: string, ist: string): Reply {
  return {
    steps: ["Adding the time to a draft"],
    text: "Here’s the email with that time. Approve it and it opens in your mail app.",
    card: {
      kind: "email",
      subject: `30-minute call: ${mine}`,
      body: draftBody(role, `\n\nWould ${mine} (your time) / ${ist} IST work for a 30-minute call?`),
    },
  };
}

interface Intent {
  match: RegExp;
  reply: (text: string, role: RoleKey | null) => Reply;
  /** Does something on the page (tour, tailoring, a draft, time slots), so it always stays scripted. */
  act?: true;
}

const INTENTS: Intent[] = [
  { match: /tailor|personali[sz]e|for me\b|i'?m a |recruiter|founder|hiring manager/, reply: tailorQuestion, act: true },
  {
    match: /gallery|screens?\b|screenshots?|visual|ui samples|designs? (?:samples|examples)|show me (?:the )?designs/,
    reply: () => ({
      steps: ["Opening the design gallery index"],
      text: "The design gallery has real screens and boards, each with an explanation:",
      list: [
        "Quinnox’s AIOps platform: knowledge graph, ticket analytics and integration recommendations (2020–21)",
        "FlexEHR patient site and appointment booking (2024)",
        "SaaSworld.club, a SaaS marketplace (2023)",
        "ShemarooMe streaming apps across phone, TV and web (2019)",
        "Two concept UX case studies: PetzMates and PetTrove",
      ],
      sources: [{ label: "Design gallery", href: "/portfolio" }],
    }),
  },
  {
    match: /tour|walk me|show me around|2[- ]?min|overview/,
    act: true,
    reply: () => ({
      steps: ["Reading the page structure", "Picking the strongest proof points", "Planning a 4-stop route"],
      text: "Here’s a 4-stop route that takes about two minutes:",
      list: ["The thesis", "The flagship case study", "How he works", "How to reach him"],
      card: { kind: "tour" },
    }),
  },
  {
    match: /email|intro|draft|write to|message/,
    act: true,
    reply: (_t, role) => ({
      steps: ["Reading contact preferences", "Drafting a short intro"],
      text: "Here’s a draft. Edit anything you like. Nothing is sent until you approve it in your mail app.",
      card: { kind: "email", subject: "Intro from your portfolio", body: draftBody(role, " Could we find 30 minutes this week?") },
    }),
  },
  {
    match: /call|meet|schedule|book|time to talk|find a time|availab/,
    act: true,
    reply: (t) => ({
      steps: ["Checking working hours (10:00–18:00 IST)", "Converting to your time zone"],
      text: `${/availab|free|open to/.test(t) ? "Yes, he’s open to full-time roles and consulting. " : ""}Here are three open slots, shown in your time zone. Pick one and I’ll draft the email.`,
      card: { kind: "slots" },
    }),
  },
  {
    match: /fit|lead|hire|qualif|design[- ]?system/,
    reply: () => ({
      steps: ["Searching case studies for design-system evidence", "Reading the token-psychology post", "Checking the process for governance"],
      text: "There’s strong evidence for a design-systems lead:",
      list: [
        "Architected one design-system spine across six product types, reaching 99% WCAG AA.",
        "At ConstructivIQ, his design system let 3 feature teams ship independently and halved handoff time.",
        "Documents token decisions together with the psychology behind each one (blog, Jul 2026).",
      ],
      after: "He has led teams of up to four designers. Worth confirming in a call: the size of the team you’re hiring for.",
      sources: [
        { label: "Design systems", target: anchors.card("ds") },
        { label: "ConstructivIQ", target: anchors.card("civ") },
        { label: "Token post", target: anchors.post("psychology-of-design-tokens") },
      ],
      options: [askTime, askEmail],
    }),
  },
  {
    match: /propert|real estate|\brent\w*\b|\bflat\b|apartment|home search|broker|hosamane/,
    reply: () => ({
      steps: ["Reading the Hosamane case study"],
      text: "Hosamane is his agentic-first home search for Bengaluru. He took it from desk research (300 coded reviews, 8 competitors, sourced market facts) to an agent with 19 typed tools and server-checked approvals, and a working prototype at four screen sizes. It passes 30 of 30 agent tests, including refusing to filter by religion, caste, diet or marital status.",
      sources: [{ label: "Hosamane case study", href: "/work/hosamane" }],
      options: [askTour],
    }),
  },
  {
    match: /health|medical|patient|clinic|doctor|hospital|\behr\b/,
    reply: () => ({
      steps: ["Reading the healthcare work"],
      text: "Healthcare runs through his work from both sides. For clinicians: EHR workflows for daycare surgery that cut clicks to patient data from 7 to 2 and save 2+ hours a shift. For patients: HealthAI, a patient app he designed end to end, where an AI symptom check recommends a level of care, then hands off to booking, a video consultation and records, across 50 screens.",
      sources: [
        { label: "EHR case study", target: anchors.card("ehr") },
        { label: "HealthAI case study", href: "/work/healthai" },
      ],
      options: [askTour],
    }),
  },
  {
    match: /ship|work|project|case|built|nocode|ehr|portfolio/,
    reply: () => ({
      steps: ["Reading the selected work"],
      text: "The flagship is MW-Inventory, an agent he designed and built end to end that takes a DOOH campaign from search to debrief. Shipped highlights include a construction cloud that reached $1.2M ARR, a NoCode builder that cut engineering dependency by 60%, and EHR workflows that save clinicians 2+ hours a shift.",
      sources: [
        { label: "MW-Inventory agent", target: anchors.flagship },
        { label: "ConstructivIQ", target: anchors.card("civ") },
        { label: "NoCode", target: anchors.card("nocode") },
      ],
      options: [askTour],
    }),
  },
  {
    match: /process|approach|method|how does he work|how do you work/,
    reply: () => ({
      steps: ["Reading the process section"],
      text: "Four phases: Understand, Decide, Design and Ship, which expand to eight stages on the full method page. Each stage has kill criteria. At the paradigm gate he scores agentic, hybrid, traditional and zero-UI options before any UI is drawn.",
      sources: [
        { label: "Process", target: anchors.processSteps },
        { label: "Full method", href: "/process" },
      ],
    }),
  },
  {
    match: /\bai\b|agent|tool|llm|gpt|claude/,
    reply: () => ({
      steps: ["Reading the flagship case study", "Checking the writing"],
      text: "He designs and builds agentic products. MW-Inventory is the clearest example: 18 typed tools behind one conversation, where every answer is an interactive view and booking stays a step the planner takes. At Moving Walls he also wrote the hybrid and agentic UI roadmap for a 7-product portfolio through 2027, and he uses 20+ AI tools day to day. I follow the same rules: I cite my sources and ask before I act.",
      sources: [
        { label: "MW-Inventory case study", href: "/work/agentic-inventory" },
        { label: "HealthAI case study", href: "/work/healthai" },
        { label: "AI tools post", href: "/blog/ai-changing-design" },
      ],
    }),
  },
];

/** The scripted intent a message matches, if any, and whether it acts on the page. */
export function routeIntent(text: string, role: RoleKey | null): { reply: Reply; act: boolean } | null {
  const t = text.toLowerCase();
  const intent = INTENTS.find((i) => i.match.test(t));
  return intent ? { reply: intent.reply(t, role), act: Boolean(intent.act) } : null;
}

/** Follow-up buttons the model may suggest; each runs the scripted flow. */
export function nextOptions(next: string[]) {
  const map: Record<string, ReturnType<typeof ask>> = { tour: askTour, tailor: askTailor, find_time: askTime, email: askEmail };
  return next.map((n) => map[n]).filter(Boolean);
}

export function replyFor(text: string, role: RoleKey | null): Reply {
  const t = text.toLowerCase();
  const intent = INTENTS.find((i) => i.match.test(t));
  if (intent) return intent.reply(t, role);
  return {
    steps: ["Searching this site"],
    text: "I couldn’t find that here, and I only answer from what’s on this site. Try asking about his work, process, AI experience or availability, or let me do something for you:",
    options: [askTour, askTailor],
  };
}
