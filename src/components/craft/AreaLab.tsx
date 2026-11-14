"use client";

/**
 * Area lies, length doesn't (Stevens' power law; Cleveland & McGill). Set a circle to 2×, 3× and 4× the area of a
 * reference, then a bar to 2×, 3× and 4× the length. Perceived area grows slower than real area (exponent about 0.7),
 * so people overshoot circles; length is judged close to true (exponent about 1). Your own exponents are fitted:
 * if perceived = size^β and you set "k times", then set ratio = k^(1/β).
 */

import { useState } from "react";
import { shuffle } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, Plot, Readout, Stage, num } from "./kit";

type Kind = "area" | "length";
type Task = { kind: Kind; target: number };
type Result = Task & { set: number };

const MAX = { area: 8, length: 6 };
const REF_D = 56; // reference circle diameter, px
const REF_L = 40; // reference bar length, px
const toRatio = (v: number, kind: Kind) => 0.5 * (MAX[kind] / 0.5) ** (v / 1000);

function makeTasks(order: (xs: number[]) => number[] = shuffle): Task[] {
  return [...order([2, 4, 3]).map((t) => ({ kind: "area" as Kind, target: t })), ...order([3, 2, 4]).map((t) => ({ kind: "length" as Kind, target: t }))];
}

// The first run uses a fixed order, so the server and the browser render the same thing; restarts shuffle.
const FIRST = makeTasks((xs) => xs);

/** Fit set = target^(1/β) through the origin in log–log space; returns β. */
const exponent = (rs: Result[]) => {
  const num = rs.reduce((s, r) => s + Math.log(r.target) * Math.log(r.set), 0);
  const den = rs.reduce((s, r) => s + Math.log(r.target) ** 2, 0);
  return den && num ? den / num : NaN;
};

export default function AreaLab() {
  const [tasks, setTasks] = useState<Task[]>(FIRST);
  const [i, setI] = useState(0);
  const [v, setV] = useState(300);
  const [phase, setPhase] = useState<"run" | "done">("run");
  const [results, setResults] = useState<Result[]>([]);
  const cur = tasks[i];
  const ratio = cur ? toRatio(v, cur.kind) : 1;

  const next = () => {
    if (!cur) return;
    const rs = [...results, { ...cur, set: ratio }];
    setResults(rs);
    setV(300);
    if (i + 1 >= tasks.length) setPhase("done");
    else setI(i + 1);
  };

  const restart = () => {
    setTasks(makeTasks());
    setI(0);
    setResults([]);
    setV(300);
    setPhase("run");
  };

  const area = results.filter((r) => r.kind === "area");
  const length = results.filter((r) => r.kind === "length");
  const bA = exponent(area);
  const bL = exponent(length);

  const status = phase === "done" ? "Done. Six judgements." : `Judgement ${i + 1} of 6 · ${cur.kind === "area" ? `make the right circle ${cur.target}× the area` : `make the lower bar ${cur.target}× the length`}`;

  return (
    <LabFrame status={status} actions={results.length > 0 && <Btn kind="ghost" onClick={restart}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Stage className="grid min-h-[380px] content-center gap-6 border-b border-border p-6 lg:border-r lg:border-b-0">
          {phase === "run" && cur ? (
            <>
              <p className="text-center text-lg">
                {cur.kind === "area" ? <>Make the right circle <b className="font-medium">{cur.target}×</b> the area of the left one.</> : <>Make the lower bar <b className="font-medium">{cur.target}×</b> as long as the upper one.</>}
              </p>
              <div className="grid h-[180px] place-items-center" aria-hidden="true">
                {cur.kind === "area" ? (
                  <div className="flex items-center gap-10">
                    <span className="rounded-full bg-foreground" style={{ width: REF_D, height: REF_D }} />
                    <span className="rounded-full bg-accent" style={{ width: REF_D * Math.sqrt(ratio), height: REF_D * Math.sqrt(ratio) }} />
                  </div>
                ) : (
                  <div className="grid w-full max-w-[280px] gap-4">
                    <span className="h-4 rounded-r-[4px] bg-foreground" style={{ width: REF_L }} />
                    <span className="h-4 rounded-r-[4px] bg-accent" style={{ width: REF_L * ratio }} />
                  </div>
                )}
              </div>
              <div className="mx-auto grid w-full max-w-[340px] gap-3">
                <label htmlFor="area-slider" className="text-sm text-muted">{cur.kind === "area" ? "Size of the right circle" : "Length of the lower bar"}</label>
                <input id="area-slider" type="range" min={0} max={1000} value={v} onChange={(e) => setV(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" aria-valuetext="Adjust until it looks right" />
                <Btn onClick={next} className="justify-self-center">That&apos;s {cur.target}×</Btn>
              </div>
            </>
          ) : (
            <div className="grid gap-5">
              <p className="text-center text-lg">The same four numbers, 10, 20, 30 and 40.</p>
              <div className="grid grid-cols-2 items-end gap-6" aria-label="The values 10, 20, 30 and 40 drawn as circles and as bars" role="img">
                <div className="flex items-end justify-center gap-2">
                  {[10, 20, 30, 40].map((n) => <span key={n} className="rounded-full bg-accent" style={{ width: 16 * Math.sqrt(n / 2.5), height: 16 * Math.sqrt(n / 2.5) }} />)}
                </div>
                <div className="flex h-[110px] items-end justify-center gap-2">
                  {[10, 20, 30, 40].map((n) => <span key={n} className="w-6 rounded-t-[4px] bg-accent" style={{ height: n * 2.6 }} />)}
                </div>
              </div>
              <p className="text-center text-compact text-muted">Circles sized by area make 40 look about 2.6× 10, not 4×. Bars make it obvious.</p>
            </div>
          )}
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`What you set against what was asked. ${area.length} area and ${length.length} length judgements.`}
            yLabel="What you set (×)"
            xLabel="What was asked (×)"
            x={[1, 4.5]}
            y={[0, 8]}
            xTicks={[1, 2, 3, 4]}
            yTicks={[0, 2, 4, 6, 8]}
            xFormat={(n) => `${n}×`}
            yFormat={(n) => `${n}×`}
            legend={[{ name: "Circle area", tone: "accent", kind: "dot" }, { name: "Bar length", tone: "base", kind: "hollow" }, { name: "Exactly right", tone: "base", kind: "dash" }]}
            lines={[{ name: "Exactly right", tone: "base", dashed: true, pts: [{ x: 1, y: 1 }, { x: 4.5, y: 4.5 }] }]}
            dots={[{ name: "Circle area", tone: "accent", pts: area.map((r) => ({ x: r.target - 0.05, y: r.set })) }, { name: "Bar length", tone: "base", hollow: true, pts: length.map((r) => ({ x: r.target + 0.05, y: r.set })) }]}
            empty="Your settings plot here"
            table={{ caption: "Your judgements", head: ["Shape", "Asked", "You set"], rows: results.map((r) => [r.kind === "area" ? "Circle area" : "Bar length", `${r.target}×`, `${r.set.toFixed(2)}×`]) }}
          />
          {phase === "done" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Readout value={Number.isFinite(bA) ? num(bA) : "–"} label="your exponent for area" note="Stevens: about 0.7. Under 1 means you overshoot." />
              <Readout value={Number.isFinite(bL) ? num(bL) : "–"} label="your exponent for length" note="Stevens: about 1.0, close to true" />
            </div>
          ) : (
            <LabNote>Uses a slider, so it works with the keyboard (arrow keys). The slider has no numbers on purpose.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
