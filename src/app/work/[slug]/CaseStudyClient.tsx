"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Section } from "@/components/Section";
import { StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import { StepStrip } from "@/components/sketch/flows";
import { Tick } from "@/components/sketch/glyphs";
import { DecisionTree, Pipeline } from "@/components/sketch/structures";
import {
  projectData,
  type DecisionRecord,
} from "@/lib/work/project-data";

/* ─── Summaries drawn from the case study's own words ─── */

/** The first sentence; when it runs long, the clause before the first dash or semicolon. */
function lead(text: string, maxWords = 24): string {
  const first = text.split(/(?<=[.!?])\s/)[0].trim();
  if (first.split(/\s+/).length <= maxWords) return first;
  const clause = first.split(/\s[—–]\s|;\s/)[0].trim();
  if (clause.split(/\s+/).length <= maxWords) return clause.replace(/[,:]$/, "") + ".";
  return first.split(/\s+/).slice(0, maxWords).join(" ") + "…";
}

/** The part of a line before " — ". */
const head = (text: string) => text.split(/\s[—–]\s/)[0].trim();

/** "60% reduction in X — because Y" → { value: "60%", label: "Reduction in X", note: "Because Y" }; null if the line doesn't open with a figure. */
function figureOf(item: string): { value: string; label: string; note?: string } | null {
  const [main, ...rest] = item.split(/\s[—–]\s/);
  const m = main.match(/^(Zero|[₹$]?\d[\d,.]*\s?(?:%|x|×|k|K|M|Cr)?\+?)(\s(?:hours?|minutes?|days?|weeks?|months?|product experiences|enterprises|teams|customers|screens))?\s+(.+)$/);
  if (!m) return null;
  const cap = (s: string) => s.charAt(0).toUpperCase() + s.slice(1);
  return { value: `${m[1]}${m[2] ?? ""}`.trim(), label: cap(m[3]), note: rest.length ? cap(rest.join(" — ")) : undefined };
}


/* ─── Decision Records — context → options → choice → result ─── */
function DecisionsSection({ decisions }: { decisions: DecisionRecord[] }) {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
      >
        <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-2">
          Decision Records
        </h2>
        <p className="text-sm text-muted mb-8 max-w-2xl">
          The three calls that shaped the product — with the options considered,
          the evidence behind each choice, and the psychology principle at work.
        </p>
        <div className="space-y-6">
          {decisions.map((d, i) => (
            <motion.div
              key={d.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.06 }}
              className="rounded-2xl bg-surface border border-border overflow-hidden"
            >
              <div className="p-5 sm:p-6 flex items-start gap-4">
                <span className="font-mono text-sm text-accent shrink-0 mt-1">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3 className="text-lg">{d.title}</h3>
              </div>
              {/* The decision as a small tree: context → options weighed → the call → result */}
              <div className="px-5 pb-6 sm:px-6">
                <DecisionTree context={d.context} options={d.options} choice={d.choice} result={d.result} />
              </div>
              <div className="px-5 sm:px-6 py-3.5 bg-background/50 border-t border-border">
                <p className="text-sm text-muted leading-relaxed">
                  <span className="font-mono text-accent uppercase tracking-[0.06em] text-xs mr-1">
                    Principle
                  </span>{" "}
                  {d.principle}
                </p>
              </div>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

/* ─── Retro — what I'd do differently ─── */
function RetroSection({ retro }: { retro: string[] }) {
  return (
    <Section>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        className="max-w-3xl"
      >
        <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-2">
          What I&apos;d Do Differently
        </h2>
        <p className="text-sm text-muted mb-8">
          Honest hindsight — the calls I&apos;d change if I ran this again.
        </p>
        <div className="space-y-4">
          {retro.map((item, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, x: -10 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.05 }}
              className="flex gap-4 p-4 rounded-xl bg-surface border border-border"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent shrink-0 mt-1">
                <path d="M3 12a9 9 0 1 0 9-9 9.75 9.75 0 0 0-6.74 2.74L3 8" />
                <path d="M3 3v5h5" />
              </svg>
              <p className="text-sm text-foreground/75 leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>
    </Section>
  );
}

export default function CaseStudyClient({ slug }: { slug: string }) {
  const project = projectData[slug];

  if (!project) {
    return (
      <div className="min-h-screen pt-32 text-center">
        <h1 className="mb-4">Project not found</h1>
        <Link href="/" className="text-accent hover:underline">
          Back to home
        </Link>
      </div>
    );
  }

  /* ─── Story-based layout for projects with chapters ─── */
  if (project.story) {
    const uniqueYears = [...new Set(project.story.map((c) => c.year.split(/\s*[–—]\s*/)[0]))];
    return (
      <div className="min-h-screen pt-24 sm:pt-32">
        {/* Back link */}
        <Section>
          <Link
            href="/work"
            className="inline-flex items-center gap-2 py-2.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
          >
            <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
              <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            Back to projects
          </Link>

          {/* Hero */}
          <div className="max-w-4xl">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="flex items-center gap-3 mb-4"
            >
              <span className="text-accent font-mono text-xs uppercase tracking-[0.06em]">{project.category}</span>
              {project.timeline && (
                <>
                  <span className="w-1 h-1 rounded-full bg-muted" />
                  <span className="text-muted font-mono text-sm">{project.timeline}</span>
                </>
              )}
            </motion.div>
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 }}
              className="mb-6"
            >
              {project.title}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="text-lg text-muted leading-relaxed max-w-3xl mb-10"
            >
              {project.heroDesc}
            </motion.p>

            {/* Tags */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="flex flex-wrap gap-2 mb-10"
            >
              {project.tags.map((tag) => (
                <span key={tag} className="px-3 py-1.5 text-xs font-mono rounded-full bg-surface border border-border text-muted">
                  {tag}
                </span>
              ))}
            </motion.div>

            {/* Role Banner */}
            {project.role && (
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.18 }}
                className="mb-10 p-5 rounded-2xl bg-accent/5 border border-accent/10"
              >
                <div className="flex items-center gap-2 mb-3">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                    <circle cx="9" cy="7" r="4" />
                    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                  </svg>
                  <span className="text-xs font-mono text-accent uppercase tracking-[0.06em]">Leadership Context</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                  <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Role</p>
                    <p className="text-sm font-medium text-foreground">{project.role.title}</p>
                  </div>
                  <div className="sm:col-span-2">
                    <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Scope</p>
                    <p className="text-sm text-foreground/70">{project.role.scope}</p>
                  </div>
                  <div>
                    <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Team</p>
                    <p className="text-sm text-foreground/70">{project.role.team}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ─── Product Artifact (stylized recreation of the NoCode builder; that project only) ─── */}
            {slug === "nocode-platform" && (
            <motion.figure
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25 }}
              className="mb-4"
            >
              <div className="rounded-2xl border border-border bg-surface overflow-hidden">
                {/* Window chrome */}
                <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border">
                  <div className="flex gap-1.5">
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                    <div className="w-2.5 h-2.5 rounded-full bg-border" />
                  </div>
                  <span className="text-xs font-mono text-muted ml-2">app-builder / canvas</span>
                </div>
                {/* Builder canvas wireframe */}
                <div className="p-4 sm:p-6 grid grid-cols-12 gap-3 min-h-[280px] sm:min-h-[340px]" aria-hidden="true">
                  {/* Component palette */}
                  <div className="col-span-3 sm:col-span-2 space-y-2">
                    <div className="h-6 rounded bg-border/40 w-3/4" />
                    {[1, 2, 3, 4, 5, 6].map((n) => (
                      <div key={n} className="h-9 rounded-lg bg-accent/8 border border-accent/15" />
                    ))}
                  </div>
                  {/* Canvas */}
                  <div className="col-span-6 sm:col-span-7 rounded-xl border-2 border-dashed border-accent/20 p-3 sm:p-4 flex flex-col gap-3">
                    <div className="h-10 rounded-lg bg-accent/10 border border-accent/20" />
                    <div className="grid grid-cols-2 gap-3 flex-1">
                      <div className="rounded-lg bg-surface-hover border border-border" />
                      <div className="rounded-lg bg-surface-hover border border-border flex items-end p-2 gap-1">
                        {[40, 70, 50, 85, 60].map((h, i) => (
                          <div key={i} className="flex-1 rounded-t bg-accent/25" style={{ height: `${h}%` }} />
                        ))}
                      </div>
                    </div>
                    <div className="h-9 rounded-lg bg-accent/10 border border-accent/20 w-1/2" />
                  </div>
                  {/* Property panel — progressive disclosure */}
                  <div className="col-span-3 space-y-2">
                    <div className="h-6 rounded bg-border/40 w-2/3" />
                    {[1, 2, 3, 4, 5].map((n) => (
                      <div key={n} className="h-8 rounded-lg bg-surface-hover border border-border" />
                    ))}
                    <div className="h-8 rounded-lg border border-dashed border-border flex items-center justify-center">
                      <span className="text-xs font-mono text-muted">+ Advanced</span>
                    </div>
                  </div>
                </div>
              </div>
              <figcaption className="mt-3 text-xs text-muted font-mono">
                Stylized recreation of the builder canvas — palette, drag-and-drop
                canvas, and progressively disclosed property panel. Original screens
                are under NDA.
              </figcaption>
            </motion.figure>
            )}

          </div>
        </Section>

        {/* ─── The story at a glance: chapters on one hand-drawn line ─── */}
        <Section>
          <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-6">
            {project.story.length} chapters · {uniqueYears[0]}–{uniqueYears[uniqueYears.length - 1]}
          </p>
          <Pipeline stages={project.story.map((c) => ({ name: c.phase.replace(/^\d+\s*—\s*/, ""), text: c.year, items: [] }))} />
        </Section>

        {/* ─── Story Chapters ─── */}
        {project.story.map((chapter, idx) => {
          /* Visual icon per chapter type */
          const phaseIcons: Record<string, React.ReactNode> = {
            "metrics": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M18 20V10M12 20V4M6 20v-6"/></svg>,
            "timeline": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>,
            "flow": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="5" cy="6" r="3"/><circle cx="19" cy="6" r="3"/><circle cx="12" cy="18" r="3"/><line x1="8" y1="6" x2="16" y2="6"/><line x1="6.5" y1="8.5" x2="10.5" y2="15.5"/><line x1="17.5" y1="8.5" x2="13.5" y2="15.5"/></svg>,
            "grid": <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>,
          };

          return (
            <Section key={idx}>
              <motion.div
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5 }}
                className="relative"
              >
                {/* Vertical connector */}
                {idx < project.story!.length - 1 && (
                  <div className="absolute left-5 top-full w-px h-16 sm:h-20 bg-border/50 hidden sm:block" />
                )}

                <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                  {/* Main Content */}
                  <div className="flex-1 min-w-0">
                    {/* Phase label + year */}
                    <motion.div
                      initial={{ opacity: 0, x: -10 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      viewport={{ once: true }}
                      className="flex items-center gap-3 mb-4"
                    >
                      <div className="w-10 h-10 rounded-xl bg-accent/10 border border-accent/20 flex items-center justify-center text-accent">
                        {phaseIcons[chapter.visual || "metrics"]}
                      </div>
                      <div>
                        <p className="text-xs font-mono text-accent uppercase tracking-[0.06em]">{chapter.phase.replace(/^\d+\s*—\s*/, "")}</p>
                        <p className="text-xs font-mono text-muted">{chapter.year}</p>
                      </div>
                    </motion.div>

                    {/* Title */}
                    <h2 className="mb-4">{chapter.title}</h2>

                    {/* Narrative */}
                    <p className="text-base sm:text-lg text-muted leading-relaxed mb-8 max-w-2xl">{chapter.narrative}</p>

                    {/* Detail points */}
                    <div className="space-y-3">
                      {chapter.details.map((detail, di) => (
                        <motion.div
                          key={di}
                          initial={{ opacity: 0, x: -8 }}
                          whileInView={{ opacity: 1, x: 0 }}
                          viewport={{ once: true }}
                          transition={{ delay: di * 0.04 }}
                          className="flex gap-3"
                        >
                          <div className="mt-2 w-1.5 h-1.5 rounded-full bg-accent/50 shrink-0" />
                          <p className="text-sm text-foreground/70 leading-relaxed">{detail}</p>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Aside — Key Metrics with animated bar */}
                  {chapter.aside && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.15 }}
                      className="lg:w-64 shrink-0"
                    >
                      <div className="lg:sticky lg:top-32 space-y-3">
                        {chapter.aside.map((item, ai) => (
                          <motion.div
                            key={item.label}
                            initial={{ opacity: 0, scale: 0.95 }}
                            whileInView={{ opacity: 1, scale: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.2 + ai * 0.08 }}
                            className="p-4 rounded-xl bg-surface border border-border relative overflow-hidden"
                          >
                            {/* Accent top bar */}
                            <div className="absolute top-0 left-0 right-0 h-0.5 bg-accent/50" />
                            <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-1">{item.label}</p>
                            <p className="text-xl font-medium text-foreground">{item.value}</p>
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </div>

                {/* Per-chapter visual decorators */}
                {chapter.visual === "metrics" && idx === project.story!.length - 1 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-10 grid grid-cols-2 sm:grid-cols-4 gap-4"
                  >
                    {chapter.aside?.map((m, mi) => (
                      <div key={mi} className="text-center p-5 rounded-2xl bg-accent/5 border border-accent/10">
                        <motion.p
                          initial={{ scale: 0.5, opacity: 0 }}
                          whileInView={{ scale: 1, opacity: 1 }}
                          viewport={{ once: true }}
                          transition={{ delay: 0.4 + mi * 0.1, type: "spring", stiffness: 200 }}
                          className="text-3xl sm:text-4xl font-medium text-accent mb-1"
                        >
                          {m.value}
                        </motion.p>
                        <p className="text-xs text-muted">{m.label}</p>
                      </div>
                    ))}

                  </motion.div>
                )}
              </motion.div>
            </Section>
          );
        })}

        {/* ─── Decision Records + Retro ─── */}
        {project.decisions && <DecisionsSection decisions={project.decisions} />}
        {project.retro && <RetroSection retro={project.retro} />}

      </div>
    );
  }

  /* ─── Default layout for other projects ─── */
  const figures = project.impact.map((item) => ({ item, fig: figureOf(item) }));
  const tiled = figures.filter((f) => f.fig).slice(0, 4);
  const impactTiles = tiled.length >= 2 ? tiled.map((f) => f.fig!) : [];
  const impactRest = impactTiles.length ? figures.filter((f) => !tiled.includes(f)).map((f) => f.item) : project.impact;
  return (
    <div className="min-h-screen pt-24 sm:pt-32">
      {/* Back link */}
      <Section>
        <Link
          href="/work"
          className="inline-flex items-center gap-2 py-2.5 text-sm text-muted hover:text-foreground transition-colors mb-6"
        >
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none" aria-hidden="true">
            <path d="M13 8H3M3 8L7 4M3 8L7 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          Back to projects
        </Link>

        {/* Hero */}
        <div className="max-w-4xl">
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-accent font-mono text-xs uppercase tracking-[0.06em] mb-4"
          >
            {project.category}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 }}
            className="mb-6"
          >
            {project.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-lg text-muted leading-relaxed max-w-3xl mb-10"
          >
            {project.heroDesc}
          </motion.p>

          {/* Tags */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-wrap gap-2 mb-10"
          >
            {project.tags.map((tag) => (
              <span key={tag} className="px-3 py-1.5 text-xs font-mono rounded-full bg-surface border border-border text-muted">
                {tag}
              </span>
            ))}
          </motion.div>

          {/* Role Banner */}
          {project.role && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.22 }}
              className="mb-10 p-5 rounded-2xl bg-accent/5 border border-accent/10"
            >
              <div className="flex items-center gap-2 mb-3">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="text-accent">
                  <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                  <circle cx="9" cy="7" r="4" />
                  <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                  <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                </svg>
                <span className="text-xs font-mono text-accent uppercase tracking-[0.06em]">Leadership Context</span>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-4 gap-3">
                <div>
                  <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Role</p>
                  <p className="text-sm font-medium text-foreground">{project.role.title}</p>
                </div>
                <div className="sm:col-span-2">
                  <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Scope</p>
                  <p className="text-sm text-foreground/70">{project.role.scope}</p>
                </div>
                <div>
                  <p className="text-xs font-mono text-muted uppercase tracking-[0.06em] mb-0.5">Team</p>
                  <p className="text-sm text-foreground/70">{project.role.team}</p>
                </div>
              </div>
            </motion.div>
          )}


        </div>
      </Section>

      {/* The case at a glance: challenge → approach → impact, in the case study's own words */}
      <Section className="!pt-0">
        <StepStrip
          steps={[
            { label: "The challenge", title: lead(project.challenge), doodle: <Doodle name="tangle" className="h-12 w-12" />, href: "#challenge" },
            { label: `The approach · ${project.approach.length} moves`, title: lead(head(project.approach[0]), 16), doodle: <Doodle name="approach" className="h-12 w-12" i={1} />, href: "#approach" },
            { label: "The impact", title: lead(head(project.impact[0]), 16), doodle: <Doodle name="rise" className="h-12 w-12" i={2} />, href: "#impact" },
          ]}
        />
      </Section>

      {/* Challenge */}
      <Section id="challenge">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-3">The Challenge</h2>
          <p className="text-lg text-foreground/80 leading-relaxed">{project.challenge}</p>
        </motion.div>
      </Section>

      {/* Approach */}
      <Section id="approach">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-3xl"
        >
          <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-6">The Approach</h2>
          <div className="space-y-4">
            {project.approach.map((step, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-4"
              >
                <span className="text-accent font-mono text-sm mt-0.5 shrink-0">
                  {String(i + 1).padStart(2, "0")}
                </span>
                <p className="text-foreground/70 leading-relaxed">{step}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Key Features */}
      <Section>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-8">Key Features</h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {project.features.map((feat, i) => (
              <motion.div
                key={feat.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="p-5 rounded-2xl bg-surface border border-border"
              >
                <h3 className="text-sm text-foreground mb-2">{feat.title}</h3>
                <p className="text-sm text-muted leading-relaxed">{feat.desc}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Impact: lines that open with a figure become stat tiles; the rest stay as a list */}
      <Section id="impact">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
        >
          <h2 className="text-xs font-mono text-accent uppercase tracking-[0.06em] mb-6">The Impact</h2>
          {impactTiles.length >= 2 && (
            <div className="mb-4">
              <StatTiles items={impactTiles} cols={impactTiles.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 lg:grid-cols-4"} />
            </div>
          )}
          <div className="grid sm:grid-cols-2 gap-4 max-w-4xl">
            {impactRest.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.05 }}
                className="flex gap-3 p-4 rounded-xl bg-surface border border-border"
              >
                <Tick className="h-5 w-5 shrink-0 text-accent" />
                <p className="text-sm text-foreground/80 leading-relaxed">{item}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </Section>

      {/* Decision Records + Retro (when available) */}
      {project.decisions && <DecisionsSection decisions={project.decisions} />}
      {project.retro && <RetroSection retro={project.retro} />}

    </div>
  );
}
