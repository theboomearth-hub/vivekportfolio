"use client";

/**
 * The night's vibration on WR-04's axis-2 motor, 00:30 to 03:40: normal, then a creeping drift from 01:40 that Takt
 * flags at 01:52, the stop at 02:14, and a quiet new motor after the 03:10 restart. Scenario data, drawn with the
 * site's chart (accent line, grey normal band, labelled events, a table underneath).
 */
import { Plot } from "@/components/craft/kit";

const START = 30; // 00:30, in minutes after midnight
const hhmm = (min: number) => { const t = START + min; return `${String(Math.floor(t / 60)).padStart(2, "0")}:${String(t % 60).padStart(2, "0")}`; };
const wobble = (m: number) => 0.18 * Math.sin(m / 3.1) + 0.1 * Math.sin(m / 1.7);

const before: { x: number; y: number }[] = [];
for (let m = 0; m <= 103; m += 2) {
  const drift = m > 70 ? ((m - 70) / 33) ** 1.6 * 2.9 : 0;
  before.push({ x: m, y: Number((1.85 + wobble(m) + drift).toFixed(2)) });
}
const after: { x: number; y: number }[] = [];
for (let m = 160; m <= 190; m += 2) after.push({ x: m, y: Number((1.55 + wobble(m) * 0.8).toFixed(2)) });

export default function NightTrend() {
  return (
    <div className="rounded-2xl bg-background p-4 ring-1 ring-border ring-inset sm:p-5">
      <Plot
        label="Vibration on WR-04's axis-2 motor overnight: inside its normal band until 01:40, drifting above it, flagged at 01:52, stopped at 02:14, and back in the band after the restart at 03:10."
        yLabel="Vibration, mm/s RMS · WR-04 axis-2 motor"
        xLabel="Night shift, 14 November (scenario)"
        x={[0, 190]}
        y={[0, 6]}
        xTicks={[0, 30, 60, 90, 120, 150, 180]}
        yTicks={[0, 2, 4, 6]}
        xFormat={hhmm}
        height={280}
        bands={[{ y0: 1.2, y1: 2.8, label: "Normal band" }]}
        vlines={[{ x: 82, label: "01:52 watch flag" }, { x: 104, label: "02:14 line stops" }, { x: 160, label: "03:10 restart" }]}
        legend={[{ name: "Old motor", tone: "accent", kind: "line" }, { name: "New motor", tone: "base", kind: "dash" }]}
        lines={[{ name: "Old motor", tone: "accent", pts: before }, { name: "New motor", tone: "base", dashed: true, pts: after }]}
        table={{ caption: "Vibration readings every 10 minutes", head: ["Time", "mm/s RMS"], rows: [...before, ...after].filter((p) => p.x % 10 === 0).map((p) => [hhmm(p.x), p.y]) }}
      />
    </div>
  );
}
