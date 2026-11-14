"use client";

/**
 * Pop-out search (feature integration theory). Find the blue circle among 4–32 shapes.
 * Colour only: the distractors are grey circles, and the target pops out at any count.
 * Colour and shape: the distractors are blue squares and grey circles, so the target shares a feature with every
 * distractor and you have to check them, so time climbs with each item. Slopes are fitted to your own data.
 */

import { useEffect, useRef, useState } from "react";
import { linreg, shuffle } from "@/lib/craft/stats";
import { BASE, Btn, LabFrame, LabNote, Plot, Readout, Stage, ms } from "./kit";

type Cond = "feature" | "conjunction";
type Item = { cell: number; kind: "target" | "circle" | "square" };
type Plan = { n: number; cond: Cond; items: Item[] };
type Result = { n: number; cond: Cond; rt: number; errors: number };

const COLS = 8;
const ROWS = 5;
const SIZES = [4, 8, 16, 32];

function build(n: number, cond: Cond): Item[] {
  const cells = shuffle(Array.from({ length: COLS * ROWS }, (_, k) => k)).slice(0, n);
  return cells.map((cell, k) => ({ cell, kind: k === 0 ? "target" : cond === "feature" ? "circle" : k % 2 ? "square" : "circle" }));
}

function makePlan(): Plan[] {
  const out: Plan[] = [];
  for (const cond of ["feature", "conjunction"] as Cond[]) for (const n of SIZES) for (let r = 0; r < 2; r++) out.push({ n, cond, items: build(n, cond) });
  return shuffle(out);
}

export default function PopOutLab() {
  const [plan, setPlan] = useState<Plan[]>([]);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"idle" | "ready" | "show" | "done">("idle");
  const [results, setResults] = useState<Result[]>([]);
  const [errors, setErrors] = useState(0);
  const t0 = useRef(0);
  const cur = plan[i];

  useEffect(() => {
    if (phase !== "show") return;
    const id = requestAnimationFrame(() => (t0.current = performance.now()));
    return () => cancelAnimationFrame(id);
  }, [phase, i]);

  const start = () => {
    setPlan(makePlan());
    setI(0);
    setResults([]);
    setErrors(0);
    setPhase("ready");
  };

  const hit = (it: Item) => {
    if (phase !== "show" || !cur) return;
    if (it.kind !== "target") {
      setErrors((e) => e + 1);
      return;
    }
    setResults((rs) => [...rs, { n: cur.n, cond: cur.cond, rt: performance.now() - t0.current, errors }]);
    setErrors(0);
    if (i + 1 >= plan.length) setPhase("done");
    else {
      setI(i + 1);
      setPhase("ready");
    }
  };

  const feat = results.filter((r) => r.cond === "feature");
  const conj = results.filter((r) => r.cond === "conjunction");
  const fF = linreg(feat.map((r) => r.n), feat.map((r) => r.rt));
  const fC = linreg(conj.map((r) => r.n), conj.map((r) => r.rt));
  const line = (f: { a: number; b: number }) => (Number.isFinite(f.b) ? [{ x: 4, y: f.a + f.b * 4 }, { x: 32, y: f.a + f.b * 32 }] : []);
  const yMax = Math.max(1600, ...results.map((r) => r.rt * 1.1));

  const status =
    phase === "idle" ? "Find the blue circle. 16 screens, under a minute."
    : phase === "done" ? `Done. ${results.length} screens.`
    : `Screen ${i + 1} of ${plan.length} · ${cur?.n} shapes · ${cur?.cond === "feature" ? "colour only" : "colour and shape"}`;

  return (
    <LabFrame status={status} actions={results.length > 0 && <Btn kind="ghost" onClick={start}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Stage className="relative min-h-[340px] border-b border-border p-4 lg:min-h-[420px] lg:border-r lg:border-b-0">
          {(phase === "idle" || phase === "ready") && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="grid max-w-[34ch] justify-items-center gap-4">
                <span className="flex items-center gap-2 text-compact text-muted">
                  Target
                  <svg width="22" height="22" aria-hidden="true"><circle cx="11" cy="11" r="9" fill="var(--color-accent)" /></svg>
                </span>
                {phase === "idle" ? <p className="text-compact text-muted">Click it the moment you see it. Some screens hide it among blue squares too.</p> : <p className="text-compact text-muted">Next: {cur?.n} shapes.</p>}
                <Btn onClick={() => (phase === "idle" ? start() : setPhase("show"))}>{phase === "idle" ? "Start" : "Show the shapes"}</Btn>
              </div>
            </div>
          )}
          {phase === "show" && cur && (
            <div className="grid h-full min-h-[300px] gap-1" style={{ gridTemplateColumns: `repeat(${COLS}, minmax(0, 1fr))`, gridTemplateRows: `repeat(${ROWS}, minmax(0, 1fr))` }}>
              {Array.from({ length: COLS * ROWS }, (_, cell) => {
                const it = cur.items.find((x) => x.cell === cell);
                if (!it) return <span key={cell} />;
                const blue = it.kind === "target" || it.kind === "square";
                const jx = ((cell * 37) % 11) - 5;
                const jy = ((cell * 53) % 9) - 4;
                return (
                  <button key={cell} type="button" onClick={() => hit(it)} aria-label={it.kind === "target" ? "Blue circle" : it.kind === "square" ? "Blue square" : "Grey circle"} className="grid place-items-center rounded-md focus-visible:ring-2 focus-visible:ring-accent">
                    <svg width="26" height="26" aria-hidden="true" style={{ transform: `translate(${jx}px, ${jy}px)` }}>
                      {it.kind === "square" ? <rect x="4" y="4" width="18" height="18" rx="2" fill="var(--color-accent)" /> : <circle cx="13" cy="13" r="10" fill={blue ? "var(--color-accent)" : BASE} />}
                    </svg>
                  </button>
                );
              })}
            </div>
          )}
          {phase === "done" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <p className="max-w-[34ch] text-lg">
                Colour only: {Number.isFinite(fF.b) ? ms(fF.b) : "–"} per extra shape. Colour and shape: {Number.isFinite(fC.b) ? ms(fC.b) : "–"} per extra shape.
              </p>
            </div>
          )}
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Search time against number of shapes. ${feat.length} colour-only and ${conj.length} colour-and-shape screens.`}
            yLabel="Time to find"
            xLabel="Shapes on screen"
            x={[0, 34]}
            y={[0, yMax]}
            xTicks={[4, 8, 16, 32]}
            yFormat={ms}
            legend={[{ name: "Colour only", tone: "accent", kind: "dot" }, { name: "Colour and shape", tone: "base", kind: "hollow" }]}
            dots={[{ name: "Colour only", tone: "accent", pts: feat.map((r) => ({ x: r.n - 0.4, y: r.rt })) }, { name: "Colour and shape", tone: "base", hollow: true, pts: conj.map((r) => ({ x: r.n + 0.4, y: r.rt })) }]}
            lines={[{ name: "Colour only fit", tone: "accent", pts: feat.length >= 4 ? line(fF) : [] }, { name: "Colour and shape fit", tone: "base", dashed: true, pts: conj.length >= 4 ? line(fC) : [] }]}
            empty="Your searches plot here"
            table={{ caption: "Your searches", head: ["Condition", "Shapes", "Time ms", "Wrong clicks"], rows: results.map((r) => [r.cond === "feature" ? "Colour only" : "Colour and shape", r.n, Math.round(r.rt), r.errors]) }}
          />
          {feat.length >= 4 && conj.length >= 4 ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Readout value={ms(fF.b)} label="per shape, colour only" note="Close to flat: it pops out" />
              <Readout value={ms(fC.b)} label="per shape, colour and shape" note="Each one has to be checked" />
            </div>
          ) : (
            <LabNote>Pointing adds the same time to every screen, so the slopes still compare fairly. Each shape is also a button with a name, for screen readers.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
