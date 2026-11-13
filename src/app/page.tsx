import Image from "next/image";
import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { getAllPosts } from "@/lib/blog";
import {
  alsoProjects,
  anchors,
  credentials,
  flagship,
  processSteps,
  projectCards,
  type FactLabel,
  type Metric,
} from "@/lib/home";
import { AgentProvider } from "@/components/home/Agent";
import {
  ContactActions,
  ContactTimes,
  Facts,
  ForYouNote,
  HeroAsk,
  ProjectGrid,
  Quotes,
  Reveal,
  Summarize,
} from "@/components/home/parts";
import Sketch from "@/components/home/Sketch";
import Doodle from "@/components/sketch/Doodle";
import { StepStrip } from "@/components/sketch/flows";
import HeroScribble from "@/components/sketch/HeroScribble";
import s from "@/components/home/home.module.css";

/** Staggered CSS entrance for the hero (see .rise in home.module.css). */
const rise = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const label = "font-mono text-xs uppercase tracking-[0.06em] text-muted";

function Arrow({ down = false }: { down?: boolean }) {
  return (
    <svg viewBox="0 0 24 24" className="h-3.5 w-3.5 transition-transform group-hover:translate-x-[3px]" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <path d={down ? "M12 5v14M6 13l6 6 6-6" : "M5 12h14M13 6l6 6-6 6"} />
    </svg>
  );
}

function TextLink({ href, children, down }: { href: string; children: ReactNode; down?: boolean }) {
  return (
    <Link href={href} className="group inline-flex items-center gap-1.5 py-2.5 font-medium underline decoration-foreground underline-offset-[6px] transition-colors hover:text-accent hover:decoration-accent">
      {children}
      <Arrow down={down} />
    </Link>
  );
}

function SectionHead({ eyebrow, title, id, action }: { eyebrow: string; title: string; id: string; action?: ReactNode }) {
  return (
    <Reveal className="mb-12 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-6">
      <div>
        <p className={label}>{eyebrow}</p>
        <h2 id={id} className="mt-2.5">
          {title}
        </h2>
      </div>
      {action}
    </Reveal>
  );
}

function Metrics({ items }: { items: Metric[] }) {
  return (
    <p className="flex flex-wrap gap-x-5 gap-y-1 text-sm text-muted">
      {items.map((m) => (
        <span key={m.label}>
          {m.labelFirst ? (
            <>
              {m.label} <b className="font-medium text-foreground">{m.value}</b>
            </>
          ) : (
            <>
              <b className="font-medium text-foreground">{m.value}</b> {m.label}
            </>
          )}
        </span>
      ))}
    </p>
  );
}

const monthYear = (iso: string) =>
  new Intl.DateTimeFormat("en-US", { month: "short", year: "numeric", timeZone: "UTC" }).format(new Date(iso));

export default function HomePage() {
  const posts = getAllPosts().slice(0, 3);

  const facts: { label: FactLabel; node: ReactNode }[] = [
    { label: "Experience", node: "9+ years, B2B SaaS and AI" },
    { label: "Currently", node: "Design lead, 7-product DOOH portfolio" },
    { label: "Focus", node: "Design systems, AI products, complex data" },
    { label: "Builds with", node: "Figma, React, TypeScript, Next.js" },
    {
      label: "Research",
      node: (
        <>
          {[
            ["/research/forma", "Forma"],
            ["/research/lokul", "Lokul.club"],
            ["/craft", "Craft studies"],
          ].map(([href, text], i, arr) => (
            <span key={href}>
              <Link href={href} className="inline-block py-[3px] underline decoration-border-strong underline-offset-4 hover:text-accent hover:decoration-accent">
                {text}
              </Link>
              {i < arr.length - 1 ? ", " : ""}
            </span>
          ))}
        </>
      ),
    },
    { label: "Based in", node: "Bengaluru, India (IST)" },
  ];

  return (
    <AgentProvider>
      {/* ── HERO ─────────────────────────────────────────── */}
      <section aria-labelledby={anchors.heroTitle} className="pb-24 pt-36 md:pb-28 md:pt-48">
        <div className="container-premium relative">
          <HeroScribble className="pointer-events-none absolute top-14 right-[120px] hidden w-[400px] xl:block" />
          <div className={`${s.rise} flex items-center gap-3`} style={rise(0)}>
            <span role="img" aria-label="Vivekanand Choudhari" className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-surface font-mono text-xs text-muted ring-1 ring-border-strong ring-inset">
              VC
            </span>
            <p className="leading-snug">
              <b className="block text-compact font-medium">Vivekanand Choudhari</b>
              <span className="block text-sm text-muted">Senior UI/UX &amp; AI Product Designer · Bengaluru</span>
            </p>
          </div>
          <div className={s.rise} style={rise(80)}>
            <h1 id={anchors.heroTitle} className="mt-6 max-w-[17ch]">
              Design languages that make complex products feel simple.
            </h1>
          </div>
          <div className={s.rise} style={rise(160)}>
            <p className="mt-7 max-w-[52ch] text-lg leading-relaxed text-muted">
              9+ years designing B2B SaaS and AI platforms used by over a million people.
            </p>
          </div>
          <div className={s.rise} style={rise(200)}>
            <dl className="mt-8 flex flex-wrap gap-x-14 gap-y-3">
              {credentials.map((c) => (
                <div key={c.term}>
                  <dt className="text-caption text-muted">{c.term}</dt>
                  <dd className="mt-0.5 max-w-[36ch] text-compact leading-normal">{c.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <ForYouNote />
          <div className={s.rise} style={rise(240)}>
            <HeroAsk />
          </div>
          <div className={`${s.rise} mt-10 flex flex-wrap items-center gap-x-8 gap-y-2`} style={rise(320)}>
            <p className="flex items-center gap-2.5 text-sm text-muted">
              <span aria-hidden="true" className="h-[7px] w-[7px] rounded-full bg-accent" />
              Available for full-time roles and consulting
            </p>
            <TextLink href="#work" down>
              Or browse selected work
            </TextLink>
          </div>
        </div>
      </section>

      {/* ── WORK ─────────────────────────────────────────── */}
      <section id="work" aria-labelledby="work-title" className="scroll-mt-24 border-t border-border py-24 md:py-28">
        <div className="container-premium">
          <SectionHead eyebrow="Selected work" title="Products that made a measurable difference" id="work-title"
            action={
              <div className="flex flex-wrap gap-x-6">
                <TextLink href="/portfolio">Design gallery</TextLink>
                <TextLink href="/work">All projects</TextLink>
              </div>
            }
          />

          <Reveal>
            <article id={anchors.flagship} aria-labelledby="flagship-title" className="grid gap-8">
              <Link
                href={`/work/${flagship.slug}`}
                tabIndex={-1}
                aria-hidden="true"
                className="group block overflow-hidden rounded-[14px] bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-44px_rgb(15_15_16/0.35)]"
              >
                <Image
                  src={flagship.image.src}
                  alt=""
                  width={flagship.image.width}
                  height={flagship.image.height}
                  sizes="(min-width: 1440px) 1200px, 100vw"
                  className="h-auto w-full transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:scale-[1.01]"
                />
              </Link>
              <div className="grid items-start gap-8 md:grid-cols-2 md:gap-12">
                <div>
                  <p className="flex items-baseline justify-between gap-3 text-caption text-muted">
                    <span>{flagship.domain}</span>
                    <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
                      <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-accent" />
                      {flagship.status}
                    </span>
                  </p>
                  <h3 id="flagship-title" className="mt-2 text-2xl leading-snug tracking-[-0.02em]">
                    <Link href={`/work/${flagship.slug}`} className="hover:text-accent">
                      {flagship.title}
                    </Link>
                  </h3>
                  <p className="mt-3 max-w-[46ch] text-muted">{flagship.desc}</p>
                  <div className="mt-3 flex flex-wrap items-center gap-x-5 gap-y-1">
                    <TextLink href={`/work/${flagship.slug}`}>Read the case study</TextLink>
                    <Summarize lines={flagship.summary} />
                  </div>
                </div>
                <dl className="grid gap-4 sm:grid-cols-3 sm:gap-6">
                  {flagship.figures.map((f) => (
                    <div key={f.label} className="flex items-baseline justify-between gap-4 border-t border-foreground pt-3.5 sm:flex-col-reverse sm:justify-end sm:gap-1.5">
                      <dt className="text-caption leading-snug text-muted">{f.label}</dt>
                      <dd className="text-[22px] font-medium tabular-nums leading-none tracking-[-0.03em] sm:text-[28px]">{f.value}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          </Reveal>

          <ProjectGrid
            items={projectCards.map((card) => ({
              id: card.id,
              node: (
                <Reveal>
                  <Link id={anchors.card(card.id)} href={`/work/${card.slug}`} className={`group grid content-start gap-3.5 ${s.lift}`}>
                    <span aria-hidden="true" className={`${s.frame} ${s.frameCard}`}>
                      <Sketch kind={card.sketch} />
                    </span>
                    <span className="flex items-baseline justify-between gap-3 text-caption text-muted">
                      <span>{card.domain}</span>
                      <span className="whitespace-nowrap">{card.years}</span>
                    </span>
                    <span className="text-xl font-medium leading-snug tracking-[-0.02em] transition-colors group-hover:text-accent">{card.title}</span>
                    <Metrics items={card.metrics} />
                  </Link>
                </Reveal>
              ),
            }))}
          />

          <Reveal className="mt-14 flex flex-wrap items-baseline gap-x-6 gap-y-1 border-t border-border pt-5 text-compact text-muted">
            <span>Also</span>
            {alsoProjects.map((p) => (
              <span key={p.slug} className="inline-flex items-baseline gap-2">
                <Link href={`/work/${p.slug}`} className="py-2 text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">
                  {p.label}
                </Link>
                {p.note && <small className="text-caption text-muted">{p.note}</small>}
              </span>
            ))}
          </Reveal>
        </div>
      </section>

      {/* ── WHAT COLLEAGUES SAY ──────────────────────────── */}
      <section aria-labelledby="quotes-title" className="border-t border-border py-24 md:py-28">
        <div className="container-premium">
          <Reveal>
            <h2 id="quotes-title" className={label}>
              What colleagues say
            </h2>
            <Quotes />
          </Reveal>
        </div>
      </section>

      {/* ── PROCESS ──────────────────────────────────────── */}
      <section aria-labelledby="process-title" className="border-t border-border py-24 md:py-28">
        <div className="container-premium">
          <SectionHead eyebrow="Process" title="Design run like an engineering discipline" id="process-title" />
          <div id={anchors.processSteps}>
            <StepStrip
              steps={processSteps.map((step, i) => ({
                label: step.n,
                title: step.title,
                text: step.body,
                doodle: <Doodle name={["research", "psychology", "flows", "ship"][i] ?? "signal"} className="h-12 w-12" i={i} />,
              }))}
            />
          </div>
          <Reveal className="mt-12 flex flex-wrap items-center justify-between gap-x-6 gap-y-3 text-muted">
            <p>Every stage has a gate. Nothing moves forward on instinct alone.</p>
            <TextLink href="/process">See the full method</TextLink>
          </Reveal>
        </div>
      </section>

      {/* ── ABOUT ────────────────────────────────────────── */}
      <section aria-labelledby="about-title" className="border-t border-border py-24 md:py-28">
        <div className="container-premium grid gap-12 md:grid-cols-2 md:gap-16">
          <Reveal>
            <h2 id="about-title" className={label}>
              About
            </h2>
            <p className="mt-5 text-lg leading-relaxed text-muted">
              I work where <strong className="font-medium text-foreground">design and engineering</strong> meet. I design the system, write the React that makes it real, and measure whether it worked.
            </p>
            <p className="mt-4 text-lg leading-relaxed text-muted">
              My work spans AdTech, Construction Cloud, Healthcare, AIOps, IIoT and Big Data, for products used by over a million people.
            </p>
            <div className="mt-3">
              <TextLink href="/about">More about me</TextLink>
            </div>
          </Reveal>
          <Reveal delay={80}>
            <Facts rows={facts} />
          </Reveal>
        </div>
      </section>

      {/* ── WRITING ──────────────────────────────────────── */}
      <section aria-labelledby="writing-title" className="border-t border-border py-24 md:py-28">
        <div className="container-premium">
          <SectionHead eyebrow="Writing" title="Notes from the work" id="writing-title" action={<TextLink href="/blog">All posts</TextLink>} />
          <Reveal>
            <ul className="border-t border-border">
              {posts.map((post) => (
                <li key={post.slug} className="border-b border-border">
                  <Link id={anchors.post(post.slug)} href={`/blog/${post.slug}`} className="group grid items-baseline gap-0.5 py-5 sm:grid-cols-[minmax(0,1fr)_90px] sm:gap-6 md:grid-cols-[minmax(0,1fr)_160px_90px]">
                    <span className="text-lg font-medium tracking-[-0.01em] transition-colors group-hover:text-accent">{post.title}</span>
                    <span className="hidden text-sm text-muted md:block">{post.category}</span>
                    <span className="text-sm tabular-nums text-muted sm:text-right">{monthYear(post.date)}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── CONTACT ──────────────────────────────────────── */}
      <section aria-labelledby={anchors.contactTitle} className="border-t border-border py-28 md:py-36">
        <div className="container-premium">
          <Reveal>
            <p className={label}>Contact</p>
            <h2 id={anchors.contactTitle} className="mt-4 max-w-[18ch] text-display">
              Have a complex product that should feel simple?
            </h2>
            <p className="mt-5 text-lg text-muted">
              I reply within 24 hours. <ContactTimes />
            </p>
            <ContactActions />
          </Reveal>
        </div>
      </section>
    </AgentProvider>
  );
}
