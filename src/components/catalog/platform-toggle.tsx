"use client";

import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { PLATFORMS } from "@/lib/constants";

export function PlatformToggle({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: "claude-code" | "codex" | "both") => void;
}) {
  return (
    <ToggleGroup
      data-testid="platform-toggle"
      type="single"
      value={value}
      onValueChange={(v) => {
        if (v) onChange(v as "claude-code" | "codex" | "both");
      }}
      className="bg-zinc-900 rounded-lg p-0.5 border border-zinc-800"
    >
      {PLATFORMS.map(({ value: val, label }) => (
        <ToggleGroupItem
          key={val}
          value={val}
          className="rounded-md px-3 py-1.5 text-xs font-medium data-[state=on]:bg-zinc-700 data-[state=on]:text-zinc-100 text-zinc-400"
        >
          {label}
        </ToggleGroupItem>
      ))}
    </ToggleGroup>
  );
}
