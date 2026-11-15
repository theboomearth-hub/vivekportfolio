import JsonLd from "@/components/JsonLd";
import { breadcrumbs, graph, pageMeta, PERSON_ID, webPage } from "@/lib/seo";

const description = "Hiring for a senior or lead design role, or need a designer who also builds? Email or book a call. Replies within 24 hours.";
const trail = [{ name: "Contact", path: "/contact" }];

export const metadata = pageMeta({ title: "Contact", ogTitle: "Get in touch", category: "Contact", description, path: "/contact" });

export default function ContactLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd data={graph(webPage({ path: "/contact", name: "Contact Vivekanand Choudhari", description, type: "ContactPage", trail, extra: { mainEntity: { "@id": PERSON_ID } } }), breadcrumbs(trail))} />
      {children}
    </>
  );
}
