import { getAllPosts } from "@/lib/blog";
import { faqs } from "@/lib/faq";
import { CONTACT_EMAIL, SITE_URL } from "@/lib/site";
import { caseStudyIndex } from "@/lib/work/index";
import { projectData } from "@/lib/work/project-data";

export const dynamic = "force-static";

/**
 * /llms-full.txt: the substance of the site in one plain-Markdown file, for AI assistants and answer engines that
 * would rather read than crawl. Built at build time from the same data the pages render. /llms.txt is the short map.
 */
export function GET() {
  const studies = caseStudyIndex
    .map((c) => {
      const p = projectData[c.slug];
      const lines = [`## ${c.title}`, `URL: ${SITE_URL}/work/${c.slug}`, "", c.description];
      if (p) {
        lines.push("", `Category: ${p.category}${p.timeline ? ` · ${p.timeline}` : ""}`);
        if (p.role) lines.push(`Role: ${p.role.title}`);
        lines.push("", "### Challenge", p.challenge, "", "### Approach", ...p.approach.map((a) => `- ${a}`), "", "### Impact", ...p.impact.map((a) => `- ${a}`));
        if (p.features?.length) lines.push("", "### What was built", ...p.features.map((f) => `- ${f.title}: ${f.desc}`));
        if (p.decisions?.length) lines.push("", "### Decisions", ...p.decisions.map((d) => `- ${d.title}: ${d.choice}`));
      }
      return lines.join("\n");
    })
    .join("\n\n");

  const posts = getAllPosts()
    .map((post) => [`## ${post.title}`, `URL: ${SITE_URL}/blog/${post.slug} · ${post.date} · ${post.category}`, "", post.content.trim()].join("\n"))
    .join("\n\n");

  const body = `# Vivekanand Choudhari: full text

> Senior UI/UX & AI Product Designer in Bengaluru, India. 9+ years designing B2B SaaS and AI platforms. Contact: ${CONTACT_EMAIL}. Short map: ${SITE_URL}/llms.txt

# Questions people ask

${faqs.map((f) => `## ${f.q}\n${f.a}`).join("\n\n")}

# Case studies

${studies}

# Writing

${posts}
`;

  return new Response(body, { headers: { "Content-Type": "text/plain; charset=utf-8" } });
}
