import Image from "next/image";
import DrawOnView from "@/components/sketch/DrawOnView";

/**
 * The homepage flagship as a composed product shot rather than one raw app screenshot.
 *
 * Three real MW-Inventory screens, cropped to the part that matters: the media plan answer in an app window, with
 * the live pacing chart and the screen search floating beside it. The six campaign stages run along the top, with the
 * three on show picked out. The window runs off the bottom edge of the stage on purpose. Decorative: the case-study
 * title and text below carry the content, so everything here is hidden from assistive tech.
 */

const STAGES = ["Discover", "Plan", "Propose", "Book", "Monitor", "Learn"] as const;
const SHOWN = new Set(["Discover", "Plan", "Monitor"]);

type Box = { x0: number; x1: number; y0: number; y1: number };

/** Shows one rectangle of a w×h image at the container's full width. Percent offsets keep it exact at any size. */
function Crop({ src, w, h, box, sizes, priority = false }: { src: string; w: number; h: number; box: Box; sizes: string; priority?: boolean }) {
  const cw = box.x1 - box.x0;
  const ch = box.y1 - box.y0;
  return (
    <div className="relative w-full overflow-hidden" style={{ aspectRatio: `${cw} / ${ch}` }}>
      <Image
        src={src}
        alt=""
        width={w}
        height={h}
        sizes={sizes}
        priority={priority}
        className="absolute h-auto max-w-none"
        style={{ width: `${(w / cw) * 100}%`, left: `${(-box.x0 / cw) * 100}%`, top: `${(-box.y0 / ch) * 100}%` }}
      />
    </div>
  );
}

function Tag({ n, children }: { n: number; children: React.ReactNode }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-background px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] text-accent shadow-[0_0_0_1px_var(--color-border)]">
      <span className="text-muted">{String(n).padStart(2, "0")}</span>
      {children}
    </span>
  );
}

const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;
const float = "shadow-[0_0_0_1px_var(--color-border),0_28px_60px_-28px_rgb(15_15_16/0.28)]";

export default function FlagshipStage() {
  return (
    <DrawOnView className="relative overflow-hidden rounded-[20px] bg-surface ring-1 ring-border ring-inset md:aspect-[1200/660]">
      {/* Faint dot grid, the same paper the sketches sit on. */}
      <div aria-hidden="true" className="absolute inset-0 [background-image:radial-gradient(var(--color-border-strong)_1px,transparent_1px)] [background-size:22px_22px] opacity-50" />

      {/* The six stages of one campaign, in one conversation. */}
      <ol className="sk-fade relative flex flex-wrap items-center gap-x-1.5 gap-y-2 px-5 pt-6 md:px-12 md:pt-9" style={sk(0)}>
        {STAGES.map((st, i) => (
          <li key={st} className="flex items-center gap-1.5">
            <span className={`rounded-full px-2.5 py-1 font-mono text-[11px] uppercase tracking-[0.06em] ${SHOWN.has(st) ? "bg-accent-light text-accent" : "text-muted"}`}>{st}</span>
            {i < STAGES.length - 1 && <span aria-hidden="true" className="h-px w-3 bg-border-strong md:w-5" />}
          </li>
        ))}
      </ol>

      <div className="relative mt-6 grid items-start px-5 md:mt-7 md:grid-cols-[minmax(0,58fr)_minmax(0,42fr)] md:px-12">
        {/* Main: the media plan the agent built, in an app window that runs off the bottom edge. */}
        <div className="sk-fade" style={sk(1)}>
          <div className="overflow-hidden rounded-t-xl bg-background shadow-[0_0_0_1px_var(--color-border),0_30px_70px_-34px_rgb(15_15_16/0.3)] transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:-translate-y-1.5">
            <div className="flex h-10 items-center gap-1.5 border-b border-border px-4">
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="h-2.5 w-2.5 rounded-full bg-border-strong" />
              <span className="ml-3 truncate font-mono text-[11px] tracking-[0.04em] text-muted">MW-Inventory · Plan</span>
            </div>
            <Crop src="/work/agentic-inventory/plan.jpg" w={1510} h={1652} box={{ x0: 0, x1: 1510, y0: 0, y1: 1400 }} sizes="(min-width: 1440px) 700px, (min-width: 768px) 58vw, 100vw" priority />
          </div>
        </div>

        {/* Beside it: two other stages, floating over the window's edge. */}
        <div className="relative z-10 hidden gap-6 md:-ml-14 md:mt-6 md:grid">
          <div className="sk-fade" style={sk(3)}>
            <p className="mb-2.5"><Tag n={5}>Monitor</Tag></p>
            <div className={`relative rounded-xl bg-background transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:-translate-y-3 ${float}`}>
              <div className="overflow-hidden rounded-xl">
                <Crop src="/work/agentic-inventory/pacing.jpg" w={1510} h={1688} box={{ x0: 86, x1: 1434, y0: 541, y1: 1395 }} sizes="(min-width: 1440px) 520px, 40vw" />
              </div>
            </div>
          </div>
          <div className="sk-fade md:ml-10" style={sk(4)}>
            <p className="mb-2.5"><Tag n={1}>Discover</Tag></p>
            <div className={`relative rounded-xl bg-background transition-transform duration-700 ease-[cubic-bezier(.22,.61,.36,1)] group-hover:-translate-y-2 ${float}`}>
              <div className="overflow-hidden rounded-xl">
                <Crop src="/work/agentic-inventory/discover-cards.jpg" w={1510} h={2328} box={{ x0: 84, x1: 1430, y0: 555, y1: 1505 }} sizes="(min-width: 1440px) 480px, 36vw" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </DrawOnView>
  );
}
