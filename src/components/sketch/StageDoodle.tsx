/**
 * Hand-drawn doodles for the seven stages of the method (src/lib/process/stages.ts), one per stage id.
 * 48 × 48, ink with one accent stroke each, wobble filter, and they draw in inside <DrawOnView>.
 */
export type Part = { d: string; accent?: boolean };

export const PARTS: Record<string, Part[]> = {
  // A signal: a source and its widening waves
  signal: [
    { d: "M11 37a3 3 0 1 0 6 0 3 3 0 1 0-6 0" },
    { d: "M14 27a10 10 0 0 1 10 10" },
    { d: "M14 19a18 18 0 0 1 18 18" },
    { d: "M14 11a26 26 0 0 1 26 26", accent: true },
  ],
  // The brief: one page, with a checked line
  prd: [
    { d: "M12 6h17l8 8v28H12z" },
    { d: "M29 6v8h8" },
    { d: "M17 21h14M17 27h14M17 33h7" },
    { d: "M27 34l3 3 6-7", accent: true },
  ],
  // Research: sticky notes and a magnifier
  research: [
    { d: "M6 8l15-1 1 15-15 1z" },
    { d: "M17 19l15 1-1 15-15-1z" },
    { d: "M30 33a7 7 0 1 0 14 0 7 7 0 1 0-14 0", accent: true },
    { d: "M42 39l4 4" },
  ],
  // Psychology: a head with an idea
  psychology: [
    { d: "M30 42v-6c5-2 8-6 8-12 0-9-7-16-15-16S8 15 8 24c0 5 2 9 6 11v7" },
    { d: "M23 16c-3 0-5 2-5 5 0 2 1 3 2 4v3h6v-3c1-1 2-2 2-4 0-3-2-5-5-5z", accent: true },
    { d: "M20 31h6" },
  ],
  // Architecture and flows: boxes, a decision and arrows
  flows: [
    { d: "M5 8h13v9H5zM30 8h13v9H30z" },
    { d: "M18 12.5h12M26 9.5l4 3-4 3" },
    { d: "M24 29l7 7-7 7-7-7z", accent: true },
    { d: "M11 17v6c0 4 3 6 6 9M37 17v6c0 4-3 6-6 9" },
  ],
  // UI and system: a browser and a phone
  ui: [
    { d: "M5 12h27v21H5z" },
    { d: "M5 17h27" },
    { d: "M28 18h13v25H28z", accent: true },
    { d: "M33 39h3" },
  ],
  // Validate, ship, loop: a paper plane looping back
  ship: [
    { d: "M5 22l36-15-11 31-7-12z" },
    { d: "M23 26L41 7" },
    { d: "M8 33c2 7 9 10 15 7", accent: true },
    { d: "M20 37l3 3-4 2" },
  ],
};

export default function StageDoodle({ id, className = "", i = 0 }: { id: string; className?: string; i?: number }) {
  const parts = PARTS[id] ?? PARTS.signal;
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={{ "--sk-i": i } as React.CSSProperties}>
      <g filter="url(#sk-wobble)">
        {parts.map((p, n) => (
          <path key={n} className={`sk-draw ${p.accent ? "stroke-accent" : "stroke-current"}`} pathLength={1} d={p.d} />
        ))}
      </g>
    </svg>
  );
}

/** Same doodle, as a group placed inside a larger SVG. */
export function StageDoodleGroup({ id, x, y, size = 48, i = 0 }: { id: string; x: number; y: number; size?: number; i?: number }) {
  const parts = PARTS[id] ?? PARTS.signal;
  const s = size / 48;
  return (
    <g transform={`translate(${x - size / 2} ${y - size / 2}) scale(${s})`} fill="none" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" style={{ "--sk-i": i } as React.CSSProperties} filter="url(#sk-wobble)">
      {parts.map((p, n) => (
        <path key={n} className={`sk-draw ${p.accent ? "stroke-accent" : "stroke-foreground"}`} pathLength={1} d={p.d} />
      ))}
    </g>
  );
}
