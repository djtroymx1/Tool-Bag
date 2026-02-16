import { createServerClient } from "@/lib/supabase/server";
import { ExportShell } from "@/components/export/export-shell";
import type { CatalogItem } from "@/types/catalog";

export const dynamic = "force-dynamic";

export default async function ExportPage() {
  const supabase = createServerClient();
  const { data: allItems } = await supabase
    .from("catalog_items")
    .select("*")
    .order("category")
    .order("name");

  return <ExportShell allItems={(allItems ?? []) as CatalogItem[]} />;
}
