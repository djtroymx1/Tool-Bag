# Tool Bag — Development History

## Document Info

- **Purpose**: Record of how the project was built, what decisions were made, and why
- **Useful For**: Understanding context behind existing code patterns and avoiding re-litigating settled decisions

---

## Build Timeline

### Session 1: Research & Architecture Planning

**Research completed on the Claude Code and Codex ecosystem:**
- Mapped the full Claude Code skill/plugin/MCP ecosystem (Anthropic official, community, curated lists)
- Researched the Codex CLI ecosystem (OpenAI official skills, community forks, Composio skills)
- Discovered the cross-platform skill standard (agentskills.io, SKILL.md format)
- Identified key differences between platforms (CLAUDE.md vs AGENTS.md, .claude/mcp.json vs config.toml, etc.)
- Compiled 55+ tools across 7 categories with dual-platform install commands

**Architecture decisions made:**
- Next.js + Supabase + Vercel for fast iteration and instant data updates
- Dual-platform design: every item carries both Claude Code and Codex install instructions
- Platform toggle drives the entire UI (filters view, changes install commands, controls export output)
- Config export as the core differentiator (no other tool generates both .claude/mcp.json and config.toml)
- Weekly update workflow via research prompt → SQL → live update (no redeployment)

### Session 2: Initial Build (Claude Code)

**Built by Claude Code with these skills active:**
- Superpowers (dev methodology, TDD, verification-before-completion)
- frontend-design (UI quality enforcement)
- webapp-testing (Playwright testing patterns)

**What was built:**
- Full Next.js project with TypeScript, Tailwind, shadcn/ui
- Supabase schema (catalog_items + project_templates tables)
- All 55 catalog items seeded
- Catalog page with all filters (platform, category, search, stack, priority, source)
- Project builder with template save/load
- Export page with 4 config generators
- Comparison table
- 30 unit tests, basic e2e structure

### Session 3: Codex Audit (Round 1)

**Codex performed a comprehensive code audit and found:**

High severity:
- User input interpolated directly into Supabase or() filter (injection risk)
- React hook lint violations in use-selection.ts and ecosystem-explainer.tsx

Medium severity:
- Export tabs were uncontrolled (platform switch could leave blank content)
- Codex TOML generator ignored mcp_config_codex field
- Supabase query errors silently swallowed (empty results on failure)
- Pages statically prerendered (data went stale until redeploy)

Low severity:
- Stale localStorage selection IDs not pruned
- Accessibility gaps (icon-only buttons, click-on-th sortable headers)
- Boilerplate README
- No e2e test coverage

**All issues were fixed by Codex:**
- Query sanitization added
- Lint errors fixed (lazy init + useSyncExternalStore pattern)
- Export tabs converted to controlled with auto-switching
- TOML generator updated to prefer mcp_config_codex
- Error state UI with retry button added
- force-dynamic added to all routes
- Stale ID pruning implemented
- Accessibility: aria-labels, button-based th, aria-live
- README rewritten
- 14 e2e tests added (catalog + export + onboarding)

### Session 4: UI/UX Polish (Claude Code)

**Comprehensive UI polish pass with these requirements:**
- frontend-design skill for all UI changes
- Superpowers verification-before-completion with Playwright screenshots
- Full design system enforcement (colors, typography, spacing, badges, cards, animations)

**What was added:**
- Hero intro section (dismissible, 3 workflow callouts)
- Ecosystem explainer (5-section collapsible educational content for beginners)
- First-visit tooltip tour (4 steps, keyboard accessible)
- Left-border priority accents on cards (emerald for Essential, sky for Recommended)
- Selected card visual distinction (emerald-tinted background)
- Platform toggle label ("Show tools for:")
- Dynamic results count with aria-live
- Footer "last updated" notice
- Hydration placeholders for CLS prevention

### Session 5: Codex Audit (Round 2)

**Codex audited the UI polish changes and found:**

High severity:
- Collapsed card content exposed hidden Copy buttons to keyboard tab order

Medium severity:
- Tour replay button state stale after completing tour (no cross-component sync)
- Tour not keyboard-accessible as a modal (no focus trapping, no Escape handler)
- Layout shift from hero/explainer hydration causing flaky e2e tests

Low severity:
- Replay button visible on non-catalog routes where tour can't run

**All issues were fixed by Codex:**
- `inert` attribute applied to collapsed expanded-content containers
- Custom event pattern (`tour-status-changed`) for replay button state sync
- Focus trapping, Escape handler, role="dialog", aria-label added to tour
- Hydration placeholders added to hero-intro and ecosystem-explainer
- Replay button route-gated to / only via usePathname()
- E2e tests added for collapsed card keyboard focus exclusion and onboarding lifecycle
- Flaky test fixed by switching to deterministic element-level clicks

**Final state: all checks passing**
- npm run lint: pass
- npm run build: pass
- npm test: pass (31 tests)
- npm run test:e2e: pass (14 tests)
- Flaky test stability: 3 consecutive runs passing

---

## The Claude Code + Codex Workflow That Emerged

This project established a productive two-agent workflow:

1. **Claude Code builds.** It has the skills (Superpowers, frontend-design) and the creative capacity to scaffold and implement features from detailed prompts.

2. **Codex audits.** It's thorough at finding real bugs through automated checks (lint, build, test) combined with runtime verification (Playwright browser sessions, DOM inspection, event tracing).

3. **Codex fixes what it finds.** Because it diagnosed the issues, it has full context to fix them without re-investigation.

4. **Claude (web) provides architecture guidance and prompt engineering.** Planning, research, prompt creation, and decision-making happen in the browser-based Claude conversation.

This pattern (plan in Claude web → build in Claude Code → audit in Codex → fix in Codex) produced a clean, tested, accessible application in a single day.
