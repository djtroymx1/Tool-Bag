# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Added
- Initialized Next.js 16 project with TypeScript (strict), Tailwind CSS v4, App Router, src/ directory
- Configured shadcn/ui (New York style) with 17 components: badge, button, card, checkbox, command, dialog, dropdown-menu, input, scroll-area, select, separator, sheet, skeleton, tabs, toggle, toggle-group, tooltip
- Dark theme with zinc-950 background, zinc-900 cards, zinc-800 borders (OKLCH color space)
- Supabase client setup (server + browser) with @supabase/ssr
- nuqs adapter for type-safe URL search params
- Created Supabase project "tool-bag" (us-east-1)
- Project directory structure for all planned components
- Database schema: catalog_items (55 items, 7 categories) and project_templates tables with RLS
- Seeded all 55 catalog items across Skills & Plugins, MCP Servers, Multi-Agent, Testing & QA, Workflow & CI/CD, Curated Lists, Official Anthropic
- TypeScript types for CatalogItem, ProjectTemplate, FilterState, ExportConfig
- Constants: categories with icons, platforms, priorities, sources, cross-platform comparison table (11 rows)
- nuqs search params parsers for URL-synced filtering (platform, category, q, priority, source)
- Utility functions: cn(), groupBy()
- Catalog page (/) with server-side Supabase filtering and card grid
- Platform toggle (Claude Code / Codex / Both) with URL param persistence
- Debounced search input (300ms) across name and description
- Category tabs with item counts and lucide icons
- Priority and source filter dropdowns with clear all
- Expandable catalog cards with install commands per platform, MCP config preview, copy-to-clipboard
- Badge components: platform (blue/green/gradient), priority (emerald/sky/zinc), source (amber/violet)
- Selection system with localStorage persistence and React Context provider
- Site header with active nav highlighting and selection count badge
- Project builder page (/project) with selected items list grouped by category, stats sidebar, clear all, and export navigation
- Export page (/project/export) with platform-aware config generation
- Config generators: CLAUDE.md, AGENTS.md, mcp.json, config.toml (pure functions)
- Platform selector on export (Claude Code / Codex / Both) controls visible tabs
- Tabbed config preview with syntax display, copy-to-clipboard, and file size indicator
- ZIP download via JSZip with platform-appropriate file structure
- Comparison page (/compare) with cross-platform reference table (11 concept rows)
- Sortable full catalog table with all 55 items (sort by name, category, priority, source)
- Custom 404 page with back-to-catalog navigation
- Deployed to Vercel at https://toolbag-sigma.vercel.app
- Expandable "What are Agent Skills & Tools?" explainer section on catalog page with 5 content sections, localStorage-persisted collapse state, smooth transitions, and "Got it" dismiss button
- Site footer with "Catalog last updated: February 2026 · Actively maintained by Digital VisionWorks LLC" on every page
- Vitest unit tests (30 tests) for all 4 config generators
- Playwright end-to-end coverage for catalog filtering/interaction and project export flow

### Changed
- Renamed project from "Codex Catalog" to "Tool Bag" across all references
- Replaced boilerplate README with project-specific local setup, deployment, and catalog maintenance instructions
- Export config tabs are now fully controlled and auto-switch to a valid tab when platform changes
- Codex TOML generation now prioritizes `mcp_config_codex` and falls back to `mcp_config_claude`

### Fixed
- Sanitized catalog search queries before Supabase `or()` filtering to prevent malformed filter expressions
- Added explicit Supabase error UI on catalog page with retry action and development-only error logging
- Resolved React hook lint violations by removing synchronous state updates from effects in selection and explainer components
- Enabled dynamic rendering for catalog, project, compare, and export routes to keep Supabase-backed content fresh
- Pruned stale localStorage selection IDs against the live catalog item list on project and export pages
- Added accessibility improvements: aria labels for icon-only controls, live region for results count, and button-based sortable table headers
