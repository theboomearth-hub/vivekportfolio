import { getAllPosts } from "@/lib/blog";
import { projectData } from "@/lib/work/project-data";
import { gallerySets } from "@/lib/work/gallery";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";

// Built once at build time from the same data the site renders, so it never drifts.
export const dynamic = "force-static";

/**
 * /llms.txt — a plain-Markdown map of the site for AI assistants
 * (https://llmstxt.org). Lets a visitor's own agent read the portfolio directly.
 */
export function GET() {
  const projects = Object.entries(projectData)
    .map(([slug, p]) => `- [${p.title}](${SITE_URL}/work/${slug}): ${p.category}${p.timeline ? `, ${p.timeline}` : ""}. ${p.heroDesc}`)
    .join("\n");

  const gallery = gallerySets
    .map((set) => `- [${set.title}](${SITE_URL}/portfolio#${set.slug}) (${set.kind}, ${set.when}): ${set.summary}`)
    .join("\n");

  const posts = getAllPosts()
    .map((post) => `- [${post.title}](${SITE_URL}/blog/${post.slug}) (${post.date}): ${post.excerpt}`)
    .join("\n");

  const body = `# Vivekanand Choudhari

> Senior UI/UX & AI Product Designer in Bengaluru, India. 9+ years designing B2B SaaS and AI platforms used by over a million people. Currently designing agentic AdTech at Moving Walls across a 7-product programmatic DOOH portfolio. Previously ConstructivIQ, Slate Technologies, Quinnox, Microland and Knowledge Lens.

Open to full-time roles and consulting. Contact: ${CONTACT_EMAIL} (replies within 24 hours).

## Case studies

- [MW-Inventory: an agent from search to debrief](${SITE_URL}/work/agentic-inventory): Agentic AI use case, designed and built solo (live prototype). A DOOH planning agent with 18 typed tools across discover, plan, propose, book, monitor and learn; every answer renders as an interactive view, and booking stays an explicit step the planner takes.
- [Hosamane: an agent that does a good broker's legwork](${SITE_URL}/work/hosamane): Agentic AI use case for Bengaluru home search (rent and buy), designed and built end to end (design concept with a working prototype). Desk research with 300 coded App Store reviews and sourced market facts; 19 typed tools with server-checked approvals and a never list; prototype captured at four screen sizes; 30 of 30 agent tests and 34 of 34 accessible states.
- [Try Hosamane](${SITE_URL}/hosamane): The working agent itself, running on this site. Describe a move in Bengaluru and it searches 60 fictional listings, checks them, works out the real cost and asks before contacting anyone.
- [HealthAI: from symptoms to a doctor’s plan](${SITE_URL}/work/healthai): Healthcare use case, designed end to end (design concept). An AI-first patient app for India: symptom check and triage, booking, UPI payment, video consultation and records, with the user flow, service blueprint, card sort, information architecture, accessibility results and 50 screens across phone, tablet and web.
${projects}

## Design gallery (real screens, with explanations)

${gallery}

## Pages

- [Process](${SITE_URL}/process): An 8-stage method from signal to ship, with kill criteria at every stage and a paradigm gate (agentic, hybrid, traditional or zero-UI).
- [About](${SITE_URL}/about): Background, skills and experience.
- [Résumé](${SITE_URL}/resume): Full work history.
- [Contact](${SITE_URL}/contact)

## Writing

${posts}

## Optional

- [Forma research](${SITE_URL}/research/forma)
- [Lokul.club research](${SITE_URL}/research/lokul)
- [Craft: interaction studies](${SITE_URL}/craft)
- [Experiments](${SITE_URL}/experiments)
`;

  return new Response(body, {
    headers: { "Content-Type": "text/plain; charset=utf-8" },
  });
}
