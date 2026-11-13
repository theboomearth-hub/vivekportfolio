"use client";

import { useRef, useEffect } from "react";

interface FluidTextProps {
  text: string;
  className?: string;
  minWeight?: number;
  maxWeight?: number;
  radius?: number;
}

export default function FluidText({
  text,
  className = "",
  minWeight = 300,
  maxWeight = 900,
  radius = 120,
}: FluidTextProps) {
  const letterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  useEffect(() => {
    let mouse = { x: -1000, y: -1000 };
    let rafId = 0;

    // The frame loop lives inside the effect so it can schedule itself
    // without referencing a callback before it is declared.
    const tick = () => {
      for (const el of letterRefs.current) {
        if (!el) continue;
        const rect = el.getBoundingClientRect();
        const cx = rect.left + rect.width / 2;
        const cy = rect.top + rect.height / 2;
        const dist = Math.hypot(mouse.x - cx, mouse.y - cy);
        const t = Math.max(0, 1 - dist / radius);
        el.style.fontWeight = String(Math.round(minWeight + t * (maxWeight - minWeight)));
      }
      rafId = requestAnimationFrame(tick);
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse = { x: e.clientX, y: e.clientY };
    };
    const handleMouseLeave = () => {
      mouse = { x: -1000, y: -1000 };
    };

    window.addEventListener("mousemove", handleMouseMove);
    document.addEventListener("mouseleave", handleMouseLeave);
    rafId = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      cancelAnimationFrame(rafId);
    };
  }, [minWeight, maxWeight, radius]);

  return (
    <span className={className}>
      {/* aria-label is ignored on a plain <span>; screen readers get real text
          instead, and the per-letter spans are hidden from them. */}
      <span className="sr-only">{text}</span>
      <span aria-hidden="true">
        {text.split("").map((char, i) => (
          <span
            key={`${char}-${i}`}
            ref={(el) => {
              letterRefs.current[i] = el;
            }}
            className="inline-block transition-[font-weight] duration-100"
            style={{ fontWeight: minWeight }}
          >
            {char === " " ? " " : char}
          </span>
        ))}
      </span>
    </span>
  );
}
