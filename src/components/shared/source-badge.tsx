import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { Source } from "@/types/catalog";

const STYLES: Record<Source, string> = {
  Official: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Community: "bg-violet-500/15 text-violet-400 border-violet-500/25",
};

export function SourceBadge({
  source,
  onClick,
}: {
  source: Source;
  onClick?: () => void;
}) {
  function handleClick(e: React.MouseEvent) {
    e.stopPropagation();
    onClick?.();
  }

  return (
    <Badge
      variant="outline"
      className={cn(
        `${STYLES[source]} rounded-md px-2 py-0.5 text-xs font-medium`,
        onClick && "cursor-pointer hover:ring-1 hover:ring-emerald-500/50 transition-shadow"
      )}
      onClick={onClick ? handleClick : undefined}
      role={onClick ? "button" : undefined}
    >
      {source}
    </Badge>
  );
}
