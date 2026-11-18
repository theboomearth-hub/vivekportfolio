/**
 * Every case study in one list, for metadata and structured data: the full title, a short title that fits a search
 * result alongside " · Vivekanand Choudhari", a description, and the topics it covers. The order matches /work.
 */
import { projectData } from "@/lib/work/project-data";

export type CaseStudyEntry = { slug: string; title: string; seoTitle: string; description: string; about: string[]; image?: string };

/** Short titles for the case studies whose full title is too long for a search result. */
const SHORT: Record<string, string> = {
  "mw-cinema": "MW Cinema: programmatic cinema",
  "mw-posterops": "MW PosterOps: closed-loop OOH",
  "ai-strategy": "Platform AI strategy to 2027",
  "design-systems-scale": "Design systems at scale",
  "constructiviq-construction-cloud": "ConstructivIQ construction cloud",
};

const custom: CaseStudyEntry[] = [
  {
    slug: "ambient-memory",
    title: "Ambient Memory: from cluttered to calm",
    seoTitle: "Ambient Memory: an AI memory app people trust",
    description: "An always-available AI memory layer, designed end to end as a concept: research plan, personas, card-sort kit, information architecture, 35 screens in light and dark from one token set, a prototype, an accessibility audit, privacy by design and a launch plan.",
    about: ["AI product design", "Design systems", "Information architecture", "Privacy by design", "Accessibility"],
    image: "/work/ambient-memory/cover.jpg",
  },
  {
    slug: "takt",
    title: "Takt: one picture of four factories",
    seoTitle: "Takt: an Industry 4.0 data platform",
    description: "An Industry 4.0 data platform for a multi-plant auto-parts maker, end to end as product manager and designer: business case, research, information architecture with a live tree test, metrics and roadmap.",
    about: ["Industry 4.0", "IIoT", "Information architecture", "Product management", "ISA-95"],
  },
  {
    slug: "agentic-inventory",
    title: "MW-Inventory: an agent from search to debrief",
    seoTitle: "MW-Inventory: a DOOH planning agent",
    description: "Designing and building a conversational agent that takes a DOOH campaign from search to plan, proposal, booking, pacing and debrief in one conversation.",
    about: ["Agentic UI", "Conversational AI", "Programmatic DOOH", "Design engineering"],
    image: "/work/agentic-inventory/product-frame.jpg",
  },
  {
    slug: "hosamane",
    title: "Hosamane: an agent that does a good broker's legwork",
    seoTitle: "Hosamane: an agentic home search",
    description: "An agentic-first home search for Bengaluru, renting and buying: desk research with 300 coded reviews, an agent with typed tools and approvals, and a working prototype.",
    about: ["Agentic UI", "PropTech", "UX research", "AI product design"],
  },
  {
    slug: "healthai",
    title: "HealthAI: from symptoms to a doctor's plan",
    seoTitle: "HealthAI: an AI-first patient app",
    description: "An AI-first patient app for India: symptom check, triage, booking, UPI payment, video consultation and records, designed across phone, tablet and web.",
    about: ["Healthcare UX", "AI product design", "Service design", "Information architecture"],
  },
];

const legacy: CaseStudyEntry[] = Object.entries(projectData).map(([slug, p]) => ({
  slug,
  title: p.title,
  seoTitle: SHORT[slug] ?? p.title,
  description: p.heroDesc,
  about: p.tags.slice(0, 5),
  image: p.heroImage,
}));

export const caseStudyIndex: CaseStudyEntry[] = [...custom, ...legacy];
export const caseStudy = (slug: string) => caseStudyIndex.find((c) => c.slug === slug);
