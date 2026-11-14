import DrawOnView from "@/components/sketch/DrawOnView";
import { Frown, SketchArrow, Spark, Tick } from "@/components/sketch/glyphs";

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/**
 * An autonomy ladder: each rung lets the agent do more, and needs more from the person.
 * Drawn as rising steps on wide screens, a plain list on phones.
 */
export function Ladder({ rungs }: { rungs: { level: string; note: string; items?: string[]; tone?: "plain" | "accent" | "never" }[] }) {
  return (
    <DrawOnView>
      <ol className="grid items-end gap-3 md:grid-cols-[repeat(var(--n),minmax(0,1fr))]" style={{ "--n": rungs.length } as React.CSSProperties}>
        {rungs.map((r, i) => (
          <li key={r.level} className="sk-fade flex flex-col" style={sk(i)}>
            <div
              className={`flex flex-col gap-3 rounded-2xl p-5 ring-1 ring-inset md:min-h-[var(--h)] ${r.tone === "never" ? "border border-dashed border-danger/50 bg-background ring-transparent" : r.tone === "accent" ? "bg-accent-light/45 ring-accent/30" : "bg-background ring-border"}`}
              style={{ "--h": `${14 + i * 3}rem` } as React.CSSProperties}
            >
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Step {i + 1}</p>
              <p className="text-lg leading-snug">{r.level}</p>
              <p className="text-compact text-muted">{r.note}</p>
              {r.items && r.items.length > 0 && (
                <ul className="mt-auto flex flex-wrap gap-1.5">
                  {r.items.map((t) => <li key={t} className="rounded-md bg-background px-2 py-1 font-mono text-xs ring-1 ring-border ring-inset">{t}</li>)}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

/** Stages left to right on one hand-drawn line, with what happens in each listed underneath. */
export function Pipeline({ stages }: { stages: { name: string; text?: string; items: string[] }[] }) {
  return (
    <DrawOnView>
      <ol className="relative grid gap-6 md:grid-cols-[repeat(var(--n),minmax(0,1fr))] md:gap-4" style={{ "--n": stages.length } as React.CSSProperties}>
        {/* Stretched to the row's width, so it gets a gentle hand-drawn curve rather than the wobble filter. */}
        <svg className="pointer-events-none absolute top-px left-0 hidden h-3 w-full text-foreground md:block" viewBox="0 0 1000 12" preserveAspectRatio="none" aria-hidden="true">
          <path className="sk-draw" pathLength={1} d="M4 6C200 4.5 420 7.5 640 5.5S900 6.5 996 6" fill="none" stroke="currentColor" strokeWidth="1.6" vectorEffect="non-scaling-stroke" />
        </svg>
        {stages.map((s, i) => (
          <li key={s.name} className="sk-fade relative grid content-start gap-2 border-l border-border-strong pl-5 md:border-0 md:pl-0" style={sk(i)}>
            <span className="absolute top-1 -left-[7px] h-3.5 w-3.5 rounded-full border-2 border-foreground bg-background md:static md:mb-2" aria-hidden="true" />
            <p className="font-mono text-xs tracking-[0.06em] text-accent">{String(i + 1).padStart(2, "0")}</p>
            <p className="text-lg leading-snug">{s.name}</p>
            {s.text && <p className="text-compact text-muted">{s.text}</p>}
            {s.items.length > 0 && (
              <ul className="mt-1 flex flex-wrap gap-1.5">
                {s.items.map((t) => <li key={t} className="rounded-md bg-surface px-2 py-1 font-mono text-[11px] ring-1 ring-border ring-inset">{t}</li>)}
              </ul>
            )}
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

/**
 * A journey drawn as a path through stages: what happens today, where it hurts, and the opening it leaves.
 * No emotion scores: the evidence names pains, not feelings on a scale, so none are drawn.
 */
export function JourneyMap({ stages }: { stages: { stage: string; today: string; pain: string; opportunity: string }[] }) {
  return (
    <DrawOnView className="-mx-4 overflow-x-auto px-4 pb-2 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label="Journey map, scrolls sideways">
      <ol className="grid min-w-[880px] grid-cols-[repeat(var(--n),minmax(0,1fr))] gap-3" style={{ "--n": stages.length } as React.CSSProperties}>
        {stages.map((s, i) => (
          <li key={s.stage} className="sk-fade grid grid-rows-[auto_auto_1fr_auto] gap-3" style={sk(i)}>
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-accent">{String(i + 1).padStart(2, "0")}</span>
              <span className="text-lg">{s.stage}</span>
              {i < stages.length - 1 && <SketchArrow className="ml-auto h-4 w-6 text-muted" i={i} />}
            </div>
            <p className="text-compact text-muted">{s.today}</p>
            <div className="flex gap-2 rounded-xl bg-surface p-3">
              <Frown className="h-5 w-5 shrink-0 text-foreground" i={i} />
              <p className="text-compact">{s.pain}</p>
            </div>
            <div className="flex gap-2 rounded-xl bg-accent-light/45 p-3">
              <Spark className="h-5 w-5 shrink-0 text-accent" i={i} />
              <p className="text-compact">{s.opportunity}</p>
            </div>
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

/** Layers stacked bottom-up, each with a doodle and a line; the highlighted layer is the focus. */
export function StackDiagram({ layers, taper = true }: { layers: { name: string; text: string; doodle?: React.ReactNode; accent?: boolean; tag?: string; items?: string[] }[]; taper?: boolean }) {
  return (
    <DrawOnView>
      <ol className="grid gap-2">
        {layers.map((l, i) => (
          <li key={l.name} className={`sk-fade grid grid-cols-[40px_minmax(0,1fr)] items-start gap-x-4 gap-y-2 rounded-2xl px-5 py-4 ring-1 ring-inset sm:grid-cols-[40px_minmax(0,14rem)_minmax(0,1fr)] ${l.accent ? "bg-accent-light/45 ring-accent/30" : "bg-background ring-border"}`} style={{ ...sk(layers.length - i), marginInline: taper ? `${(layers.length - 1 - i) * 0.6}rem` : undefined }}>
            <span className="h-10 w-10 text-foreground">{l.doodle}</span>
            <div className="self-center">
              <p className="text-lg leading-snug">{l.name}</p>
              {l.tag && <p className="mt-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-muted">{l.tag}</p>}
            </div>
            <div className="col-span-2 self-center sm:col-span-1">
              <p className="text-compact text-muted">{l.text}</p>
              {l.items && l.items.length > 0 && (
                <ul className="mt-2 flex flex-wrap gap-1.5">
                  {l.items.map((t) => <li key={t} className="rounded-md bg-surface px-2 py-1 font-mono text-[11px] ring-1 ring-border ring-inset">{t}</li>)}
                </ul>
              )}
            </div>
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

/** What exists and what's next, side by side: hand ticks for built, dashed rings for next. */
export function StatusLists({ built, next, builtLabel = "Built", nextLabel = "Next" }: { built: string[]; next: string[]; builtLabel?: string; nextLabel?: string }) {
  return (
    <DrawOnView className="grid gap-4 md:grid-cols-2 [&>*]:min-w-0">
      <div className="rounded-2xl bg-background p-6 ring-1 ring-border ring-inset">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{builtLabel} · {built.length}</p>
        <ul className="mt-4 grid gap-2.5">
          {built.map((b, i) => <li key={b} className="flex gap-3 text-compact"><Tick className="h-5 w-5 shrink-0 text-accent" i={Math.min(i, 8)} />{b}</li>)}
        </ul>
      </div>
      <div className="rounded-2xl border border-dashed border-border-strong p-6">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{nextLabel} · {next.length}</p>
        <ul className="mt-4 grid gap-2.5">
          {next.map((n) => <li key={n} className="flex gap-3 text-compact text-muted"><span aria-hidden="true" className="mt-1 h-3.5 w-3.5 shrink-0 rounded-full border-[1.5px] border-dashed border-muted" />{n}</li>)}
        </ul>
      </div>
    </DrawOnView>
  );
}

/** A decision as a small tree: context, the options weighed, the call (ringed), and what happened. */
export function DecisionTree({ context, options, choice, result }: { context: string; options: string[]; choice: string; result: string }) {
  return (
    <DrawOnView className="grid gap-3 lg:grid-cols-[minmax(0,1fr)_auto_minmax(0,1.1fr)_auto_minmax(0,1fr)] lg:items-center">
      <div className="sk-fade rounded-xl bg-background p-4 ring-1 ring-border ring-inset" style={sk(0)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Context</p>
        <p className="mt-1 text-compact">{context}</p>
      </div>
      <SketchArrow className="mx-auto h-5 w-8 rotate-90 text-muted lg:rotate-0" i={1} />
      <div className="grid gap-2">
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Options weighed</p>
        {options.map((o, i) => (
          <p key={i} className="sk-fade rounded-lg border border-dashed border-border-strong px-3 py-2 text-caption text-muted" style={sk(2 + i)}>{o}</p>
        ))}
        <div className="sk-fade relative rounded-xl bg-accent-light/50 p-4 ring-1 ring-accent/30 ring-inset" style={sk(2 + options.length)}>
          <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-accent">The call</p>
          <p className="mt-1 text-compact">{choice}</p>
        </div>
      </div>
      <SketchArrow className="mx-auto h-5 w-8 rotate-90 text-muted lg:rotate-0" i={3 + options.length} />
      <div className="sk-fade rounded-xl bg-background p-4 ring-1 ring-border ring-inset" style={sk(4 + options.length)}>
        <p className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted">Result</p>
        <p className="mt-1 text-compact">{result}</p>
      </div>
    </DrawOnView>
  );
}
