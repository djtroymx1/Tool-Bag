"use client";

import { useState } from "react";
import { ChevronDown, ExternalLink, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { cn } from "@/lib/utils";
import type { CatalogItem, Priority } from "@/types/catalog";

const LEFT_BORDER: Record<Priority, string> = {
  essential: "border-l-2 border-l-emerald-500",
  recommended: "border-l-2 border-l-sky-500",
  optional: "",
};

export function CatalogCard({
  item,
  isSelected,
  onToggle,
}: {
  item: CatalogItem;
  isSelected: boolean;
  onToggle: () => void;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card
      data-testid="catalog-card"
      className={cn(
        "relative flex flex-col gap-3 p-4 bg-zinc-900/60 border-zinc-800 rounded-lg transition-all duration-200 hover:border-zinc-700 hover:bg-zinc-900/80",
        LEFT_BORDER[item.priority],
        isSelected
          ? "bg-emerald-950/20 border-emerald-800/40"
          : ""
      )}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            aria-label={`Select ${item.name}`}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3
                data-testid="catalog-card-title"
                className="text-sm font-semibold text-zinc-100 leading-tight"
              >
                {item.name}
              </h3>
              {item.stars !== "--" && (
                <span className="flex items-center gap-0.5 text-xs text-zinc-500">
                  <Star className="h-3 w-3" />
                  {item.stars}
                </span>
              )}
            </div>
            <div className="flex items-center gap-1.5 flex-wrap">
              <PriorityBadge priority={item.priority} />
              <SourceBadge source={item.source} />
              <PlatformBadge platforms={item.platforms} />
            </div>
          </div>
        </div>
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Open ${item.name} documentation`}
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Description */}
      <p className="text-sm text-zinc-300 leading-relaxed line-clamp-2">
        {item.description}
      </p>

      {/* Stack tags */}
      {item.stack.length > 0 && item.stack[0] !== "General" && (
        <div className="flex gap-1 flex-wrap">
          {item.stack.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
            >
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      <button
        type="button"
        aria-label={expanded ? `Collapse ${item.name}` : `Expand ${item.name}`}
        data-testid="catalog-card-expand"
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors self-start focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-emerald-500/50 rounded"
      >
        <ChevronDown
          className={cn(
            "h-3 w-3 transition-transform duration-300",
            expanded && "rotate-180"
          )}
        />
        {expanded ? "Less" : "Install"}
      </button>

      {/* Expanded content — animated with CSS grid */}
      <div
        className={cn(
          "grid transition-[grid-template-rows] duration-300 ease-out",
          expanded ? "grid-rows-[1fr]" : "grid-rows-[0fr]"
        )}
        inert={expanded ? undefined : true}
        data-testid="catalog-card-expanded-container"
      >
        <div className="overflow-hidden" data-testid="catalog-card-expanded">
          <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800">
            {item.claude_code_install && (
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
            {item.codex_install && (
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
            {item.mcp_config_claude && (
              <div>
                <div className="flex items-center justify-between mb-1">
                  <span className="text-[10px] font-medium text-zinc-400 uppercase tracking-wider">
                    MCP Config
                  </span>
                  <CopyButton
                    text={JSON.stringify(item.mcp_config_claude, null, 2)}
                  />
                </div>
                <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-2 text-xs font-mono text-emerald-400 overflow-x-auto">
                  {JSON.stringify(item.mcp_config_claude, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
}
