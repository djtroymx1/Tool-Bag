"use client";

import { useEffect, useState, useSyncExternalStore } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Layers, GitCompare, FolderOpen, HelpCircle } from "lucide-react";
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

  const isClient = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );

  const [tourCompleted, setTourCompleted] = useState(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("catalog-tour-completed") === "true";
  });

  useEffect(() => {
    if (!isClient) return;

    function syncTourStateFromStorage() {
      setTourCompleted(localStorage.getItem("catalog-tour-completed") === "true");
    }

    function handleTourStatusChanged(event: Event) {
      const detail = (event as CustomEvent<{ completed?: boolean }>).detail;
      if (typeof detail?.completed === "boolean") {
        setTourCompleted(detail.completed);
        return;
      }
      syncTourStateFromStorage();
    }

    function handleStorage(event: StorageEvent) {
      if (event.key && event.key !== "catalog-tour-completed") return;
      setTourCompleted(event.newValue === "true");
    }

    syncTourStateFromStorage();
    window.addEventListener(
      "tour-status-changed",
      handleTourStatusChanged as EventListener
    );
    window.addEventListener("storage", handleStorage);

    return () => {
      window.removeEventListener(
        "tour-status-changed",
        handleTourStatusChanged as EventListener
      );
      window.removeEventListener("storage", handleStorage);
    };
  }, [isClient]);

  function replayTour() {
    localStorage.removeItem("catalog-tour-completed");
    setTourCompleted(false);
    window.dispatchEvent(
      new CustomEvent("tour-status-changed", { detail: { completed: false } })
    );
    window.dispatchEvent(new CustomEvent("replay-tour"));
  }

  return (
    <header className="sticky top-0 z-50 border-b border-zinc-800 bg-background/80 backdrop-blur-xl">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-md bg-zinc-800">
            <Layers className="h-4 w-4 text-zinc-300" />
          </div>
          <span className="text-sm font-semibold tracking-tight">
            Tool Bag
          </span>
        </Link>

        <div className="flex items-center gap-2">
          <nav className="flex items-center gap-1">
            {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
              const isActive =
                href === "/" ? pathname === "/" : pathname.startsWith(href);
              const showCount = label === "Project" && hydrated && count > 0;

              return (
                <Link
                  key={href}
                  href={href}
                  data-testid={`nav-${label.toLowerCase()}`}
                  className={cn(
                    "flex items-center gap-1.5 rounded-md px-3 py-1.5 text-sm transition-colors",
                    isActive
                      ? "bg-zinc-100 text-zinc-900 font-medium"
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

          {pathname === "/" && isClient && tourCompleted && (
            <button
              onClick={replayTour}
              className="flex h-6 w-6 items-center justify-center rounded-full border border-zinc-700 text-zinc-500 hover:text-zinc-300 hover:border-zinc-600 transition-colors"
              aria-label="Replay tour"
              title="Replay tour"
              data-testid="tour-replay-button"
            >
              <HelpCircle className="h-3.5 w-3.5" />
            </button>
          )}
        </div>
      </div>
    </header>
  );
}
