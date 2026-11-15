import JsonLd from "@/components/JsonLd";
import { breadcrumbs, creativeWork, graph, pageMeta, webPage } from "@/lib/seo";

const description = "Research on Forma, an open-core platform that lets one SaaS product adapt to every user: architecture, 536 components, personas, market and status.";
const trail = [{ name: "Forma research", path: "/research/forma" }];

export const metadata = pageMeta({ title: "Forma: manifest-driven UI research", ogTitle: "Forma: infrastructure for malleable software", category: "Research", description, path: "/research/forma", type: "article" });

export default function FormaResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/research/forma", name: "Forma research", description, trail }),
          creativeWork({ path: "/research/forma", headline: "Forma: infrastructure for malleable software", description, about: ["Malleable software", "Design systems", "Server-driven UI", "B2B SaaS"] }),
          breadcrumbs(trail),
        )}
      />
      {children}
    </>
  );
}
