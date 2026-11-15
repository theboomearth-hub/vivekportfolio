/**
 * Takt's object model: what exists, grouped by the question each group answers, then how the objects connect.
 * Server component, plain markup; the relations read as sentences, so the diagram is also its own text version.
 */
import Doodle from "@/components/sketch/Doodle";
import DrawOnView from "@/components/sketch/DrawOnView";
import { SketchArrow } from "@/components/sketch/glyphs";

const DOODLE: Record<string, string> = { Where: "pin", What: "factory", "What happened": "ban", "What we did": "team", "How it went": "data" };
const sk = (i: number) => ({ "--sk-i": i }) as React.CSSProperties;

export default function ObjectModel({ groups, relations }: { groups: { group: string; objects: string[] }[]; relations: string[][] }) {
  return (
    <div className="grid gap-8">
      <DrawOnView className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5 [&>*]:min-w-0">
        {groups.map((g, i) => (
          <div key={g.group} className="sk-fade flex flex-col gap-3 rounded-2xl bg-background p-4 ring-1 ring-border ring-inset" style={sk(i)}>
            <div className="flex items-center gap-2.5">
              <Doodle name={DOODLE[g.group] ?? "layers"} className="h-9 w-9 shrink-0 text-foreground" i={i} />
              <p className="font-mono text-xs uppercase tracking-[0.06em] text-accent">{g.group}</p>
            </div>
            <ul className="flex flex-wrap gap-1.5">
              {g.objects.map((o) => (
                <li key={o} className="rounded-md bg-surface px-2 py-1 text-sm">{o}</li>
              ))}
            </ul>
          </div>
        ))}
      </DrawOnView>
      <DrawOnView>
        <p className="font-mono text-xs uppercase tracking-[0.06em] text-muted">How they connect</p>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2">
          {relations.map(([a, verb, b], i) => (
            <li key={`${a}-${verb}`} className="sk-fade grid grid-cols-[minmax(0,1fr)_auto_minmax(0,1fr)] items-center gap-3 rounded-xl bg-background px-3.5 py-2.5 ring-1 ring-border ring-inset" style={sk(i)}>
              <span className="text-sm font-medium">{a}</span>
              <span className="flex items-center gap-1.5 text-caption text-muted">
                {verb}
                <SketchArrow className="h-3.5 w-6 text-accent" i={i} />
              </span>
              <span className="text-sm font-medium">{b}</span>
            </li>
          ))}
        </ul>
      </DrawOnView>
    </div>
  );
}
