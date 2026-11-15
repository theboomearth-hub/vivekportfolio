/**
 * Structured data as a <script type="application/ld+json">, rendered on the server.
 * "<" is escaped to < as the Next.js JSON-LD guide recommends, so no string can close the script tag.
 */
export default function JsonLd({ data }: { data: object }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}
