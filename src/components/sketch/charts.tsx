import DrawOnView from "@/components/sketch/DrawOnView";
import { UnderlineMark } from "@/components/sketch/marks";

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/**
 * Horizontal bars drawn to one scale. Values are printed beside every bar, so the chart reads without
 * the bars; `highlight` picks the one bar the section is about.
 */
export function BarList({ items, max, highlight = [], unit = "", caption }: { items: { label: string; value: number; display?: string }[]; max?: number; highlight?: number[]; unit?: string; caption?: string }) {
  const top = max ?? Math.max(...items.map((x) => x.value));
  return (
    <figure className="m-0">
      <DrawOnView>
        <ul className="grid gap-3.5">
          {items.map((it, i) => (
            <li key={it.label} className="grid gap-1.5">
              <div className="flex items-baseline justify-between gap-4 text-compact">
                <span className={highlight.includes(i) ? "font-medium" : ""}>{it.label}</span>
                <span className="shrink-0 font-mono text-sm tabular-nums text-muted">{it.display ?? `${it.value}${unit}`}</span>
              </div>
              <div className="h-2.5 overflow-hidden rounded-full bg-border" aria-hidden="true">
                <div className={`sk-grow h-full rounded-full ${highlight.includes(i) ? "bg-accent" : "bg-foreground"}`} style={{ width: `${(it.value / top) * 100}%`, ...sk(i) }} />
              </div>
            </li>
          ))}
        </ul>
      </DrawOnView>
      {caption && <figcaption className="mt-4 text-caption text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** Big numbers with a hand-drawn underline. Use only where the figures are the point. */
export function StatTiles({ items, cols = "sm:grid-cols-2 lg:grid-cols-4" }: { items: { value: string; label: string; note?: string }[]; cols?: string }) {
  return (
    <DrawOnView className={`grid gap-4 ${cols} [&>*]:min-w-0`}>
      {items.map((s, i) => (
        <div key={s.label} className="sk-fade rounded-2xl bg-background p-5 ring-1 ring-border ring-inset" style={sk(i)}>
          <p className="relative inline-block text-[clamp(1.75rem,3vw,2.25rem)] font-medium leading-none tracking-[-0.03em] tabular-nums">
            {s.value}
            <UnderlineMark className="absolute -bottom-2.5 left-0 h-2.5 w-full" i={i + 1} />
          </p>
          <p className="mt-5 text-compact">{s.label}</p>
          {s.note && <p className="mt-1 text-caption text-muted">{s.note}</p>}
        </div>
      ))}
    </DrawOnView>
  );
}

/** Part of a whole, drawn as a row of marks: "43 of 51". */
export function Proportion({ part, whole, label }: { part: number; whole: number; label: string }) {
  return (
    <DrawOnView>
      <div className="flex flex-wrap gap-1" role="img" aria-label={`${part} of ${whole} ${label}`}>
        {Array.from({ length: whole }, (_, i) => (
          <span key={i} className={`sk-fade h-3.5 w-1.5 rounded-full ${i < part ? "bg-accent" : "bg-border-strong"}`} style={sk(Math.floor(i / 6))} />
        ))}
      </div>
    </DrawOnView>
  );
}
