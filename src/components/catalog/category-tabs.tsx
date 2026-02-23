"use client";

import { useEffect, useRef } from "react";
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
  const scrollRef = useRef<HTMLDivElement>(null);

  const counts: Record<string, number> = {};
  for (const item of items) {
    counts[item.category] = (counts[item.category] || 0) + 1;
  }

  // Auto-scroll active tab into view
  useEffect(() => {
    const container = scrollRef.current;
    if (!container) return;
    const active = container.querySelector<HTMLElement>("[data-active='true']");
    active?.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
  }, [value]);

  return (
    <div
      data-testid="category-tabs"
      className="sticky top-14 z-40 -mx-4 px-4 sm:-mx-6 sm:px-6 lg:-mx-8 lg:px-8 py-2 bg-background/80 backdrop-blur-xl border-b border-zinc-800/50"
    >
      <div
        ref={scrollRef}
        className="flex gap-1 overflow-x-auto pb-1 scrollbar-hide rounded-lg bg-zinc-900/50 p-1 border border-zinc-800"
        style={{
          maskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
          WebkitMaskImage: "linear-gradient(to right, transparent 0%, black 2%, black 98%, transparent 100%)",
        }}
      >
        <button
          data-active={value === ""}
          onClick={() => onChange("")}
          className={cn(
            "flex items-center gap-1.5 whitespace-nowrap rounded-md px-3 py-1.5 text-xs font-medium transition-colors",
            value === ""
              ? "bg-zinc-100 text-zinc-900"
              : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
          )}
        >
          All
          <span className={cn(value === "" ? "text-zinc-600" : "text-zinc-500")}>
            ({items.length})
          </span>
        </button>
        {CATEGORIES.map(({ value: cat, label, icon }) => {
          const Icon = ICONS[icon];
          const count = counts[cat] || 0;
          return (
            <button
              key={cat}
              data-active={value === cat}
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
              <span className={cn(value === cat ? "text-zinc-600" : "text-zinc-500")}>
                ({count})
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
