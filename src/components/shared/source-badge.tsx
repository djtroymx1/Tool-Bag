import { Badge } from "@/components/ui/badge";
import type { Source } from "@/types/catalog";

const STYLES: Record<Source, string> = {
  Official: "bg-amber-500/15 text-amber-400 border-amber-500/25",
  Community: "bg-violet-500/15 text-violet-400 border-violet-500/25",
};

export function SourceBadge({ source }: { source: Source }) {
  return (
    <Badge variant="outline" className={`${STYLES[source]} rounded-md px-2 py-0.5 text-xs font-medium`}>
      {source}
    </Badge>
  );
}
