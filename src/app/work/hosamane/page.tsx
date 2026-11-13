import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { BackLink, BulletList, CaseCta, CaseIndex, CaseKicker, FactList, NumberedGrid, Section, caseLabel } from "@/components/case/CaseParts";
import DeviceJourney from "@/components/case/DeviceJourney";
import { chapters, cityFacts, devices, facts, gaps, hero, neverList, nextSteps, paradigmScores, psychology, reviewThemes, toolLevels, validation, verdicts, wireCompare } from "@/lib/work/hosamane";

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
  { id: "psychology", label: "Psychology" },
  { id: "architecture", label: "Agent architecture" },
  { id: "screens", label: "Screens" },
  { id: "system", label: "Wireframes and system" },
  { id: "validate", label: "Validation" },
  { id: "next", label: "Next" },
];

const th = "py-2.5 pr-4 text-caption font-normal text-muted";
const td = "py-2.5 pr-4 align-top";

function Table({ label, head, rows, wide = true }: { label: string; head: string[]; rows: React.ReactNode[][]; wide?: boolean }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={label}>
      <table className={`w-full border-collapse text-left text-compact ${wide ? "min-w-[560px]" : ""}`}>
        <caption className="sr-only">{label}</caption>
        <thead><tr className="border-b border-border">{head.map((h) => <th key={h} scope="col" className={th}>{h}</th>)}</tr></thead>
        <tbody>{rows.map((r, i) => <tr key={i} className="border-b border-border last:border-0">{r.map((c, j) => (j === 0 ? <th key={j} scope="row" className={`${td} font-medium`}>{c}</th> : <td key={j} className={`${td} text-muted`}>{c}</td>))}</tr>)}</tbody>
      </table>
    </div>
  );
}

export default function HosamaneCase() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="Agentic AI · Research to working prototype" status="Use case, design concept" />
        <h1 className="mt-3 max-w-[20ch]">Hosamane: an agent that does a good broker&apos;s legwork.</h1>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
          <strong className="font-medium text-foreground">Hosamane</strong> (Kannada for “new home”) is an agentic-first home search for Bengaluru, for renting and
          buying. You describe your life once; the agent searches, checks listings, works out the real cost, asks owners your questions and plans visits, and it asks
          before it contacts anyone. I took it from desk research to an agent architecture and a working prototype.
        </p>
        <FactList facts={facts} />
        <figure className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-40px_rgb(15_15_16/0.35)]">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(min-width: 1440px) 1200px, 100vw" priority className="h-auto w-full" />
          </div>
          <figcaption className="mt-3 text-caption text-muted">Captured from the working prototype. Listings, owners and builders are fictional; owners&apos; replies are simulated.</figcaption>
        </figure>
        <CaseIndex items={index} />
      </header>

      <Section id="signal" eyebrow="00 · Signal and framing" title="Finding a home means trusting listings you can't check.">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16 [&>*]:min-w-0">
          <p className="text-lg leading-relaxed text-muted">
            In Bengaluru that means listings that may be fake or already taken, deposits of six to nine months&apos; rent that only surface late, weekends lost to
            visits, and a family or flatmate who has a say but no part in the search. Today&apos;s platforms show thousands of listings. The people who actually
            help people decide are brokers, and they come with fees, pressure and mixed trust.
          </p>
          <p className="text-lg leading-relaxed">
            <span className="text-muted">Design question:</span> how might an agent do the legwork of a good broker (understand the need, check the listings, ask the
            questions, plan the visits, help the group decide) while the person stays in control of every commitment?
          </p>
        </div>
      </Section>

      <Section id="brief" eyebrow="01 · Brief" title="Eight hypotheses, and what the evidence said." intro="Written before any research, with kill criteria. Fast track: desk research only, so anything not measured is labelled as an assumption.">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
          <Table label="Hypotheses and verdicts" head={["", "Hypothesis", "Verdict"]} rows={verdicts.map((v) => [v.h, v.text, v.verdict])} />
          <div className="grid content-start gap-3 rounded-2xl bg-surface p-6 ring-1 ring-border ring-inset">
            <p className={caseLabel}>The agent never</p>
            <ul className="grid gap-2 text-compact">{neverList.map((n) => <li key={n} className="flex gap-2.5"><span aria-hidden="true" className="mt-[0.55em] h-1.5 w-1.5 shrink-0 rounded-full bg-[#b42318]" />{n}</li>)}</ul>
            <p className="text-caption text-muted">Set before any design work, and enforced in the prototype&apos;s code.</p>
          </div>
        </div>
      </Section>

      <Section id="research" eyebrow="02 · Research" title="300 reviews, 8 platforms, 15 Bengaluru questions." intro="App Store reviews coded against a written codebook (with a second, independent pass on 30), a heuristic review of three portals, a competitor analysis with 101 dated sources, and sourced market facts. Eleven key claims were checked against their sources.">
        <div className="grid gap-12 [&>*]:min-w-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
            <div>
              <h3 className="text-xl">What people searching for a home complain about</h3>
              <p className="mt-1 text-caption text-muted">128 searchers in a random sample of 300 India App Store reviews from 2024 on, across five apps. A review can have several themes.</p>
              <div className="mt-4"><Table label="Review themes among searchers" head={["Theme", "Reviews", "Share"]} rows={reviewThemes.map((r) => [r.theme, String(r.n), `${r.pct}%`])} /></div>
            </div>
            <div className="grid content-start gap-3 rounded-2xl bg-surface p-6 ring-1 ring-border ring-inset">
              <p className={caseLabel}>The finding that shaped the agent</p>
              <p className="text-[clamp(1.5rem,2.4vw,1.9rem)] leading-tight tracking-[-0.02em]">51 reviews mention a paid “relationship manager”. 43 are negative.</p>
              <p className="text-compact text-muted">People already pay for someone to do the legwork. It fails on invisible work: unreachable, uncoordinated, nothing done for days. So the agent shows everything it does, and asks before it acts.</p>
            </div>
          </div>
          <div>
            <h3 className="text-xl">What exists, and what doesn&apos;t</h3>
            <div className="mt-4"><Table label="Competitor gaps" head={["Capability", "India (5 platforms)", "Global references"]} rows={gaps.map((g) => [g.capability, g.india, g.global])} /></div>
          </div>
          <div>
            <h3 className="text-xl">Bengaluru facts that shaped the design</h3>
            <ul className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {cityFacts.map((f) => (
                <li key={f.figure} className="border-t border-border-strong pt-4">
                  <p className="text-2xl tracking-[-0.02em]">{f.figure}</p>
                  <p className="mt-1 text-compact leading-relaxed text-muted">{f.text}</p>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-caption text-muted">Sources: Karnataka Stamps and Registration, Karnataka RERA, RBI, Anarock, TomTom and Bengaluru Traffic Police, and reporting in Asianet and Business Today, all dated in the project&apos;s research file.</p>
          </div>
        </div>
      </Section>

      <Section id="psychology" eyebrow="03 · Psychology mapping" title="Findings become constraints.">
        <Table label="Psychology mapping" head={["Finding", "Principle", "Decision"]} rows={psychology.map((p) => [p.finding, p.principle, p.decision])} />
      </Section>

      <Section id="architecture" eyebrow="04 · Paradigm gate and architecture" title="Agentic-first, but only with receipts and approvals." intro="Four paradigms scored on six criteria from the research. Agentic-first won on effort, vague needs and shortlisting, and only holds on trust because every fact has a source, every action is logged, and nothing that contacts a person happens without approval.">
        <div className="grid gap-12 [&>*]:min-w-0">
          <div className="grid gap-10 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14 [&>*]:min-w-0">
            <div>
              <h3 className="text-xl">Paradigm scores (of 30)</h3>
              <div className="mt-4"><Table label="Paradigm scores" wide={false} head={["Paradigm", "Score"]} rows={paradigmScores.map((p) => [p.name, String(p.score)])} /></div>
              <p className="mt-3 text-caption text-muted">Design judgements, not measurements. The structure chosen: “conversation in, board out”.</p>
            </div>
            <div>
              <h3 className="text-xl">19 typed tools, by what they may do</h3>
              <ul className="mt-4 grid gap-4">
                {toolLevels.map((lv) => (
                  <li key={lv.level} className="rounded-2xl bg-surface p-5 ring-1 ring-border ring-inset">
                    <p className="flex flex-wrap items-baseline justify-between gap-2"><span className="text-[17px]">{lv.level}</span><span className="text-caption text-muted">{lv.note}</span></p>
                    <ul className="mt-3 flex flex-wrap gap-1.5">{lv.tools.map((t) => <li key={t} className="rounded-md bg-background px-2 py-1 font-mono text-xs ring-1 ring-border ring-inset">{t}</li>)}</ul>
                  </li>
                ))}
              </ul>
              <p className="mt-3 text-caption text-muted">Tools that pay, sign, take ID documents, reveal phone numbers or export in bulk don&apos;t exist.</p>
            </div>
          </div>
          <NumberedGrid items={[
            { title: "Approvals the agent can't fake", body: "Tapping approve asks the server to sign a short-lived token for that exact action. The planner never sees the secret, and the tools reject anything forged, expired or meant for something else." },
            { title: "Facts only from tools", body: "Replies are written from tool results, and every check carries its source and date. A reply with an amount or duration no tool returned goes back to the model for one rewrite, and the tests trace every figure." },
            { title: "Memory you can see", body: "The brief is a set of chips, each tagged “you said” or “I assumed”. Tap to change or remove; “forget everything” clears it." },
          ]} />
        </div>
      </Section>

      <Section id="screens" eyebrow="05 · Interface" title="Two journeys, four screen sizes." intro="Rohan, relocating to rent with a flatmate, and Meera and Karthik, buying their first home. Every screen is a capture of the working prototype, taken with the scripted planner so the captures repeat exactly; switch the size to see how each step adapts.">
        <DeviceJourney chapters={chapters} devices={devices} />
      </Section>

      <Section id="system" eyebrow="05 · Wireframes and design system" title="Same build, two levels of finish." intro="The wireframes aren't a separate artefact: they're the same screens with a greyscale theme switched on, so the comparison is honest.">
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
            <ul className="mt-4 flex flex-wrap gap-2">
              {[["#0F5F6B", "Primary"], ["#15181B", "Ink"], ["#FBFAF7", "Canvas"], ["#F3F0EA", "Surface"], ["#1D6F45", "Passed"], ["#8F5205", "Flag"], ["#B42318", "Never"]].map(([hex, name]) => (
                <li key={hex} className="grid gap-1 text-label text-muted"><span aria-hidden="true" className="block h-12 w-16 rounded-lg ring-1 ring-border" style={{ background: hex }} />{name}<span className="font-mono">{hex}</span></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xl">Anek, by Ek Type</h3>
            <p className="mt-2 text-compact leading-relaxed text-muted">A Mumbai foundry&apos;s family with matching Latin, Kannada and Devanagari designs, so Hindi and Kannada replies will look native rather than bolted on. Two weights; tabular figures for every price.</p>
          </div>
        </div>
      </Section>

      <Section id="validate" eyebrow="06 · Validate" title={`${validation.evals.passed} of ${validation.evals.total} agent tests, ${validation.a11y.clean} of ${validation.a11y.total} accessible states.`} intro={`Measured on the prototype. ${validation.evals.model.name} plans each turn; guardrails, approvals and output checks stay in code, so the model only chooses tools and words the reply. A scripted planner runs the same tests as a baseline.`}>
        <div className="grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <Table label="Agent test results" wide={false} head={["Group", "Scripted", "Claude"]} rows={validation.evals.groups.map((g) => [g.name, ...[g.scripted, g.model].map((v) => <span key={v} className="whitespace-nowrap tabular-nums">{v}</span>)])} />
            <p className="mt-3 text-compact">{validation.evals.model.runs} consecutive runs with Claude, same results each time; median turn {validation.evals.model.medianTurn}, {validation.evals.model.costPerRun} per run of the suite.</p>
            <p className="mt-1 text-compact">Top-5 results meeting every hard constraint of the brief: <strong className="font-medium">{validation.evals.top5}</strong>.</p>
            <p className="mt-1 text-compact">axe (WCAG 2.2 AA rules) on every step, phone and desktop: <strong className="font-medium">{validation.a11y.clean} of {validation.a11y.total}</strong> states clean, up from {validation.a11y.firstRun} on the first run.</p>
          </div>
          <div>
            <h3 className="text-xl">What the tests caught</h3>
            <div className="mt-3"><BulletList items={validation.caught} /></div>
          </div>
        </div>
      </Section>

      <Section id="next" eyebrow="What I'd do next" title="Put it in front of people.">
        <p className="mb-6 max-w-[62ch] text-lg leading-relaxed text-muted">This was a fast-track use case: no interviews or usability tests yet. The personas are proto-personas, and the studies below are planned, not run.</p>
        <BulletList items={nextSteps} />
        <p className="mt-8 text-compact text-muted">Related: <Link href="/process" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">the process this follows</Link> · <Link href="/work/agentic-inventory" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">MW-Inventory, another agent I designed and built</Link></p>
      </Section>

      <CaseCta title="Designing an agent people need to trust?" />
    </article>
  );
}
