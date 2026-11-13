import type { Metadata } from "next";
import Image from "next/image";
import { Arrow, BackLink, BulletList, CaseCta, CaseKicker, FactList, NumberedGrid, Section, Shot } from "@/components/case/CaseParts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { SketchArrow } from "@/components/sketch/glyphs";
import { Pipeline } from "@/components/sketch/structures";
import { facts, hero, journey, LIVE_URL, nextSteps, phone, principles, stages, toolCount } from "@/lib/work/agentic-inventory";

export const metadata: Metadata = {
  title: "MW-Inventory: an agent from search to debrief",
  description:
    "End-to-end use case: designing and building a conversational agent that takes a DOOH campaign from search to plan, proposal, booking, pacing and debrief in one conversation.",
  openGraph: {
    title: "MW-Inventory: an agent from search to debrief — Vivekanand Choudhari",
    description: "Designing and building an agent that runs a DOOH campaign end to end in one conversation.",
    images: [{ url: hero.src, width: hero.width, height: hero.height, alt: hero.alt }],
  },
  alternates: { canonical: "/work/agentic-inventory" },
};

const viewLabels: Record<string, string[]> = {
  "01": ["Cards", "Cost against reach", "Table"],
  "03": ["Plan", "City allocation"],
  "07": ["Live pacing", "Anomaly monitor"],
};

export default function AgenticInventoryCase() {
  return (
    <article className="pt-28 md:pt-36">
      {/* ── HEADER ───────────────────────────────────── */}
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="Agentic AI · Design and build" status="Use case, live prototype" />
        <h1 className="mt-3 max-w-[20ch]">An agent that takes a DOOH campaign from search to debrief.</h1>
        <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
          I designed and built <strong className="font-medium text-foreground">MW-Inventory</strong> end to end: a conversational agent for Moving Walls’ live
          out-of-home inventory. Planners ask in plain language; the agent calls typed tools and answers with interactive views, from the first search to the
          post-campaign debrief, in one conversation.
        </p>
        <FactList facts={facts} />
        <div className="mt-8 flex flex-wrap items-center gap-x-6 gap-y-2">
          <a
            href={LIVE_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex min-h-11 items-center gap-2 rounded-lg bg-foreground px-5 text-compact font-medium text-background transition-colors hover:bg-accent"
          >
            Try the live prototype
            <Arrow />
            <span className="sr-only"> (opens in a new tab)</span>
          </a>
          <p className="text-sm text-muted">Screens on this page use sample inventory.</p>
        </div>

        <figure className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-40px_rgb(15_15_16/0.35)]">
            <div aria-hidden="true" className="flex h-9 items-center gap-1.5 border-b border-border bg-background px-4">
              <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <i className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="ml-3 font-mono text-xs text-muted">mwagent.netlify.app</span>
            </div>
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(min-width: 1440px) 1200px, 100vw" priority className="h-auto w-full" />
          </div>
        </figure>
      </header>

      {/* ── PROBLEM ──────────────────────────────────── */}
      <Section id="problem" eyebrow="The problem" title="Planning one campaign meant working across six tools.">
        {/* Before and after: scattered hand-offs, then one conversation */}
        <DrawOnView className="grid items-stretch gap-4 md:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)]">
          <div className="sk-fade flex flex-col gap-5 rounded-2xl bg-surface p-6" style={{ "--sk-i": 0 } as React.CSSProperties}>
            <div className="flex items-center gap-3">
              <Doodle name="windows" className="h-12 w-12 text-foreground" i={0} />
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Before · a hand-off at every step</p>
            </div>
            <ul className="flex flex-wrap gap-2">
              {["Inventory sheets", "Maps", "Audience data", "Rate cards", "Proposal decks", "Booking emails", "Pacing reports"].map((t, i) => (
                <li key={t} className="rounded-lg bg-background px-3 py-1.5 text-compact shadow-[0_0_0_1px_var(--color-border)]" style={{ transform: `rotate(${[-2, 1.5, -1, 2, -1.5, 1, -2.5][i]}deg)` }}>{t}</li>
              ))}
            </ul>
            <p className="mt-auto text-compact text-muted">Each hand-off loses context, and each tool asks again: which screens, which cities, what budget.</p>
          </div>
          <SketchArrow className="mx-auto h-6 w-10 rotate-90 self-center text-accent md:rotate-0" i={2} />
          <div className="sk-fade flex flex-col gap-5 rounded-2xl bg-accent-light/40 p-6" style={{ "--sk-i": 3 } as React.CSSProperties}>
            <div className="flex items-center gap-3">
              <Doodle name="chat" className="h-12 w-12 text-foreground" i={3} />
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">After · one conversation</p>
            </div>
            <p className="text-[clamp(1.25rem,2vw,1.5rem)] leading-snug tracking-[-0.02em]">“What do you want to do?”</p>
            <p className="mt-auto text-compact text-muted">An agent with a typed tool for every step of the campaign, and an interface that shows each result in the shape the decision needs.</p>
          </div>
        </DrawOnView>
      </Section>

      {/* ── STAGES ───────────────────────────────────── */}
      <Section
        id="stages"
        eyebrow="The system"
        title={`One conversation, six stages, ${toolCount} tools.`}
        intro="Each stage of a campaign maps to tools the agent can call. A further context tool grounds every answer in the inventory."
      >
        <Pipeline stages={stages.map((s) => ({ name: s.name, text: `“${s.question}”`, items: s.tools }))} />
      </Section>

      {/* ── JOURNEY ──────────────────────────────────── */}
      <Section
        id="journey"
        eyebrow="End to end"
        title="One campaign, from the first search to the debrief."
        intro={
          <>
            Eight requests take a festive-season campaign across three cities from idea to lessons learned. Every screen is the real interface.{" "}
            <span className="text-foreground">The inventory is sample data</span>: generic locations and illustrative figures, not client data.
          </>
        }
      >
        <ol className="grid gap-20 md:gap-24">
          {journey.map((step) => {
            const labels = viewLabels[step.n] ?? [];
            const [first, ...rest] = step.images;
            return (
              <li key={step.n} className="grid gap-8 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
                <div className="lg:sticky lg:top-28 lg:self-start">
                  <p className="font-mono text-xs tracking-[0.06em] text-accent">
                    {step.n} · {step.stage.toUpperCase()}
                  </p>
                  <h3 className="mt-3 text-2xl tracking-[-0.02em]">{step.stage}</h3>
                  <p className="mt-5 text-caption text-muted">The planner asks</p>
                  <p className="mt-1.5 w-fit max-w-full rounded-xl rounded-br-sm bg-accent px-4 py-2.5 text-compact text-accent-foreground">{step.prompt}</p>
                  <p className="mt-4 text-caption text-muted">
                    The agent calls <code className="rounded bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground ring-1 ring-border ring-inset">{step.tool}</code>
                  </p>
                  <p className="mt-5 max-w-[46ch] leading-relaxed text-muted">{step.body}</p>
                </div>
                <div className="grid gap-5">
                  <Shot image={first} sizes="(min-width: 1024px) 700px, 100vw" caption={labels[0]} />
                  {rest.length > 0 && (
                    <div className={`grid gap-5 ${rest.length > 1 ? "sm:grid-cols-2" : ""}`}>
                      {rest.map((image, i) => (
                        <Shot key={image.src} image={image} sizes={rest.length > 1 ? "(min-width: 1024px) 340px, (min-width: 640px) 50vw, 100vw" : "(min-width: 1024px) 700px, 100vw"} caption={labels[i + 1]} />
                      ))}
                    </div>
                  )}
                </div>
              </li>
            );
          })}
        </ol>
      </Section>

      {/* ── PRINCIPLES ───────────────────────────────── */}
      <Section id="principles" eyebrow="Design principles" title="Six decisions that make the agent trustworthy.">
        <NumberedGrid items={principles} />
      </Section>

      {/* ── HOW IT WORKS ─────────────────────────────── */}
      <Section
        id="architecture"
        eyebrow="How it works"
        title="Data first, words second."
        intro="Each answer is one stream. The tool’s result arrives before the explanation, so the right view renders with real numbers while the text is still being written."
      >
        <ol className="grid gap-3 lg:grid-cols-[repeat(4,minmax(0,1fr))]">
          {[
            { t: "Planner", d: "Types, speaks, attaches a brief or uses slash commands." },
            { t: "Chat interface", d: "Sends the message with session memory, then renders each result as its own view." },
            { t: "/api/chat", d: "Routes the request to a tool and streams back one answer." },
            { t: `${toolCount + 1} typed tools`, d: "Search, plan, propose, book, pace and debrief against inventory and campaign data." },
          ].map((node, i, arr) => (
            <li key={node.t} className="relative rounded-xl bg-surface p-5 ring-1 ring-border ring-inset">
              <p className="font-mono text-xs text-accent">0{i + 1}</p>
              <h3 className="mt-2 text-lg">{node.t}</h3>
              <p className="mt-1.5 text-sm leading-relaxed text-muted">{node.d}</p>
              {i < arr.length - 1 && (
                <span aria-hidden="true" className="absolute left-1/2 top-full z-10 -translate-x-1/2 text-muted lg:left-full lg:top-1/2 lg:-translate-y-1/2 lg:translate-x-[-2px]">
                  <svg viewBox="0 0 24 24" className="h-4 w-4 rotate-90 lg:rotate-0" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M5 12h14M13 6l6 6-6 6" />
                  </svg>
                </span>
              )}
            </li>
          ))}
        </ol>

        <div className="mt-12 grid gap-10 lg:grid-cols-2 lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-lg">One answer, four kinds of line</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-foreground p-5 font-mono text-caption leading-relaxed text-background" tabIndex={0} aria-label="Example of the streamed answer format">
              {`9:{"toolName":"build_media_plan","args":{"budget":5000,"days":14}}
a:{"result":{"screens":[…],"totalImpressions":540020,"avgCpm":6.25}}
0:"Media plan for $5,000 daily over 14 days — "
0:"6 screens across 3 cities…"
d:{"finishReason":"stop"}`}
            </pre>
            <dl className="mt-4 grid gap-2 text-compact">
              {[
                ["9:", "Tool call: the interface knows which view to prepare."],
                ["a:", "Tool result: the view renders with real numbers."],
                ["0:", "Text: the explanation streams in after the data."],
                ["d:", "Finish: next steps and follow-ups appear."],
              ].map(([k, v]) => (
                <div key={k} className="flex gap-3">
                  <dt className="w-8 shrink-0 font-mono text-accent">{k}</dt>
                  <dd className="text-muted">{v}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div>
            <h3 className="text-lg">Memory travels with every request</h3>
            <pre className="mt-4 overflow-x-auto rounded-xl bg-surface p-5 font-mono text-caption leading-relaxed ring-1 ring-border ring-inset" tabIndex={0} aria-label="Example request payload with session memory">
              {`{
  "appId": "mw-inventory",
  "messages": [ … ],
  "sessionMemory": {
    "lastPlanScreenIds": [ … ],
    "savedPlans": [ … ],
    "pinnedQueries": [ … ]
  }
}`}
            </pre>
            <p className="mt-4 text-compact leading-relaxed text-muted">
              The client sends the last plan’s screens, saved plans and pinned queries with each message, so follow-ups like “shortlist these” or “book this
              plan” always refer to the plan on screen.
            </p>
          </div>
        </div>
      </Section>

      {/* ── PHONE ────────────────────────────────────── */}
      <Section id="phone" eyebrow="Responsive" title="The same agent on a phone.">
        <ul className="grid grid-cols-2 gap-5 md:grid-cols-4">
          {phone.map((image) => (
            <li key={image.src}>
              <div className="overflow-hidden rounded-[22px] bg-surface ring-1 ring-border">
                <Image src={image.src} alt={image.alt} width={image.width} height={image.height} sizes="(min-width: 768px) 280px, 50vw" className="h-auto w-full" />
              </div>
            </li>
          ))}
        </ul>
      </Section>

      {/* ── NEXT ─────────────────────────────────────── */}
      <Section id="next" eyebrow="What I’d do next" title="What testing the full journey taught me.">
        <BulletList items={nextSteps} />
      </Section>

      <CaseCta title="Want an agent like this for your product?" />
    </article>
  );
}
