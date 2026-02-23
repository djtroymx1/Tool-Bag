import { createServerClient } from "@/lib/supabase/server";
import { RecommendShell } from "@/components/recommend/recommend-shell";
import type { CatalogItem } from "@/types/catalog";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Get Recommendations — Tool Bag",
  description:
    "Paste your PRD or project document and get personalized tool recommendations for Claude Code and Codex.",
};

export const dynamic = "force-dynamic";

export default async function RecommendPage() {
  const supabase = createServerClient();
  const { data: allItems, error } = await supabase
    .from("catalog_items")
    .select("*")
    .order("name");

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-zinc-400">
          Unable to load catalog data. Please try again later.
        </p>
      </div>
    );
  }

  return (
    <RecommendShell allItems={(allItems ?? []) as CatalogItem[]} />
  );
}
