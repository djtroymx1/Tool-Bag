import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types/catalog";

const STYLES: Record<Priority, string> = {
  essential: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  recommended: "bg-sky-500/10 text-sky-400 border-sky-500/20",
  optional: "bg-zinc-500/10 text-zinc-400 border-zinc-500/20",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={`${STYLES[priority]} text-xs capitalize`}>
      {priority}
    </Badge>
  );
}
