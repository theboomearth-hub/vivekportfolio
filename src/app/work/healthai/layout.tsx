import CaseStudyJsonLd from "@/components/CaseStudyJsonLd";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <CaseStudyJsonLd slug="healthai" />
      {children}
    </>
  );
}
