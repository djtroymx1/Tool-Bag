# Claude Code Prompt: Implement activation_hint Feature

Paste this into Claude Code with Supabase MCP connected.

---

## Prompt

I'm adding a new feature to Tool Bag called "activation hints." These are 1-2 sentence instructions stored on each catalog item that tell AI agents WHEN and HOW to use that tool. The hints get included in the generated CLAUDE.md and AGENTS.md config files so the agent knows to proactively use its tools instead of waiting to be asked.

### Step 1: Run the database migration

Connect to Supabase MCP and run the SQL from the file I'll paste below. This adds the `activation_hint` column and populates all 55 existing items.

[PASTE CONTENTS OF 01-migration.sql HERE]

After running, verify with:
```sql
SELECT slug, name, LEFT(activation_hint, 80) AS hint_preview FROM catalog_items ORDER BY category, name;
```

### Step 2: Regenerate Supabase types

```bash
npx supabase gen types typescript --project-id [YOUR_PROJECT_ID] > src/lib/supabase/types.ts
```

### Step 3: Update TypeScript types

In `src/types/catalog.ts`, add `activation_hint: string | null;` to the CatalogItem interface (after `notes`).

### Step 4: Update seed data

In `src/data/seed.ts`, add `activation_hint: null` to every item in the array (after the `notes` field).

### Step 5: Update CLAUDE.md generator

In `src/lib/config-generators/claude-md.ts`, add a "Tool Activation Rules" section at the end of the generated output. Filter items to only those with a non-null activation_hint. Format as:

```
## Tool Activation Rules

These rules tell you WHEN and HOW to use each tool. Follow them proactively.
Do not wait for the user to ask you to use a tool. If a rule applies, use the tool.

### [Tool Name]
[activation_hint text]
```

Only include this section if at least one selected item has an activation_hint.

### Step 6: Update AGENTS.md generator

Same change as Step 5, applied to `src/lib/config-generators/agents-md.ts`.

### Step 7: Update unit tests

Add tests to verify:
- Items with activation_hint produce a "Tool Activation Rules" section in both generators
- Items without activation_hint are excluded
- No section is generated when no items have hints

### Step 8: Show activation hint in catalog cards (optional but recommended)

In `src/components/catalog/catalog-card.tsx`, in the expanded section after install commands, show the activation hint if present:
- Label: "Activation Rule" in text-xs font-medium text-zinc-400
- Content: the hint text in text-sm text-zinc-300
- Separated from install commands with a border-t border-zinc-800

### Step 9: Add export page callout (optional but recommended)

In `src/components/export/export-shell.tsx`, add a brief info box above the config tabs explaining that CLAUDE.md and AGENTS.md now include tool activation rules.

### Step 10: Run all quality checks

```bash
npm run lint
npm run build
npm test
npm run test:e2e
```

Fix any failures before proceeding.

### Step 11: Update CHANGELOG.md

Add under [Unreleased] > Added:
- `activation_hint` field on catalog items: 1-2 sentence instructions that tell AI agents when and how to use each tool
- "Tool Activation Rules" section in generated CLAUDE.md and AGENTS.md files
- Activation rule display in expanded catalog cards
- Educational callout on export page explaining tool activation rules
