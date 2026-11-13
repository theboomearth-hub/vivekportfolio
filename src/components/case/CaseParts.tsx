/**
 * Shared building blocks for the long-form case studies (/work/agentic-inventory, /work/healthai).
 * Server components only: plain markup, no state.
 */
import Image from "next/image";
import Link from "next/link";

export interface CaseImage {
  src: string;
  width: number;
  height: number;
  alt: string;
}

/** Small mono eyebrow used above section titles and on labels. */
export const caseLabel = "font-mono text-xs uppercase tracking-[0.06em] text-muted";

export function Arrow({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" className={`h-3.5 w-3.5 ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d="M7 17L17 7M8 7h9v9" />
    </svg>
  );
}

export function BackLink() {
  return (
    <Link href="/work" className="inline-flex items-center gap-1.5 py-2.5 text-sm text-muted hover:text-foreground">
      <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <path d="M19 12H5M11 18l-6-6 6-6" />
      </svg>
      All work
    </Link>
  );
}

/** Domain line under the back link, with the status dot. */
export function CaseKicker({ domain, status }: { domain: string; status: string }) {
  return (
    <p className="mt-6 flex flex-wrap items-center gap-x-2 text-caption text-muted">
      <span>{domain}</span>
      <span aria-hidden="true">·</span>
      <span className="inline-flex items-center gap-1.5">
        <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
        {status}
      </span>
    </p>
  );
}

export function FactList({ facts }: { facts: { term: string; detail: string }[] }) {
  return (
    <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
      {facts.map((f) => (
        <div key={f.term}>
          <dt className="text-caption text-muted">{f.term}</dt>
          <dd className="mt-1 text-compact leading-normal">{f.detail}</dd>
        </div>
      ))}
    </dl>
  );
}

export function Shot({
  image,
  sizes,
  priority = false,
  caption,
  rounded = "rounded-xl",
}: {
  image: CaseImage;
  sizes: string;
  priority?: boolean;
  caption?: string;
  rounded?: string;
}) {
  return (
    <figure className="m-0">
      <div className={`overflow-hidden bg-surface ring-1 ring-border ${rounded}`}>
        <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes={sizes} priority={priority} className="h-auto w-full" />
      </div>
      {caption && <figcaption className="mt-2 text-caption text-muted">{caption}</figcaption>}
    </figure>
  );
}

export function Section({
  id,
  eyebrow,
  title,
  children,
  intro,
  tone = "plain",
}: {
  id: string;
  eyebrow: string;
  title: string;
  intro?: React.ReactNode;
  children: React.ReactNode;
  /** "tint" sets the section on the surface colour, to give long pages a rhythm of bands. */
  tone?: "plain" | "tint";
}) {
  return (
    <section id={id} aria-labelledby={`${id}-title`} className={`scroll-mt-24 py-24 md:py-28 ${tone === "tint" ? "bg-surface" : "border-t border-border"}`}>
      <div className="container-premium">
        <p className={caseLabel}>{eyebrow}</p>
        <h2 id={`${id}-title`} className="mt-2.5 max-w-[24ch]">
          {title}
        </h2>
        {intro && <div className="mt-4 max-w-[62ch] text-lg leading-relaxed text-muted">{intro}</div>}
        <div className="mt-12">{children}</div>
      </div>
    </section>
  );
}

/** Numbered card list used for principles, stages and similar grids. */
export function NumberedGrid({ items, cols = "md:grid-cols-2 lg:grid-cols-3" }: { items: { title: string; body: React.ReactNode }[]; cols?: string }) {
  return (
    <ol className={`grid gap-x-10 gap-y-10 ${cols}`}>
      {items.map((p, i) => (
        <li key={p.title} className="border-t border-border-strong pt-5">
          <p className="font-mono text-xs tracking-[0.06em] text-accent">{String(i + 1).padStart(2, "0")}</p>
          <h3 className="mt-2 text-lg">{p.title}</h3>
          <div className="mt-2 text-compact leading-relaxed text-muted">{p.body}</div>
        </li>
      ))}
    </ol>
  );
}

export function BulletList({ items }: { items: React.ReactNode[] }) {
  return (
    <ul className="grid max-w-[70ch] gap-4">
      {items.map((s, i) => (
        <li key={i} className="flex gap-3 text-lg leading-relaxed">
          <span aria-hidden="true" className="mt-[0.7em] h-1 w-1 shrink-0 rounded-full bg-accent" />
          <span>{s}</span>
        </li>
      ))}
    </ul>
  );
}

export function CaseCta({ title }: { title: string }) {
  return (
    <section aria-labelledby="cta-title" className="border-t border-border py-24">
      <div className="container-premium">
        <h2 id="cta-title" className="max-w-[20ch] text-display">
          {title}
        </h2>
        <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
          <Link href="/contact" className="inline-flex min-h-11 items-center rounded-lg bg-foreground px-5 text-compact font-medium text-background hover:bg-accent">
            Start a conversation
          </Link>
          <Link href="/work" className="inline-flex items-center gap-1.5 py-2.5 font-medium underline decoration-border-strong underline-offset-4 hover:text-accent">
            See all work
          </Link>
        </div>
      </div>
    </section>
  );
}

/** "On this page" index for long case studies. */
export function CaseIndex({ items }: { items: { id: string; label: string }[] }) {
  return (
    <nav aria-label="On this page" className="mt-12 border-t border-border pt-6">
      <p className={caseLabel}>On this page</p>
      <ol className="mt-3 flex flex-wrap gap-x-5 gap-y-1.5 text-compact">
        {items.map((it, i) => (
          <li key={it.id}>
            <a href={`#${it.id}`} className="inline-flex min-h-8 items-center gap-1.5 text-muted hover:text-foreground">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              {it.label}
            </a>
          </li>
        ))}
      </ol>
    </nav>
  );
}
