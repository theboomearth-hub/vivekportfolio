import JsonLd from "@/components/JsonLd";
import { getAllPosts } from "@/lib/blog";
import { abs, breadcrumbs, graph, PERSON_ID, webPage } from "@/lib/seo";
import BlogIndex from "./BlogIndex";

const description = "Writing on design systems, AI in design and engineering, AdTech and DOOH, and how designers can think like engineers.";
const trail = [{ name: "Writing", path: "/blog" }];

export default function Page() {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/blog", name: "Writing", description, type: "CollectionPage", trail, extra: { mainEntity: { "@id": `${abs("/blog")}#blog` } } }),
          breadcrumbs(trail),
          {
            "@type": "Blog",
            "@id": `${abs("/blog")}#blog`,
            name: "Writing by Vivekanand Choudhari",
            url: abs("/blog"),
            author: { "@id": PERSON_ID },
            blogPost: getAllPosts().map((p) => ({ "@type": "BlogPosting", headline: p.title, url: abs(`/blog/${p.slug}`), datePublished: p.date, author: { "@id": PERSON_ID } })),
          },
        )}
      />
      <BlogIndex />
    </>
  );
}
