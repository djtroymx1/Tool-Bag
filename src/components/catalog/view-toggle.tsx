"use client";

import { LayoutGrid, List } from "lucide-react";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";

export type ViewMode = "grid" | "list";

export function ViewToggle({
  value,
  onChange,
}: {
  value: ViewMode;
  onChange: (v: ViewMode) => void;
}) {
  return (
    <ToggleGroup
      data-testid="view-toggle"
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as ViewMode);
      }}
      className="bg-zinc-900 rounded-lg p-0.5 border border-zinc-800"
    >
      <ToggleGroupItem
        value="grid"
        aria-label="Grid view"
        className="rounded-md px-2 py-1.5 data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-400"
      >
        <LayoutGrid className="h-3.5 w-3.5" />
      </ToggleGroupItem>
      <ToggleGroupItem
        value="list"
        aria-label="List view"
        className="rounded-md px-2 py-1.5 data-[state=on]:bg-zinc-100 data-[state=on]:text-zinc-900 text-zinc-400"
      >
        <List className="h-3.5 w-3.5" />
      </ToggleGroupItem>
    </ToggleGroup>
  );
}
