/**
 * The homepage thesis as a drawing: a tangle that straightens into one clean line.
 * Decorative (the headline says it in words). Draws once on load via `.sk-intro`,
 * and appears complete for anyone who prefers reduced motion.
 */
export default function HeroScribble({ className = "" }: { className?: string }) {
  return (
    <svg viewBox="0 0 420 260" className={className} fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <g filter="url(#sk-wobble)" strokeWidth="2.2">
        <path
          className="sk-intro stroke-foreground"
          pathLength={1}
          style={{ "--sk-i": 0 } as React.CSSProperties}
          d="M14 150C28 70 96 58 84 128S22 214 52 196 120 74 150 112 96 230 136 204 206 92 200 146 154 214 196 178 236 128 236 150"
        />
        <path className="sk-intro stroke-accent" pathLength={1} style={{ "--sk-i": 6 } as React.CSSProperties} d="M236 150C290 149 340 151 396 150" strokeWidth="2.6" />
        <path className="sk-intro stroke-accent" pathLength={1} style={{ "--sk-i": 9 } as React.CSSProperties} d="M384 138l13 12-13 12" strokeWidth="2.6" />
      </g>
      <text x="96" y="244" textAnchor="middle" className="fill-muted font-mono" fontSize="12" letterSpacing="0.08em">COMPLEX</text>
      <text x="320" y="178" textAnchor="middle" className="fill-accent font-mono" fontSize="12" letterSpacing="0.08em">SIMPLE</text>
    </svg>
  );
}
