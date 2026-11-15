import type { Metadata } from "next";
import { getPostBySlug } from "@/lib/blog";
import { pageMeta, postTitle } from "@/lib/seo";

type Params = Promise<{ slug: string }>;

export async function generateMetadata({ params }: { params: Params }): Promise<Metadata> {
  const { slug } = await params;
  const post = getPostBySlug(slug);
  if (!post) return { title: "Post not found", robots: { index: false } };
  return {
    ...pageMeta({ title: postTitle(post.title), absoluteTitle: true, ogTitle: post.title, category: post.category, description: post.excerpt, path: `/blog/${slug}`, type: "article", published: post.date }),
    keywords: post.tags,
  };
}

export default function BlogPostLayout({ children }: { children: React.ReactNode }) {
  return children;
}
