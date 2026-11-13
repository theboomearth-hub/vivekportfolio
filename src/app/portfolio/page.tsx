import Link from "next/link";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import { gallerySets, galleryScreenCount } from "@/lib/work/gallery";

const label = "font-mono text-xs uppercase tracking-[0.06em] text-muted";

export default function DesignGalleryPage() {
  return (
    <div className="pb-24 pt-32 md:pt-40">
      <div className="container-premium">
        <header className="max-w-[60ch]">
          <p className={label}>Design gallery</p>
          <h1 className="mt-4">Real screens, with the thinking behind them.</h1>
          <p className="mt-6 text-lg leading-relaxed text-muted">
            {galleryScreenCount} screens and boards from shipped products and concept case studies. Each set explains what it is and what to look for. Select any
            screen to see it full size.
          </p>
          <p className="mt-4 text-compact text-muted">
            Looking for the full stories?{" "}
            <Link href="/work" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">
              Read the case studies
            </Link>
            .
          </p>
        </header>

        <nav aria-label="Design sets" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {gallerySets.map((set) => (
              <li key={set.slug}>
                <a
                  href={`#${set.slug}`}
                  className="inline-flex min-h-9 items-center rounded-full px-3.5 text-sm text-muted ring-1 ring-border ring-inset transition-colors hover:bg-surface hover:text-foreground"
                >
                  {set.title.split(",")[0]}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      {gallerySets.map((set) => (
        <section key={set.slug} id={set.slug} aria-labelledby={`${set.slug}-title`} className="mt-20 scroll-mt-24 border-t border-border pt-14 md:mt-24 md:pt-16">
          <div className="container-premium grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,2fr)] lg:gap-14">
            <div className="lg:sticky lg:top-28 lg:self-start">
              <p className="flex flex-wrap gap-x-2 text-caption text-muted">
                <span>{set.kind}</span>
                <span aria-hidden="true">·</span>
                <span>{set.when}</span>
              </p>
              <h2 id={`${set.slug}-title`} className="mt-2">
                {set.title}
              </h2>
              <p className="mt-1 text-sm text-muted">
                {set.platforms}
                {set.facts ? ` · ${set.facts}` : ""}
              </p>
              <p className="mt-5 leading-relaxed text-muted">{set.summary}</p>
              <h3 className="mt-6 font-mono text-xs font-normal uppercase tracking-[0.06em] text-muted">What to look for</h3>
              <ul className="mt-3 grid gap-2.5 text-compact leading-relaxed">
                {set.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5">
                    <span aria-hidden="true" className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-accent" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
              {(set.links?.length || set.note) && (
                <div className="mt-6 grid gap-2 text-sm">
                  {set.links?.map((l) => {
                    const external = l.href.startsWith("http");
                    return (
                      <a
                        key={l.href}
                        href={l.href}
                        {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                        className="inline-flex w-fit items-center gap-1.5 py-1.5 font-medium underline decoration-border-strong underline-offset-4 hover:text-accent"
                      >
                        {l.label}
                        {external && <span className="sr-only"> (opens in a new tab)</span>}
                        <svg viewBox="0 0 24 24" className="h-3.5 w-3.5" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                          <path d={external ? "M7 17L17 7M8 7h9v9" : "M5 12h14M13 6l6 6-6 6"} />
                        </svg>
                      </a>
                    );
                  })}
                  {set.note && <p className="text-muted">{set.note}</p>}
                </div>
              )}
            </div>
            <GalleryGrid set={set} />
          </div>
        </section>
      ))}
    </div>
  );
}
