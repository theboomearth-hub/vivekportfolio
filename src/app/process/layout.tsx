import JsonLd from "@/components/JsonLd";
import { breadcrumbs, creativeWork, graph, pageMeta, webPage } from "@/lib/seo";

const description = "A product design method from signal and design brief through research, psychology mapping, flows and UI to validation and launch, with a gate at every stage.";
const trail = [{ name: "Process", path: "/process" }];

export const metadata = pageMeta({ title: "Process: from idea to shipped", ogTitle: "From Idea to Shipped", category: "The Process", description, path: "/process", type: "article" });

export default function ProcessLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/process", name: "Process: from idea to shipped", description, trail }),
          creativeWork({ path: "/process", headline: "From idea to shipped: a gated product design method", description, about: ["Product design process", "UX research", "Behavioral psychology", "Agentic UI"] }),
          breadcrumbs(trail),
        )}
      />
      {children}
    </>
  );
}
