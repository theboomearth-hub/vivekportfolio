"use client";

/**
 * Change blindness (the flicker paradigm, Rensink, O'Regan & Clark 1997). A dashboard alternates with a changed copy,
 * with a brief blank between them; the blank masks the motion signal that would normally draw the eye, so the change
 * hides in plain sight. Then the same kind of change happens with a short highlight, and it is found at once.
 * Timing here is slower than the original (560 ms + 160 ms blank) so it stays under three flashes a second.
 */

import { useEffect, useRef, useState } from "react";
import { median } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, Plot, Readout, ms } from "./kit";

type Key = "imp" | "reach" | "spend" | "cpm" | "b0" | "b1" | "b2" | "b3" | "b4" | "b5" | "r0" | "r1" | "r2" | "r3";
type Board = { kpi: Record<"imp" | "reach" | "spend" | "cpm", string>; bars: number[]; rows: { name: string; ok: boolean }[] };

const BASE_BOARD: Board = {
  kpi: { imp: "2.4M", reach: "640K", spend: "₹3.2L", cpm: "₹118" },
  bars: [52, 64, 48, 70, 58, 44],
  rows: [
    { name: "T2 Departures", ok: true },
    { name: "Rajiv Chowk Metro", ok: false },
    { name: "BKC Junction", ok: true },
    { name: "Silk Board LED", ok: true },
  ],
};

type Change = { key: Key; label: string; apply: (b: Board) => Board };
const CHANGES: Change[] = [
  { key: "spend", label: "Spend went from ₹3.2L to ₹3.8L", apply: (b) => ({ ...b, kpi: { ...b.kpi, spend: "₹3.8L" } }) },
  { key: "b3", label: "Thursday's bar dropped", apply: (b) => ({ ...b, bars: b.bars.map((v, i) => (i === 3 ? 46 : v)) }) },
  { key: "r2", label: "BKC Junction went to Behind", apply: (b) => ({ ...b, rows: b.rows.map((r, i) => (i === 2 ? { ...r, ok: false } : r)) }) },
  { key: "reach", label: "Reach went from 640K to 690K", apply: (b) => ({ ...b, kpi: { ...b.kpi, reach: "690K" } }) },
  { key: "b1", label: "Tuesday's bar dropped", apply: (b) => ({ ...b, bars: b.bars.map((v, i) => (i === 1 ? 40 : v)) }) },
  { key: "r1", label: "Rajiv Chowk Metro went to On track", apply: (b) => ({ ...b, rows: b.rows.map((r, i) => (i === 1 ? { ...r, ok: true } : r)) }) },
];
const ON = 560;
const BLANK = 160;
const GIVE_UP = 30000;
type Result = { cue: boolean; time: number; found: boolean; wrong: number };

export default function ChangeBlindLab() {
  const [i, setI] = useState(0);
  const [phase, setPhase] = useState<"idle" | "run" | "between" | "done">("idle");
  const [frame, setFrame] = useState<"A" | "blank" | "B">("A");
  const [paused, setPaused] = useState(false);
  const [highlight, setHighlight] = useState(false);
  const [results, setResults] = useState<Result[]>([]);
  const [wrong, setWrong] = useState(0);
  const [missed, setMissed] = useState<Key | null>(null);
  const [lastLabel, setLastLabel] = useState("");
  const t0 = useRef(0);
  const cue = i >= 3;
  const change = CHANGES[i];

  // Flicker loop (rounds 1–3), or change-once-with-a-highlight (rounds 4–6).
  useEffect(() => {
    if (phase !== "run" || paused) return;
    const timers: number[] = [];
    if (!cue) {
      const seq: ["A" | "blank" | "B", number][] = [["A", ON], ["blank", BLANK], ["B", ON], ["blank", BLANK]];
      let k = 0;
      const step = () => {
        const [f, d] = seq[k % 4];
        setFrame(f);
        k++;
        timers.push(window.setTimeout(step, d));
      };
      step();
    } else {
      setFrame("A");
      timers.push(window.setTimeout(() => {
        setFrame("B");
        setHighlight(true);
        t0.current = performance.now();
        timers.push(window.setTimeout(() => setHighlight(false), 700));
      }, 1500));
    }
    timers.push(window.setTimeout(() => finish(false), (cue ? 1500 : 0) + GIVE_UP));
    return () => timers.forEach(clearTimeout);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [phase, i, paused]);

  const begin = () => {
    setWrong(0);
    setMissed(null);
    if (!cue) t0.current = performance.now();
    setPhase("run");
  };

  function finish(found: boolean) {
    const time = performance.now() - t0.current;
    setResults((rs) => [...rs, { cue, time: found ? time : GIVE_UP, found, wrong }]);
    setLastLabel(`${found ? "Found" : "Missed"}: ${change.label.toLowerCase()}`);
    if (!found) setMissed(change.key);
    setHighlight(false);
    if (i + 1 >= CHANGES.length) setPhase("done");
    else {
      setI(i + 1);
      setPhase("between");
    }
  }

  const pick = (key: Key) => {
    if (phase !== "run" || (cue && frame !== "B")) return;
    if (key === change.key) finish(true);
    else setWrong((w) => w + 1);
  };

  const restart = () => {
    setI(0);
    setResults([]);
    setPhase("idle");
  };

  const board = frame === "B" ? change.apply(BASE_BOARD) : BASE_BOARD;
  const ring = (key: Key) => (highlight && key === change.key ? "ring-2 ring-accent" : missed === key && phase !== "run" ? "ring-2 ring-accent/60" : "ring-1 ring-border");
  const cell = "rounded-lg bg-background text-left transition-[box-shadow] duration-300 hover:bg-surface focus-visible:ring-2 focus-visible:ring-accent";

  const flick = results.filter((r) => !r.cue);
  const cued = results.filter((r) => r.cue);
  const status =
    phase === "idle" ? "Something on the dashboard changes. Click it. Six rounds, three with a blank flicker."
    : phase === "done" ? "Done. Six rounds."
    : phase === "between" ? lastLabel
    : `Round ${i + 1} of 6 · ${cue ? "watch: one thing will change" : "it flickers: find what's different"}${wrong ? ` · ${wrong} wrong` : ""}`;

  return (
    <LabFrame
      status={status}
      actions={
        <>
          {phase === "run" && !cue && <Btn kind="ghost" onClick={() => setPaused((p) => !p)}>{paused ? "Resume" : "Pause"}</Btn>}
          {phase === "run" && <Btn kind="ghost" onClick={() => finish(false)}>Show me</Btn>}
          {results.length > 0 && phase !== "run" && <Btn kind="ghost" onClick={restart}>Start again</Btn>}
        </>
      }
    >
      <div className="grid lg:grid-cols-[minmax(0,1.15fr)_minmax(0,0.85fr)]">
        <div className="relative border-b border-border bg-surface p-4 sm:p-5 lg:border-r lg:border-b-0">
          <div className="grid gap-3" aria-label="Campaign dashboard">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {(["imp", "reach", "spend", "cpm"] as const).map((k) => (
                <button key={k} type="button" onClick={() => pick(k)} className={`${cell} ${ring(k)} p-3`}>
                  <span className="block text-caption text-muted">{{ imp: "Impressions", reach: "Reach", spend: "Spend", cpm: "CPM" }[k]}</span>
                  <span className="mt-1 block text-xl font-medium tabular-nums">{board.kpi[k]}</span>
                </button>
              ))}
            </div>
            <div className="grid gap-2 sm:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
              <div className="rounded-lg bg-background p-3 ring-1 ring-border">
                <p className="text-caption text-muted">Daily delivery</p>
                <div className="mt-2 flex h-24 items-end gap-1.5">
                  {board.bars.map((v, b) => (
                    <button key={b} type="button" aria-label={`${["Mon", "Tue", "Wed", "Thu", "Fri", "Sat"][b]} bar`} onClick={() => pick(`b${b}` as Key)} className={`flex h-full flex-1 items-end rounded-[4px] ${highlight && change.key === `b${b}` ? "ring-2 ring-accent" : missed === `b${b}` && phase !== "run" ? "ring-2 ring-accent/60" : ""}`}>
                      <span className="block w-full rounded-t-[4px] bg-accent" style={{ height: `${v}%` }} />
                    </button>
                  ))}
                </div>
                <p className="mt-1 grid grid-cols-6 text-center font-mono text-[11px] text-muted" aria-hidden="true">{["M", "T", "W", "T", "F", "S"].map((d, n) => <span key={n}>{d}</span>)}</p>
              </div>
              <ul className="grid content-start gap-1.5">
                {board.rows.map((r, n) => (
                  <li key={r.name}>
                    <button type="button" onClick={() => pick(`r${n}` as Key)} className={`${cell} ${ring(`r${n}` as Key)} flex w-full items-center justify-between gap-2 px-2.5 py-2 text-sm`}>
                      <span className="truncate">{r.name}</span>
                      <span className={`shrink-0 rounded-full px-2 py-0.5 text-[12px] ${r.ok ? "bg-surface text-muted" : "bg-foreground text-background"}`}>{r.ok ? "On track" : "Behind"}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
          </div>
          {/* The blank: the surface colour over everything, briefly. Low contrast with the white board. */}
          {phase === "run" && frame === "blank" && <div aria-hidden="true" className="absolute inset-0 bg-surface" />}
          {(phase === "idle" || phase === "between") && (
            <div className="absolute inset-0 grid place-items-center bg-surface/85 p-6 text-center backdrop-blur-[2px]">
              <div className="grid max-w-[36ch] justify-items-center gap-4">
                <p className="text-compact text-muted">
                  {phase === "idle" ? "Rounds 1–3: the board flickers between two versions. Rounds 4–6: it changes once, with a highlight." : i === 3 ? "Now the change happens once, with a short highlight, the way a well-designed live update would." : "Next round."}
                </p>
                <Btn onClick={begin}>{phase === "idle" ? "Start" : `Start round ${i + 1}`}</Btn>
              </div>
            </div>
          )}
        </div>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Time to find the change, ${flick.length} flicker rounds and ${cued.length} highlighted rounds.`}
            yLabel="Time to find"
            xLabel="Condition"
            x={[0.4, 2.6]}
            y={[0, 30000]}
            xTicks={[1, 2]}
            xFormat={(v) => (v === 1 ? "Flicker" : v === 2 ? "Highlighted" : "")}
            yTicks={[0, 10000, 20000, 30000]}
            yFormat={(v) => `${v / 1000} s`}
            legend={[{ name: "Highlighted", tone: "accent", kind: "dot" }, { name: "Flicker", tone: "base", kind: "hollow" }]}
            dots={[{ name: "Flicker", tone: "base", hollow: true, pts: flick.map((r, n) => ({ x: 0.85 + n * 0.15, y: r.time, tip: `Flicker: ${r.found ? ms(r.time) : "not found in 30 s"}` })) }, { name: "Highlighted", tone: "accent", pts: cued.map((r, n) => ({ x: 1.85 + n * 0.15, y: r.time, tip: `Highlighted: ${r.found ? ms(r.time) : "not found"}` })) }]}
            empty="Your times plot here"
            table={{ caption: "Your rounds", head: ["Round", "Condition", "Found", "Time", "Wrong clicks"], rows: results.map((r, n) => [n + 1, r.cue ? "Highlighted" : "Flicker", r.found ? "Yes" : "No", r.found ? ms(r.time) : "30 s+", r.wrong]) }}
          />
          {phase === "done" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Readout value={ms(median(flick.map((r) => r.time)))} label="median, flicker" note={`${flick.filter((r) => r.found).length} of 3 found`} />
              <Readout value={ms(median(cued.map((r) => r.time)))} label="median, highlighted" note={`${cued.filter((r) => r.found).length} of 3 found`} />
            </div>
          ) : (
            <LabNote>The flicker is a light grey blank, under three times a second, and can be paused. Every tile, bar and row is a button, so the keyboard works too.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
