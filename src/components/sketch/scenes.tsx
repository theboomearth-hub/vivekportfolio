import DrawOnView from "@/components/sketch/DrawOnView";

/**
 * Hero scenes for the research pages: one drawing that states the idea before any words.
 * Decorative (aria-hidden); each page's headline says the same thing in text.
 */
const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

/** Forma: one interface for everyone becomes one interface per person. */
export function FormaScene({ className = "" }: { className?: string }) {
  const same = [0, 1, 2, 3];
  return (
    <DrawOnView className={className}>
      <svg viewBox="0 0 560 240" className="h-auto w-full text-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g filter="url(#sk-wobble)" strokeWidth="1.8">
          {/* Today: the same screen, four times */}
          {same.map((i) => (
            <g key={i} transform={`translate(${16 + (i % 2) * 96} ${24 + Math.floor(i / 2) * 100})`} style={sk(i)}>
              <rect className="sk-draw stroke-foreground" pathLength={1} width="80" height="80" rx="8" />
              <path className="sk-draw stroke-muted" pathLength={1} d="M10 18h60M10 34h60M10 50h60M10 66h40" />
            </g>
          ))}
          {/* The manifest and compiler in the middle */}
          <path className="sk-draw stroke-accent" pathLength={1} style={sk(4)} d="M212 120c22-2 40-2 62 0M264 110l12 10-12 10" strokeWidth="2.2" />
          {/* With Forma: each person's own layout */}
          <g transform="translate(300 24)" style={sk(5)}>
            <rect className="sk-draw stroke-foreground" pathLength={1} width="80" height="80" rx="8" />
            <path className="sk-draw stroke-accent" pathLength={1} d="M10 14h16v52H10zM34 14h16v36H34zM58 14h12v20H58z" />
          </g>
          <g transform="translate(396 24)" style={sk(6)}>
            <rect className="sk-draw stroke-foreground" pathLength={1} width="80" height="80" rx="8" />
            <path className="sk-draw stroke-accent" pathLength={1} d="M12 60l14-18 12 8 14-20 14 12" />
            <path className="sk-draw stroke-muted" pathLength={1} d="M10 70h60" />
          </g>
          <g transform="translate(300 124)" style={sk(7)}>
            <rect className="sk-draw stroke-foreground" pathLength={1} width="80" height="80" rx="8" />
            <path className="sk-draw stroke-accent" pathLength={1} d="M40 18a22 22 0 1 0 0.1 0M40 18v22l18 10" />
          </g>
          <g transform="translate(396 124)" style={sk(8)}>
            <rect className="sk-draw stroke-foreground" pathLength={1} width="80" height="80" rx="8" />
            <path className="sk-draw stroke-accent" pathLength={1} d="M10 14h26v26H10zM44 14h26v26H44zM10 48h60v18H10z" />
          </g>
        </g>
        <text x="104" y="226" textAnchor="middle" className="fill-muted font-mono" fontSize="11" letterSpacing="0.08em">ONE INTERFACE FOR ALL</text>
        <text x="438" y="226" textAnchor="middle" className="fill-accent font-mono" fontSize="11" letterSpacing="0.08em">ONE PER PERSON</text>
      </svg>
    </DrawOnView>
  );
}

/** Lokul: the 200-metre radius, with the neighbourhood inside it. */
export function RadiusScene({ className = "" }: { className?: string }) {
  return (
    <DrawOnView className={className}>
      <svg viewBox="0 0 420 300" className="h-auto w-full text-foreground" fill="none" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
        <g filter="url(#sk-wobble)" strokeWidth="1.8">
          <circle className="sk-draw stroke-border-strong" pathLength={1} style={sk(0)} cx="210" cy="150" r="138" strokeDasharray="5 7" />
          <circle className="sk-draw stroke-muted" pathLength={1} style={sk(1)} cx="210" cy="150" r="96" />
          <circle className="sk-draw fill-accent-light/50 stroke-accent" pathLength={1} style={sk(2)} cx="210" cy="150" r="54" strokeWidth="2.2" />
          {/* You, at the centre */}
          <path className="sk-draw stroke-accent" pathLength={1} style={sk(3)} d="M210 128c-9 0-15 6-15 14 0 11 15 24 15 24s15-13 15-24c0-8-6-14-15-14zM210 138a3 3 0 1 0 0.1 0" strokeWidth="2.2" />
          {/* The neighbourhood: a kirana, a home kitchen, a coach, a neighbour */}
          <path className="sk-draw stroke-foreground" pathLength={1} style={sk(4)} d="M150 92h30v22h-30zM146 92l8-10h22l8 10M160 114v-8h10v8" />
          <path className="sk-draw stroke-foreground" pathLength={1} style={sk(5)} d="M252 182h28M256 182c0 10 6 16 10 16s10-6 10-16M262 174c0-4 4-4 4-8M270 174c0-4 4-4 4-8" />
          <path className="sk-draw stroke-foreground" pathLength={1} style={sk(6)} d="M262 92h6M264 89v6M286 92h6M288 89v6M268 92h18" />
          <path className="sk-draw stroke-foreground" pathLength={1} style={sk(7)} d="M150 200a5 5 0 1 0 0.1 0M142 220c0-6 4-10 8-10s8 4 8 10" />
        </g>
        <text x="210" y="216" textAnchor="middle" className="fill-accent font-mono" fontSize="11" letterSpacing="0.08em">200 M</text>
        <text x="210" y="262" textAnchor="middle" className="fill-muted font-mono" fontSize="11" letterSpacing="0.08em">500 M</text>
        <text x="210" y="296" textAnchor="middle" className="fill-muted font-mono" fontSize="11" letterSpacing="0.08em">2 KM, BY CHOICE</text>
      </svg>
    </DrawOnView>
  );
}
