"use client";

import { useState } from "react";
import { ArrowLeft, ArrowRight, Check } from "lucide-react";
import { ALL_STACKS } from "@/lib/constants";

const STEPS = ["Basics", "Scope", "Preferences", "Review"] as const;

const PHASES = [
  { value: "greenfield", label: "Starting from scratch" },
  { value: "adding-features", label: "Adding features to existing project" },
  { value: "refactoring", label: "Refactoring / improving codebase" },
  { value: "testing", label: "Adding tests & QA" },
  { value: "devops", label: "CI/CD & deployment" },
] as const;

const SCOPE_BY_PHASE: Record<string, string[]> = {
  greenfield: [
    "Project scaffolding",
    "Authentication",
    "Database setup",
    "API design",
    "Frontend UI",
    "Deployment",
  ],
  "adding-features": [
    "New API endpoints",
    "New UI components",
    "Database migrations",
    "Third-party integrations",
    "Real-time features",
    "File uploads",
  ],
  refactoring: [
    "Code organization",
    "Performance optimization",
    "Type safety",
    "Error handling",
    "Dependency updates",
    "Documentation",
  ],
  testing: [
    "Unit tests",
    "Integration tests",
    "E2E tests",
    "Visual regression",
    "Load testing",
    "Security audit",
  ],
  devops: [
    "CI pipeline",
    "CD pipeline",
    "Docker setup",
    "Monitoring",
    "Logging",
    "Infrastructure as Code",
  ],
};

const EXPERIENCE_LEVELS = [
  { value: "beginner", label: "Beginner", desc: "New to AI coding tools" },
  { value: "intermediate", label: "Intermediate", desc: "Some experience" },
  { value: "advanced", label: "Advanced", desc: "Power user" },
] as const;

const PRIORITY_OPTIONS = [
  { value: "speed", label: "Ship fast" },
  { value: "quality", label: "Code quality" },
  { value: "learning", label: "Learning" },
] as const;

interface BuilderState {
  description: string;
  stack: string[];
  platform: "claude-code" | "codex" | "both";
  phase: string;
  scopeItems: string[];
  priorities: string[];
  experience: string;
}

function generateDocument(state: BuilderState): string {
  const lines: string[] = [];
  lines.push("# Project Requirements Document");
  lines.push("");
  lines.push("## Project Description");
  lines.push(state.description);
  lines.push("");
  lines.push("## Tech Stack");
  state.stack.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("## Platform");
  lines.push(
    state.platform === "both"
      ? "Claude Code and Codex"
      : state.platform === "claude-code"
        ? "Claude Code"
        : "Codex"
  );
  lines.push("");
  lines.push("## Current Phase");
  const phaseLabel =
    PHASES.find((p) => p.value === state.phase)?.label ?? state.phase;
  lines.push(phaseLabel);
  lines.push("");
  lines.push("## Scope");
  state.scopeItems.forEach((s) => lines.push(`- ${s}`));
  lines.push("");
  lines.push("## Priorities");
  state.priorities.forEach((p, i) => lines.push(`${i + 1}. ${p}`));
  lines.push("");
  lines.push("## Experience Level");
  const expLabel =
    EXPERIENCE_LEVELS.find((e) => e.value === state.experience)?.label ??
    state.experience;
  lines.push(expLabel);
  return lines.join("\n");
}

export function DocumentBuilder({
  onSubmit,
  onBack,
}: {
  onSubmit: (document: string, platform: string) => void;
  onBack: () => void;
}) {
  const [currentStep, setCurrentStep] = useState(0);
  const [state, setState] = useState<BuilderState>({
    description: "",
    stack: [],
    platform: "both",
    phase: "",
    scopeItems: [],
    priorities: [],
    experience: "intermediate",
  });
  const [generatedDoc, setGeneratedDoc] = useState("");

  function toggleArrayItem(
    key: "stack" | "scopeItems" | "priorities",
    value: string
  ) {
    setState((prev) => {
      const arr = prev[key];
      if (key === "priorities" && arr.length >= 3 && !arr.includes(value)) {
        return prev;
      }
      return {
        ...prev,
        [key]: arr.includes(value)
          ? arr.filter((v) => v !== value)
          : [...arr, value],
      };
    });
  }

  function canAdvance(): boolean {
    switch (currentStep) {
      case 0:
        return state.description.length >= 10 && state.stack.length > 0;
      case 1:
        return state.phase !== "" && state.scopeItems.length > 0;
      case 2:
        return state.priorities.length > 0 && state.experience !== "";
      case 3:
        return generatedDoc.length >= 50;
      default:
        return false;
    }
  }

  function handleNext() {
    if (currentStep === 2) {
      setGeneratedDoc(generateDocument(state));
      setCurrentStep(3);
    } else if (currentStep === 3) {
      onSubmit(generatedDoc, state.platform);
    } else {
      setCurrentStep((s) => s + 1);
    }
  }

  function handlePrev() {
    if (currentStep === 0) {
      onBack();
    } else {
      setCurrentStep((s) => s - 1);
    }
  }

  const scopeOptions = SCOPE_BY_PHASE[state.phase] ?? [];

  return (
    <div className="flex flex-col gap-6">
      {/* Progress indicator */}
      <div className="flex items-center gap-2">
        {STEPS.map((label, i) => (
          <div key={label} className="flex items-center gap-2">
            <div
              className={`flex h-7 w-7 items-center justify-center rounded-full text-xs font-medium transition-colors ${
                i < currentStep
                  ? "bg-emerald-600 text-white"
                  : i === currentStep
                    ? "bg-zinc-100 text-zinc-900"
                    : "bg-zinc-800 text-zinc-500"
              }`}
            >
              {i < currentStep ? <Check className="h-3.5 w-3.5" /> : i + 1}
            </div>
            <span
              className={`text-xs ${
                i === currentStep ? "text-zinc-200" : "text-zinc-500"
              }`}
            >
              {label}
            </span>
            {i < STEPS.length - 1 && (
              <div className="h-px w-6 bg-zinc-800" />
            )}
          </div>
        ))}
      </div>

      {/* Step 1: Basics */}
      {currentStep === 0 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Describe your project
            </label>
            <textarea
              value={state.description}
              onChange={(e) =>
                setState((s) => ({ ...s, description: e.target.value }))
              }
              placeholder="I'm building a SaaS dashboard with user auth, a billing system, and real-time notifications..."
              className="w-full min-h-[120px] rounded-lg border border-zinc-700 bg-zinc-900/60 p-3 text-sm text-zinc-200 placeholder:text-zinc-600 focus:outline-none focus:border-zinc-500 resize-y"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Tech stack (select all that apply)
            </label>
            <div className="flex flex-wrap gap-2">
              {ALL_STACKS.map((stack) => (
                <button
                  key={stack}
                  onClick={() => toggleArrayItem("stack", stack)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
                    state.stack.includes(stack)
                      ? "bg-emerald-600/20 border-emerald-600/50 text-emerald-300"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {stack}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              AI platform
            </label>
            <div className="flex gap-2">
              {(
                [
                  { value: "both", label: "Both" },
                  { value: "claude-code", label: "Claude Code" },
                  { value: "codex", label: "Codex" },
                ] as const
              ).map((p) => (
                <button
                  key={p.value}
                  onClick={() =>
                    setState((s) => ({ ...s, platform: p.value }))
                  }
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
                    state.platform === p.value
                      ? "bg-zinc-100 border-zinc-100 text-zinc-900"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {p.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 2: Scope */}
      {currentStep === 1 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Current project phase
            </label>
            <div className="flex flex-col gap-2">
              {PHASES.map((phase) => (
                <button
                  key={phase.value}
                  onClick={() =>
                    setState((s) => ({
                      ...s,
                      phase: phase.value,
                      scopeItems: [],
                    }))
                  }
                  className={`rounded-md px-4 py-2.5 text-sm text-left transition-colors border ${
                    state.phase === phase.value
                      ? "bg-zinc-100 border-zinc-100 text-zinc-900"
                      : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  {phase.label}
                </button>
              ))}
            </div>
          </div>

          {scopeOptions.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-zinc-200 mb-2">
                What are you working on? (select all that apply)
              </label>
              <div className="flex flex-wrap gap-2">
                {scopeOptions.map((item) => (
                  <button
                    key={item}
                    onClick={() => toggleArrayItem("scopeItems", item)}
                    className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
                      state.scopeItems.includes(item)
                        ? "bg-sky-600/20 border-sky-600/50 text-sky-300"
                        : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                    }`}
                  >
                    {item}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Step 3: Preferences */}
      {currentStep === 2 && (
        <div className="flex flex-col gap-5">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Top priorities (select up to 3)
            </label>
            <div className="flex flex-wrap gap-2">
              {PRIORITY_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => toggleArrayItem("priorities", opt.label)}
                  className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors border ${
                    state.priorities.includes(opt.label)
                      ? "bg-emerald-600/20 border-emerald-600/50 text-emerald-300"
                      : "bg-zinc-900 border-zinc-700 text-zinc-400 hover:border-zinc-600"
                  }`}
                >
                  {opt.label}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Experience with AI coding tools
            </label>
            <div className="flex flex-col gap-2">
              {EXPERIENCE_LEVELS.map((level) => (
                <button
                  key={level.value}
                  onClick={() =>
                    setState((s) => ({ ...s, experience: level.value }))
                  }
                  className={`rounded-md px-4 py-2.5 text-left transition-colors border ${
                    state.experience === level.value
                      ? "bg-zinc-100 border-zinc-100 text-zinc-900"
                      : "bg-zinc-900 border-zinc-700 text-zinc-300 hover:border-zinc-600"
                  }`}
                >
                  <span className="text-sm font-medium">{level.label}</span>
                  <span className="ml-2 text-xs opacity-60">{level.desc}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Step 4: Review */}
      {currentStep === 3 && (
        <div className="flex flex-col gap-4">
          <div>
            <label className="block text-sm font-medium text-zinc-200 mb-2">
              Generated document (you can edit before submitting)
            </label>
            <textarea
              value={generatedDoc}
              onChange={(e) => setGeneratedDoc(e.target.value)}
              className="w-full min-h-[300px] rounded-lg border border-zinc-700 bg-zinc-900/60 p-4 text-sm font-mono text-zinc-200 focus:outline-none focus:border-zinc-500 resize-y"
            />
          </div>
        </div>
      )}

      {/* Navigation buttons */}
      <div className="flex items-center justify-between pt-2">
        <button
          onClick={handlePrev}
          className="inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-zinc-200 transition-colors"
        >
          <ArrowLeft className="h-3.5 w-3.5" />
          {currentStep === 0 ? "Back" : "Previous"}
        </button>
        <button
          onClick={handleNext}
          disabled={!canAdvance()}
          className="inline-flex items-center gap-1.5 rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500 disabled:opacity-40 disabled:cursor-not-allowed"
        >
          {currentStep === 3 ? "Analyze & Recommend" : "Next"}
          {currentStep < 3 && <ArrowRight className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}
