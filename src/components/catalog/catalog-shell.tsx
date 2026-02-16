"use client";

import { useQueryStates } from "nuqs";
import { catalogSearchParams } from "@/lib/search-params";
import { PlatformToggle } from "./platform-toggle";
import { SearchInput } from "./search-input";
import { CategoryTabs } from "./category-tabs";
import { FilterBar } from "./filter-bar";
import { CatalogGrid } from "./catalog-grid";
import type { CatalogItem } from "@/types/catalog";

export function CatalogShell({
  initialItems,
  allItems,
}: {
  initialItems: CatalogItem[];
  allItems: CatalogItem[];
}) {
  const [filters, setFilters] = useQueryStates(catalogSearchParams, {
    shallow: false,
  });

  const hasFilters =
    filters.priority !== "" ||
    filters.source !== "" ||
    filters.q !== "" ||
    filters.category !== "";

  return (
    <div className="flex flex-col gap-5">
      {/* Top bar: platform toggle + search */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <PlatformToggle
          value={filters.platform}
          onChange={(v) => setFilters({ platform: v })}
        />
        <SearchInput
          value={filters.q}
          onChange={(v) => setFilters({ q: v || "" })}
        />
      </div>

      {/* Category tabs — use allItems for accurate counts */}
      <CategoryTabs
        value={filters.category}
        onChange={(v) => setFilters({ category: v })}
        items={allItems}
      />

      {/* Filter dropdowns */}
      <FilterBar
        priority={filters.priority}
        source={filters.source}
        onPriorityChange={(v) => setFilters({ priority: v })}
        onSourceChange={(v) => setFilters({ source: v })}
        onClear={() =>
          setFilters({ priority: "", source: "", q: "", category: "" })
        }
        hasFilters={hasFilters}
      />

      {/* Results count */}
      <div className="text-xs text-zinc-500" role="status" aria-live="polite">
        {initialItems.length} tool{initialItems.length !== 1 ? "s" : ""}
      </div>

      {/* Card grid */}
      <CatalogGrid items={initialItems} />
    </div>
  );
}
