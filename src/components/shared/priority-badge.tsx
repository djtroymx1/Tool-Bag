import { Badge } from "@/components/ui/badge";
import type { Priority } from "@/types/catalog";

const STYLES: Record<Priority, string> = {
  essential: "bg-emerald-500/15 text-emerald-400 border-emerald-500/25",
  recommended: "bg-sky-500/15 text-sky-400 border-sky-500/25",
  optional: "bg-zinc-500/15 text-zinc-400 border-zinc-600/25",
};

export function PriorityBadge({ priority }: { priority: Priority }) {
  return (
    <Badge variant="outline" className={`${STYLES[priority]} rounded-md px-2 py-0.5 text-xs font-medium capitalize`}>
      {priority}
    </Badge>
  );
}
