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
}

export const COMPARISON_TABLE: ComparisonRow[] = [
  {
    concept: "Project config",
    claudeCode: "CLAUDE.md",
    codex: "AGENTS.md",
  },
  {
    concept: "User skills",
    claudeCode: "~/.claude/skills/",
    codex: "~/.codex/skills/",
  },
  {
    concept: "Project skills",
    claudeCode: ".claude/skills/",
    codex: ".agents/skills/",
  },
  {
    concept: "MCP config",
    claudeCode: ".claude/mcp.json",
    codex: "config.toml [mcp]",
  },
  {
    concept: "Hooks",
    claudeCode: ".claude/settings.json",
    codex: "config.toml exec policies",
  },
  {
    concept: "Invoke skill",
    claudeCode: "/skills or auto",
    codex: "$skill-name or auto",
  },
  {
    concept: "Plugins",
    claudeCode: "/plugin install",
    codex: "$skill-installer",
  },
  {
    concept: "Headless",
    claudeCode: "claude -p",
    codex: "codex exec",
  },
  {
    concept: "Subagents",
    claudeCode: ".claude/agents/*.md",
    codex: "Agents SDK + codex mcp-server",
  },
  {
    concept: "Code review",
    claudeCode: "/code-review (4 agents)",
    codex: "Codex GitHub app",
  },
  {
    concept: "Official skills",
    claudeCode: "anthropics/skills",
    codex: "openai/skills",
  },
];
