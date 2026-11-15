import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { caseStudy } from "@/lib/work/index";
import { BackLink, CaseCta, CaseIndex, CaseKicker, FactList, NumberedGrid, Section, caseLabel } from "@/components/case/CaseParts";
import AlarmFlood from "@/components/case/takt/AlarmFlood";
import AssetExplorer from "@/components/case/takt/AssetExplorer";
import IADecision from "@/components/case/takt/IADecision";
import LineScene from "@/components/case/takt/LineScene";
import NightTrend from "@/components/case/takt/NightTrend";
import ThreePaths from "@/components/case/takt/ThreePaths";
import ObjectModel from "@/components/case/takt/ObjectModel";
import TreeTest from "@/components/case/takt/TreeTest";
import { StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { CompareMatrix, FlowRows, StepStrip } from "@/components/sketch/flows";
import { Cross, Tick } from "@/components/sketch/glyphs";
import { UnderlineMark } from "@/components/sketch/marks";
import PersonaCard from "@/components/sketch/PersonaCard";
import { Ladder, Pipeline, StackDiagram } from "@/components/sketch/structures";
import {
  conditions, customer, decision, displayLevels, facts, flow, gates, goals, keyNumbers, ladder, landscape, lenses, marketFacts,
  metrics, navModel, naming, nextSteps, nonGoals, objectModel, painPoints, personas, relations, rice, risks, roadmap, roleHomes,
  scenario, sources, standards, validationPlan,
} from "@/lib/work/takt";

const entry = caseStudy("takt")!;
export const metadata: Metadata = pageMeta({
  title: entry.seoTitle,
  ogTitle: entry.title,
  category: "Industry 4.0",
  description: entry.description,
  path: "/work/takt",
  type: "article",
});

const index = [
  { id: "scenario", label: "The night Line 3 stopped" },
  { id: "problem", label: "Problem" },
  { id: "framing", label: "Product framing" },
  { id: "people", label: "People" },
  { id: "research", label: "Research" },
  { id: "ia", label: "Information architecture" },
  { id: "tree-test", label: "Tree test" },
  { id: "flow", label: "End to end" },
  { id: "roadmap", label: "Priorities and roadmap" },
  { id: "validate", label: "Validation" },
  { id: "next", label: "Next" },
];

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;
const lensLabel = "font-mono text-[11px] uppercase tracking-[0.06em]";

/** Small marker for which hat a section is written in. */
function Lens({ kind }: { kind: "Product" | "Design" | "Product and design" }) {
  return <p className={`${lensLabel} mb-6 inline-flex rounded-full bg-background px-2.5 py-1 text-muted ring-1 ring-border ring-inset`}>{kind} lens</p>;
}

function Table({ head, rows, caption }: { head: string[]; rows: (string | number)[][]; caption: string }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={`${caption}, scrolls sideways`}>
      <table className="w-full min-w-[640px] border-collapse text-left text-compact">
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

export default function TaktCase() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="Industry 4.0 · Product and information architecture" status="Design concept" />
        <h1 className="mt-3 max-w-[20ch]">Takt: one picture of four factories.</h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
          <strong className="font-medium text-foreground">Takt</strong>{" "}is a data platform concept for a multi-plant auto-parts maker: one model of every plant,
          machine and signal, so anyone on any shift can find what&apos;s happening, understand it and act. I took it end to end as product manager and designer,
          from the business case to the information architecture and the roadmap, with one night shift as the thread.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-3">
          <a href="#ia" className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-compact font-medium text-background hover:bg-accent">
            Explore the plant model
            <svg viewBox="0 0 24 24" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 5v14M6 13l6 6 6-6" /></svg>
          </a>
          <a href="#tree-test" className="inline-flex min-h-11 items-center py-2.5 font-medium underline decoration-border-strong underline-offset-4 hover:text-accent">Take the tree test</a>
        </div>
        <div className="mt-12"><LineScene /></div>
        <FactList facts={facts} />
        <div className="mt-12"><StatTiles items={keyNumbers} /></div>
        <p className="mt-4 text-caption text-muted">Kaveri Auto Parts, its plants, people and incident are fictional. Industry figures are sourced at the end of the page.</p>
        <CaseIndex items={index} />
      </header>

      <Section id="scenario" eyebrow="00 · The thread" title="The night Line 3 stopped." intro="One incident, followed from the first sign to the morning meeting, today and with Takt. Every section below designs one part of the right-hand column. Times are a scenario, not a measurement.">
        <FlowRows head={["Time", "Today", "With Takt"]} rows={scenario} emphasis={2} />
        <div className="mt-12">
          <h3 className="text-xl">The signal nobody was watching</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">The drift started 34 minutes before the stop. Takt compares each signal with its own normal band, so a creeping change becomes a quiet flag, not another alarm.</p>
          <div className="mt-6"><NightTrend /></div>
        </div>
        <div className="mt-10">
          <StatTiles cols="sm:grid-cols-3" items={[
            { value: "1 h 51 → 56 min", label: "Downtime", note: "Scenario estimate" },
            { value: "38 → 1", label: "Alarms the operator has to read", note: "One incident, first cause on top" },
            { value: "86 → 21 min", label: "From stop to known cause", note: "Scenario estimate" },
          ]} />
        </div>
      </Section>

      <Section id="problem" tone="tint" eyebrow="01 · Problem and opportunity" title="Four plants, six systems, no shared names.">
        <Lens kind="Product" />
        <DrawOnView className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {painPoints.map((p, i) => (
            <div key={p.title} className="sk-fade flex flex-col gap-3 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={sk(i)}>
              <Doodle name={p.doodle} className="h-12 w-12 text-foreground" i={i} />
              <h3 className="text-lg">{p.title}</h3>
              <p className="text-compact text-muted">{p.text}</p>
            </div>
          ))}
        </DrawOnView>
        <div className="mt-12">
          <p className={caseLabel}>Why it&apos;s worth solving</p>
          <div className="mt-4"><StatTiles items={marketFacts} /></div>
        </div>
        <div className="mt-12 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <p className={caseLabel}>Who it&apos;s for</p>
            <dl className="mt-4 grid gap-4">
              {customer.map((c) => (
                <div key={c.term} className="border-t border-border pt-3">
                  <dt className="text-caption text-muted">{c.term}</dt>
                  <dd className="mt-1 text-compact">{c.detail}</dd>
                </div>
              ))}
            </dl>
          </div>
          <DrawOnView className="self-center">
            <p className={caseLabel}>Design question</p>
            <p className="mt-3 text-[clamp(1.4rem,2.6vw,1.9rem)] leading-snug tracking-[-0.02em]">
              How might one model of four plants let anyone on any shift find, understand and act on what&apos;s happening,{" "}
              <span className="relative inline-block">in words they already use?<UnderlineMark className="absolute -bottom-2 left-0 h-3 w-full" i={4} /></span>
            </p>
          </DrawOnView>
        </div>
      </Section>

      <Section id="framing" eyebrow="02 · Product framing" title="Read, link and explain. Never control.">
        <Lens kind="Product" />
        <DrawOnView className="grid gap-4 md:grid-cols-2">
          <div className="sk-fade grid content-start gap-3 rounded-2xl bg-accent-light/40 p-6">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">Goals</p>
            <ul className="grid gap-2.5">{goals.map((g, i) => <li key={g} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={i} />{g}</li>)}</ul>
          </div>
          <div className="sk-fade grid content-start gap-3 rounded-2xl bg-surface p-6" style={sk(2)}>
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Not goals</p>
            <ul className="grid gap-2.5">{nonGoals.map((g, i) => <li key={g} className="flex gap-3 text-compact text-muted"><Cross className="h-5 w-5 shrink-0" i={i + 2} />{g}</li>)}</ul>
          </div>
        </DrawOnView>
        <div className="mt-14">
          <h3 className="text-xl">How we&apos;d know it works</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">One north star the business feels, inputs the team can move, and guardrails that stop Takt adding noise. Targets are hypotheses for a one-plant pilot.</p>
          <div className="mt-6"><Table caption="Success metrics" head={["Metric", "Kind", "Pilot target", "Why this one"]} rows={metrics.map((m) => [m.name, m.kind, m.target, m.why])} /></div>
        </div>
        <div className="mt-14">
          <h3 className="text-xl">Where it sits</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Takt doesn&apos;t replace the historian, MES or ERP. It is the layer that names, links and explains what they already hold.</p>
          <div className="mt-6 grid gap-8 lg:grid-cols-[minmax(0,1.2fr)_minmax(0,0.8fr)]">
            <StackDiagram
              layers={[
                { name: "Level 4 · Business", text: "ERP: orders, stock, finance.", tag: "Takt reads", items: ["SAP or similar"], doodle: <Doodle name="receipt" className="h-10 w-10" i={1} /> },
                { name: "Level 3 · Operations", text: "MES, maintenance, quality and the historian.", tag: "Takt reads · drafts work orders", accent: true, items: ["MES", "CMMS", "Historian"], doodle: <Doodle name="system" className="h-10 w-10" i={2} /> },
                { name: "Level 2 · Supervision", text: "SCADA and the operator panels on each line.", tag: "Takt reads", items: ["SCADA", "HMI"], doodle: <Doodle name="windows" className="h-10 w-10" i={3} /> },
                { name: "Level 1 · Control", text: "PLCs, drives and sensors.", tag: "Takt reads, through a gateway", items: ["OPC UA", "MQTT"], doodle: <Doodle name="code" className="h-10 w-10" i={4} /> },
                { name: "Level 0 · The process", text: "Presses, robots, ovens: the physical plant.", tag: "Never touched", doodle: <Doodle name="factory" className="h-10 w-10" /> },
              ]}
            />
            <DrawOnView className="self-center">
              <p className={caseLabel}>The rule</p>
              <p className="mt-3 text-[clamp(1.25rem,2.2vw,1.6rem)] leading-snug tracking-[-0.015em]">Takt reads every level, writes only drafted work orders at level 3 after a person approves, and writes nothing below.</p>
            </DrawOnView>
          </div>
          <div className="mt-10"><CompareMatrix columns={landscape.columns} rows={landscape.rows} caption="My reading of each category of product, not a review of any vendor" /></div>
        </div>
      </Section>

      <Section id="people" tone="tint" eyebrow="03 · People" title="Six roles, one machine, six different questions.">
        <Lens kind="Design" />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {personas.map((p, i) => <PersonaCard key={p.name} persona={p} i={i} />)}
        </div>
        <p className="mt-4 text-caption text-muted">Proto-personas from desk research and two years of designing IIoT products. Assumptions until night-shift interviews replace them.</p>
        <div className="mt-12">
          <p className={caseLabel}>Designing for the floor, not the office</p>
          <DrawOnView className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
            {conditions.map((c, i) => (
              <div key={c.title} className="sk-fade flex flex-col gap-2.5 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={sk(i)}>
                <Doodle name={c.doodle} className="h-10 w-10 text-foreground" i={i} />
                <h3 className="text-lg">{c.title}</h3>
                <p className="text-compact text-muted">{c.text}</p>
              </div>
            ))}
          </DrawOnView>
        </div>
      </Section>

      <Section id="research" eyebrow="04 · Research" title="Four standards the floor already runs on." intro="Desk research: the industry standards that plants, integrators and auditors already use. Takt follows them rather than inventing its own words.">
        <Lens kind="Product and design" />
        <FlowRows head={["Standard", "What it says", "What it changes in Takt"]} rows={standards} emphasis={2} />
      </Section>

      <Section id="ia" tone="tint" eyebrow="05 · Information architecture" title="One robot, five ways to look for it." intro="The hard part of a factory platform isn't the charts. It's that the same machine belongs to several hierarchies at once, and every role thinks in a different one.">
        <Lens kind="Design" />
        <h3 className="text-xl">What exists, and how it connects</h3>
        <div className="mt-6"><ObjectModel groups={objectModel} relations={relations} /></div>

        <div className="mt-16">
          <h3 className="text-xl">One robot, three paths</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Operators walk to it, quality engineers reach it through the process, maintenance through its type. Three trails, one object at the end, never a copy.</p>
          <div className="mt-6"><ThreePaths /></div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">Five lenses on the same robot</h3>
          <div className="mt-6"><FlowRows head={["Lens", "Who thinks this way", "WR-04 in this lens", "Why it matters"]} rows={lenses.map((l) => [l.name, l.who, l.path, l.why])} emphasis={2} /></div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">The decision</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Three ways to organise it. The live tree test below puts the first and the third side by side.</p>
          <div className="mt-6"><IADecision context={decision.context} options={decision.options} choice={decision.choice} result={decision.result} /></div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">Try it: the plant model</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Switch the view and the tree re-sorts; open a machine and its three paths stay side by side. Search works on names, codes and lines, the way people actually ask.</p>
          <div className="mt-6"><AssetExplorer /></div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">One name per signal</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Every signal gets a dotted name that people can read and a path in the plant&apos;s unified namespace that systems can subscribe to. Both come from the hierarchy, so neither is typed by hand.</p>
          <DrawOnView className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-6">
            {naming.map((n, i) => (
              <div key={n.part} className="sk-fade grid gap-1.5 rounded-xl bg-background p-4 ring-1 ring-border ring-inset" style={sk(i)}>
                <p className={`font-mono text-lg ${n.part === "AX2M" || n.part === "VIB_RMS" ? "text-accent" : ""}`}>{n.part}</p>
                <p className="text-sm font-medium">{n.means}</p>
                <p className="text-caption text-muted">{n.rule}</p>
              </div>
            ))}
          </DrawOnView>
          <p className="mt-3 font-mono text-sm text-muted [overflow-wrap:anywhere]">PUN.<wbr />BDY.<wbr />L3.<wbr />WR04.<wbr />AX2M.<wbr />VIB_RMS · kaveri/<wbr />pune/<wbr />body-shop/<wbr />line-3/<wbr />wr-04/<wbr />axis-2-servo-motor/<wbr />vib-rms</p>
        </div>

        <div className="mt-16 grid gap-12 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
          <div>
            <h3 className="text-xl">Navigation in three layers</h3>
            <div className="mt-6 grid gap-3">
              {navModel.map((n) => (
                <div key={n.level} className="grid gap-2 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset">
                  <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{n.level}</p>
                  <p className="text-compact">{n.text}</p>
                  <ul className="flex flex-wrap gap-1.5">{n.items.map((it) => <li key={it} className="rounded-md bg-surface px-2 py-1 text-caption">{it}</li>)}</ul>
                </div>
              ))}
            </div>
          </div>
          <div>
            <h3 className="text-xl">Screens follow ISA-101&apos;s four levels</h3>
            <div className="mt-6"><StackDiagram layers={displayLevels.map((d, i) => ({ name: d.name, text: d.text, items: d.items, accent: i === 3 }))} /></div>
          </div>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">A home for each role</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Same model, different front door: each home opens on the question that role asks first.</p>
          <div className="mt-6"><Table caption="Role homes" head={["Role", "Home", "The first question it answers"]} rows={roleHomes} /></div>
        </div>
      </Section>

      <Section id="tree-test" eyebrow="06 · Tree test" title="Does location-first beat department-first?" intro="Try it yourself. Five tasks from the night Line 3 stopped, on both structures, in a random order. Only the labels matter, which is exactly what a tree test checks.">
        <Lens kind="Design" />
        <TreeTest />
      </Section>

      <Section id="flow" tone="tint" eyebrow="07 · End to end" title="From a creeping vibration to the morning meeting.">
        <Lens kind="Product and design" />
        <Pipeline stages={flow} />
        <div className="mt-16">
          <h3 className="text-xl">Up close: 38 alarms, one incident</h3>
          <p className="mt-2 max-w-[62ch] text-compact text-muted">Replay what the operator saw at 02:14, against ISA-18.2&apos;s limits, next to the one card Takt shows instead. Grouping orders the alarms by cause; it hides none of them.</p>
          <div className="mt-6"><AlarmFlood /></div>
        </div>
        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.2fr)]">
          <div>
            <h3 className="text-xl">How far the copilot goes</h3>
            <p className="mt-2 text-compact text-muted">It explains and drafts freely, acts only after a named person approves, and never touches the machine. On a plant floor, that last rung is not negotiable.</p>
          </div>
          <Ladder rungs={ladder} />
        </div>
      </Section>

      <Section id="roadmap" eyebrow="08 · Priorities and roadmap" title="Names first, prediction last.">
        <Lens kind="Product" />
        <h3 className="text-xl">RICE, for a one-plant pilot</h3>
        <p className="mt-2 max-w-[62ch] text-compact text-muted">Reach in people per quarter, impact from 0.25 to 3, confidence in percent, effort in person-months. Estimates, not data: the point is the order they produce.</p>
        <div className="mt-6"><Table caption="RICE scores" head={["Feature", "Reach", "Impact", "Confidence", "Effort", "Score"]} rows={rice.map((r) => [r.feature, r.reach, r.impact, `${r.confidence}%`, r.effort, r.score])} /></div>
        <p className="mt-3 text-caption text-muted">The copilot scores low on confidence, not value: it&apos;s only as good as the model and the names under it. So it ships second.</p>

        <div className="mt-16">
          <h3 className="text-xl">Three releases, each with a gate</h3>
          <div className="mt-6"><Pipeline stages={roadmap} /></div>
          <ul className="mt-8 grid gap-3 md:grid-cols-3">
            {gates.map((g, i) => (
              <li key={g} className="grid gap-2 rounded-2xl bg-surface p-5">
                <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{["Gate 1", "Gate 2", "Kill criterion"][i]}</p>
                <p className="text-compact">{g}</p>
              </li>
            ))}
          </ul>
        </div>

        <div className="mt-16">
          <h3 className="text-xl">Risks, and what we do about them</h3>
          <div className="mt-6"><Table caption="Risks and mitigations" head={["Risk", "Mitigation"]} rows={risks} /></div>
        </div>
      </Section>

      <Section id="validate" tone="tint" eyebrow="09 · Validation" title="How we'd know, before and after the pilot.">
        <Lens kind="Product and design" />
        <NumberedGrid items={validationPlan.map((v) => ({ title: v.title, body: v.body }))} cols="md:grid-cols-2 lg:grid-cols-4" />
      </Section>

      <Section id="next" eyebrow="10 · Next" title="What comes after the architecture.">
        <StepStrip steps={nextSteps} />
        <div className="mt-16 border-t border-border pt-6">
          <p className={caseLabel}>Sources</p>
          <ul className="mt-3 grid gap-2 text-compact">
            {sources.map((s) => (
              <li key={s.href}>
                <a href={s.href} target="_blank" rel="noopener noreferrer" className="underline decoration-border-strong underline-offset-4 hover:text-accent">{s.label}</a>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      <CaseCta title="Have a factory full of data and no shared names?" />
    </article>
  );
}
