import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";

export default function NotFound() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <h1 className="text-6xl font-bold text-zinc-700">404</h1>
      <p className="text-sm text-zinc-400 mt-4">Page not found.</p>
      <Link href="/">
        <Button variant="secondary" className="mt-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Catalog
        </Button>
      </Link>
    </div>
  );
}
