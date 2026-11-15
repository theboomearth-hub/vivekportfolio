/**
 * The information-architecture decision, laid out to read top to bottom at full width:
 * the context, the three options side by side as equal cards (each with why it was or wasn't chosen),
 * then the call and what it produces. Server component; drawn on with the sketch kit.
 */
import DrawOnView from "@/components/sketch/DrawOnView";
import { Cross, SketchArrow, Tick } from "@/components/sketch/glyphs";

type Option = { title: string; text: string; why: string; chosen: boolean };
const label = "font-mono text-[11px] uppercase tracking-[0.06em]";
const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

export default function IADecision({ context, options, choice, result }: { context: string; options: Option[]; choice: string; result: string }) {
  return (
    <DrawOnView className="grid gap-4">
      <div className="sk-fade rounded-2xl bg-background p-5 ring-1 ring-border ring-inset sm:p-6" style={sk(0)}>
        <p className={`${label} text-muted`}>Context</p>
        <p className="mt-2 max-w-[70ch] text-lg leading-relaxed">{context}</p>
      </div>

      <SketchArrow className="mx-auto h-6 w-9 rotate-90 text-muted" i={1} />

      <div className="grid gap-3">
        <p className={`${label} text-muted`}>Options weighed</p>
        <ol className="grid gap-3 md:grid-cols-3">
          {options.map((o, i) => (
            <li
              key={o.title}
              className={`sk-fade flex flex-col gap-3 rounded-2xl p-5 ring-inset ${o.chosen ? "bg-accent-light/45 ring-2 ring-accent/40" : "border border-dashed border-border-strong bg-background"}`}
              style={sk(2 + i)}
            >
              <div className="flex items-center justify-between gap-3">
                <p className={`${label} ${o.chosen ? "text-accent" : "text-muted"}`}>Option {i + 1}</p>
                <span className={`inline-flex items-center gap-1.5 text-caption ${o.chosen ? "font-medium text-accent" : "text-muted"}`}>
                  {o.chosen ? <Tick className="h-4 w-4 text-accent" i={2 + i} /> : <Cross className="h-4 w-4 text-muted" i={2 + i} />}
                  {o.chosen ? "Chosen" : "Not chosen"}
                </span>
              </div>
              <h4 className="text-lg leading-snug">{o.title}</h4>
              <p className="text-compact text-muted">{o.text}</p>
              <p className={`mt-auto border-t pt-3 text-compact ${o.chosen ? "border-accent/25" : "border-border"}`}>{o.why}</p>
            </li>
          ))}
        </ol>
      </div>

      <SketchArrow className="mx-auto h-6 w-9 rotate-90 text-muted" i={6} />

      <div className="grid items-stretch gap-3 md:grid-cols-[minmax(0,1.3fr)_auto_minmax(0,1fr)]">
        <div className="sk-fade flex flex-col gap-2 rounded-2xl bg-accent-light/45 p-5 ring-1 ring-accent/30 ring-inset sm:p-6" style={sk(7)}>
          <p className={`${label} text-accent`}>The call</p>
          <p className="text-lg leading-relaxed">{choice}</p>
        </div>
        <SketchArrow className="mx-auto h-6 w-9 rotate-90 self-center text-muted md:rotate-0" i={8} />
        <div className="sk-fade flex flex-col gap-2 rounded-2xl bg-background p-5 ring-1 ring-border ring-inset sm:p-6" style={sk(9)}>
          <p className={`${label} text-muted`}>Result</p>
          <p className="text-lg leading-relaxed">{result}</p>
        </div>
      </div>
    </DrawOnView>
  );
}
