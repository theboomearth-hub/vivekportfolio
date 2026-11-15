import JsonLd from "@/components/JsonLd";
import { breadcrumbs, creativeWork, graph, pageMeta, webPage } from "@/lib/seo";

const description = "Research on Lokul, a hyperlocal platform for urban India that makes the kirana, home cook and coach within 200 metres findable, verified and paid.";
const trail = [{ name: "Lokul research", path: "/research/lokul" }];

export const metadata = pageMeta({ title: "Lokul: hyperlocal platform research", ogTitle: "Lokul: the 200-metre economy", category: "Research", description, path: "/research/lokul", type: "article" });

export default function LokulResearchLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/research/lokul", name: "Lokul research", description, trail }),
          creativeWork({ path: "/research/lokul", headline: "Lokul: the 200-metre economy", description, about: ["Hyperlocal commerce", "Marketplaces", "Product strategy", "India"] }),
          breadcrumbs(trail),
        )}
      />
      {children}
    </>
  );
}
