export type Category =
  | "Skills & Plugins"
  | "MCP Servers"
  | "Multi-Agent"
  | "Testing & QA"
  | "Workflow & CI/CD"
  | "Curated Lists"
  | "Official Anthropic";

export type Platform = "claude-code" | "codex";

export type Priority = "essential" | "recommended" | "optional";

export type Source = "Official" | "Community";

export interface CatalogItem {
  id: string;
  slug: string;
  name: string;
  category: Category;
  source: Source;
  stars: string;
  url: string;
  stack: string[];
  description: string;
  claude_code_install: string | null;
  codex_install: string | null;
  mcp_config_claude: Record<string, unknown> | null;
  mcp_config_codex: Record<string, unknown> | null;
  platforms: Platform[];
  priority: Priority;
  notes: string | null;
  last_verified_at: string;
  created_at: string;
  updated_at: string;
}

export interface ProjectTemplate {
  id: string;
  name: string;
  description: string | null;
  selected_items: string[];
  platform: "claude-code" | "codex" | "both";
  created_at: string;
  updated_at: string;
}
