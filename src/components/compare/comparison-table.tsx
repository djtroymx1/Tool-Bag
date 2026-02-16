"use client";

import { useState, useMemo } from "react";
import { ArrowUpDown } from "lucide-react";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { COMPARISON_TABLE } from "@/lib/constants";
import type { CatalogItem } from "@/types/catalog";

type SortKey = "name" | "category" | "priority" | "source";
type SortDir = "asc" | "desc";

export function ComparisonTable({ items }: { items: CatalogItem[] }) {
  const [sortKey, setSortKey] = useState<SortKey>("category");
  const [sortDir, setSortDir] = useState<SortDir>("asc");

  const sorted = useMemo(() => {
    return [...items].sort((a, b) => {
      const aVal = a[sortKey];
      const bVal = b[sortKey];
      const cmp = String(aVal).localeCompare(String(bVal));
      return sortDir === "asc" ? cmp : -cmp;
    });
  }, [items, sortKey, sortDir]);

  function handleSort(key: SortKey) {
    if (sortKey === key) {
      setSortDir((d) => (d === "asc" ? "desc" : "asc"));
    } else {
      setSortKey(key);
      setSortDir("asc");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Cross-platform reference table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          Claude Code vs Codex — Quick Reference
        </h2>
        <Card className="overflow-hidden bg-card border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400">
                    Concept
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-blue-400">
                    Claude Code
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-green-400">
                    Codex
                  </th>
                </tr>
              </thead>
              <tbody>
                {COMPARISON_TABLE.map((row, i) => (
                  <tr
                    key={row.concept}
                    className={
                      i % 2 === 0 ? "bg-zinc-950/50" : "bg-zinc-900/30"
                    }
                  >
                    <td className="px-4 py-2 text-xs font-medium text-zinc-300">
                      {row.concept}
                    </td>
                    <td className="px-4 py-2 text-xs font-mono text-zinc-400">
                      {row.claudeCode}
                    </td>
                    <td className="px-4 py-2 text-xs font-mono text-zinc-400">
                      {row.codex}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>

      {/* Full catalog table */}
      <div>
        <h2 className="text-lg font-semibold mb-4">
          All Catalog Items ({items.length})
        </h2>
        <Card className="overflow-hidden bg-card border-border">
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-800 bg-zinc-900/50">
                  {(
                    [
                      ["name", "Name"],
                      ["category", "Category"],
                      ["priority", "Priority"],
                      ["source", "Source"],
                    ] as [SortKey, string][]
                  ).map(([key, label]) => (
                    <th
                      key={key}
                      className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400"
                      aria-sort={
                        sortKey === key
                          ? sortDir === "asc"
                            ? "ascending"
                            : "descending"
                          : "none"
                      }
                    >
                      <button
                        type="button"
                        onClick={() => handleSort(key)}
                        className="flex items-center gap-1 hover:text-zinc-200 select-none"
                        aria-label={`Sort by ${label}`}
                      >
                        {label}
                        <ArrowUpDown className="h-3 w-3" />
                      </button>
                    </th>
                  ))}
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400">
                    Platforms
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400">
                    Stack
                  </th>
                  <th className="px-4 py-2.5 text-left text-xs font-medium text-zinc-400">
                    MCP Config
                  </th>
                </tr>
              </thead>
              <tbody>
                {sorted.map((item, i) => (
                  <tr
                    key={item.id}
                    className={`border-b border-zinc-800/50 ${
                      i % 2 === 0 ? "bg-zinc-950/50" : "bg-zinc-900/30"
                    }`}
                  >
                    <td className="px-4 py-2">
                      <a
                        href={item.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs font-medium text-zinc-200 hover:text-blue-400 transition-colors"
                      >
                        {item.name}
                      </a>
                    </td>
                    <td className="px-4 py-2 text-xs text-zinc-400">
                      {item.category}
                    </td>
                    <td className="px-4 py-2">
                      <PriorityBadge priority={item.priority} />
                    </td>
                    <td className="px-4 py-2">
                      <SourceBadge source={item.source} />
                    </td>
                    <td className="px-4 py-2">
                      <PlatformBadge platforms={item.platforms} />
                    </td>
                    <td className="px-4 py-2">
                      <span className="text-[10px] text-zinc-500">
                        {item.stack.join(", ")}
                      </span>
                    </td>
                    <td className="px-4 py-2">
                      <span
                        className={`text-[10px] ${
                          item.mcp_config_claude
                            ? "text-emerald-400"
                            : "text-zinc-600"
                        }`}
                      >
                        {item.mcp_config_claude ? "Yes" : "—"}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </Card>
      </div>
    </div>
  );
}
