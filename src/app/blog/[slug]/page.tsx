import { notFound } from "next/navigation";
import { getAllPosts } from "@/lib/blog";
import JsonLd from "@/components/JsonLd";
import { abs, breadcrumbs, graph, ogImage, PERSON_ID, webPage } from "@/lib/seo";
import BlogPostClient from "./BlogPostClient";

export function generateStaticParams() {
  return getAllPosts().map((post) => ({ slug: post.slug }));
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = getAllPosts().find((p) => p.slug === slug);
  // Unknown slugs get a real 404 instead of a 200 "not found" page.
  if (!post) notFound();
  const path = `/blog/${post.slug}`;
  const trail = [{ name: "Writing", path: "/blog" }, { name: post.title, path }];
  const jsonLd = graph(
    webPage({ path, name: post.title, description: post.excerpt, trail }),
    {
      "@type": "BlogPosting",
      "@id": `${abs(path)}#article`,
      headline: post.title,
      description: post.excerpt,
      datePublished: post.date,
      dateModified: post.date,
      keywords: post.tags.join(", "),
      articleSection: post.category,
      inLanguage: "en",
      image: abs(ogImage(post.title, post.category)),
      author: { "@id": PERSON_ID },
      publisher: { "@id": PERSON_ID },
      mainEntityOfPage: { "@id": `${abs(path)}#webpage` },
      isPartOf: { "@type": "Blog", "@id": `${abs("/blog")}#blog`, name: "Writing by Vivekanand Choudhari", url: abs("/blog") },
    },
    breadcrumbs(trail),
  );

  return (
    <>
      <JsonLd data={jsonLd} />
      <BlogPostClient slug={slug} />
    </>
  );
}
