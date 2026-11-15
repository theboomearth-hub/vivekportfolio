import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/blog";
import { SITE_URL } from "@/lib/site";
import { caseStudyIndex } from "@/lib/work/index";

export const dynamic = "force-static";

/**
 * Every indexable page. Case studies come from the same index as their metadata, so a new one can't be forgotten.
 * Not listed: /hosamane/share/* (private, noindex) and /api/*.
 */
const STATIC: { path: string; priority: number; changeFrequency: MetadataRoute.Sitemap[number]["changeFrequency"] }[] = [
  { path: "", priority: 1, changeFrequency: "monthly" },
  { path: "/work", priority: 0.9, changeFrequency: "monthly" },
  { path: "/about", priority: 0.8, changeFrequency: "monthly" },
  { path: "/process", priority: 0.8, changeFrequency: "monthly" },
  { path: "/craft", priority: 0.8, changeFrequency: "monthly" },
  { path: "/blog", priority: 0.8, changeFrequency: "weekly" },
  { path: "/hosamane", priority: 0.7, changeFrequency: "monthly" },
  { path: "/portfolio", priority: 0.7, changeFrequency: "monthly" },
  { path: "/research/forma", priority: 0.7, changeFrequency: "monthly" },
  { path: "/research/lokul", priority: 0.7, changeFrequency: "monthly" },
  { path: "/experiments", priority: 0.5, changeFrequency: "monthly" },
  { path: "/resume", priority: 0.6, changeFrequency: "monthly" },
  { path: "/contact", priority: 0.6, changeFrequency: "yearly" },
];

export default function sitemap(): MetadataRoute.Sitemap {
  const now = new Date();
  return [
    ...STATIC.map((p) => ({ url: `${SITE_URL}${p.path}`, lastModified: now, changeFrequency: p.changeFrequency, priority: p.priority })),
    ...caseStudyIndex.map((c) => ({ url: `${SITE_URL}/work/${c.slug}`, lastModified: now, changeFrequency: "monthly" as const, priority: 0.75 })),
    ...blogPosts.map((post) => ({ url: `${SITE_URL}/blog/${post.slug}`, lastModified: new Date(post.date), changeFrequency: "yearly" as const, priority: 0.7 })),
  ];
}
