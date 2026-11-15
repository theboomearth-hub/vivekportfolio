/**
 * "One robot, three paths": three breadcrumb trails (location, process, machine type) drawn converging on the same
 * object, WR-04. On phones the same thing reads as three short lists. Server component; drawn on with the sketch kit.
 */
import DrawOnView from "@/components/sketch/DrawOnView";

const ROWS = [
  { lens: "Location", who: "Operators · plant heads", crumbs: ["Pune plant", "Body shop", "Line 3"] },
  { lens: "Process", who: "Quality · process engineers", crumbs: ["Welding", "Pune plant", "Line 3"] },
  { lens: "Machine type", who: "Maintenance · reliability", crumbs: ["Robots", "Weld robots", "Pune plant"] },
];
const Y = [72, 190, 308];
const X0 = 224;
const GAP = 40;
const width = (t: string) => Math.round(t.length * 8.8 + 30);
const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

export default function ThreePaths() {
  const NODE = { x: 796, y: 190, w: 206, h: 72 };
  return (
    <>
      <DrawOnView className="hidden rounded-2xl bg-background p-4 ring-1 ring-border ring-inset md:block">
        <svg viewBox="0 0 1010 380" className="h-auto w-full" role="img" aria-label="Three paths, location, process and machine type, all end at the same weld robot WR-04">
          {ROWS.map((r, i) => {
            const y = Y[i];
            let x = X0;
            const chips = r.crumbs.map((c) => {
              const w = width(c);
              const chip = { c, x, w };
              x += w + GAP;
              return chip;
            });
            const end = chips.at(-1)!;
            const ex = end.x + end.w;
            return (
              <g key={r.lens} style={sk(i * 3)}>
                <text x="0" y={y - 6} fontSize="13" letterSpacing="1" className="font-mono fill-accent">{r.lens.toUpperCase()}</text>
                <text x="0" y={y + 16} fontSize="13" className="fill-muted">{r.who}</text>
                {chips.map((ch, k) => (
                  <g key={ch.c}>
                    <rect x={ch.x} y={y - 20} width={ch.w} height="40" rx="20" className="fill-surface stroke-border-strong" strokeWidth="1.2" />
                    <text x={ch.x + ch.w / 2} y={y + 5} textAnchor="middle" fontSize="15" className="fill-foreground">{ch.c}</text>
                    {k < chips.length - 1 && <path className="sk-draw stroke-muted" pathLength={1} d={`M${ch.x + ch.w + 8} ${y} h${GAP - 16}`} strokeWidth="1.6" />}
                  </g>
                ))}
                <path
                  className="sk-draw stroke-accent"
                  pathLength={1}
                  d={`M${ex + 6} ${y} C ${ex + 120} ${y}, ${NODE.x - 110} ${NODE.y + (i - 1) * 14}, ${NODE.x - 4} ${NODE.y + (i - 1) * 14}`}
                  fill="none"
                  strokeWidth="2"
                  style={sk(i * 3 + 2)}
                />
              </g>
            );
          })}
          <g style={sk(10)}>
            <rect x={NODE.x} y={NODE.y - NODE.h / 2} width={NODE.w} height={NODE.h} rx="16" className="fill-accent-light/60 stroke-accent" strokeWidth="2" filter="url(#sk-wobble)" />
            <text x={NODE.x + NODE.w / 2} y={NODE.y - 2} textAnchor="middle" fontSize="20" fontWeight="500" className="fill-foreground">Weld robot WR-04</text>
            <text x={NODE.x + NODE.w / 2} y={NODE.y + 20} textAnchor="middle" fontSize="13" className="fill-accent">one object, one URL</text>
          </g>
        </svg>
      </DrawOnView>
      <ol className="grid gap-3 md:hidden">
        {ROWS.map((r) => (
          <li key={r.lens} className="grid gap-1.5 rounded-xl bg-background p-4 ring-1 ring-border ring-inset">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{r.lens}</p>
            <p className="text-sm">{[...r.crumbs, "Weld robot WR-04"].join(" › ")}</p>
            <p className="text-caption text-muted">{r.who}</p>
          </li>
        ))}
      </ol>
    </>
  );
}
