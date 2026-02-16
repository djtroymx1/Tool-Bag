"use client";

import { useState, useSyncExternalStore } from "react";
import { X, Search, CheckSquare, Download } from "lucide-react";

const STORAGE_KEY = "hero-dismissed";

function readDismissed(): boolean {
  if (typeof window === "undefined") return false;
  return localStorage.getItem(STORAGE_KEY) === "true";
}

const CALLOUTS = [
  {
    icon: Search,
    title: "Browse & Filter",
    description: "Search 55+ skills, MCP servers, and dev tools",
  },
  {
    icon: CheckSquare,
    title: "Select for Project",
    description: "Check items to build your custom toolkit",
  },
  {
    icon: Download,
    title: "Export Config",
    description: "Generate CLAUDE.md, AGENTS.md, mcp.json, or config.toml",
  },
];

export function HeroIntro() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [dismissed, setDismissed] = useState(() => readDismissed());

  function dismiss() {
    setDismissed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  if (!hydrated) {
    return (
      <div
        className="relative border-b border-zinc-800/50 pb-4 mb-2 min-h-[200px] sm:min-h-[140px]"
        aria-hidden="true"
      />
    );
  }

  if (dismissed) return null;

  return (
    <div className="relative border-b border-zinc-800/50 pb-4 mb-2">
      <button
        onClick={dismiss}
        className="absolute top-0 right-0 text-zinc-600 hover:text-zinc-400 transition-colors"
        aria-label="Dismiss intro"
      >
        <X className="h-4 w-4" />
      </button>

      <h1 className="text-xl font-bold text-zinc-100">
        Find the right tools for your next project
      </h1>
      <p className="text-sm text-zinc-400 mt-2 max-w-2xl">
        Browse the complete Claude Code and Codex ecosystem. Filter by platform,
        stack, or priority. Select the tools you need, then export ready-to-paste
        config files.
      </p>

      <div className="flex flex-col sm:flex-row gap-4 sm:gap-8 mt-5">
        {CALLOUTS.map(({ icon: Icon, title, description }) => (
          <div key={title} className="flex items-start gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-zinc-900 border border-zinc-800">
              <Icon className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <p className="text-sm font-medium text-zinc-200">{title}</p>
              <p className="text-xs text-zinc-400">{description}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
