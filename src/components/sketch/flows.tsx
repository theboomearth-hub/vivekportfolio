import DrawOnView from "@/components/sketch/DrawOnView";
import { Cross, Half, SketchArrow, Tick } from "@/components/sketch/glyphs";

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/**
 * Rows that read left to right through the same columns, with a sketched arrow between each cell:
 * finding → principle → decision, or context → call → result. Stacks with down arrows on phones.
 */
export function FlowRows({ head, rows, emphasis = -1 }: { head: string[]; rows: string[][]; emphasis?: number }) {
  const grid = "md:grid-cols-[repeat(var(--cols),minmax(0,1fr))] md:gap-x-9";
  const vars = { "--cols": head.length } as React.CSSProperties;
  return (
    <DrawOnView>
      <div className={`hidden pb-3 md:grid ${grid}`} style={vars} aria-hidden="true">
        {head.map((h) => <p key={h} className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{h}</p>)}
      </div>
      <ol className="grid gap-3">
        {rows.map((r, i) => (
          <li key={i} className={`sk-fade grid gap-3 rounded-2xl bg-background p-4 ring-1 ring-border ring-inset md:bg-transparent md:p-0 md:ring-0 ${grid}`} style={{ ...vars, ...sk(i) }}>
            {r.map((c, j) => (
              <div key={j} className="relative grid gap-1">
                <span className="font-mono text-[11px] uppercase tracking-[0.06em] text-muted md:hidden">{head[j]}</span>
                <p className={`text-compact md:flex md:h-full md:items-center md:rounded-xl md:px-4 md:py-3.5 md:ring-1 md:ring-inset ${j === emphasis ? "font-medium md:bg-accent-light/50 md:ring-accent/25" : j === 0 ? "md:bg-background md:ring-border" : "text-muted md:bg-background md:ring-border"}`}>{c}</p>
                {j < r.length - 1 && <SketchArrow className="absolute top-1/2 -right-8 hidden h-4 w-7 -translate-y-1/2 text-muted md:block" i={i} />}
              </div>
            ))}
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

/** One horizontal strip of steps with doodles above, joined by sketched arrows. */
export function StepStrip({ steps }: { steps: { label: string; title: string; text?: string; doodle?: React.ReactNode; href?: string }[] }) {
  return (
    <DrawOnView>
      <ol className="grid gap-4 md:flex md:items-stretch md:gap-0">
        {steps.map((s, i) => (
          <li key={s.label} className="flex flex-col md:flex-1 md:flex-row md:items-center">
            <div className="sk-fade flex h-full flex-1 flex-col gap-3 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={sk(i * 2)}>
              {s.doodle && <div className="h-12 w-12 text-foreground">{s.doodle}</div>}
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{s.label}</p>
              <p className="text-lg leading-snug">{s.href ? <a href={s.href} className="underline decoration-border-strong underline-offset-4 hover:text-accent">{s.title}</a> : s.title}</p>
              {s.text && <p className="text-compact text-muted">{s.text}</p>}
            </div>
            {i < steps.length - 1 && <SketchArrow className="mx-auto my-1 h-5 w-8 shrink-0 rotate-90 text-muted md:mx-2 md:my-0 md:rotate-0" i={i * 2 + 1} />}
          </li>
        ))}
      </ol>
    </DrawOnView>
  );
}

export type MatrixState = "yes" | "partial" | "no";

/** Capabilities × options, with hand-drawn tick, half and cross. The last column is usually "ours". */
export function CompareMatrix({ columns, rows, caption }: { columns: string[]; rows: { label: string; cells: { state: MatrixState; note?: string }[] }[]; caption?: string }) {
  const glyph = (s: MatrixState, i: number, ours: boolean) => (s === "yes" ? <Tick className={`h-5 w-5 shrink-0 ${ours ? "text-accent" : "text-foreground"}`} i={i} /> : s === "partial" ? <Half className="h-5 w-5 shrink-0 text-muted" i={i} /> : <Cross className="h-5 w-5 shrink-0 text-muted" i={i} />);
  const word = { yes: "Yes", partial: "Partly", no: "No" };
  return (
    <figure className="m-0">
      <DrawOnView className="-mx-4 overflow-x-auto px-4 sm:mx-0 sm:px-0" tabIndex={0} role="region" aria-label={`${caption ?? "Comparison"}, scrolls sideways`}>
        <table className="w-full min-w-[640px] border-collapse text-left text-compact">
          <caption className="sr-only">{caption ?? "Comparison"}</caption>
          <thead>
            <tr className="border-b border-border">
              <th scope="col" className="py-3 pr-4 text-caption font-normal text-muted">Capability</th>
              {columns.map((c, j) => <th key={c} scope="col" className={`py-3 pr-4 text-caption font-normal ${j === columns.length - 1 ? "text-accent" : "text-muted"}`}>{c}</th>)}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, i) => (
              <tr key={r.label} className="border-b border-border last:border-0">
                <th scope="row" className="py-3.5 pr-4 align-top font-medium">{r.label}</th>
                {r.cells.map((c, j) => (
                  <td key={j} className="py-3.5 pr-4 align-top">
                    <span className="flex gap-2.5">
                      {glyph(c.state, i, j === r.cells.length - 1)}
                      <span><span className="sr-only">{word[c.state]}. </span><span className="text-muted">{c.note}</span></span>
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </DrawOnView>
      {caption && <figcaption className="mt-3 text-caption text-muted">{caption}</figcaption>}
    </figure>
  );
}
