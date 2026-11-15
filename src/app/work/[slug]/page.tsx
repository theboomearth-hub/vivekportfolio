import type { Metadata } from "next";
import CaseStudyJsonLd from "@/components/CaseStudyJsonLd";
import { pageMeta } from "@/lib/seo";
import { caseStudy } from "@/lib/work/index";
import { notFound } from "next/navigation";
import { projectData } from "@/lib/work/project-data";
import CaseStudyClient from "./CaseStudyClient";

/**
 * Server shell. It exists so each case study can export its own metadata —
 * a "use client" page can't, which is why every case study previously
 * inherited the parent layout's static "Work | Vivekanand Choudhari".
 */

export function generateStaticParams() {
  // Derived from the data so a new case study is prerendered automatically.
  return Object.keys(projectData).map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const project = projectData[slug];
  const entry = caseStudy(slug);
  if (!project || !entry) return { title: "Case study", robots: { index: false } };
  return pageMeta({ title: entry.seoTitle, ogTitle: project.title, category: project.category, description: project.heroDesc, path: `/work/${slug}`, type: "article" });
}

export default async function CaseStudyPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  // Unknown slugs must be a real 404 (status + noindex), not a 200 page that
  // says "Project not found" — search engines index those as soft 404s.
  if (!projectData[slug]) notFound();
  return (
    <>
      <CaseStudyJsonLd slug={slug} />
      <CaseStudyClient slug={slug} />
    </>
  );
}
