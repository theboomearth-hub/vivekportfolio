import Link from "next/link";
import { CaseCta, CaseKicker, Section, caseLabel } from "@/components/case/CaseParts";
import { BarList, MarketCircles, StatTiles } from "@/components/sketch/charts";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { BeforeAfter, FlowRows } from "@/components/sketch/flows";
import { SketchArrow, Tick } from "@/components/sketch/glyphs";
import PersonaCard, { type Persona } from "@/components/sketch/PersonaCard";
import { FormaScene } from "@/components/sketch/scenes";
import { Pipeline, StackDiagram, StatusLists } from "@/components/sketch/structures";

/*
 * Forma: research into infrastructure for malleable software. Content from the Forma research (June 2026 snapshot).
 * Where the old page disagreed with itself, this uses the figure it stated most specifically (536 components in
 * 48 categories). Use-case figures are what Forma targets, not measurements: there are no customers yet.
 */

const flow = [
  { name: "Manifest", text: "The capability contract: what the app can do." },
  { name: "Compiler", text: "Constrained decoding turns intent into a config." },
  { name: "Runtime", text: "A sandboxed render of that config." },
  { name: "Hooks", text: "User-scoped middleware and routing." },
  { name: "Contract", text: "Auto-migration when the app changes." },
];

// Top of the stack first; the manifest is the foundation.
const layers = [
  { name: "Version contract", tag: "Layer 5", text: "When the app ships an update, the system diffs old and new manifests, migrates deterministic changes and flags the rest.", items: ["Semantic diff, not string diff", "Auto-migrate at ≥ 0.85 confidence", "7-day compatibility window"], doodle: <Doodle name="code" className="h-10 w-10" /> },
  { name: "Middleware hooks", tag: "Layer 4", text: "User-scoped filtering, routing and notification rules, in a restricted sandbox.", items: ["on_email_receive, on_order_created…", "200 ms timeout, 32 MB limit", "Only manifest-declared actions"], doodle: <Doodle name="flows" className="h-10 w-10" /> },
  { name: "Sandboxed runtime", tag: "Layer 3 · open source (MIT)", text: "A secure React tree that renders the compiled config: typed props only, no way out to the DOM.", items: ["No eval, no dynamic imports", "Typed expression language, no I/O", "< 60 KB gzipped per view"], doodle: <Doodle name="ui" className="h-10 w-10" /> },
  { name: "AI compiler", tag: "Layer 2 · closed source", text: "The person describes their workflow; the compiler runs once and stores a versioned config.", items: ["98% valid first try, 99.7% after one retry", "Only references declared fields"], doodle: <Doodle name="ai" className="h-10 w-10" />, accent: true },
  { name: "Capability manifest", tag: "Layer 1 · open source (MIT)", text: "A JSON contract for every action, data shape, view and permission. Written once by the developer, versioned forever.", items: ["Reverse-DNS names", "Semver, with migrations", "JSON Schema with autocomplete"], doodle: <Doodle name="layers" className="h-10 w-10" /> },
];

const tiers = [
  { name: "Domain packs", tag: "Tier 3", text: "Ship on top of @forma/react.", items: ["@forma/packs-crm", "@forma/packs-analytics", "@forma/packs-helpdesk", "@forma/packs-charts"] },
  { name: "UI layer", tag: "Tier 2", text: "536 components in 48 categories, rendered through the runtime.", items: ["@forma/react"] },
  { name: "Runtime", tag: "Tier 1", text: "Builds on the manifest contract.", items: ["@forma/runtime", "@forma/runtime-react"] },
  { name: "Core foundation", tag: "Tier 0", text: "No internal dependencies.", items: ["@forma/schema", "@forma/types", "@forma/cli", "@forma/devtools", "@forma/testing"] },
];

const sectors = [
  { label: "Engineering & industry", value: 43 }, { label: "Commerce & trade", value: 34 }, { label: "Science & research", value: 24 },
  { label: "Government & civic", value: 23 }, { label: "Health & life", value: 21 }, { label: "Media & arts", value: 20 },
  { label: "People & education", value: 18 }, { label: "Agriculture & food", value: 14 }, { label: "Transport & mobility", value: 13 },
  { label: "Legal & compliance", value: 13 }, { label: "Frontier & emerging", value: 13 }, { label: "Real estate & property", value: 11 },
];

const decisions = [
  ["Open-core", "MIT for schema, runtime and primitives; the compiler and flagship packs closed", "The compiler is the moat: it improves with every customer. The same play as Next.js and Vercel."],
  ["CRM first", "Only the CRM pack until it reaches $50K ARR", "CRM has the most complex entity graph. If the manifest handles CRM, it handles the rest."],
  ["Never proxy data", "The sandbox calls the host app's own API with the person's own token", "Forma never holds personal or health data, so the security answer is simple."],
  ["Typed props only", "No className, style or raw HTML inside sandbox components", "The compiler can only produce declared capabilities, which keeps output accessible by construction."],
  ["Compile once, cache", "One model call per person per view; then a 5 ms cached lookup", "The 2–5 s model latency is paid once, and pricing caps compile calls, not users."],
  ["Framework-agnostic core", "A pure TypeScript runtime with thin React bindings", "React is the way in (most B2B front ends), not the bet. Other adapters are short ports."],
];

const useCases = [
  {
    title: "CRM: a pipeline view per customer",
    who: "A Series B CRM company, 200 people, 50 enterprise customers who each want a different pipeline view.",
    pairs: [["40% of front-end sprint capacity goes to interface variants", "Interface variation costs no engineering time"], ["Six weeks to wait for a custom view", "About 30 seconds from request to interface"]],
    targets: [{ value: "40%", label: "Front-end capacity recovered" }, { value: "30 s", label: "Time to a custom view" }, { value: "+28", label: "NPS" }],
  },
  {
    title: "Healthcare: EHR alert triage",
    who: "A 1,200-bed regional hospital whose EHR fires 47 alerts an hour per nurse.",
    pairs: [["Alert fatigue causes missed critical alerts", "Role-filtered views cut alert noise by 78%"], ["A $200K services engagement to customise views", "Self-serve configs, no services cost"]],
    targets: [{ value: "78%", label: "Less alert noise" }, { value: "−62%", label: "Critical-alert response time" }, { value: "0", label: "IT tickets for view changes" }],
  },
];

const personas: Persona[] = [
  { name: "Priya Sharma", role: "Sales VP", meta: "Series B SaaS, 200 people", figures: [{ src: "/doodles/people/forma-priya.svg", alt: "Doodle of Priya, pointing up." }], lists: [{ label: "Pain", items: ["Needs a forecast by region, rep and product line; has built three in Excel this quarter."] }], basis: "proto" as const },
  { name: "Dr. Marcus Chen", role: "Biologist", meta: "Computational biologist, genomics start-up, 50 people", figures: [{ src: "/doodles/people/forma-marcus.svg", alt: "Doodle of Marcus at his laptop." }], lists: [{ label: "Pain", items: ["Every new assay has a new data shape; he needs a new analysis view every three days."] }], basis: "proto" as const },
  { name: "Sarah Mitchell", role: "VP Product", meta: "Mid-market SaaS, 300 people", figures: [{ src: "/doodles/people/forma-sarah.svg", alt: "Doodle of Sarah, looking concerned." }], lists: [{ label: "Pain", items: ["50 enterprise customers each want their own variant; 40% of engineering goes to view customisation."] }], basis: "proto" as const },
  { name: "Carlos Mendez", role: "ICU nurse manager", meta: "Regional hospital, 1,200 beds", figures: [{ src: "/doodles/people/forma-carlos.svg", alt: "Doodle of Carlos, tired." }], lists: [{ label: "Pain", items: ["47 EHR alerts an hour; needs a role-specific view of the critical ones only."] }], basis: "proto" as const },
  { name: "Emily Zhao", role: "Staff engineer", meta: "Large SaaS, 5,000 people", figures: [{ src: "/doodles/people/forma-emily.svg", alt: "Doodle of Emily in a hoodie." }], lists: [{ label: "Pain", items: ["Her team maintains 12 view configurations of one data model, each a fragile fork."] }], basis: "proto" as const },
  { name: "James Okonkwo", role: "CTO", meta: "Seed-stage start-up, 15 people", figures: [{ src: "/doodles/people/forma-james.svg", alt: "Doodle of James, explaining." }], lists: [{ label: "Pain", items: ["Three front-end engineers are the bottleneck: every feature needs a new view."] }], basis: "proto" as const },
].map((p) => ({ ...p, basisNote: "A persona from the Forma research: an assumption until interviews confirm it." }));

const built = [
  "Manifest spec v1, locked on 3 June 2026",
  "16 packages scaffolded, 6 apps",
  "@forma/react: 536 components in 48 categories",
  "4 domain packs: CRM, analytics, helpdesk, charts",
  "CLI with 7 commands; devtools extension",
  "Testing utilities: mock data, MSW handlers, ManifestBuilder",
  "879 deep-import paths; 100+ strategy documents",
];
const next = [
  "Manifest registry API (Go)",
  "AI compiler service (Python, FastAPI)",
  "Version-contract dashboard",
  "npm publishing pipeline",
  "Third-party security audit",
  "3 design partners; a first paying customer",
];

export default function FormaResearchPage() {
  return (
    <article className="pt-28 md:pt-36">
      <header className="container-premium">
        <CaseKicker domain="Research · Architecture · Design" status="Research project, in progress" />
        <div className="mt-3 grid items-center gap-10 lg:grid-cols-[minmax(0,6fr)_minmax(0,5fr)] [&>*]:min-w-0">
          <div>
            <h1 className="max-w-[16ch]">Forma: software that takes your shape.</h1>
            <p className="mt-6 max-w-[54ch] text-lg leading-relaxed text-muted">
              Infrastructure for malleable software. Developers declare what their app can do; each person describes how they work; an AI compiler turns that
              into their own interface, and keeps it working when the app changes.
            </p>
          </div>
          <FormaScene className="w-full" />
        </div>
        <div className="mt-12">
          <StatTiles items={[
            { value: "16", label: "Packages in the monorepo" },
            { value: "536", label: "Components, in 48 categories" },
            { value: "5", label: "Layers, each with its own contract" },
            { value: "6", label: "Apps: site, playground, docs, studio, Storybook, tests" },
          ]} />
        </div>
      </header>

      <Section id="thesis" tone="tint" eyebrow="The thesis" title="Software should take your shape." intro="Every user gets the same interface today, and enterprise software pays engineers to bend it.">
        <BeforeAfter
          before={{ label: "Today · one size fits all", doodle: <Doodle name="system" className="h-12 w-12" />, items: ["Every B2B SaaS company builds role-based views from scratch", "“Doesn't fit our workflow” is the top churn reason, ahead of price and bugs", "30–40% of front-end sprint capacity goes to interface variants"] }}
          after={{ label: "With Forma", doodle: <Doodle name="layers" className="h-12 w-12" />, items: ["Companies ship capabilities in a manifest, not fixed interfaces", "People describe their workflow once; the compiler makes a stable, versioned config", "App updates don't break anyone's interface: the contract migrates configs"] }}
        />
        <blockquote className="mt-10 max-w-[62ch] border-l-2 border-accent pl-5">
          <p className="text-lg leading-relaxed">“In the future, software companies will ship shared primitives with the full intention that users will heavily modify the final interfaces. Coding agents have reached the quality threshold where every user can be their own forward-deployed engineer.”</p>
          <footer className="mt-3 font-mono text-xs uppercase tracking-[0.06em] text-muted">Y Combinator research thesis, 2026</footer>
        </blockquote>
      </Section>

      <Section id="flow" eyebrow="How it works" title="From intent to interface." intro="A developer's manifest and a person's intent go in; a secure, personal interface comes out, recompiled whenever either one changes.">
        <Pipeline stages={flow.map((s) => ({ ...s, items: [] }))} />
        <DrawOnView className="mt-8 flex items-center gap-3 text-compact text-muted">
          <svg viewBox="0 0 40 40" className="h-8 w-8 text-accent" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true"><g filter="url(#sk-wobble)"><path className="sk-draw" pathLength={1} d="M30 12a13 13 0 1 0 3 10M30 4v8h-8" /></g></svg>
          Continuous: it recompiles automatically on every manifest change.
        </DrawOnView>
      </Section>

      <Section id="stack" tone="tint" eyebrow="Architecture" title="Five layers, each with a clear contract." intro="Each layer is versioned on its own. Open core: the schema, runtime and primitives are MIT-licensed; the compiler and flagship packs are closed.">
        <StackDiagram layers={layers} />
        <div className="mt-16">
          <h3 className="text-xl">16 packages in four tiers</h3>
          <p className="mt-2 max-w-[60ch] text-compact text-muted">Each tier depends only on the one below it.</p>
          <div className="mt-6"><StackDiagram taper={false} layers={tiers} /></div>
        </div>
      </Section>

      <Section id="components" eyebrow="Component catalogue" title="536 components, in 48 categories." intro="Tree-shakeable, with a deep import for every component and a bundle-size check on every pull request.">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,7fr)_minmax(0,5fr)] lg:gap-14 [&>*]:min-w-0">
          <div>
            <h3 className="text-xl">Sector-specific components</h3>
            <div className="mt-6">
              <BarList items={sectors} highlight={[0]} caption={`${sectors.reduce((n, s) => n + s.value, 0)} components across 12 sectors, from the catalogue's sector breakdown.`} />
            </div>
          </div>
          <div className="grid content-start gap-4 rounded-2xl bg-surface p-6">
            <Doodle name="code" className="h-12 w-12 text-foreground" />
            <h3 className="text-lg">A deep import for every component</h3>
            <p className="text-compact text-muted">
              <code className="font-mono text-[0.9em] text-foreground">@forma/react/table</code>, <code className="font-mono text-[0.9em] text-foreground">@forma/react/kanban</code> and 877 more paths. The target is under 60 KB gzipped per view, checked on every pull request.
            </p>
          </div>
        </div>
      </Section>

      <Section id="decisions" tone="tint" eyebrow="Design decisions" title="The choices that shaped Forma.">
        <FlowRows head={["Decision", "The choice", "Why"]} rows={decisions} emphasis={1} />
      </Section>

      <Section id="use-cases" eyebrow="Use cases" title="Two scenarios, before and after." intro="From the Forma research. The figures are the outcomes Forma is designed to reach, not measurements: there are no customers yet.">
        <DrawOnView className="grid gap-5 lg:grid-cols-2 [&>*]:min-w-0">
          {useCases.map((u, ui) => (
            <article key={u.title} className="sk-fade flex flex-col gap-5 rounded-2xl bg-background p-6 ring-1 ring-border ring-inset" style={{ "--sk-i": ui * 3 } as React.CSSProperties}>
              <div>
                <h3 className="text-xl">{u.title}</h3>
                <p className="mt-2 text-compact text-muted">{u.who}</p>
              </div>
              <ul className="grid gap-3">
                {u.pairs.map(([before, after], i) => (
                  <li key={i} className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] sm:items-center">
                    <p className="rounded-xl bg-surface p-3 text-compact text-muted">{before}</p>
                    <SketchArrow className="mx-auto h-4 w-7 rotate-90 text-accent sm:rotate-0" i={ui * 3 + i} />
                    <p className="flex gap-2 rounded-xl bg-accent-light/40 p-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={ui * 3 + i} />{after}</p>
                  </li>
                ))}
              </ul>
              <div className="mt-auto">
                <p className={caseLabel}>Targets</p>
                <dl className="mt-3 grid grid-cols-3 gap-3">
                  {u.targets.map((t) => (
                    <div key={t.label} className="border-t border-border pt-3">
                      <dd className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] tabular-nums">{t.value}</dd>
                      <dt className="mt-2 text-caption text-muted">{t.label}</dt>
                    </div>
                  ))}
                </dl>
              </div>
            </article>
          ))}
        </DrawOnView>
      </Section>

      <Section id="market" tone="tint" eyebrow="Market and pricing" title="Developer-led, bottom-up." intro="The same go-to-market motion as Stripe, Vercel and Twilio, priced for land and expand.">
        <MarketCircles
          rings={[
            { name: "SAM", size: "$134M", value: "28K companies", desc: "B2B SaaS with 5–500 engineers, serving several segments" },
            { name: "TAM", size: "$2.1B", value: "180K organisations", desc: "Plus vertical SaaS and enterprise internal tools" },
            { name: "Long tail", size: "$14B", value: "1.2M apps", desc: "Plus every React app with user roles" },
          ]}
          note="Market sizing from the Forma research, not yet tested with customers."
        />
        <h3 className="mt-16 text-xl">Pricing</h3>
        <DrawOnView className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4 [&>*]:min-w-0">
          {[
            { name: "Free", price: "$0", unit: "500 configs", features: ["1 manifest", "Community support"] },
            { name: "Builder", price: "$99", unit: "5K configs", features: ["3 manifests", "Email support", "Basic analytics"] },
            { name: "Growth", price: "$399", unit: "50K configs", features: ["10 manifests", "Webhooks", "Priority support"] },
            { name: "Enterprise", price: "$1,500–5,000", unit: "Unlimited", features: ["SLA", "HIPAA BAA", "Dedicated success", "Self-hosted option"] },
          ].map((t, i) => (
            <div key={t.name} className="sk-fade flex flex-col gap-3 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={{ "--sk-i": i } as React.CSSProperties}>
              <p className={caseLabel}>{t.name}</p>
              <p className="text-[1.6rem] font-medium leading-none tracking-[-0.02em] tabular-nums">{t.price}</p>
              <p className="text-caption text-muted">a month · {t.unit}</p>
              <ul className="mt-1 grid gap-1.5">
                {t.features.map((f) => <li key={f} className="flex gap-2 text-compact"><Tick className="h-4 w-4 shrink-0 text-accent" />{f}</li>)}
              </ul>
            </div>
          ))}
        </DrawOnView>
      </Section>

      <Section id="status" eyebrow="Status" title="Where Forma is today." intro="A June 2026 snapshot: the manifest spec is locked and the monorepo is scaffolded. The compiler service and the first customers are next.">
        <StatusLists built={built} next={next} builtLabel="Built" nextLabel="In progress or next" />
      </Section>

      <Section id="people" tone="tint" eyebrow="People" title="Who Forma serves." intro="Six personas, each a different buyer, a different pain and a different way in.">
        <DrawOnView className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
          {personas.map((p, i) => <PersonaCard key={p.name} persona={p} i={i * 2} />)}
        </DrawOnView>
        <p className="mt-10 text-compact text-muted">
          The repository and docs aren&apos;t public yet. Related: <Link href="/research/lokul" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">Lokul, a hyperlocal platform</Link> · <Link href="/work/design-systems-scale" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">design systems at scale</Link>
        </p>
      </Section>

      <CaseCta title="Building software people can shape themselves?" />
    </article>
  );
}
