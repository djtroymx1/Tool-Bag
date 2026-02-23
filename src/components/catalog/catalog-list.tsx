"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink } from "lucide-react";
import { Checkbox } from "@/components/ui/checkbox";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import { useSelectionContext } from "@/components/providers/selection-provider";
import type { CatalogItem, Priority } from "@/types/catalog";

const ROW_ACCENT: Record<Priority, string> = {
  essential: "border-l-2 border-l-emerald-500",
  recommended: "border-l-2 border-l-sky-500",
  optional: "border-l-2 border-l-transparent",
};

function ListRow({
  item,
  isSelected,
  onToggle,
  activePlatform,
  onStackFilter: _onStackFilter,
  onPriorityFilter,
  onSourceFilter,
}: {
  item: CatalogItem;
  isSelected: boolean;
  onToggle: () => void;
  activePlatform: "claude-code" | "codex" | "both";
  onStackFilter?: (stack: string) => void;
  onPriorityFilter?: (priority: string) => void;
  onSourceFilter?: (source: string) => void;
}) {
  void _onStackFilter; // Reserved for future stack tag display in list rows
  const [expanded, setExpanded] = useState(false);
  const showClaudeInstructions =
    activePlatform === "both" || activePlatform === "claude-code";
  const showCodexInstructions =
    activePlatform === "both" || activePlatform === "codex";
  const mcpConfig =
    activePlatform === "codex"
      ? item.mcp_config_codex ?? item.mcp_config_claude
      : item.mcp_config_claude;
  const mcpConfigText = mcpConfig ? JSON.stringify(mcpConfig, null, 2) : null;
  const mcpLabel =
    activePlatform === "codex"
      ? "MCP Config (Codex)"
      : activePlatform === "claude-code"
        ? "MCP Config (Claude Code)"
        : "MCP Config";

  return (
    <div
      data-testid="catalog-list-row"
      className={cn(
        "border-b border-zinc-800 transition-colors hover:bg-zinc-900/50",
        ROW_ACCENT[item.priority],
        isSelected && "bg-emerald-950/20"
      )}
    >
      {/* Main row */}
      <div className="flex items-center gap-3 px-4 py-3">
        <Checkbox
          checked={isSelected}
          onCheckedChange={onToggle}
          aria-label={`Select ${item.name}`}
          className="shrink-0"
        />

        {/* Name — clickable to expand */}
        <button
          type="button"
          onClick={() => setExpanded(!expanded)}
          className="min-w-0 shrink-0 text-sm font-semibold text-zinc-100 hover:text-emerald-400 transition-colors text-left truncate max-w-[200px]"
          data-testid="catalog-list-row-name"
        >
          {item.name}
        </button>

        {/* Badges */}
        <div className="flex items-center gap-1.5 shrink-0">
          <PriorityBadge
            priority={item.priority}
            onClick={
              onPriorityFilter
                ? () => onPriorityFilter(item.priority)
                : undefined
            }
          />
          <PlatformBadge platforms={item.platforms} />
          <SourceBadge
            source={item.source}
            onClick={
              onSourceFilter ? () => onSourceFilter(item.source) : undefined
            }
          />
        </div>

        {/* Description */}
        <p className="min-w-0 flex-1 text-sm text-zinc-400 truncate">
          {item.description}
        </p>

        {/* Expand chevron */}
        <button
          type="button"
          aria-label={
            expanded ? `Collapse ${item.name}` : `Expand ${item.name}`
          }
          onClick={() => setExpanded(!expanded)}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors p-1 rounded focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50"
          data-testid="catalog-list-row-expand"
        >
          <ChevronDown
            className={cn(
              "h-4 w-4 transition-transform duration-300",
              expanded && "rotate-180"
            )}
          />
        </button>
      </div>

      {/* Expanded content — same CSS grid animation as cards */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        inert={expanded ? undefined : true}
      >
        <div className="overflow-hidden">
          <div className="flex flex-col gap-3 px-4 pb-4 pt-1 ml-8">
            {showClaudeInstructions && item.claude_code_install && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">
                    Claude Code
                  </span>
                  <CopyButton text={item.claude_code_install} />
                </div>
                <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-2 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {item.claude_code_install}
                </pre>
              </div>
            )}
            {showCodexInstructions && item.codex_install && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-emerald-400 uppercase tracking-wider">
                    Codex
                  </span>
                  <CopyButton text={item.codex_install} />
                </div>
                <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-2 text-xs font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
                  {item.codex_install}
                </pre>
              </div>
            )}
            {item.activation_hint && (
              <div className="mt-1 pt-2 border-t border-zinc-800">
                <p className="text-xs font-medium text-zinc-400 mb-1">
                  Activation Rule
                </p>
                <p className="text-sm text-zinc-300">{item.activation_hint}</p>
              </div>
            )}
            {mcpConfigText && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    {mcpLabel}
                  </span>
                  <CopyButton text={mcpConfigText} />
                </div>
                <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-2 text-xs font-mono text-emerald-400 overflow-x-auto">
                  {mcpConfigText}
                </pre>
              </div>
            )}
            {/* View Source link */}
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-md bg-zinc-800 hover:bg-zinc-700 text-zinc-200 transition-colors self-start"
              data-testid="catalog-list-view-source"
            >
              <ExternalLink className="h-3 w-3" />
              View Source
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}

export function CatalogList({
  items,
  onClearFilters,
  activePlatform,
  onStackFilter,
  onPriorityFilter,
  onSourceFilter,
}: {
  items: CatalogItem[];
  onClearFilters: () => void;
  activePlatform: "claude-code" | "codex" | "both";
  onStackFilter?: (stack: string) => void;
  onPriorityFilter?: (priority: string) => void;
  onSourceFilter?: (source: string) => void;
}) {
  const { isSelected, toggle } = useSelectionContext();

  if (items.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-sm text-zinc-400">
          No tools match your current filters.
        </p>
        <p className="text-xs text-zinc-500 mt-1">
          Try adjusting your search or filter criteria.
        </p>
        <button
          onClick={onClearFilters}
          className="mt-4 text-sm font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
        >
          Clear all filters
        </button>
      </div>
    );
  }

  return (
    <div
      data-testid="catalog-list"
      className="rounded-lg border border-zinc-800 overflow-hidden divide-y divide-zinc-800"
    >
      {items.map((item) => (
        <ListRow
          key={item.id}
          item={item}
          isSelected={isSelected(item.id)}
          onToggle={() => toggle(item.id)}
          activePlatform={activePlatform}
          onStackFilter={onStackFilter}
          onPriorityFilter={onPriorityFilter}
          onSourceFilter={onSourceFilter}
        />
      ))}
    </div>
  );
}
