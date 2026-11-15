/**
 * One source for page metadata and structured data.
 *
 * Next merges metadata shallowly: a page that sets `openGraph` replaces the root's object entirely, so every page
 * builds its full set here (canonical, Open Graph with url and image, Twitter card). Titles take the root template
 * ("%s · Vivekanand Choudhari"); descriptions are trimmed to whole sentences that fit a search result.
 *
 * Structured data uses one @graph per page, with stable @ids so the Person, the WebSite and each page link up:
 * search engines and answer engines then read one person with many works, not many unrelated snippets.
 */
import type { Metadata } from "next";
import { SITE_URL } from "@/lib/site";

export const SITE_NAME = "Vivekanand Choudhari";
export const PERSON_ID = `${SITE_URL}/#person`;
export const WEBSITE_ID = `${SITE_URL}/#website`;
export const abs = (path: string) => (path.startsWith("http") ? path : `${SITE_URL}${path === "/" ? "" : path}`);

/** Whole sentences up to `max` characters; if the first sentence alone is longer, cut at a word with an ellipsis. */
export function metaDescription(text: string, max = 155) {
  const clean = text.replace(/\s+/g, " ").trim();
  if (clean.length <= max) return clean;
  const sentences = clean.match(/[^.!?]+[.!?]+(\s|$)/g) ?? [clean];
  let out = "";
  for (const s of sentences) {
    if ((out + s).trim().length > max) break;
    out += s;
  }
  if (out.trim().length >= 70) return out.trim();
  const cut = clean.slice(0, max - 1);
  return `${cut.slice(0, cut.lastIndexOf(" ")).replace(/[,;:—–-]$/, "")}…`;
}

/** The full title with the name if it fits in 60 characters, else the full title, else the part before the colon. */
export function postTitle(title: string) {
  const withName = `${title} · ${SITE_NAME}`;
  if (withName.length <= 60) return withName;
  if (title.length <= 60) return title;
  const head = title.split(/:\s| — /)[0];
  return head.length + SITE_NAME.length + 3 <= 60 ? `${head} · ${SITE_NAME}` : head;
}

/** The generated share image for a page. */
export const ogImage = (title: string, category = "Portfolio") => `/api/og?title=${encodeURIComponent(title)}&category=${encodeURIComponent(category)}`;

type Image = { url: string; width: number; height: number; alt: string };

export function pageMeta({
  title,
  description,
  path,
  ogTitle,
  category = "Portfolio",
  image,
  type = "website",
  absoluteTitle = false,
  noindex = false,
  published,
  modified,
}: {
  title: string;
  description: string;
  path: string;
  /** Longer title for share cards, where there's more room than in a search result. */
  ogTitle?: string;
  category?: string;
  image?: Image;
  type?: "website" | "article" | "profile";
  absoluteTitle?: boolean;
  noindex?: boolean;
  published?: string;
  modified?: string;
}): Metadata {
  const desc = metaDescription(description);
  const share = ogTitle ?? title;
  const img = image ?? { url: ogImage(share, category), width: 1200, height: 630, alt: share };
  return {
    title: absoluteTitle ? { absolute: title } : title,
    description: desc,
    alternates: { canonical: path },
    openGraph: {
      title: share,
      description: desc,
      url: path,
      siteName: SITE_NAME,
      locale: "en_US",
      type,
      images: [img],
      ...(type === "article" ? { authors: [SITE_URL], ...(published ? { publishedTime: published } : {}), ...(modified ? { modifiedTime: modified } : {}) } : {}),
    },
    twitter: { card: "summary_large_image", title: share, description: desc, images: [img.url] },
    ...(noindex ? { robots: { index: false, follow: true } } : {}),
  };
}

/* ── Structured data ─────────────────────────────────────────────────── */

export type Crumb = { name: string; path: string };

export function breadcrumbs(trail: Crumb[]) {
  const all = [{ name: "Home", path: "/" }, ...trail];
  return {
    "@type": "BreadcrumbList",
    "@id": `${abs(trail.at(-1)?.path ?? "/")}#breadcrumb`,
    itemListElement: all.map((c, i) => ({ "@type": "ListItem", position: i + 1, name: c.name, item: abs(c.path) })),
  };
}

/** A WebPage node (or a subtype) that sits in the site, is about/by the person, and carries its breadcrumb. */
export function webPage({ path, name, description, type = "WebPage", trail, extra = {} }: { path: string; name: string; description: string; type?: string; trail?: Crumb[]; extra?: Record<string, unknown> }) {
  return {
    "@type": type,
    "@id": `${abs(path)}#webpage`,
    url: abs(path),
    name,
    description: metaDescription(description, 300),
    inLanguage: "en",
    isPartOf: { "@id": WEBSITE_ID },
    ...(trail ? { breadcrumb: { "@id": `${abs(path)}#breadcrumb` } } : {}),
    ...extra,
  };
}

/** A case study or research write-up: authored by the person, part of its page. */
export function creativeWork({ path, headline, description, about, image, type = "Article", keywords }: { path: string; headline: string; description: string; about?: string[]; image?: string; type?: string; keywords?: string[] }) {
  return {
    "@type": type,
    "@id": `${abs(path)}#work`,
    headline,
    name: headline,
    description: metaDescription(description, 300),
    url: abs(path),
    mainEntityOfPage: { "@id": `${abs(path)}#webpage` },
    author: { "@id": PERSON_ID },
    creator: { "@id": PERSON_ID },
    inLanguage: "en",
    ...(image ? { image: abs(image) } : {}),
    ...(about?.length ? { about: about.map((a) => ({ "@type": "Thing", name: a })) } : {}),
    ...(keywords?.length ? { keywords: keywords.join(", ") } : {}),
  };
}

export const graph = (...nodes: object[]) => ({ "@context": "https://schema.org", "@graph": nodes });
