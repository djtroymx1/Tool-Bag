"use client";

import { useEffect } from "react";
import { RotateCcw, Pencil, Download, ArrowRight, Info } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { useSelectionContext } from "@/components/providers/selection-provider";
import type { RecommendationResponse } from "./recommend-shell";
import type { CatalogItem } from "@/types/catalog";
import Link from "next/link";

export function RecommendationResults({
  results,
  allItems,
  platform,
  onStartOver,
  onEditDocument,
}: {
  results: RecommendationResponse;
  allItems: CatalogItem[];
  platform: "claude-code" | "codex" | "both";
  onStartOver: () => void;
  onEditDocument: () => void;
}) {
  const { isSelected, toggle } = useSelectionContext();

  // Auto-select essential items on mount
  useEffect(() => {
    const essentialSlugs = results.recommendations
      .filter((r) => r.importance === "essential")
      .map((r) => r.slug);

    for (const slug of essentialSlugs) {
      const item = allItems.find((i) => i.slug === slug);
      if (item && !isSelected(item.id)) {
        toggle(item.id);
      }
    }
    // Only run on mount
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const essential = results.recommendations.filter(
    (r) => r.importance === "essential"
  );
  const recommended = results.recommendations.filter(
    (r) => r.importance === "recommended"
  );

  function findItem(slug: string): CatalogItem | undefined {
    return allItems.find((i) => i.slug === slug);
  }

  function downloadMarkdown() {
    const lines: string[] = [];
    lines.push("# Tool Recommendations");
    lines.push("");
    lines.push(`## Project Summary`);
    lines.push(results.projectSummary);
    lines.push("");
    lines.push(
      `Platform: ${platform === "both" ? "Claude Code & Codex" : platform === "claude-code" ? "Claude Code" : "Codex"}`
    );
    lines.push("");
    lines.push("## Essential Tools");
    for (const r of essential) {
      lines.push(`- **${r.name}** (${r.category}) — ${r.reason}`);
    }
    lines.push("");
    lines.push("## Recommended Tools");
    for (const r of recommended) {
      lines.push(`- **${r.name}** (${r.category}) — ${r.reason}`);
    }
    const blob = new Blob([lines.join("\n")], { type: "text/markdown" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "tool-recommendations.md";
    a.click();
    URL.revokeObjectURL(url);
  }

  function RecommendationRow({
    rec,
    preChecked,
  }: {
    rec: (typeof results.recommendations)[0];
    preChecked: boolean;
  }) {
    const item = findItem(rec.slug);
    const itemId = item?.id;
    const checked = itemId ? isSelected(itemId) : preChecked;

    return (
      <div className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 transition-colors hover:bg-zinc-900/80">
        <Checkbox
          checked={checked}
          onCheckedChange={() => {
            if (itemId) toggle(itemId);
          }}
          aria-label={`Select ${rec.name}`}
          className="mt-0.5"
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <span className="text-sm font-semibold text-zinc-100">
              {rec.name}
            </span>
            <Badge
              variant="outline"
              className="text-[10px] px-1.5 py-0 h-5 bg-zinc-800/60 text-zinc-400 border-zinc-700/50"
            >
              {rec.category}
            </Badge>
          </div>
          <p className="mt-1 text-xs text-zinc-400">{rec.reason}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6">
      {/* AI notice */}
      {!results.isAIPowered && (
        <div className="flex items-start gap-2 rounded-lg border border-amber-500/20 bg-amber-500/5 px-4 py-3">
          <Info className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
          <p className="text-xs text-amber-300/80">
            AI-powered analysis unavailable. Showing keyword-based
            recommendations. Results improve with an Anthropic API key.
          </p>
        </div>
      )}

      {/* Project summary */}
      <div className="rounded-lg border border-zinc-800 bg-zinc-900/40 p-4">
        <h2 className="text-sm font-semibold text-zinc-200">
          Project Summary
        </h2>
        <p className="mt-1 text-sm text-zinc-400">{results.projectSummary}</p>
        <button
          onClick={onEditDocument}
          className="mt-2 inline-flex items-center gap-1.5 text-xs text-zinc-500 hover:text-zinc-300 transition-colors"
        >
          <Pencil className="h-3 w-3" />
          Not right? Edit and try again
        </button>
      </div>

      {/* Essential tools */}
      {essential.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">
            Essential{" "}
            <span className="text-xs font-normal text-zinc-500">
              (pre-selected)
            </span>
          </h3>
          <div className="flex flex-col gap-2">
            {essential.map((rec) => (
              <RecommendationRow key={rec.slug} rec={rec} preChecked={true} />
            ))}
          </div>
        </div>
      )}

      {/* Recommended tools */}
      {recommended.length > 0 && (
        <div>
          <h3 className="text-sm font-semibold text-zinc-200 mb-3">
            Recommended
          </h3>
          <div className="flex flex-col gap-2">
            {recommended.map((rec) => (
              <RecommendationRow key={rec.slug} rec={rec} preChecked={false} />
            ))}
          </div>
        </div>
      )}

      {/* Action buttons */}
      <div className="flex flex-wrap items-center gap-3 pt-2">
        <Link
          href="/project/export"
          className="inline-flex items-center gap-2 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
        >
          Export Config Files
          <ArrowRight className="h-3.5 w-3.5" />
        </Link>
        <Link
          href="/"
          className="inline-flex items-center gap-2 rounded-md border border-zinc-700 bg-zinc-900 px-4 py-2 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-800"
        >
          Browse More
        </Link>
        <button
          onClick={downloadMarkdown}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <Download className="h-3.5 w-3.5" />
          Save Recommendations
        </button>
        <button
          onClick={onStartOver}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors ml-auto"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Start Over
        </button>
      </div>
    </div>
  );
}
