"use client";

import Link from "next/link";
import { ArrowLeft, ExternalLink, Star, Plus, Check } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { PriorityBadge } from "@/components/shared/priority-badge";
import { PlatformBadge } from "@/components/shared/platform-badge";
import { SourceBadge } from "@/components/shared/source-badge";
import { CopyButton } from "@/components/shared/copy-button";
import { useSelectionContext } from "@/components/providers/selection-provider";
import type { CatalogItem } from "@/types/catalog";

export function ToolDetail({
  item,
  relatedItems,
}: {
  item: CatalogItem;
  relatedItems: CatalogItem[];
}) {
  const { isSelected, toggle } = useSelectionContext();
  const selected = isSelected(item.id);
  const mcpConfigText = item.mcp_config_claude
    ? JSON.stringify(item.mcp_config_claude, null, 2)
    : null;
  const codexMcpText = item.mcp_config_codex
    ? JSON.stringify(item.mcp_config_codex, null, 2)
    : null;

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Breadcrumb */}
      <nav className="mb-6">
        <Link
          href="/"
          className="inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <ArrowLeft className="h-3 w-3" />
          Back to Catalog
        </Link>
      </nav>

      {/* Header */}
      <div className="flex flex-col gap-4 mb-8">
        <div className="flex items-start justify-between gap-4">
          <div className="flex flex-col gap-2">
            <h1 className="text-2xl font-bold tracking-tight">{item.name}</h1>
            <div className="flex items-center gap-2 flex-wrap">
              <PriorityBadge priority={item.priority} />
              <SourceBadge source={item.source} />
              <PlatformBadge platforms={item.platforms} />
              {item.stars !== "--" && (
                <span className="flex items-center gap-0.5 text-xs text-zinc-500">
                  <Star className="h-3 w-3" />
                  {item.stars}
                </span>
              )}
            </div>
          </div>
          <button
            onClick={() => toggle(item.id)}
            className={`shrink-0 inline-flex items-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors ${
              selected
                ? "bg-emerald-600/20 text-emerald-400 border border-emerald-600/50 hover:bg-emerald-600/30"
                : "bg-emerald-600 text-white hover:bg-emerald-500"
            }`}
          >
            {selected ? (
              <>
                <Check className="h-4 w-4" />
                Added
              </>
            ) : (
              <>
                <Plus className="h-4 w-4" />
                Add to Project
              </>
            )}
          </button>
        </div>

        {/* Stack tags */}
        {item.stack.length > 0 && item.stack[0] !== "General" && (
          <div className="flex gap-1.5 flex-wrap">
            {item.stack.map((s) => (
              <Badge
                key={s}
                variant="outline"
                className="text-xs px-2 py-0.5 bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
              >
                {s}
              </Badge>
            ))}
          </div>
        )}
      </div>

      {/* Description */}
      <Card className="bg-zinc-900/60 border-zinc-800 p-5 mb-6">
        <p className="text-sm text-zinc-300 leading-relaxed">
          {item.description}
        </p>
      </Card>

      {/* Activation hint */}
      {item.activation_hint && (
        <Card className="bg-zinc-900/60 border-zinc-800 p-5 mb-6">
          <h2 className="text-xs font-medium text-zinc-400 uppercase tracking-wider mb-2">
            Activation Rule
          </h2>
          <p className="text-sm text-zinc-300 leading-relaxed">
            {item.activation_hint}
          </p>
        </Card>
      )}

      {/* Install commands */}
      <div className="flex flex-col gap-4 mb-6">
        {item.claude_code_install && (
          <Card className="bg-zinc-900/60 border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-blue-400 uppercase tracking-wider">
                Claude Code Install
              </span>
              <CopyButton text={item.claude_code_install} />
            </div>
            <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-3 text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
              {item.claude_code_install}
            </pre>
          </Card>
        )}
        {item.codex_install && (
          <Card className="bg-zinc-900/60 border-zinc-800 p-5">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-medium text-emerald-400 uppercase tracking-wider">
                Codex Install
              </span>
              <CopyButton text={item.codex_install} />
            </div>
            <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-3 text-sm font-mono text-emerald-400 overflow-x-auto whitespace-pre-wrap">
              {item.codex_install}
            </pre>
          </Card>
        )}
      </div>

      {/* MCP configs */}
      {(mcpConfigText || codexMcpText) && (
        <div className="flex flex-col gap-4 mb-6">
          {mcpConfigText && (
            <Card className="bg-zinc-900/60 border-zinc-800 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  MCP Config (Claude Code)
                </span>
                <CopyButton text={mcpConfigText} />
              </div>
              <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-3 text-sm font-mono text-emerald-400 overflow-x-auto">
                {mcpConfigText}
              </pre>
            </Card>
          )}
          {codexMcpText && (
            <Card className="bg-zinc-900/60 border-zinc-800 p-5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-medium text-zinc-400 uppercase tracking-wider">
                  MCP Config (Codex)
                </span>
                <CopyButton text={codexMcpText} />
              </div>
              <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-3 text-sm font-mono text-emerald-400 overflow-x-auto">
                {codexMcpText}
              </pre>
            </Card>
          )}
        </div>
      )}

      {/* View Source link */}
      <div className="mb-10">
        <a
          href={item.url}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 px-4 py-2 text-sm font-medium text-zinc-300 hover:bg-zinc-800 hover:text-zinc-100 transition-colors"
        >
          <ExternalLink className="h-3.5 w-3.5" />
          View Source
        </a>
      </div>

      {/* Related items */}
      {relatedItems.length > 0 && (
        <div className="border-t border-zinc-800 pt-8">
          <h2 className="text-sm font-semibold mb-4 text-zinc-300">
            More in {item.category}
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {relatedItems.map((rel) => (
              <Link key={rel.id} href={`/tools/${rel.slug}`}>
                <Card className="bg-zinc-900/60 border-zinc-800 p-4 hover:border-zinc-700 hover:bg-zinc-900/80 transition-all cursor-pointer">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="text-sm font-medium text-zinc-200">
                        {rel.name}
                      </h3>
                      <p className="text-xs text-zinc-500 mt-1 line-clamp-2">
                        {rel.description}
                      </p>
                    </div>
                    <PriorityBadge priority={rel.priority} />
                  </div>
                </Card>
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
