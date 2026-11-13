"use client";

import { useState } from "react";
import { Car, CircleCheck, MapPin } from "lucide-react";
import { inr, inrShort, listingById, localityById } from "@/lib/hosamane/data";
import { Button, Card, Chip, Label, Logo, Photo } from "./ui";

export default function ShareView({ token, ids, people, from }: { token: string; ids: string[]; people: { name: string; role: string }[]; from: string }) {
  const voters = people.filter((p) => p.role === "votes");
  const [who, setWho] = useState(voters[0]?.name ?? people[0]?.name ?? "");
  const [choice, setChoice] = useState<string | null>(null);
  const [note, setNote] = useState("");
  const [sent, setSent] = useState(false);
  const canVote = voters.some((v) => v.name === who);
  const submit = async () => {
    if (!choice) return;
    await fetch("/api/hosamane/vote", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ token, voter: who, listingId: choice, note }) });
    setSent(true);
  };
  return (
    <div className="mx-auto grid max-w-[640px] gap-5 px-4 py-6">
      <Logo />
      <div className="grid gap-1">
        <h1 className="text-[24px] leading-tight font-medium tracking-[-0.02em]">{from} wants your view on {ids.length} homes</h1>
        <p className="text-hm-compact text-hm-muted">{canVote ? "Tap the one you like, and add a note if you want. No app or account needed." : "You can see the finalists. Only the people invited to vote can vote."}</p>
      </div>
      {people.length > 1 && (
        <div className="flex flex-wrap items-center gap-2"><Label>I&apos;m</Label>{people.map((p) => <Chip key={p.name} tone={who === p.name ? "primary" : "plain"} onClick={() => setWho(p.name)}>{p.name}</Chip>)}</div>
      )}
      <ul className="grid gap-3">
        {ids.map((id) => {
          const l = listingById(id)!;
          const picked = choice === id;
          return (
            <li key={id}>
              <Card className={`overflow-hidden ${picked ? "ring-2 ring-hm-primary" : ""}`}>
                <Photo src={l.photos[0].src} ratio="aspect-[16/9]" />
                <div className="grid gap-1 p-4">
                  <p className="text-[20px] font-semibold tabular-nums">{l.mode === "rent" ? `${inr(l.rent!)}/month` : inrShort(l.price!)}</p>
                  <p className="text-hm-compact font-medium">{l.title}</p>
                  <p className="inline-flex items-center gap-1 text-hm-caption text-hm-muted"><MapPin size={13} />{localityById(l.localityId).name} · {l.sqft} sq ft · {l.bathrooms} bath</p>
                  {canVote && !sent && <div className="mt-2"><Button kind={picked ? "primary" : "secondary"} onClick={() => setChoice(id)}>{picked ? <><CircleCheck size={16} />Your pick</> : "I like this one"}</Button></div>}
                </div>
              </Card>
            </li>
          );
        })}
      </ul>
      {canVote && !sent && (
        <div className="grid gap-2">
          <label htmlFor="note" className="text-hm-compact font-medium">A note for {from} (optional)</label>
          <textarea id="note" value={note} onChange={(e) => setNote(e.target.value)} rows={2} className="rounded-hm-control bg-hm-card p-3 text-hm-compact ring-1 ring-hm-control" placeholder="What you liked, or what worries you" />
          <div><Button onClick={submit} disabled={!choice}>Send my vote</Button></div>
        </div>
      )}
      {sent && <Card className="p-4"><p className="flex items-center gap-2 text-hm-compact font-medium"><CircleCheck size={18} className="text-hm-ok" />Thanks, {who}. {from} will see your vote.</p></Card>}
      <p className="flex items-center gap-1 text-hm-label text-hm-muted"><Car size={12} />Shared from Hosamane, a design prototype with fictional listings. This link shows only these homes.</p>
    </div>
  );
}
