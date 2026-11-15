import JsonLd from "@/components/JsonLd";
import { breadcrumbs, graph, pageMeta, webPage } from "@/lib/seo";

const description = "Hands-on experiments: AI agents, automation pipelines, design-system prototypes and full-stack proofs of concept, with notes on what each one taught.";
const trail = [{ name: "Experiments", path: "/experiments" }];

export const metadata = pageMeta({ title: "Experiments", ogTitle: "Experiments", category: "Lab", description, path: "/experiments" });

export default function ExperimentsLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={graph(webPage({ path: "/experiments", name: "Experiments", description, type: "CollectionPage", trail }), breadcrumbs(trail))} />
      {children}
    </>
  );
}
