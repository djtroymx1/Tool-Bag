"use client";

import { cn } from "@/lib/utils";
import { CATEGORIES } from "@/lib/constants";
import {
  Zap,
  Server,
  Users,
  TestTube2,
  GitBranch,
  BookOpen,
  Building2,
} from "lucide-react";
import type { CatalogItem } from "@/types/catalog";

const ICONS: Record<string, React.ElementType> = {
  Zap,
  Server,
  Users,
  TestTube2,
  GitBranch,
  BookOpen,
  Building2,
};

export function CategoryTabs({
  value,
  onChange,
  items,
}: {
  value: string;
  onChange: (v: string) => void;
  items: CatalogItem[];
}) {
  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  return (
    <div data-testid="category-tabs" className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide">
      <button
        onClick={() => onChange("")}
        className={cn(
          "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
          value === ""
            ? "bg-zinc-100 text-zinc-900"
            : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
        )}
      >
        All
        <span className="text-zinc-500">({items.length})</span>
      </button>
      {CATEGORIES.map(({ value: cat, label, icon }) => {
        const Icon = ICONS[icon];
        const count = counts[cat] || 0;
        return (
          <button
            key={cat}
            onClick={() => onChange(value === cat ? "" : cat)}
            className={cn(
              "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
              value === cat
                ? "bg-zinc-100 text-zinc-900"
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
            )}
          >
            {Icon && <Icon className="h-3.5 w-3.5" />}
            {label}
            <span className="text-zinc-500">({count})</span>
          </button>
        );
      })}
    </div>
  );
}
