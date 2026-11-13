import DrawOnView from "@/components/sketch/DrawOnView";

export type Lane = "you" | "code" | "model";
export type SystemStep = { lane: Lane; short: [string, string]; text: string; note?: string };
type Step = SystemStep;

const LANES: { id: Lane; label: string; sub: string; y: number }[] = [
  { id: "you", label: "You", sub: "decide", y: 80 },
  { id: "code", label: "Code", sub: "every time", y: 200 },
  { id: "model", label: "Claude", sub: "chooses and words", y: 320 },
];
const laneY = (l: Lane) => LANES.find((x) => x.id === l)!.y;
const X0 = 214, DX = 112, W = 94, H = 58;
const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/**
 * One turn of an agent, in three lanes: what the person does, what code always does, and the little the
 * model decides. Drawn as SVG on wide screens; an ordered list carries the same content everywhere else
 * and for screen readers.
 */
export default function AgentSystem({ steps, caption }: { steps: Step[]; caption?: string }) {
  const pos = steps.map((s, i) => ({ x: X0 + i * DX, y: laneY(s.lane) }));
  const notes = steps.map((s, i) => ({ ...s, i })).filter((s) => s.note);

  return (
    <figure className="m-0">
      <DrawOnView className="hidden lg:block">
        <svg viewBox="0 0 1080 380" className="h-auto w-full text-foreground" role="img" aria-label={`${steps.length} steps in one agent turn, across three lanes: you, code and Claude. The same steps are listed below.`}>
          {/* Lanes */}
          {LANES.map((l, n) => (
            <g key={l.id}>
              {n > 0 && <path d={`M150 ${l.y - 60}H1070`} className="stroke-border" strokeDasharray="4 6" />}
              <text x="0" y={l.y - 4} className="fill-foreground font-mono" fontSize="12" letterSpacing="0.06em">{l.label.toUpperCase()}</text>
              <text x="0" y={l.y + 14} className="fill-muted" fontSize="12">{l.sub}</text>
            </g>
          ))}

          {/* Connectors: down or up between lanes, drawn in hand */}
          <g fill="none" className="stroke-foreground" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" filter="url(#sk-wobble)">
            {pos.slice(1).map((b, n) => {
              const a = pos[n];
              const down = b.y > a.y;
              const x1 = a.x + 18, y1 = a.y + (down ? H / 2 : -H / 2);
              const x2 = b.x - 18, y2 = b.y + (down ? -H / 2 : H / 2);
              const k = (y2 - y1) * 0.55;
              const head = down ? `M${x2 - 5} ${y2 - 8}L${x2} ${y2}L${x2 + 5} ${y2 - 8}` : `M${x2 - 5} ${y2 + 8}L${x2} ${y2}L${x2 + 5} ${y2 + 8}`;
              return (
                <g key={n} style={sk(n + 0.5)}>
                  <path className="sk-draw" pathLength={1} d={`M${x1} ${y1}C${x1} ${y1 + k} ${x2} ${y2 - k} ${x2} ${y2}`} />
                  <path className="sk-draw" pathLength={1} d={head} />
                </g>
              );
            })}
          </g>

          {/* Steps */}
          {steps.map((s, i) => {
            const { x, y } = pos[i];
            const box = s.lane === "code" ? "fill-foreground stroke-foreground" : s.lane === "model" ? "fill-accent-light stroke-accent" : "fill-background stroke-foreground";
            const ink = s.lane === "code" ? "fill-background" : "fill-foreground";
            return (
              <g key={i} className="sk-fade" style={sk(i)}>
                <rect x={x - W / 2} y={y - H / 2} width={W} height={H} rx="12" className={box} strokeWidth="1.5" />
                <text x={x} y={y - 3} textAnchor="middle" fontSize="12.5" className={ink}>{s.short[0]}</text>
                <text x={x} y={y + 13} textAnchor="middle" fontSize="12.5" className={ink}>{s.short[1]}</text>
              </g>
            );
          })}

          {/* Hand-drawn notes on the three steps that carry the safety */}
          <g className="text-accent" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" filter="url(#sk-wobble)">
            {notes.map((nt, k) => {
              const p = pos[nt.i];
              if (nt.lane === "code" && nt.i === 1) {
                return <path key={k} className="sk-draw" pathLength={1} style={sk(9 + k)} d={`M${p.x - 70} ${p.y + 108}C${p.x - 62} ${p.y + 74} ${p.x - 30} ${p.y + 56} ${p.x - 12} ${p.y + 36}M${p.x - 22} ${p.y + 36}l10 0 1 10`} />;
              }
              if (nt.lane === "you") {
                return <path key={k} className="sk-draw" pathLength={1} style={sk(9 + k)} d={`M${p.x - 150} ${p.y + 22}C${p.x - 112} ${p.y + 44} ${p.x - 76} ${p.y + 40} ${p.x - 54} ${p.y + 18}M${p.x - 64} ${p.y + 14}l10 4-2 10`} />;
              }
              return (
                <g key={k} style={sk(9 + k)}>
                  <path className="sk-draw" pathLength={1} d={`M${p.x - 40} ${p.y - 40}C${p.x + 20} ${p.y - 52} ${p.x + 70} ${p.y - 30} ${p.x + 64} ${p.y + 6}C${p.x + 58} ${p.y + 44} ${p.x - 30} ${p.y + 52} ${p.x - 62} ${p.y + 26}C${p.x - 80} ${p.y + 6} ${p.x - 70} ${p.y - 30} ${p.x - 30} ${p.y - 44}`} />
                  <path className="sk-draw" pathLength={1} d={`M${p.x - 6} ${p.y + 98}C${p.x - 2} ${p.y + 80} ${p.x} ${p.y + 64} ${p.x} ${p.y + 50}M${p.x - 6} ${p.y + 58}l6-9 6 9`} />
                </g>
              );
            })}
          </g>
          {notes.map((nt, k) => {
            const p = pos[nt.i];
            const [a, b] = splitNote(nt.note!);
            if (nt.lane === "code" && nt.i === 1) return <text key={k} x={p.x - 150} y={p.y + 124} className="sk-fade fill-accent" fontSize="12.5" style={sk(9 + k)}><tspan x={p.x - 150}>{a}</tspan><tspan x={p.x - 150} dy="16">{b}</tspan></text>;
            if (nt.lane === "you") return <text key={k} x={p.x - 158} y={p.y + 6} textAnchor="end" className="sk-fade fill-accent" fontSize="12.5" style={sk(9 + k)}><tspan x={p.x - 158}>{a}</tspan><tspan x={p.x - 158} dy="16">{b}</tspan></text>;
            return <text key={k} x={p.x + 40} y={p.y + 116} textAnchor="end" className="sk-fade fill-accent" fontSize="12.5" style={sk(9 + k)}><tspan x={p.x + 40}>{a}</tspan><tspan x={p.x + 40} dy="16">{b}</tspan></text>;
          })}
        </svg>
      </DrawOnView>

      {/* The same steps as a list: the only version below lg, and the screen-reader version everywhere. */}
      <ol className="grid gap-3 lg:sr-only">
        {steps.map((s, i) => (
          <li key={i} className="grid grid-cols-[4.5rem_minmax(0,1fr)] gap-x-3 gap-y-1">
            <span className={`mt-0.5 inline-flex h-6 items-center justify-self-start rounded-full px-2.5 font-mono text-[11px] uppercase tracking-[0.06em] ${s.lane === "code" ? "bg-foreground text-background" : s.lane === "model" ? "bg-accent-light text-foreground" : "text-foreground ring-1 ring-border-strong ring-inset"}`}>
              {LANES.find((l) => l.id === s.lane)!.label}
            </span>
            <span className="text-compact">{s.text}</span>
            {s.note && <span className="col-start-2 text-compact text-accent">{s.note}</span>}
          </li>
        ))}
      </ol>
      {caption && <figcaption className="mt-4 text-caption text-muted">{caption}</figcaption>}
    </figure>
  );
}

/** Two lines for a note: split near the middle, at a space. */
function splitNote(note: string): [string, string] {
  const mid = Math.floor(note.length / 2);
  const before = note.lastIndexOf(" ", mid), after = note.indexOf(" ", mid);
  const at = before === -1 ? after : after === -1 ? before : mid - before <= after - mid ? before : after;
  return at === -1 ? [note, ""] : [note.slice(0, at), note.slice(at + 1)];
}
