"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, GitCompare, FolderOpen } from "lucide-react";
import { cn } from "@/lib/utils";
import { useSelectionContext } from "@/components/providers/selection-provider";

const NAV_ITEMS = [
  { href: "/", label: "Catalog", icon: Layers },
  { href: "/compare", label: "Compare", icon: GitCompare },
  { href: "/project", label: "Project", icon: FolderOpen },
];

export function SiteHeader() {
  const pathname = usePathname();
  const { count, hydrated } = useSelectionContext();

  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800">
            <Layers className="h-4 w-4 text-zinc-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Tool Bag
          </span>
        </Link>

        <nav className="flex items-center gap-1">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const isActive =
              href === "/" ? pathname === "/" : pathname.startsWith(href);
            const showCount = label === "Project" && hydrated && count > 0;

            return (
              <Link
                key={href}
                href={href}
                className={cn(
                  "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                  isActive
                    ? "bg-zinc-800 text-zinc-100"
                    : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/50"
                )}
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
                {showCount && (
                  <span className="ml-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-500/20 px-1.5 text-xs font-medium text-blue-400">
                    {count}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
