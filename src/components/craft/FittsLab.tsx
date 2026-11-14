"use client";

/**
 * Fitts's law lab. Click targets of random size and distance; each click's time is plotted against its index of
 * difficulty, ID = log2(D/W + 1) (Shannon form). Round 2 makes the targets "sticky": they catch the pointer a little
 * before it arrives, which is what a magnetic button does. The fits show what that buys at the same difficulty.
 */

import { useRef, useState } from "react";
import { linreg, mean } from "@/lib/craft/stats";
import { Btn, LabFrame, LabNote, Plot, Readout, Stage, ms } from "./kit";

type Trial = { round: 0 | 1; D: number; W: number; ID: number; MT: number };
type Target = { x: number; y: number; w: number };

const PER_ROUND = 12;
const SIZES = [14, 22, 34, 52];
const HALO = 18; // extra catch radius in round 2, px

export default function FittsLab() {
  const arena = useRef<HTMLDivElement>(null);
  const last = useRef({ x: 0, y: 0, t: 0 });
  const [phase, setPhase] = useState<"idle" | "run" | "break" | "done">("idle");
  const [round, setRound] = useState<0 | 1>(0);
  const [target, setTarget] = useState<Target | null>(null);
  const [trials, setTrials] = useState<Trial[]>([]);
  const [misses, setMisses] = useState(0);
  const [near, setNear] = useState(false);

  const place = (from: { x: number; y: number }): Target => {
    const r = arena.current!.getBoundingClientRect();
    let best: Target = { x: r.width / 2, y: r.height / 2, w: 34 };
    for (let k = 0; k < 60; k++) {
      const w = SIZES[Math.floor(Math.random() * SIZES.length)];
      const pad = w / 2 + 10;
      const t = { x: pad + Math.random() * (r.width - 2 * pad), y: pad + Math.random() * (r.height - 2 * pad), w };
      best = t;
      if (Math.hypot(t.x - from.x, t.y - from.y) > 90) break;
    }
    return best;
  };

  const begin = (r: 0 | 1) => {
    const box = arena.current!.getBoundingClientRect();
    const from = { x: box.width / 2, y: box.height / 2 };
    last.current = { ...from, t: performance.now() };
    setRound(r);
    setTarget(place(from));
    setPhase("run");
  };

  const reset = () => {
    setTrials([]);
    setMisses(0);
    setTarget(null);
    setPhase("idle");
  };

  const local = (e: React.PointerEvent) => {
    const r = arena.current!.getBoundingClientRect();
    return { x: e.clientX - r.left, y: e.clientY - r.top };
  };

  const onDown = (e: React.PointerEvent) => {
    if (phase !== "run" || !target) return;
    const p = local(e);
    const radius = target.w / 2 + (round === 1 ? HALO : 0);
    if (Math.hypot(p.x - target.x, p.y - target.y) > radius) {
      setMisses((m) => m + 1);
      return;
    }
    const now = performance.now();
    const D = Math.hypot(target.x - last.current.x, target.y - last.current.y);
    const trial: Trial = { round, D, W: target.w, ID: Math.log2(D / target.w + 1), MT: now - last.current.t };
    const next = [...trials, trial];
    setTrials(next);
    last.current = { ...p, t: now };
    setNear(false);
    if (next.filter((t) => t.round === round).length >= PER_ROUND) {
      setTarget(null);
      setPhase(round === 0 ? "break" : "done");
    } else {
      setTarget(place(p));
    }
  };

  const onMove = (e: React.PointerEvent) => {
    if (phase !== "run" || !target || round !== 1) return;
    const p = local(e);
    setNear(Math.hypot(p.x - target.x, p.y - target.y) <= target.w / 2 + HALO);
  };

  const plain = trials.filter((t) => t.round === 0);
  const sticky = trials.filter((t) => t.round === 1);
  const fitP = linreg(plain.map((t) => t.ID), plain.map((t) => t.MT));
  const fitS = linreg(sticky.map((t) => t.ID), sticky.map((t) => t.MT));
  const tp = plain.length ? mean(plain.map((t) => t.ID / (t.MT / 1000))) : NaN;
  const allID = trials.map((t) => t.ID);
  const span: [number, number] = allID.length ? [Math.min(...allID), Math.max(...allID)] : [0, 0];
  const atMid = mean(allID);
  const gain = sticky.length >= 4 && plain.length >= 4 ? 1 - (fitS.a + fitS.b * atMid) / (fitP.a + fitP.b * atMid) : NaN;
  const yMax = Math.max(1200, ...trials.map((t) => t.MT * 1.1));

  const status =
    phase === "idle" ? "Click each target as fast as you can without missing. 24 clicks, about a minute."
    : phase === "run" ? `Round ${round + 1} of 2 · ${round === 0 ? "plain" : "sticky"} targets · ${(round === 0 ? plain : sticky).length + 1} of ${PER_ROUND}${misses ? ` · ${misses} missed` : ""}`
    : phase === "break" ? "Round 1 done. Round 2 makes every target sticky."
    : `Done. ${trials.length} clicks, ${misses} missed.`;

  const line = (f: { a: number; b: number }) => (Number.isFinite(f.b) ? [{ x: span[0], y: f.a + f.b * span[0] }, { x: span[1], y: f.a + f.b * span[1] }] : []);

  return (
    <LabFrame status={status} actions={trials.length > 0 && <Btn kind="ghost" onClick={reset}>Start again</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1.1fr)_minmax(0,1fr)]">
        <Stage
          ref={arena}
          onPointerDown={onDown}
          onPointerMove={onMove}
          className="h-[340px] cursor-crosshair touch-manipulation select-none border-b border-border lg:h-auto lg:min-h-[420px] lg:border-r lg:border-b-0"
        >
          {target && (
            <>
              {round === 1 && <span aria-hidden="true" className={`absolute rounded-full transition-opacity duration-150 ${near ? "bg-accent/15 opacity-100" : "opacity-0"}`} style={{ left: target.x - target.w / 2 - HALO, top: target.y - target.w / 2 - HALO, width: target.w + HALO * 2, height: target.w + HALO * 2 }} />}
              <span aria-hidden="true" className={`absolute rounded-full bg-accent shadow-[0_0_0_3px_var(--color-background)] transition-transform duration-150 ${near ? "scale-110" : ""}`} style={{ left: target.x - target.w / 2, top: target.y - target.w / 2, width: target.w, height: target.w }} />
            </>
          )}
          {phase === "done" && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="grid max-w-[34ch] justify-items-center gap-2">
                <p className="text-sm text-muted">Your throughput</p>
                <p className="text-5xl font-medium tracking-[-0.03em] tabular-nums">{Number.isFinite(tp) ? tp.toFixed(1) : "–"}</p>
                <p className="text-compact text-muted">bits per second, with plain targets. A typical mouse lands between 3.7 and 4.9.</p>
              </div>
            </div>
          )}
          {(phase === "idle" || phase === "break") && (
            <div className="absolute inset-0 grid place-items-center p-6 text-center">
              <div className="grid max-w-[34ch] justify-items-center gap-4">
                <p className="text-compact text-muted">{phase === "idle" ? "Targets appear one at a time. The clock runs from one click to the next." : "Same task. Now each target catches your pointer 18 px before you reach it, like a magnetic button."}</p>
                <Btn onClick={() => begin(phase === "idle" ? 0 : 1)}>{phase === "idle" ? "Start round 1" : "Start round 2"}</Btn>
              </div>
            </div>
          )}
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Movement time against index of difficulty. ${plain.length} plain and ${sticky.length} sticky clicks.`}
            yLabel="Time per click"
            xLabel="Index of difficulty, bits: log2(distance / width + 1)"
            x={[0, 7]}
            y={[0, yMax]}
            yFormat={ms}
            legend={[{ name: "Plain", tone: "base", kind: "hollow" }, { name: "Sticky", tone: "accent", kind: "dot" }]}
            dots={[{ name: "Plain", tone: "base", hollow: true, pts: plain.map((t) => ({ x: t.ID, y: t.MT })) }, { name: "Sticky", tone: "accent", pts: sticky.map((t) => ({ x: t.ID, y: t.MT })) }]}
            lines={[{ name: "Plain fit", tone: "base", dashed: true, pts: plain.length >= 4 ? line(fitP) : [] }, { name: "Sticky fit", tone: "accent", pts: sticky.length >= 4 ? line(fitS) : [] }]}
            empty="Your clicks plot here"
            table={{ caption: "Your clicks", head: ["Round", "Distance px", "Width px", "ID bits", "Time ms"], rows: trials.map((t) => [t.round ? "Sticky" : "Plain", Math.round(t.D), t.W, t.ID.toFixed(2), Math.round(t.MT)]) }}
          />
          {phase === "done" || plain.length >= PER_ROUND ? (
            <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
              <Readout value={Number.isFinite(tp) ? `${tp.toFixed(1)}` : "–"} label="bits per second" note="Typical for a mouse: 3.7–4.9" />
              <Readout value={Number.isFinite(fitP.b) ? ms(fitP.b) : "–"} label="per extra bit" note={Number.isFinite(fitP.r2) ? `Fit R² ${fitP.r2.toFixed(2)}` : undefined} />
              <Readout value={Number.isFinite(gain) ? `${Math.round(Math.abs(gain) * 100)}%` : "–"} label={gain < 0 ? "slower when sticky" : "faster when sticky"} note="At the same difficulty" />
            </div>
          ) : (
            <LabNote>Needs a mouse, trackpad or touch. The keyboard can&apos;t run this one; the chart and table explain it without you.</LabNote>
          )}
        </div>
      </div>
    </LabFrame>
  );
}
