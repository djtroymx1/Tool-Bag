import { Badge } from "@/components/ui/badge";
import type { Source } from "@/types/catalog";

const STYLES: Record<Source, string> = {
  Official: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  Community: "bg-violet-500/10 text-violet-400 border-violet-500/20",
};

export function SourceBadge({ source }: { source: Source }) {
  return (
    <Badge variant="outline" className={`${STYLES[source]} text-xs`}>
      {source}
    </Badge>
  );
}
