import { collect_votes, record_vote } from "@/lib/hosamane/tools";

export async function POST(req: Request) {
  const { token, voter, listingId, note } = (await req.json()) as { token: string; voter: string; listingId: string; note?: string };
  if (!token || !voter || !listingId) return Response.json({ error: "Missing fields" }, { status: 400 });
  record_vote(token, voter.slice(0, 40), listingId, note?.slice(0, 280));
  return Response.json({ ok: true });
}

export async function GET(req: Request) {
  const token = new URL(req.url).searchParams.get("token");
  return Response.json(collect_votes(token));
}
