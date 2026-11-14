"use client";

/**
 * Perceptual colour ramps. The same nine-step ramp built two ways at one hue: evenly spaced HSL lightness, and evenly
 * spaced OKLCH lightness. HSL's "lightness" isn't what the eye sees, so its steps bunch up and the point where white
 * text passes WCAG AA moves from hue to hue. OKLCH keeps the steps even, and the AA step stays put.
 */

import { useMemo, useState } from "react";
import { contrast, hslToRgb, oklchToRgb, rgbToOklab, toHex, WHITE, type RGB } from "@/lib/craft/color";
import { LabFrame, LabNote, Plot, Readout, Stage } from "./kit";

const STEPS = 9;
const HSL_S = 0.75;
const hslL = (k: number) => 0.92 - (k * (0.92 - 0.18)) / (STEPS - 1);
const okL = (k: number) => 0.95 - (k * (0.95 - 0.3)) / (STEPS - 1);
const OK_C = 0.13;

/** OKLCH hue of the HSL colour at the same nominal hue, so both ramps aim at the same colour. */
const okHue = (h: number) => {
  const { a, b } = rgbToOklab(hslToRgb(h, HSL_S, 0.5));
  return ((Math.atan2(b, a) * 180) / Math.PI + 360) % 360;
};

function ramps(h: number) {
  const oh = okHue(h);
  const hsl = Array.from({ length: STEPS }, (_, k) => hslToRgb(h, HSL_S, hslL(k)));
  const ok = Array.from({ length: STEPS }, (_, k) => oklchToRgb(okL(k), OK_C, oh));
  return { hsl, ok };
}

/** First step (1-based) where white text reaches 4.5:1, or NaN. */
const aaStep = (ramp: RGB[]) => {
  const k = ramp.findIndex((c) => contrast(c, WHITE) >= 4.5);
  return k < 0 ? NaN : k + 1;
};

const HUES = Array.from({ length: 12 }, (_, k) => k * 30);

function Swatches({ name, ramp }: { name: string; ramp: RGB[] }) {
  return (
    <div className="grid gap-2">
      <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{name}</p>
      <ol className="grid grid-cols-9 gap-1">
        {ramp.map((c, k) => {
          const onWhite = contrast(c, WHITE);
          const onInk = contrast(c, [0, 0, 0]); // pure black: the better of black and white always clears 4.5:1
          const white = onWhite >= onInk;
          const best = Math.max(onWhite, onInk);
          return (
            <li key={k} className="grid aspect-[3/4] content-between rounded-md p-1.5 sm:p-2" style={{ background: toHex(c), color: white ? "#FFFFFF" : "#000000" }} title={`Step ${k + 1}: ${toHex(c)}, ${best.toFixed(1)}:1 with ${white ? "white" : "dark"} text`}>
              <span className="text-[11px] font-medium leading-none">{k + 1}</span>
              <span className="text-[10px] leading-none tabular-nums">{white && onWhite >= 4.5 ? "AA" : ""}</span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function ColorRampLab() {
  const [hue, setHue] = useState(230);
  const { hsl, ok } = useMemo(() => ramps(hue), [hue]);
  const L = (c: RGB) => rgbToOklab(c).L;
  const sweep = useMemo(() => HUES.map((h) => { const r = ramps(h); return { h, hsl: aaStep(r.hsl), ok: aaStep(r.ok) }; }), []);
  const spread = (xs: number[]) => { const v = xs.filter(Number.isFinite); return v.length ? Math.max(...v) - Math.min(...v) : NaN; };

  return (
    <LabFrame status={`Hue ${hue}° · drag the slider and watch where the AA steps land`}>
      <div className="grid lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)]">
        <Stage className="grid content-start gap-6 border-b border-border p-5 lg:border-r lg:border-b-0">
          <div className="grid gap-2">
            <label htmlFor="hue" className="flex items-center justify-between text-sm text-muted">
              Hue
              <span className="h-4 w-4 rounded-full ring-1 ring-border" style={{ background: toHex(hslToRgb(hue, HSL_S, 0.5)) }} aria-hidden="true" />
            </label>
            <input id="hue" type="range" min={0} max={359} value={hue} onChange={(e) => setHue(Number(e.target.value))} className="w-full accent-[var(--color-accent)]" />
          </div>
          <Swatches name="HSL · lightness 92% → 18% in even steps" ramp={hsl} />
          <Swatches name="OKLCH · lightness 0.95 → 0.30 in even steps" ramp={ok} />
          <div className="grid gap-2">
            <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">Same lightness, twelve hues</p>
            <div className="grid grid-cols-12 gap-1" aria-hidden="true">
              {HUES.map((h) => <span key={`h${h}`} className="h-6 rounded-[4px]" style={{ background: toHex(hslToRgb(h, HSL_S, 0.5)) }} />)}
              {HUES.map((h) => <span key={`o${h}`} className="h-6 rounded-[4px]" style={{ background: toHex(oklchToRgb(0.62, OK_C, okHue(h))) }} />)}
            </div>
            <p className="text-caption text-muted">Top: HSL at 50% lightness, where yellow glares and blue sinks. Bottom: OKLCH at 0.62, the same weight at every hue.</p>
          </div>
        </Stage>

        <div className="grid content-start gap-6 p-4 sm:p-5">
          <Plot
            label={`Perceived lightness of each step at hue ${hue}, HSL against OKLCH.`}
            yLabel="Perceived lightness (OKLab L)"
            xLabel="Ramp step"
            x={[1, 9]}
            y={[0, 1]}
            xTicks={[1, 2, 3, 4, 5, 6, 7, 8, 9]}
            yTicks={[0, 0.25, 0.5, 0.75, 1]}
            height={220}
            legend={[{ name: "OKLCH", tone: "accent", kind: "dot" }, { name: "HSL", tone: "base", kind: "hollow" }]}
            lines={[{ name: "OKLCH", tone: "accent", pts: ok.map((c, k) => ({ x: k + 1, y: L(c) })) }, { name: "HSL", tone: "base", dashed: true, pts: hsl.map((c, k) => ({ x: k + 1, y: L(c) })) }]}
            dots={[{ name: "OKLCH", tone: "accent", pts: ok.map((c, k) => ({ x: k + 1, y: L(c), tip: `OKLCH step ${k + 1}: L ${L(c).toFixed(2)}` })) }, { name: "HSL", tone: "base", hollow: true, pts: hsl.map((c, k) => ({ x: k + 1, y: L(c), tip: `HSL step ${k + 1}: L ${L(c).toFixed(2)}` })) }]}
            table={{ caption: `Steps at hue ${hue}`, head: ["Step", "HSL", "HSL L", "OKLCH", "OKLCH L"], rows: hsl.map((c, k) => [k + 1, toHex(c), L(c).toFixed(2), toHex(ok[k]), L(ok[k]).toFixed(2)]) }}
          />
          <Plot
            label="First step where white text passes AA, for twelve hues, HSL against OKLCH."
            yLabel="First step where white text passes AA"
            xLabel="Hue"
            x={[0, 330]}
            y={[1, 9]}
            xTicks={[0, 60, 120, 180, 240, 300]}
            yTicks={[1, 3, 5, 7, 9]}
            xFormat={(v) => `${v}°`}
            height={200}
            legend={[{ name: "OKLCH", tone: "accent", kind: "dot" }, { name: "HSL", tone: "base", kind: "hollow" }]}
            lines={[{ name: "OKLCH", tone: "accent", pts: sweep.filter((s) => Number.isFinite(s.ok)).map((s) => ({ x: s.h, y: s.ok })) }, { name: "HSL", tone: "base", dashed: true, pts: sweep.filter((s) => Number.isFinite(s.hsl)).map((s) => ({ x: s.h, y: s.hsl })) }]}
            dots={[{ name: "OKLCH", tone: "accent", pts: sweep.filter((s) => Number.isFinite(s.ok)).map((s) => ({ x: s.h, y: s.ok })) }, { name: "HSL", tone: "base", hollow: true, pts: sweep.filter((s) => Number.isFinite(s.hsl)).map((s) => ({ x: s.h, y: s.hsl })) }]}
            table={{ caption: "First AA step for white text by hue", head: ["Hue", "HSL step", "OKLCH step"], rows: sweep.map((s) => [`${s.h}°`, s.hsl, s.ok]) }}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Readout value={`${spread(sweep.map((s) => s.hsl))} steps`} label="AA step drifts across hues, HSL" />
            <Readout value={`${spread(sweep.map((s) => s.ok))} steps`} label="AA step drifts across hues, OKLCH" />
          </div>
          <LabNote>Contrast is WCAG 2 relative luminance. OKLCH colours outside the sRGB screen gamut keep their lightness and give up chroma.</LabNote>
        </div>
      </div>
    </LabFrame>
  );
}
