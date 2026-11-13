/**
 * Hand-drawn annotation marks: they point at the one thing that matters in a drawing.
 * Accent colour, slight wobble, and they draw themselves in inside <DrawOnView>.
 * Decorative: the point they make is always also said in text.
 */
type MarkProps = { className?: string; i?: number };

const markStyle = (i?: number) => (i === undefined ? undefined : ({ "--sk-i": i } as React.CSSProperties));

/** A curved arrow, drawn left to right; rotate or flip it with classes. */
export function ArrowMark({ className = "", i }: MarkProps) {
  return (
    <svg viewBox="0 0 80 40" className={`text-accent ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true" style={markStyle(i)}>
      <g filter="url(#sk-wobble)">
        <path className="sk-draw" pathLength={1} d="M4 32C18 12 40 6 70 12" />
        <path className="sk-draw" pathLength={1} d="M61 5l10 7-9 8" />
      </g>
    </svg>
  );
}

/** A loose hand-drawn ring, sized to whatever it surrounds. */
export function RingMark({ className = "", i }: MarkProps) {
  return (
    <svg viewBox="0 0 200 100" preserveAspectRatio="none" className={`text-accent ${className}`} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden="true" style={markStyle(i)}>
      <path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" vectorEffect="non-scaling-stroke" d="M30 14C70 0 160 2 186 26c18 18 4 52-38 64-46 12-118 6-138-22C-6 46 8 22 46 12" />
    </svg>
  );
}

/** A quick underline stroke. */
export function UnderlineMark({ className = "", i }: MarkProps) {
  return (
    <svg viewBox="0 0 200 12" preserveAspectRatio="none" className={`text-accent ${className}`} fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true" style={markStyle(i)}>
      <path className="sk-draw" pathLength={1} filter="url(#sk-wobble)" vectorEffect="non-scaling-stroke" d="M3 8C50 3 120 2 197 6" />
    </svg>
  );
}
