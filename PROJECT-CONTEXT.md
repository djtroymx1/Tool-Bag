# Tool Bag â€” Project Context for AI Sessions

## Purpose of This Document

Paste this into any Claude, Codex, or Gemini session when working on the Tool Bag project. It gives the AI everything it needs to understand the codebase, make correct decisions, and avoid re-discovering things that have already been decided.

---

## Project Summary

Tool Bag is a Next.js web app (TypeScript, Tailwind, Supabase, Vercel) that catalogs the entire Claude Code and OpenAI Codex developer tool ecosystem. It has 55+ items across 7 categories: Skills & Plugins, MCP Servers, Multi-Agent, Testing & QA, Workflow & CI/CD, Curated Lists, Official Anthropic. Users browse, filter, select tools, and export ready-to-paste config files (CLAUDE.md, AGENTS.md, mcp.json, config.toml).

Live URL: https://toolbag.digitalvisionworks.com
Local path: /Users/djtroy/Desktop/ToolBag

## Tech Stack (do not change without discussion)

- Next.js 14+ (App Router)
- TypeScript (strict)
- Tailwind CSS (dark theme, zinc-950 base)
- shadcn/ui (New York style)
- Supabase (PostgreSQL, no auth, anon key only)
- Vercel deployment
- nuqs for URL search params
- JSZip for client-side ZIP generation
- Vitest for unit tests
- Playwright for e2e tests

## Conventions

### Code Style
- Server components for data fetching, client components for interactivity
- "use client" directive only on components that need browser APIs or hooks
- All Supabase queries happen in server components (src/app/**/page.tsx)
- URL params are the source of truth for filter state (via nuqs, shallow: false)
- Selection state lives in localStorage via use-selection.ts hook + React Context
- Config generators are pure functions in src/lib/config-generators/

### File Organization
- Pages: src/app/
- Components: src/components/{feature}/
- Shared components: src/components/shared/
- Types: src/types/
- Utilities: src/lib/
- Data: src/data/
- Tests: src/lib/**/__tests__/ (unit), e2e/ (Playwright)

### Database
- All routes use force-dynamic (no static generation, no ISR)
- Data updates happen via SQL against Supabase, no redeployment needed
- RLS: catalog_items is public SELECT only, project_templates is public CRUD
- catalog_items has GIN indexes on platforms and stack arrays

### Design System
- Background: zinc-950 (page), zinc-900 (cards), zinc-800 (borders)
- Text: zinc-100 (headings), zinc-200/300 (body), zinc-400 (labels), zinc-500 (placeholders)
- Card descriptions must be text-sm text-zinc-300 (not text-xs, not text-zinc-400)
- Priority left borders: emerald-500 (Essential), sky-500 (Recommended), none (Optional)
- Selected cards: bg-emerald-950/20 border-emerald-800/40
- Primary buttons: bg-emerald-600 hover:bg-emerald-500
- Badge pattern: bg-{color}-500/15 text-{color}-400 border border-{color}-500/25
- No animation libraries. CSS transitions only (duration-200 for hover, duration-300 for expand)
- Collapsed card content uses `inert` attribute for accessibility

### Testing
- Unit tests: config generators, utility functions
- E2e tests: catalog interaction, export flow, onboarding tour lifecycle
- All tests must pass before deployment: lint, build, npm test, npm run test:e2e

### CHANGELOG.md
- Maintained in Keep a Changelog format
- Updated with every code change
- Updated with every data update batch

## Things That Have Been Decided (do not revisit)

1. localStorage for selection, not URL params (too many UUIDs would be ugly)
2. force-dynamic on all routes (data freshness over cache speed)
3. No auth system (public read-only catalog, anon Supabase key)
4. Client-side ZIP generation (no server routes for file packaging)
5. nuqs with shallow: false (filter changes trigger server re-renders)
6. Dual-platform architecture (every item has separate Claude Code and Codex fields)
7. Pure function config generators (CatalogItem[] â†’ string, no side effects)
8. Custom DOM events for tour/header state sync (not global state library)
9. inert attribute for collapsed card accessibility (not tabIndex management)
10. Hydration placeholders for localStorage-dependent components (prevents CLS)

## Database Schema Quick Reference

### catalog_items (main table)
```
id             uuid (PK, auto-generated)
slug           text (unique, URL-friendly)
name           text
category       text (7 valid values, see below)
source         text ('Official' | 'Community')
stars          text (GitHub stars or '--')
url            text
stack          text[] (e.g. ARRAY['TypeScript','React'])
description    text (1-3 sentences)
claude_code_install  text (install command for Claude Code)
codex_install        text (install command for Codex)
mcp_config_claude    jsonb (MCP server config for .claude/mcp.json, or NULL)
mcp_config_codex     jsonb (Codex-specific MCP config if different, usually NULL)
platforms      text[] (ARRAY['claude-code','codex'] or subset)
priority       text ('essential' | 'recommended' | 'optional')
notes          text (nullable)
last_verified_at  timestamptz
created_at     timestamptz
updated_at     timestamptz
```

Valid categories: 'Skills & Plugins', 'MCP Servers', 'Multi-Agent', 'Testing & QA', 'Workflow & CI/CD', 'Curated Lists', 'Official Anthropic'

### project_templates
```
id               uuid (PK)
name             text
description      text
selected_items   uuid[] (references catalog_items.id)
platform         text ('claude-code' | 'codex' | 'both')
created_at       timestamptz
updated_at       timestamptz
```

## Common Tasks

### Add a new catalog item
Run SQL INSERT against catalog_items via Supabase MCP or dashboard. See WEEKLY-UPDATE-PROMPT.md for exact format and examples.

### Update an existing item
```sql
UPDATE catalog_items
SET description = '...', stars = '...', last_verified_at = now(), updated_at = now()
WHERE slug = 'item-slug';
```

### Check current catalog state
```sql
SELECT slug, name, category, priority, last_verified_at
FROM catalog_items ORDER BY category, name;
```

### Run all quality checks
```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

### Deploy
```bash
npx vercel --prod
```
Or push to connected Git repo for auto-deploy.

## Skills and Tools for Working on This Project

When working on Tool Bag in Claude Code, activate these skills:
- **frontend-design** (Anthropic official) â€” for any UI changes
- **Superpowers** (obra) â€” for TDD, verification-before-completion, systematic debugging
- **webapp-testing** (Anthropic official) â€” for Playwright testing

MCP servers to have connected:
- **Supabase MCP** â€” for database queries and migrations
- **Vercel MCP** â€” for deployment
- **Playwright MCP** â€” for visual testing and screenshots
- **ESLint MCP** â€” for lint verification

## What Not to Do

- Do not add authentication. This is intentionally a public, no-auth app.
- Do not switch to static generation or ISR. Data must be live.
- Do not use a global state library (Redux, Zustand). Current patterns are sufficient.
- Do not add an ORM. Raw Supabase client queries are fine for this scale.
- Do not add animation libraries. CSS transitions only.
- Do not use localStorage in artifacts or for anything other than selection state and onboarding preferences.
- Do not change the database schema without updating src/types/catalog.ts, src/data/seed.ts, and this document.
