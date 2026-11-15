import type { MetadataRoute } from "next";
import { SITE_URL } from "@/lib/site";

export const dynamic = "force-static";

/**
 * Everyone may crawl everything except the API. AI search and answer engines are named as well, because some only
 * read the group addressed to them; the list uses their current user-agent names.
 */
const AI_CRAWLERS = [
  "GPTBot", "OAI-SearchBot", "ChatGPT-User", // OpenAI
  "ClaudeBot", "Claude-User", "Claude-SearchBot", // Anthropic
  "PerplexityBot", "Perplexity-User", // Perplexity
  "Google-Extended", // Gemini and Vertex AI
  "Applebot", "Applebot-Extended", // Apple
  "Bingbot", // Bing and Copilot
  "DuckAssistBot", "YouBot", "CCBot",
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: "*", allow: "/", disallow: ["/api/"] },
      { userAgent: AI_CRAWLERS, allow: "/", disallow: ["/api/"] },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
