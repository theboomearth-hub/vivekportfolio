import { pageMeta } from "@/lib/seo";

const description = "Case studies in AI and agentic products, programmatic DOOH, healthcare, construction cloud, IoT and design systems, each with role, decisions and results.";

export const metadata = {
  ...pageMeta({ title: "Work and case studies", ogTitle: "Selected work and case studies", description, path: "/work" }),
  // The template is restated so /work/[slug] pages keep the "· Vivekanand Choudhari" suffix.
  title: { default: "Work and case studies", template: "%s · Vivekanand Choudhari" },
};

export default function WorkLayout({ children }: { children: React.ReactNode }) {
  return children;
}
