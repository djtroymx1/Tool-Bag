import { Badge } from "@/components/ui/badge";
import type { Platform } from "@/types/catalog";

const STYLES: Record<string, string> = {
  "claude-code": "bg-blue-500/10 text-blue-400 border-blue-500/20",
  codex: "bg-green-500/10 text-green-400 border-green-500/20",
};

export function PlatformBadge({ platforms }: { platforms: Platform[] }) {
  if (platforms.length === 2) {
    return (
      <Badge
        variant="outline"
        className="bg-gradient-to-r from-blue-500/10 to-green-500/10 text-zinc-300 border-zinc-700 text-xs"
      >
        Both
      </Badge>
    );
  }
  const p = platforms[0];
  return (
    <Badge variant="outline" className={`${STYLES[p]} text-xs`}>
      {p === "claude-code" ? "Claude Code" : "Codex"}
    </Badge>
  );
}
