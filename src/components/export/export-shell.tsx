"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { useSelectionContext } from "@/components/providers/selection-provider";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download } from "lucide-react";
import { ConfigTab } from "./config-tab";
import {
  generateClaudeMd,
  generateAgentsMd,
  generateMcpJson,
  generateConfigToml,
} from "@/lib/config-generators";
import { downloadProjectZip } from "@/lib/zip";
import type { CatalogItem } from "@/types/catalog";
import type { ExportPlatform } from "@/types/project";

export function ExportShell({ allItems }: { allItems: CatalogItem[] }) {
  const { selectedIds, count } = useSelectionContext();
  const [platform, setPlatform] = useState<ExportPlatform>("both");

  const selectedItems = useMemo(
    () => allItems.filter((item) => selectedIds.has(item.id)),
    [allItems, selectedIds]
  );

  const configs = useMemo(() => {
    const claudeItems = selectedItems.filter((i) =>
      i.platforms.includes("claude-code")
    );
    const codexItems = selectedItems.filter((i) =>
      i.platforms.includes("codex")
    );

    return {
      claudeMd: generateClaudeMd(claudeItems),
      agentsMd: generateAgentsMd(codexItems),
      mcpJson: generateMcpJson(claudeItems),
      configToml: generateConfigToml(codexItems),
    };
  }, [selectedItems]);

  if (count === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <h2 className="text-lg font-semibold">No tools selected</h2>
        <p className="text-sm text-zinc-400 mt-2">
          Go back to the catalog to select tools first.
        </p>
        <Link href="/">
          <Button className="mt-6" variant="secondary">
            Browse Catalog
          </Button>
        </Link>
      </div>
    );
  }

  const showClaude = platform === "claude-code" || platform === "both";
  const showCodex = platform === "codex" || platform === "both";

  async function handleDownloadZip() {
    const files: Record<string, string> = {};
    if (showClaude) {
      files["CLAUDE.md"] = configs.claudeMd;
      files[".claude/mcp.json"] = configs.mcpJson;
    }
    if (showCodex) {
      files["AGENTS.md"] = configs.agentsMd;
      files[".codex/config.toml"] = configs.configToml;
    }
    await downloadProjectZip(files, "tool-bag");
  }

  const defaultTab = showClaude ? "claude-md" : "agents-md";

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Link href="/project">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="h-3.5 w-3.5 mr-1.5" />
              Back
            </Button>
          </Link>
          <div>
            <h1 className="text-xl font-semibold">Export Config</h1>
            <p className="text-sm text-zinc-400">
              {count} tool{count !== 1 ? "s" : ""} selected
            </p>
          </div>
        </div>
        <Button onClick={handleDownloadZip} size="sm">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Download ZIP
        </Button>
      </div>

      {/* Platform selector */}
      <div className="flex items-center gap-3">
        <span className="text-xs text-zinc-500">Export for:</span>
        <ToggleGroup
          type="single"
          value={platform}
          onValueChange={(v) => {
            if (v) setPlatform(v as ExportPlatform);
          }}
          className="bg-zinc-900 rounded-lg p-0.5 border border-zinc-800"
        >
          <ToggleGroupItem
            value="both"
            className="rounded-md px-3 py-1 text-xs data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 text-zinc-400"
          >
            Both
          </ToggleGroupItem>
          <ToggleGroupItem
            value="claude-code"
            className="rounded-md px-3 py-1 text-xs data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 text-zinc-400"
          >
            Claude Code
          </ToggleGroupItem>
          <ToggleGroupItem
            value="codex"
            className="rounded-md px-3 py-1 text-xs data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 text-zinc-400"
          >
            Codex
          </ToggleGroupItem>
        </ToggleGroup>
      </div>

      {/* Config tabs */}
      <Tabs defaultValue={defaultTab} className="w-full">
        <TabsList className="bg-zinc-900 border border-zinc-800">
          {showClaude && (
            <>
              <TabsTrigger value="claude-md" className="text-xs">
                CLAUDE.md
              </TabsTrigger>
              <TabsTrigger value="mcp-json" className="text-xs">
                mcp.json
              </TabsTrigger>
            </>
          )}
          {showCodex && (
            <>
              <TabsTrigger value="agents-md" className="text-xs">
                AGENTS.md
              </TabsTrigger>
              <TabsTrigger value="config-toml" className="text-xs">
                config.toml
              </TabsTrigger>
            </>
          )}
        </TabsList>

        {showClaude && (
          <>
            <TabsContent value="claude-md">
              <ConfigTab
                filename="CLAUDE.md"
                content={configs.claudeMd}
                language="markdown"
              />
            </TabsContent>
            <TabsContent value="mcp-json">
              <ConfigTab
                filename=".claude/mcp.json"
                content={configs.mcpJson}
                language="json"
              />
            </TabsContent>
          </>
        )}
        {showCodex && (
          <>
            <TabsContent value="agents-md">
              <ConfigTab
                filename="AGENTS.md"
                content={configs.agentsMd}
                language="markdown"
              />
            </TabsContent>
            <TabsContent value="config-toml">
              <ConfigTab
                filename=".codex/config.toml"
                content={configs.configToml}
                language="toml"
              />
            </TabsContent>
          </>
        )}
      </Tabs>
    </div>
  );
}
