# Tool Bag — Technical Architecture

## Document Info

- **Purpose**: Codebase map and technical reference for AI agents and future development
- **Last Updated**: February 2026

---

## Project Structure

```
ToolBag/
├── src/
│   ├── app/                        # Next.js App Router pages
│   │   ├── page.tsx                # Catalog home (server component, Supabase query + filters)
│   │   ├── layout.tsx              # Root layout (dark theme, NuqsAdapter, SelectionProvider)
│   │   ├── globals.css             # Tailwind config + dark theme CSS variables
│   │   ├── not-found.tsx           # 404 page
│   │   ├── compare/
│   │   │   └── page.tsx            # Cross-platform comparison table
│   │   └── project/
│   │       ├── page.tsx            # Project builder (selected items + templates)
│   │       └── export/
│   │           └── page.tsx        # Config export (CLAUDE.md, AGENTS.md, mcp.json, config.toml)
│   │
│   ├── components/
│   │   ├── catalog/                # Catalog page components
│   │   │   ├── catalog-shell.tsx   # Client orchestrator (filters + grid)
│   │   │   ├── catalog-card.tsx    # Individual item card (expand, select, badges)
│   │   │   ├── catalog-grid.tsx    # Responsive card grid with transitions
│   │   │   ├── catalog-error-state.tsx  # Error state with retry button
│   │   │   ├── category-tabs.tsx   # Horizontal scrollable category tabs with counts
│   │   │   ├── ecosystem-explainer.tsx  # Collapsible "What are skills?" educational content
│   │   │   ├── filter-bar.tsx      # Stack/Priority/Source filter dropdowns
│   │   │   ├── filter-sheet.tsx    # Mobile filter drawer
│   │   │   ├── hero-intro.tsx      # Dismissible hero section with workflow callouts
│   │   │   ├── platform-toggle.tsx # Claude Code / Codex / Both toggle
│   │   │   └── search-input.tsx    # Debounced search with clear button
│   │   │
│   │   ├── compare/
│   │   │   └── comparison-table.tsx # Sortable comparison table
│   │   │
│   │   ├── export/
│   │   │   ├── export-shell.tsx    # Export page orchestrator (controlled tabs)
│   │   │   ├── config-preview.tsx  # Tabbed config file preview
│   │   │   ├── config-tab.tsx      # Individual config display with copy button
│   │   │   ├── download-button.tsx # File download + ZIP download
│   │   │   └── platform-selector.tsx # Export platform radio selector
│   │   │
│   │   ├── layout/
│   │   │   ├── site-header.tsx     # Sticky header with nav, project count, tour replay
│   │   │   ├── site-footer.tsx     # Footer with last-updated notice
│   │   │   └── mobile-nav.tsx      # Sheet-based mobile navigation
│   │   │
│   │   ├── onboarding/
│   │   │   └── tooltip-tour.tsx    # 4-step first-visit guided tour
│   │   │
│   │   ├── project/
│   │   │   ├── project-shell.tsx   # Project page orchestrator
│   │   │   ├── selected-items-list.tsx  # Selected items grouped by category
│   │   │   ├── project-stats.tsx   # Category/platform count dashboard
│   │   │   ├── template-manager.tsx # Save/load/delete templates
│   │   │   └── project-actions.tsx # Export and clear buttons
│   │   │
│   │   ├── providers/
│   │   │   └── selection-provider.tsx  # React Context for item selection state
│   │   │
│   │   └── shared/
│   │       ├── copy-button.tsx     # Animated copy-to-clipboard
│   │       ├── platform-badge.tsx  # Blue/green/gradient platform indicator
│   │       ├── priority-badge.tsx  # Emerald/sky/zinc priority indicator
│   │       └── source-badge.tsx    # Amber/violet official/community indicator
│   │
│   ├── data/
│   │   └── seed.ts                 # All catalog items as typed array (seed + fallback)
│   │
│   ├── hooks/
│   │   └── use-selection.ts        # Selection state with localStorage persistence
│   │
│   ├── lib/
│   │   ├── config-generators/      # Pure functions: CatalogItem[] → config string
│   │   │   ├── claude-md.ts        # Generates CLAUDE.md
│   │   │   ├── agents-md.ts        # Generates AGENTS.md
│   │   │   ├── mcp-json.ts         # Generates .claude/mcp.json
│   │   │   ├── config-toml.ts      # Generates config.toml (prefers mcp_config_codex)
│   │   │   ├── index.ts            # Re-exports all generators
│   │   │   └── __tests__/          # Unit tests for all generators
│   │   │
│   │   ├── constants.ts            # Categories, platforms, comparison table data
│   │   ├── search-params.ts        # nuqs parsers + cache for URL state
│   │   ├── supabase/
│   │   │   ├── client.ts           # Browser Supabase client
│   │   │   ├── server.ts           # Server Supabase client
│   │   │   └── types.ts            # Generated TypeScript types
│   │   ├── utils.ts                # cn(), debounce, slugify
│   │   └── zip.ts                  # JSZip wrapper for client-side ZIP generation
│   │
│   └── types/
│       ├── catalog.ts              # CatalogItem, Category, Platform, Priority, Source types
│       ├── filters.ts              # FilterState interface
│       └── project.ts              # ExportConfig, ProjectState interfaces
│
├── e2e/                            # Playwright e2e tests
│   ├── catalog.spec.ts             # Catalog filtering, search, card interaction, keyboard a11y
│   ├── export.spec.ts              # Selection → export flow
│   └── onboarding.spec.ts          # Tour lifecycle (start, skip, complete, replay, Escape)
│
├── playwright.config.ts
├── vitest.config.ts
├── CHANGELOG.md
└── README.md
```

## Data Flow

### Catalog Page (read path)
```
URL params (platform, category, q, stack, priority, source)
    ↓
src/app/page.tsx (Server Component)
    ↓ reads params via catalogSearchParamsCache.parse()
    ↓ builds Supabase query with filters
    ↓ sanitizes search input before interpolation
    ↓
Supabase → returns CatalogItem[]
    ↓
catalog-shell.tsx (Client Component)
    ↓ receives items as props
    ↓ useQueryStates(catalogSearchParams, { shallow: false })
    ↓ filter changes update URL → triggers server re-render → fresh query
    ↓
catalog-grid.tsx → catalog-card.tsx (renders cards)
```

### Selection Flow
```
User clicks checkbox on catalog-card.tsx
    ↓
use-selection.ts (hook)
    ↓ toggles item ID in Set<string>
    ↓ persists to localStorage
    ↓
selection-provider.tsx (Context)
    ↓ broadcasts to all consumers
    ↓
site-header.tsx → shows count badge
project-shell.tsx → shows selected items
export-shell.tsx → generates configs from selected items
```

### Export Flow
```
export-shell.tsx reads selected IDs from context
    ↓ filters allItems to selected only
    ↓ validates IDs against actual catalog (prunes stale)
    ↓
User selects platform (Claude Code / Codex / Both)
    ↓ controlled tabs auto-switch to valid tab
    ↓
config-generators/ (pure functions)
    ↓ generateClaudeMd(items) → string
    ↓ generateAgentsMd(items) → string
    ↓ generateMcpJson(items) → string (valid JSON)
    ↓ generateConfigToml(items) → string (valid TOML, prefers mcp_config_codex)
    ↓
User copies individual configs or downloads ZIP
    ↓ zip.ts wraps JSZip, runs client-side only
```

### Template Flow
```
User names project + saves
    ↓
template-manager.tsx → Supabase client INSERT into project_templates
    ↓ stores: name, description, selected_items (uuid[]), platform

User loads template
    ↓
template-manager.tsx → Supabase client SELECT
    ↓ restores selection state + platform choice
```

## Key Patterns

### URL as Source of Truth for Filters
All filter state lives in URL search params via nuqs. This means:
- Every filtered view is a shareable link
- Browser back/forward works correctly
- Server components can read filters and query Supabase directly
- `shallow: false` ensures filter changes trigger full server re-renders

### Hydration-Safe Client Components
Components that read localStorage (hero-intro, ecosystem-explainer, tooltip-tour, use-selection) follow this pattern:
1. Render a fixed-height placeholder during SSR
2. Read localStorage after hydration in useEffect
3. Swap in real content or collapse
This prevents layout shift (CLS) and avoids hydration mismatches.

### inert for Collapsed Content
Collapsed card expanded content uses the HTML `inert` attribute to remove hidden interactive elements from the tab order and accessibility tree. This is a single-attribute solution that replaces the need for tabIndex management on individual elements.

### Config Generators as Pure Functions
Each generator takes `CatalogItem[]` and returns a `string`. No side effects, no API calls, no state. This makes them:
- Trivially unit testable
- Safe to run client-side
- Deterministic (same input → same output)

### Custom Event for Cross-Component State Sync
The tooltip tour completion and header replay button use a custom DOM event (`tour-status-changed`) to sync state without prop drilling or global state. The header listens for the event and updates its local state.

## Environment Variables

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

Both must be set in Vercel project settings for production. The anon key provides read-only access via RLS policies.

## RLS Policies

```sql
-- catalog_items: public read only
CREATE POLICY "public_read" ON catalog_items FOR SELECT USING (true);

-- project_templates: public CRUD (no auth)
CREATE POLICY "public_crud" ON project_templates FOR ALL USING (true);
```

## Performance Notes

- All routes use `export const dynamic = 'force-dynamic'` for real-time data
- No ISR or static generation (data freshness is more important than cache speed for 55 items)
- Supabase queries use GIN indexes on `platforms` and `stack` arrays, B-tree indexes on `category` and `priority`
- Search is debounced at 300ms client-side
- ZIP generation is client-side only (no server memory/CPU cost)
- Cards use CSS `grid-template-rows` animation for expand/collapse (no JS animation library)

## Deployment

Vercel auto-deploys from the connected Git repository. Manual deploy:
```bash
npx vercel --prod
```

Required Vercel settings:
- Framework: Next.js (auto-detected)
- Build command: `next build` (default)
- Environment variables: both Supabase vars must be set
