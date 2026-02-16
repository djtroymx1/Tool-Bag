import { Badge } from "@/components/ui/badge";
import type { Platform } from "@/types/catalog";

const STYLES: Record<string, string> = {
  "claude-code": "bg-blue-500/15 text-blue-400 border-blue-500/25",
  codex: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
};

export function PlatformBadge({ platforms }: { platforms: Platform[] }) {
  if (platforms.length === 2) {
    return (
      <Badge
        variant="outline"
        className="bg-zinc-500/15 text-zinc-300 border-zinc-600/25 rounded-md px-2 py-0.5 text-xs font-medium"
      >
        Both
      </Badge>
    );
  }
  const p = platforms[0];
  return (
    <Badge variant="outline" className={`${STYLES[p]} rounded-md px-2 py-0.5 text-xs font-medium`}>
      {p === "claude-code" ? "Claude Code" : "Codex"}
    </Badge>
  );
}
