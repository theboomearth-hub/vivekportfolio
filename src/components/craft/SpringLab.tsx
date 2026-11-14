"use client";

/**
 * Spring physics vs a fixed-duration tween. A damped harmonic oscillator: m·x″ = −k(x − target) − c·x′, with damping
 * ratio ζ = c / (2√(km)). Tune stiffness, damping and mass; the chart shows one move for both. Then press "Move"
 * again mid-flight: the spring carries its velocity into the new direction, the tween restarts from rest and jerks.
 */

import { useEffect, useMemo, useRef, useState } from "react";
import { Btn, LabFrame, LabNote, Plot, Readout, Stage, ms, useReducedMotion } from "./kit";

const TWEEN_MS = 400;
const easeOut = (t: number) => 1 - (1 - t) ** 3;

/** Offline step response from 0 to 1, sampled every 10 ms. */
function simulate(k: number, c: number, m: number, until = 1.6) {
  const pts: { x: number; y: number }[] = [];
  let x = 0;
  let v = 0;
  const dt = 1 / 600;
  let settle = NaN;
  let peak = 0;
  for (let i = 0, t = 0; t <= until; i++, t += dt) {
    if (i % 6 === 0) pts.push({ x: t * 1000, y: x });
    const a = (-k * (x - 1) - c * v) / m;
    v += a * dt;
    x += v * dt;
    peak = Math.max(peak, x);
    if (Number.isNaN(settle) && Math.abs(x - 1) < 0.01 && Math.abs(v) < 0.05) settle = t * 1000;
    if (!Number.isNaN(settle) && Math.abs(x - 1) >= 0.01) settle = NaN;
  }
  return { pts, settle, overshoot: Math.max(0, peak - 1) };
}

function Slider({ id, label, value, min, max, step, onChange }: { id: string; label: string; value: number; min: number; max: number; step: number; onChange: (v: number) => void }) {
  return (
    <div className="grid gap-1.5">
      <label htmlFor={id} className="flex items-baseline justify-between text-sm">
        <span>{label}</span>
        <span className="font-mono text-xs tabular-nums text-muted">{value}</span>
      </label>
      <input id={id} type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
    </div>
  );
}

export default function SpringLab() {
  const reduce = useReducedMotion();
  const [k, setK] = useState(200);
  const [c, setC] = useState(14);
  const [m, setM] = useState(1);
  const zeta = c / (2 * Math.sqrt(k * m));
  const res = useMemo(() => simulate(k, c, m), [k, c, m]);
  const tween = useMemo(() => Array.from({ length: 81 }, (_, i) => { const t = i * 20; return { x: t, y: easeOut(Math.min(1, t / TWEEN_MS)) }; }), []);

  // Live lanes: positions 0..1, driven by one rAF loop.
  const [side, setSide] = useState(0);
  const [pos, setPos] = useState({ s: 0, t: 0 });
  const sim = useRef({ x: 0, v: 0, target: 0, tw: { from: 0, to: 0, start: 0 }, tx: 0, raf: 0, last: 0 });
  const params = useRef({ k, c, m });
  useEffect(() => {
    params.current = { k, c, m };
  }, [k, c, m]);

  useEffect(() => {
    const s = sim.current;
    return () => cancelAnimationFrame(s.raf);
  }, []);

  const loop = (now: number) => {
    const s = sim.current;
    const dt = Math.min(0.05, (now - s.last) / 1000);
    s.last = now;
    const { k: K, c: C, m: M } = params.current;
    for (let i = 0; i < 8; i++) {
      const a = (-K * (s.x - s.target) - C * s.v) / M;
      s.v += a * (dt / 8);
      s.x += s.v * (dt / 8);
    }
    const p = Math.min(1, (now - s.tw.start) / TWEEN_MS);
    s.tx = s.tw.from + (s.tw.to - s.tw.from) * easeOut(p);
    setPos({ s: s.x, t: s.tx });
    const springDone = Math.abs(s.x - s.target) < 0.001 && Math.abs(s.v) < 0.001;
    if (springDone && p >= 1) {
      s.raf = 0;
      return;
    }
    s.raf = requestAnimationFrame(loop);
  };

  const move = () => {
    const to = side ? 0 : 1;
    setSide(to);
    const s = sim.current;
    if (reduce) {
      Object.assign(s, { x: to, v: 0, target: to, tx: to });
      setPos({ s: to, t: to });
      return;
    }
    s.target = to;
    s.tw = { from: s.tx, to, start: performance.now() }; // the tween restarts from rest, wherever it is
    if (!s.raf) {
      s.last = performance.now();
      s.raf = requestAnimationFrame(loop);
    }
  };

  const kind = zeta < 0.98 ? "Underdamped: it overshoots and bounces" : zeta <= 1.02 ? "Critically damped: fastest without overshoot" : "Overdamped: no bounce, slow to arrive";

  const lane = (name: string, x: number, accent: boolean) => (
    <div className="grid gap-1.5">
      <p className="text-sm text-muted">{name}</p>
      <div className="relative h-12 rounded-xl bg-background ring-1 ring-border">
        <span aria-hidden="true" className={`absolute top-1.5 h-9 w-9 rounded-lg ${accent ? "bg-accent" : "bg-[#8A8A93]"}`} style={{ left: `calc(6px + ${x} * (100% - 48px))` }} />
      </div>
    </div>
  );

  return (
    <LabFrame status={kind} actions={<Btn onClick={move}>Move</Btn>}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Stage className="grid content-start gap-6 border-b border-border p-5 lg:border-r lg:border-b-0">
          <div className="grid gap-4">
            {lane("Spring", pos.s, true)}
            {lane(`Tween, ${TWEEN_MS} ms ease-out`, pos.t, false)}
            <p className="text-caption text-muted">{reduce ? "Reduced motion is on, so the blocks jump. The chart shows the motion." : "Press Move, then press it again before the blocks stop. The spring turns smoothly; the tween snaps into a new start."}</p>
          </div>
          <div className="grid gap-4 rounded-xl bg-background p-4 ring-1 ring-border">
            <Slider id="k" label="Stiffness k" value={k} min={20} max={500} step={10} onChange={setK} />
            <Slider id="c" label="Damping c" value={c} min={2} max={60} step={1} onChange={setC} />
            <Slider id="m" label="Mass m" value={m} min={0.5} max={4} step={0.1} onChange={setM} />
          </div>
        </Stage>

        <div className="grid content-start gap-5 p-4 sm:p-5">
          <Plot
            label={`Position over time for one move. Damping ratio ${zeta.toFixed(2)}.`}
            yLabel="Position (0 = start, 1 = target)"
            xLabel="Time"
            x={[0, 1600]}
            y={[0, Math.max(1.2, 1 + res.overshoot + 0.05)]}
            xTicks={[0, 400, 800, 1200, 1600]}
            xFormat={ms}
            hlines={[{ y: 1, label: "Target" }]}
            legend={[{ name: "Spring", tone: "accent", kind: "line" }, { name: "Tween", tone: "base", kind: "dash" }]}
            lines={[{ name: "Spring", tone: "accent", pts: res.pts }, { name: "Tween", tone: "base", dashed: true, pts: tween }]}
            table={{ caption: "Spring position every 100 ms", head: ["Time ms", "Spring", "Tween"], rows: res.pts.filter((_, i) => i % 10 === 0).map((p) => [Math.round(p.x), p.y.toFixed(3), easeOut(Math.min(1, p.x / TWEEN_MS)).toFixed(3)]) }}
          />
          <div className="grid gap-3 sm:grid-cols-3">
            <Readout value={zeta.toFixed(2)} label="damping ratio ζ" note="1.0 is critical" />
            <Readout value={Number.isFinite(res.settle) ? ms(res.settle) : "> 1.6 s"} label="to settle within 1%" />
            <Readout value={`${Math.round(res.overshoot * 100)}%`} label="overshoot" />
          </div>
          <LabNote>Simulated with small fixed steps (semi-implicit Euler), the same way most spring libraries do it. Units are arbitrary but proportional.</LabNote>
        </div>
      </div>
    </LabFrame>
  );
}
