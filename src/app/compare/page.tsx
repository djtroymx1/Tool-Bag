import { createServerClient } from "@/lib/supabase/server";
import { ComparisonTable } from "@/components/compare/comparison-table";
import type { CatalogItem } from "@/types/catalog";

export default async function ComparePage() {
  const supabase = createServerClient();
  const { data: items } = await supabase
    .from("catalog_items")
    .select("*")
    .order("category")
    .order("name");

  return <ComparisonTable items={(items ?? []) as CatalogItem[]} />;
}
