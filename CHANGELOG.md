# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/).

## [Unreleased]

### Changed
- Custom domain configured: app now accessible at https://toolbag.digitalvisionworks.com (subdomain of digitalvisionworks.com via Namecheap CNAME to Vercel)
- Updated all project documentation to reference new custom domain URL

### Added
- Hero intro section on catalog page with headline, subtext, and 3 icon callouts (Browse & Filter, Select for Project, Export Config); dismissible with localStorage persistence
- First-visit tooltip tour (4 steps) highlighting platform toggle, category tabs, card selection, and project navigation; spotlight overlay with SVG mask, skip/replay support, localStorage persistence
- Tour replay button ("?") in site header for returning users to re-trigger the onboarding tour
- "Show tools for:" label on the platform toggle for clearer context
- "Showing X of Y tools" results count with aria-live for screen reader accessibility
- "Clear all filters" button in empty state when no tools match current filters
- Left border accent on catalog cards: emerald for Essential priority, sky for Recommended
- Smooth card expand/collapse animation using CSS Grid `grid-rows-[0fr]/[1fr]` transition
- Focus-visible ring (emerald) on interactive card elements for keyboard navigation
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
- Deployed to Vercel at https://toolbag.digitalvisionworks.com
- Expandable "What are Agent Skills & Tools?" explainer section on catalog page with 5 content sections, localStorage-persisted collapse state, smooth transitions, and "Got it" dismiss button
- Site footer with "Catalog last updated: February 2026 Â· Actively maintained by Digital VisionWorks LLC" on every page
- Vitest unit tests (30 tests) for all 4 config generators
- Playwright end-to-end coverage for catalog filtering/interaction and project export flow

### Changed
- Updated badge styling across priority, source, and platform badges: increased background opacity from /10 to /15, border opacity from /20 to /25, added rounded-md px-2 py-0.5 font-medium for consistent pill shape
- Platform badge for "Both" now uses flat zinc style instead of gradient
- Codex platform badge color changed from green to emerald to match design system
- Card description text upgraded from text-xs text-zinc-400 to text-sm text-zinc-300 for better readability
- Card title weight changed from font-medium to font-semibold text-zinc-100
- Selected card state changed from blue ring to emerald background tint (bg-emerald-950/20 border-emerald-800/40)
- Install command code blocks now use text-xs font-mono text-emerald-400 on bg-zinc-950/80
- Active states for platform toggle, category tabs, and nav links now use high-contrast inverted style (bg-zinc-100 text-zinc-900)
- Ecosystem explainer container adjusted to bg-zinc-900/30 border-zinc-800/50; "Learn more" and "Got it" links now emerald-400
- Maximum content width reduced from max-w-7xl to max-w-6xl across layout, header, and footer
- Filter bar now has py-3 breathing room
- Section spacing standardized to gap-6
- Footer text centered
- Copy button feedback text changed from "Copied" to "Copied!"
- Renamed project from "Codex Catalog" to "Tool Bag" across all references
- Replaced boilerplate README with project-specific local setup, deployment, and catalog maintenance instructions
- Export config tabs are now fully controlled and auto-switch to a valid tab when platform changes
- Codex TOML generation now prioritizes `mcp_config_codex` and falls back to `mcp_config_claude`

### Fixed
- Removed hidden collapsed-card controls from keyboard tab order by applying `inert` to collapsed expanded-content containers
- Synchronized onboarding replay button state in-session and cross-tab via `tour-status-changed` + `storage` event listeners
- Improved onboarding tour accessibility with dialog semantics, focus trapping, Escape-to-dismiss support, and aria-hidden backdrop overlay
- Reduced above-the-fold hydration layout shift by rendering SSR placeholders for Hero intro and Ecosystem explainer
- Route-gated the tour replay button to the catalog page so replay is only shown where tour targets exist
- Expanded Playwright coverage for collapsed-card accessibility, expanded-content inert toggling, and full onboarding lifecycle/replay flows
- Sanitized catalog search queries before Supabase `or()` filtering to prevent malformed filter expressions
- Added explicit Supabase error UI on catalog page with retry action and development-only error logging
- Resolved React hook lint violations by removing synchronous state updates from effects in selection and explainer components
- Enabled dynamic rendering for catalog, project, compare, and export routes to keep Supabase-backed content fresh
- Pruned stale localStorage selection IDs against the live catalog item list on project and export pages
- Added accessibility improvements: aria labels for icon-only controls, live region for results count, and button-based sortable table headers
