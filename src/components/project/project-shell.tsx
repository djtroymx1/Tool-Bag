"use client";

import { useEffect, useMemo } from "react";
import Link from "next/link";
import { useSelectionContext } from "@/components/providers/selection-provider";
import { SelectedItemsList } from "./selected-items-list";
import { ProjectStats } from "./project-stats";
import { Button } from "@/components/ui/button";
import { ArrowRight, Trash2 } from "lucide-react";
import type { CatalogItem } from "@/types/catalog";

export function ProjectShell({ allItems }: { allItems: CatalogItem[] }) {
  const { selectedIds, remove, clear, setFromIds } = useSelectionContext();
  const allItemIds = useMemo(
    () => new Set(allItems.map((item) => item.id)),
    [allItems]
  );
  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.has(item.id)),
    [allItems, selectedIds]
  );
  const selectedCount = selectedItems.length;

  useEffect(() => {
    const validIds = [...selectedIds].filter((id) => allItemIds.has(id));
    if (validIds.length !== selectedIds.size) {
      setFromIds(validIds);
    }
  }, [allItemIds, selectedIds, setFromIds]);

  if (selectedCount === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">No tools selected</h2>
        <p className="text-sm text-zinc-400 mt-2 max-w-md">
          Browse the catalog and select tools to build your project
          configuration.
        </p>
        <Link href="/">
          <Button className="mt-6" variant="secondary">
            Browse Catalog
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </Link>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-xl font-semibold">Project Builder</h1>
          <p className="text-sm text-zinc-400 mt-1">
            {selectedCount} tool{selectedCount !== 1 ? "s" : ""} selected
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="sm"
            onClick={clear}
            className="text-zinc-400 hover:text-red-400"
          >
            <Trash2 className="h-3.5 w-3.5 mr-1.5" />
            Clear all
          </Button>
          <Link href="/project/export">
            <Button size="sm">
              Export Config
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <SelectedItemsList items={selectedItems} onRemove={remove} />
        </div>
        <div>
          <ProjectStats items={selectedItems} />
        </div>
      </div>
    </div>
  );
}
