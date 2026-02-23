import { createServerClient } from "@/lib/supabase/server";
import { ToolDetail } from "@/components/tools/tool-detail";
import { notFound } from "next/navigation";
import type { Metadata } from "next";
import type { CatalogItem } from "@/types/catalog";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({
  params,
}: PageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = createServerClient();
  const { data } = await supabase
    .from("catalog_items")
    .select("name, description")
    .eq("slug", slug)
    .single();

  if (!data) return { title: "Tool Not Found" };

  return {
    title: `${data.name} — Tool Bag`,
    description: data.description,
    openGraph: {
      title: `${data.name} — Tool Bag`,
      description: data.description,
    },
  };
}

export default async function ToolPage({ params }: PageProps) {
  const { slug } = await params;
  const supabase = createServerClient();

  const { data: item } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("slug", slug)
    .single();

  if (!item) notFound();

  // Fetch related items (same category, excluding this one)
  const { data: related } = await supabase
    .from("catalog_items")
    .select("*")
    .eq("category", item.category)
    .neq("slug", slug)
    .order("priority")
    .limit(4);

  return (
    <ToolDetail
      item={item as CatalogItem}
      relatedItems={(related ?? []) as CatalogItem[]}
    />
  );
}
