import JsonLd from "@/components/JsonLd";
import { faqJsonLd } from "@/lib/faq";
import { abs, breadcrumbs, graph, pageMeta, PERSON_ID, webPage } from "@/lib/seo";

const description =
  "Vivekanand Choudhari is a senior UI/UX and AI product designer in Bengaluru with 9+ years across AdTech, healthcare, construction cloud, AIOps and IoT.";
const trail = [{ name: "About", path: "/about" }];

export const metadata = pageMeta({ title: "About", ogTitle: "About Vivekanand Choudhari", description, path: "/about", type: "profile" });

export default function AboutLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <JsonLd
        data={graph(
          webPage({ path: "/about", name: "About Vivekanand Choudhari", description, type: "ProfilePage", trail, extra: { mainEntity: { "@id": PERSON_ID }, hasPart: { "@id": `${abs("/about")}#faq` } } }),
          breadcrumbs(trail),
          faqJsonLd(abs("/about")),
        )}
      />
      {children}
    </>
  );
}
