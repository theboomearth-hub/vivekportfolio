import JsonLd from "@/components/JsonLd";
import { caseStudyIndex } from "@/lib/work/index";
import { abs, breadcrumbs, graph, webPage } from "@/lib/seo";
import WorkIndex from "./WorkIndex";

const description = "Case studies in AI and agentic products, programmatic DOOH, healthcare, construction cloud, IoT and design systems, each with role, decisions and results.";
const trail = [{ name: "Work", path: "/work" }];

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/work", name: "Work and case studies", description, type: "CollectionPage", trail, extra: { mainEntity: { "@id": `${abs("/work")}#list` } } }),
          breadcrumbs(trail),
          { "@type": "ItemList", "@id": `${abs("/work")}#list`, itemListElement: caseStudyIndex.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.title, url: abs(`/work/${c.slug}`) })) },
        )}
      />
      <WorkIndex />
    </>
  );
}
