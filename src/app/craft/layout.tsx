import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Craft — Interaction Studies, Run as Experiments",
  description:
    "Ten interactive labs: Fitts's law, Hick's law, pop-out search, latency thresholds, area perception, perceptual colour, spring physics, change blindness, progress bars and trust in AI agents. Each measures you against the published research.",
  openGraph: {
    title: "Craft — Interaction Studies",
    description:
      "Ten interactive labs that measure you against the published research, and say what it changes in an interface.",
    images: [
      {
        url: "/api/og?title=Craft&category=Interaction%20Studies",
        width: 1200,
        height: 630,
        alt: "Craft — Interaction Studies",
      },
    ],
  },
  alternates: { canonical: "/craft" },
};

export default function CraftLayout({ children }: { children: React.ReactNode }) {
  return children;
}
