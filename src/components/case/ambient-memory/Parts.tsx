/**
 * Pieces specific to the Ambient Memory case study: the positioning map, the three identity directions,
 * the token swatches, the computed contrast table and the research timeline. Server components, no state.
 */
import DrawOnView from "@/components/sketch/DrawOnView";
import { contrastRows, directions, methods, positioning, tokens } from "@/lib/work/ambient-memory";

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/** Seven products on two axes. Our judgement, to validate: the dots are where we read each product, not measurements. */
export function PositioningMap() {
  const W = 560, H = 400, pad = 36;
  const px = (x: number) => pad + x * (W - pad * 2);
  const py = (y: number) => H - pad - y * (H - pad * 2);
  return (
    <figure className="m-0">
      <DrawOnView className="rounded-2xl bg-background p-4 ring-1 ring-border ring-inset sm:p-6">
        <svg viewBox={`0 0 ${W} ${H}`} className="h-auto w-full" role="img" aria-label="Positioning map: capture scope from meetings only to the whole day across, and trust from implicit to explicit up. The opportunity sits top right, above TwinMind; Claude Meetings top left; Granola, Plaud, Otter and Fireflies in the lower half.">
          <rect x={pad} y={pad} width={W - pad * 2} height={H - pad * 2} fill="none" stroke="var(--color-border)" />
          <line x1={W / 2} y1={pad} x2={W / 2} y2={H - pad} stroke="var(--color-border)" strokeDasharray="4 4" />
          <line x1={pad} y1={H / 2} x2={W - pad} y2={H / 2} stroke="var(--color-border)" strokeDasharray="4 4" />
          <text x={pad} y={H - 12} fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-mono)">MEETINGS ONLY</text>
          <text x={W - pad} y={H - 12} fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-mono)" textAnchor="end">WHOLE-DAY CAPTURE</text>
          <text x={14} y={H - pad} fontSize="11" fill="var(--color-muted)" fontFamily="var(--font-mono)" transform={`rotate(-90 14 ${H - pad})`}>IMPLICIT TRUST → EXPLICIT, CONTROLLABLE</text>
          {positioning.map((p, i) => (
            <g key={p.name} className="sk-fade" style={sk(i)}>
              <circle cx={px(p.x)} cy={py(p.y)} r={p.kind === "gap" ? 9 : 7} fill={p.kind === "gap" ? "var(--color-background)" : p.kind === "us" ? "var(--color-foreground)" : "var(--color-muted)"} stroke={p.kind === "gap" ? "var(--color-accent)" : "none"} strokeWidth={3} />
              <text x={px(p.x) + (p.x > 0.7 ? -14 : 14)} y={py(p.y) + 4} fontSize="13" fill="var(--color-foreground)" textAnchor={p.x > 0.7 ? "end" : "start"} fontWeight={p.kind === "gap" ? 600 : 400}>{p.name}</text>
            </g>
          ))}
        </svg>
      </DrawOnView>
      <figcaption className="mt-3 text-caption text-muted">Positioning map, our judgement, to validate. Vertical axis: how visible and controllable trust is, from implicit (bottom) to explicit (top).</figcaption>
    </figure>
  );
}

/** The three identity directions as small cards in their own colours, with the chosen one ringed. */
export function DirectionCards() {
  return (
    <DrawOnView className="grid gap-4 md:grid-cols-3 [&>*]:min-w-0">
      {directions.map((d, i) => (
        <article key={d.id} className={`sk-fade flex flex-col gap-4 rounded-2xl bg-background p-5 ring-1 ring-inset ${d.chosen ? "ring-accent" : "ring-border"}`} style={sk(i)}>
          <div className="flex items-center justify-between gap-3">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{d.id} · {d.name}</p>
            {d.chosen && <span className="rounded-full bg-accent-light/60 px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] text-foreground">Chosen as base</span>}
          </div>
          <div className="rounded-xl p-5" style={{ background: d.bg, color: d.fg }} aria-hidden="true">
            <div className="flex gap-2">{d.dots.map((c) => <span key={c} className="h-3.5 w-3.5 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}</div>
            <p className="mt-6 text-[1.35rem] font-medium leading-tight tracking-[-0.02em]">{d.sample}</p>
            <div className="mt-5 flex gap-2">
              <span className="rounded-full px-3.5 py-1.5 text-sm font-medium" style={{ background: d.action, color: d.actionText }}>Start capture</span>
              <span className="rounded-full px-3.5 py-1.5 text-sm ring-1 ring-inset" style={{ color: d.fg, borderColor: d.fg, boxShadow: `inset 0 0 0 1px ${d.fg}55` }}>Prep</span>
            </div>
          </div>
          <p className="text-compact text-muted">{d.idea}</p>
          <dl className="grid gap-2 text-compact">
            <div><dt className="text-caption text-muted">Signature interaction</dt><dd>{d.signature}</dd></div>
            <div><dt className="text-caption text-muted">Main risk</dt><dd>{d.risk}</dd></div>
          </dl>
        </article>
      ))}
    </DrawOnView>
  );
}

/** Every colour token with its light and dark value. */
export function TokenSwatches() {
  return (
    <DrawOnView className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 [&>*]:min-w-0">
      {tokens.map((t, i) => (
        <div key={t.name} className="sk-fade grid grid-cols-[minmax(0,1fr)_auto_auto] items-center gap-3 rounded-xl bg-background px-3 py-2 ring-1 ring-border ring-inset" style={sk(Math.min(i, 10))}>
          <p className="truncate font-mono text-xs">{t.name}</p>
          {(["light", "dark"] as const).map((m) => (
            <p key={m} className="flex items-center gap-1.5 font-mono text-[11px] text-muted" title={`${m}: ${t[m]}`}>
              <span aria-hidden="true" className="h-5 w-5 rounded-md ring-1 ring-border-strong" style={{ background: t[m] }} />
              <span className="sr-only">{m} </span>{t[m].replace("#", "")}
            </p>
          ))}
        </div>
      ))}
    </DrawOnView>
  );
}

/** Contrast of each text pair in both modes, computed from the token values above with the WCAG formula. */
export function ContrastTable() {
  const cell = (c: { fg: string; bg: string; ratio: number }, need: number) => {
    const pass = c.ratio >= need;
    return (
      <td className="py-2.5 pr-4 align-top">
        <span className="inline-flex items-center gap-2">
          <span aria-hidden="true" className="inline-flex h-7 w-10 items-center justify-center rounded-md text-xs font-medium ring-1 ring-border-strong" style={{ background: c.bg, color: c.fg }}>Aa</span>
          <span className="font-mono text-sm tabular-nums">{c.ratio.toFixed(1)}:1</span>
          <span className={`rounded-full px-2 py-0.5 font-mono text-[11px] uppercase tracking-[0.06em] ${pass ? "bg-accent-light/60 text-foreground" : "bg-foreground text-background"}`}>{pass ? "Pass" : "Fail"}</span>
        </span>
      </td>
    );
  };
  return (
    <div className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label="Measured contrast, both modes, scrolls sideways">
      <table className="w-full min-w-[640px] border-collapse text-left text-compact">
        <caption className="sr-only">Contrast ratios for each text pair, light and dark, computed from the tokens</caption>
        <thead>
          <tr className="border-b border-border-strong">
            {["Pair", "Need", "Light", "Dark"].map((h) => <th key={h} scope="col" className="py-3 pr-4 text-caption font-normal text-muted">{h}</th>)}
          </tr>
        </thead>
        <tbody>
          {contrastRows.map((r) => (
            <tr key={r.pair} className="border-b border-border last:border-0">
              <th scope="row" className="py-2.5 pr-4 align-top font-medium">{r.pair}</th>
              <td className="py-2.5 pr-4 align-top font-mono text-sm tabular-nums text-muted">{r.need.toFixed(1)}:1</td>
              {cell(r.light, r.need)}
              {cell(r.dark, r.need)}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Five methods over six weeks, as bars. */
export function MethodTimeline() {
  return (
    <DrawOnView>
      <div className="hidden grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,2fr)] gap-4 pb-2 md:grid" aria-hidden="true">
        {["Method", "Sample", "Weeks 1 to 6"].map((h) => <p key={h} className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{h}</p>)}
      </div>
      <ol className="grid gap-2">
        {methods.map((m, i) => (
          <li key={m.method} className="sk-fade grid gap-2 rounded-xl bg-background p-4 ring-1 ring-border ring-inset md:grid-cols-[minmax(0,1.3fr)_minmax(0,2fr)_minmax(0,2fr)] md:items-center md:gap-4" style={sk(i)}>
            <p className="font-medium">{m.method}</p>
            <p className="text-compact text-muted">{m.sample}</p>
            <div className="flex items-center gap-3">
              <div className="relative h-2.5 flex-1 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div className="sk-grow absolute inset-y-0 rounded-full bg-accent" style={{ left: `${((m.start - 1) / 6) * 100}%`, width: `${((m.end - m.start + 1) / 6) * 100}%`, ...sk(i) }} />
              </div>
              <p className="shrink-0 font-mono text-xs text-muted">Weeks {m.start} to {m.end}</p>
            </div>
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}
