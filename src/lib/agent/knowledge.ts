/**
 * What the portfolio agent knows: this site's own content, as one Markdown brief, plus the pages it may cite.
 * Built from the same data the pages render, so the agent can't drift from the site. Server-side only.
 */
import { getAllPosts } from "@/lib/blog";
import { faqs } from "@/lib/faq";
import { credentials, flagship, processSteps, projectCards } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/site";
import { gallerySets } from "@/lib/work/gallery";
import { caseStudyIndex } from "@/lib/work/index";
import { projectData } from "@/lib/work/project-data";
import { facts as inventoryFacts } from "@/lib/work/agentic-inventory";
import { facts as hosamaneFacts } from "@/lib/work/hosamane";
import { facts as healthFacts } from "@/lib/work/healthai";
import { facts as taktFacts } from "@/lib/work/takt";

export type Page = { href: string; label: string };

/** Every page the agent may cite, with the label its source chip shows. */
export const PAGES: Page[] = [
  { href: "/work", label: "All work" },
  ...caseStudyIndex.map((c) => ({ href: `/work/${c.slug}`, label: `${c.seoTitle.split(":")[0]} case study` })),
  { href: "/hosamane", label: "Try Hosamane" },
  { href: "/about", label: "About" },
  { href: "/process", label: "Process" },
  { href: "/craft", label: "Craft labs" },
  { href: "/portfolio", label: "Design gallery" },
  { href: "/research/forma", label: "Forma research" },
  { href: "/research/lokul", label: "Lokul research" },
  { href: "/resume", label: "Résumé" },
  { href: "/contact", label: "Contact" },
  { href: "/blog", label: "Writing" },
  ...getAllPosts().map((p) => ({ href: `/blog/${p.slug}`, label: p.title.split(":")[0] })),
];

const CUSTOM_FACTS: Record<string, { term: string; detail: string }[]> = {
  "agentic-inventory": inventoryFacts,
  hosamane: hosamaneFacts,
  healthai: healthFacts,
  takt: taktFacts,
};

const CRAFT_LABS = [
  "Fitts's law lab: pointing time against difficulty, and what sticky targets give back",
  "Hick's law vs. searching: log-time choice when positions are predictable, straight-line search when they aren't",
  "Pop-out search: one-feature vs. two-feature search (Treisman and Gelade), and why the site uses one accent colour",
  "Latency threshold: a 2-down/1-up staircase that finds the smallest lag a visitor can detect",
  "Area lies, length doesn't: Stevens' power law and Cleveland and McGill's ranking of chart encodings",
  "Perceptual colour ramps: HSL vs. OKLCH lightness, and where white text passes WCAG AA by hue",
  "Spring physics: damping ratio, settling and overshoot, and why springs survive interruption",
  "Change blindness: the flicker paradigm on a live dashboard, and what a highlight fixes",
  "Progress bar illusions: backwards-moving ribs and bars that speed up at the end feel faster",
  "Trust calibration: approving an AI agent's proposals, scored with signal detection theory",
];

let cached: string | null = null;

/** The brief, built once per server instance. Deterministic, so the prompt cache can reuse it. */
export function siteBrief() {
  if (cached) return cached;
  const studies = caseStudyIndex.map((c) => {
    const p = projectData[c.slug];
    const lines = [`### ${c.title} (/work/${c.slug})`, c.description];
    for (const f of CUSTOM_FACTS[c.slug] ?? []) lines.push(`- ${f.term}: ${f.detail}`);
    if (p) {
      lines.push(`- Category: ${p.category}${p.timeline ? `; timeline ${p.timeline}` : ""}`);
      if (p.role) lines.push(`- Role: ${p.role.title}; ${p.role.scope}; team ${p.role.team}`);
      lines.push(`- Challenge: ${p.challenge}`, `- Approach: ${p.approach.join(" ")}`, `- Impact: ${p.impact.join("; ")}`);
      if (p.decisions?.length) lines.push(`- Decisions: ${p.decisions.map((d) => `${d.title}: ${d.choice} (${d.result})`).join(" | ")}`);
    }
    return lines.join("\n");
  });

  cached = [
    "## Profile",
    "Vivekanand Choudhari, Senior UI/UX & AI Product Designer, based in Bengaluru, India (IST).",
    ...credentials.map((c) => `- ${c.term}: ${c.detail}`),
    "- Experience: 9+ years, B2B SaaS and AI, products used by over a million people",
    "- Focus: design systems, AI and agentic products, complex data",
    "- Builds with: Figma, React, TypeScript, Next.js. He designed and coded this site.",
    `- Contact: ${CONTACT_EMAIL}, or the contact page. Replies within 24 hours. Open to senior and lead design roles (full-time, Bengaluru or remote) and consulting.`,
    "",
    "## Questions people ask",
    ...faqs.map((f) => `- ${f.q} ${f.a}`),
    "",
    "## Homepage flagship",
    `${flagship.title}. ${flagship.desc} ${flagship.summary.join(" ")}`,
    "",
    "## Homepage project highlights",
    ...projectCards.map((c) => `- ${c.title} (${c.domain}, ${c.years}): ${c.metrics.map((m) => (m.labelFirst ? `${m.label} ${m.value}` : `${m.value} ${m.label}`)).join(", ")}`),
    "",
    "## Case studies",
    ...studies,
    "",
    "## How he works (process)",
    ...processSteps.map((s) => `- ${s.n} ${s.title}: ${s.body}`),
    "The full method at /process has gates and kill criteria at every stage, and a paradigm choice between agentic, hybrid, traditional and zero-UI.",
    "",
    "## Craft: ten interactive labs at /craft",
    ...CRAFT_LABS.map((l) => `- ${l}`),
    "",
    "## Research",
    "- Forma (/research/forma): an open-core platform that lets one SaaS product adapt to every user. Research stage; no customers yet; figures there are targets.",
    "- Lokul (/research/lokul): a hyperlocal platform for urban India that makes the kirana, home cook and coach within 200 metres findable, verified and paid. Research project.",
    "",
    "## Design gallery (/portfolio): real screens with explanations",
    ...gallerySets.map((g) => `- ${g.title} (${g.kind}, ${g.when}): ${g.summary}`),
    "",
    "## Writing (/blog)",
    ...getAllPosts().map((p) => `- ${p.title} (${p.date}, /blog/${p.slug}): ${p.excerpt}`),
  ].join("\n");
  return cached;
}
