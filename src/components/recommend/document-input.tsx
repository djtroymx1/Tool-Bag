"use client";

import { useState, useRef, useCallback } from "react";
import { ArrowLeft, Upload, FileText } from "lucide-react";
import { PlatformToggle } from "@/components/catalog/platform-toggle";

const MIN_CHARS = 50;
const MAX_CHARS = 50_000;

export function DocumentInput({
  onSubmit,
  onBack,
}: {
  onSubmit: (document: string, platform: string) => void;
  onBack: () => void;
}) {
  const [text, setText] = useState("");
  const [platform, setPlatform] = useState<"claude-code" | "codex" | "both">(
    "both"
  );
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const charCount = text.length;
  const isValid = charCount >= MIN_CHARS && charCount <= MAX_CHARS;

  const handleFile = useCallback((file: File) => {
    if (!file.name.match(/\.(md|txt|text|markdown)$/i)) {
      return;
    }
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = e.target?.result;
      if (typeof content === "string") {
        setText(content.slice(0, MAX_CHARS));
      }
    };
    reader.readAsText(file);
  }, []);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(true);
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault();
    setDragActive(false);
  }

  function handleFileInput(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  }

  return (
    <div className="flex flex-col gap-5">
      {/* Back button */}
      <button
        onClick={onBack}
        className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors self-start"
      >
        <ArrowLeft className="h-3.5 w-3.5" />
        Back
      </button>

      {/* Platform selector */}
      <PlatformToggle value={platform} onChange={setPlatform} />

      {/* Textarea with drop zone */}
      <div
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`relative rounded-lg border-2 border-dashed transition-colors ${
          dragActive
            ? "border-emerald-500 bg-emerald-500/5"
            : "border-zinc-700 hover:border-zinc-600"
        }`}
      >
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value.slice(0, MAX_CHARS))}
          placeholder={`Paste your PRD, README, or project spec here...\n\nExample:\n# My SaaS App\nBuilding a Next.js + Supabase SaaS with auth, payments,\nand a dashboard. Using TypeScript, Tailwind CSS, and\ndeploying to Vercel. Currently in the MVP phase...`}
          className="w-full min-h-[300px] rounded-lg bg-transparent p-4 text-sm font-mono text-zinc-200 placeholder:text-zinc-600 focus:outline-none resize-y"
          data-testid="document-input-textarea"
        />

        {/* Drop overlay */}
        {dragActive && (
          <div className="absolute inset-0 flex items-center justify-center rounded-lg bg-zinc-900/90">
            <div className="flex flex-col items-center gap-2 text-emerald-400">
              <Upload className="h-8 w-8" />
              <span className="text-sm font-medium">Drop your file here</span>
            </div>
          </div>
        )}
      </div>

      {/* Controls row */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          {/* File upload button */}
          <button
            onClick={() => fileInputRef.current?.click()}
            className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
          >
            <FileText className="h-3.5 w-3.5" />
            Upload .md / .txt
          </button>
          <input
            ref={fileInputRef}
            type="file"
            accept=".md,.txt,.text,.markdown"
            onChange={handleFileInput}
            className="hidden"
          />

          {/* Char count */}
          <span
            className={`text-xs ${
              charCount < MIN_CHARS
                ? "text-amber-400"
                : charCount > MAX_CHARS * 0.9
                  ? "text-amber-400"
                  : "text-zinc-500"
            }`}
          >
            {charCount.toLocaleString()} / {MAX_CHARS.toLocaleString()} chars
            {charCount < MIN_CHARS && ` (min ${MIN_CHARS})`}
          </span>
        </div>

        {/* Submit */}
        <button
          onClick={() => onSubmit(text, platform)}
          disabled={!isValid}
          className="rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
          data-testid="document-input-submit"
        >
          Analyze &amp; Recommend
        </button>
      </div>
    </div>
  );
}
