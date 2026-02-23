import type { Category, Priority, Source } from "@/types/catalog";

export const CATEGORIES: { value: Category; label: string; icon: string }[] = [
  { value: "Skills & Plugins", label: "Skills & Plugins", icon: "Zap" },
  { value: "MCP Servers", label: "MCP Servers", icon: "Server" },
  { value: "Multi-Agent", label: "Multi-Agent", icon: "Users" },
  { value: "Testing & QA", label: "Testing & QA", icon: "TestTube2" },
  { value: "Workflow & CI/CD", label: "Workflow & CI/CD", icon: "GitBranch" },
  { value: "Curated Lists", label: "Curated Lists", icon: "BookOpen" },
  { value: "Official Anthropic", label: "Official Resources", icon: "Building2" },
];

export const PLATFORMS = [
  { value: "both" as const, label: "Both" },
  { value: "claude-code" as const, label: "Claude Code" },
  { value: "codex" as const, label: "Codex" },
];

export const PRIORITIES: { value: Priority; label: string }[] = [
  { value: "essential", label: "Essential" },
  { value: "recommended", label: "Recommended" },
  { value: "optional", label: "Optional" },
];

export const SOURCES: { value: Source; label: string }[] = [
  { value: "Official", label: "Official" },
  { value: "Community", label: "Community" },
];

export const ALL_STACKS = [
  "General",
  "TypeScript",
  "React",
  "Next.js",
  "Tailwind",
  "Supabase",
  "Firebase",
  "Flutter",
] as const;

export interface ComparisonRow {
  concept: string;
  claudeCode: string;
  codex: string;
  details?: string;
}

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    concept: "Project config",
    claudeCode: "CLAUDE.md",
    codex: "AGENTS.md",
    details:
      "The central markdown file that tells the AI about your project. Place it in the repo root with coding standards, architecture notes, and workflow rules.",
  },
  {
    concept: "User skills",
    claudeCode: "~/.claude/skills/",
    codex: "~/.codex/skills/",
    details:
      "Personal skill files that follow you across every project. Great for your preferred patterns, review checklists, or deployment workflows.",
  },
  {
    concept: "Project skills",
    claudeCode: ".claude/skills/",
    codex: ".agents/skills/",
    details:
      "Repo-specific skill files shared with your team via version control. Define project conventions, domain logic, or onboarding guides.",
  },
  {
    concept: "MCP config",
    claudeCode: ".claude/mcp.json",
    codex: "config.toml [mcp]",
    details:
      "Connect external tools (databases, APIs, services) as MCP servers. The AI can query them directly during coding sessions.",
  },
  {
    concept: "Hooks",
    claudeCode: ".claude/settings.json",
    codex: "config.toml exec policies",
    details:
      "Run custom scripts automatically before/after AI actions. Use hooks for linting, formatting, or validation gates.",
  },
  {
    concept: "Invoke skill",
    claudeCode: "/skills or auto",
    codex: "$skill-name or auto",
    details:
      "Trigger skills manually with a command or let the AI auto-detect when a skill applies based on context.",
  },
  {
    concept: "Plugins",
    claudeCode: "/install plugin-name",
    codex: "Via skill installer",
    details:
      "Install community-built extensions that add new capabilities. Plugins bundle skills, MCP servers, and hooks into a single package.",
  },
  {
    concept: "Headless",
    claudeCode: "claude -p",
    codex: "codex exec",
    details:
      "Run the AI non-interactively from scripts or CI pipelines. Pipe in prompts, get structured output — perfect for automation.",
  },
  {
    concept: "Subagents",
    claudeCode: ".claude/agents/*.md",
    codex: "Agents SDK + codex mcp-server",
    details:
      "Spawn specialized child agents for focused tasks like code review, testing, or research. Each agent gets its own context and tools.",
  },
  {
    concept: "Code review",
    claudeCode: "/code-review (4 agents)",
    codex: "Codex GitHub app",
    details:
      "AI-powered code review that catches bugs, style issues, and security problems. Claude Code runs 4 parallel review agents; Codex uses a GitHub app.",
  },
  {
    concept: "Official skills",
    claudeCode: "anthropics/skills",
    codex: "openai/skills",
    details:
      "Curated skill libraries maintained by the platform creators. A vetted starting point for common development workflows.",
  },
  {
    concept: "Skill discovery",
    claudeCode: "/skills marketplace",
    codex: "openai/skills registry",
    details:
      "Browse and search community-contributed skills. Find specialized tools for your stack, framework, or workflow.",
  },
];
