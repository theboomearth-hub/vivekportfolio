import { pageMeta } from "@/lib/seo";

const description = "Writing on design systems, AI in design and engineering, AdTech and DOOH, and how designers can think like engineers.";

// A plain string title here also means posts set their own full titles (see blog/[slug]/layout.tsx).
export const metadata = pageMeta({ title: "Writing on design, AI and AdTech", ogTitle: "Insights & Ideas", category: "Blog", description, path: "/blog" });

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
