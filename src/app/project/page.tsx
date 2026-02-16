import { createServerClient } from "@/lib/supabase/server";
import { ProjectShell } from "@/components/project/project-shell";
import type { CatalogItem } from "@/types/catalog";

export default async function ProjectPage() {
  const supabase = createServerClient();
  const { data: allItems } = await supabase
    .from("catalog_items")
    .select("*")
    .order("category")
    .order("name");

  return <ProjectShell allItems={(allItems ?? []) as CatalogItem[]} />;
}
