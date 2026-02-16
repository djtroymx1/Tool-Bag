"use client";

import { CatalogCard } from "./catalog-card";
import { useSelectionContext } from "@/components/providers/selection-provider";
import type { CatalogItem } from "@/types/catalog";

export function CatalogGrid({ items }: { items: CatalogItem[] }) {
  const { isSelected, toggle } = useSelectionContext();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-zinc-400">No tools match your filters.</p>
        <p className="text-xs text-zinc-500 mt-1">
          Try adjusting your search or filter criteria.
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
      {items.map((item) => (
        <CatalogCard
          key={item.id}
          item={item}
          isSelected={isSelected(item.id)}
          onToggle={() => toggle(item.id)}
        />
      ))}
    </div>
  );
}
