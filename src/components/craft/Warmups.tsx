"use client";

/** The two original micro-interactions, kept as warm-ups at the end of the craft page. */

import { useCallback, useRef, useState } from "react";
import FluidText from "@/components/FluidText";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ#@$%&";

export function ScrambleDemo() {
  const [text, setText] = useState("hover to decode");
  const running = useRef(false);

  const scramble = useCallback(() => {
    if (running.current) return;
    running.current = true;
    const target = "signal from noise";
    let i = 0;
    const total = 12;
    const id = setInterval(() => {
      i++;
      const revealed = Math.floor((i / total) * target.length);
      setText(target.split("").map((c, idx) => (idx < revealed ? c : CHARS[Math.floor(Math.random() * CHARS.length)])).join(""));
      if (i >= total) {
        clearInterval(id);
        setText(target);
        setTimeout(() => {
          setText("hover to decode");
          running.current = false;
        }, 1500);
      }
    }, 45);
  }, []);

  return (
    <button type="button" onMouseEnter={scramble} onFocus={scramble} className="font-mono text-xl tracking-tight text-accent sm:text-2xl">
      {text}
    </button>
  );
}

export function WeightDemo() {
  return (
    <span className="text-2xl sm:text-3xl">
      <FluidText text="move across me" minWeight={300} maxWeight={800} radius={90} />
    </span>
  );
}
