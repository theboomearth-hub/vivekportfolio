"use client";

import { useEffect, useLayoutEffect, useRef, useState, useSyncExternalStore, type ReactNode } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { anchors, DEFAULT_ORDER, roles, type CardId, type FactLabel } from "@/lib/home";
import { CONTACT_EMAIL } from "@/lib/site";
import { SendButton, Spark, useAgent } from "./Agent";
import s from "./home.module.css";

/* ── Quiet entrance: opacity + 8px, once ─────────────────────────── */
export function Reveal({ children, delay = 0, className }: { children: ReactNode; delay?: number; className?: string }) {
  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y: 8 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "0px 0px -6% 0px" }}
      transition={{ duration: 0.9, delay: delay / 1000, ease: [0.22, 0.61, 0.36, 1] }}
    >
      {children}
    </motion.div>
  );
}

/* ── Hero prompt ─────────────────────────────────────────────────── */
const HERO_PROMPTS = [
  { label: "Give me a 2-minute tour", text: "Give me a 2-minute tour" },
  { label: "Tailor this page for me", text: "Tailor this page for me" },
  { label: "Fit for a design-systems lead?", text: "Is he a fit for a design-systems lead?" },
];

export function HeroAsk() {
  const { ask, busy } = useAgent();
  const [value, setValue] = useState("");
  return (
    <div id={anchors.heroAsk}>
      <form
        className="mt-10 flex max-w-[600px] items-center gap-3 rounded-[14px] bg-background py-2 pl-4 pr-2 shadow-[0_0_0_1px_var(--color-border-strong),0_1px_2px_rgb(15_15_16/0.04),0_14px_36px_-18px_rgb(15_15_16/0.14)] transition-shadow focus-within:shadow-[0_0_0_1.5px_var(--color-accent),0_14px_36px_-18px_rgb(15_15_16/0.18)]"
        onSubmit={(e) => {
          e.preventDefault();
          const text = value.trim();
          if (!text || busy) return;
          setValue("");
          ask(text);
        }}
      >
        <Spark className="h-4 w-4 text-accent" />
        <label htmlFor="hero-input" className="sr-only">
          Ask the portfolio agent
        </label>
        <input
          id="hero-input"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          autoComplete="off"
          placeholder="Ask my agent, or tell it what you need…"
          className="min-h-10 min-w-0 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
        />
        <kbd aria-hidden="true" className="hidden rounded-[5px] bg-background px-1.5 py-1 font-mono text-xs leading-none text-muted ring-1 ring-border-strong ring-inset sm:inline">
          ⌘K
        </kbd>
        <SendButton />
      </form>
      <div role="group" aria-label="Suggested requests" className="mt-3.5 flex max-w-[640px] flex-wrap gap-2">
        {HERO_PROMPTS.map((p) => (
          <button
            key={p.text}
            type="button"
            disabled={busy}
            onClick={() => ask(p.text)}
            className="min-h-9 whitespace-nowrap rounded-full px-3.5 text-sm text-muted ring-1 ring-border ring-inset transition-colors hover:bg-surface hover:text-foreground hover:ring-border-strong disabled:cursor-default"
          >
            {p.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/* ── "For <role>" note the agent adds under the intro ───────────── */
export function ForYouNote() {
  const { role } = useAgent();
  if (!role) return null;
  const r = roles[role];
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      className="mt-5 grid max-w-[600px] gap-1 rounded-xl bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-background))] px-4 py-3 ring-1 ring-[color-mix(in_srgb,var(--color-accent)_22%,transparent)] ring-inset"
    >
      <p className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-[0.06em] text-accent">
        <Spark className="h-3 w-3" />
        For {r.label}
      </p>
      <p className="text-compact">{r.note}</p>
    </motion.div>
  );
}

/* ── Project grid: reorders (with a FLIP animation) when tailored ── */
export function ProjectGrid({ items }: { items: { id: CardId; node: ReactNode }[] }) {
  const { role } = useAgent();
  const reduce = useReducedMotion();
  const order = role ? roles[role].order : DEFAULT_ORDER;
  const sorted = [...items].sort((a, b) => order.indexOf(a.id) - order.indexOf(b.id));
  const nodes = useRef(new Map<CardId, HTMLElement>());
  const last = useRef(new Map<CardId, { x: number; y: number }>());
  const orderKey = order.join();

  // Positions are measured relative to the grid (offsetLeft/Top), so page
  // scrolling between renders doesn't skew the animation.
  useLayoutEffect(() => {
    const next = new Map<CardId, { x: number; y: number }>();
    nodes.current.forEach((el, id) => {
      const pos = { x: el.offsetLeft, y: el.offsetTop };
      next.set(id, pos);
      const prev = last.current.get(id);
      if (prev && !reduce) {
        const dx = prev.x - pos.x;
        const dy = prev.y - pos.y;
        if (dx || dy) {
          el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], {
            duration: 600,
            easing: "cubic-bezier(.22,.61,.36,1)",
          });
        }
      }
    });
    last.current = next;
  }, [orderKey, reduce]);

  return (
    <div className="relative mt-14 grid gap-x-8 gap-y-12 md:mt-20 md:grid-cols-2 md:gap-y-14">
      {sorted.map((item) => (
        <div
          key={item.id}
          ref={(el) => {
            if (el) nodes.current.set(item.id, el);
            else nodes.current.delete(item.id);
          }}
        >
          {item.node}
        </div>
      ))}
    </div>
  );
}

/* ── Facts list: rows the agent highlights for a role ───────────── */
export function Facts({ rows }: { rows: { label: FactLabel; node: ReactNode }[] }) {
  const { role } = useAgent();
  const lit = role ? roles[role].facts : [];
  return (
    <dl id={anchors.facts} className="border-t border-border">
      {rows.map((row) => {
        const on = lit.includes(row.label);
        return (
          <div
            key={row.label}
            className={`grid gap-0.5 border-b border-border py-3.5 text-compact transition-[background-color,box-shadow,padding] duration-500 sm:grid-cols-[140px_minmax(0,1fr)] sm:gap-4 ${
              on ? "bg-[color-mix(in_srgb,var(--color-accent)_6%,transparent)] pl-3.5 shadow-[inset_2px_0_0_var(--color-accent)]" : ""
            }`}
          >
            <dt className="text-muted">{row.label}</dt>
            <dd>{row.node}</dd>
          </div>
        );
      })}
    </dl>
  );
}

/* ── Contact actions + local times ──────────────────────────────── */
function subscribeMinute(cb: () => void) {
  const id = setInterval(cb, 30_000);
  return () => clearInterval(id);
}
function localTimes() {
  const now = new Date();
  const ist = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit", timeZone: "Asia/Kolkata" }).format(now);
  const tz = Intl.DateTimeFormat().resolvedOptions().timeZone;
  if (tz === "Asia/Kolkata" || tz === "Asia/Calcutta") return `It’s ${ist} in Bengaluru.`;
  const mine = new Intl.DateTimeFormat("en-GB", { hour: "2-digit", minute: "2-digit" }).format(now);
  return `It’s ${ist} in Bengaluru, ${mine} where you are.`;
}

export function ContactTimes() {
  // Server renders nothing (it can't know the visitor's zone); the client fills it in.
  const text = useSyncExternalStore(subscribeMinute, localTimes, () => "");
  return <span>{text}</span>;
}

export function ContactActions() {
  const { role, ask } = useAgent();
  const [copied, setCopied] = useState(false);
  useEffect(() => {
    if (!copied) return;
    const t = setTimeout(() => setCopied(false), 1800);
    return () => clearTimeout(t);
  }, [copied]);
  return (
    <div className="mt-9 flex flex-wrap items-center gap-3">
      <a
        href={`mailto:${CONTACT_EMAIL}`}
        className="inline-flex min-h-11 items-center rounded-lg bg-foreground px-5 text-compact font-medium text-background transition-colors hover:bg-accent"
      >
        {role ? roles[role].cta : "Email me"}
      </a>
      <button
        type="button"
        onClick={async () => {
          try {
            await navigator.clipboard.writeText(CONTACT_EMAIL);
            setCopied(true);
          } catch {
            window.prompt("Copy the email address:", CONTACT_EMAIL);
          }
        }}
        className="inline-flex min-h-11 items-center rounded-lg px-5 text-compact font-medium ring-1 ring-border-strong ring-inset transition-colors hover:bg-surface"
      >
        {copied ? "Copied" : "Copy email address"}
        <span role="status" className="sr-only">
          {copied ? "Email address copied" : ""}
        </span>
      </button>
      <button
        type="button"
        onClick={() => ask("Find a time to talk")}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm ring-1 ring-border-strong ring-inset transition-colors hover:bg-surface"
      >
        <Spark className="h-3.5 w-3.5 text-accent" />
        Find a time with the agent
      </button>
    </div>
  );
}

/* ── Inline "Summarize" for the flagship case study ─────────────── */
const SUMMARY_STEPS = ["Reading the case study", "Writing a three-line brief"];

export function Summarize({ lines }: { lines: string[] }) {
  const reduce = useReducedMotion();
  const [open, setOpen] = useState(false);
  const [started, setStarted] = useState(false);
  const [stepsDone, setStepsDone] = useState(0);
  const [shown, setShown] = useState<string[]>([]);
  const steps = SUMMARY_STEPS;
  const done = shown.length === lines.length && shown.at(-1) === lines.at(-1);

  useEffect(() => {
    if (!started) return;
    let cancelled = false;
    const wait = (ms: number) => new Promise((r) => setTimeout(r, reduce ? 0 : ms));
    (async () => {
      for (let i = 0; i < SUMMARY_STEPS.length; i++) {
        await wait(480);
        if (cancelled) return;
        setStepsDone(i + 1);
      }
      for (let n = 0; n < lines.length; n++) {
        const line = lines[n];
        for (let c = 0; c <= line.length; c += 3) {
          if (!reduce) await wait(12);
          if (cancelled) return;
          setShown((sh) => [...sh.slice(0, n), line.slice(0, Math.min(line.length, c + 3))]);
        }
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [started, reduce, lines]);

  return (
    <>
      <button
        type="button"
        aria-expanded={open}
        aria-controls="flagship-summary"
        onClick={() => {
          setOpen((o) => !o);
          setStarted(true);
        }}
        className="inline-flex min-h-9 items-center gap-1.5 rounded-full px-3 text-sm ring-1 ring-border-strong ring-inset transition-colors hover:bg-surface"
      >
        <Spark className="h-3.5 w-3.5 text-accent" />
        {open && done ? "Hide summary" : "Summarize"}
      </button>
      <div
        id="flagship-summary"
        hidden={!open}
        aria-live="polite"
        aria-busy={open && !done}
        className="mt-4 grid max-w-[520px] basis-full gap-2.5 rounded-xl bg-surface p-4"
      >
        <div className="grid gap-1">
          <p className="text-caption text-muted">{stepsDone < steps.length ? <span className={s.shimmer}>Working</span> : "Done in 2 steps"}</p>
          <ol className="grid gap-1">
            {steps.slice(0, Math.min(steps.length, stepsDone + 1)).map((step, i) => (
              <li key={step} className="flex items-center gap-2 text-caption text-muted">
                {i < stepsDone ? (
                  <span aria-hidden="true" className="grid h-3.5 w-3.5 place-items-center rounded-full bg-foreground text-background">
                    <svg viewBox="0 0 24 24" className="h-2.5 w-2.5" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M5 12.5l4.5 4.5L19 7.5" />
                    </svg>
                  </span>
                ) : (
                  <span aria-hidden="true" className={`h-3.5 w-3.5 rounded-full ${s.spinner}`} />
                )}
                {step}
              </li>
            ))}
          </ol>
        </div>
        {shown.length > 0 && (
          <ul className="grid list-disc gap-1.5 pl-5 text-compact marker:text-muted">
            {shown.map((line, i) => (
              <li key={i}>{line}</li>
            ))}
          </ul>
        )}
      </div>
    </>
  );
}
