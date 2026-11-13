"use client";

import { useState } from "react";
import { Shot } from "@/components/case/CaseParts";
import type { Chapter, Device } from "@/lib/work/healthai";

/**
 * The HealthAI journey, chapter by chapter, with one switch that changes every chapter's
 * screens between phone, tablet, tablet landscape and web. Only the chosen size's images
 * are mounted, so the page loads one set at a time.
 */
export default function DeviceJourney({ chapters, devices }: { chapters: Chapter[]; devices: { id: Device; label: string; size: string }[] }) {
  const [device, setDevice] = useState<Device>("phone");
  const current = devices.find((d) => d.id === device)!;

  return (
    <div>
      <div className="sticky top-[72px] z-20 -mx-4 border-b border-border bg-background/95 px-4 py-3 backdrop-blur supports-[backdrop-filter]:bg-background/85 sm:mx-0 sm:px-0">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
          <p id="device-switch-label" className="text-caption text-muted">
            Show screens for
          </p>
          <div role="group" aria-labelledby="device-switch-label" className="flex flex-wrap gap-1 rounded-lg bg-surface p-1 ring-1 ring-border ring-inset">
            {devices.map((d) => (
              <button
                key={d.id}
                type="button"
                aria-pressed={d.id === device}
                onClick={() => setDevice(d.id)}
                className={`min-h-9 rounded-md px-3 text-sm transition-colors ${
                  d.id === device ? "bg-background font-medium text-foreground shadow-[0_0_0_1px_var(--color-border)]" : "text-muted hover:text-foreground"
                }`}
              >
                {d.label}
              </button>
            ))}
          </div>
          <p className="font-mono text-xs text-muted" aria-live="polite">
            {current.label} · {current.size}
          </p>
        </div>
      </div>

      <ol className="mt-14 grid gap-20 md:gap-24">
        {chapters.map((ch) => {
          const shots = ch.screens[device];
          return (
            <li key={ch.n} className="grid gap-8 lg:grid-cols-[minmax(0,4fr)_minmax(0,8fr)] lg:gap-14">
              <div className="lg:sticky lg:top-[150px] lg:self-start">
                <p className="font-mono text-xs tracking-[0.06em] text-accent">
                  {ch.n} · {shots.length} {shots.length === 1 ? "screen" : "screens"}
                </p>
                <h3 className="mt-3 text-2xl tracking-[-0.02em]">{ch.title}</h3>
                <p className="mt-4 max-w-[46ch] leading-relaxed text-muted">{ch.body}</p>
                <p className="mt-5 max-w-[46ch] border-l-2 border-accent pl-3 text-compact leading-relaxed">{ch.decision}</p>
              </div>
              <Shots device={device} shots={shots} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}

function Shots({ device, shots }: { device: Device; shots: Chapter["screens"][Device] }) {
  // Fixed columns per size, so a screen is the same size in every chapter.
  if (device === "phone") {
    return (
      <ul className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {shots.map((s) => (
          <li key={s.src}>
            <Shot image={s} rounded="rounded-[20px]" sizes="(min-width: 1024px) 190px, (min-width: 640px) 30vw, 45vw" caption={`${s.code} · ${s.label}`} />
          </li>
        ))}
      </ul>
    );
  }
  if (device === "tablet") {
    return (
      <ul className="grid gap-5 sm:grid-cols-2">
        {shots.map((s) => (
          <li key={s.src}>
            <Shot image={s} rounded="rounded-[18px]" sizes="(min-width: 1024px) 380px, (min-width: 640px) 50vw, 100vw" caption={`${s.code} · ${s.label}`} />
          </li>
        ))}
      </ul>
    );
  }
  return (
    <ul className="grid gap-6">
      {shots.map((s) => (
        <li key={s.src}>
          <Shot image={s} rounded={device === "landscape" ? "rounded-[18px]" : "rounded-xl"} sizes="(min-width: 1024px) 760px, 100vw" caption={`${s.code} · ${s.label}`} />
        </li>
      ))}
    </ul>
  );
}
