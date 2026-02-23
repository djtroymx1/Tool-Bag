"use client";

import {
  useState,
  useSyncExternalStore,
  useCallback,
  useEffect,
  useRef,
} from "react";
import { useQueryStates } from "nuqs";
import { catalogSearchParams } from "@/lib/search-params";
import { useSelectionContext } from "@/components/providers/selection-provider";
import { PlatformToggle } from "./platform-toggle";
import { SearchInput } from "./search-input";
import { CategoryTabs } from "./category-tabs";
import { FilterBar } from "./filter-bar";
import { CatalogGrid } from "./catalog-grid";
import { CatalogList } from "./catalog-list";
import { ViewToggle, type ViewMode } from "./view-toggle";
import { ToolDrawer } from "./tool-drawer";
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
  const [drawerItem, setDrawerItem] = useState<CatalogItem | null>(null);
  const [focusIndex, setFocusIndex] = useState(-1);
  const searchRef = useRef<HTMLInputElement>(null);
  const { toggle } = useSelectionContext();

  function handleViewDetails(item: CatalogItem) {
    // On mobile (< 1024px), don't open drawer — card expands inline instead
    if (typeof window !== "undefined" && window.innerWidth < 1024) return;
    setDrawerItem(item);
  }

  // Keyboard navigation
  useEffect(() => {
    function handleKeyDown(e: KeyboardEvent) {
      const target = e.target as HTMLElement;
      const isInput =
        target.tagName === "INPUT" ||
        target.tagName === "TEXTAREA" ||
        target.isContentEditable;

      // Cmd+K or / → focus search (unless typing in input)
      if (
        (e.key === "/" && !isInput) ||
        ((e.metaKey || e.ctrlKey) && e.key === "k")
      ) {
        e.preventDefault();
        searchRef.current?.focus();
        return;
      }

      // Escape → close drawer or blur search
      if (e.key === "Escape") {
        if (drawerItem) {
          setDrawerItem(null);
        } else if (isInput) {
          (target as HTMLElement).blur();
        }
        return;
      }

      // j/k/x/Enter only work when not in an input
      if (isInput) return;

      if (e.key === "j") {
        e.preventDefault();
        setFocusIndex((prev) =>
          prev < initialItems.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "k") {
        e.preventDefault();
        setFocusIndex((prev) => (prev > 0 ? prev - 1 : 0));
      } else if (e.key === "x" && focusIndex >= 0) {
        e.preventDefault();
        const item = initialItems[focusIndex];
        if (item) toggle(item.id);
      } else if (e.key === "Enter" && focusIndex >= 0) {
        e.preventDefault();
        const item = initialItems[focusIndex];
        if (item) handleViewDetails(item);
      }
    }

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [drawerItem, focusIndex, initialItems, toggle]);

  // Scroll focused item into view
  useEffect(() => {
    if (focusIndex < 0) return;
    const selector =
      viewMode === "list"
        ? `[data-testid="catalog-list-row"]`
        : `[data-testid="catalog-card"]`;
    const elements = document.querySelectorAll(selector);
    const el = elements[focusIndex];
    if (el) {
      el.scrollIntoView({ block: "nearest", behavior: "smooth" });
      (el as HTMLElement).classList.add("ring-2", "ring-emerald-500/50");
      // Remove ring from previous
      elements.forEach((other, i) => {
        if (i !== focusIndex)
          (other as HTMLElement).classList.remove(
            "ring-2",
            "ring-emerald-500/50"
          );
      });
    }
  }, [focusIndex, viewMode]);

  // Reset focus index when filtered items change
  const itemsKey = initialItems.map((i) => i.id).join(",");
  // eslint-disable-next-line react-hooks/set-state-in-effect
  useEffect(() => { setFocusIndex(-1); }, [itemsKey]);

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
          inputRef={searchRef}
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
          onViewDetails={handleViewDetails}
        />
      ) : (
        <CatalogGrid
          items={initialItems}
          onClearFilters={clearAllFilters}
          activePlatform={filters.platform}
          onStackFilter={(stack) => setFilters({ stack })}
          onPriorityFilter={(priority) => setFilters({ priority })}
          onSourceFilter={(source) => setFilters({ source })}
          onViewDetails={handleViewDetails}
        />
      )}

      {/* Detail drawer (desktop only) */}
      <ToolDrawer
        item={drawerItem}
        open={!!drawerItem}
        onOpenChange={(open) => !open && setDrawerItem(null)}
        activePlatform={filters.platform}
      />
    </div>
  );
}
