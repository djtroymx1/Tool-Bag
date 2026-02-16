"use client";

import { X, ExternalLink } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { groupBy } from "@/lib/utils";
import type { CatalogItem } from "@/types/catalog";

export function SelectedItemsList({
  items,
  onRemove,
}: {
  items: CatalogItem[];
  onRemove: (id: string) => void;
}) {
  const grouped = groupBy(items, "category");

  return (
    <div className="flex flex-col gap-4">
      {Object.entries(grouped).map(([category, categoryItems]) => (
        <div key={category}>
          <h3 className="text-xs font-medium text-zinc-500 uppercase tracking-wider mb-2">
            {category}
          </h3>
          <div className="flex flex-col gap-1.5">
            {categoryItems.map((item) => (
              <Card
                key={item.id}
                className="flex items-center justify-between gap-3 px-3 py-2 bg-card border-border"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className="text-sm font-medium truncate">
                    {item.name}
                  </span>
                  <PriorityBadge priority={item.priority} />
                  <PlatformBadge platforms={item.platforms} />
                </div>
                <div className="flex items-center gap-1 shrink-0">
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`Open ${item.name} documentation`}
                    className="text-zinc-500 hover:text-zinc-300 p-1"
                  >
                    <ExternalLink className="h-3.5 w-3.5" />
                  </a>
                  <button
                    type="button"
                    aria-label={`Remove ${item.name} from selection`}
                    onClick={() => onRemove(item.id)}
                    className="text-zinc-500 hover:text-red-400 p-1 transition-colors"
                  >
                    <X className="h-3.5 w-3.5" />
                  </button>
                </div>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
