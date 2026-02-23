# Tool Bag V2 -- Implementation Build Plan

## Document Info

- **Purpose**: Detailed implementation plan for Claude Code / Codex execution
- **Created**: February 23, 2026
- **Based On**: Real developer feedback, UX research, competitive analysis, and the insight that developers already have project documents -- they just don't know how to map them to tools
- **Phases**: 4 phases, ordered by impact. Each phase is independently deployable.

---

## The Big Idea

Tool Bag V1 is a catalog. You browse tools, pick the ones you want, export config files. The problem: most developers don't know which tools they need. They know what they're building, not which of 55 tools help them build it.

Tool Bag V2 flips the interaction model. Instead of starting from the tool list, you start from YOUR project. Three paths:

1. **Paste your document** -- You already have a PRD, build plan, CLAUDE.md, or project description. Paste it in. Tool Bag analyzes it and recommends the specific tools your project needs, with explanations tied to your actual requirements.

2. **Build your document** -- You don't have a project document yet. Tool Bag walks you through a guided builder that asks the right questions (What are you building? What's your stack? What phase are you in? Do you need payments? Testing? CI/CD?). It generates a project document AND recommends tools simultaneously.

3. **Browse the catalog** -- The V1 experience, improved with list view, clickable tags, and better interactions. For developers who already know what they want.

All three paths lead to the same output: a set of recommended tools with ready-to-export config files (CLAUDE.md, AGENTS.md, mcp.json, config.toml) that include activation hints telling the AI agent when and how to use each tool.

The generated config files aren't generic templates. They include project context from the user's document, making each export a customized, project-aware setup file.

---

## Context: Developer Feedback

A real developer reviewed Tool Bag V1 and said:

1. The horizontal category bar is almost invisible. He tried to click tags on cards and nothing happened.
2. Clicking a skill/tool did nothing. No redirect, no expand, no detail view.
3. Suggested list view instead of 3-column card grid. "Seems like more info and less complex."
4. Liked the platform toggle.
5. Compare page was helpful but needs more depth on plugin structure.
6. "There's just a billion sites like it."

Point 6 is the one that matters most. The document-driven recommendation engine is what makes Tool Bag not just another list.

---

## Phase 1: Fix Core Interactions

**Goal**: Fix the things that made a real developer say "clicking did nothing."
**Effort**: 1 session
**Deploy after**: Yes. Highest priority.

### 1A. Make Card Titles Clickable to Expand

**File**: `src/components/catalog/catalog-card.tsx`

- Wrap the card title area (name + short description) in a `<button>` that triggers expand/collapse
- The entire top row of the card should be the click target, not just the small chevron
- Add `cursor-pointer` and `hover:text-emerald-400` on the title to signal clickability
- Keep the chevron as a visual indicator but not as the only interaction point
- External link icon stays separate with `e.stopPropagation()`
- Accessibility: `aria-expanded={isExpanded}`, `aria-labelledby` on expandable content
- Keep existing `inert` attribute on collapsed content

### 1B. Make Tags Clickable to Filter

**Files**: `src/components/catalog/catalog-card.tsx`, badge components in `src/components/shared/`

- Category tags on cards: onClick sets the `category` URL param via nuqs
- Stack tags ("TypeScript", "React"): onClick sets the `stack` URL param
- Priority badges: onClick sets the `priority` URL param
- Source badges: onClick sets the `source` URL param
- All tag clicks use `e.stopPropagation()` to prevent triggering card expand
- Add `cursor-pointer hover:ring-1 hover:ring-emerald-500/50` to clickable tags
- The nuqs params already exist for all these filters; tags just need onClick handlers

### 1C. Improve Category Tab Visibility

**File**: `src/components/catalog/category-tabs.tsx`

- Add background differentiation to the tab bar: `bg-zinc-900/50 border-y border-zinc-800`
- Add left/right gradient fade masks on scroll edges (`mask-image` CSS) to indicate more tabs
- Add category icons next to tab labels (already defined in `constants.ts`)
- Make the tab bar sticky below the filter bar on scroll

### 1D. Add Prominent "View Source" Button in Expanded Cards

**File**: `src/components/catalog/catalog-card.tsx`

- In expanded content, add a clear "View on GitHub" / "View Source" button
- Style: `bg-zinc-800 hover:bg-zinc-700 text-zinc-200 px-4 py-2 rounded-md text-sm font-medium`
- Opens in new tab
- Positioned at bottom of expanded content alongside copy buttons

---

## Phase 2: List View + Layout Improvements

**Goal**: Add list view and improve information density.
**Effort**: 1-2 sessions
**Deploy after**: Yes.

### 2A. View Toggle Component

**File**: New `src/components/catalog/view-toggle.tsx`

- Grid/List toggle in the top-right of catalog area, next to results count
- Two icon buttons (LayoutGrid, List from lucide-react) in a pill container
- Persist choice in localStorage (key: `toolbag-view-mode`)
- Default to list view
- Hydration-safe: render placeholder during SSR, swap after useEffect
- Active: `bg-zinc-700 text-zinc-100` / Inactive: `bg-zinc-800/50 text-zinc-400`

### 2B. List View Component

**File**: New `src/components/catalog/catalog-list.tsx`

Each row is a horizontal card showing more info than the grid card:

```
[Checkbox] | Name (clickable, bold)          [Stars] [Platform badges] [Priority badge]
           | Description (1-line truncated)
           | [Stack tags] [Source badge]                                 [Expand chevron]
```

- Row: `flex items-start gap-4 p-4 border-b border-zinc-800 hover:bg-zinc-900/50`
- Name is a button that expands the row (same CSS grid animation as cards)
- Description: `line-clamp-1` collapsed, full text expanded
- Expanded state: full description, install commands, MCP config, "View Source" button
- Tags clickable (same as 1B)
- Mobile (< 768px): always list view, rows stack vertically

### 2C. Modify Catalog Shell

**File**: `src/components/catalog/catalog-shell.tsx`

- Add view toggle to the results count row
- Conditionally render `<CatalogGrid>` or `<CatalogList>` based on view mode
- On mobile, force list view regardless of toggle
- Add filter count badge on mobile filter sheet trigger: "Filters (3)"

---

## Phase 3: Document-Driven Recommendation Engine

**Goal**: The core differentiator. Developers paste their project document or build one from scratch, and Tool Bag recommends tools and generates customized config files.
**Effort**: 2-3 sessions
**Deploy after**: Yes. This is what makes Tool Bag different from everything else.

### 3A. New Page: /recommend

**File**: New `src/app/recommend/page.tsx`

Server component shell. Page title: "Get Personalized Recommendations"
Subtitle: "Paste your project document or build one from scratch. We'll recommend the right tools and generate your config files."

Two clear entry points presented as large cards:

**Card 1: "I have a document"**
- Icon: FileText (lucide)
- Description: "Paste your PRD, build plan, CLAUDE.md, or any project description"
- CTA: "Paste Document"
- Navigates to or reveals the paste/upload interface (3B)

**Card 2: "Help me build one"**
- Icon: Wand2 (lucide)
- Description: "Answer a few questions about your project and we'll generate a document and recommend tools"
- CTA: "Start Builder"
- Navigates to or reveals the guided builder (3C)

Add "Get Recommendations" to the site header navigation between "Catalog" and "Compare".

### 3B. Document Paste/Upload Interface

**File**: New `src/components/recommend/document-input.tsx`

Two input methods on the same screen:

**Paste tab**: Large textarea with monospace font, placeholder text showing an example snippet of a PRD. Minimum 100 characters to submit (prevent empty/trivial submissions). Character count shown. Max ~50,000 characters (roughly 12K tokens of input).

**Upload tab**: Drag-and-drop zone that accepts `.md`, `.txt`, and `.pdf` files. For .md and .txt, read the file content client-side with FileReader. For .pdf, extract text client-side using pdf.js or a lightweight library (or just support .md/.txt initially and add PDF later). Display the extracted text in the textarea so the user can review/edit before submitting.

Below the input area:
- Platform selector: Claude Code / Codex / Both (reuse existing component)
- "Analyze & Recommend" button: `bg-emerald-600 hover:bg-emerald-500 text-white px-6 py-3 rounded-lg text-lg font-semibold`
- Loading state: "Analyzing your project..." with a subtle animation

### 3C. Guided Document Builder

**File**: New `src/components/recommend/document-builder.tsx`

A step-by-step form that builds a project document by asking the right questions. This is for developers who don't have a PRD yet.

**Step 1: Project Basics**
- "What are you building?" (text input, 1-2 sentences)
  - Placeholder: "A SaaS dashboard for tracking inventory"
- "What's your tech stack?" (multi-select chips)
  - Options pulled from the existing stack values in the database: TypeScript, React, Next.js, Tailwind, Supabase, Firebase, Flutter, plus "Other" with a text input
- "Which AI coding platform?" (single select)
  - Claude Code / Codex / Both

**Step 2: Project Scope**
- "What phase are you in?" (single select)
  - Starting from scratch / Adding features to existing app / Refactoring or fixing bugs / Setting up CI/CD and deployment / Learning and experimenting
- "What does this phase involve?" (multi-select checkboxes)
  - Options adapt based on selected phase:
    - Starting: Auth/login, Database setup, API routes, UI/frontend, Payments, File storage, Real-time features
    - Adding features: New pages/routes, Payment integration, API integrations, File uploads, Search, Analytics
    - Refactoring: Code review, Security audit, Performance optimization, Test coverage, Accessibility
    - CI/CD: GitHub Actions, Automated testing, Deployment pipeline, Linting/formatting, Pre-commit hooks
    - Learning: Exploring tools, Building a prototype, Following a tutorial

**Step 3: Preferences**
- "What matters most to you?" (rank 1-3)
  - Code quality and testing / Speed of development / Security / Learning best practices
- "How experienced are you with AI coding agents?" (single select)
  - New to this / Some experience / I use them daily

**Step 4: Review**
- Show a generated project summary document in markdown format
- User can edit the generated text before submitting
- "Analyze & Recommend" button submits to the same API as the paste flow

The generated document from the builder looks like:

```markdown
# Project: [What they're building]

## Tech Stack
[Selected technologies]

## Current Phase
[Phase description]

## This Phase Involves
[Selected scope items as bullet points]

## Priorities
1. [Ranked priority 1]
2. [Ranked priority 2]
3. [Ranked priority 3]

## Experience Level
[Selected experience level]
```

This document is both the input for analysis AND a useful artifact the user can save as the start of their CLAUDE.md or AGENTS.md.

### 3D. Recommendation API Route

**File**: New `src/app/api/recommend/route.ts`

POST endpoint that takes a project document and returns tool recommendations.

**Request**:
```typescript
{
  document: string;       // The project document text
  platform: 'claude-code' | 'codex' | 'both';
}
```

**Implementation**:
- Fetch all catalog items from Supabase (or use the seed data as a fallback)
- Build a system prompt that includes every catalog item's slug, name, category, description, stack tags, and activation_hint
- Send the user's document + catalog data to the Anthropic API (claude-sonnet-4-20250514)
- Instruct Claude to:
  1. Analyze the project document and identify key requirements, technologies, and workflows
  2. Select 4-10 tools from the catalog that are most relevant
  3. For each recommended tool, provide: slug, a 1-2 sentence reason that references something specific in the user's document
  4. Categorize recommendations as "essential" (you definitely need this) or "recommended" (this would help)
  5. Order by importance
  6. Return valid JSON

**Response**:
```typescript
{
  recommendations: {
    slug: string;
    name: string;
    category: string;
    reason: string;           // Tied to their specific document
    importance: 'essential' | 'recommended';
  }[];
  projectSummary: string;     // 2-3 sentence summary of what Claude understood about their project
}
```

**System prompt structure**:
```
You are an expert at recommending developer tools for AI coding agent workflows.

The user will provide a project document (PRD, build plan, or project description). Analyze it and recommend tools from the catalog below.

RULES:
- Only recommend tools from this catalog. Do not invent tools.
- Recommend 4-10 tools. Quality over quantity.
- Cover different needs: don't recommend 5 MCP servers and no skills.
- Each reason must reference something specific from the user's document.
- If the document mentions a specific technology (Supabase, Stripe, Flutter, etc.), prioritize tools for that technology.
- "essential" means the project would be significantly harder without it.
- "recommended" means it adds clear value but the project works without it.
- Filter by platform: only recommend tools compatible with [platform].

CATALOG:
[JSON array of all catalog items with slug, name, category, description, stack, platforms, activation_hint]

Respond with valid JSON matching this schema:
{ recommendations: [...], projectSummary: "..." }
```

**Rate limiting**:
- Use a simple in-memory counter or Supabase row per IP
- 10 requests per IP per hour
- Return 429 with a friendly message: "You've used all your recommendations for this hour. Browse the catalog directly or try again later."

**Error handling**:
- If the Anthropic API fails, return a 503 with: "Recommendations are temporarily unavailable. You can browse the catalog directly."
- If the document is too short (< 50 characters), return 400: "Please provide more detail about your project."
- If the document is too long (> 50,000 characters), truncate to the first 50,000 with a note.

### 3E. Recommendations Results UI

**File**: New `src/components/recommend/recommendation-results.tsx`

After the API returns, show the results in a clear, actionable format.

**Layout**:

Section 1: Project Understanding
- Show the `projectSummary` from the API response
- "We analyzed your document and here's what we recommend for your project."
- If something seems off, a small "Not quite right? Edit your document and try again" link

Section 2: Recommended Tools
- Two groups: "Essential" and "Recommended", each with a header
- Each tool is a row showing:
  - Checkbox (pre-checked for essential, unchecked for recommended)
  - Tool name + category badge + platform badge
  - The personalized reason (from the API response, referencing their document)
  - "Learn more" expand to show the full catalog description and activation hint
- User can check/uncheck any tool
- Selected tools are added to the global selection context (same as catalog selections)

Section 3: Actions
- "Export Config Files" button (primary CTA) -- navigates to `/project/export` with selected tools
- "Add to Project & Browse More" button (secondary) -- navigates to catalog with tools selected
- "Save Recommendations" -- downloads the recommendations as a markdown file for reference

### 3F. Generated Config Files Include Project Context

**Files**: Modify `src/lib/config-generators/claude-md.ts`, `src/lib/config-generators/agents-md.ts`

When generating CLAUDE.md or AGENTS.md from a recommendation flow, include project context from the user's document.

Current CLAUDE.md output:
```markdown
# CLAUDE.md

## Skills & Plugins
- Superpowers: Complete dev methodology...

## MCP Servers
- Supabase MCP: SQL queries, migrations...
```

Enhanced CLAUDE.md output when project context is available:
```markdown
# CLAUDE.md

## Project Context
[2-3 sentence project summary from the API response]

## Activation Rules
When working on this project, follow these tool-specific rules:

### Superpowers
Follow all Superpowers rules for every task: use TDD, verify before completing, debug systematically.

### Supabase MCP
Use Supabase MCP for all database operations: queries, migrations, schema changes, type generation.
> Recommended because: Your project uses Supabase for auth and database.

### Stripe MCP
Use Stripe MCP for all payment-related operations.
> Recommended because: Your build plan includes payment integration in Phase 2.

## MCP Configuration
Add to .claude/mcp.json:
{json config}
```

Implementation:
- Add an optional `projectContext` parameter to the config generators: `generateClaudeMd(items: CatalogItem[], projectContext?: { summary: string, reasons: Map<string, string> })`
- If projectContext is provided, include the project summary section and per-tool reasons
- If not provided (user came from regular catalog browse), generate the same output as V1
- The activation hints from the `activation_hint` column are always included regardless

### 3G. Prompt Template for Building a Project Document

For users who want to create their document in their own AI tool (Claude, ChatGPT, Gemini) rather than using the built-in builder, provide a downloadable/copyable prompt template.

**File**: Add to the `/recommend` page as a third option or as a collapsible section.

**UI**: A card or collapsible section labeled "Want to create your document yourself?"
- Description: "Copy this prompt and paste it into Claude, ChatGPT, or Gemini. It will help you create a project document you can paste back here."
- "Copy Prompt" button

**The prompt template**:
```markdown
Help me create a project document for setting up my AI coding agent tools. Ask me the following questions one at a time, then compile my answers into a structured markdown document I can use to configure my development environment.

Questions to ask me:
1. What am I building? (Brief description of the project or feature)
2. What's my tech stack? (Languages, frameworks, databases, hosting)
3. Which AI coding platform am I using? (Claude Code, Codex, both, or other)
4. What phase am I in? (New project, adding features, refactoring, setting up CI/CD, etc.)
5. What specific work does this phase involve? (Auth, payments, testing, database, UI, APIs, etc.)
6. What are my top priorities? (Code quality, speed, security, learning, etc.)
7. How experienced am I with AI coding agents? (Beginner, intermediate, daily user)
8. Any other tools, services, or requirements I should mention?

After I answer all questions, compile my answers into a clean markdown document with these sections:
- Project Summary (2-3 sentences)
- Tech Stack
- Current Phase
- Scope (what this phase involves)
- Priorities
- Experience Level
- Additional Context

Keep it concise. This document will be analyzed by a tool recommendation engine.
```

This creates a nice loop: user copies the prompt, runs it in their preferred AI, gets a document, pastes it back into Tool Bag. It also works for users who prefer to build the document conversationally rather than through a form.

### 3H. Navigation and Entry Points

Make the recommendation flow discoverable from multiple places:

**Site header**: Add "Get Recommendations" nav link between "Catalog" and "Compare"

**Catalog page hero**: Add a CTA in the hero section:
- "Not sure what you need? Paste your project doc and we'll recommend the right tools."
- Links to `/recommend`

**Empty selection state**: When user has 0 tools selected and visits `/project`:
- "Start by browsing the catalog, or paste your project document for personalized recommendations."

**Catalog page**: When no filters are active, show a dismissible banner above results:
- "Paste your PRD or build plan to get personalized tool recommendations."
- localStorage dismissal

---

## Phase 4: Polish, Differentiation, and Remaining UX Fixes

**Goal**: Make the app feel premium, add power-user features, and address remaining feedback.
**Effort**: 1-2 sessions
**Deploy after**: Yes.

### 4A. Side Drawer for Tool Details (Desktop)

**File**: New `src/components/catalog/tool-drawer.tsx`

On desktop (>= 1024px), clicking a tool name opens a right-side drawer (400-500px wide) instead of expanding the row. Preserves scroll position, lets users quickly compare tools.

Drawer contents:
- Tool name + all badges (platform, priority, source)
- Full description
- Activation hint (from database)
- Platform-specific install commands with copy buttons
- MCP config preview with copy (if applicable)
- Stars + last verified date
- "View Source" external link button
- "Add to Project" / "Remove" toggle
- Stack tags (clickable to filter)

Use shadcn Sheet component, `side="right"`. On mobile, expand in place instead.

### 4B. Tool Detail Page for SEO and Sharing

**File**: New `src/app/tools/[slug]/page.tsx`

A dedicated page per tool, accessible via direct URL. Useful for sharing and SEO.

- Server component querying Supabase by slug
- Full tool information on a single scrollable page
- "Add to Project" sticky button at bottom
- Proper meta tags, og:title, og:description
- Back button returns to catalog preserving scroll position

### 4C. Improve Compare Page

**File**: `src/components/compare/comparison-table.tsx`

Per feedback: "more info on the plug structure."

- Add explainer paragraph above the table
- For each row, add expandable "Learn more" with 2-3 sentences
- Add new rows for "Plugins" and "Skill Discovery"

### 4D. Sticky Config CTA

**File**: New `src/components/catalog/config-cta.tsx`

When 1+ tools are selected, show a sticky bottom bar:

```
[5 tools selected]  [View Project]  [Generate Config ->]
```

- `fixed bottom-0 inset-x-0 p-4 bg-zinc-900/95 backdrop-blur border-t border-zinc-800`
- Only visible when selection count > 0
- Animate in/out: `transition-transform duration-200`
- Primary CTA: "Generate Config" in emerald
- Navigates to `/project/export`

### 4E. "New" and "Updated" Badges

**Files**: Card and list components

- "New" badge on tools where `created_at` is within last 14 days
- "Updated" badge where `updated_at` is within last 14 days and differs from `created_at`
- Style: `bg-amber-500/15 text-amber-400 border border-amber-500/25 text-xs`

### 4F. Keyboard Navigation

**File**: `src/components/catalog/catalog-shell.tsx`

- `Cmd+K` or `/`: focus search
- `j` / `k`: move between items
- `Enter`: expand focused item
- `x`: toggle selection
- `Escape`: close drawer/collapse

### 4G. Starter Kits (Simplified Fallback)

Keep a small set of starter kits as a fallback on the `/recommend` page for users who don't want to paste or build a document.

**Database**:
```sql
CREATE TABLE starter_kits (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  slug text UNIQUE NOT NULL,
  name text NOT NULL,
  description text NOT NULL,
  use_case text NOT NULL,
  items uuid[] NOT NULL,
  platform text NOT NULL DEFAULT 'both',
  stack text[] NOT NULL DEFAULT ARRAY['General'],
  sort_order int NOT NULL DEFAULT 0,
  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE starter_kits ENABLE ROW LEVEL SECURITY;
CREATE POLICY "public_read" ON starter_kits FOR SELECT USING (true);
```

**UI**: Small "Quick Start Kits" section below the main entry points on `/recommend`. 4-6 compact cards. Click to select all tools and go to export.

Kits:
1. Solo Developer Essentials
2. Next.js + Supabase Starter
3. Flutter App Setup
4. Full-Stack QA & Security Review
5. CI/CD Pipeline Setup
6. Multi-Agent Orchestration

---

## Phase Execution Order

| Phase | What It Does | Impact | Effort |
|-------|-------------|--------|--------|
| 1: Fix Core Interactions | Cards clickable, tags filter, tabs visible | Critical | Low |
| 2: List View | Denser layout, more info visible | High | Medium |
| 3: Document Recommendations | Paste PRD, build doc, get tools + config | Highest | Medium-High |
| 4: Polish | Drawer, detail pages, keyboard nav, badges | Medium | Medium |

**Recommended execution order**:
1. Phase 1 (fix the embarrassing stuff)
2. Phase 2 (list view)
3. Phase 3A-3E (document paste + builder + recommendations)
4. Phase 3F (enhanced config generation with project context)
5. Phase 3G (prompt template for external doc creation)
6. Phase 4D (sticky CTA)
7. Phase 3H (entry points and discoverability)
8. Phase 4A (side drawer)
9. Phase 4G (starter kits fallback)
10. Remaining Phase 4

---

## New Files Summary

```
src/
  app/
    recommend/
      page.tsx                    # Recommendation landing page (3 paths)
    tools/
      [slug]/
        page.tsx                  # Individual tool detail page
    api/
      recommend/
        route.ts                  # Anthropic API recommendation endpoint
  components/
    recommend/
      document-input.tsx          # Paste/upload interface
      document-builder.tsx        # Guided step-by-step questionnaire
      recommendation-results.tsx  # Results display with checkboxes and export
      prompt-template.tsx         # Copyable prompt for external AI tools
    catalog/
      view-toggle.tsx             # Grid/List toggle
      catalog-list.tsx            # List view component
      tool-drawer.tsx             # Desktop side drawer
      config-cta.tsx              # Sticky bottom CTA bar
```

## Modified Files Summary

```
src/
  components/
    catalog/
      catalog-card.tsx            # Clickable title, clickable tags, new/updated badges
      catalog-shell.tsx           # View toggle, keyboard nav, recommendation banner
      catalog-grid.tsx            # Conditional render based on view mode
      category-tabs.tsx           # Improved visibility, sticky, icons
      filter-bar.tsx              # Active filter count badge
    shared/
      priority-badge.tsx          # Clickable variant
      source-badge.tsx            # Clickable variant
    compare/
      comparison-table.tsx        # Expanded content, new rows
    layout/
      site-header.tsx             # Add "Get Recommendations" nav link
  lib/
    config-generators/
      claude-md.ts                # Optional projectContext parameter
      agents-md.ts                # Optional projectContext parameter
  types/
    catalog.ts                    # Add StarterKit, Recommendation types
```

## Environment Variables

New variable needed for Phase 3:
```
ANTHROPIC_API_KEY=sk-ant-...
```

Server-side only (used in the API route, never exposed to client). Add to Vercel environment variables as a secret.

Without this key, the paste/analyze flow won't work, but the guided builder can still generate the document template and the user can browse the catalog manually. The prompt template (3G) works without any API key since it just copies text.

## Documentation Updates After Each Phase

- `ARCHITECTURE.md`: Add new pages, components, API route, database tables
- `CHANGELOG.md`: Entry for each deployed phase
- `PROJECT-CONTEXT.md`: Add recommendation engine to decisions, add ANTHROPIC_API_KEY to env vars
- `PRD.md`: Update features, add /recommend page, update "Who It's For"
- `types/catalog.ts`: Add Recommendation and StarterKit types

## Quality Checks

Run before deploying any phase:
```bash
npm run lint
npm run build
npm test
npm run test:e2e
npx tsc --noEmit
```

New tests per phase:
- Phase 1: e2e for card click expand, tag click filter
- Phase 2: e2e for view toggle, list view render
- Phase 3: unit test for API route (mock Anthropic response), e2e for paste flow, builder steps, results display
- Phase 4: e2e for drawer, keyboard nav

## Skills to Activate in Claude Code

For all phases:
- **frontend-design** (Anthropic official): all UI changes
- **Superpowers** (obra): TDD, verification-before-completion

MCP servers:
- **Supabase MCP**: database queries, migrations, starter kit seeding
- **Playwright MCP**: visual verification
- **ESLint MCP**: lint checks
