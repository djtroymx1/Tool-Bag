"use client";

import { useRouter } from "next/navigation";
import { AlertTriangle, RefreshCcw } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CatalogErrorState() {
  const router = useRouter();

  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-red-900/40 bg-red-950/20 py-12 text-center">
      <AlertTriangle className="h-6 w-6 text-red-400" />
      <p className="text-sm text-zinc-200">
        Unable to load catalog data. Please refresh the page.
      </p>
      <Button
        type="button"
        variant="secondary"
        size="sm"
        onClick={() => router.refresh()}
      >
        <RefreshCcw className="mr-1.5 h-3.5 w-3.5" />
        Retry
      </Button>
    </div>
  );
}
