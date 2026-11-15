import { readFile } from "node:fs/promises";
import { join } from "node:path";
import { ImageResponse } from "next/og";

/**
 * Share-preview images (Open Graph and Twitter cards) for every page that sets
 * `/api/og?title=…&category=…[&readTime=…]` in its metadata. 1200 × 630, in the site's calm style:
 * ink on white, one blue accent, and a hand-drawn underline. Set in Poppins, like every page (OFL, fonts/OFL.txt).
 */
const fontDir = join(process.cwd(), "src/app/api/og/fonts");
let fonts: Promise<[Buffer, Buffer]> | null = null;
const loadFonts = () => (fonts ??= Promise.all([readFile(join(fontDir, "Poppins-Regular.ttf")), readFile(join(fontDir, "Poppins-SemiBold.ttf"))]));

export async function GET(req: Request) {
  const params = new URL(req.url).searchParams;
  const clip = (s: string | null, n: number) => (s ?? "").slice(0, n);
  const title = clip(params.get("title"), 120) || "Vivekanand Choudhari";
  const category = clip(params.get("category"), 40) || "Portfolio";
  const readTime = clip(params.get("readTime"), 20);
  const size = title.length > 60 ? 56 : title.length > 36 ? 66 : 78; // Poppins sets wider than the default face
  const [regular, semibold] = await loadFonts();

  return new ImageResponse(
    (
      <div style={{ width: "100%", height: "100%", display: "flex", flexDirection: "column", justifyContent: "space-between", background: "#FFFFFF", padding: "72px 80px", color: "#0F0F10", fontFamily: "Poppins" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 22, letterSpacing: 2, textTransform: "uppercase", color: "#5E5E66" }}>
          <div style={{ width: 12, height: 12, borderRadius: 12, background: "#2F48C2" }} />
          {category}
          {readTime ? <span style={{ color: "#5E5E66" }}>{`· ${readTime}`}</span> : null}
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
          <div style={{ fontSize: size, lineHeight: 1.08, letterSpacing: -1.5, fontWeight: 600, maxWidth: 1040 }}>{title}</div>
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
    {
      width: 1200,
      height: 630,
      fonts: [
        { name: "Poppins", data: regular, style: "normal", weight: 400 },
        { name: "Poppins", data: semibold, style: "normal", weight: 600 },
      ],
      headers: { "Cache-Control": "public, max-age=86400, immutable" },
    },
  );
}
