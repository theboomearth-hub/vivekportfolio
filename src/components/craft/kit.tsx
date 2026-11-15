"use client";

/**
 * Shared pieces for the craft labs: the lab frame, buttons, readouts, a dotted stage, and one small chart.
 *
 * Chart rules (from the site's data-viz method): at most two series, "you" in the accent and the comparison in a
 * grey that is always dashed or hollow too, so identity never rests on colour alone; thin marks with a ring in the
 * surface colour; hairline grid; a legend for two or more series; a hover title on every mark; and the same data
 * as a table under every chart.
 */

import { useEffect, useRef, useState } from "react";
import { niceTicks } from "@/lib/craft/stats";

export const BASE = "#8A8A93"; // comparison series grey (3.4:1 on white)

export function useReducedMotion() {
  const [reduce, setReduce] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const on = () => setReduce(mq.matches);
    on();
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);
  return reduce;
}

/** Width of an element, kept current with a ResizeObserver, so charts draw at real pixel size. */
export function useWidth<T extends HTMLElement>(fallback = 640) {
  const ref = useRef<T>(null);
  const [w, setW] = useState(fallback);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const ro = new ResizeObserver(([e]) => setW(Math.max(240, Math.round(e.contentRect.width))));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);
  return [ref, w] as const;
}

export function LabFrame({ status, actions, children }: { status?: React.ReactNode; actions?: React.ReactNode; children: React.ReactNode }) {
  return (
    <div className="overflow-hidden rounded-2xl bg-background shadow-[0_0_0_1px_var(--color-border),0_24px_60px_-40px_rgb(15_15_16/0.25)]">
      <div className="flex flex-wrap items-center justify-between gap-x-4 gap-y-2 border-b border-border px-4 py-3 sm:px-5">
        <p className="flex min-w-0 items-center gap-2.5 text-sm text-muted" aria-live="polite">
          <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />
          <span className="min-w-0">{status}</span>
        </p>
        {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
      </div>
      {children}
    </div>
  );
}

type BtnProps = React.ButtonHTMLAttributes<HTMLButtonElement> & { kind?: "primary" | "ghost" | "choice"; active?: boolean };

export function Btn({ kind = "primary", active = false, className = "", ...props }: BtnProps) {
  const base = "inline-flex min-h-10 items-center justify-center gap-2 rounded-lg px-4 text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-40";
  const look =
    kind === "primary"
      ? "bg-foreground text-background hover:bg-accent"
      : kind === "choice"
        ? `min-h-12 px-5 text-base ring-1 ring-inset ${active ? "bg-accent text-accent-foreground ring-accent" : "bg-background ring-border-strong hover:bg-surface"}`
        : "bg-background ring-1 ring-border-strong ring-inset hover:bg-surface";
  return <button type="button" className={`${base} ${look} ${className}`} {...props} />;
}

export function Readout({ value, label, note }: { value: React.ReactNode; label: string; note?: React.ReactNode }) {
  return (
    <div className="rounded-xl bg-surface p-4">
      <p className="text-[clamp(1.5rem,2.6vw,1.875rem)] font-medium leading-none tracking-[-0.02em] tabular-nums">{value}</p>
      <p className="mt-2 text-sm">{label}</p>
      {note && <p className="mt-1 text-caption text-muted">{note}</p>}
    </div>
  );
}

/** The dotted paper the experiments run on. */
export function Stage({ className = "", children, ...rest }: React.ComponentProps<"div">) {
  return (
    <div
      className={`relative bg-surface [background-image:radial-gradient(var(--color-border-strong)_1px,transparent_1px)] [background-size:22px_22px] ${className}`}
      {...rest}
    >
      {children}
    </div>
  );
}

/** A small note under a lab: caveats, what the measurement can and can't show. */
export function LabNote({ children }: { children: React.ReactNode }) {
  return <p className="text-caption text-muted">{children}</p>;
}

/* ── Chart ─────────────────────────────────────────────────────────────── */

type Tone = "accent" | "base";
type Pt = { x: number; y: number; tip?: string };

export interface PlotProps {
  /** One-sentence summary for screen readers. */
  label: string;
  xLabel: string;
  yLabel: string;
  x: [number, number];
  y: [number, number];
  xTicks?: number[];
  yTicks?: number[];
  xFormat?: (v: number) => string;
  yFormat?: (v: number) => string;
  logY?: boolean;
  height?: number;
  dots?: { name: string; tone: Tone; hollow?: boolean; pts: Pt[] }[];
  lines?: { name: string; tone: Tone; dashed?: boolean; pts: { x: number; y: number }[] }[];
  /** Reference lines, labelled at the right end. */
  hlines?: { y: number; label: string }[];
  /** A shaded reference range. */
  bands?: { y0: number; y1: number; label: string }[];
  /** Vertical event markers, labelled at the top (labels alternate height so neighbours don't collide). */
  vlines?: { x: number; label: string }[];
  legend?: { name: string; tone: Tone; kind: "dot" | "hollow" | "line" | "dash" }[];
  table?: { caption: string; head: string[]; rows: (string | number)[][] };
  empty?: string;
}

const fmt = (v: number) => (Math.abs(v) >= 1000 ? `${Math.round(v / 100) / 10}K` : Number(v.toFixed(2)).toString());

export function Plot({ label, xLabel, yLabel, x, y, xTicks, yTicks, xFormat = fmt, yFormat = fmt, logY = false, height = 260, dots = [], lines = [], hlines = [], bands = [], vlines = [], legend, table, empty }: PlotProps) {
  const [ref, width] = useWidth<HTMLDivElement>();
  const m = { l: 48, r: 18, t: 14, b: 36 };
  const iw = width - m.l - m.r;
  const ih = height - m.t - m.b;
  const ly = (v: number) => (logY ? Math.log10(Math.max(v, 1e-9)) : v);
  const sx = (v: number) => m.l + ((v - x[0]) / (x[1] - x[0])) * iw;
  const sy = (v: number) => m.t + ih - ((ly(v) - ly(y[0])) / (ly(y[1]) - ly(y[0]))) * ih;
  const yt = yTicks ?? niceTicks(y[0], y[1], 4);
  const xt = xTicks ?? niceTicks(x[0], x[1], 5);
  const color = (t: Tone) => (t === "accent" ? "var(--color-accent)" : BASE);
  const inX = (v: number) => v >= x[0] && v <= x[1];
  const hasData = dots.some((d) => d.pts.length) || lines.some((l) => l.pts.length);

  return (
    <figure className="m-0">
      <div className="mb-2 flex flex-wrap items-baseline justify-between gap-x-6 gap-y-1">
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">{yLabel}</p>
        {legend && legend.length > 1 && (
          <ul className="flex flex-wrap gap-x-4 gap-y-1 text-caption text-muted">
            {legend.map((l) => (
              <li key={l.name} className="flex items-center gap-1.5">
                <svg width="18" height="10" aria-hidden="true">
                  {l.kind === "dot" && <circle cx="9" cy="5" r="4" fill={color(l.tone)} />}
                  {l.kind === "hollow" && <circle cx="9" cy="5" r="3.5" fill="var(--color-background)" stroke={color(l.tone)} strokeWidth="2" />}
                  {(l.kind === "line" || l.kind === "dash") && <line x1="1" y1="5" x2="17" y2="5" stroke={color(l.tone)} strokeWidth="2" strokeDasharray={l.kind === "dash" ? "4 3" : undefined} strokeLinecap="round" />}
                </svg>
                {l.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <div ref={ref}>
        <svg viewBox={`0 0 ${width} ${height}`} width="100%" height={height} role="img" aria-label={label} className="block overflow-visible">
          {bands.map((b) => (
            <g key={b.label}>
              <rect x={m.l} width={iw} y={sy(b.y1)} height={Math.max(0, sy(b.y0) - sy(b.y1))} fill="var(--color-accent)" opacity="0.07" />
              <text x={m.l + iw - 4} y={sy(b.y1) + 13} textAnchor="end" fontSize="11" className="fill-muted">{b.label}</text>
            </g>
          ))}
          {yt.map((t) => (
            <g key={`y${t}`}>
              <line x1={m.l} x2={m.l + iw} y1={sy(t)} y2={sy(t)} stroke="var(--color-border)" strokeWidth="1" />
              <text x={m.l - 8} y={sy(t) + 4} textAnchor="end" fontSize="11" className="fill-muted tabular-nums">{yFormat(t)}</text>
            </g>
          ))}
          <line x1={m.l} x2={m.l + iw} y1={m.t + ih} y2={m.t + ih} stroke="var(--color-border-strong)" strokeWidth="1" />
          {xt.filter(inX).map((t) => (
            <text key={`x${t}`} x={sx(t)} y={m.t + ih + 18} textAnchor="middle" fontSize="11" className="fill-muted tabular-nums">{xFormat(t)}</text>
          ))}
          <text x={m.l + iw / 2} y={height - 2} textAnchor="middle" fontSize="11" className="fill-muted">{xLabel}</text>
          {hlines.map((h) => (
            <g key={h.label}>
              <line x1={m.l} x2={m.l + iw} y1={sy(h.y)} y2={sy(h.y)} stroke="var(--color-foreground)" strokeWidth="1" strokeDasharray="2 3" opacity="0.5" />
              <text x={m.l + iw - 4} y={sy(h.y) - 5} textAnchor="end" fontSize="11" className="fill-muted">{h.label}</text>
            </g>
          ))}
          {vlines.map((v, i) => (
            <g key={v.label}>
              <line x1={sx(v.x)} x2={sx(v.x)} y1={m.t + (i % 2 ? 16 : 2)} y2={m.t + ih} stroke="var(--color-foreground)" strokeWidth="1" strokeDasharray="3 3" opacity="0.45" />
              <text x={sx(v.x) + 4} y={m.t + (i % 2 ? 26 : 12)} fontSize="11" className="fill-muted">{v.label}</text>
            </g>
          ))}
          {lines.map((l) =>
            l.pts.length > 1 ? (
              <polyline key={l.name} points={l.pts.map((p) => `${sx(p.x)},${sy(p.y)}`).join(" ")} fill="none" stroke={color(l.tone)} strokeWidth="2" strokeLinejoin="round" strokeLinecap="round" strokeDasharray={l.dashed ? "5 4" : undefined} />
            ) : null,
          )}
          {dots.map((d) =>
            d.pts.map((p, i) => (
              <g key={`${d.name}${i}`}>
                <title>{p.tip ?? `${d.name}: ${xFormat(p.x)}, ${yFormat(p.y)}`}</title>
                <circle cx={sx(p.x)} cy={sy(Math.min(Math.max(p.y, y[0]), y[1]))} r="9" fill="transparent" />
                <circle cx={sx(p.x)} cy={sy(Math.min(Math.max(p.y, y[0]), y[1]))} r="4.5" fill={d.hollow ? "var(--color-background)" : color(d.tone)} stroke={d.hollow ? color(d.tone) : "var(--color-background)"} strokeWidth="2" />
              </g>
            )),
          )}
          {!hasData && empty && (
            <text x={m.l + iw / 2} y={m.t + ih / 2} textAnchor="middle" fontSize="13" className="fill-muted">{empty}</text>
          )}
        </svg>
      </div>
      {table && table.rows.length > 0 && (
        <details className="mt-3 text-sm">
          <summary className="w-fit cursor-pointer py-1 text-muted hover:text-foreground">Data as a table</summary>
          <div className="mt-2 max-h-64 overflow-auto rounded-lg ring-1 ring-border" tabIndex={0} role="region" aria-label={`${table.caption}, scrollable`}>
            <table className="w-full border-collapse text-left text-caption tabular-nums">
              <caption className="sr-only">{table.caption}</caption>
              <thead className="sticky top-0 bg-surface">
                <tr>{table.head.map((h) => <th key={h} scope="col" className="px-3 py-2 font-medium">{h}</th>)}</tr>
              </thead>
              <tbody>
                {table.rows.map((r, i) => (
                  <tr key={i} className="border-t border-border">{r.map((c, j) => <td key={j} className="px-3 py-1.5">{c}</td>)}</tr>
                ))}
              </tbody>
            </table>
          </div>
        </details>
      )}
    </figure>
  );
}

/** Milliseconds as "420 ms" or "1.2 s". */
export const ms = (v: number) => {
  const a = Math.abs(v);
  const sign = v < 0 && Math.round(a) !== 0 ? "−" : ""; // a true minus sign
  return a >= 1000 ? `${sign}${(a / 1000).toFixed(1)} s` : `${sign}${Math.round(a)} ms`;
};

/** A number with a true minus sign. */
export const num = (v: number, dp = 2) => (v < 0 ? `−${Math.abs(v).toFixed(dp)}` : v.toFixed(dp));
