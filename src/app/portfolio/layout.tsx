import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Design gallery",
  description:
    "Real screens and case-study boards from shipped products and concept work: Quinnox’s AIOps platform, FlexEHR, SaaSworld.club, ShemarooMe streaming apps and two UX case studies, each with the thinking behind it.",
  openGraph: {
    title: "Design gallery — Vivekanand Choudhari",
    description: "Real screens and case-study boards, each with the thinking behind it.",
    images: [{ url: "/work/gallery/aiops/knowledge-graph.jpg", width: 1800, height: 2022, alt: "Enterprise Knowledge Graph screen from Quinnox’s AIOps platform" }],
  },
  alternates: { canonical: "/portfolio" },
};

export default function PortfolioLayout({ children }: { children: React.ReactNode }) {
  return children;
}
