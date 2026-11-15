/**
 * Questions people (and answer engines) ask about Vivekanand. Shown on /about and marked up there as FAQPage,
 * so the structured data always matches what's on the page. Answer first, one or two sentences, facts only.
 */
import { CONTACT_EMAIL } from "@/lib/site";

export const faqs: { q: string; a: string }[] = [
  {
    q: "What does Vivekanand Choudhari do?",
    a: "He is a senior UI/UX and AI product designer in Bengaluru, India. He designs B2B SaaS and AI products end to end, from research and design systems to working front-end code, and leads design across a seven-product programmatic DOOH portfolio at Moving Walls.",
  },
  {
    q: "What does he specialise in?",
    a: "AI and agentic interfaces, design systems, and data-heavy products. His work spans programmatic DOOH and AdTech, healthcare, construction cloud, AIOps, IIoT and big data.",
  },
  {
    q: "How much experience does he have?",
    a: "More than nine years of designing B2B SaaS and AI platforms, used by over a million people.",
  },
  {
    q: "Where is he based, and is he available?",
    a: "He is based in Bengaluru, India (IST), and is open to senior and lead design roles, full-time or remote, and to consulting.",
  },
  {
    q: "What tools does he design and build with?",
    a: "Figma for design, and React, TypeScript and Next.js to build. This site is one example: he designed and coded it.",
  },
  {
    q: "How do I contact him?",
    a: `Email ${CONTACT_EMAIL} or use the contact page. He replies within 24 hours.`,
  },
];

export const faqJsonLd = (pageUrl: string) => ({
  "@type": "FAQPage",
  "@id": `${pageUrl}#faq`,
  mainEntity: faqs.map((f) => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })),
});
