"use client";

/**
 * Your latency threshold, by an adaptive staircase (two-alternative forced choice).
 * Two buttons light up when pressed; one lags by d ms. Say which one lagged. Two right in a row and the lag shrinks,
 * one wrong and it grows (2-down/1-up), which settles where you're right about 71% of the time (Levitt, 1971).
 * The threshold is the geometric mean of the last reversals.
 */

import { useRef, useState } from "react";
import { Btn, LabFrame, LabNote, Plot, Readout, Stage, ms } from "./kit";

type Trial = { d: number; correct: boolean; reversal: boolean };
const START = 240;
const FLOOR = 17; // one frame at 60 Hz
const CEIL = 800;
const DOWN = 0.7;
const MAX_TRIALS = 36;
const MAX_REVERSALS = 8;

export default function LatencyLab() {
  const [phase, setPhase] = useState<"idle" | "run" | "done">("idle");
  const [d, setD] = useState(START);
  const [slow, setSlow] = useState<"A" | "B">("A");
  const [lit, setLit] = useState<{ A: boolean; B: boolean }>({ A: false, B: false });
  const [tried, setTried] = useState<{ A: boolean; B: boolean }>({ A: false, B: false });
  const [trials, setTrials] = useState<Trial[]>([]);
  const [streak, setStreak] = useState(0);
  const [dir, setDir] = useState<-1 | 0 | 1>(0);
  const [flash, setFlash] = useState<"right" | "wrong" | null>(null);
  const timers = useRef<number[]>([]);

  const newTrial = () => {
    setSlow(Math.random() < 0.5 ? "A" : "B");
    setTried({ A: false, B: false });
  };

  const start = () => {
    setTrials([]);
    setD(START);
    setStreak(0);
    setDir(0);
    setPhase("run");
    newTrial();
  };

  const press = (b: "A" | "B") => {
    if (phase !== "run") return;
    setTried((t) => ({ ...t, [b]: true }));
    const delay = b === slow ? d : 0;
    const on = window.setTimeout(() => {
      setLit((l) => ({ ...l, [b]: true }));
      const off = window.setTimeout(() => setLit((l) => ({ ...l, [b]: false })), 140);
      timers.current.push(off);
    }, delay);
    timers.current.push(on);
  };

  const answer = (b: "A" | "B") => {
    const correct = b === slow;
    let nextStreak = streak;
    let move: -1 | 0 | 1 = 0;
    if (correct) {
      nextStreak += 1;
      if (nextStreak >= 2) { move = -1; nextStreak = 0; }
    } else {
      nextStreak = 0;
      move = 1;
    }
    const reversal = move !== 0 && dir !== 0 && move !== dir;
    const next = [...trials, { d, correct, reversal }];
    setTrials(next);
    setStreak(nextStreak);
    if (move !== 0) setDir(move);
    setFlash(correct ? "right" : "wrong");
    window.setTimeout(() => setFlash(null), 500);
    const nd = move === -1 ? Math.max(FLOOR, d * DOWN) : move === 1 ? Math.min(CEIL, d / DOWN) : d;
    setD(nd);
    if (next.length >= MAX_TRIALS || next.filter((t) => t.reversal).length >= MAX_REVERSALS) setPhase("done");
    else newTrial();
  };

  const revs = trials.filter((t) => t.reversal).map((t) => t.d);
  const lastRevs = revs.slice(-6);
  const threshold = lastRevs.length >= 2 ? Math.exp(lastRevs.reduce((s, v) => s + Math.log(v), 0) / lastRevs.length) : NaN;
  const canAnswer = tried.A && tried.B;

  const status =
    phase === "idle" ? "Press both buttons, then say which one lagged. About 25 rounds."
    : phase === "done" ? `Done after ${trials.length} rounds.`
    : `Round ${trials.length + 1} · lag now ${ms(d)}${flash ? (flash === "right" ? " · right" : " · wrong") : ""}`;

  const key = (b: "A" | "B") => (
    <button
      type="button"
      onPointerDown={() => press(b)}
      onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); if (!e.repeat) press(b); } }}
      disabled={phase !== "run"}
      className="grid h-28 w-28 place-items-center rounded-2xl bg-background text-2xl font-medium shadow-[0_0_0_1px_var(--color-border-strong),0_10px_24px_-14px_rgb(15_15_16/0.4)] select-none active:translate-y-px disabled:opacity-40 sm:h-32 sm:w-32"
      aria-label={`Button ${b}`}
    >
      <span className="grid justify-items-center gap-3">
        {b}
        <span aria-hidden="true" className={`h-3 w-3 rounded-full ${lit[b] ? "bg-accent" : "bg-border-strong"}`} />
      </span>
    </button>
  );

  return (
    <LabFrame status={status} actions={trials.length > 0 && <Btn kind="ghost" onClick={start}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
        <Stage className="grid min-h-[360px] place-items-center border-b border-border p-6 lg:border-r lg:border-b-0">
          {phase === "idle" ? (
            <div className="grid max-w-[34ch] justify-items-center gap-4 text-center">
              <p className="text-compact text-muted">Each button has a light. One of them lights up late. Press each one as often as you like, then pick the late one. The lag shrinks as you get it right.</p>
              <Btn onClick={start}>Start</Btn>
            </div>
          ) : phase === "run" ? (
            <div className="grid justify-items-center gap-6">
              <div className="flex gap-5">{key("A")}{key("B")}</div>
              <div className="grid justify-items-center gap-2.5">
                <p className="text-sm text-muted">{canAnswer ? "Which one lagged?" : "Press both first"}</p>
                <div className="flex gap-2">
                  <Btn kind="ghost" disabled={!canAnswer} onClick={() => answer("A")}>A lagged</Btn>
                  <Btn kind="ghost" disabled={!canAnswer} onClick={() => answer("B")}>B lagged</Btn>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid max-w-[34ch] justify-items-center gap-2 text-center">
              <p className="text-sm text-muted">You can tell a lag of about</p>
              <p className="text-5xl font-medium tracking-[-0.03em] tabular-nums">{Number.isFinite(threshold) ? ms(threshold) : "–"}</p>
              <p className="text-compact text-muted">from instant, about 7 times in 10.</p>
            </div>
          )}
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Staircase of lag per round, ${trials.length} rounds.`}
            yLabel="Lag tested (log scale)"
            xLabel="Round"
            x={[0, Math.max(20, trials.length + 1)]}
            y={[10, 1000]}
            yTicks={[10, 30, 100, 300, 1000]}
            logY
            yFormat={(v) => `${v} ms`}
            xFormat={(v) => String(v)}
            hlines={[{ y: 100, label: "≈100 ms: feels instant" }]}
            legend={[{ name: "Right", tone: "accent", kind: "dot" }, { name: "Wrong", tone: "base", kind: "hollow" }]}
            lines={[{ name: "Staircase", tone: "base", pts: trials.map((t, k) => ({ x: k + 1, y: t.d })) }]}
            dots={[{ name: "Right", tone: "accent", pts: trials.flatMap((t, k) => (t.correct ? [{ x: k + 1, y: t.d }] : [])) }, { name: "Wrong", tone: "base", hollow: true, pts: trials.flatMap((t, k) => (t.correct ? [] : [{ x: k + 1, y: t.d }])) }]}
            empty="Your staircase draws here"
            table={{ caption: "Your rounds", head: ["Round", "Lag ms", "Answer", "Reversal"], rows: trials.map((t, k) => [k + 1, Math.round(t.d), t.correct ? "Right" : "Wrong", t.reversal ? "Yes" : ""]) }}
          />
          {phase === "done" ? (
            <div className="grid gap-3 sm:grid-cols-2">
              <Readout value={Number.isFinite(threshold) ? ms(threshold) : "–"} label="your lag threshold" note={`Mean of your last ${lastRevs.length} turning points`} />
              <Readout value={`${trials.filter((t) => t.correct).length} / ${trials.length}`} label="rounds right" />
            </div>
          ) : (
            <LabNote>Works with the keyboard: Tab to a button, press Enter or Space. Screens redraw about every 17 ms, so lags below that can&apos;t be shown.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
