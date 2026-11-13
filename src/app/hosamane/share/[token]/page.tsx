import type { Metadata } from "next";
import Lost from "@/components/hosamane/Lost";
import ShareView from "@/components/hosamane/ShareView";

// Share links are personal; keep them out of search results.
export const metadata: Metadata = { title: "Shared finalists · Hosamane", robots: { index: false, follow: false } };

/** The co-decider's view: no account, no app. Shows only the shared finalists. */
export default async function SharePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params;
  let data: { ids: string[]; people: { name: string; role: string }[]; from: string } | null = null;
  try { data = JSON.parse(Buffer.from(token, "base64url").toString()); } catch {}
  if (!data?.ids?.length) return <Lost title="This share link isn't working." body="It may have been copied only in part. Ask whoever sent it for a fresh link." cta="Start your own search" />;
  return <ShareView token={token} ids={data.ids} people={data.people} from={data.from} />;
}
