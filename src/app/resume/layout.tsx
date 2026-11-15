import JsonLd from "@/components/JsonLd";
import { breadcrumbs, graph, pageMeta, PERSON_ID, webPage } from "@/lib/seo";

const description = "Résumé of Vivekanand Choudhari, senior UI/UX and AI product designer: 9+ years in B2B SaaS and AI, design systems, agentic UI and design leadership.";
const trail = [{ name: "Resume", path: "/resume" }];

export const metadata = pageMeta({ title: "Resume", ogTitle: "Resume: Vivekanand Choudhari", category: "Resume", description, path: "/resume", type: "profile" });

export default function ResumeLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={graph(webPage({ path: "/resume", name: "Resume of Vivekanand Choudhari", description, type: "ProfilePage", trail, extra: { mainEntity: { "@id": PERSON_ID } } }), breadcrumbs(trail))} />
      {children}
    </>
  );
}
