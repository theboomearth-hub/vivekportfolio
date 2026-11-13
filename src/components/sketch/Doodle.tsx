import { PARTS as STAGE_PARTS, type Part } from "@/components/sketch/StageDoodle";

/**
 * The site's doodle library: 48 × 48 line drawings in one hand (2px round strokes, slight wobble, one accent
 * stroke each). Includes the seven stage doodles. Decorative: pair each with text that says the same thing.
 */
const PARTS: Record<string, Part[]> = {
  ...STAGE_PARTS,
  // Challenge: a knot of competing needs
  tangle: [
    { d: "M8 30c4-14 18-20 26-10 6 8-4 18-12 12s0-18 10-16c8 1 10 10 6 16" },
    { d: "M6 38c10 2 26 2 36-2", accent: true },
  ],
  // Approach: a path with three moves
  approach: [
    { d: "M6 38c8 0 10-10 18-10s10-12 18-12" },
    { d: "M6 38a2 2 0 1 0 0.1 0M24 28a2 2 0 1 0 0.1 0" },
    { d: "M36 12l6 4-5 6", accent: true },
  ],
  // Impact: a rising line
  rise: [
    { d: "M6 40h36M8 40V8" },
    { d: "M12 34l8-8 6 4 12-14", accent: true },
    { d: "M32 16h6v6" },
  ],
  // A listing you can't trust
  doubt: [
    { d: "M6 22L24 8l18 14v20H6z" },
    { d: "M20 26c0-3 2-5 4-5s4 2 4 4c0 3-4 3-4 6", accent: true },
    { d: "M24 36v.5" },
  ],
  // Costs that surface late: a receipt that keeps going
  receipt: [
    { d: "M12 6h24v36l-4-3-4 3-4-3-4 3-4-3-4 3z" },
    { d: "M17 14h14M17 20h14M17 26h8" },
    { d: "M27 32h5", accent: true },
  ],
  // Weekends lost: a calendar with crossed days
  calendar: [
    { d: "M6 10h36v30H6zM6 18h36M15 6v8M33 6v8" },
    { d: "M12 24l6 6M18 24l-6 6M24 24l6 6M30 24l-6 6", accent: true },
  ],
  // Co-deciders left out: one person inside, one outside a dashed line
  apart: [
    { d: "M14 18a5 5 0 1 0 0.1 0M6 38c0-7 4-11 8-11s8 4 8 11" },
    { d: "M34 18a5 5 0 1 0 0.1 0M26 38c0-7 4-11 8-11s8 4 8 11", accent: true },
    { d: "M24 8v4M24 18v4M24 28v4M24 38v4" },
  ],
  // Six tools: scattered windows
  windows: [
    { d: "M4 6h14v10H4zM22 4h14v10H22zM30 20h14v10H30z" },
    { d: "M6 22h14v10H6zM16 34h14v10H16z" },
    { d: "M4 9h14M22 7h14", accent: true },
  ],
  // One conversation
  chat: [
    { d: "M6 8h26a4 4 0 0 1 4 4v12a4 4 0 0 1-4 4H18l-8 7v-7H6a4 4 0 0 1-4-4V12a4 4 0 0 1 4-4z" },
    { d: "M12 16h16M12 21h10", accent: true },
    { d: "M38 22h4a4 4 0 0 1 4 4v8l-5-4h-9" },
  ],
  // The stack of the craft
  code: [
    { d: "M16 14l-10 10 10 10M32 14l10 10-10 10" },
    { d: "M27 10l-6 28", accent: true },
  ],
  system: [
    { d: "M6 6h16v16H6zM26 6h16v16H26zM6 26h16v16H6z" },
    { d: "M26 26h16v16H26z", accent: true },
  ],
  ai: [
    { d: "M24 6c0 10 4 15 16 18-12 3-16 8-16 18 0-10-4-15-16-18 12-3 16-8 16-18z", accent: true },
    { d: "M38 6v6M35 9h6" },
  ],
  team: [
    { d: "M24 14a5 5 0 1 0 0.1 0M15 38c0-7 4-12 9-12s9 5 9 12" },
    { d: "M10 20a4 4 0 1 0 0.1 0M4 36c0-5 3-9 6-9M38 20a4 4 0 1 0 0.1 0M44 36c0-5-3-9-6-9", accent: true },
  ],
  // Talk: two speech bubbles
  talk: [
    { d: "M4 8h24v14H14l-6 6v-6H4z" },
    { d: "M20 26h24v14h-4v6l-6-6H20z", accent: true },
  ],
  // Accessibility: a person, arms open, in a circle
  access: [
    { d: "M24 4a20 20 0 1 0 0.1 0" },
    { d: "M24 11a2.5 2.5 0 1 0 0.1 0" },
    { d: "M13 18c7 2 15 2 22 0M24 20v9M24 29l-6 10M24 29l6 10", accent: true },
  ],
  // A hard no: a ring with a bar through it
  ban: [
    { d: "M24 6a18 18 0 1 0 0.1 0" },
    { d: "M11 11l26 26", accent: true },
  ],
  // A reply in time: a clock
  clock: [
    { d: "M24 6a18 18 0 1 0 0.1 0" },
    { d: "M24 14v10l7 5", accent: true },
  ],
};

export type DoodleName = keyof typeof PARTS;

export default function Doodle({ name, className = "h-12 w-12 text-foreground", i = 0, label }: { name: string; className?: string; i?: number; label?: string }) {
  const parts = PARTS[name] ?? PARTS.signal;
  return (
    <svg viewBox="0 0 48 48" className={className} fill="none" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} style={{ "--sk-i": i } as React.CSSProperties}>
      <g filter="url(#sk-wobble)">
        {parts.map((p, n) => (
          <path key={n} className={`sk-draw ${p.accent ? "stroke-accent" : "stroke-current"}`} pathLength={1} d={p.d} />
        ))}
      </g>
    </svg>
  );
}
