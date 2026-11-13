import type { CSSProperties } from "react";
import type { Sketch as SketchKind } from "@/lib/home";
import s from "./home.module.css";

/**
 * Placeholder "screens" drawn in CSS — one distinct sketch per project so the
 * grid reads as real work until screenshots replace them. Decorative only.
 */
export default function Sketch({ kind }: { kind: SketchKind }) {
  switch (kind) {
    case "agentic":
      return (
        <div className={`${s.mock} ${s.agentic}`}>
          <div className={s.canvas}>
            <div className={s.th}><i /><i /><i /><i /></div>
            {[
              "", "add", "", "add", "del", "", "", "add", "", "",
            ].map((kind, i) => (
              <div key={i} className={`${s.tr} ${kind === "add" ? s.trAdd : ""} ${kind === "del" ? s.trDel : ""}`}>
                <i style={{ width: `${60 + ((i * 17) % 35)}%` }} /><i /><i style={{ width: `${55 + ((i * 23) % 40)}%` }} /><i />
              </div>
            ))}
          </div>
          <div className={s.car}>
            <div className={s.prop}>
              <span className={s.pk}>Proposal</span>
              <i /><i style={{ width: "70%" }} />
              <div className={s.diff}><span>+3</span><span>−1</span></div>
              <div className={s.evd}><i /><i /><i /></div>
              <div className={s.btns}><i className={s.ok} /><i /></div>
            </div>
            <div className={s.prop}><i style={{ width: "40%" }} /><i /><i style={{ width: "80%" }} /></div>
            <div className={s.prop}><i style={{ width: "55%" }} /><i /></div>
          </div>
        </div>
      );
    case "builder":
      return (
        <div className={`${s.mock} ${s.builder}`}>
          <div className={s.bTop}><i /><i /><i /></div>
          <div className={s.bSide}><i /><i /><i /><i /><i /></div>
          <div className={s.bCanvas}>
            <div className={s.blk}><i className={s.h} /><i style={{ width: "65%" }} /></div>
            <div className={`${s.blk} ${s.sel}`}><i style={{ width: "28%" }} /><i className={s.f} /></div>
            <div className={s.blk}><i className={s.b} /></div>
          </div>
          <div className={s.bProps}><i /><i /><i /><i /></div>
        </div>
      );
    case "timeline":
      return (
        <div className={`${s.mock} ${s.timeline}`}>
          {["07:00", "08:30", "09:30", "11:00", "12:30", "13:30", "15:00", "16:00"].map((t, i) => (
            <TimelineRow key={t} time={t} accent={i === 0 || i === 3 || i === 6} />
          ))}
        </div>
      );
    case "gantt":
      return (
        <div className={`${s.mock} ${s.gantt}`}>
          {[
            [0, 45, false], [20, 50, true], [35, 30, false], [50, 40, false], [62, 28, true], [70, 25, false],
          ].map(([start, width, accent], i) => (
            <div key={i} className={s.row}>
              <i style={{ width: `${60 + ((i * 13) % 35)}%` }} />
              <span
                className={`${s.bar} ${accent ? s.barAcc : ""}`}
                style={{ marginLeft: `${start}%`, width: `${width}%` } as CSSProperties}
              />
            </div>
          ))}
        </div>
      );
    case "tokens":
      return (
        <div className={`${s.mock} ${s.tokens}`}>
          {[100, 65, 35].map((p) => (
            <i key={`t${p}`} className={s.sw} style={{ background: `color-mix(in srgb, var(--color-foreground) ${p}%, var(--color-background))` }} />
          ))}
          <i className={s.sw} style={{ background: "var(--color-border-strong)" }} />
          <i className={s.sw} style={{ background: "var(--color-border)" }} />
          <i className={s.sw} style={{ background: "var(--color-surface)" }} />
          {[100, 70, 45, 25, 12, 6].map((p) => (
            <i key={`a${p}`} className={s.sw} style={{ background: `color-mix(in srgb, var(--color-accent) ${p}%, var(--color-background))` }} />
          ))}
          <i className={s.ln} style={{ height: 14, width: "60%", background: "var(--color-border-strong)" }} />
          <i className={s.ln} style={{ height: 10, width: "45%" }} />
          <i className={s.ln} style={{ width: "75%" }} />
          <i className={s.ln} style={{ width: "65%" }} />
        </div>
      );
  }
}

function TimelineRow({ time, accent }: { time: string; accent: boolean }) {
  return (
    <>
      <span className={s.mt}>{time}</span>
      <i className={`${s.ev} ${accent ? s.evAcc : ""}`} />
    </>
  );
}
