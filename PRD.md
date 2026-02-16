# Tool Bag â€” Product Requirements Document

## Document Info

- **Product**: Tool Bag (Codex Catalog)
- **Owner**: Troy / Digital VisionWorks LLC
- **Status**: V1 Shipped, Actively Maintained
- **Live URL**: https://toolbag.digitalvisionworks.com
- **Repository**: Local at /Users/djtroy/Desktop/ToolBag
- **Last Updated**: February 2026

---

## What It Is

Tool Bag is a standalone web application that serves as the definitive interactive reference catalog for the Claude Code and OpenAI Codex developer tool ecosystem. It indexes skills, MCP servers, multi-agent tools, testing patterns, workflow tools, and curated resource lists in one browsable, filterable, searchable interface.

The core value proposition: developers can browse the entire ecosystem, select the tools they need for a specific project, and export ready-to-paste configuration files that set up their development environment in seconds.

## Why It Exists

The AI coding agent ecosystem (Claude Code, Codex, Gemini CLI, Cursor, etc.) has exploded in size. There are now thousands of skills, hundreds of MCP servers, and dozens of multi-agent frameworks scattered across GitHub, npm, and community repos. No single resource catalogs all of them in a structured, searchable way with dual-platform support.

Developers waste time:
- Searching GitHub for tools they don't know exist
- Figuring out which tools work with their platform (Claude Code vs Codex vs both)
- Manually writing configuration files (CLAUDE.md, AGENTS.md, mcp.json, config.toml)
- Keeping up with an ecosystem that ships new tools weekly

Tool Bag solves all four problems.

## Who It's For

1. **Experienced Claude Code / Codex users** who want a faster way to discover and configure tools for new projects.
2. **Developers new to AI-assisted coding** who don't know what skills and MCP servers are, why they matter, or where to start. The app includes educational content that explains the ecosystem from scratch.
3. **Developers evaluating platforms** who want to compare Claude Code and Codex tooling side by side.

## Tech Stack

- **Framework**: Next.js 14+ (App Router, Server Components + Client Components)
- **Language**: TypeScript (strict mode)
- **Styling**: Tailwind CSS, dark theme (zinc-950 base)
- **UI Components**: shadcn/ui (New York style, Zinc base)
- **Database**: Supabase (PostgreSQL, no auth, public read-only via RLS)
- **Deployment**: Vercel
- **Testing**: Vitest (unit), Playwright (e2e)
- **URL State**: nuqs (type-safe URL search params)
- **ZIP Generation**: JSZip (client-side)

## Architecture Decisions

### Server Components for Data, Client Components for Interaction
All Supabase queries run in server components. Filter state, selection, and UI interactions are client components. This gives fast initial loads with full interactivity.

### nuqs with shallow: false
Filter changes update the URL AND trigger server component re-renders, which means fresh Supabase queries on every filter change. This is correct even for 55 items because it keeps the URL as the source of truth and makes filtered views shareable via link.

### force-dynamic on All Routes
Every page uses dynamic rendering so database updates reflect immediately without redeployment. This is critical for the weekly update workflow.

### localStorage for Selection State
Selected item IDs are stored in localStorage, not the URL. Putting dozens of UUIDs in the URL would be ugly and impractical. The template system (Supabase-backed) provides the sharing mechanism instead.

### Pure Function Config Generators
The export system uses pure functions: CatalogItem[] â†’ string. No side effects, no API calls. They run client-side, are trivially testable, and produce deterministic output. Four generators exist: CLAUDE.md, AGENTS.md, mcp.json, config.toml.

### Client-Side ZIP
JSZip runs in the browser. No server route, no file system, no temp files. Select your tools, pick your platform, download a ZIP with all your config files.

### Dual-Platform Design
Every catalog item has separate fields for Claude Code and Codex: install commands, MCP configs, and platform tags. The UI adapts based on the platform toggle, showing only the relevant install instructions and generating only the relevant config files.

## Database Schema

### catalog_items
The main table. Each row is one tool/skill/server/resource.

Key fields:
- `slug` (text, unique): URL-friendly identifier
- `name` (text): Display name
- `category` (text): One of 7 categories (Skills & Plugins, MCP Servers, Multi-Agent, Testing & QA, Workflow & CI/CD, Curated Lists, Official Anthropic)
- `source` (text): Official or Community
- `stars` (text): GitHub star count or '--'
- `url` (text): Primary URL (GitHub repo, docs page, etc.)
- `stack` (text[]): Tech stack tags (General, TypeScript, React, Next.js, Tailwind, Supabase, Firebase, Flutter)
- `description` (text): 1-3 sentence description
- `claude_code_install` (text): Install/setup command for Claude Code
- `codex_install` (text): Install/setup command for Codex
- `mcp_config_claude` (jsonb): MCP server config for .claude/mcp.json
- `mcp_config_codex` (jsonb): MCP server config for Codex config.toml (only if different from Claude)
- `platforms` (text[]): claude-code, codex, or both
- `priority` (text): essential, recommended, or optional
- `notes` (text): Additional context
- `activation_hint` (text): 1-2 sentence instruction telling the AI agent when and how to use this tool. Included in generated CLAUDE.md and AGENTS.md files.
- `last_verified_at` (timestamptz): When this entry was last verified as current
- `created_at` / `updated_at` (timestamptz): Row timestamps

### project_templates
Saved project configurations for reuse.

Key fields:
- `name` (text): Template name
- `description` (text): What this template is for
- `selected_items` (uuid[]): Array of catalog_item IDs
- `platform` (text): claude-code, codex, or both

## Pages and Features

### / (Catalog Home)
- Platform toggle (Claude Code / Codex / Both)
- Search bar (debounced 300ms, searches name + description)
- Category tabs with item counts
- Stack, Priority, Source filter dropdowns
- Responsive card grid (1/2/3 columns by viewport)
- Cards expand to show platform-specific install commands
- Checkbox selection on each card
- Results count ("Showing 23 of 55 tools")
- Floating project counter in header

### /project (Project Builder)
- Lists selected items grouped by category
- Stats dashboard (counts per category, platform breakdown)
- Template save/load/delete via Supabase
- "Export Config" button navigates to export page
- "Clear All" button with confirmation

### /project/export (Config Export)
- Platform selector (Claude Code / Codex / Both)
- Tabbed preview of generated config files
- Generated CLAUDE.md and AGENTS.md include a "Tool Activation Rules" section with proactive usage instructions for each selected tool
- Platform-aware: only shows tabs relevant to selected platform
- Copy-to-clipboard on each config block
- Download individual files or "Download All as ZIP"
- Controlled tabs that auto-switch when platform changes

### /compare (Comparison Table)
- Cross-platform reference: CLAUDE.md vs AGENTS.md, .claude/mcp.json vs config.toml, etc.
- Sortable columns
- Platform filter
- Full concept mapping between Claude Code and Codex

### Onboarding System
- **Hero intro**: Dismissible section explaining the app with 3 workflow callouts (Browse & Filter, Select for Project, Export Config). Persists dismissal to localStorage.
- **Ecosystem explainer**: Collapsible "What are Agent Skills & Tools?" section with 5 prose sections explaining skills, MCP servers, and the catalog's purpose. Written for absolute beginners.
- **Tooltip tour**: 4-step guided tour on first visit highlighting Platform Toggle, Category Tabs, Card Checkbox, and My Project button. Full keyboard accessibility (focus trapping, Escape to dismiss). Replay button in header (route-gated to catalog page only).
- **Footer**: "Catalog last updated: February 2026 Â· Actively maintained by Digital VisionWorks LLC"

## Cross-Platform Reference

| Concept | Claude Code | Codex |
|---------|------------|-------|
| Project config | CLAUDE.md | AGENTS.md |
| User skills | ~/.claude/skills/ | ~/.codex/skills/ |
| Project skills | .claude/skills/ | .agents/skills/ |
| MCP config | .claude/mcp.json | config.toml [mcp] |
| Hooks | .claude/settings.json | config.toml exec policies |
| Invoke skill | /skills or auto | $skill-name or auto |
| Plugins | /plugin install | $skill-installer |
| Headless | claude -p | codex exec |
| Subagents | .claude/agents/*.md | Agents SDK + codex mcp-server |
| Code review | /code-review (4 agents) | Codex GitHub app |
| Official skills | anthropics/skills (70.2k stars) | openai/skills (8.6k stars) |

## Testing

### Unit Tests (Vitest)
- Config generator tests for all 4 generators (CLAUDE.md, AGENTS.md, mcp.json, config.toml)
- Test fixtures with representative catalog items
- Run: `npm test`

### E2E Tests (Playwright)
- Catalog: page load, search, category tabs, platform toggle, card expansion, keyboard focus exclusion on collapsed cards
- Export: selection persistence, config generation, copy functionality
- Onboarding: tour lifecycle (auto-start, skip, done, replay, Escape dismiss)
- Run: `npm run test:e2e`

## Quality Gates
- `npm run lint` â€” ESLint, must pass with zero errors
- `npm run build` â€” Next.js production build, must pass
- `npm test` â€” Vitest unit tests, must pass
- `npm run test:e2e` â€” Playwright e2e tests, must pass
- `npx tsc --noEmit` â€” TypeScript type check, must pass

## Security Measures
- Query sanitization on search input before Supabase filter interpolation
- Supabase RLS: public SELECT only on catalog_items, public CRUD on project_templates
- No auth, no user data, no PII
- Anon key only (read-only access)
- npm audit: zero known vulnerabilities

## Accessibility
- `inert` attribute on collapsed card content (removes hidden controls from tab order)
- Focus trapping in tooltip tour modal
- Escape key dismissal on tour
- aria-label on all icon-only buttons
- aria-live results count for screen reader announcements
- Button-based sortable table headers (not click-on-th)
- role="dialog" on tour tooltips
- WCAG AA contrast ratios on all text

## Data Update Workflow

The catalog is updated weekly without redeployment:

1. Run the weekly research prompt (see WEEKLY-UPDATE-PROMPT.md) in Claude (deep research) or Gemini
2. Receive structured findings with ready-to-run SQL statements
3. Execute SQL via Claude Code/Codex with Supabase MCP, or paste into Supabase dashboard SQL editor
4. Live app reflects changes immediately (force-dynamic rendering)
5. Optionally update CHANGELOG.md via Claude Code/Codex

See WEEKLY-UPDATE-PROMPT.md for the full prompt and detailed instructions.

## Future Considerations

- Admin page for adding/editing entries directly in the app
- User-submitted tool suggestions (form that creates Supabase row pending review)
- RSS/changelog feed of catalog updates
- API endpoint for programmatic access to catalog data
- Integration with skills.sh or agentskill.sh for one-click install
- Star count auto-refresh via GitHub API
- Community voting or usage tracking on items
