import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackLink, CaseCta, CaseIndex, CaseKicker, FactList, Section, caseLabel } from "@/components/case/CaseParts";
import DeviceJourney from "@/components/case/DeviceJourney";
import AgentSystem from "@/components/sketch/AgentSystem";
import { BarList, Proportion, StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { CompareMatrix, FlowRows, StepStrip } from "@/components/sketch/flows";
import { Cross, Half, Spark, Tick } from "@/components/sketch/glyphs";
import { UnderlineMark } from "@/components/sketch/marks";
import PersonaCard from "@/components/sketch/PersonaCard";
import { JourneyMap, Ladder } from "@/components/sketch/structures";
import {
  antiPersona, chapters, cityFacts, devices, facts, hero, journey, keyNumbers, ladder, matrix, neverList, nextSteps, painPoints,
  paradigmScores, personas, psychology, reviewThemes, systemSteps, validation, verdicts, wireCompare,
} from "@/lib/work/hosamane";

export const metadata: Metadata = {
  title: "Hosamane: an agent that does a good broker's legwork",
  description:
    "End-to-end use case: an agentic-first home search for Bengaluru, for renting and buying. Desk research with 300 coded reviews, an agent with 19 typed tools and server-checked approvals, a working prototype at four screen sizes, and agent and accessibility tests.",
  openGraph: {
    title: "Hosamane: an agent that does a good broker's legwork — Vivekanand Choudhari",
    description: "Agentic-first home search for Bengaluru: research, agent architecture and a working prototype.",
    images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }],
  },
  alternates: { canonical: "/work/hosamane" },
};

const index = [
  { id: "signal", label: "Signal" },
  { id: "brief", label: "Brief" },
  { id: "research", label: "Research" },
  { id: "people", label: "People" },
  { id: "journey", label: "Today's journey" },
  { id: "psychology", label: "Psychology" },
  { id: "architecture", label: "Agent architecture" },
  { id: "screens", label: "Screens" },
  { id: "system", label: "Wireframes and system" },
  { id: "validate", label: "Validation" },
  { id: "next", label: "Next" },
];

/** Verdict stamp for a hypothesis: supported, partly, or added from the evidence. */
function Verdict({ verdict, i }: { verdict: string; i: number }) {
  const v = verdict.toLowerCase();
  const glyph = v.startsWith("added") ? <Spark className="h-5 w-5 text-accent" i={i} /> : v.startsWith("partly") || v.includes("inference") ? <Half className="h-5 w-5 text-muted" i={i} /> : <Tick className="h-5 w-5 text-foreground" i={i} />;
  return <span className="flex items-center gap-2 text-caption text-muted">{glyph}{verdict}</span>;
}

export default function HosamaneCase() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="Agentic AI · Research to working prototype" status="Use case, design concept" />
        <h1 className="mt-3 max-w-[20ch]">Hosamane: an agent that does a good broker&apos;s legwork.</h1>
        <p className="mt-6 max-w-[58ch] text-lg leading-relaxed text-muted">
          <strong className="font-medium text-foreground">Hosamane</strong> (Kannada for “new home”) is an agentic-first home search for Bengaluru. Describe your life
          once: the agent searches, checks, costs and asks owners, and never contacts anyone without your tap. I took it from desk research to a working agent.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <Link href="/hosamane" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-compact font-medium text-background hover:bg-accent">
            Try the agent
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6" /></svg>
          </Link>
          <p className="text-caption text-muted">Runs right here, with 60 fictional listings. Nothing is sent to anyone.</p>
        </div>
        <FactList facts={facts} />
        <figure className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-40px_rgb(15_15_16/0.35)]">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(min-width: 1440px) 1200px, 100vw" priority className="h-auto w-full" />
          </div>
          <figcaption className="mt-3 text-caption text-muted">Captured from the working prototype. Listings, owners and builders are fictional; owners&apos; replies are simulated.</figcaption>
        </figure>
        <div className="mt-12">
          <StatTiles items={keyNumbers} />
        </div>
        <CaseIndex items={index} />
      </header>

      <Section id="signal" eyebrow="00 · Signal and framing" title="Finding a home means trusting listings you can't check.">
        <DrawOnView className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {painPoints.map((p, i) => (
            <div key={p.title} className="sk-fade flex flex-col gap-3 rounded-2xl bg-surface p-5" style={{ "--sk-i": i } as React.CSSProperties}>
              <Doodle name={p.doodle} className="h-12 w-12 text-foreground" i={i} />
              <h3 className="text-lg">{p.title}</h3>
              <p className="text-compact text-muted">{p.text}</p>
            </div>
          ))}
        </DrawOnView>
        <DrawOnView className="mt-10 max-w-[44ch]">
          <p className={caseLabel}>Design question</p>
          <p className="mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug tracking-[-0.02em]">
            How might an agent do a good broker&apos;s legwork while you stay in control of{" "}
            <span className="relative inline-block">every commitment?<UnderlineMark className="absolute -bottom-2 left-0 h-3 w-full" i={4} /></span>
          </p>
        </DrawOnView>
      </Section>

      <Section id="brief" tone="tint" eyebrow="01 · Brief" title="Eight hypotheses, and what the evidence said." intro="Written before any research, with kill criteria. Anything not measured is labelled an assumption.">
        <div className="grid gap-5 lg:grid-cols-[minmax(0,2fr)_minmax(0,1fr)] [&>*]:min-w-0">
          <DrawOnView className="grid gap-3 sm:grid-cols-2">
            {verdicts.map((v, i) => (
              <div key={v.h} className="sk-fade flex flex-col gap-2 rounded-2xl bg-background p-4 ring-1 ring-border ring-inset" style={{ "--sk-i": i } as React.CSSProperties}>
                <p className="font-mono text-xs text-accent">{v.h}</p>
                <p className="text-compact">{v.text}</p>
                <Verdict verdict={v.verdict} i={i} />
              </div>
            ))}
          </DrawOnView>
          <DrawOnView className="flex flex-col gap-4 rounded-2xl bg-foreground p-6 text-background">
            <p className="font-mono text-xs uppercase tracking-[0.06em] opacity-70">The agent never</p>
            <ul className="grid gap-3">
              {neverList.map((n, i) => (
                <li key={n} className="flex gap-3 text-compact">
                  <Cross className="h-5 w-5 shrink-0 text-background" i={i} />
                  {n}
                </li>
              ))}
            </ul>
            <Doodle name="ban" className="mt-auto h-24 w-24 self-end text-background opacity-80" i={3} />
            <p className="text-caption opacity-70">Set before any design work, and enforced in the prototype&apos;s code.</p>
          </DrawOnView>
        </div>
      </Section>

      <Section id="research" eyebrow="02 · Research" title="300 reviews, 8 platforms, 15 Bengaluru questions." intro="App Store reviews coded against a written codebook, three portals reviewed, 101 dated sources, and eleven key claims checked against their sources.">
        <div className="grid gap-14 [&>*]:min-w-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
            <div>
              <h3 className="text-xl">What searchers complain about</h3>
              <div className="mt-6">
                <BarList
                  items={reviewThemes.map((r) => ({ label: r.theme, value: r.pct, display: `${r.n} · ${r.pct}%` }))}
                  max={100}
                  highlight={[0, 1]}
                  caption="128 searchers in a random sample of 300 India App Store reviews from 2024 on, across five apps. A review can have several themes."
                />
              </div>
            </div>
            <div className="grid content-start gap-4 rounded-2xl bg-surface p-6">
              <p className={caseLabel}>The finding that shaped the agent</p>
              <p className="text-[clamp(1.4rem,2.4vw,1.8rem)] leading-tight tracking-[-0.02em]">51 reviews mention a paid “relationship manager”. 43 are negative.</p>
              <Proportion part={43} whole={51} label="reviews of paid relationship managers are negative" />
              <p className="text-compact text-muted">People already pay for someone to do the legwork, and it fails on invisible work. So the agent shows everything it does, and asks before it acts.</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl">What exists, and what doesn&apos;t</h3>
            <div className="mt-6">
              <CompareMatrix columns={["India (5 platforms)", "Global references", "Hosamane"]} rows={matrix} caption="Competitor capabilities against Hosamane's design" />
            </div>
          </div>
          <div>
            <h3 className="text-xl">Bengaluru facts that shaped the design</h3>
            <div className="mt-6">
              <StatTiles items={cityFacts.map((f) => ({ value: f.figure, label: f.text }))} cols="sm:grid-cols-2 lg:grid-cols-3" />
            </div>
            <p className="mt-4 text-caption text-muted">Sources: Karnataka Stamps and Registration, Karnataka RERA, RBI, Anarock, TomTom and Bengaluru Traffic Police, and reporting in Asianet and Business Today, all dated in the project&apos;s research file.</p>
          </div>
        </div>
      </Section>

      <Section id="people" tone="tint" eyebrow="02 · Research · people" title="Who it's for, and who it must not serve." intro="Three proto-personas built from the reviews and market facts above. They are assumptions until interviews replace them.">
        <DrawOnView className="grid gap-5 md:grid-cols-3 [&>*]:min-w-0">
          {personas.map((p, i) => <PersonaCard key={p.name} persona={p} i={i * 3} />)}
        </DrawOnView>
        <div className="mt-5 flex flex-col gap-2 rounded-2xl border border-dashed border-border-strong bg-background p-5 sm:flex-row sm:items-baseline sm:gap-6">
          <p className="shrink-0 font-mono text-xs uppercase tracking-[0.06em] text-muted">Anti-persona</p>
          <p className="text-compact"><span className="font-medium">{antiPersona.name}.</span> <span className="text-muted">{antiPersona.text}</span></p>
        </div>
      </Section>

      <Section id="journey" eyebrow="02 · Research · today's journey" title="Seven steps, and where each one hurts." intro="Rohan's search as it works today, from the evidence. Each step leaves an opening the agent is designed for.">
        <JourneyMap stages={journey} />
      </Section>

      <Section id="psychology" tone="tint" eyebrow="03 · Psychology mapping" title="Findings become constraints.">
        <FlowRows head={["Finding", "Principle", "Decision"]} rows={psychology.map((p) => [p.finding, p.principle, p.decision])} emphasis={2} />
      </Section>

      <Section id="architecture" eyebrow="04 · Paradigm gate and architecture" title="Agentic-first, but only with receipts and approvals." intro="Agentic-first won on effort, vague needs and shortlisting, and holds on trust only because every fact has a source and nothing contacts a person without approval.">
        <div className="grid gap-16 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">One turn of the agent</h3>
            <div className="mt-6 rounded-2xl bg-surface p-5 md:p-8">
              <AgentSystem steps={systemSteps} caption="Claude only chooses tools and words the reply. Everything that keeps people safe runs in code, every time." />
            </div>
          </div>
          <div>
            <h3 className="text-xl">What the agent may do</h3>
            <p className="mt-2 max-w-[60ch] text-compact text-muted">19 typed tools, by how much they need from you. Tools that pay, sign, take ID documents, reveal phone numbers or export in bulk don&apos;t exist.</p>
            <div className="mt-6"><Ladder rungs={ladder} /></div>
          </div>
          <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 [&>*]:min-w-0">
            <div>
              <h3 className="text-xl">Four paradigms, scored</h3>
              <div className="mt-6">
                <BarList items={paradigmScores.map((p) => ({ label: p.name, value: p.score, display: `${p.score} / 30` }))} max={30} highlight={[3]} caption="Six criteria from the research, 5 points each. Design judgements, not measurements." />
              </div>
            </div>
            <DrawOnView className="grid content-start gap-3 sm:grid-cols-3 lg:grid-cols-1">
              {[
                { doodle: "code", title: "Approvals the agent can't fake", text: "The server signs a short-lived token for that exact action when you tap. The model never sees the secret." },
                { doodle: "receipt", title: "Facts only from tools", text: "A reply with a figure no tool returned goes back for one rewrite, and the tests trace every figure." },
                { doodle: "prd", title: "Memory you can see", text: "The brief is a set of chips, each marked “you said” or “I assumed”, and you can remove any." },
              ].map((c, i) => (
                <div key={c.title} className="sk-fade flex gap-4 rounded-2xl bg-surface p-5" style={{ "--sk-i": i } as React.CSSProperties}>
                  <Doodle name={c.doodle} className="h-10 w-10 shrink-0 text-foreground" i={i} />
                  <div>
                    <h3 className="text-lg">{c.title}</h3>
                    <p className="mt-1 text-compact text-muted">{c.text}</p>
                  </div>
                </div>
              ))}
            </DrawOnView>
          </div>
        </div>
      </Section>

      <Section id="screens" tone="tint" eyebrow="05 · Interface" title="Two journeys, four screen sizes." intro="Rohan renting with a flatmate; Meera and Karthik buying their first home. Every screen is a capture of the working prototype.">
        <DeviceJourney chapters={chapters} devices={devices} />
        <p className="mt-10 text-caption text-muted">Captured with the scripted planner, so the screens repeat exactly. <Link href="/hosamane" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Try the live agent</Link> to see it with Claude.</p>
      </Section>

      <Section id="system" eyebrow="05 · Wireframes and design system" title="Same build, two levels of finish." intro="The wireframes are the same screens with a greyscale theme switched on, so the comparison is honest.">
        <ul className="grid grid-cols-2 gap-5 lg:grid-cols-4">
          {wireCompare.map((w) => (
            <li key={w.step} className="grid gap-2">
              <p className="text-caption text-muted">{w.label}</p>
              <div className="grid grid-cols-2 gap-2">
                <div className="overflow-hidden rounded-[14px] ring-1 ring-border"><Image src={w.wire.src} alt={w.wire.alt} width={w.wire.width} height={w.wire.height} sizes="(min-width: 1024px) 140px, 25vw" className="h-auto w-full" /></div>
                <div className="overflow-hidden rounded-[14px] ring-1 ring-border"><Image src={w.final.src} alt={w.final.alt} width={w.final.width} height={w.final.height} sizes="(min-width: 1024px) 140px, 25vw" className="h-auto w-full" /></div>
              </div>
            </li>
          ))}
        </ul>
        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14">
          <div>
            <h3 className="text-xl">Calm ledger</h3>
            <p className="mt-2 text-compact leading-relaxed text-muted">Deep teal and warm sand, distinct from the red, blue and purple portals, and unhurried where they use urgency. Every text pair is 5.3:1 or better; control borders are 4.0:1.</p>
            <ul className="mt-4 flex flex-wrap gap-3">
              {[["#0F5F6B", "Primary"], ["#15181B", "Ink"], ["#FBFAF7", "Canvas"], ["#F3F0EA", "Surface"], ["#1D6F45", "Passed"], ["#8F5205", "Flag"], ["#B42318", "Never"]].map(([hex, name]) => (
                <li key={hex} className="grid gap-1 text-caption text-muted"><span aria-hidden="true" className="block h-12 w-16 rounded-lg ring-1 ring-border" style={{ background: hex }} />{name}<span className="font-mono text-xs">{hex}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl">Poppins, by Indian Type Foundry</h3>
            <p className="mt-2 text-compact leading-relaxed text-muted">A geometric sans from an Ahmedabad foundry, with Latin and Devanagari, so Hindi replies can share the family. Kannada will need a companion face. Three weights: regular, medium and semibold.</p>
          </div>
        </div>
      </Section>

      <Section id="validate" tone="tint" eyebrow="06 · Validate" title={`${validation.evals.passed} of ${validation.evals.total} agent tests, ${validation.a11y.clean} of ${validation.a11y.total} accessible states.`} intro={`Measured on the prototype. ${validation.evals.model.name} plans each turn; guardrails, approvals and output checks stay in code. A scripted planner runs the same tests as a baseline.`}>
        <StatTiles items={validation.tiles} />
        <div className="mt-14 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Each group, both planners</h3>
            <table className="mt-5 w-full border-collapse text-left text-compact">
              <caption className="sr-only">Agent test results by group</caption>
              <thead><tr className="border-b border-border"><th scope="col" className="py-2.5 pr-4 text-caption font-normal text-muted">Group</th><th scope="col" className="py-2.5 pr-4 text-caption font-normal text-muted">Scripted</th><th scope="col" className="py-2.5 text-caption font-normal text-accent">Claude</th></tr></thead>
              <tbody>
                {validation.evals.groups.map((g) => (
                  <tr key={g.name} className="border-b border-border last:border-0">
                    <th scope="row" className="py-2.5 pr-4 align-top font-medium">{g.name}</th>
                    <td className="py-2.5 pr-4 align-top whitespace-nowrap tabular-nums text-muted">{g.scripted}</td>
                    <td className="py-2.5 align-top whitespace-nowrap tabular-nums">{g.model}</td>
                  </tr>
                ))}
              </tbody>
            </table>
            <p className="mt-4 text-caption text-muted">{validation.evals.model.runs} consecutive runs with Claude, same results each time. Top-5 results meeting every hard constraint: {validation.evals.top5}.</p>
          </div>
          <div>
            <h3 className="text-xl">What the tests caught</h3>
            <DrawOnView className="mt-5 grid gap-3 sm:grid-cols-2">
              {validation.caught.map((c, i) => (
                <div key={c.title} className="sk-fade flex flex-col gap-2 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={{ "--sk-i": i } as React.CSSProperties}>
                  <Doodle name={c.doodle} className="h-9 w-9 text-foreground" i={i} />
                  <h4 className="text-[1.0625rem]">{c.title}</h4>
                  <p className="text-compact text-muted">{c.text}</p>
                </div>
              ))}
            </DrawOnView>
          </div>
        </div>
      </Section>

      <Section id="next" eyebrow="What I'd do next" title="Put it in front of people." intro="A fast-track use case: no interviews or usability tests yet. These are planned, not run.">
        <StepStrip steps={nextSteps.map((s) => ({ label: s.label, title: s.title, text: s.text, doodle: <Doodle name={s.doodle} className="h-12 w-12" /> }))} />
        <p className="mt-10 text-compact text-muted">Related: <Link href="/process" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">the process this follows</Link> · <Link href="/work/agentic-inventory" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">MW-Inventory, another agent I designed and built</Link></p>
      </Section>

      <CaseCta title="Designing an agent people need to trust?" />
    </article>
  );
}
