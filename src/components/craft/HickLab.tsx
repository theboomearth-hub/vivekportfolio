"use client";

/**
 * Hick's law vs searching. Pick a named item from menus of 2, 4, 8 and 16 options, sorted A–Z or shuffled.
 * When you can predict where an item is (sorted), time grows with log2(n + 1); when you have to look (shuffled),
 * it grows with every item, in a straight line. Both models are fitted to your own data.
 */

import { useEffect, useRef, useState } from "react";
import { linreg, median, shuffle } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, Plot, Readout, Stage, ms } from "./kit";

/** Event-time clock (only ever called from handlers, never during render). */
const clock = () => performance.now();

const CITIES = ["Agra", "Bhopal", "Chennai", "Delhi", "Goa", "Indore", "Jaipur", "Kochi", "Lucknow", "Mumbai", "Mysuru", "Nagpur", "Patna", "Pune", "Shimla", "Surat"];
const SIZES = [2, 4, 8, 16];
type Order = "sorted" | "shuffled";
type Plan = { n: number; order: Order; items: string[]; target: string };
type Result = Plan & { rt: number; errors: number };

function makePlan(): Plan[] {
  const plans: Plan[] = [];
  for (const order of ["sorted", "shuffled"] as Order[]) {
    for (const n of SIZES) {
      for (let rep = 0; rep < 2; rep++) {
        const pick = shuffle(CITIES).slice(0, n);
        const items = order === "sorted" ? [...pick].sort() : shuffle(pick);
        plans.push({ n, order, items, target: pick[Math.floor(Math.random() * n)] });
      }
    }
  }
  return shuffle(plans);
}

export default function HickLab() {
  const [plan, setPlan] = useState<Plan[]>([]);
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"idle" | "cue" | "menu" | "done">("idle");
  const [results, setResults] = useState<Result[]>([]);
  const [errors, setErrors] = useState(0);
  const [wrong, setWrong] = useState<string | null>(null);
  const t0 = useRef(0);
  const cur = plan[i];

  // The clock starts after the menu has painted, not when the button was pressed.
  useEffect(() => {
    if (phase !== "menu") return;
    const id = requestAnimationFrame(() => (t0.current = performance.now()));
    return () => cancelAnimationFrame(id);
  }, [phase, i]);

  const start = () => {
    setPlan(makePlan());
    setI(0);
    setResults([]);
    setPhase("cue");
  };

  const choose = (item: string) => {
    if (!cur || phase !== "menu") return;
    if (item !== cur.target) {
      setErrors((e) => e + 1);
      setWrong(item);
      return;
    }
    const next = [...results, { ...cur, rt: clock() - t0.current, errors }];
    setResults(next);
    setErrors(0);
    setWrong(null);
    if (i + 1 >= plan.length) setPhase("done");
    else {
      setI(i + 1);
      setPhase("cue");
    }
  };

  const by = (o: Order) => results.filter((r) => r.order === o);
  const fitLog = (rs: Result[]) => linreg(rs.map((r) => Math.log2(r.n + 1)), rs.map((r) => r.rt));
  const fitLin = (rs: Result[]) => linreg(rs.map((r) => r.n), rs.map((r) => r.rt));
  const sorted = by("sorted");
  const shuffled = by("shuffled");
  const sLog = fitLog(sorted);
  const sLin = fitLin(sorted);
  const hLog = fitLog(shuffled);
  const hLin = fitLin(shuffled);
  const curve = (f: { a: number; b: number }, log: boolean) =>
    Number.isFinite(f.b) ? Array.from({ length: 31 }, (_, k) => { const n = 1 + k * 0.5; return { x: n, y: f.a + f.b * (log ? Math.log2(n + 1) : n) }; }) : [];
  const at16 = (rs: Result[]) => median(rs.filter((r) => r.n === 16).map((r) => r.rt));
  const yMax = Math.max(1500, ...results.map((r) => r.rt * 1.1));
  const enough = sorted.length >= 4 && shuffled.length >= 4;

  const status =
    phase === "idle" ? "Find the named city in each menu. 16 menus, about a minute."
    : phase === "done" ? `Done. ${results.length} menus.`
    : `Menu ${i + 1} of ${plan.length} · ${cur?.n} items, ${cur?.order === "sorted" ? "sorted A–Z" : "shuffled"}`;

  return (
    <LabFrame status={status} actions={results.length > 0 && <Btn kind="ghost" onClick={start}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Stage className="grid min-h-[420px] place-items-center border-b border-border p-5 lg:border-r lg:border-b-0">
          {phase === "idle" && (
            <div className="grid max-w-[32ch] justify-items-center gap-4 text-center">
              <p className="text-compact text-muted">You&apos;ll see a city name, then a menu. Click the city as fast as you can.</p>
              <Btn onClick={start}>Start</Btn>
            </div>
          )}
          {phase === "cue" && cur && (
            <div className="grid justify-items-center gap-4 text-center">
              <p className="text-sm text-muted">Find</p>
              <p className="text-3xl font-medium tracking-[-0.02em]">{cur.target}</p>
              <Btn onClick={() => setPhase("menu")}>Show the menu</Btn>
            </div>
          )}
          {phase === "menu" && cur && (
            <div className="w-full max-w-[260px]">
              <p className="mb-2 text-center text-sm text-muted">Find <b className="font-medium text-foreground">{cur.target}</b></p>
              <ul className="grid gap-px overflow-hidden rounded-xl bg-border p-px shadow-[0_18px_40px_-24px_rgb(15_15_16/0.35)]" aria-label={`Menu of ${cur.n} cities`}>
                {cur.items.map((c) => (
                  <li key={c}>
                    <button type="button" onClick={() => choose(c)} className={`block w-full bg-background px-3.5 py-1.5 text-left text-sm hover:bg-surface ${wrong === c ? "text-muted line-through" : ""}`}>
                      {c}
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          )}
          {phase === "done" && (
            <div className="grid max-w-[36ch] gap-2 text-center">
              <p className="text-lg">Sorted menus: {sorted.length && sLog.r2 >= sLin.r2 ? "the log curve fits you better" : "the straight line fits you better"}.</p>
              <p className="text-compact text-muted">Shuffled menus: {shuffled.length && hLin.r2 >= hLog.r2 ? "the straight line fits better, as search predicts" : "the log curve fits better this time"}. Eight menus each is a small sample, so run it twice.</p>
            </div>
          )}
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Time to pick an item against menu size. ${sorted.length} sorted and ${shuffled.length} shuffled menus.`}
            yLabel="Time to pick"
            xLabel="Items in the menu"
            x={[0, 17]}
            y={[0, yMax]}
            xTicks={[2, 4, 8, 16]}
            yFormat={ms}
            legend={[{ name: "Sorted A–Z · log fit", tone: "accent", kind: "dot" }, { name: "Shuffled · straight fit", tone: "base", kind: "hollow" }]}
            dots={[{ name: "Sorted", tone: "accent", pts: sorted.map((r) => ({ x: r.n - 0.2, y: r.rt })) }, { name: "Shuffled", tone: "base", hollow: true, pts: shuffled.map((r) => ({ x: r.n + 0.2, y: r.rt })) }]}
            lines={[{ name: "Sorted fit", tone: "accent", pts: sorted.length >= 4 ? curve(sLog, true) : [] }, { name: "Shuffled fit", tone: "base", dashed: true, pts: shuffled.length >= 4 ? curve(hLin, false) : [] }]}
            empty="Your choices plot here"
            table={{ caption: "Your menu choices", head: ["Order", "Items", "Target", "Time ms", "Wrong clicks"], rows: results.map((r) => [r.order, r.n, r.target, Math.round(r.rt), r.errors]) }}
          />
          {enough ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Readout value={ms(sLog.b)} label="per doubling, sorted" note={`Log fit R² ${sLog.r2.toFixed(2)}`} />
              <Readout value={ms(hLin.b)} label="per item, shuffled" note={`Straight fit R² ${hLin.r2.toFixed(2)}`} />
              <Readout value={Number.isFinite(at16(sorted)) && Number.isFinite(at16(shuffled)) ? ms(Math.abs(at16(shuffled) - at16(sorted))) : "–"} label={at16(shuffled) >= at16(sorted) ? "saved at 16 items by sorting" : "lost at 16 items by sorting"} note="Median of your two tries" />
            </div>
          ) : (
            <LabNote>Works with a mouse, touch or the keyboard (Tab and Enter), though the keyboard adds travel time to every pick.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
