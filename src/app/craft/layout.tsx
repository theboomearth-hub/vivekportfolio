import { pageMeta } from "@/lib/seo";

// Structured data for this page lives in page.tsx, next to the list of labs it describes.
export const metadata = pageMeta({
  title: "Craft: interaction design labs",
  ogTitle: "Interaction studies, run as experiments",
  category: "Craft",
  description: "Ten interactive labs on Fitts's law, Hick's law, visual search, latency, colour, springs, change blindness and trust in AI, with your own results.",
  path: "/craft",
});

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
