import { createServerClient } from "@/lib/supabase/server";
import { searchParamsCache } from "@/lib/search-params";
import { CatalogShell } from "@/components/catalog/catalog-shell";
import type { SearchParams } from "nuqs/server";
import type { CatalogItem } from "@/types/catalog";

export default async function CatalogPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParamsCache.parse(searchParams);
  const supabase = createServerClient();

  // Fetch all items for category counts (unfiltered)
  const { data: allItems } = await supabase
    .from("catalog_items")
    .select("*")
    .order("name");

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
  if (params.q) {
    query = query.or(
      `name.ilike.%${params.q}%,description.ilike.%${params.q}%`
    );
  }

  const { data: filteredItems } = await query.order("name");

  return (
    <CatalogShell
      initialItems={(filteredItems ?? []) as CatalogItem[]}
      allItems={(allItems ?? []) as CatalogItem[]}
    />
  );
}
