import JsonLd from "@/components/JsonLd";
import { breadcrumbs, graph, pageMeta, PERSON_ID, webPage } from "@/lib/seo";

const description = "Real screens from shipped products and concepts, including Quinnox's AIOps platform, FlexEHR and ShemarooMe, each with the thinking behind it.";
const trail = [{ name: "Design gallery", path: "/portfolio" }];

export const metadata = pageMeta({ title: "Design gallery", ogTitle: "Design gallery", category: "Gallery", description, path: "/portfolio" });

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={graph(webPage({ path: "/portfolio", name: "Design gallery", description, type: "CollectionPage", trail, extra: { author: { "@id": PERSON_ID } } }), breadcrumbs(trail))} />
      {children}
    </>
  );
}
