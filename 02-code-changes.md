# Tool Bag: activation_hint Implementation Guide

## Overview

This document contains all code changes needed to support the new `activation_hint` field. Run these changes in Claude Code with the project open.

---

## 1. TypeScript Type Update

**File:** `src/types/catalog.ts`

Add `activation_hint` to the CatalogItem interface:

```typescript
// Add this field alongside the existing fields (after 'notes' is a natural spot)
activation_hint: string | null;
```

---

## 2. Seed Data Update

**File:** `src/data/seed.ts`

Add `activation_hint: null` to every item in the seed array so the type stays in sync. The real data comes from Supabase, but the seed file is used as a fallback and for type checking.

Quick way to do this in Claude Code:
```
Add activation_hint: null to every item in src/data/seed.ts. Place it after the notes field.
```

---

## 3. Config Generator Updates

### 3a. CLAUDE.md Generator

**File:** `src/lib/config-generators/claude-md.ts`

After the existing sections (installed tools, MCP servers, etc.), add a new "Tool Activation Rules" section that lists activation hints for all selected items that have one.

Add this logic to the `generateClaudeMd` function, after the existing content generation:

```typescript
// --- Tool Activation Rules section ---
const itemsWithHints = items.filter(item => item.activation_hint);

if (itemsWithHints.length > 0) {
  lines.push('');
  lines.push('## Tool Activation Rules');
  lines.push('');
  lines.push('These rules tell you WHEN and HOW to use each tool. Follow them proactively.');
  lines.push('Do not wait for the user to ask you to use a tool. If a rule applies, use the tool.');
  lines.push('');

  for (const item of itemsWithHints) {
    lines.push(`### ${item.name}`);
    lines.push(item.activation_hint!);
    lines.push('');
  }
}
```

### 3b. AGENTS.md Generator

**File:** `src/lib/config-generators/agents-md.ts`

Same pattern. Add a "Tool Activation Rules" section after the existing content:

```typescript
// --- Tool Activation Rules section ---
const itemsWithHints = items.filter(item => item.activation_hint);

if (itemsWithHints.length > 0) {
  lines.push('');
  lines.push('## Tool Activation Rules');
  lines.push('');
  lines.push('These rules tell you WHEN and HOW to use each tool. Follow them proactively.');
  lines.push('Do not wait for the user to ask you to use a tool. If a rule applies, use the tool.');
  lines.push('');

  for (const item of itemsWithHints) {
    lines.push(`### ${item.name}`);
    lines.push(item.activation_hint!);
    lines.push('');
  }
}
```

### 3c. mcp.json and config.toml Generators

**No changes needed.** These generate machine-readable config, not human/AI-readable instructions. The activation hints belong in the markdown files only.

---

## 4. Unit Test Updates

**File:** `src/lib/config-generators/__tests__/`

Add activation_hint to your test fixtures. Add at least one test per generator that verifies:

1. Items with activation_hint produce a "Tool Activation Rules" section
2. Items without activation_hint are excluded from that section
3. Empty hint list produces no section at all

Example test (adapt to your existing test structure):

```typescript
it('includes Tool Activation Rules section when items have hints', () => {
  const items = [
    {
      ...baseItem,
      name: 'Supabase MCP',
      activation_hint: 'Use Supabase MCP for all database operations.',
    },
  ];

  const result = generateClaudeMd(items);

  expect(result).toContain('## Tool Activation Rules');
  expect(result).toContain('### Supabase MCP');
  expect(result).toContain('Use Supabase MCP for all database operations.');
});

it('omits Tool Activation Rules section when no items have hints', () => {
  const items = [
    {
      ...baseItem,
      activation_hint: null,
    },
  ];

  const result = generateClaudeMd(items);

  expect(result).not.toContain('Tool Activation Rules');
});
```

---

## 5. Catalog Card UI (Optional Enhancement)

**File:** `src/components/catalog/catalog-card.tsx`

Consider showing the activation hint in the expanded card view so users can see what trigger rule will be generated. This is optional but adds transparency.

In the expanded section, after the install commands:

```tsx
{item.activation_hint && (
  <div className="mt-3 pt-3 border-t border-zinc-800">
    <p className="text-xs font-medium text-zinc-400 mb-1">Activation Rule</p>
    <p className="text-sm text-zinc-300">{item.activation_hint}</p>
  </div>
)}
```

---

## 6. Export Page Educational Note (Optional)

**File:** `src/components/export/export-shell.tsx`

Add a brief callout above or below the config tabs explaining what activation rules are and why they matter:

```tsx
<div className="rounded-lg border border-zinc-800 bg-zinc-900/50 p-4 mb-4">
  <p className="text-sm text-zinc-300">
    <span className="font-medium text-zinc-100">New: Tool Activation Rules</span>
    {' '}— Your exported CLAUDE.md and AGENTS.md files now include activation rules
    that tell your AI agent when and how to use each tool. These rules make your tools
    work proactively instead of waiting to be asked.
  </p>
</div>
```

---

## 7. Supabase Type Regeneration

After running the migration, regenerate your Supabase TypeScript types:

```bash
npx supabase gen types typescript --project-id YOUR_PROJECT_ID > src/lib/supabase/types.ts
```

This ensures the generated types include the new `activation_hint` column.

---

## Implementation Order

1. Run the SQL migration (01-migration.sql)
2. Regenerate Supabase types
3. Update `src/types/catalog.ts`
4. Update `src/data/seed.ts`
5. Update `claude-md.ts` generator
6. Update `agents-md.ts` generator
7. Add/update unit tests
8. (Optional) Update catalog card UI
9. (Optional) Add export page callout
10. Run all quality checks: lint, build, test, test:e2e
11. Deploy
