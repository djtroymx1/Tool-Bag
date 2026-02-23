"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { useSelectionContext } from "@/components/providers/selection-provider";
import { ExternalLink, Star, Plus, Check } from "lucide-react";
import type { CatalogItem } from "@/types/catalog";

export function ToolDrawer({
  item,
  open,
  onOpenChange,
  activePlatform,
}: {
  item: CatalogItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  activePlatform: "claude-code" | "codex" | "both";
}) {
  const { isSelected, toggle } = useSelectionContext();

  if (!item) return null;

  const selected = isSelected(item.id);
  const showClaude =
    activePlatform === "both" || activePlatform === "claude-code";
  const showCodex = activePlatform === "both" || activePlatform === "codex";
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
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent
        side="right"
        className="w-full sm:max-w-md overflow-y-auto"
      >
        <SheetHeader className="pb-0">
          <div className="flex items-start gap-2">
            <SheetTitle className="text-base leading-snug">
              {item.name}
            </SheetTitle>
            {item.stars !== "--" && (
              <span className="flex items-center gap-0.5 text-xs text-zinc-500 shrink-0 mt-0.5">
                <Star className="h-3 w-3" />
                {item.stars}
              </span>
            )}
          </div>
          <SheetDescription className="sr-only">
            Details for {item.name}
          </SheetDescription>
        </SheetHeader>

        <div className="flex flex-col gap-4 px-4 pb-6">
          {/* Badges */}
          <div className="flex items-center gap-1.5 flex-wrap">
            <PriorityBadge priority={item.priority} />
            <SourceBadge source={item.source} />
            <PlatformBadge platforms={item.platforms} />
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
            >
              {item.category}
            </Badge>
          </div>

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

          {/* Description */}
          <p className="text-sm text-zinc-300 leading-relaxed">
            {item.description}
          </p>

          {/* Activation hint */}
          {item.activation_hint && (
            <div className="rounded-lg border border-zinc-800 bg-zinc-900/60 p-3">
              <p className="text-xs font-medium text-zinc-400 mb-1">
                Activation Rule
              </p>
              <p className="text-sm text-zinc-300">{item.activation_hint}</p>
            </div>
          )}

          {/* Install commands */}
          {showClaude && item.claude_code_install && (
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
          {showCodex && item.codex_install && (
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

          {/* MCP config */}
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

          {/* Action buttons */}
          <div className="flex items-center gap-2 pt-2 border-t border-zinc-800">
            <button
              onClick={() => toggle(item.id)}
              className={`flex-1 inline-flex items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
                selected
                  ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600/30"
                  : "bg-emerald-600 text-white hover:bg-emerald-500"
              }`}
            >
              {selected ? (
                <>
                  <Check className="h-4 w-4" />
                  Added to Project
                </>
              ) : (
                <>
                  <Plus className="h-4 w-4" />
                  Add to Project
                </>
              )}
            </button>
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
            >
              <ExternalLink className="h-3.5 w-3.5" />
              Source
            </a>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  );
}
