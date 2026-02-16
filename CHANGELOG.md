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
- Created Supabase project "codex-catalog" (us-east-1)
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
- Placeholder pages for /project, /project/export, /compare
