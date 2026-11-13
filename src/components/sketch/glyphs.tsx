/**
 * Small hand-drawn glyphs used inside kit components: tick, half, cross, arrow, frown, spark.
 * Decorative (aria-hidden): the meaning is always also in text next to them.
 */
const base = { fill: "none", strokeWidth: 2.2, strokeLinecap: "round", strokeLinejoin: "round" } as const;
const sk = (i?: number) => (i === undefined ? undefined : ({ "--sk-i": i } as React.CSSProperties));

export function Tick({ className = "h-5 w-5 text-foreground", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...base} aria-hidden="true" style={sk(i)}>
      <path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" d="M4 13c3 2 5 4 6 6 2-6 6-11 10-14" />
    </svg>
  );
}

export function Half({ className = "h-5 w-5 text-muted", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...base} aria-hidden="true" style={sk(i)}>
      <g filter="url(#sk-wobble)">
        <path className="sk-draw" pathLength={1} d="M12 4a8 8 0 1 0 0 16 8 8 0 1 0 0-16z" />
        <path className="sk-draw" pathLength={1} d="M12 5v14M8 8l4 4M8 13l4 4" />
      </g>
    </svg>
  );
}

export function Cross({ className = "h-5 w-5 text-muted", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...base} aria-hidden="true" style={sk(i)}>
      <path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" d="M6 6c4 4 8 8 12 12M18 6C14 10 10 14 6 18" />
    </svg>
  );
}

/** A short sketched arrow pointing right (rotate with classes for down). */
export function SketchArrow({ className = "h-5 w-8 text-muted", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 40 20" className={className} stroke="currentColor" {...base} strokeWidth={1.8} aria-hidden="true" style={sk(i)}>
      <g filter="url(#sk-wobble)">
        <path className="sk-draw" pathLength={1} d="M3 11c10-3 20-3 32-1" />
        <path className="sk-draw" pathLength={1} d="M28 4l8 6-8 6" />
      </g>
    </svg>
  );
}

export function Frown({ className = "h-5 w-5 text-foreground", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...base} strokeWidth={1.8} aria-hidden="true" style={sk(i)}>
      <g filter="url(#sk-wobble)">
        <path className="sk-draw" pathLength={1} d="M12 3a9 9 0 1 0 0 18 9 9 0 1 0 0-18z" />
        <path className="sk-draw" pathLength={1} d="M8 17c2-2.5 6-2.5 8 0M9 9.5v.5M15 9.5v.5" />
      </g>
    </svg>
  );
}

export function Spark({ className = "h-5 w-5 text-accent", i }: { className?: string; i?: number }) {
  return (
    <svg viewBox="0 0 24 24" className={className} stroke="currentColor" {...base} strokeWidth={1.8} aria-hidden="true" style={sk(i)}>
      <path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" d="M12 3c0 5 2 8 9 9-7 1-9 4-9 9 0-5-2-8-9-9 7-1 9-4 9-9z" />
    </svg>
  );
}
