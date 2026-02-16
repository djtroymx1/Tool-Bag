import type { CatalogItem } from "@/types/catalog";

const now = new Date().toISOString();

function makeItem(overrides: Partial<CatalogItem>): CatalogItem {
  return {
    id: "00000000-0000-0000-0000-000000000000",
    slug: "test-item",
    name: "Test Item",
    category: "Skills & Plugins",
    source: "Community",
    stars: "100",
    url: "https://example.com",
    stack: ["General"],
    description: "A test item.",
    claude_code_install: null,
    codex_install: null,
    mcp_config_claude: null,
    mcp_config_codex: null,
    platforms: ["claude-code", "codex"],
    priority: "recommended",
    notes: null,
    last_verified_at: now,
    created_at: now,
    updated_at: now,
    ...overrides,
  };
}

/** A simple skill with install commands, no MCP config */
export const skillItem = makeItem({
  id: "11111111-1111-1111-1111-111111111111",
  slug: "claude-debugs-for-you",
  name: "Claude Debugs For You",
  category: "Skills & Plugins",
  source: "Community",
  stars: "200",
  url: "https://github.com/example/claude-debugs",
  description: "Automated debugging skill for Claude Code.",
  claude_code_install: "claude install example/claude-debugs",
  codex_install: "codex install example/claude-debugs",
  platforms: ["claude-code", "codex"],
  priority: "recommended",
});

/** An MCP server item with mcp_config_claude */
export const mcpItem = makeItem({
  id: "22222222-2222-2222-2222-222222222222",
  slug: "context7",
  name: "Context7 MCP",
  category: "MCP Servers",
  source: "Community",
  stars: "5.2k",
  url: "https://github.com/upstash/context7",
  description: "Up-to-date code docs for any library via MCP.",
  claude_code_install: "npx -y @anthropic/claude-code mcp add context7 -- npx -y @upstash/context7-mcp@latest",
  codex_install: null,
  mcp_config_claude: {
    context7: {
      command: "npx",
      args: ["-y", "@upstash/context7-mcp@latest"],
    },
  },
  platforms: ["claude-code"],
  priority: "essential",
});

/** An MCP server item with env vars */
export const mcpItemWithEnv = makeItem({
  id: "33333333-3333-3333-3333-333333333333",
  slug: "supabase-mcp",
  name: "Supabase MCP",
  category: "MCP Servers",
  source: "Official",
  stars: "500",
  url: "https://github.com/supabase/mcp",
  description: "Connect Claude to your Supabase project.",
  claude_code_install: "npx -y @anthropic/claude-code mcp add supabase -- npx -y @supabase/mcp-server-supabase@latest",
  codex_install: null,
  mcp_config_claude: {
    supabase: {
      command: "npx",
      args: ["-y", "@supabase/mcp-server-supabase@latest"],
      env: {
        SUPABASE_ACCESS_TOKEN: "<your-token>",
      },
    },
  },
  platforms: ["claude-code"],
  priority: "recommended",
});

/** A Codex-only item */
export const codexOnlyItem = makeItem({
  id: "44444444-4444-4444-4444-444444444444",
  slug: "codex-tool",
  name: "Codex Tool",
  category: "Testing & QA",
  source: "Community",
  stars: "--",
  url: "https://example.com/codex-tool",
  description: "A Codex-only testing tool.",
  claude_code_install: null,
  codex_install: "codex install codex-tool",
  platforms: ["codex"],
  priority: "optional",
});

/** Item with a "Bookmark" install (should be skipped in output) */
export const bookmarkItem = makeItem({
  id: "55555555-5555-5555-5555-555555555555",
  slug: "awesome-list",
  name: "Awesome Claude Code",
  category: "Curated Lists",
  source: "Community",
  stars: "1k",
  url: "https://github.com/example/awesome-claude",
  description: "Curated list of Claude Code resources.",
  claude_code_install: "Bookmark",
  codex_install: "Bookmark",
  platforms: ["claude-code", "codex"],
  priority: "optional",
});

/** All fixture items */
export const allFixtureItems: CatalogItem[] = [
  skillItem,
  mcpItem,
  mcpItemWithEnv,
  codexOnlyItem,
  bookmarkItem,
];
