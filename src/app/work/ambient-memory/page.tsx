import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { pageMeta } from "@/lib/seo";
import { caseStudy } from "@/lib/work/index";
import { BackLink, CaseCta, CaseIndex, CaseKicker, FactList, Section, Shot, caseLabel } from "@/components/case/CaseParts";
import CardSort from "@/components/case/CardSort";
import ThemeJourney from "@/components/case/ThemeJourney";
import { ContrastTable, DirectionCards, MethodTimeline, PositioningMap, TokenSwatches } from "@/components/case/ambient-memory/Parts";
import { StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { CompareMatrix, FlowRows, StepStrip } from "@/components/sketch/flows";
import { Cross, SketchArrow, Tick } from "@/components/sketch/glyphs";
import { UnderlineMark } from "@/components/sketch/marks";
import PersonaCard from "@/components/sketch/PersonaCard";
import { JourneyMap, Pipeline } from "@/components/sketch/structures";
import {
  a11yFindings, abTest, budgets, cardKit, chapters, competitors, components, cover, coverage, darkPatterns, dataInventory, definitionOfDone, designDecisions,
  diaryPrompts, directionScores, edgeStates, entities, ethics, events, experiments, facts, featureMatrix, featurePersonas, gapsWeCanOwn, governance, haptics,
  heart, hero, honestLimits, howMightWe, hypotheses, inputMetrics, jobs, journey, keptInV2, keyNumbers, labels, largeText, lessons, localisation, matrixSays,
  measuredChange, microcopy, motionSpec, navRules, nextSteps, northStar, openLegal, opportunityTree, painPoints, performance, pillars, pipeline,
  positioningStatement, preMortem, privacyPrinciples, problem, regulation, releases, removedInV2, researchQuestions, rice, riskRegister, rollout, rtl, rulesOfThumb,
  scales, science, sitemap, sortCards, sortGroups, sortRounds, sortRules, sources, successLooksLike, surfaces, taglines, targetAudit, testObjectives, testRounds,
  testTasks, tokens, treeTasks, uc02, usageRules, useCases, v1Today, v2Today, voice, whyTheseFour, wireCompare, workflows, personas,
} from "@/lib/work/ambient-memory";

const entry = caseStudy("ambient-memory")!;
export const metadata: Metadata = pageMeta({
  title: entry.seoTitle,
  ogTitle: entry.title,
  category: "AI product design",
  description: entry.description,
  path: "/work/ambient-memory",
  type: "article",
  image: { url: cover.src, width: cover.width, height: cover.height, alt: cover.alt },
});

const index = [
  { id: "signal", label: "Signal" },
  { id: "market", label: "Market" },
  { id: "research", label: "Research plan" },
  { id: "science", label: "Science" },
  { id: "people", label: "People" },
  { id: "define", label: "Define" },
  { id: "architecture", label: "Architecture" },
  { id: "workflows", label: "Workflows" },
  { id: "words", label: "Wireframes and words" },
  { id: "visual", label: "Visual design" },
  { id: "system", label: "Design system" },
  { id: "screens", label: "Screens" },
  { id: "validate", label: "Validate" },
  { id: "privacy", label: "Privacy" },
  { id: "deliver", label: "Deliver" },
  { id: "next", label: "Next" },
];

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/** Small tag for the status of a step: prepared, measured or waiting for participants. */
function Status({ kind }: { kind: "Prepared" | "Needs participants" | "Measured" | "Hypothesis" }) {
  const dark = kind === "Needs participants";
  return <p className={`mb-6 inline-flex rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] ring-1 ring-inset ${dark ? "bg-foreground text-background ring-foreground" : "bg-background text-muted ring-border"}`}>{kind}</p>;
}

function Table({ head, rows, caption, minWidth = "min-w-[640px]" }: { head: string[]; rows: (string | number)[][]; caption: string; minWidth?: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={`${caption}, scrolls sideways`}>
      <table className={`w-full ${minWidth} border-collapse text-left text-compact`}>
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr className="border-b border-border-strong">{head.map((h) => <th key={h} scope="col" className="py-3 pr-4 text-caption font-normal text-muted">{h}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className="border-b border-border last:border-0">
              {r.map((c, j) => (j === 0 ? <th key={j} scope="row" className="py-3 pr-4 align-top font-medium">{c}</th> : <td key={j} className="py-3 pr-4 align-top text-muted">{c}</td>))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function Chips({ items, mono = false }: { items: (string | number)[]; mono?: boolean }) {
  return <ul className="flex flex-wrap gap-1.5">{items.map((it) => <li key={it} className={`rounded-md bg-surface px-2 py-1 text-caption ring-1 ring-border ring-inset ${mono ? "font-mono" : ""}`}>{it}</li>)}</ul>;
}

export default function AmbientMemoryCase() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="AI product design · Concept, end to end" status="Design concept" />
        <h1 className="mt-3 max-w-[20ch]">Ambient Memory: from cluttered to calm.</h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
          <strong className="font-medium text-foreground">Ambient Memory</strong> is an always-available AI memory layer for people who talk through their day and lose
          what mattered: promises, decisions, context. I took it from the problem to a launch plan in nineteen steps, with the science behind each decision, a
          35-screen system in light and dark from one set of tokens, and every study prepared and labelled as not yet run.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#screens" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-compact font-medium text-background hover:bg-accent">
            See the screens, light and dark
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </a>
          <a href="#architecture" className="inline-flex min-h-11 items-center py-2.5 font-medium underline decoration-border-strong underline-offset-4 hover:text-accent">Try the card sort</a>
        </div>
        <figure className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-40px_rgb(15_15_16/0.35)]">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(min-width: 1440px) 1200px, 100vw" priority className="h-auto w-full" />
          </div>
          <figcaption className="mt-3 text-caption text-muted">Version 2, light theme: Today, live capture, meeting detail, Ask, Memory and Privacy. Arjun, Priya and Dev are fictional; the pricing review runs through every screen.</figcaption>
        </figure>
        <FactList facts={facts} />
        <div className="mt-12"><StatTiles items={keyNumbers} /></div>
        <CaseIndex items={index} />
      </header>

      <Section id="signal" eyebrow="00 · Signal and framing" title="The problem is not capture. It is trust and follow-through.">
        <Status kind="Prepared" />
        <DrawOnView className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {painPoints.map((p, i) => (
            <div key={p.title} className="sk-fade flex flex-col gap-3 rounded-2xl bg-surface p-5" style={sk(i)}>
              <Doodle name={p.doodle} className="h-12 w-12 text-foreground" i={i} />
              <h3 className="text-lg">{p.title}</h3>
              <p className="text-compact text-muted">{p.text}</p>
            </div>
          ))}
        </DrawOnView>
        <div className="mt-12 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] [&>*]:min-w-0">
          <DrawOnView className="flex flex-col gap-4 rounded-2xl bg-foreground p-6 text-background">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">Problem statement</p>
            <p className="text-[clamp(1.2rem,2vw,1.5rem)] leading-snug tracking-[-0.015em]">{problem}</p>
          </DrawOnView>
          <div className="grid content-start gap-3 rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Success looks like</p>
            <ul className="grid gap-2.5">{successLooksLike.map((s, i) => <li key={s} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{s}</li>)}</ul>
          </div>
        </div>
        <DrawOnView className="mt-12 max-w-[48ch]">
          <p className={caseLabel}>Design question</p>
          <p className="mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug tracking-[-0.02em]">
            How might we capture a whole day without making people feel watched, and let them verify what the AI remembers{" "}
            <span className="relative inline-block">in one glance?<UnderlineMark className="absolute -bottom-2 left-0 h-3 w-full" i={4} /></span>
          </p>
        </DrawOnView>
        <div className="mt-14">
          <h3 className="text-xl">Jobs to be done, by persona</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Hypotheses until the interviews in Step 3. The outcome measure is what each person would notice first.</p>
          <div className="mt-6"><Table caption="Jobs to be done" head={["Persona", "Job statement", "Outcome measure"]} rows={jobs} /></div>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="text-xl">How might we…</h3>
            <ol className="mt-5 grid gap-2.5">{howMightWe.map((h, i) => <li key={h} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{h}</li>)}</ol>
          </div>
          <div className="grid content-start gap-5 rounded-2xl bg-surface p-6">
            <div>
              <p className={caseLabel}>Opportunity tree · outcome</p>
              <p className="mt-1 text-lg">{opportunityTree.outcome}</p>
            </div>
            <div className="grid gap-5 sm:grid-cols-2">
              <div>
                <p className={caseLabel}>Opportunities</p>
                <ul className="mt-2 grid gap-1.5 text-compact text-muted">{opportunityTree.opportunities.map((o, i) => <li key={o}>O{i + 1} {o}</li>)}</ul>
              </div>
              <div>
                <p className={caseLabel}>Candidate solutions</p>
                <ul className="mt-2 grid gap-1.5 text-compact">{opportunityTree.solutions.map((s) => <li key={s}>{s}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
        <p className="mt-6 text-caption text-muted">Method: jobs-to-be-done (Christensen, Ulwick); Double Diamond, diverge then converge.</p>
      </Section>

      <Section id="market" tone="tint" eyebrow="01 · Market" title="The market is converging on notes. Trust is the open ground." intro="Seven reference products compared by capture model, strength and gap. Funding and revenue figures come from press and aggregators and are not audited.">
        <Status kind="Prepared" />
        <Table caption="Reference products" head={["Product", "Capture model", "Where it shines", "Gap"]} rows={competitors} minWidth="min-w-[760px]" />
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
          <PositioningMap />
          <div>
            <h3 className="text-xl">Gaps we can own</h3>
            <ol className="mt-5 grid gap-3">{gapsWeCanOwn.map((g, i) => <li key={g} className="flex gap-3 text-compact"><span className="mt-0.5 inline-flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-accent-light/60 font-mono text-xs">{i + 1}</span>{g}</li>)}</ol>
            <p className="mt-6 rounded-xl bg-background p-4 text-caption text-muted ring-1 ring-border ring-inset">Visual audit hypothesis: many meeting-note apps appear to use white cards with a blue or purple accent. To confirm with a screenshot audit before claiming distinctiveness.</p>
          </div>
        </div>
      </Section>

      <Section id="research" eyebrow="02 · Research plan" title="Six questions, five methods, six testable hypotheses." intro="Ready to run. Nothing here claims results we do not have: no participants have been recruited, so no findings are claimed.">
        <Status kind="Needs participants" />
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Research questions</h3>
            <ol className="mt-5 grid gap-2.5">{researchQuestions.map((q, i) => <li key={q} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{q}</li>)}</ol>
          </div>
          <div>
            <h3 className="text-xl">Hypotheses to test</h3>
            <DrawOnView className="mt-5 grid gap-2">
              {hypotheses.map((h, i) => (
                <div key={h.h} className="sk-fade flex gap-3 rounded-xl bg-background p-3.5 ring-1 ring-border ring-inset" style={sk(i)}>
                  <span className="font-mono text-xs text-accent">{h.h}</span>
                  <p className="text-compact">{h.text}</p>
                </div>
              ))}
            </DrawOnView>
            <p className="mt-3 text-caption text-muted">Each hypothesis gets a measure and a decision rule in the study plan.</p>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Methods and timeline</h3>
          <div className="mt-6"><MethodTimeline /></div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
          <div className="rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Daily diary prompts</p>
            <ol className="mt-3 grid gap-2.5">{diaryPrompts.map((p, i) => <li key={p} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{i + 1}</span>{p}</li>)}</ol>
          </div>
          <div className="rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Ethics and consent</p>
            <ul className="mt-3 grid gap-2.5">{ethics.map((e, i) => <li key={e} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{e}</li>)}</ul>
          </div>
        </div>
        <p className="mt-6 text-caption text-muted">Synthesis: an affinity wall with the columns moments of loss, workarounds, trust triggers, consent concerns and tool wishes. Every insight needs two or more participants and one verbatim quote, collected with consent.</p>
      </Section>

      <Section id="science" tone="tint" eyebrow="03 · Science behind the product" title="Five strands of evidence, with their limits." intro="What the research says, how sure we are, and what each finding changes in the design. Ratings are our judgement of evidence strength; none of these is a guarantee.">
        <Status kind="Prepared" />
        <DrawOnView className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
          {science.map((s, i) => (
            <article key={s.strand} className="sk-fade flex flex-col gap-3 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={sk(i)}>
              <div className="flex flex-wrap items-center justify-between gap-2">
                <h3 className="text-lg">{s.strand}</h3>
                <span className="rounded-full bg-accent-light/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em]">{s.strength}</span>
              </div>
              <p className="text-compact">{s.finding}</p>
              <p className="text-caption text-muted">Evidence: {s.evidence}</p>
              <p className="border-l-2 border-accent pl-3 text-compact"><span className="text-muted">Design implication: </span>{s.implication}</p>
            </article>
          ))}
        </DrawOnView>
      </Section>

      <Section id="people" eyebrow="04 · People" title="Six hypothesis personas, three of them primary." intro="Each persona drives a different pillar of the product. Built from the workflows in Step 9 and public testimonials, not from interviews; names and details are invented for the concept.">
        <Status kind="Hypothesis" />
        <DrawOnView className="grid gap-5 md:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {personas.map((p, i) => <PersonaCard key={p.name} persona={p} i={i * 2} />)}
        </DrawOnView>
        <div className="mt-14">
          <h3 className="text-xl">Where Arjun wins or loses</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Five stages, with the product&apos;s response to every pain. Karan and Meera have the same map in the file; emotion curves are hypotheses and are not drawn.</p>
          <div className="mt-6"><JourneyMap stages={journey} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Which features matter to whom</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Scores are our judgement, to be re-rated after the survey in Step 3.</p>
          <div className="mt-6"><CompareMatrix columns={featurePersonas} rows={featureMatrix} caption="Full: critical · half: important · empty: nice to have" /></div>
          <ul className="mt-6 grid gap-2.5 md:grid-cols-2">{matrixSays.map((m, i) => <li key={m} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{m}</li>)}</ul>
        </div>
      </Section>

      <Section id="define" tone="tint" eyebrow="05 · Define" title="One North Star, a small first release, and an honest risk list." intro="We decide what to measure and what to leave out before drawing structure. Targets are hypotheses.">
        <Status kind="Hypothesis" />
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] [&>*]:min-w-0">
          <DrawOnView className="flex flex-col gap-3 rounded-2xl bg-foreground p-6 text-background">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">North Star</p>
            <p className="text-[clamp(1.3rem,2.2vw,1.7rem)] leading-snug tracking-[-0.015em] text-accent-light">{northStar.metric}</p>
            <p className="text-compact opacity-80">{northStar.why}</p>
          </DrawOnView>
          <div className="rounded-2xl bg-background p-5 ring-1 ring-border ring-inset">
            <p className={caseLabel}>Input metrics, starting hypotheses</p>
            <div className="mt-3"><Table caption="Input metrics" head={["Input", "Measure", "Target"]} rows={inputMetrics} minWidth="min-w-[420px]" /></div>
          </div>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">HEART framework</h3>
            <div className="mt-5"><Table caption="HEART framework" head={["Dimension", "Signal", "Starting target"]} rows={heart} minWidth="min-w-[480px]" /></div>
          </div>
          <div>
            <h3 className="text-xl">First release, and what waits</h3>
            <DrawOnView className="mt-5 grid gap-3 sm:grid-cols-3">
              {[["In", releases.first, "bg-accent-light/45"], ["Next", releases.later, "bg-background ring-1 ring-border ring-inset"], ["Out", releases.notNow, "border border-dashed border-border-strong"]].map(([tag, items, cls], i) => (
                <div key={tag as string} className={`sk-fade rounded-2xl p-4 ${cls}`} style={sk(i)}>
                  <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{tag as string}</p>
                  <ul className="mt-2 grid gap-1.5 text-compact">{(items as string[]).map((it) => <li key={it}>{it}</li>)}</ul>
                </div>
              ))}
            </DrawOnView>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Prioritisation: Kano and RICE</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">RICE = reach × impact × confidence ÷ effort. Reach is 1 to 10, impact 0.25 to 3, effort in person-weeks. Numbers are placeholders for the team to calibrate with data.</p>
          <div className="mt-6"><Table caption="Kano and RICE scores" head={["Feature", "Kano", "Reach", "Impact", "Confidence", "Effort", "RICE"]} rows={rice.map((r) => [r.feature, r.kano, r.reach, r.impact, `${r.confidence}%`, r.effort, r.score.toFixed(1)])} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Pre-mortem: the product failed in a year. Why?</h3>
          <div className="mt-6"><Table caption="Pre-mortem risks" head={["Risk", "Likelihood · impact", "Mitigation"]} rows={preMortem} /></div>
        </div>
      </Section>

      <Section id="architecture" eyebrow="06 · Information architecture" title="Two roots, one action, and everything else one tap away." intro="The map, the navigation rules, the entity model, the tree-test tasks that will prove or break it, and a card sort you can try.">
        <Status kind="Hypothesis" />
        <DrawOnView className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {sitemap.map((s, i) => (
            <div key={s.name} className={`sk-fade flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-inset ${s.kind === "Action" ? "bg-accent-light/45 ring-accent/30" : "bg-background ring-border"}`} style={sk(i)}>
              <div className="flex items-center justify-between gap-2">
                <h3 className="text-lg">{s.name}</h3>
                <span className="rounded-full bg-surface px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{s.kind}</span>
              </div>
              <p className="text-caption text-muted">{s.note}</p>
              <ul className="grid gap-1.5 border-t border-border pt-3 text-compact">{s.items.map((it) => <li key={it}>{it}</li>)}</ul>
            </div>
          ))}
        </DrawOnView>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Navigation rules</h3>
            <ol className="mt-5 grid gap-2.5">{navRules.map((r, i) => <li key={r} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{r}</li>)}</ol>
          </div>
          <div>
            <h3 className="text-xl">Labels to test</h3>
            <div className="mt-5"><Table caption="Labels to test" head={["Label", "Why", "Alternatives"]} rows={labels} minWidth="min-w-[480px]" /></div>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Entity taxonomy</h3>
          <div className="mt-6"><Table caption="Entity taxonomy" head={["Entity", "Key attributes", "Relations", "Created by"]} rows={entities} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Tree-test tasks</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Run in English and Hindi, at least 50 participants per task. Design basis: Hick-Hyman law, Cowan&apos;s working-memory limit, progressive disclosure and Jakob&apos;s law.</p>
          <div className="mt-6"><Table caption="Tree-test tasks" head={["Task", "Instruction", "Expected path", "Success"]} rows={treeTasks} /></div>
        </div>
        <div className="mt-16">
          <h3 className="text-xl">Try it: the closed sort</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">24 of the 48 cards against the six draft categories. The study has not run, so the “answer” is the file&apos;s hypothesis, not what people did. Nothing is stored or sent.</p>
          <div className="mt-6"><CardSort cards={sortCards} groups={sortGroups} name="Ambient Memory" /></div>
          <details className="mt-6 rounded-2xl bg-surface p-5">
            <summary className="cursor-pointer text-compact font-medium">The full kit: 48 cards, four rounds, decision rules</summary>
            <div className="mt-5 grid gap-5 md:grid-cols-2 lg:grid-cols-4">
              {cardKit.map((g) => (
                <div key={g.group}>
                  <p className={caseLabel}>{g.group} · 12</p>
                  <div className="mt-2"><Chips items={g.cards} /></div>
                </div>
              ))}
            </div>
            <div className="mt-6"><Table caption="Card-sort study design" head={["Round", "Method and sample", "Question answered", "When"]} rows={sortRounds} /></div>
            <ul className="mt-5 grid gap-2 md:grid-cols-2">{sortRules.map((r, i) => <li key={r} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{r}</li>)}</ul>
            <p className="mt-4 text-caption text-muted">Hindi labels to verify with native speakers: Today आज · Ask पूछें · Memory याददाश्त · Privacy गोपनीयता. Candidates only. Sample sizes follow Tullis and Wood: 15 participants correlate about 0.90 with a large sample, 30 about 0.95.</p>
          </details>
        </div>
      </Section>

      <Section id="workflows" tone="tint" eyebrow="07 · Workflows and use cases" title="From six workflows to testable behaviour." intro="One flow per persona, a twelve-item use-case catalogue, and the first use case fully specified with acceptance criteria.">
        <Status kind="Prepared" />
        <DrawOnView className="grid gap-3">
          {workflows.map((w, i) => (
            <div key={w.who} className="sk-fade grid gap-3 rounded-2xl bg-background p-4 ring-1 ring-border ring-inset lg:grid-cols-[minmax(0,13rem)_minmax(0,1fr)] lg:items-center" style={sk(i)}>
              <p className="font-medium">{w.who}</p>
              <ol className="flex flex-wrap items-center gap-x-1 gap-y-2">
                {w.steps.map((s, j) => (
                  <li key={s} className="flex items-center gap-1">
                    <span className="rounded-md bg-surface px-2 py-1 text-caption ring-1 ring-border ring-inset">{s}</span>
                    {j < w.steps.length - 1 && <SketchArrow className="h-3 w-5 text-muted" i={j} />}
                  </li>
                ))}
              </ol>
            </div>
          ))}
        </DrawOnView>
        <div className="mt-14">
          <h3 className="text-xl">Use-case catalogue</h3>
          <div className="mt-6"><Table caption="Use cases" head={["ID", "Use case", "Trigger", "Outcome", "Priority"]} rows={useCases} /></div>
        </div>
        <div className="mt-14 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">{uc02.title}</h3>
            <dl className="mt-4 grid gap-2 rounded-2xl bg-background p-5 text-compact ring-1 ring-border ring-inset">
              <div><dt className="text-caption text-muted">Actor</dt><dd>{uc02.actor}</dd></div>
              <div><dt className="text-caption text-muted">Preconditions</dt><dd>{uc02.preconditions}</dd></div>
              <div><dt className="text-caption text-muted">Trigger</dt><dd>{uc02.trigger}</dd></div>
            </dl>
            <p className={`mt-5 ${caseLabel}`}>Main flow</p>
            <ol className="mt-2 grid gap-2">{uc02.main.map((m, i) => <li key={m} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{i + 1}</span>{m}</li>)}</ol>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div><p className={caseLabel}>Exceptions</p><ul className="mt-2 grid gap-1.5 text-compact text-muted">{uc02.exceptions.map((e) => <li key={e}>{e}</li>)}</ul></div>
              <div><p className={caseLabel}>Business rules</p><ul className="mt-2 grid gap-1.5 text-compact text-muted">{uc02.rules.map((r) => <li key={r}>{r}</li>)}</ul></div>
            </div>
          </div>
          <div>
            <p className={caseLabel}>Acceptance criteria, in Gherkin</p>
            <pre className="mt-3 overflow-x-auto rounded-2xl bg-foreground p-5 font-mono text-[12.5px] leading-relaxed text-background"><code>{uc02.gherkin}</code></pre>
            <p className="mt-3 text-caption text-muted">Method: Cockburn use-case format; hierarchical task analysis; BDD in Gherkin. UC-05 (approve a follow-up email) and UC-08 (grant or revoke AI tool access) are specified the same way in the file.</p>
          </div>
        </div>
      </Section>

      <Section id="words" eyebrow="08 · Wireframes and content design" title="Boxes first, then words. Words are part of the interface." intro="Low-fidelity wireframes with their annotations and open questions, the four states people meet when things are not perfect, and a microcopy library of the moments that earn or lose trust.">
        <Status kind="Prepared" />
        <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {wireCompare.map((w) => (
            <li key={w.label} className="grid gap-2">
              <p className="text-caption text-muted">{w.label}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="overflow-hidden rounded-[14px] ring-1 ring-border"><Image src={w.wire.src} alt={w.wire.alt} width={w.wire.width} height={w.wire.height} sizes="(min-width: 1024px) 140px, 25vw" className="h-auto w-full" /></div>
                <div className="overflow-hidden rounded-[14px] ring-1 ring-border"><Image src={w.final.src} alt={w.final.alt} width={w.final.width} height={w.final.height} sizes="(min-width: 1024px) 140px, 25vw" className="h-auto w-full" /></div>
              </div>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-caption text-muted">Each wireframe carries its purpose, numbered annotations, the states to design and open questions (“Should the hero show a second upcoming meeting?”, “Is Transcript a tab or a sheet?”).</p>
        <div className="mt-14">
          <h3 className="text-xl">Edge states</h3>
          <DrawOnView className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
            {edgeStates.map((e, i) => (
              <div key={e.title} className="sk-fade flex flex-col gap-2 rounded-2xl bg-surface p-5" style={sk(i)}>
                <p className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</p>
                <h4 className="text-lg">{e.title}</h4>
                <p className="text-compact text-muted">{e.text}</p>
              </div>
            ))}
          </DrawOnView>
          <ul className="mt-5 grid gap-2 md:grid-cols-3">{whyTheseFour.map((w, i) => <li key={w} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{w}</li>)}</ul>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Voice principles</h3>
            <div className="mt-5"><Table caption="Voice principles" head={["Principle", "In practice"]} rows={voice} minWidth="min-w-[360px]" /></div>
          </div>
          <div>
            <h3 className="text-xl">Rules of thumb</h3>
            <ul className="mt-5 grid gap-2.5">{rulesOfThumb.map((r, i) => <li key={r} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{r}</li>)}</ul>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Microcopy library: before and after</h3>
          <div className="mt-6"><FlowRows head={["Moment", "Before", "After"]} rows={microcopy} emphasis={2} /></div>
          <p className="mt-4 text-caption text-muted">Principles follow plain-language and calm-technology practice. Consent wording needs legal review before use.</p>
        </div>
      </Section>

      <Section id="visual" tone="tint" eyebrow="09 · Visual design and the science behind it" title="Three directions, one chosen, every decision explained.">
        <Status kind="Prepared" />
        <DirectionCards />
        <div className="mt-8"><Table caption="Direction scoring, 1 to 5, our judgement" head={["Direction", "Trust", "Distinct", "Legible", "Battery", "System", "Total"]} rows={directionScores} /></div>
        <div className="mt-14">
          <h3 className="text-xl">Decision, principle, evidence</h3>
          <div className="mt-6"><FlowRows head={["Design decision", "Principle and source", "Why it helps"]} rows={designDecisions} emphasis={0} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Cutting the first draft in half made it clearer</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">The first version showed everything. A density review found 8 px text, five navigation slots and about 123 words on every screen. The redesign gave each screen one job. Measured from the layouts in the file.</p>
          <div className="mt-6"><StatTiles items={measuredChange} /></div>
          <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 [&>*]:min-w-0">
            <div className="grid grid-cols-2 gap-4">
              <Shot image={v1Today} rounded="rounded-[22px]" sizes="(min-width: 1024px) 220px, 45vw" caption="v1 draft · archived on purpose" />
              <Shot image={v2Today} rounded="rounded-[22px]" sizes="(min-width: 1024px) 220px, 45vw" caption="v2 · one job per screen" />
            </div>
            <div className="grid content-start gap-5 sm:grid-cols-2">
              <div className="rounded-2xl bg-background p-5 ring-1 ring-border ring-inset">
                <p className={caseLabel}>What we removed</p>
                <ul className="mt-3 grid gap-2.5">{removedInV2.map((r, i) => <li key={r} className="flex gap-3 text-compact text-muted"><Cross className="h-5 w-5 shrink-0" i={i} />{r}</li>)}</ul>
              </div>
              <div className="rounded-2xl bg-accent-light/40 p-5">
                <p className={caseLabel}>What we kept, and why</p>
                <ul className="mt-3 grid gap-2.5">{keptInV2.map((k, i) => <li key={k} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{k}</li>)}</ul>
              </div>
            </div>
          </div>
        </div>
      </Section>

      <Section id="system" eyebrow="10 · Design system" title="One token set, two modes, fifty-nine components." intro="Colour, type, space and components, built as real Figma variables. Light and dark share one set of variables; roles, never colour names, in components.">
        <Status kind="Measured" />
        <StatTiles items={coverage} />
        <div className="mt-12">
          <h3 className="text-xl">Colour tokens, two modes</h3>
          <div className="mt-5"><TokenSwatches /></div>
          <p className="mt-3 text-caption text-muted">{tokens.length} colour roles shown; status colours have a fill and a text variant so contrast holds in both modes. Modes: Light, Dark; High contrast later.</p>
        </div>
        <div className="mt-12 grid gap-8 md:grid-cols-3 [&>*]:min-w-0">
          <div><p className={caseLabel}>Spacing</p><div className="mt-2"><Chips items={scales.spacing} mono /></div></div>
          <div><p className={caseLabel}>Radius</p><div className="mt-2"><Chips items={scales.radius} mono /></div></div>
          <div><p className={caseLabel}>Type scale (Inter)</p><div className="mt-2"><Chips items={scales.type} mono /></div><p className="mt-2 text-caption text-muted">Body is 16. Nothing smaller than 12. Display numbers use tabular figures.</p></div>
        </div>
        <div className="mt-12">
          <p className={caseLabel}>Component inventory · 59 built, 69 variants</p>
          <div className="mt-3"><Chips items={components} /></div>
          <p className="mt-3 text-caption text-muted">All built natively, bound to variables, and used by the 35 phone screens, the other-surface layouts and the large-text variants. The list above was the original plan; the build added many it had not listed.</p>
        </div>
        <div className="mt-12 grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
          <div className="rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Usage rules</p>
            <ul className="mt-3 grid gap-2.5">{usageRules.map((r, i) => <li key={r} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{r}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Governance</p>
            <ul className="mt-3 grid gap-2.5">{governance.map((g, i) => <li key={g} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{g}</li>)}</ul>
          </div>
        </div>
        <p className="mt-6 text-caption text-muted">Tokens follow the DTCG format. Atomic design (Frost 2016) informs component layering.</p>
      </Section>

      <Section id="screens" tone="tint" eyebrow="11 · Screens, surfaces and motion" title="Thirty-five screens, one switch between light and dark." intro="Every screen is a frame from the file, built only from library instances. Switch the theme and every chapter follows, because both themes are one set of variables.">
        <Status kind="Prepared" />
        <ThemeJourney chapters={chapters} />
        <div className="mt-20">
          <h3 className="text-xl">Other surfaces</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Thirteen layouts for Watch, Chrome, tablet, landscape and desktop, from the same components: sidebar, window title bar and Watch variants were added for them.</p>
          <ul className="mt-6 grid gap-5 md:grid-cols-2">
            {surfaces.map((s) => (
              <li key={s.title} className={`grid gap-3 ${s.wide ? "md:col-span-2" : ""}`}>
                <div className={s.wide ? "" : "max-w-[420px]"}>
                  <Shot image={s.image} rounded="rounded-2xl" sizes={s.wide ? "(min-width: 1440px) 1200px, 100vw" : "(min-width: 768px) 420px, 100vw"} />
                </div>
                <div>
                  <p className="font-medium">{s.title}</p>
                  <p className="text-compact text-muted">{s.text}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
        <div className="mt-20 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Four text sizes</h3>
            <p className="mt-2 text-compact text-muted">Default, Large, XL and AX5 (about three times), with stacked layouts at the largest. Dynamic type is specified to 200% and not yet tested on a device.</p>
            <div className="mt-6"><Shot image={largeText} rounded="rounded-2xl" sizes="(min-width: 1024px) 560px, 100vw" /></div>
          </div>
          <div>
            <h3 className="text-xl">Right to left</h3>
            <p className="mt-2 text-compact text-muted">All 35 screens mirrored for Arabic. The waveform and the timer stay unmirrored; everything else flips.</p>
            <div className="mt-6"><Shot image={rtl} rounded="rounded-2xl" sizes="(min-width: 1024px) 560px, 100vw" /></div>
          </div>
        </div>
        <div className="mt-20">
          <h3 className="text-xl">The feel of the product</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Responses under about 400 ms feel immediate (Doherty and Thadhani 1982), so every tap gets feedback in 100 ms. People remember the peak and the end (Kahneman et al. 1993): the moment capture stops and the first summary lands is the one to polish.</p>
          <div className="mt-6 grid gap-10">
            <div><p className={caseLabel}>Motion spec</p><div className="mt-3"><Table caption="Motion spec" head={["Moment", "Duration", "Easing", "Behaviour"]} rows={motionSpec} /></div></div>
            <div><p className={caseLabel}>Haptics, sound and visual equivalents</p><div className="mt-3"><Table caption="Haptics, sound and visual equivalents" head={["Event", "Haptic", "Sound", "Visual"]} rows={haptics} /></div></div>
          </div>
          <ul className="mt-6 grid gap-2 md:grid-cols-2">{performance.map((p, i) => <li key={p} className="flex gap-3 text-compact text-muted"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{p}</li>)}</ul>
        </div>
      </Section>

      <Section id="validate" eyebrow="12 · Validate" title="Eight tasks, three rounds, one A/B test, and an honest audit." intro="A complete usability test plan, ready for a prototype and participants, and an accessibility audit measured from the file: what passes, what does not, what to fix.">
        <Status kind="Needs participants" />
        <div className="grid gap-10 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Objectives</h3>
            <ol className="mt-5 grid gap-2.5">{testObjectives.map((o, i) => <li key={o} className="flex gap-3 text-compact"><span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>{o}</li>)}</ol>
          </div>
          <div>
            <h3 className="text-xl">Rounds and sample</h3>
            <div className="mt-5"><Table caption="Test rounds" head={["Round", "Artefact", "Participants"]} rows={testRounds} minWidth="min-w-[360px]" /></div>
            <p className="mt-3 text-caption text-muted">Run in English and Hindi. Five users per round find most major problems; iterate between rounds instead of testing 20 at once (Nielsen and Landauer).</p>
          </div>
        </div>
        <div className="mt-12">
          <h3 className="text-xl">Task set, moderated</h3>
          <div className="mt-6"><Table caption="Usability tasks" head={["ID", "Scenario, read to the participant", "Success looks like"]} rows={testTasks} /></div>
          <p className="mt-3 text-caption text-muted">Measures: task success, time on task and taps, first-click correctness, errors and recoveries, SUS after each session, a four-item trust score after the Ask and approve tasks. Severity 4 blocks the task and is fixed before release.</p>
        </div>
        <div className="mt-10 rounded-2xl bg-surface p-6">
          <p className={caseLabel}>A/B test · {abTest.question}</p>
          <div className="mt-3 grid gap-4 sm:grid-cols-2 text-compact">
            <p><span className="font-medium">A · </span>{abTest.a}</p>
            <p><span className="font-medium">B · </span>{abTest.b}</p>
            <p className="text-muted">Primary measure: {abTest.measure}. Sample: {abTest.sample}.</p>
            <p className="text-muted">Guardrail: {abTest.guardrail}.</p>
          </div>
        </div>
        <div className="mt-16">
          <h3 className="text-xl">Measured contrast, both modes</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Computed here, on this page, from the token values in the design system section with the WCAG relative-luminance formula. WCAG 2.2 AA: 4.5:1 for text, 3:1 for icons and boundaries.</p>
          <div className="mt-6"><ContrastTable /></div>
          <ul className="mt-6 grid gap-2.5 md:grid-cols-2">{a11yFindings.map((f, i) => <li key={f} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{f}</li>)}</ul>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Target size audit</h3>
            <p className="mt-2 text-compact text-muted">Measured from the layout source. WCAG 2.2 Target Size (Minimum) is 24 × 24 CSS px, which all targets pass; our stricter rule is 44 px.</p>
            <div className="mt-5"><Table caption="Target size audit" head={["Element", "Size (px)", "WCAG 2.2", "Our 44 px rule"]} rows={targetAudit} minWidth="min-w-[520px]" /></div>
          </div>
          <div>
            <h3 className="text-xl">Localisation checklist</h3>
            <div className="mt-5"><Table caption="Localisation checklist" head={["Area", "Rule"]} rows={localisation} minWidth="min-w-[420px]" /></div>
          </div>
        </div>
      </Section>

      <Section id="privacy" tone="tint" eyebrow="13 · Privacy, trust and ethics" title="Privacy by design, written down and checked." intro="Data flows, regulation, dark patterns, human-AI guidelines and the risks we must still close. Not legal advice; review with counsel before launch.">
        <Status kind="Prepared" />
        <h3 className="text-xl">Data inventory</h3>
        <div className="mt-5"><Table caption="Data inventory" head={["Data", "Where processed", "Stored", "Retention (proposed)", "Access"]} rows={dataInventory} minWidth="min-w-[800px]" /></div>
        <div className="mt-14">
          <h3 className="text-xl">Regulatory map</h3>
          <div className="mt-5"><Table caption="Regulatory map, not legal advice" head={["Regime", "What matters for us", "Action"]} rows={regulation} /></div>
        </div>
        <div className="mt-14 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Dark-pattern audit</h3>
            <div className="mt-5"><Table caption="Dark-pattern audit" head={["Pattern", "Our design", "Status"]} rows={darkPatterns} minWidth="min-w-[480px]" /></div>
          </div>
          <div>
            <h3 className="text-xl">Ethics and risk register</h3>
            <div className="mt-5"><Table caption="Ethics and risk register" head={["Risk", "Level", "Mitigation"]} rows={riskRegister} minWidth="min-w-[480px]" /></div>
          </div>
        </div>
        <div className="mt-14 grid gap-5 md:grid-cols-2 [&>*]:min-w-0">
          <DrawOnView className="flex flex-col gap-4 rounded-2xl bg-foreground p-6 text-background">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">Principles we commit to</p>
            <ul className="grid gap-2.5">{privacyPrinciples.map((p, i) => <li key={p} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent-light" i={i} />{p}</li>)}</ul>
            <Doodle name="shield" className="mt-auto h-20 w-20 self-end text-background opacity-80" i={3} />
          </DrawOnView>
          <div className="rounded-2xl border border-dashed border-border-strong p-6">
            <p className={caseLabel}>Open decisions for legal and product</p>
            <ul className="mt-4 grid gap-2.5">{openLegal.map((o) => <li key={o} className="flex gap-3 text-compact text-muted"><span aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-dashed border-muted" />{o}</li>)}</ul>
          </div>
        </div>
      </Section>

      <Section id="deliver" eyebrow="14 · Deliver" title="What engineering needs, in one place. Say it plainly, measure it honestly." intro="Token pipeline, component mapping, an analytics plan that never logs content, budgets, a positioning statement and a gated rollout. No launch data exists yet.">
        <Status kind="Prepared" />
        <h3 className="text-xl">Token pipeline</h3>
        <div className="mt-5"><Pipeline stages={pipeline} /></div>
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,2fr)_minmax(0,3fr)] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Definition of done</h3>
            <ul className="mt-5 grid gap-2.5">{definitionOfDone.map((d, i) => <li key={d} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{d}</li>)}</ul>
            <p className={`mt-8 ${caseLabel}`}>Performance budgets</p>
            <ul className="mt-3 grid gap-2 text-compact text-muted">{budgets.map((b) => <li key={b}>{b}</li>)}</ul>
          </div>
          <div>
            <h3 className="text-xl">Analytics event plan</h3>
            <p className="mt-2 text-compact text-muted">Ten of the eighteen events. No audio, transcript text or names are ever sent; properties are counts, enums and durations only.</p>
            <div className="mt-5"><Table caption="Analytics events" head={["Event", "Properties", "Feeds"]} rows={events} minWidth="min-w-[480px]" /></div>
          </div>
        </div>
        <div className="mt-14 grid gap-5 lg:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] [&>*]:min-w-0">
          <DrawOnView className="rounded-2xl bg-surface p-6">
            <p className={caseLabel}>Positioning statement · candidate, to test</p>
            <p className="mt-3 text-[clamp(1.15rem,1.8vw,1.4rem)] leading-snug tracking-[-0.01em]">{positioningStatement}</p>
          </DrawOnView>
          <div className="grid content-start gap-5 rounded-2xl bg-surface p-6">
            <div><p className={caseLabel}>Messaging pillars</p><ol className="mt-2 grid gap-1.5 text-compact">{pillars.map((p, i) => <li key={p}><span className="font-mono text-xs text-accent">{i + 1} </span>{p}</li>)}</ol></div>
            <div><p className={caseLabel}>Candidate taglines</p><ul className="mt-2 grid gap-1.5 text-compact text-muted">{taglines.map((t) => <li key={t}>{t}</li>)}</ul></div>
          </div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Experiment roadmap</h3>
          <div className="mt-5"><Table caption="Experiments" head={["ID", "Experiment", "Hypothesis", "Primary measure"]} rows={experiments} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Rollout gates</h3>
          <div className="mt-5"><Pipeline stages={rollout} /></div>
          <p className="mt-4 text-caption text-muted">Feedback loops: in-app “Fix a fact” and “Report a problem”, a monthly changelog in plain language, a weekly review of blocked-request and gap logs, a quarterly diary study with eight users.</p>
        </div>
      </Section>

      <Section id="next" tone="tint" eyebrow="15 · Next" title="Validate with people, then build.">
        <StepStrip steps={nextSteps.map((s) => ({ label: s.label, title: s.title, text: s.text, doodle: <Doodle name={s.doodle} className="h-12 w-12" /> }))} />
        <div className="mt-14 grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
          <div className="rounded-2xl bg-background p-6 ring-1 ring-border ring-inset">
            <p className={caseLabel}>What I learned</p>
            <ul className="mt-3 grid gap-2.5">{lessons.map((l, i) => <li key={l} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{l}</li>)}</ul>
          </div>
          <div className="rounded-2xl bg-foreground p-6 text-background">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">Honest limits</p>
            <ul className="mt-3 grid gap-2.5">{honestLimits.map((h) => <li key={h} className="flex gap-3 text-compact"><span aria-hidden="true" className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rounded-full bg-accent-light" />{h}</li>)}</ul>
          </div>
        </div>
        <div className="mt-14 border-t border-border pt-6">
          <p className={caseLabel}>Sources and methods</p>
          <ul className="mt-3 grid gap-2 text-compact">
            {sources.map((s) => (
              <li key={s.label}><a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong underline-offset-4 hover:text-accent">{s.label}</a></li>
            ))}
          </ul>
          <p className="mt-6 text-compact text-muted">Related: <Link href="/process" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">the process this follows</Link> · <Link href="/work/hosamane" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Hosamane, an agent with approvals</Link> · <Link href="/work/takt" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Takt, information architecture with a live tree test</Link></p>
        </div>
      </Section>

      <CaseCta title="Designing something people must trust with their whole day?" />
    </article>
  );
}
