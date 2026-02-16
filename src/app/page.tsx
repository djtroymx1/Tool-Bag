import { createServerClient } from "@/lib/supabase/server";
import { searchParamsCache } from "@/lib/search-params";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import { HeroIntro } from "@/components/catalog/hero-intro";
import { EcosystemExplainer } from "@/components/catalog/ecosystem-explainer";
import { CatalogErrorState } from "@/components/catalog/catalog-error-state";
import type { SearchParams } from "nuqs/server";
import type { CatalogItem } from "@/types/catalog";

export const dynamic = "force-dynamic";

function sanitizeSearchQuery(searchQuery: string): string {
  return searchQuery.replace(/[^a-zA-Z0-9\s\-\.]/g, "").trim();
}

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParamsCache.parse(searchParams);
  const supabase = createServerClient();
  const sanitizedQuery = sanitizeSearchQuery(params.q);

  // Build filtered query
  let query = supabase.from("catalog_items").select("*");

  if (params.platform && params.platform !== "both") {
    query = query.contains("platforms", [params.platform]);
  }
  if (params.category) {
    query = query.eq("category", params.category);
  }
  if (params.priority) {
    query = query.eq("priority", params.priority);
  }
  if (params.source) {
    query = query.eq("source", params.source);
  }
  if (sanitizedQuery) {
    query = query.or(
      `name.ilike.%${sanitizedQuery}%,description.ilike.%${sanitizedQuery}%`
    );
  }

  const [allItemsResult, filteredItemsResult] = await Promise.all([
    supabase.from("catalog_items").select("*").order("name"),
    query.order("name"),
  ]);
  const { data: allItems, error: allItemsError } = allItemsResult;
  const { data: filteredItems, error: filteredItemsError } = filteredItemsResult;

  if (allItemsError || filteredItemsError) {
    if (process.env.NODE_ENV === "development") {
      console.error("Failed to load catalog data from Supabase", {
        allItemsError,
        filteredItemsError,
      });
    }

    return (
      <div className="flex flex-col gap-6">
        <EcosystemExplainer />
        <CatalogErrorState />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <HeroIntro />
      <EcosystemExplainer />
      <CatalogShell
        initialItems={(filteredItems ?? []) as CatalogItem[]}
        allItems={(allItems ?? []) as CatalogItem[]}
      />
    </div>
  );
}
