"use client";

import { Card } from "@/components/ui/card";
import { CATEGORIES } from "@/lib/constants";
import type { CatalogItem } from "@/types/catalog";

export function ProjectStats({ items }: { items: CatalogItem[] }) {
  const byCategory: Record<string, number> = {};
  const byPriority: Record<string, number> = { essential: 0, recommended: 0, optional: 0 };
  let claudeCodeCount = 0;
  let codexCount = 0;

  for (const item of items) {
    byCategory[item.category] = (byCategory[item.category] || 0) + 1;
    byPriority[item.priority]++;
    if (item.platforms.includes("claude-code")) claudeCodeCount++;
    if (item.platforms.includes("codex")) codexCount++;
  }

  return (
    <Card className="p-4 bg-card border-border">
      <h3 className="text-sm font-medium mb-3">Selection Stats</h3>

      <div className="flex flex-col gap-3">
        {/* Category breakdown */}
        <div>
          <p className="text-xs text-zinc-500 mb-1.5">By category</p>
          <div className="flex flex-col gap-1">
            {CATEGORIES.filter((c) => byCategory[c.value]).map((c) => (
              <div key={c.value} className="flex items-center justify-between">
                <span className="text-xs text-zinc-400">{c.label}</span>
                <span className="text-xs font-medium">{byCategory[c.value]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Platform breakdown */}
        <div className="border-t border-zinc-800 pt-3">
          <p className="text-xs text-zinc-500 mb-1.5">Platform coverage</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-blue-400">Claude Code</span>
              <span className="text-xs font-medium">{claudeCodeCount}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-green-400">Codex</span>
              <span className="text-xs font-medium">{codexCount}</span>
            </div>
          </div>
        </div>

        {/* Priority breakdown */}
        <div className="border-t border-zinc-800 pt-3">
          <p className="text-xs text-zinc-500 mb-1.5">By priority</p>
          <div className="flex flex-col gap-1">
            <div className="flex items-center justify-between">
              <span className="text-xs text-emerald-400">Essential</span>
              <span className="text-xs font-medium">{byPriority.essential}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-sky-400">Recommended</span>
              <span className="text-xs font-medium">{byPriority.recommended}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-zinc-400">Optional</span>
              <span className="text-xs font-medium">{byPriority.optional}</span>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
