"use client";

import { useEffect, useRef, useState } from "react";

/**
 * A figure that counts up once, when it first scrolls into view.
 *
 * Renders the final value on the server, so it's right without JavaScript and in thumbnails. It only counts a
 * value with exactly one number in it ("536", "4.4 s", "₹1,450 Cr", "−62%"), and never a year or a range
 * ("Oct 2024", "6–9 months", "30 / 30" stay as they are). Off under reduced motion.
 */
const ONE_NUMBER = /^([^\d]*)(\d[\d,]*(?:\.\d+)?)([^\d]*)$/;

export default function CountUp({ value, duration = 1100 }: { value: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [shown, setShown] = useState(value);

  useEffect(() => {
    const el = ref.current;
    const m = value.match(ONE_NUMBER);
    if (!el || !m || globalThis.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const [, pre, num, post] = m;
    const target = Number(num.replace(/,/g, ""));
    const decimals = num.includes(".") ? num.split(".")[1].length : 0;
    const grouped = num.includes(",");
    const isYear = !grouped && decimals === 0 && target >= 1900 && target <= 2100;
    if (isYear || target === 0) return;
    const box = el.getBoundingClientRect();
    if (box.top < window.innerHeight && box.bottom > 0) return; // Already visible on load: leave the final value.

    const format = (n: number) => {
      const fixed = n.toFixed(decimals);
      if (!grouped) return fixed;
      const [int, dec] = fixed.split(".");
      // Indian grouping when the source used it (1,40,000), otherwise thousands (1,450).
      const indian = /\d,\d{2},\d{3}/.test(num);
      const withCommas = indian ? Number(int).toLocaleString("en-IN") : Number(int).toLocaleString("en-US");
      return dec ? `${withCommas}.${dec}` : withCommas;
    };

    // Reset to zero on the next frame (off-screen, so nobody sees it), then count up when it scrolls into view.
    let raf = requestAnimationFrame(() => setShown(`${pre}${format(0)}${post}`));
    const io = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        io.disconnect();
        const start = performance.now();
        const tick = (now: number) => {
          const t = Math.min(1, (now - start) / duration);
          const eased = 1 - Math.pow(2, -10 * t); // ease-out-expo, as in the site's motion tokens
          setShown(t >= 1 ? value : `${pre}${format(target * eased)}${post}`);
          if (t < 1) raf = requestAnimationFrame(tick);
        };
        raf = requestAnimationFrame(tick);
      },
      { threshold: 0.4 },
    );
    io.observe(el);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value, duration]);

  return (
    <span ref={ref}>
      <span className="sr-only">{value}</span>
      <span aria-hidden="true">{shown}</span>
    </span>
  );
}
