"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp, ExternalLink, Star } from "lucide-react";
import { Card } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Badge } from "@/components/ui/badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import type { CatalogItem } from "@/types/catalog";

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
      className={`relative flex flex-col gap-3 p-4 bg-card border-border transition-all duration-200 hover:border-zinc-700 ${
        isSelected ? "ring-1 ring-blue-500/30 border-blue-500/20" : ""
      }`}
    >
      {/* Header row */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-start gap-2.5">
          <Checkbox
            checked={isSelected}
            onCheckedChange={onToggle}
            className="mt-0.5"
          />
          <div className="flex flex-col gap-1">
            <div className="flex items-center gap-2 flex-wrap">
              <h3 className="text-sm font-medium leading-tight">
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
          className="shrink-0 text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
        </a>
      </div>

      {/* Description */}
      <p className="text-xs text-zinc-400 leading-relaxed line-clamp-2">
        {item.description}
      </p>

      {/* Stack tags */}
      {item.stack.length > 0 && item.stack[0] !== "General" && (
        <div className="flex gap-1 flex-wrap">
          {item.stack.map((s) => (
            <Badge
              key={s}
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-zinc-800/50 text-zinc-400 border-zinc-700"
            >
              {s}
            </Badge>
          ))}
        </div>
      )}

      {/* Expand toggle */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="flex items-center gap-1 text-xs text-zinc-500 hover:text-zinc-300 transition-colors self-start"
      >
        {expanded ? (
          <ChevronUp className="h-3 w-3" />
        ) : (
          <ChevronDown className="h-3 w-3" />
        )}
        {expanded ? "Less" : "Install"}
      </button>

      {/* Expanded content */}
      {expanded && (
        <div className="flex flex-col gap-3 pt-2 border-t border-zinc-800">
          {item.claude_code_install && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-blue-400 uppercase tracking-wider">
                  Claude Code
                </span>
                <CopyButton text={item.claude_code_install} />
              </div>
              <pre className="rounded-md bg-zinc-950 border border-zinc-800 p-2 text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap">
                {item.claude_code_install}
              </pre>
            </div>
          )}
          {item.codex_install && (
            <div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-[10px] font-medium text-green-400 uppercase tracking-wider">
                  Codex
                </span>
                <CopyButton text={item.codex_install} />
              </div>
              <pre className="rounded-md bg-zinc-950 border border-zinc-800 p-2 text-[11px] text-zinc-300 overflow-x-auto whitespace-pre-wrap">
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
              <pre className="rounded-md bg-zinc-950 border border-zinc-800 p-2 text-[11px] text-zinc-300 overflow-x-auto">
                {JSON.stringify(item.mcp_config_claude, null, 2)}
              </pre>
            </div>
          )}
        </div>
      )}
    </Card>
  );
}
