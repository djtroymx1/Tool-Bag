"use client";

import { useState, useSyncExternalStore, useCallback, useEffect } from "react";
import { useQueryStates } from "nuqs";
import { catalogSearchParams } from "@/lib/search-params";
import { PlatformToggle } from "./platform-toggle";
import { SearchInput } from "./search-input";
import { CategoryTabs } from "./category-tabs";
import { FilterBar } from "./filter-bar";
import { CatalogGrid } from "./catalog-grid";
import { CatalogList } from "./catalog-list";
import { ViewToggle, type ViewMode } from "./view-toggle";
import type { CatalogItem } from "@/types/catalog";

const VIEW_STORAGE_KEY = "toolbag-view-mode";

function useViewMode() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [mode, setMode] = useState<ViewMode>(() => {
    if (typeof window === "undefined") return "grid";
    try {
      const stored = localStorage.getItem(VIEW_STORAGE_KEY);
      return stored === "list" ? "list" : "grid";
    } catch {
      return "grid";
    }
  });

  useEffect(() => {
    if (!hydrated) return;
    try {
      localStorage.setItem(VIEW_STORAGE_KEY, mode);
    } catch {}
  }, [mode, hydrated]);

  const setViewMode = useCallback((v: ViewMode) => setMode(v), []);

  return { mode: hydrated ? mode : "grid", setViewMode, hydrated };
}

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
  const { mode: viewMode, setViewMode } = useViewMode();

  const hasFilters =
    filters.platform !== "both" ||
    filters.priority !== "" ||
    filters.source !== "" ||
    filters.q !== "" ||
    filters.category !== "" ||
    filters.stack !== "";

  function clearAllFilters() {
    setFilters({
      platform: "both",
      priority: "",
      source: "",
      q: "",
      category: "",
      stack: "",
    });
  }

  const platformLabel =
    filters.platform === "both"
      ? "Both"
      : filters.platform === "claude-code"
        ? "Claude Code"
        : "Codex";

  return (
    <div className="flex flex-col gap-6">
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
        onClear={clearAllFilters}
        hasFilters={hasFilters}
      />

      {/* Results count + view toggle */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs text-zinc-500" role="status" aria-live="polite">
          <span>
            Showing {initialItems.length} of {allItems.length} tool
            {allItems.length !== 1 ? "s" : ""} for {platformLabel}
          </span>
          {filters.stack && (
            <button
              onClick={() => setFilters({ stack: "" })}
              className="inline-flex items-center gap-1 rounded-md bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700 transition-colors"
            >
              Stack: {filters.stack}
              <span className="text-zinc-500">&times;</span>
            </button>
          )}
        </div>
        <ViewToggle value={viewMode} onChange={setViewMode} />
      </div>

      {/* Card grid or list view */}
      {viewMode === "list" ? (
        <CatalogList
          items={initialItems}
          onClearFilters={clearAllFilters}
          activePlatform={filters.platform}
          onStackFilter={(stack) => setFilters({ stack })}
          onPriorityFilter={(priority) => setFilters({ priority })}
          onSourceFilter={(source) => setFilters({ source })}
        />
      ) : (
        <CatalogGrid
          items={initialItems}
          onClearFilters={clearAllFilters}
          activePlatform={filters.platform}
          onStackFilter={(stack) => setFilters({ stack })}
          onPriorityFilter={(priority) => setFilters({ priority })}
          onSourceFilter={(source) => setFilters({ source })}
        />
      )}
    </div>
  );
}
