"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { PRIORITIES, SOURCES } from "@/lib/constants";

interface FilterBarProps {
  priority: string;
  source: string;
  onPriorityChange: (v: string) => void;
  onSourceChange: (v: string) => void;
  onClear: () => void;
  hasFilters: boolean;
}

export function FilterBar({
  priority,
  source,
  onPriorityChange,
  onSourceChange,
  onClear,
  hasFilters,
}: FilterBarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <Select value={priority || "all"} onValueChange={(v) => onPriorityChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-900 border-zinc-800">
          <SelectValue placeholder="Priority" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All priorities</SelectItem>
          {PRIORITIES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={source || "all"} onValueChange={(v) => onSourceChange(v === "all" ? "" : v)}>
        <SelectTrigger className="w-[140px] h-8 text-xs bg-zinc-900 border-zinc-800">
          <SelectValue placeholder="Source" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All sources</SelectItem>
          {SOURCES.map(({ value, label }) => (
            <SelectItem key={value} value={value}>
              {label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      {hasFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={onClear}
          className="h-8 text-xs text-zinc-400 hover:text-zinc-200"
        >
          <X className="h-3 w-3 mr-1" />
          Clear filters
        </Button>
      )}
    </div>
  );
}
