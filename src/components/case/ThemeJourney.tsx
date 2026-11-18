"use client";

import { useState } from "react";
import { Shot } from "@/components/case/CaseParts";
import type { Theme, ThemeChapter } from "@/lib/work/ambient-memory";

/**
 * The Ambient Memory screens, chapter by chapter, with one switch that changes every chapter between the
 * light and the dark theme. Both themes come from one set of variables, so the switch is the proof.
 * Only the chosen theme's images are mounted.
 */
export default function ThemeJourney({ chapters }: { chapters: ThemeChapter[] }) {
  const [theme, setTheme] = useState<Theme>("light");
  const total = chapters.reduce((n, c) => n + c.screens[theme].length, 0);

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:mx-0 sm:px-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p id="theme-switch-label" className="text-caption text-muted">Show the screens in</p>
          <div role="group" aria-labelledby="theme-switch-label" className="flex gap-1 rounded-lg bg-surface p-1 ring-1 ring-border ring-inset">
            {(["light", "dark"] as const).map((t) => (
              <button
                key={t}
                type="button"
                aria-pressed={t === theme}
                onClick={() => setTheme(t)}
                className={`inline-flex min-h-9 items-center gap-2 rounded-md px-3 text-sm capitalize transition-colors ${t === theme ? "bg-background font-medium text-foreground shadow-[0_0_0_1px_var(--color-border)]" : "text-muted hover:text-foreground"}`}
              >
                <span aria-hidden="true" className="h-3 w-3 rounded-full ring-1 ring-border-strong" style={{ background: t === "light" ? "#F5F2EA" : "#0D0E12" }} />
                {t}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">{total} screens · 390 × 844 · one token set</p>
        </div>
      </div>

      <ol className="mt-14 grid gap-20 md:gap-24">
        {chapters.map((ch) => {
          const shots = ch.screens[theme];
          return (
            <li key={ch.n} className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="lg:sticky lg:top-[150px] lg:self-start">
                <p className="font-mono text-xs tracking-[0.06em] text-accent">{ch.n} · {shots.length} {shots.length === 1 ? "screen" : "screens"}</p>
                <h3 className="mt-3">{ch.title}</h3>
                <p className="mt-4 max-w-[46ch] leading-relaxed text-muted">{ch.body}</p>
                <p className="mt-5 max-w-[46ch] border-l-2 border-accent pl-3 text-compact leading-relaxed">{ch.decision}</p>
              </div>
              <div className={`rounded-3xl p-4 ring-1 ring-inset sm:p-6 lg:p-8 ${theme === "dark" ? "bg-[#1B1E25] ring-[#2A2E38]" : "bg-background ring-border"}`}>
                <ul className="grid grid-cols-2 gap-5 sm:grid-cols-3">
                  {shots.map((s) => (
                    <li key={s.src} className={theme === "dark" ? "[&_figcaption]:text-[#B9B6AD]" : ""}>
                      <Shot image={s} rounded="rounded-[22px]" sizes="(min-width: 1024px) 240px, (min-width: 640px) 30vw, 45vw" caption={`${s.code} · ${s.label}`} />
                    </li>
                  ))}
                </ul>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
