import Link from "next/link";
import AreaLab from "@/components/craft/AreaLab";
import ChangeBlindLab from "@/components/craft/ChangeBlindLab";
import ColorRampLab from "@/components/craft/ColorRampLab";
import FittsLab from "@/components/craft/FittsLab";
import HickLab from "@/components/craft/HickLab";
import LatencyLab from "@/components/craft/LatencyLab";
import PopOutLab from "@/components/craft/PopOutLab";
import ProgressLab from "@/components/craft/ProgressLab";
import SpringLab from "@/components/craft/SpringLab";
import Study, { type StudyProps } from "@/components/craft/Study";
import TrustLab from "@/components/craft/TrustLab";
import { ScrambleDemo, WeightDemo } from "@/components/craft/Warmups";
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { StepStrip } from "@/components/sketch/flows";

type Entry = Omit<StudyProps, "children" | "n" | "tint"> & { lab: React.ReactNode; minutes: string };

const GROUPS = ["Measure yourself", "Perception, data and colour", "Motion and attention", "Agentic interfaces"] as const;

const STUDIES: (Entry & { group: (typeof GROUPS)[number] })[] = [
  {
    id: "fitts",
    group: "Measure yourself",
    title: "Fitts's law lab",
    minutes: "1 min",
    principles: ["Fitts's law", "Throughput", "Target size"],
    question: "How much does a target's size and distance cost you, in milliseconds per bit, and what does a sticky target give back?",
    lab: <FittsLab />,
    research: (
      <>
        <p>Pointing time grows with the logarithm of distance over width: MT = a + b · log₂(D/W + 1). Doubling the distance or halving the size adds the same fixed cost, one bit.</p>
        <p>Studies that follow the ISO method put mouse throughput at roughly 3.7 to 4.9 bits per second.</p>
      </>
    ),
    apply: (
      <>
        <p>Make the main action bigger before you move it closer. Sticky or magnetic targets widen the catch area without taking space, which is what round 2 measures.</p>
        <p>Screen edges are targets of unlimited depth, because the pointer stops there. On touch, WCAG 2.2 asks for at least 24 × 24 px, and 44 × 44 px is the enhanced level.</p>
      </>
    ),
    sources: [
      "Fitts, P. M. (1954). The information capacity of the human motor system in controlling the amplitude of movement. Journal of Experimental Psychology, 47(6).",
      "MacKenzie, I. S. (1992). Fitts' law as a research and design tool in human–computer interaction. Human–Computer Interaction, 7(1).",
      "Soukoreff, R. W., & MacKenzie, I. S. (2004). Towards a standard for pointing device evaluation. International Journal of Human-Computer Studies, 61(6).",
    ],
    code: `const ID = Math.log2(D / W + 1);                 // bits
const { a, b } = linreg(ids, times);              // MT = a + b · ID
const throughput = mean(ids.map((id, i) => id / (times[i] / 1000)));`,
  },
  {
    id: "hick",
    group: "Measure yourself",
    title: "Hick's law vs. searching",
    minutes: "1 min",
    principles: ["Hick–Hyman law", "Visual search", "Menu design"],
    question: "Do more menu items always cost a log curve's worth of time, or only when you already know where to look?",
    lab: <HickLab />,
    research: (
      <>
        <p>Choice time grows with the information in the choice: log₂(n + 1) for n equally likely options. That holds when the person can predict where the answer is.</p>
        <p>When they have to look, time grows with each item scanned, in a straight line. Landauer and Nachbar found the log law for menus ordered alphabetically or numerically.</p>
      </>
    ),
    apply: (
      <>
        <p>Hick&apos;s law is often used to argue for fewer options. The better lesson is to make positions predictable: sorted, grouped and kept in the same order, so picking is deciding, not searching.</p>
        <p>Progressive disclosure helps when it cuts scanning: show the five properties people use, with the rest behind a labelled expander.</p>
      </>
    ),
    sources: [
      "Hick, W. E. (1952). On the rate of gain of information. Quarterly Journal of Experimental Psychology, 4(1).",
      "Hyman, R. (1953). Stimulus information as a determinant of reaction time. Journal of Experimental Psychology, 45(3).",
      "Landauer, T. K., & Nachbar, D. W. (1985). Selection from alphabetic and numeric menu trees using a touch screen. CHI '85.",
    ],
    code: `const logFit = linreg(rts.map((r) => Math.log2(r.n + 1)), rts.map((r) => r.ms));
const linFit = linreg(rts.map((r) => r.n), rts.map((r) => r.ms));
const model = logFit.r2 >= linFit.r2 ? "Hick–Hyman" : "linear search";`,
  },
  {
    id: "pop-out",
    group: "Measure yourself",
    title: "Pop-out search",
    minutes: "1 min",
    principles: ["Feature integration theory", "Pre-attentive features", "One accent colour"],
    question: "Why does one blue circle jump out of 32 grey ones, but hide among blue squares?",
    lab: <PopOutLab />,
    research: (
      <>
        <p>A target that differs by one basic feature, such as colour, size, orientation or motion, is found in about the same time however many distractors there are. It pops out before attention arrives.</p>
        <p>A target defined by a combination of features has to be checked item by item, so time rises with every item added.</p>
      </>
    ),
    apply: (
      <>
        <p>One accent colour means &ldquo;act here&rdquo; only if nothing else uses it. This site keeps one blue for that reason.</p>
        <p>Give each status one distinct feature, and a label, since colour alone fails colour-blind readers. Mixing features across elements builds conjunctions, and conjunctions slow search.</p>
      </>
    ),
    sources: [
      "Treisman, A. M., & Gelade, G. (1980). A feature-integration theory of attention. Cognitive Psychology, 12(1).",
      "Wolfe, J. M. (1994). Guided Search 2.0: A revised model of visual search. Psychonomic Bulletin & Review, 1(2).",
      "Healey, C. G., & Enns, J. T. (2012). Attention and visual memory in visualization and computer graphics. IEEE TVCG, 18(7).",
    ],
    code: `// Colour only: every distractor is a grey circle
const feature = Array(n - 1).fill({ shape: "circle", colour: "grey" });
// Colour and shape: half share the colour, half share the shape
const conjunction = Array.from({ length: n - 1 }, (_, i) =>
  i % 2 ? { shape: "square", colour: "blue" } : { shape: "circle", colour: "grey" });`,
  },
  {
    id: "latency",
    group: "Measure yourself",
    title: "Your latency threshold",
    minutes: "2 min",
    principles: ["Response time limits", "Psychophysics", "Adaptive staircase"],
    question: "How small a lag can you actually tell apart from instant, and is 100 ms really the line?",
    lab: <LatencyLab />,
    research: (
      <>
        <p>About 0.1 s is the classic limit for a response to feel instant, about 1 s keeps a train of thought, and past about 10 s attention wanders.</p>
        <p>Detection is finer than &ldquo;feels instant&rdquo;: on touchscreens, people noticed lags far below 100 ms while dragging. A 2-down/1-up staircase settles near 71% correct, which makes a fair estimate of your own threshold.</p>
      </>
    ),
    apply: (
      <>
        <p>Acknowledge every input within a frame, even when the work takes longer: a press state, an optimistic update that reconciles later, a skeleton for content.</p>
        <p>An agent&apos;s answer can take seconds; its acknowledgement can&apos;t. The working indicator should appear on the same frame as the click.</p>
      </>
    ),
    sources: [
      "Miller, R. B. (1968). Response time in man–computer conversational transactions. AFIPS Fall Joint Computer Conference.",
      "Card, S. K., Robertson, G. G., & Mackinlay, J. D. (1991). The information visualizer, an information workspace. CHI '91.",
      "Levitt, H. (1971). Transformed up-down methods in psychoacoustics. Journal of the Acoustical Society of America, 49(2B).",
      "Ng, A., Lepinski, J., Wigdor, D., Sanders, S., & Dietz, P. (2012). Designing for low-latency direct-touch input. UIST '12.",
    ],
    code: `// 2-down / 1-up converges on 70.7% correct (Levitt, 1971)
if (correct && ++streak === 2) { lag *= 0.7; streak = 0; }
if (!correct) { lag /= 0.7; streak = 0; }
const threshold = geomean(reversals.slice(-6));`,
  },
  {
    id: "area",
    group: "Perception, data and colour",
    title: "Area lies, length doesn't",
    minutes: "1 min",
    principles: ["Stevens' power law", "Graphical perception", "Chart choice"],
    question: "Asked for a circle twice the area, how big do you make it? And a bar twice the length?",
    lab: <AreaLab />,
    research: (
      <>
        <p>Perceived magnitude follows a power of physical magnitude, ψ = k · Sᵝ. For length β is close to 1; for area it is about 0.7, so a circle with 4× the area looks only about 2.6× as big.</p>
        <p>Cleveland and McGill ranked how accurately people read chart encodings: position on a common scale first, then length, with angle and area well behind. Heer and Bostock repeated the ranking online.</p>
      </>
    ),
    apply: (
      <>
        <p>Use position or length for numbers people have to compare: bars and dot plots. Keep area for &ldquo;roughly how big&rdquo;, with the values printed.</p>
        <p>If bubbles must stay, size them by area, never by radius, and label them. The charts on this site use bars and dots for this reason.</p>
      </>
    ),
    sources: [
      "Stevens, S. S. (1957). On the psychophysical law. Psychological Review, 64(3).",
      "Cleveland, W. S., & McGill, R. (1984). Graphical perception. Journal of the American Statistical Association, 79(387).",
      "Heer, J., & Bostock, M. (2010). Crowdsourcing graphical perception. CHI '10.",
    ],
    code: `// perceived = size^β, so to see "k×" you set k^(1/β)
const beta = sum(asked.map((a) => Math.log(a) ** 2)) /
             sum(asked.map((a, i) => Math.log(a) * Math.log(set[i])));
// area: β ≈ 0.7, so "2×" lands near 2.7×`,
  },
  {
    id: "colour",
    group: "Perception, data and colour",
    title: "Perceptual colour ramps",
    minutes: "1 min",
    principles: ["Oklab / OKLCH", "WCAG 2.2 contrast", "Design tokens"],
    question: "Why does a ramp with even HSL steps put the accessible text colour at a different step for every hue?",
    lab: <ColorRampLab />,
    research: (
      <>
        <p>HSL is a reshaped RGB cube, not a model of vision: at the same &ldquo;lightness&rdquo;, yellow looks far brighter than blue.</p>
        <p>Oklab, and its polar form OKLCH, is built so equal steps in L look like equal steps in lightness, and changing hue barely moves it. Because WCAG contrast follows luminance, an even-lightness ramp puts the AA boundary at nearly the same step for every hue.</p>
      </>
    ),
    apply: (
      <>
        <p>Build palette ramps in OKLCH with one lightness scale shared by every hue. Then &ldquo;step 6 and darker pass AA with white text&rdquo; is a rule of the system, not a check for each colour.</p>
        <p>Themes stay accessible when the accent changes. The DS Lab on this site checks contrast live as you edit.</p>
      </>
    ),
    sources: [
      "Ottosson, B. (2020). A perceptual color space for image processing (Oklab).",
      "W3C (2023). Web Content Accessibility Guidelines 2.2, 1.4.3 Contrast (Minimum).",
      "W3C. CSS Color Module Level 4: the oklch() function.",
    ],
    code: `const ramp = steps.map((k) => oklch(lerp(0.95, 0.30, k / 8), 0.13, hue));
const aaStep = ramp.findIndex((c) => contrast(c, WHITE) >= 4.5) + 1;
// HSL: aaStep drifts with hue. OKLCH: it stays put.`,
  },
  {
    id: "spring",
    group: "Motion and attention",
    title: "Spring physics lab",
    minutes: "2 min",
    principles: ["Damped harmonic motion", "Interruptible animation", "Follow-through"],
    question: "What do stiffness, damping and mass actually do, and why does a spring survive being interrupted when a tween doesn't?",
    lab: <SpringLab />,
    research: (
      <>
        <p>A spring is m · x″ = −k · x − c · x′. Its damping ratio ζ = c / 2√(km) sets its character: below 1 it overshoots, at 1 it arrives fastest without overshoot, above 1 it creeps.</p>
        <p>Because a spring&apos;s state includes its velocity, it can change target mid-motion and stay smooth. A fixed-duration curve restarts from rest. Animators call the spring&apos;s carry-through follow-through.</p>
      </>
    ),
    apply: (
      <>
        <p>Use springs for anything a person can interrupt: drags, sheets, toggles that can be flicked back. For interface motion, a damping ratio around 0.7 to 1 settles quickly with little bounce; save a visible bounce for playful moments.</p>
        <p>Durations still suit fades and colour changes, which nobody interrupts. Honour reduced motion either way.</p>
      </>
    ),
    sources: [
      "Thomas, F., & Johnston, O. (1981). The Illusion of Life: Disney Animation. Abbeville Press.",
      "Lasseter, J. (1987). Principles of traditional animation applied to 3D computer animation. SIGGRAPH '87.",
      "Apple (2018). Designing Fluid Interfaces. WWDC18, session 803.",
    ],
    code: `const a = (-k * (x - target) - c * v) / m;   // spring + damping
v += a * dt;                                 // semi-implicit Euler
x += v * dt;
const zeta = c / (2 * Math.sqrt(k * m));     // < 1 bounces`,
  },
  {
    id: "change-blindness",
    group: "Motion and attention",
    title: "Change blindness",
    minutes: "2 min",
    principles: ["Change blindness", "Attention", "Live updates"],
    question: "If a number on a dashboard changes while you're looking at it, will you see it?",
    lab: <ChangeBlindLab />,
    research: (
      <>
        <p>Seeing a change needs attention on the thing that changed. Normally the motion of a change pulls attention to it; a blank, a blink, a reload or a scroll hides that signal, and even large changes go unseen for many cycles.</p>
        <p>It isn&apos;t poor eyesight. It&apos;s how attention samples a scene.</p>
      </>
    ),
    apply: (
      <>
        <p>Every live update needs its own brief signal: a highlight, a count-up, a marker. A full re-render, a route change, or polling that swaps a whole panel acts like the blank in this lab.</p>
        <p>In dashboards, mark what changed since the last visit, and keep the signal short so it doesn&apos;t become noise.</p>
      </>
    ),
    sources: [
      "Rensink, R. A., O'Regan, J. K., & Clark, J. J. (1997). To see or not to see: the need for attention to perceive changes in scenes. Psychological Science, 8(5).",
      "Simons, D. J., & Levin, D. T. (1997). Change blindness. Trends in Cognitive Sciences, 1(7).",
      "Simons, D. J., & Rensink, R. A. (2005). Change blindness: past, present, and future. Trends in Cognitive Sciences, 9(1).",
    ],
    code: `// Flicker: A → blank → B → blank, under three flashes a second
const seq = [["A", 560], ["blank", 160], ["B", 560], ["blank", 160]];
// Cue: change once, with a short highlight
setFrame("B"); setHighlight(true); setTimeout(() => setHighlight(false), 700);`,
  },
  {
    id: "progress",
    group: "Motion and attention",
    title: "Progress bar illusions",
    minutes: "1 min",
    principles: ["Perceived duration", "Peak-end rule", "Waiting"],
    question: "Six bars, all exactly five seconds long. Which ones feel faster?",
    lab: <ProgressLab />,
    research: (
      <>
        <p>Felt time isn&apos;t clock time. Bars with ribs moving backwards, against the fill, felt faster than the same bars with ribs moving forwards.</p>
        <p>People preferred bars that speed up towards the end over bars that slow down, which fits the peak-end rule: the end of an experience counts for more than its middle.</p>
      </>
    ),
    apply: (
      <>
        <p>Do slow steps early where you can, and finish fast. Never let a bar stall at 99%.</p>
        <p>Keep the bar honest: motion should reflect real work, not decorate a stall. For waits under about a second, skip the bar entirely; it only adds a flash.</p>
      </>
    ),
    sources: [
      "Harrison, C., Amento, B., Kuznetsov, S., & Bell, R. (2007). Rethinking the progress bar. UIST '07.",
      "Harrison, C., Yeo, Z., & Hudson, S. E. (2010). Faster progress bars: manipulating perceived duration with visual augmentations. CHI '10.",
      "Kahneman, D., Fredrickson, B. L., Schreiber, C. A., & Redelmeier, D. A. (1993). When more pain is preferred to less: adding a better end. Psychological Science, 4(6).",
    ],
    code: `const fastEnd = (t) => t ** 2;            // speeds up near the end
const slowEnd = (t) => 1 - (1 - t) ** 2;  // slows near the end
// ribs: background-position animates against the fill direction`,
  },
  {
    id: "trust",
    group: "Agentic interfaces",
    title: "Trust calibration",
    minutes: "3 min",
    principles: ["Appropriate reliance", "Signal detection theory", "Human approval"],
    question: "When an agent asks before it acts, can you tell its good proposals from its bad ones, and what helps you do it?",
    lab: <TrustLab />,
    research: (
      <>
        <p>Good reliance on automation isn&apos;t maximum trust; it is trust that matches how reliable the system really is. Relying on it when you shouldn&apos;t (misuse) and ignoring it when you should (disuse) are both failures.</p>
        <p>Signal detection theory separates two things your choices mix together: how well you tell good from bad (d′), and how readily you say yes (c).</p>
      </>
    ),
    apply: (
      <>
        <p>An approval step only protects anyone if the person can tell good proposals from bad. That takes evidence, not a confident tone: what data, how much of it, and how sure.</p>
        <p>Show confidence that is honest, low when the evidence is thin, and put the deciding facts next to the button. It&apos;s the thinking behind the approval cards in Hosamane and the explicit booking step in MW-Inventory.</p>
      </>
    ),
    sources: [
      "Lee, J. D., & See, K. A. (2004). Trust in automation: designing for appropriate reliance. Human Factors, 46(1).",
      "Parasuraman, R., & Riley, V. (1997). Humans and automation: use, misuse, disuse, abuse. Human Factors, 39(2).",
      "Green, D. M., & Swets, J. A. (1966). Signal Detection Theory and Psychophysics. Wiley.",
      "Hautus, M. J. (1995). Corrections for extreme proportions and their biasing effects on estimated values of d′. Behavior Research Methods, 27(1).",
    ],
    code: `const H = (hits + 0.5) / (good + 1);         // log-linear correction
const F = (falseAlarms + 0.5) / (bad + 1);
const dPrime = z(H) - z(F);                   // tell good from bad
const c = -(z(H) + z(F)) / 2;                 // below 0: leans to approve`,
  },
];

const label = "font-mono text-xs uppercase tracking-[0.06em] text-muted";

export default function CraftPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section aria-labelledby="craft-title" className="pt-36 pb-16 md:pt-44 md:pb-20">
        <div className="container-premium">
          <DrawOnView className="mb-6">
            <Doodle name="cursor" className="h-14 w-14 text-foreground" />
          </DrawOnView>
          <p className={label}>Craft</p>
          <h1 id="craft-title" className="mt-3 max-w-[18ch]">Interaction studies, run as experiments.</h1>
          <p className="mt-6 max-w-[60ch] text-lg leading-relaxed text-muted">
            Ten small labs. Each one measures you, puts your result next to the published research, and says what it changes in a real interface. Everything runs in your browser; nothing is sent or stored.
          </p>
        </div>
      </section>

      {/* ── How each lab works ── */}
      <section aria-labelledby="how-title" className="bg-surface py-16 md:py-20">
        <div className="container-premium">
          <h2 id="how-title" className={label}>How each lab works</h2>
          <div className="mt-6">
            <StepStrip
              steps={[
                { label: "01 · Try it", title: "A short task", text: "One to three minutes. Most work with a mouse, touch or the keyboard.", doodle: <Doodle name="cursor" className="h-12 w-12" /> },
                { label: "02 · See your data", title: "Your result, plotted", text: "Next to the curve or range the research found, with the data as a table.", doodle: <Doodle name="data" className="h-12 w-12" i={1} /> },
                { label: "03 · Apply it", title: "What it changes", text: "The interface decision it leads to, the sources, and the core of the code.", doodle: <Doodle name="system" className="h-12 w-12" i={2} /> },
              ]}
            />
          </div>
        </div>
      </section>

      {/* ── Index ── */}
      <nav aria-labelledby="index-title" className="py-16 md:py-20">
        <div className="container-premium">
          <h2 id="index-title" className={label}>The ten labs</h2>
          <div className="mt-6 grid gap-x-10 gap-y-8 md:grid-cols-2">
            {GROUPS.map((g) => (
              <div key={g}>
                <p className="text-sm font-medium">{g}</p>
                <ol className="mt-2 border-t border-border">
                  {STUDIES.filter((s) => s.group === g).map((s) => {
                    const n = STUDIES.indexOf(s) + 1;
                    return (
                      <li key={s.id} className="border-b border-border">
                        <a href={`#${s.id}`} className="group grid grid-cols-[2.25rem_minmax(0,1fr)_auto] items-baseline gap-2 py-3">
                          <span className="font-mono text-xs text-accent">{String(n).padStart(2, "0")}</span>
                          <span className="group-hover:text-accent">{s.title} <span className="text-sm text-muted">· {s.principles[0]}</span></span>
                          <span className="text-caption text-muted tabular-nums">{s.minutes}</span>
                        </a>
                      </li>
                    );
                  })}
                </ol>
              </div>
            ))}
          </div>
        </div>
      </nav>

      {STUDIES.map(({ lab, ...s }, i) => (
        <Study key={s.id} n={i + 1} tint={i % 2 === 0} {...s}>
          {lab}
        </Study>
      ))}

      {/* ── Warm-ups ── */}
      <section aria-labelledby="warmups-title" className="border-t border-border py-20">
        <div className="container-premium">
          <h2 id="warmups-title" className={label}>Two warm-ups</h2>
          <div className="mt-6 grid gap-4 md:grid-cols-2">
            {[
              { title: "Scramble reveal", note: "Character flux catches peripheral vision once, at the moment of intent, then resolves in about half a second.", demo: <ScrambleDemo /> },
              { title: "Weight follows proximity", note: "Variable-font weight follows the pointer: continuous feedback before any click, carried by weight rather than colour.", demo: <WeightDemo /> },
            ].map((w) => (
              <div key={w.title} className="grid overflow-hidden rounded-2xl ring-1 ring-border">
                <div className="grid min-h-[160px] place-items-center bg-surface p-6">{w.demo}</div>
                <div className="p-5">
                  <p className="font-medium">{w.title}</p>
                  <p className="mt-1 text-compact text-muted">{w.note}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Close ── */}
      <section aria-labelledby="craft-cta" className="border-t border-border py-24">
        <div className="container-premium">
          <h2 id="craft-cta" className="max-w-[22ch] text-display">Research that ends in an interface decision.</h2>
          <div className="mt-8 flex flex-wrap items-center gap-x-8 gap-y-3">
            <Link href="/work" className="inline-flex min-h-11 items-center rounded-lg bg-foreground px-5 text-compact font-medium text-background hover:bg-accent">See the work</Link>
            <Link href="/process" className="inline-flex items-center gap-1.5 py-2.5 font-medium underline decoration-border-strong underline-offset-4 hover:text-accent">How I work</Link>
          </div>
        </div>
      </section>
    </>
  );
}
