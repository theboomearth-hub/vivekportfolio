import type { Metadata } from "next";
import { pageMeta } from "@/lib/seo";
import { caseStudy } from "@/lib/work/index";
import Image from "next/image";
import { BackLink, BulletList, CaseCta, CaseIndex, CaseKicker, FactList, NumberedGrid, Section, caseLabel } from "@/components/case/CaseParts";
import CardSort from "@/components/case/CardSort";
import DeviceJourney from "@/components/case/DeviceJourney";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import {
  a11y,
  aiPrinciples,
  blueprint,
  blueprintStages,
  chapters,
  devices,
  facts,
  goals,
  hero,
  jobs,
  journeyMap,
  layoutCompare,
  layoutRules,
  navMap,
  nextSteps,
  persona,
  screenCount,
  sortCards,
  sortGroups,
  systemFacts,
  taskFlows,
  tokens,
  userFlow,
  validation,
  type AiRole,
} from "@/lib/work/healthai";

const entry = caseStudy("healthai")!;
export const metadata: Metadata = pageMeta({
  title: entry.seoTitle,
  ogTitle: entry.title,
  description: entry.description,
  path: "/work/healthai",
  type: "article",
  image: { url: hero.src, width: hero.width, height: hero.height, alt: hero.alt },
});

const index = [
  { id: "problem", label: "Problem" },
  { id: "users", label: "Users" },
  { id: "journey-map", label: "Journey map" },
  { id: "workflow", label: "Workflow" },
  { id: "card-sort", label: "Card sort and IA" },
  { id: "screens", label: "Screens" },
  { id: "ai", label: "AI decisions" },
  { id: "layouts", label: "Four layouts" },
  { id: "system", label: "Design system" },
  { id: "accessibility", label: "Accessibility" },
  { id: "validation", label: "Validation" },
  { id: "next", label: "Next" },
];

const roleLevel: Record<AiRole, number> = { Leads: 3, Assists: 2, "Steps back": 1 };

const codeDevice: Record<string, string> = { M: "Phone", T: "Tablet", L: "Tablet landscape", W: "Web" };

function Tag({ children }: { children: React.ReactNode }) {
  return <span className="inline-flex items-center rounded-md bg-surface px-1.5 py-0.5 font-mono text-xs text-foreground ring-1 ring-border ring-inset">{children}</span>;
}

function Scroller({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={label}>
      {children}
    </div>
  );
}

/** The triage scale from decision 3, drawn: three levels of care on one hand-drawn line. */
function TriageScale() {
  const levels = [
    { name: "Self-care", note: "Wait it out, with what to watch for", doodle: "clock" },
    { name: "Doctor visit", note: "Book a specialty, with the assessment attached", doodle: "team" },
    { name: "Emergency", note: "Call 112 now", doodle: "shield" },
  ];
  return (
    <DrawOnView className="rounded-2xl bg-background p-6 ring-1 ring-border ring-inset md:p-8">
      <p className={caseLabel}>Recommended care, always on one scale</p>
      <div className="relative mt-8">
        <svg className="pointer-events-none absolute top-[22px] left-[8%] hidden h-3 w-[84%] text-foreground md:block" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true">
          <path className="sk-draw" pathLength={1} d="M4 6C300 4 640 8 996 6" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        <ol className="relative grid gap-6 md:grid-cols-3">
          {levels.map((l, i) => (
            <li key={l.name} className="sk-fade grid justify-items-start gap-2 md:justify-items-center md:text-center" style={{ "--sk-i": i } as React.CSSProperties}>
              <span className={`grid h-12 w-12 place-items-center rounded-full bg-background ring-2 ${i === 2 ? "ring-danger/60" : "ring-foreground"}`}>
                <Doodle name={l.doodle} className="h-7 w-7 text-foreground" i={i} />
              </span>
              <p className="text-lg">{l.name}</p>
              <p className="max-w-[24ch] text-compact text-muted">{l.note}</p>
            </li>
          ))}
        </ol>
      </div>
      <p className="mt-8 text-compact text-muted">Causes are rated in words (strong match, possible, less likely), never percentages, and red flags are listed at every level.</p>
    </DrawOnView>
  );
}

export default function HealthAICase() {
  return (
    <article className="pt-28 md:pt-36">
      {/* ── HEADER ───────────────────────────────────── */}
      <header className="container-premium">
        <BackLink />
        <CaseKicker domain="Healthcare · AI product design" status="Design concept" />
        <h1 className="mt-3 max-w-[20ch]">HealthAI: from “I don’t feel well” to a doctor’s plan.</h1>
        <p className="mt-6 max-w-[62ch] text-lg leading-relaxed text-muted">
          <strong className="font-medium text-foreground">HealthAI</strong> is a patient app I designed end to end for India. Describe your symptoms to an AI, learn
          what level of care you need and how soon, book a real doctor, pay with UPI, consult on video, and keep the plan and every record in one place.
        </p>
        <FactList facts={facts} />

        <figure className="mt-12 md:mt-16">
          <div className="overflow-hidden rounded-2xl bg-surface shadow-[0_0_0_1px_var(--color-border),0_30px_80px_-40px_rgb(15_15_16/0.35)]">
            <Image src={hero.src} alt={hero.alt} width={hero.width} height={hero.height} sizes="(min-width: 1440px) 1200px, 100vw" priority className="h-auto w-full" />
          </div>
          <figcaption className="mt-3 text-caption text-muted">
            Web, tablet and phone. Patients, doctors and records shown are fictional.
          </figcaption>
        </figure>
        <CaseIndex items={index} />
      </header>

      {/* ── PROBLEM ──────────────────────────────────── */}
      <Section id="problem" eyebrow="The problem" title="Getting care starts with a question most apps skip: do I need a doctor?">
        <div className="grid gap-10 md:grid-cols-2 md:gap-16">
          <p className="text-lg leading-relaxed text-muted">
            On day two of a fever, a patient has three questions before any booking: is this serious, who should I see, and how soon? Symptom checkers answer the
            first, booking apps the second, and the prescription, lab reports and reminders end up spread across chats, PDFs and paper.
          </p>
          <p className="text-lg leading-relaxed">
            HealthAI keeps it in one thread. The assessment carries into the booking, the booking into the consultation, and the consultation into a plan with
            reminders and records. The AI guides each step and leaves the decisions to the patient and the doctor.
          </p>
        </div>
        <div className="mt-14">
          <h3 className={caseLabel}>Goals</h3>
          <div className="mt-5">
            <NumberedGrid items={goals} />
          </div>
        </div>
      </Section>

      {/* ── USERS ────────────────────────────────────── */}
      <Section
        id="users"
        tone="tint"
        eyebrow="Users"
        title="One patient, three jobs."
        intro="A proto-persona: built from assumptions to focus the design, and to be replaced by what patients say in interviews."
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div className="overflow-hidden rounded-2xl bg-background ring-1 ring-border ring-inset">
            {/* Aarav, drawn: unwell, on his phone (Open Peeps, CC0) */}
            <DrawOnView className="relative flex h-[200px] items-end justify-center overflow-hidden bg-surface px-6 pt-6">
              <svg viewBox="0 0 300 200" className="sk-fade absolute inset-x-8 bottom-0 h-[80%] w-[calc(100%-4rem)] text-accent-light" aria-hidden="true">
                <path filter="url(#sk-wobble)" fill="currentColor" d="M34 200C10 150 18 82 64 50 112 16 196 14 242 52c40 33 52 98 34 148z" />
              </svg>
              <Image src="/doodles/people/healthai-aarav.svg" alt="Doodle of Aarav, tired, looking at his phone." width={850} height={1200} unoptimized className="sk-fade relative h-[184px] w-auto" style={{ "--sk-i": 1 } as React.CSSProperties} />
            </DrawOnView>
            <div className="flex items-center gap-3 px-6 pt-5">
              <div>
                <p className="text-lg leading-tight">{persona.name}</p>
                <p className="text-caption text-muted">Proto-persona</p>
              </div>
            </div>
            <div className="px-6 pb-6">
            <p className="mt-4 text-compact leading-relaxed text-muted">{persona.context}</p>
            <div className="mt-5 grid gap-5 sm:grid-cols-2">
              <div>
                <h3 className={caseLabel}>Wants to</h3>
                <ul className="mt-2 grid gap-1.5 text-compact">
                  {persona.goals.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
              <div>
                <h3 className={caseLabel}>Worries about</h3>
                <ul className="mt-2 grid gap-1.5 text-compact">
                  {persona.worries.map((g) => (
                    <li key={g}>{g}</li>
                  ))}
                </ul>
              </div>
            </div>
            </div>
          </div>
          <div>
            <h3 className={caseLabel}>Jobs to be done</h3>
            <ol className="mt-4 grid gap-4">
              {jobs.map((j, i) => (
                <li key={j} className="flex gap-4 border-t border-border pt-4 text-lg leading-relaxed">
                  <span className="font-mono text-xs leading-[1.9rem] text-accent">0{i + 1}</span>
                  <span>{j}</span>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </Section>

      {/* ── JOURNEY MAP ──────────────────────────────── */}
      <Section
        id="journey-map"
        eyebrow="Journey map"
        title="Eight moments, and how much the AI does in each."
        intro="The AI leads while the patient is unsure, assists while they decide, and steps back once a doctor is involved."
      >
        <Scroller label="Journey map, scrolls sideways">
          <table className="w-full min-w-[960px] border-collapse text-left text-sm">
            <caption className="sr-only">Journey map: for each stage, the patient’s question, what HealthAI does, the AI’s role and the screens.</caption>
            <thead>
              <tr>
                <th scope="col" className="w-36 pb-3 align-bottom text-caption font-normal text-muted">
                  Stage
                </th>
                {journeyMap.map((s, i) => (
                  <th key={s.stage} scope="col" className="pb-3 pr-3 align-bottom font-medium">
                    <span className="block font-mono text-xs font-normal text-accent">0{i + 1}</span>
                    {s.stage}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="align-top">
              <tr className="border-t border-border">
                <th scope="row" className="py-3 pr-3 text-caption font-normal text-muted">
                  The patient asks
                </th>
                {journeyMap.map((s) => (
                  <td key={s.stage} className="py-3 pr-3">
                    “{s.question}”
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <th scope="row" className="py-3 pr-3 text-caption font-normal text-muted">
                  HealthAI does
                </th>
                {journeyMap.map((s) => (
                  <td key={s.stage} className="py-3 pr-3 text-muted">
                    {s.app}
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <th scope="row" className="py-3 pr-3 text-caption font-normal text-muted">
                  The AI’s role
                </th>
                {journeyMap.map((s) => (
                  <td key={s.stage} className="py-3 pr-3">
                    <span className="flex items-end gap-0.5" aria-hidden="true">
                      {[1, 2, 3].map((n) => (
                        <i key={n} className={`block w-2 rounded-sm ${n <= roleLevel[s.ai] ? "bg-accent" : "bg-border"}`} style={{ height: 4 + n * 4 }} />
                      ))}
                    </span>
                    <span className="mt-1.5 block">{s.ai}</span>
                  </td>
                ))}
              </tr>
              <tr className="border-t border-border">
                <th scope="row" className="py-3 pr-3 text-caption font-normal text-muted">
                  Screens
                </th>
                {journeyMap.map((s) => (
                  <td key={s.stage} className="py-3 pr-3 font-mono text-xs text-muted">
                    {s.screens}
                  </td>
                ))}
              </tr>
            </tbody>
          </table>
        </Scroller>
      </Section>

      {/* ── WORKFLOW ─────────────────────────────────── */}
      <Section
        id="workflow"
        eyebrow="Workflow"
        title="The user flow, decision by decision."
        intro="Every box with a code is a designed screen. Dashed boxes are paths the design names but hasn’t drawn yet: they’re the first things to design next."
      >
        <ol className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
          {userFlow.map((col, ci) => (
            <li key={col.phase} className="flex flex-col rounded-2xl bg-surface p-4 ring-1 ring-border ring-inset">
              <h3 className="flex items-baseline gap-2 text-lg">
                <span className="font-mono text-xs text-accent">{ci + 1}</span>
                {col.phase}
              </h3>
              <ol className="mt-4 grid gap-0">
                {col.steps.map((st, si) => (
                  <li key={st.label}>
                    {si > 0 && (
                      <span aria-hidden="true" className="mx-auto block h-4 w-px bg-border-strong" />
                    )}
                    <div className={`flex items-start justify-between gap-2 rounded-lg px-3 py-2.5 ring-1 ring-inset ${st.decision && !st.code ? "bg-background ring-accent/50" : "bg-background ring-border"}`}>
                      <span className="flex items-start gap-2 text-sm leading-snug">
                        {st.decision && !st.code && (
                          <span aria-hidden="true" className="mt-1 inline-block h-2.5 w-2.5 shrink-0 rotate-45 border border-accent" />
                        )}
                        {st.label}
                        {st.decision && !st.code && <span className="sr-only"> (decision)</span>}
                      </span>
                      {st.code && <Tag>{st.code}</Tag>}
                    </div>
                    {st.decision && (
                      <ul className="mt-2 grid gap-1.5 pl-4">
                        {st.decision.map((b) => (
                          <li key={b.label} className="flex items-start gap-2 text-caption leading-snug">
                            <span aria-hidden="true" className="mt-[0.45em] h-px w-3 shrink-0 bg-border-strong" />
                            <span
                              className={`flex flex-1 items-start justify-between gap-2 rounded-md px-2 py-1.5 ${
                                b.designed ? "bg-background ring-1 ring-border ring-inset" : "border border-dashed border-border-strong text-muted"
                              }`}
                            >
                              <span>
                                {b.label}
                                {b.next && <span className="text-muted"> → {b.next}</span>}
                                {!b.designed && <span className="sr-only"> (not designed yet)</span>}
                              </span>
                              {b.code && <Tag>{b.code}</Tag>}
                            </span>
                          </li>
                        ))}
                      </ul>
                    )}
                  </li>
                ))}
              </ol>
              {col.exit && (
                <p className="mt-auto pt-4 text-caption text-muted">
                  <span aria-hidden="true">→ </span>
                  {col.exit}
                </p>
              )}
            </li>
          ))}
        </ol>
        <p className="mt-5 flex flex-wrap items-center gap-x-5 gap-y-2 text-caption text-muted">
          <span className="inline-flex items-center gap-2">
            <Tag>M07</Tag> Designed screen
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-2.5 w-2.5 rotate-45 border border-accent" /> Decision
          </span>
          <span className="inline-flex items-center gap-2">
            <span aria-hidden="true" className="inline-block h-4 w-8 rounded border border-dashed border-border-strong" /> Not designed yet
          </span>
        </p>

        <div className="mt-16">
          <h3>Service blueprint</h3>
          <p className="mt-2 max-w-[62ch] text-muted">Who does what at each step: the patient, the AI, the doctor, and what has to happen behind the scenes.</p>
          <div className="mt-6">
            <Scroller label="Service blueprint, scrolls sideways">
              <table className="w-full min-w-[980px] border-collapse text-left text-sm">
                <caption className="sr-only">Service blueprint: actions by the patient, Health AI, the doctor and back-end systems at each stage.</caption>
                <thead>
                  <tr>
                    <th scope="col" className="w-36 pb-3 align-bottom text-caption font-normal text-muted">
                      Lane
                    </th>
                    {blueprintStages.map((s) => (
                      <th key={s} scope="col" className="pb-3 pr-3 align-bottom font-medium">
                        {s}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="align-top">
                  {blueprint.map((lane) => (
                    <tr key={lane.lane} className={lane.note ? "border-t-2 border-dashed border-border-strong" : "border-t border-border"}>
                      <th scope="row" className="py-3 pr-3 font-medium">
                        {lane.lane}
                        {lane.note && <span className="block text-xs font-normal text-muted">{lane.note}</span>}
                      </th>
                      {lane.cells.map((c, i) => (
                        <td key={i} className={`py-3 pr-3 ${c === "—" ? "text-border-strong" : lane.lane === "Health AI" ? "text-foreground" : "text-muted"}`}>
                          {c === "—" ? (
                            <>
                              <span aria-hidden="true">—</span>
                              <span className="sr-only">None</span>
                            </>
                          ) : (
                            c
                          )}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </Scroller>
          </div>
        </div>

        <div className="mt-16">
          <h3>Task flows</h3>
          <ul className="mt-6 grid gap-6 md:grid-cols-3">
            {taskFlows.map((t) => (
              <li key={t.task} className="border-t border-border-strong pt-5">
                <h4 className="text-lg">{t.task}</h4>
                <dl className="mt-3 flex gap-6">
                  <div>
                    <dt className="text-xs text-muted">Phone</dt>
                    <dd className="text-2xl tracking-[-0.02em]">{t.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-xs text-muted">Tablet and web</dt>
                    <dd className="text-2xl tracking-[-0.02em]">{t.larger}</dd>
                  </div>
                </dl>
                <p className="mt-3 font-mono text-xs text-muted">{t.path}</p>
                <p className="mt-2 text-compact leading-relaxed text-muted">{t.note}</p>
              </li>
            ))}
          </ul>
        </div>
      </Section>

      {/* ── CARD SORT AND IA ─────────────────────────── */}
      <Section
        id="card-sort"
        eyebrow="Card sorting and information architecture"
        title="Twenty-five features, five places to find them."
        intro={
          <>
            The navigation groups the app’s features into five places, plus a Home that summarises them. This is the closed card sort that tests that grouping. It
            hasn’t been run with patients yet (see <a href="#validation" className="text-foreground underline decoration-border-strong underline-offset-4 hover:text-accent">validation</a>), so
            try it yourself first.
          </>
        }
      >
        <CardSort cards={sortCards} groups={sortGroups} />

        <div className="mt-16 grid gap-10 lg:grid-cols-[minmax(0,5fr)_minmax(0,7fr)] lg:gap-14">
          <div>
            <h3>The same places on every size</h3>
            <p className="mt-3 leading-relaxed text-muted">
              The structure holds from phone to web; only the way in changes. Two things to fix came out of mapping it: the same place has different names on
              different sizes, and on phones Doctors has no tab of its own.
            </p>
          </div>
          <Scroller label="Navigation by screen size, scrolls sideways">
            <table className="w-full min-w-[560px] border-collapse text-left text-sm">
              <caption className="sr-only">Where each place in the app is reached on phone, tablet and web.</caption>
              <thead>
                <tr className="text-caption text-muted">
                  <th scope="col" className="pb-2 pr-3 font-normal">
                    Place
                  </th>
                  <th scope="col" className="pb-2 pr-3 font-normal">
                    Phone
                  </th>
                  <th scope="col" className="pb-2 pr-3 font-normal">
                    Tablet
                  </th>
                  <th scope="col" className="pb-2 font-normal">
                    Web
                  </th>
                </tr>
              </thead>
              <tbody>
                {navMap.map((r) => (
                  <tr key={r.place} className="border-t border-border align-top">
                    <th scope="row" className="py-2.5 pr-3 font-medium">
                      {r.place}
                    </th>
                    <td className="py-2.5 pr-3 text-muted">{r.phone}</td>
                    <td className="py-2.5 pr-3 text-muted">{r.tablet}</td>
                    <td className="py-2.5 text-muted">{r.web}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Scroller>
        </div>
      </Section>

      {/* ── SCREENS ──────────────────────────────────── */}
      <Section
        id="screens"
        eyebrow="End to end"
        title="One fever, from the first question to the follow-up."
        intro={`Seven chapters, ${screenCount} screens. Switch the screen size to see how each step adapts.`}
      >
        <DeviceJourney chapters={chapters} devices={devices} />
      </Section>

      {/* ── AI DECISIONS ─────────────────────────────── */}
      <Section id="ai" tone="tint" eyebrow="Designing the AI" title="Six decisions about where the AI stops.">
        <TriageScale />
        <div className="mt-14">
          <NumberedGrid items={aiPrinciples} />
        </div>
      </Section>

      {/* ── FOUR LAYOUTS ─────────────────────────────── */}
      <Section
        id="layouts"
        eyebrow="Responsive"
        title="One screen, four layouts."
        intro="The Health AI chat on each size. The content is the same; what moves is navigation, the emergency line and where the assessment appears."
      >
        <ul className="grid grid-cols-2 items-end gap-4 md:flex md:gap-5">
          {layoutCompare.map((s) => (
            <li key={s.src} style={{ flex: `${s.width / s.height} 1 0%` }} className="min-w-0">
              <figure className="m-0">
                <div className="overflow-hidden rounded-xl bg-surface ring-1 ring-border">
                  <Image src={s.src} alt={s.alt} width={s.width} height={s.height} sizes="(min-width: 768px) 30vw, 50vw" className="h-auto w-full" />
                </div>
                <figcaption className="mt-2 text-caption text-muted">{codeDevice[s.code[0]]}</figcaption>
              </figure>
            </li>
          ))}
        </ul>
        <div className="mt-14">
          <NumberedGrid items={layoutRules} />
        </div>
      </Section>

      {/* ── DESIGN SYSTEM ────────────────────────────── */}
      <Section
        id="system"
        eyebrow="Design system"
        title="Calm blue, clear contrast, one typeface."
        intro="Read straight from the screens’ styles. Contrast ratios are measured, not estimated."
      >
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {tokens.map((t) => (
            <li key={t.name} className="overflow-hidden rounded-xl ring-1 ring-border ring-inset">
              <span aria-hidden="true" className="block h-16" style={{ background: t.hex }} />
              <div className="p-3">
                <p className="flex items-baseline justify-between gap-2">
                  <span className="text-compact font-medium">{t.name}</span>
                  <span className="font-mono text-xs text-muted">{t.hex}</span>
                </p>
                <p className="mt-1 text-caption text-muted">{t.use}</p>
                {t.contrast && <p className="mt-1 font-mono text-xs text-accent">{t.contrast}</p>}
              </div>
            </li>
          ))}
        </ul>
        <dl className="mt-10 grid gap-x-10 gap-y-5 border-t border-border pt-6 sm:grid-cols-2 lg:grid-cols-4">
          {systemFacts.map((f) => (
            <div key={f.term}>
              <dt className="text-caption text-muted">{f.term}</dt>
              <dd className="mt-1 text-compact leading-normal">{f.detail}</dd>
            </div>
          ))}
        </dl>
      </Section>

      {/* ── ACCESSIBILITY ────────────────────────────── */}
      <Section
        id="accessibility"
        eyebrow="Accessibility"
        title={`${a11y.passed} of ${a11y.total} screens pass with no issues.`}
        intro="I ran axe-core’s WCAG 2.2 AA rules on every exported screen. The other eight share five small issues, each with a fix."
      >
        <div className="grid gap-10 lg:grid-cols-[minmax(0,8fr)_minmax(0,4fr)] lg:gap-14">
          <ol className="grid gap-0">
            {a11y.issues.map((it, i) => (
              <li key={it.what} className="grid gap-1 border-t border-border py-4 sm:grid-cols-[2rem_minmax(0,1fr)_7rem] sm:gap-4">
                <span className="font-mono text-xs leading-6 text-accent">0{i + 1}</span>
                <div>
                  <p className="text-compact leading-relaxed">{it.what}</p>
                  <p className="mt-1 text-compact leading-relaxed text-muted">
                    <span className="text-foreground">Fix:</span> {it.fix}
                  </p>
                </div>
                <p className="font-mono text-xs leading-6 text-muted sm:text-right">{it.screens}</p>
              </li>
            ))}
          </ol>
          <div className="rounded-2xl bg-surface p-6 ring-1 ring-border ring-inset lg:self-start">
            <h3 className="text-lg">Designed in</h3>
            <ul className="mt-3 grid gap-2 text-compact text-muted">
              {a11y.designedIn.map((d) => (
                <li key={d} className="flex gap-2.5">
                  <svg viewBox="0 0 24 24" className="mt-1 h-3.5 w-3.5 shrink-0 text-success" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M20 6L9 17l-5-5" />
                  </svg>
                  {d}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </Section>

      {/* ── VALIDATION ───────────────────────────────── */}
      <Section
        id="validation"
        eyebrow="Validation plan"
        title="How I’d prove it works before anyone relies on it."
        intro="None of these studies has been run yet. They are planned in the order they’d run, from cheapest to most involved."
      >
        <ol className="grid gap-0">
          {validation.map((v, i) => (
            <li key={v.method} className="grid gap-2 border-t border-border py-5 md:grid-cols-[2rem_minmax(0,3fr)_minmax(0,7fr)] md:gap-6">
              <span className="font-mono text-xs leading-7 text-accent">0{i + 1}</span>
              <div>
                <h3 className="text-lg">{v.method}</h3>
                <p className="text-caption text-muted">{v.who}</p>
              </div>
              <p className="text-compact leading-relaxed text-muted">{v.answers}</p>
            </li>
          ))}
        </ol>
      </Section>

      {/* ── NEXT ─────────────────────────────────────── */}
      <Section id="next" eyebrow="What I’d do next" title="What mapping the whole journey showed me.">
        <BulletList items={nextSteps} />
      </Section>

      <CaseCta title="Designing an AI product people need to trust?" />
    </article>
  );
}
