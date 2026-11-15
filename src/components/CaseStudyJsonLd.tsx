import JsonLd from "@/components/JsonLd";
import { breadcrumbs, creativeWork, graph, webPage } from "@/lib/seo";
import { caseStudy } from "@/lib/work/index";

/** WebPage + Article (authored by the person) + breadcrumb for one case study. */
export default function CaseStudyJsonLd({ slug }: { slug: string }) {
  const c = caseStudy(slug);
  if (!c) return null;
  const path = `/work/${slug}`;
  const trail = [{ name: "Work", path: "/work" }, { name: c.seoTitle, path }];
  return (
    <JsonLd
      data={graph(
        webPage({ path, name: c.title, description: c.description, trail }),
        creativeWork({ path, headline: c.title, description: c.description, about: c.about, image: c.image }),
        breadcrumbs(trail),
      )}
    />
  );
}
