"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  FileText,
  Wand2,
  ClipboardCopy,
  ChevronDown,
  Rocket,
  Server,
  Shield,
  Zap,
  GitBranch,
} from "lucide-react";
import { DocumentInput } from "./document-input";
import { DocumentBuilder } from "./document-builder";
import { RecommendationResults } from "./recommendation-results";
import { STARTER_KITS } from "@/data/starter-kits";
import { useSelectionContext } from "@/components/providers/selection-provider";
import type { CatalogItem } from "@/types/catalog";

type Step = "choose" | "paste" | "build" | "loading" | "results";

interface RecommendationItem {
  slug: string;
  name: string;
  category: string;
  reason: string;
  importance: "essential" | "recommended";
}

export interface RecommendationResponse {
  recommendations: RecommendationItem[];
  projectSummary: string;
  isAIPowered: boolean;
}

const PROMPT_TEMPLATE = `# Project Requirements Document

## Project Name
[Your project name]

## Tech Stack
- Framework: [e.g., Next.js, React, Vue]
- Language: [e.g., TypeScript, Python]
- Database: [e.g., Supabase, Firebase, PostgreSQL]
- Styling: [e.g., Tailwind CSS, CSS Modules]
- Deployment: [e.g., Vercel, AWS, Docker]

## Project Description
[2-3 sentences describing what you're building]

## Current Phase
[e.g., Starting from scratch, Adding features, Refactoring, Testing]

## Key Requirements
- [Requirement 1]
- [Requirement 2]
- [Requirement 3]

## AI Agent Preferences
- Platform: [Claude Code / Codex / Both]
- Experience level: [Beginner / Intermediate / Advanced]
- Priority: [Speed / Quality / Learning]
`;

const KIT_ICONS: Record<string, React.ElementType> = {
  Rocket,
  Server,
  Shield,
  Zap,
  GitBranch,
};

export function RecommendShell({
  allItems,
}: {
  allItems: CatalogItem[];
}) {
  const router = useRouter();
  const { add } = useSelectionContext();
  const [step, setStep] = useState<Step>("choose");
  const [platform, setPlatform] = useState<"claude-code" | "codex" | "both">(
    "both"
  );
  const [results, setResults] = useState<RecommendationResponse | null>(null);
  const [templateExpanded, setTemplateExpanded] = useState(false);
  const [templateCopied, setTemplateCopied] = useState(false);

  function applyStarterKit(slugs: string[]) {
    // Resolve slugs to item IDs and add them
    for (const slug of slugs) {
      const item = allItems.find((i) => i.slug === slug);
      if (item) add(item.id);
    }
    router.push("/project/export");
  }

  async function handleDocumentSubmit(document: string, selectedPlatform: string) {
    setPlatform(selectedPlatform as "claude-code" | "codex" | "both");
    setStep("loading");

    try {
      const res = await fetch("/api/recommend", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ document, platform: selectedPlatform }),
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.error || `Request failed: ${res.status}`);
      }

      const data: RecommendationResponse = await res.json();
      setResults(data);
      setStep("results");
    } catch (err) {
      console.error("Recommendation failed:", err);
      setStep("paste");
    }
  }

  function handleBuilderSubmit(generatedDocument: string, selectedPlatform: string) {
    handleDocumentSubmit(generatedDocument, selectedPlatform);
  }

  function handleStartOver() {
    setResults(null);
    setStep("choose");
  }

  function copyTemplate() {
    navigator.clipboard.writeText(PROMPT_TEMPLATE);
    setTemplateCopied(true);
    setTimeout(() => setTemplateCopied(false), 2000);
  }

  return (
    <div className="flex flex-col gap-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-zinc-100">
          Get Personalized Recommendations
        </h1>
        <p className="mt-2 text-sm text-zinc-400 max-w-2xl">
          Share your project document — a PRD, README, or tech spec — and get
          tailored tool recommendations with customized config files.
        </p>
      </div>

      {/* Step: Choose entry point */}
      {step === "choose" && (
        <div className="flex flex-col gap-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Paste document */}
            <button
              onClick={() => setStep("paste")}
              className="flex flex-col items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/80 group"
            >
              <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-400 group-hover:bg-emerald-500/20 transition-colors">
                <FileText className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  I have a document
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Paste your PRD, README, or project spec. We&apos;ll analyze it and
                  recommend the right tools.
                </p>
              </div>
            </button>

            {/* Guided builder */}
            <button
              onClick={() => setStep("build")}
              className="flex flex-col items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-6 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/80 group"
            >
              <div className="rounded-lg bg-sky-500/10 p-3 text-sky-400 group-hover:bg-sky-500/20 transition-colors">
                <Wand2 className="h-6 w-6" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-zinc-100">
                  Help me build one
                </h3>
                <p className="mt-1 text-xs text-zinc-400">
                  Answer a few questions about your project and we&apos;ll generate a
                  document for you.
                </p>
              </div>
            </button>
          </div>

          {/* Starter Kits — quick start */}
          <div>
            <h2 className="text-sm font-semibold text-zinc-200 mb-3">
              Quick Start Kits
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {STARTER_KITS.map((kit) => {
                const Icon = KIT_ICONS[kit.icon] ?? Zap;
                return (
                  <button
                    key={kit.id}
                    onClick={() => applyStarterKit(kit.slugs)}
                    className="flex items-start gap-3 rounded-lg border border-zinc-800 bg-zinc-900/60 p-4 text-left transition-all hover:border-zinc-700 hover:bg-zinc-900/80 group"
                  >
                    <div className="rounded-md bg-zinc-800 p-2 text-zinc-400 group-hover:text-zinc-200 transition-colors shrink-0">
                      <Icon className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="text-xs font-semibold text-zinc-200 group-hover:text-zinc-100">
                        {kit.name}
                      </h3>
                      <p className="mt-0.5 text-[11px] text-zinc-500 line-clamp-2">
                        {kit.description}
                      </p>
                      <span className="mt-1 text-[10px] text-zinc-600">
                        {kit.slugs.length} tools
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Collapsible prompt template */}
          <div className="rounded-lg border border-zinc-800 bg-zinc-900/40">
            <button
              onClick={() => setTemplateExpanded(!templateExpanded)}
              className="flex w-full items-center justify-between px-4 py-3 text-left"
            >
              <span className="text-xs text-zinc-400">
                Want to create your document yourself? Copy our template.
              </span>
              <ChevronDown
                className={`h-4 w-4 text-zinc-500 transition-transform duration-200 ${
                  templateExpanded ? "rotate-180" : ""
                }`}
              />
            </button>
            {templateExpanded && (
              <div className="border-t border-zinc-800 px-4 py-3">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-[10px] font-medium text-zinc-500 uppercase tracking-wider">
                    PRD Template
                  </span>
                  <button
                    onClick={copyTemplate}
                    className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
                  >
                    <ClipboardCopy className="h-3 w-3" />
                    {templateCopied ? "Copied!" : "Copy"}
                  </button>
                </div>
                <pre className="rounded-md bg-zinc-950/80 border border-zinc-800 p-3 text-xs font-mono text-zinc-300 overflow-x-auto whitespace-pre-wrap max-h-64 overflow-y-auto">
                  {PROMPT_TEMPLATE}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Step: Paste document */}
      {step === "paste" && (
        <DocumentInput
          onSubmit={handleDocumentSubmit}
          onBack={() => setStep("choose")}
        />
      )}

      {/* Step: Guided builder */}
      {step === "build" && (
        <DocumentBuilder
          onSubmit={handleBuilderSubmit}
          onBack={() => setStep("choose")}
        />
      )}

      {/* Step: Loading */}
      {step === "loading" && (
        <div className="flex flex-col items-center justify-center py-20 gap-4">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-zinc-700 border-t-emerald-500" />
          <p className="text-sm text-zinc-400">
            Analyzing your project and finding the best tools...
          </p>
        </div>
      )}

      {/* Step: Results */}
      {step === "results" && results && (
        <RecommendationResults
          results={results}
          allItems={allItems}
          platform={platform}
          onStartOver={handleStartOver}
          onEditDocument={() => setStep("paste")}
        />
      )}
    </div>
  );
}
