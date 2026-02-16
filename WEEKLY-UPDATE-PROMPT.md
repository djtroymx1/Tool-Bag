# Tool Bag — Weekly Update Prompt & Workflow

## Document Info

- **Purpose**: Research prompt and execution instructions for keeping the catalog current
- **Frequency**: Weekly (or as needed when notable tools launch)
- **Compatible With**: Claude (deep research), Gemini (real-time search), ChatGPT (browsing)
- **Last Updated**: February 2026

---

## How the Update Pipeline Works

The catalog data lives in Supabase with `force-dynamic` rendering on all routes. This means any database change is immediately visible to users without redeployment, git commits, or cache invalidation.

### The Flow

```
1. Paste weekly prompt into Claude (deep research) or Gemini
2. AI searches the ecosystem for new/updated/deprecated tools
3. AI returns findings as ready-to-run SQL statements
4. Execute SQL via one of three methods (see below)
5. Live app updates instantly
```

### Execution Methods (pick one)

**Method A — Claude Code or Codex with Supabase MCP (fastest)**
Paste the SQL into Claude Code or Codex with the Supabase MCP connected:
```
Connect to Supabase MCP and run these SQL statements against the database:

[paste SQL here]

After running, verify with:
SELECT slug, name, category, updated_at FROM catalog_items ORDER BY updated_at DESC LIMIT 10;
```

**Method B — Supabase Dashboard**
1. Go to your Supabase project dashboard
2. Open the SQL Editor
3. Paste and run the SQL statements
4. Verify in the Table Editor that rows were inserted/updated

**Method C — Future Admin Page**
Not yet built. When implemented, this will be a protected page in the app itself for adding/editing entries through a form.

### Post-Update (Optional)
Tell Claude Code or Codex to update CHANGELOG.md:
```
Add an entry to CHANGELOG.md under today's date documenting the catalog data updates:
- [list what was added/updated/removed]
```

---

## The Weekly Research Prompt

Copy everything between the START and END markers below. Paste it into Claude (with deep research enabled) or Gemini.

--- START OF PROMPT ---

You are a research assistant helping me maintain a developer tool catalog for AI coding agents (Claude Code and OpenAI Codex). The catalog tracks skills, MCP servers, multi-agent tools, testing patterns, workflow tools, and curated resource lists.

Your job is to search the internet for anything new, updated, trending, or deprecated in this ecosystem since the last update, then give me ready-to-run SQL statements to update my Supabase database.

## What to Search For

Search these specific areas. Be thorough. Check GitHub trending, recent releases, blog posts, Twitter/X posts, Reddit threads, Hacker News, and official docs.

1. NEW SKILLS AND PLUGINS
- New Claude Code skills or plugins (check github.com/anthropics/skills for new additions)
- New Codex skills (check github.com/openai/skills for new additions)
- New cross-platform skills on agentskill.sh, skills.sh, or the MCP Registry
- Community skill repos that have gained significant traction (500+ stars or featured in notable blogs/tweets)
- Any new entries in awesome-claude-code (github.com/hesreallyhim/awesome-claude-code)
- Any new entries in awesome-agent-skills (github.com/VoltAgent/awesome-agent-skills)

2. NEW OR UPDATED MCP SERVERS
- New official MCP servers on registry.modelcontextprotocol.io
- Updates to major MCP servers (Supabase, Firebase, GitHub, Playwright, Stripe, Vercel, Sentry, Linear)
- New MCP servers relevant to web development, TypeScript, React, Next.js, Flutter, or Supabase
- Check github.com/punkpeye/awesome-mcp-servers for recent additions

3. MULTI-AGENT AND ORCHESTRATION TOOLS
- Updates to Claude Code Agent Teams or subagents
- New versions of claude-flow, claude-squad, or similar orchestration tools
- New multi-agent patterns or frameworks that have emerged
- Any changes to how Codex handles multi-agent workflows

4. TESTING AND QA TOOLS
- New testing-focused skills or MCP servers
- Updates to Playwright MCP, Vitest MCP, or similar
- New AI-assisted QA patterns or tools

5. WORKFLOW AND CI/CD
- Updates to Claude Code GitHub Actions
- New hook patterns or community hooks
- Changes to headless mode, CLI flags, or automation features
- Codex CLI updates or new features

6. OFFICIAL ANNOUNCEMENTS
- Anthropic blog posts or docs updates about Claude Code
- OpenAI announcements about Codex CLI
- Changes to the Agent Skills Specification (agentskills.io)
- New official integrations or partnerships

7. DEPRECATIONS AND BREAKING CHANGES
- Skills or tools that have been archived, abandoned, or superseded
- Breaking changes in major tools that would affect install commands
- Repos that have been renamed or moved

## Current Catalog (what I already have)

Here are the slugs of every item currently in my catalog. Do NOT suggest adding something I already have unless it needs an update:

Skills & Plugins: superpowers, anthropic-official-skills, openai-official-skills, oh-my-claudecode, everything-claude-code, composio-codex-skills, codex-settings, openskills, agent-skills-cli, levnikolaevich-skills, tdd-guard, wshobson-agents, tob-security

MCP Servers: supabase-mcp, firebase-mcp, github-mcp, playwright-mcp, eslint-mcp, stripe-mcp, vercel-mcp, sentry-mcp, linear-mcp, tailwind-mcp, nextjs-mcp, dart-flutter-mcp, memory-mcp, vitest-mcp, nrt-assistant, figma-mcp, docker-mcp

Multi-Agent: agent-teams, subagents, code-review-plugin, claude-flow, claude-squad, swarm-patterns

Testing & QA: pgtap, tdd-pattern, quinn-qa

Workflow & CI/CD: gh-actions, hooks, headless, auto-format-hook, claude-md-templates

Curated Lists: awesome-claude-code, awesome-agent-skills, awesome-mcp-servers, mcp-registry, skills-sh, agentskill-sh, skillmatic-awesome

Official: anthropics-claude-code, openai-codex-cli, agentskills-spec, best-practices-blog

**IMPORTANT**: After each weekly update, I will update this slug list in my prompt. If you are reading this and the date is more than 2 weeks past the "Last Updated" date at the top of this document, remind me to update the slug list.

## Example Entries (match this exact style and detail level)

Here are three real entries from the catalog. All new items must match this format, tone, and level of detail exactly.

EXAMPLE 1 — Skill entry:
```sql
INSERT INTO catalog_items (slug, name, category, source, stars, url, stack, description, claude_code_install, codex_install, mcp_config_claude, mcp_config_codex, platforms, priority, notes, last_verified_at)
VALUES (
  'superpowers',
  'Superpowers (obra)',
  'Skills & Plugins',
  'Community',
  '40.9k',
  'https://github.com/obra/superpowers',
  ARRAY['General'],
  'Complete dev methodology: 14 enforced skills including TDD, systematic debugging, verification-before-completion, brainstorming, parallel agent dispatching, subagent-driven dev, code review, git worktrees. Skills are mandatory, not optional.',
  '/plugin marketplace add obra/superpowers-marketplace\n/plugin install superpowers@superpowers-marketplace',
  'Clone into ~/.codex/skills/superpowers/ and reference in AGENTS.md',
  NULL,
  NULL,
  ARRAY['claude-code','codex'],
  'essential',
  NULL,
  now()
);
```

EXAMPLE 2 — MCP Server entry:
```sql
INSERT INTO catalog_items (slug, name, category, source, stars, url, stack, description, claude_code_install, codex_install, mcp_config_claude, mcp_config_codex, platforms, priority, notes, last_verified_at)
VALUES (
  'supabase-mcp',
  'Supabase MCP',
  'MCP Servers',
  'Official',
  '--',
  'https://mcp.supabase.com',
  ARRAY['Supabase','TypeScript'],
  'SQL queries, migrations, TypeScript type gen, auth, storage, Edge Functions. OAuth 2.1.',
  'Add to .claude/mcp.json:\n{"supabase":{"type":"url","url":"https://mcp.supabase.com/mcp"}}',
  'codex mcp add supabase --url https://mcp.supabase.com/mcp',
  '{"supabase":{"type":"url","url":"https://mcp.supabase.com/mcp"}}'::jsonb,
  NULL,
  ARRAY['claude-code','codex'],
  'essential',
  NULL,
  now()
);
```

EXAMPLE 3 — Multi-Agent entry:
```sql
INSERT INTO catalog_items (slug, name, category, source, stars, url, stack, description, claude_code_install, codex_install, mcp_config_claude, mcp_config_codex, platforms, priority, notes, last_verified_at)
VALUES (
  'claude-flow',
  'claude-flow',
  'Multi-Agent',
  'Community',
  '12.9k',
  'https://github.com/ruvnet/claude-flow',
  ARRAY['General'],
  '54+ agents, swarm topologies, WASM memory, dual Claude+Codex orchestration.',
  'See repo',
  'See repo (supports Codex orchestration)',
  NULL,
  NULL,
  ARRAY['claude-code','codex'],
  'recommended',
  NULL,
  now()
);
```

## Formatting Rules Based on Examples

Follow these patterns exactly:

DESCRIPTIONS:
- Keep them to 1-3 sentences max
- Lead with the key capability or count ("54+ agents", "14 enforced skills", "SQL queries, migrations")
- Use sentence fragments, not full sentences, when listing capabilities
- Separate capabilities with commas or periods, not bullet points
- End with a period

INSTALL COMMANDS (claude_code_install / codex_install):
- For skills with a plugin: "/plugin marketplace add owner/repo\n/plugin install name@marketplace"
- For skills without a plugin: "Clone into ~/.claude/skills/name/ and add to CLAUDE.md" or "Clone into ~/.codex/skills/name/ and reference in AGENTS.md"
- For MCP servers (Claude Code): "Add to .claude/mcp.json:\n{json config here}"
- For MCP servers (Codex): "codex mcp add name --url https://..." or "codex mcp add name -- npx package-name"
- For tools with complex setup: "See repo" or "See repo for setup"
- Use \n for line breaks in multi-line commands, not actual newlines in the SQL string

MCP CONFIG JSON (mcp_config_claude):
- URL-based servers: {"name":{"type":"url","url":"https://..."}}
- Command-based servers: {"name":{"command":"npx","args":["package-name"]}}
- If the tool is not an MCP server, set to NULL
- Must be valid JSON cast with ::jsonb

MCP CONFIG CODEX (mcp_config_codex):
- Only populate if the Codex config is structurally different from Claude
- Most MCP servers use the same config, so this is usually NULL
- If different, use the same JSON structure

STACK ARRAY:
- Use ARRAY['General'] for tools that work with any tech stack
- Use specific tags for stack-specific tools: 'TypeScript', 'React', 'Next.js', 'Tailwind', 'Supabase', 'Firebase', 'Flutter'
- Can include multiple: ARRAY['TypeScript','React','Next.js']

PLATFORMS ARRAY:
- ARRAY['claude-code','codex'] for cross-compatible tools (most common)
- ARRAY['claude-code'] for Claude Code only
- ARRAY['codex'] for Codex only

PRIORITY:
- 'essential': Must-have for any serious project. Official tools, industry standard MCP servers, foundational skills.
- 'recommended': Strong value-add but not required. Well-maintained community tools with real traction.
- 'optional': Niche, experimental, or very specific use case. Still worth knowing about.

SLUGS:
- All lowercase, hyphens for spaces: 'my-tool-name'
- Keep them short and descriptive
- Must be unique across the entire catalog

## How to Format Your Findings

Organize your response into these sections:

### NEW ITEMS TO ADD
For each new item, provide:
- What it is and why it matters (2-3 sentences)
- A ready-to-run SQL INSERT statement in the exact format shown in the examples above

### EXISTING ITEMS TO UPDATE
For each item that needs updating, provide:
- What changed and why it matters
- A ready-to-run SQL UPDATE statement:

```sql
UPDATE catalog_items
SET description = 'new description',
    stars = 'new-count',
    notes = 'what changed',
    last_verified_at = now(),
    updated_at = now()
WHERE slug = 'existing-slug';
```

### ITEMS TO DEPRECATE OR REMOVE
For items that should be flagged or removed:
- Why it should be deprecated
- SQL to either update its notes with a deprecation warning or delete it

### TRENDING AND NOTABLE
Anything interesting that doesn't warrant a catalog entry yet but is worth watching. Just a brief summary, no SQL needed.

### NOTHING FOUND
If a category has no updates, say so explicitly. Don't make things up to fill space. I only want real, verified changes.

## Rules
- Only include items you can verify with a real URL that loads
- Do not fabricate star counts, features, or capabilities
- If you are unsure whether something is new or already in the catalog, flag it and ask
- Prefer quality over quantity. 3 real findings are better than 10 questionable ones.
- For star counts, use the current count if you can find it, otherwise use '--'
- All SQL must be valid PostgreSQL syntax compatible with Supabase
- Set last_verified_at = now() on all INSERT and UPDATE statements

--- END OF PROMPT ---

---

## After Running the Prompt

### Step 1: Review the Findings
Read through the AI's response. Check that:
- URLs are real and load
- Descriptions match the tone of existing entries
- SQL syntax looks correct (ARRAY[], ::jsonb casting, proper quoting)
- Nothing duplicates an existing slug

### Step 2: Execute the SQL
Use one of the three methods described at the top of this document. The fastest is Claude Code or Codex with Supabase MCP.

### Step 3: Verify
Run this query to confirm the updates:
```sql
SELECT slug, name, category, priority, updated_at
FROM catalog_items
ORDER BY updated_at DESC
LIMIT 20;
```

### Step 4: Update This Document
After each update, update the "Current Catalog" slug list in the prompt above so the next run knows what's already in the database. Also update the "Last Updated" date at the top of this file.

### Step 5: Optional — Update CHANGELOG.md
Tell Claude Code or Codex:
```
Add an entry to CHANGELOG.md under today's date with a "Data Updates" section listing what was added, updated, or removed from the catalog.
```

---

## Ad-Hoc Updates (Between Weekly Runs)

If you find a specific tool or URL you want to add immediately:

1. Paste the URL into Claude or Gemini with this mini-prompt:

```
I maintain a developer tool catalog for Claude Code and Codex. I want to add this tool:

[paste URL here]

Research it and give me a ready-to-run SQL INSERT statement for my Supabase catalog_items table. Follow this exact format:

[paste one of the example INSERT statements from above]

Match the description tone, install command format, and field structure exactly.
```

2. Review and execute the SQL as described above.

---

## Maintaining the Slug List

The slug list in the prompt is critical. If it's out of date, the AI will suggest adding items you already have. After every update session, run this query and update the list:

```sql
SELECT category, string_agg(slug, ', ' ORDER BY slug)
FROM catalog_items
GROUP BY category
ORDER BY category;
```

This gives you a clean, grouped slug list to paste directly into the prompt.
