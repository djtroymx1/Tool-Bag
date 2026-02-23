import { NextRequest, NextResponse } from "next/server";
import { createServerClient } from "@/lib/supabase/server";
import type { CatalogItem } from "@/types/catalog";

// ---------------------------------------------------------------------------
// Rate limiting — simple in-memory per-IP, 10 req/hr
// ---------------------------------------------------------------------------
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();
const RATE_LIMIT = 10;
const RATE_WINDOW_MS = 60 * 60 * 1000; // 1 hour

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const entry = rateLimitMap.get(ip);
  if (!entry || now > entry.resetAt) {
    rateLimitMap.set(ip, { count: 1, resetAt: now + RATE_WINDOW_MS });
    return true;
  }
  if (entry.count >= RATE_LIMIT) return false;
  entry.count++;
  return true;
}

// ---------------------------------------------------------------------------
// Keyword-based fallback (when ANTHROPIC_API_KEY is missing)
// ---------------------------------------------------------------------------
interface Recommendation {
  slug: string;
  name: string;
  category: string;
  reason: string;
  importance: "essential" | "recommended";
}

function keywordFallback(
  document: string,
  platform: string,
  items: CatalogItem[]
): { recommendations: Recommendation[]; projectSummary: string } {
  const docLower = document.toLowerCase();
  const words = new Set(docLower.split(/[\s,.\-_/()[\]{}:;!?'"]+/).filter(Boolean));

  // Score each item by keyword overlap with document
  const scored = items
    .filter((item) => {
      if (platform === "both") return true;
      return item.platforms.includes(platform as "claude-code" | "codex");
    })
    .map((item) => {
      let score = 0;

      // Stack match (strongest signal)
      for (const tag of item.stack) {
        const tagLower = tag.toLowerCase();
        if (docLower.includes(tagLower)) score += 3;
        if (words.has(tagLower)) score += 2;
      }

      // Name match
      const nameParts = item.name.toLowerCase().split(/[\s\-_]+/);
      for (const part of nameParts) {
        if (part.length > 2 && docLower.includes(part)) score += 2;
      }

      // Description keyword overlap
      const descWords = item.description
        .toLowerCase()
        .split(/\s+/)
        .filter((w) => w.length > 3);
      for (const w of descWords) {
        if (words.has(w)) score += 0.5;
      }

      // Category relevance
      const catLower = item.category.toLowerCase();
      if (docLower.includes("test") && catLower.includes("testing")) score += 2;
      if (docLower.includes("deploy") && catLower.includes("workflow")) score += 2;
      if (docLower.includes("mcp") && catLower.includes("mcp")) score += 2;
      if (docLower.includes("multi") && catLower.includes("multi")) score += 2;

      // Priority bonus
      if (item.priority === "essential") score += 2;
      if (item.priority === "recommended") score += 1;

      return { item, score };
    })
    .filter((s) => s.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  const recommendations: Recommendation[] = scored.map((s, i) => ({
    slug: s.item.slug,
    name: s.item.name,
    category: s.item.category,
    reason: `Matches your project based on ${s.item.stack.filter((t) => docLower.includes(t.toLowerCase())).join(", ") || "project keywords"}`,
    importance: i < 4 ? "essential" : "recommended",
  }));

  // Extract a basic summary
  const firstLine = document.split("\n").find((l) => l.trim().length > 10)?.trim() ?? "";
  const projectSummary = firstLine.replace(/^#+\s*/, "").slice(0, 200);

  return { recommendations, projectSummary };
}

// ---------------------------------------------------------------------------
// AI-powered recommendation (when ANTHROPIC_API_KEY is available)
// ---------------------------------------------------------------------------
async function aiRecommend(
  document: string,
  platform: string,
  items: CatalogItem[]
): Promise<{ recommendations: Recommendation[]; projectSummary: string }> {
  const Anthropic = (await import("@anthropic-ai/sdk")).default;
  const client = new Anthropic();

  const catalog = items
    .filter((item) => {
      if (platform === "both") return true;
      return item.platforms.includes(platform as "claude-code" | "codex");
    })
    .map((item) => ({
      slug: item.slug,
      name: item.name,
      category: item.category,
      description: item.description.slice(0, 150),
      stack: item.stack,
      platforms: item.platforms,
      activation_hint: item.activation_hint?.slice(0, 100) ?? null,
    }));

  const systemPrompt = `You are a tool recommendation engine for AI coding assistants (Claude Code and Codex).

Given a project document and a catalog of available tools, recommend 4-10 tools that would be most useful.

CATALOG:
${JSON.stringify(catalog)}

Respond with valid JSON only, no markdown:
{
  "recommendations": [
    {
      "slug": "tool-slug",
      "name": "Tool Name",
      "category": "Category",
      "reason": "One sentence explaining why this tool helps this specific project",
      "importance": "essential" | "recommended"
    }
  ],
  "projectSummary": "1-2 sentence summary of the project"
}

Rules:
- Recommend 4-10 tools
- Mark 2-4 as "essential", rest as "recommended"
- Each reason must reference something specific from the project document
- Only recommend tools from the catalog`;

  const message = await client.messages.create({
    model: "claude-opus-4-6",
    max_tokens: 2048,
    messages: [
      {
        role: "user",
        content: `Here is the project document:\n\n${document.slice(0, 15000)}`,
      },
    ],
    system: systemPrompt,
  });

  const content = message.content[0];
  if (content.type !== "text") {
    throw new Error("Unexpected response type");
  }

  // Parse JSON from response (handle potential markdown wrapping)
  let jsonText = content.text.trim();
  if (jsonText.startsWith("```")) {
    jsonText = jsonText.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "");
  }

  return JSON.parse(jsonText);
}

// ---------------------------------------------------------------------------
// POST handler
// ---------------------------------------------------------------------------
export async function POST(req: NextRequest) {
  // Rate limit
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ?? "unknown";
  if (!checkRateLimit(ip)) {
    return NextResponse.json(
      { error: "Rate limit exceeded. Try again in an hour." },
      { status: 429 }
    );
  }

  // Parse body
  let body: { document?: string; platform?: string };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }

  const { document, platform = "both" } = body;

  if (!document || typeof document !== "string" || document.length < 50) {
    return NextResponse.json(
      {
        error: "Document is required and must be at least 50 characters.",
      },
      { status: 400 }
    );
  }

  // Fetch catalog items
  const supabase = createServerClient();
  const { data: items, error: dbError } = await supabase
    .from("catalog_items")
    .select("*")
    .order("name");

  if (dbError || !items) {
    return NextResponse.json(
      { error: "Failed to load catalog data." },
      { status: 500 }
    );
  }

  const catalogItems = items as CatalogItem[];
  const hasApiKey = !!process.env.ANTHROPIC_API_KEY;

  try {
    if (hasApiKey) {
      const result = await aiRecommend(document, platform, catalogItems);
      return NextResponse.json({ ...result, isAIPowered: true });
    } else {
      const result = keywordFallback(document, platform, catalogItems);
      return NextResponse.json({ ...result, isAIPowered: false });
    }
  } catch (err) {
    console.error("Recommendation error:", err);

    // If AI fails, fall back to keyword matching
    if (hasApiKey) {
      try {
        const result = keywordFallback(document, platform, catalogItems);
        return NextResponse.json({ ...result, isAIPowered: false });
      } catch {
        // Keyword fallback also failed
      }
    }

    return NextResponse.json(
      { error: "Analysis failed. Please try again." },
      { status: 503 }
    );
  }
}
