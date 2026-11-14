"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import Doodle from "@/components/sketch/Doodle";

/** A doodle for each writing category, from the site's sketch library. */
export const categoryDoodle: Record<string, string> = {
  "Design Systems": "system",
  "AI × Design": "ai",
  "System Design": "flows",
  "Industry Insights": "billboard",
  "Case Study": "approach",
  "Frontend Engineering": "code",
};

interface BlogCardProps {
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  slug: string;
  index: number;
  featured?: boolean;
}

export default function BlogCard({
  title,
  excerpt,
  date,
  readTime,
  category,
  slug,
  index,
  featured = false,
}: BlogCardProps) {
  if (featured) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.7 }}
      >
        <Link href={`/blog/${slug}`} className="group block">
          <div className="relative overflow-hidden rounded-2xl bg-surface border border-border p-6 sm:p-8 lg:p-12 transition-all duration-500 group-hover:border-accent/30">
            <Doodle name={categoryDoodle[category] ?? "prd"} className="absolute top-6 right-6 hidden h-24 w-24 text-foreground transition-transform duration-500 [stroke-width:1.2] group-hover:-rotate-6 sm:block lg:top-10 lg:right-10 lg:h-28 lg:w-28" />
            <p className="text-accent font-mono text-xs uppercase tracking-[0.06em] mb-4">
              Featured &middot; {category}
            </p>
            <h3 className="text-2xl mb-4 group-hover:text-accent transition-colors leading-tight">
              {title}
            </h3>
            <p className="text-muted text-base sm:text-lg leading-relaxed mb-6 max-w-2xl">
              {excerpt}
            </p>
            <div className="flex items-center gap-4 text-sm text-muted">
              <span>{date}</span>
              <span>&middot;</span>
              <span>{readTime}</span>
            </div>
          </div>
        </Link>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.1 }}
    >
      <Link href={`/blog/${slug}`} className="group block h-full">
        <div className="h-full rounded-2xl bg-surface border border-border p-6 lg:p-8 transition-all duration-500 group-hover:border-accent/30 group-hover:bg-surface-hover flex flex-col">
          <div className="mb-3 flex items-start justify-between gap-4">
            <p className="text-accent font-mono text-xs uppercase tracking-[0.06em]">
              {category}
            </p>
            <Doodle name={categoryDoodle[category] ?? "prd"} className="h-10 w-10 shrink-0 text-foreground transition-transform duration-500 group-hover:-rotate-6" />
          </div>
          <h3 className="text-xl lg:text-2xl mb-3 group-hover:text-accent transition-colors leading-tight grow">
            {title}
          </h3>
          <p className="text-muted leading-relaxed mb-4 line-clamp-3">
            {excerpt}
          </p>
          <div className="flex items-center gap-4 text-sm text-muted mt-auto">
            <span>{date}</span>
            <span>&middot;</span>
            <span>{readTime}</span>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
