"use client";

import { useEffect, useRef } from "react";

/**
 * Draws a sketch in once, the first time it scrolls into view.
 *
 * The server renders every drawing complete, so it reads fine without JavaScript, in a thumbnail and for
 * anyone who prefers reduced motion. Only a drawing that starts below the fold is hidden on mount and then
 * traced in: paths with `.sk-draw` (and pathLength=1) draw along their length; `.sk-fade` elements rise in.
 * Stagger with the `--sk-i` custom property. Styles live in globals.css (Sketch kit).
 */
export default function DrawOnView({ children, className = "", ...rest }: { children: React.ReactNode; className?: string } & Omit<React.HTMLAttributes<HTMLDivElement>, "children" | "className">) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return; // Already on screen: leave it drawn.
    el.dataset.draw = "pending";
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        el.dataset.draw = "run";
        io.disconnect();
      },
      { threshold: 0.2 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={ref} className={className} {...rest}>
      {children}
    </div>
  );
}
