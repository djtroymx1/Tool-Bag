"use client";

import { Card } from "@/components/ui/card";
import { CopyButton } from "@/components/shared/copy-button";

export function ConfigTab({
  filename,
  content,
  language,
}: {
  filename: string;
  content: string;
  language: string;
}) {
  const sizeKb = new Blob([content]).size / 1024;

  return (
    <Card className="bg-card border-border overflow-hidden">
      {/* File header */}
      <div className="flex items-center justify-between px-4 py-2 border-b border-zinc-800 bg-zinc-900/50">
        <div className="flex items-center gap-3">
          <span className="text-xs font-mono text-zinc-300">{filename}</span>
          <span className="text-[10px] text-zinc-500">
            {sizeKb.toFixed(1)} KB · {language}
          </span>
        </div>
        <CopyButton text={content} />
      </div>

      {/* Content */}
      <div className="max-h-[500px] overflow-auto">
        <pre className="p-4 text-[11px] leading-relaxed text-zinc-300 font-mono whitespace-pre-wrap">
          {content}
        </pre>
      </div>
    </Card>
  );
}
