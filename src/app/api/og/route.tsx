import { ImageResponse } from "next/og";

/**
 * Share-preview images (Open Graph and Twitter cards) for every page that sets
 * `/api/og?title=…&category=…[&readTime=…]` in its metadata. 1200 × 630, in the site's calm style:
 * ink on white, one blue accent, and a hand-drawn underline.
 */
export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const clip = (s: string | null, n: number) => (s ?? "").slice(0, n);
  const title = clip(params.get("title"), 120) || "Vivekanand Choudhari";
  const category = clip(params.get("category"), 40) || "Portfolio";
  const readTime = clip(params.get("readTime"), 20);
  const size = title.length > 60 ? 60 : title.length > 36 ? 72 : 84;

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: "72px 80px", color: "#0F0F10" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#5E5E66" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#2F48C2" }} />
          {category}
          {readTime ? <span style={{ color: "#5E5E66" }}>{`· ${readTime}`}</span> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: size, lineHeight: 1.08, letterSpacing: -2, fontWeight: 600, maxWidth: 1000 }}>{title}</div>
          <svg width="360" height="18" viewBox="0 0 360 18">
            <path d="M4 12C80 5 200 4 356 9" fill="none" stroke="#2F48C2" strokeWidth="5" strokeLinecap="round" />
          </svg>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 24, color: "#5E5E66" }}>
          <span style={{ color: "#0F0F10" }}>Vivekanand Choudhari</span>
          <span>Senior UI/UX &amp; AI Product Designer · Bengaluru</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630, headers: { "Cache-Control": "public, max-age=86400, immutable" } },
  );
}
