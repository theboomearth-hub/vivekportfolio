import DrawOnView from "@/components/sketch/DrawOnView";
import StageDoodle, { StageDoodleGroup } from "@/components/sketch/StageDoodle";

type Stage = { num: string; id: string; title: string; eyebrow: string; gate: string[] };

const CX = 500, CY = 322, RX = 330, RY = 200, R = 46, GAP = 0.21;
const at = (t: number) => ({ x: CX + RX * Math.cos(t), y: CY + RY * Math.sin(t) });
const f = (n: number) => Math.round(n * 10) / 10;

/**
 * Labels longer than 14 characters go on two lines: "Signal & Framing" → ["Signal", "& Framing"],
 * "Validate, Ship, Loop" → ["Validate,", "Ship, Loop"], "Psychology Mapping" → ["Psychology", "Mapping"].
 */
function lines(title: string): string[] {
  if (title.length <= 14) return [title];
  if (title.includes(" & ")) { const [a, b] = title.split(" & "); return [a, `& ${b}`]; }
  const comma = title.indexOf(", ");
  if (comma > 0) return [title.slice(0, comma + 1), title.slice(comma + 2)];
  const space = title.lastIndexOf(" ", Math.ceil(title.length / 2) + 2);
  return space > 0 ? [title.slice(0, space), title.slice(space + 1)] : [title];
}

/**
 * The method as one loop: seven stages, a gate where each one ends, and the last stage feeding the next
 * signal. SVG from md up; an ordered list on phones. Stage sections on the page carry the detail.
 */
export default function ProcessLoop({ stages }: { stages: Stage[] }) {
  const n = stages.length;
  const t = stages.map((_, i) => Math.PI + (i * 2 * Math.PI) / n);
  const nodes = t.map(at);

  return (
    <figure className="m-0">
      <DrawOnView className="hidden md:block">
        <svg viewBox="0 0 1000 640" className="h-auto w-full text-foreground" role="img" aria-label={`The method as a loop of ${n} stages: ${stages.map((s) => s.title).join(", ")}. Each stage ends at a written exit gate, and the last stage feeds the next signal.`}>
          {/* Arcs between stages, each with its exit gate */}
          {t.map((t1, i) => {
            const t2 = i === n - 1 ? t[0] + 2 * Math.PI : t[i + 1];
            const a = at(t1 + GAP), b = at(t2 - GAP), g = at((t1 + t2) / 2);
            const tx = -RX * Math.sin(t2 - GAP), ty = RY * Math.cos(t2 - GAP), len = Math.hypot(tx, ty);
            const ux = tx / len, uy = ty / len;
            const h1 = `${f(b.x - 11 * ux + 6 * uy)} ${f(b.y - 11 * uy - 6 * ux)}`, h2 = `${f(b.x - 11 * ux - 6 * uy)} ${f(b.y - 11 * uy + 6 * ux)}`;
            const loop = i === n - 1;
            return (
              <g key={i} style={{ "--sk-i": i } as React.CSSProperties}>
                <g fill="none" className={loop ? "stroke-accent" : "stroke-foreground"} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" filter="url(#sk-wobble)">
                  <path className="sk-draw" pathLength={1} d={`M${f(a.x)} ${f(a.y)}A${RX} ${RY} 0 0 1 ${f(b.x)} ${f(b.y)}`} />
                  <path className="sk-draw" pathLength={1} d={`M${h1}L${f(b.x)} ${f(b.y)}L${h2}`} />
                </g>
                {!loop && <path className="sk-fade fill-background stroke-accent" strokeWidth="1.6" d={`M${f(g.x)} ${f(g.y - 8)}l8 8-8 8-8-8z`} />}
              </g>
            );
          })}

          {/* Stages */}
          {stages.map((s, i) => {
            const p = nodes[i];
            const c = Math.cos(t[i]), sn = Math.sin(t[i]);
            const side = c < -0.5 ? "end" : c > 0.5 ? "start" : "middle";
            const ax = p.x + c * (R + 22), ay = p.y + sn * (R + 22);
            const ls = lines(s.title);
            const above = sn < -0.4, below = sn > 0.4;
            const firstY = above ? ay - 16 * ls.length - 6 : below ? ay + 14 : ay - (16 * (ls.length + 1)) / 2 + 12;
            return (
              <g key={s.id} className="sk-fade" style={{ "--sk-i": i } as React.CSSProperties}>
                <circle cx={f(p.x)} cy={f(p.y)} r={R} className="fill-background stroke-foreground" strokeWidth="1.6" filter="url(#sk-wobble)" />
                <StageDoodleGroup id={s.id} x={p.x} y={p.y} size={52} i={i} />
                <text x={f(ax)} y={f(firstY)} textAnchor={side} className="fill-accent font-mono" fontSize="12" letterSpacing="0.06em">{s.num}</text>
                {ls.map((l, k) => (
                  <text key={k} x={f(ax)} y={f(firstY + 17 + k * 17)} textAnchor={side} className="fill-foreground" fontSize="15">{l}</text>
                ))}
              </g>
            );
          })}

          {/* Centre and loop notes */}
          <text x={CX} y={CY - 8} textAnchor="middle" className="fill-foreground" fontSize="20" letterSpacing="-0.02em">{n} stages,</text>
          <text x={CX} y={CY + 18} textAnchor="middle" className="fill-foreground" fontSize="20" letterSpacing="-0.02em">each ends at a written gate</text>
          <g className="sk-fade" style={{ "--sk-i": n } as React.CSSProperties}>
            <path d={`M${CX - 70} ${CY + 52}l7 7-7 7-7-7z`} className="fill-background stroke-accent" strokeWidth="1.6" />
            <text x={CX - 54} y={CY + 64} className="fill-muted" fontSize="13">exit gate: checks that must hold to go on</text>
            <text x={nodes[n - 1].x + 60} y={nodes[n - 1].y - 64} className="fill-accent" fontSize="13">results feed the next signal</text>
          </g>
        </svg>
      </DrawOnView>

      <ol className="grid gap-5 md:hidden">
        {stages.map((s, i) => (
          <li key={s.id}>
            <a href={`#stage-${s.id}`} className="grid grid-cols-[48px_minmax(0,1fr)] items-center gap-4">
              <StageDoodle id={s.id} className="h-12 w-12 text-foreground" i={i} />
              <span>
                <span className="block font-mono text-xs tracking-[0.06em] text-accent">{s.num}</span>
                <span className="block">{s.title}</span>
                <span className="block text-caption text-muted">{s.eyebrow} · {s.gate.length} exit checks</span>
              </span>
            </a>
          </li>
        ))}
      </ol>
    </figure>
  );
}
