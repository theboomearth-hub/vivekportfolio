"use client";

import { CircleCheck, CircleDashed, TriangleAlert } from "lucide-react";
import type { Check } from "@/lib/hosamane/types";

/** The agent's mark: a house outline with a spark. Used only where the agent speaks or acts. */
export function AgentMark({ size = 22, className = "" }: { size?: number; className?: string }) {
  return (
    <svg viewBox="0 0 24 24" width={size} height={size} aria-hidden="true" className={className} fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
      <path d="M3.5 11.2 12 4l8.5 7.2" />
      <path d="M5.5 9.8V20h13V9.8" />
      <path d="M12 11.2v4.6M9.7 13.5h4.6" />
    </svg>
  );
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2 text-hm-primary">
      <span className="grid h-8 w-8 place-items-center rounded-[10px] bg-hm-primary text-white"><AgentMark size={20} /></span>
      {!compact && <span className="text-[17px] font-medium tracking-[-0.01em] text-hm-ink">Hosamane</span>}
    </span>
  );
}

export function Photo({ src, alt = "", className = "", ratio = "aspect-[4/3]" }: { src: string; alt?: string; className?: string; ratio?: string }) {
  return (
    <span className={`photo-box relative block overflow-hidden bg-hm-surface ${ratio} ${className}`}>
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={src} alt={alt} className="photo h-full w-full object-cover" loading="lazy" />
    </span>
  );
}

export function StatusIcon({ state, size = 16 }: { state: Check["state"]; size?: number }) {
  if (state === "pass") return <CircleCheck size={size} className="shrink-0 text-hm-ok" aria-label="Passed" />;
  if (state === "warn") return <TriangleAlert size={size} className="shrink-0 text-hm-warn" aria-label="Flag" />;
  return <CircleDashed size={size} className="shrink-0 text-hm-muted" aria-label="Not done yet" />;
}

export function Chip({ children, tone = "plain", onClick, title }: { children: React.ReactNode; tone?: "plain" | "assumed" | "warn" | "ok" | "primary"; onClick?: () => void; title?: string }) {
  const cls = {
    plain: "bg-hm-card text-hm-ink ring-hm-line",
    assumed: "bg-hm-surface text-hm-muted ring-hm-line border-dashed",
    warn: "bg-hm-warn-soft text-hm-warn ring-transparent",
    ok: "bg-hm-ok-soft text-hm-ok ring-transparent",
    primary: "bg-hm-primary-soft text-hm-primary-strong ring-transparent",
  }[tone];
  const Tag = onClick ? "button" : "span";
  return (
    <Tag type={onClick ? "button" : undefined} onClick={onClick} title={title} className={`inline-flex min-h-8 items-center gap-1.5 rounded-full px-3 text-hm-caption ring-1 ring-inset ${cls} ${onClick ? "hover:ring-hm-control" : ""}`}>
      {children}
    </Tag>
  );
}

export function Card({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <div className={`rounded-hm-card bg-hm-card ring-1 ring-hm-line ${className}`}>{children}</div>;
}

export function Label({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <p className={`text-hm-label font-medium uppercase tracking-[0.06em] text-hm-muted ${className}`}>{children}</p>;
}

export function Button({ children, onClick, kind = "primary", disabled, className = "", type = "button", ariaLabel }: { children: React.ReactNode; onClick?: () => void; kind?: "primary" | "secondary" | "quiet" | "danger"; disabled?: boolean; className?: string; type?: "button" | "submit"; ariaLabel?: string }) {
  const cls = {
    primary: "bg-hm-primary text-white hover:bg-hm-primary-strong",
    secondary: "bg-hm-card text-hm-ink ring-1 ring-inset ring-hm-control hover:bg-hm-surface",
    quiet: "text-hm-primary hover:bg-hm-primary-soft",
    danger: "bg-hm-card text-hm-danger ring-1 ring-inset ring-hm-danger/40 hover:bg-hm-danger-soft",
  }[kind];
  return (
    <button type={type} onClick={onClick} disabled={disabled} aria-label={ariaLabel} className={`inline-flex min-h-11 items-center justify-center gap-2 rounded-hm-control px-4 text-hm-compact font-medium transition-colors disabled:opacity-50 ${cls} ${className}`}>
      {children}
    </button>
  );
}
