/**
 * Hero drawing for Takt: body shop Line 3 at Pune, four weld robots on a conveyor, WR-04 in the accent with its
 * motor shaking and its signal's standard name called out. Drawn on (sketch kit), decorative; the text says it all.
 */
import DrawOnView from "@/components/sketch/DrawOnView";

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

function Robot({ x, accent, i, label }: { x: number; accent?: boolean; i: number; label: string }) {
  const stroke = accent ? "stroke-accent" : "stroke-foreground";
  return (
    <g style={sk(i)}>
      {/* base, shoulder, upper arm, forearm, torch */}
      <path className={`sk-draw ${stroke}`} pathLength={1} d={`M${x - 26} 226 h52 l-8 -22 h-36 z`} fill="none" strokeWidth="2.2" />
      <path className={`sk-draw ${stroke}`} pathLength={1} d={`M${x} 204 V178`} strokeWidth="2.2" />
      <path className={`sk-draw ${stroke}`} pathLength={1} d={`M${x} 178 L${x + 42} 128`} strokeWidth="6" strokeLinecap="round" />
      <path className={`sk-draw ${stroke}`} pathLength={1} d={`M${x + 42} 128 L${x + 92} 150`} strokeWidth="5" strokeLinecap="round" />
      <path className={`sk-draw ${stroke}`} pathLength={1} d={`M${x + 92} 150 L${x + 98} 192`} strokeWidth="2.5" strokeLinecap="round" />
      <circle cx={x} cy={178} r="7" className={accent ? "fill-accent" : "fill-foreground"} />
      <circle cx={x + 42} cy={128} r="8" className={accent ? "fill-accent" : "fill-foreground"} />
      {accent && (
        <>
          <circle cx={x + 42} cy={128} r="16" className="takt-pulse fill-none stroke-accent" strokeWidth="2" />
          <path className="sk-draw stroke-accent" pathLength={1} d={`M${x + 18} 104 q4 -6 8 0 t8 0 t8 0 t8 0`} fill="none" strokeWidth="2" strokeLinecap="round" />
        </>
      )}
      <text x={x} y={262} textAnchor="middle" fontSize="15" className={`font-mono ${accent ? "fill-accent" : "fill-muted"}`}>{label}</text>
    </g>
  );
}

export default function LineScene() {
  return (
    <DrawOnView className="hidden overflow-hidden rounded-2xl bg-surface ring-1 ring-border ring-inset sm:block">
      <svg viewBox="0 0 1200 300" className="h-auto w-full" role="img" aria-label="Drawing of body shop Line 3: four weld robots on a conveyor; robot WR-04's axis-2 motor is vibrating, and its signal is named PUN.BDY.L3.WR04.AX2M.VIB_RMS">
        <defs>
          <pattern id="takt-dots" width="22" height="22" patternUnits="userSpaceOnUse"><circle cx="1" cy="1" r="1" className="fill-border-strong" /></pattern>
        </defs>
        <rect width="1200" height="300" fill="url(#takt-dots)" opacity="0.5" />
        <text x="40" y="44" fontSize="16" className="fill-muted">Kaveri Auto Parts  ›  Pune plant  ›  Body shop  ›  <tspan className="fill-foreground">Line 3</tspan></text>

        {/* conveyor with rollers and parts in transit */}
        <g style={sk(0)}>
          <path className="sk-draw stroke-foreground" pathLength={1} d="M40 226 H1160 M40 240 H1160" strokeWidth="2" filter="url(#sk-wobble)" />
          {Array.from({ length: 28 }, (_, k) => <circle key={k} cx={60 + k * 40} cy={233} r="4" className="fill-none stroke-border-strong" strokeWidth="1.5" />)}
          {[120, 330, 560, 790].map((x) => <rect key={x} x={x} y={212} width="34" height="14" rx="2" className="fill-background stroke-foreground" strokeWidth="1.5" />)}
        </g>
        <Robot x={210} i={1} label="WR-01" />
        <Robot x={430} i={2} label="WR-02" />
        <Robot x={650} i={3} label="WR-03" />
        <Robot x={870} i={4} accent label="WR-04" />

        {/* callout to the signal */}
        <g style={sk(6)}>
          <path className="sk-draw stroke-accent" pathLength={1} d="M930 112 C 950 82, 966 76, 978 76" fill="none" strokeWidth="1.8" strokeDasharray="4 4" />
          <rect x="978" y="52" width="204" height="54" rx="10" className="fill-background stroke-accent" strokeWidth="1.5" />
          <text x="990" y="74" fontSize="12.5" className="font-mono fill-accent">…WR04.AX2M.VIB_RMS</text>
          <text x="990" y="94" fontSize="13" className="fill-foreground">4.6 mm/s · above normal</text>
        </g>
      </svg>
    </DrawOnView>
  );
}
