import Link from "next/link";
import { Section } from "@/components/Section";
import { stages } from "@/lib/process/stages";
import { getPrinciple } from "@/lib/process/principles";
import ProcessLoop from "@/components/sketch/ProcessLoop";
import { ArrowUpRight, ArrowRight } from "lucide-react";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { Tick } from "@/components/sketch/glyphs";
import { RingMark } from "@/components/sketch/marks";

function StageSection({ stage, index }: Readonly<{ stage: (typeof stages)[number]; index: number }>) {
  return (
    <Section id={`stage-${stage.id}`} className={index % 2 === 1 ? "bg-surface" : ""}>
      <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-16 [&>*]:min-w-0">
        {/* The stage's doodle, ringed by hand, beside its number and title */}
        <DrawOnView className="lg:sticky lg:top-32 lg:self-start">
          <div className="relative grid h-40 w-40 place-items-center">
            <RingMark className="absolute inset-0 h-full w-full" i={0} />
            <Doodle name={stage.id} className="h-20 w-20 text-foreground" i={1} />
          </div>
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.06em] text-accent">Stage {stage.num} · {stage.eyebrow}</p>
          <h2 className="mt-2">{stage.title}</h2>
          <p className="mt-3 text-caption text-muted">
            <span className="font-mono uppercase tracking-[0.06em]">{stage.industryLabel}</span> · {stage.methodTags.join(" · ")}
          </p>
        </DrawOnView>

        <div className="grid gap-8">
          <p className="max-w-[62ch] text-lg leading-relaxed text-muted">{stage.method}</p>

          <div>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Psychology applied</p>
            <ul className="mt-3 grid gap-3 sm:grid-cols-2">
              {stage.psychology.map((pid) => {
                const p = getPrinciple(pid);
                return (
                  <li key={pid} className="rounded-2xl bg-background p-4 ring-1 ring-border ring-inset">
                    <p className="font-medium">{p.name}</p>
                    <p className="mt-1 text-compact text-muted">{p.definition}</p>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Exit gate: drawn as a gate mark with hand-ticked checks */}
          <DrawOnView className="rounded-2xl bg-foreground p-6 text-background">
            <p className="flex items-center gap-3 font-mono text-xs uppercase tracking-[0.06em]">
              <svg viewBox="0 0 24 24" className="h-5 w-5" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true"><path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" d="M12 3l9 9-9 9-9-9z" /></svg>
              Exit gate: what must be true to go on
            </p>
            <ul className="mt-4 grid gap-3">
              {stage.gate.map((g, i) => (
                <li key={g} className="flex gap-3 text-compact">
                  <Tick className="h-5 w-5 shrink-0 text-background" i={i + 1} />
                  {g}
                </li>
              ))}
            </ul>
          </DrawOnView>

          <Link href={stage.caseStudy.href} className="inline-flex items-center gap-1.5 py-2.5 text-sm font-medium text-accent transition-all hover:gap-2.5">
            See it shipped: {stage.caseStudy.label}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </Section>
  );
}

export default function ProcessPage() {
  return (
    <div className="pt-24">
      {/* Hero */}
      <Section>
        <div className="max-w-3xl">
          <p className="text-accent font-mono text-xs uppercase tracking-[0.06em] mb-4">
            The Process
          </p>
          <h1 className="mb-6">
            From idea to shipped.
          </h1>
          <p className="text-lg text-muted leading-relaxed mb-4">
            The method I run on every product: frame the problem, write a falsifiable brief,
            go watch real users, map findings to psychology, design the architecture and
            failure paths, build the system, then validate and ship with metrics that resist
            gaming.
          </p>
          <p className="text-xs font-mono text-muted">
            7 stages · every stage has a written exit gate · every stage links to real shipped work
          </p>
        </div>
        <div className="mt-14 md:mt-16">
          <ProcessLoop stages={stages} />
        </div>
      </Section>

      {stages.map((stage, i) => (
        <StageSection key={stage.id} stage={stage} index={i} />
      ))}

      {/* Closing CTA */}
      <Section>
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="mb-4">This is the method, applied.</h2>
          <p className="text-muted leading-relaxed mb-8">
            Every stage above is demonstrated in shipped, real-world work — not a hypothetical.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3">
            <Link
              href="/work"
              className="px-5 py-2.5 rounded-xl bg-accent text-accent-foreground text-sm font-medium hover:bg-accent/90 transition-colors inline-flex items-center gap-1.5"
            >
              View Case Studies
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/contact"
              className="px-5 py-2.5 rounded-xl bg-surface-hover border border-border text-sm font-medium text-foreground hover:border-accent/30 transition-colors"
            >
              Get in Touch
            </Link>
          </div>
        </div>
      </Section>
    </div>
  );
}
