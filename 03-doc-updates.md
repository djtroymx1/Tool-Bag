# Tool Bag: Documentation Updates for activation_hint

After implementing the code changes, update these project documents.

---

## 1. WEEKLY-UPDATE-PROMPT.md

### Add activation_hint to the example INSERT statements

In each of the three example SQL blocks (EXAMPLE 1, 2, 3), add `activation_hint` to the column list and values. For example, EXAMPLE 1 becomes:

```sql
INSERT INTO catalog_items (slug, name, category, source, stars, url, stack, description, claude_code_install, codex_install, mcp_config_claude, mcp_config_codex, platforms, priority, notes, activation_hint, last_verified_at)
VALUES (
  'superpowers',
  'Superpowers (obra)',
  'Skills & Plugins',
  'Community',
  '40.9k',
  'https://github.com/obra/superpowers',
  ARRAY['General'],
  'Complete dev methodology: 14 enforced skills including TDD, systematic debugging, verification-before-completion, brainstorming, parallel agent dispatching, subagent-driven dev, code review, git worktrees. Skills are mandatory, not optional.',
  '/plugin marketplace add obra/superpowers-marketplace\n/plugin install superpowers@superpowers-marketplace',
  'Clone into ~/.codex/skills/superpowers/ and reference in AGENTS.md',
  NULL,
  NULL,
  ARRAY['claude-code','codex'],
  'essential',
  NULL,
  'Follow all Superpowers rules for every task: use TDD, verify before completing, debug systematically, brainstorm before implementing, and dispatch subagents for parallel work. Never skip verification.',
  now()
);
```

### Add activation_hint to the Formatting Rules section

After the existing PRIORITY rules, add:

```
ACTIVATION HINTS (activation_hint):
- 1-2 sentences that tell the AI agent WHEN and HOW to use this tool
- Written as direct instructions to the agent, not descriptions for humans
- Start with an action verb: "Use...", "Run...", "Check...", "Follow...", "Apply..."
- Be specific about trigger conditions: "before every commit", "when handling database operations", "for all UI changes"
- End with a consequence or boundary: "Never skip verification", "Do not write custom code when MCP is available"
- Set to NULL only for curated lists and reference-only items that are not directly actionable
```

### Add activation_hint to the UPDATE example

In the "EXISTING ITEMS TO UPDATE" section, add activation_hint to the example UPDATE:

```sql
UPDATE catalog_items
SET description = 'new description',
    stars = 'new-count',
    activation_hint = 'new activation instruction if behavior changed',
    notes = 'what changed',
    last_verified_at = now(),
    updated_at = now()
WHERE slug = 'existing-slug';
```

---

## 2. PRD.md

### Add to Database Schema section

In the catalog_items key fields list, add after `notes`:

```
- `activation_hint` (text): 1-2 sentence instruction telling the AI agent when and how to use this tool. Included in generated CLAUDE.md and AGENTS.md files.
```

### Add to Pages and Features > /project/export

Add this bullet:

```
- Generated CLAUDE.md and AGENTS.md include a "Tool Activation Rules" section with proactive usage instructions for each selected tool
```

---

## 3. PROJECT-CONTEXT.md

### Add to Database Schema Quick Reference

In the catalog_items field list, add after `notes`:

```
activation_hint    text (1-2 sentence agent trigger instruction, or NULL)
```

### Add to Things That Have Been Decided

Add as item 11:

```
11. Activation hints in CLAUDE.md / AGENTS.md (tells the agent WHEN to use each tool, not just what's installed)
```

---

## 4. ARCHITECTURE.md

### Update Export Flow diagram

Update the config-generators section to show the new behavior:

```
config-generators/ (pure functions)
    ↓ generateClaudeMd(items) → string (includes Tool Activation Rules section)
    ↓ generateAgentsMd(items) → string (includes Tool Activation Rules section)
    ↓ generateMcpJson(items) → string (valid JSON, no activation hints)
    ↓ generateConfigToml(items) → string (valid TOML, no activation hints)
```

---

## 5. CHANGELOG.md

Add under [Unreleased] > Added:

```
- `activation_hint` field on catalog items: 1-2 sentence instructions that tell AI agents when and how to use each tool
- "Tool Activation Rules" section in generated CLAUDE.md and AGENTS.md files, populated from activation hints of selected items
- Activation rule display in expanded catalog cards (shows what instruction will be generated)
- Educational callout on export page explaining tool activation rules
```
