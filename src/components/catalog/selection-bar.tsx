"use client";

import Link from "next/link";
import { FolderOpen, ArrowRight } from "lucide-react";
import { useSelectionContext } from "@/components/providers/selection-provider";

export function SelectionBar() {
  const { count, hydrated } = useSelectionContext();
  const visible = hydrated && count > 0;

  return (
    <div
      data-testid="selection-bar"
      className={`fixed bottom-0 inset-x-0 z-50 transition-transform duration-200 ${
        visible ? "translate-y-0" : "translate-y-full"
      }`}
    >
      <div className="border-t border-zinc-800 bg-zinc-900/95 backdrop-blur">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <span className="text-sm text-zinc-400">
            <span className="font-semibold text-zinc-200">{count}</span>{" "}
            tool{count !== 1 ? "s" : ""} selected
          </span>
          <div className="flex items-center gap-3">
            <Link
              href="/project"
              className="inline-flex items-center gap-1.5 rounded-md border border-zinc-700 bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-300 transition-colors hover:bg-zinc-700"
            >
              <FolderOpen className="h-3.5 w-3.5" />
              View Project
            </Link>
            <Link
              href="/project/export"
              className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
            >
              Export Config
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
