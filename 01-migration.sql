-- ============================================================
-- Tool Bag: Add activation_hint column to catalog_items
-- Run this in Supabase SQL Editor or via Supabase MCP
-- ============================================================

-- Step 1: Add the column
ALTER TABLE catalog_items
ADD COLUMN IF NOT EXISTS activation_hint text;

-- Step 2: Add a comment for documentation
COMMENT ON COLUMN catalog_items.activation_hint IS
  'Instruction telling the AI agent WHEN and HOW to use this tool. Included in generated CLAUDE.md and AGENTS.md files.';

-- ============================================================
-- Step 3: Populate activation hints for all existing items
-- ============================================================

-- =====================
-- SKILLS & PLUGINS
-- =====================

UPDATE catalog_items SET activation_hint = 'Follow all Superpowers rules for every task: use TDD, verify before completing, debug systematically, brainstorm before implementing, and dispatch subagents for parallel work. Never skip verification.', updated_at = now() WHERE slug = 'superpowers';

UPDATE catalog_items SET activation_hint = 'Before creating any file (document, presentation, spreadsheet, PDF), read the matching SKILL.md from the Anthropic skills directory. Always check available skills before starting a new task.', updated_at = now() WHERE slug = 'anthropic-official-skills';

UPDATE catalog_items SET activation_hint = 'Before starting any task, check the OpenAI skills directory for a relevant skill. Read the SKILL.md file and follow its instructions before writing any code or creating any files.', updated_at = now() WHERE slug = 'openai-official-skills';

UPDATE catalog_items SET activation_hint = 'Use oh-my-claudecode extensions automatically when their trigger conditions match. Check installed extensions at the start of each session and apply their rules throughout.', updated_at = now() WHERE slug = 'oh-my-claudecode';

UPDATE catalog_items SET activation_hint = 'Reference the everything-claude-code collection when you need a pattern or technique that is not covered by your active skills. Search it before falling back to general knowledge.', updated_at = now() WHERE slug = 'everything-claude-code';

UPDATE catalog_items SET activation_hint = 'Use Composio skills for any task involving third-party API integrations. Check available Composio connectors before writing custom API client code.', updated_at = now() WHERE slug = 'composio-codex-skills';

UPDATE catalog_items SET activation_hint = 'Apply Codex settings defaults at the start of every session. These settings define response format, tool usage rules, and code style preferences.', updated_at = now() WHERE slug = 'codex-settings';

UPDATE catalog_items SET activation_hint = 'Check OpenSkills for an existing skill before building custom automation. Install and use matching skills instead of writing one-off scripts.', updated_at = now() WHERE slug = 'openskills';

UPDATE catalog_items SET activation_hint = 'Use the agent-skills CLI to search for and install skills from the registry before starting any new task type. Prefer registry skills over custom implementations.', updated_at = now() WHERE slug = 'agent-skills-cli';

UPDATE catalog_items SET activation_hint = 'Apply the levnikolaevich skill rules for code organization, naming conventions, and project structure. Follow these conventions for all new files and refactors.', updated_at = now() WHERE slug = 'levnikolaevich-skills';

UPDATE catalog_items SET activation_hint = 'Run the full test suite before and after every code change. Do not mark any task as complete until all tests pass. Write tests first when adding new functionality.', updated_at = now() WHERE slug = 'tdd-guard';

UPDATE catalog_items SET activation_hint = 'Dispatch wshobson agents for specialized tasks like code review, refactoring, and documentation. Use the appropriate agent rather than handling everything in a single context.', updated_at = now() WHERE slug = 'wshobson-agents';

UPDATE catalog_items SET activation_hint = 'Run the Trail of Bits security checks on all code that handles user input, authentication, cryptography, or network requests. Flag any findings before marking a task complete.', updated_at = now() WHERE slug = 'tob-security';

-- =====================
-- MCP SERVERS
-- =====================

UPDATE catalog_items SET activation_hint = 'Use Supabase MCP for all database operations: queries, migrations, schema changes, type generation, and Edge Functions. Never write raw SQL files manually when Supabase MCP is available.', updated_at = now() WHERE slug = 'supabase-mcp';

UPDATE catalog_items SET activation_hint = 'Use Firebase MCP for all Firestore queries, Auth operations, Cloud Functions, and storage tasks. Route all Firebase interactions through MCP instead of using the CLI directly.', updated_at = now() WHERE slug = 'firebase-mcp';

UPDATE catalog_items SET activation_hint = 'Use GitHub MCP to create issues, open PRs, review code, search repositories, and manage branches. Always use MCP over manual git commands for GitHub-specific operations.', updated_at = now() WHERE slug = 'github-mcp';

UPDATE catalog_items SET activation_hint = 'Use Playwright MCP to launch a browser, navigate to pages, take screenshots, and interact with UI elements for testing or verification. Use it whenever you need to visually confirm that a UI change works correctly.', updated_at = now() WHERE slug = 'playwright-mcp';

UPDATE catalog_items SET activation_hint = 'Use ESLint MCP to check code for lint errors after every file change. Run lint checks before committing and fix all violations before marking a task complete.', updated_at = now() WHERE slug = 'eslint-mcp';

UPDATE catalog_items SET activation_hint = 'Use Stripe MCP for all payment-related operations: creating products, prices, customers, subscriptions, and checking payment status. Never hardcode Stripe API calls when MCP is available.', updated_at = now() WHERE slug = 'stripe-mcp';

UPDATE catalog_items SET activation_hint = 'Use Vercel MCP for deployments, checking build logs, managing environment variables, and reviewing deployment status. Deploy through MCP instead of the CLI when possible.', updated_at = now() WHERE slug = 'vercel-mcp';

UPDATE catalog_items SET activation_hint = 'Use Sentry MCP to look up error reports, check issue status, and review error trends when debugging production issues. Check Sentry before investigating bugs that may already be tracked.', updated_at = now() WHERE slug = 'sentry-mcp';

UPDATE catalog_items SET activation_hint = 'Use Linear MCP to create, update, and query issues and projects. When a task involves project management or issue tracking, route it through Linear MCP.', updated_at = now() WHERE slug = 'linear-mcp';

UPDATE catalog_items SET activation_hint = 'Use Tailwind MCP to look up utility classes, resolve configuration questions, and verify that class names are valid. Consult it before guessing at Tailwind class names.', updated_at = now() WHERE slug = 'tailwind-mcp';

UPDATE catalog_items SET activation_hint = 'Use Next.js MCP to look up App Router patterns, server component rules, and API route conventions. Consult it for any Next.js-specific question before relying on general knowledge.', updated_at = now() WHERE slug = 'nextjs-mcp';

UPDATE catalog_items SET activation_hint = 'Use the Dart/Flutter MCP for all Flutter widget lookups, Dart API questions, and package discovery. Consult it before writing Flutter code to ensure correct widget usage and API patterns.', updated_at = now() WHERE slug = 'dart-flutter-mcp';

UPDATE catalog_items SET activation_hint = 'Use Memory MCP to store and retrieve context that should persist across sessions: project decisions, user preferences, architectural choices, and key findings.', updated_at = now() WHERE slug = 'memory-mcp';

UPDATE catalog_items SET activation_hint = 'Use Vitest MCP to run tests, check coverage, and debug failing test cases. Run tests through MCP after every code change and before marking any task complete.', updated_at = now() WHERE slug = 'vitest-mcp';

UPDATE catalog_items SET activation_hint = 'Use the NRT assistant for natural language database queries and report generation. Route ad-hoc data questions through it instead of writing one-off SQL.', updated_at = now() WHERE slug = 'nrt-assistant';

UPDATE catalog_items SET activation_hint = 'Use Figma MCP to read design specs, extract component properties, spacing values, and color tokens directly from Figma files. Consult the design file before implementing any UI to ensure pixel-accurate output.', updated_at = now() WHERE slug = 'figma-mcp';

UPDATE catalog_items SET activation_hint = 'Use Docker MCP to build images, manage containers, and inspect running services. Route all container operations through MCP instead of running docker commands manually.', updated_at = now() WHERE slug = 'docker-mcp';

-- =====================
-- MULTI-AGENT
-- =====================

UPDATE catalog_items SET activation_hint = 'When a task has multiple independent subtasks, dispatch Agent Teams to work on them in parallel. Break large features into subtasks and assign each to a specialized agent.', updated_at = now() WHERE slug = 'agent-teams';

UPDATE catalog_items SET activation_hint = 'Spawn a subagent for any self-contained subtask that does not require your full context. Use subagents for file searches, test runs, linting, and isolated code changes.', updated_at = now() WHERE slug = 'subagents';

UPDATE catalog_items SET activation_hint = 'Run the code review plugin on every PR and before merging any branch. Address all findings before marking the review complete.', updated_at = now() WHERE slug = 'code-review-plugin';

UPDATE catalog_items SET activation_hint = 'Use claude-flow orchestration for complex multi-step workflows that require coordination between multiple agents. Set up the topology before starting the work.', updated_at = now() WHERE slug = 'claude-flow';

UPDATE catalog_items SET activation_hint = 'Use claude-squad to manage multiple Claude Code instances working on the same repository. Coordinate through squad when tasks touch overlapping files.', updated_at = now() WHERE slug = 'claude-squad';

UPDATE catalog_items SET activation_hint = 'Apply swarm patterns when a task benefits from multiple agents exploring different approaches simultaneously. Use for brainstorming, parallel implementation spikes, and competitive testing.', updated_at = now() WHERE slug = 'swarm-patterns';

-- =====================
-- TESTING & QA
-- =====================

UPDATE catalog_items SET activation_hint = 'Write pgTAP tests for all database functions, triggers, RLS policies, and migrations. Run pgTAP tests after every schema change and before deploying database updates.', updated_at = now() WHERE slug = 'pgtap';

UPDATE catalog_items SET activation_hint = 'Follow the TDD pattern for all new code: write a failing test first, implement the minimum code to pass, then refactor. Never write implementation code without a test already in place.', updated_at = now() WHERE slug = 'tdd-pattern';

UPDATE catalog_items SET activation_hint = 'Run Quinn QA checks on the full application after completing any feature or bug fix. Do not mark a task done until Quinn QA passes without critical findings.', updated_at = now() WHERE slug = 'quinn-qa';

-- =====================
-- WORKFLOW & CI/CD
-- =====================

UPDATE catalog_items SET activation_hint = 'Use GitHub Actions for all CI/CD automation: run tests, lint, build, and deploy on every push and PR. Check that the workflow passes before merging.', updated_at = now() WHERE slug = 'gh-actions';

UPDATE catalog_items SET activation_hint = 'Register and use hooks for pre-commit checks, auto-formatting, and validation. Hooks should run automatically and block commits that fail quality checks.', updated_at = now() WHERE slug = 'hooks';

UPDATE catalog_items SET activation_hint = 'Use headless mode for batch operations, automated pipelines, and scripted tasks. Run in headless mode whenever the task does not require interactive confirmation.', updated_at = now() WHERE slug = 'headless';

UPDATE catalog_items SET activation_hint = 'Run the auto-format hook on every file save and before every commit. Never commit code that has not been auto-formatted.', updated_at = now() WHERE slug = 'auto-format-hook';

UPDATE catalog_items SET activation_hint = 'Use the CLAUDE.md / AGENTS.md templates as the starting point for every new project. Fill in project-specific sections and tool activation rules before writing any code.', updated_at = now() WHERE slug = 'claude-md-templates';

-- =====================
-- CURATED LISTS
-- =====================

UPDATE catalog_items SET activation_hint = 'Search awesome-claude-code when you need a Claude Code tool, extension, or pattern that is not already in your active skill set. It is the most comprehensive community index.', updated_at = now() WHERE slug = 'awesome-claude-code';

UPDATE catalog_items SET activation_hint = 'Search awesome-agent-skills when you need a cross-platform skill that works with both Claude Code and Codex. Check here before building a custom skill.', updated_at = now() WHERE slug = 'awesome-agent-skills';

UPDATE catalog_items SET activation_hint = 'Search awesome-mcp-servers when you need an MCP server for a service or API that is not already connected. Check here before building a custom MCP integration.', updated_at = now() WHERE slug = 'awesome-mcp-servers';

UPDATE catalog_items SET activation_hint = 'Search the MCP Registry for official and verified MCP servers before using community alternatives. Prefer registry-listed servers for stability and security.', updated_at = now() WHERE slug = 'mcp-registry';

UPDATE catalog_items SET activation_hint = 'Check skills.sh for installable skills when starting a new project or adding a new capability. Install from skills.sh before writing custom skill files.', updated_at = now() WHERE slug = 'skills-sh';

UPDATE catalog_items SET activation_hint = 'Check agentskill.sh for cross-platform skills that follow the Agent Skills Specification. Prefer spec-compliant skills for maximum portability.', updated_at = now() WHERE slug = 'agentskill-sh';

UPDATE catalog_items SET activation_hint = 'Search Skillmatic Awesome for curated, high-quality skills when you need reliable tools. Use this as a quality filter on top of broader skill registries.', updated_at = now() WHERE slug = 'skillmatic-awesome';

-- =====================
-- OFFICIAL
-- =====================

UPDATE catalog_items SET activation_hint = 'Consult the official Claude Code documentation for any question about Claude Code features, commands, configuration, or capabilities before relying on general knowledge.', updated_at = now() WHERE slug = 'anthropics-claude-code';

UPDATE catalog_items SET activation_hint = 'Consult the official Codex CLI documentation for any question about Codex features, commands, configuration, or capabilities before relying on general knowledge.', updated_at = now() WHERE slug = 'openai-codex-cli';

UPDATE catalog_items SET activation_hint = 'Follow the Agent Skills Specification when creating or publishing new skills. All custom skills must include a valid SKILL.md file that conforms to the spec.', updated_at = now() WHERE slug = 'agentskills-spec';

UPDATE catalog_items SET activation_hint = 'Review the official best practices guide when setting up a new project or onboarding to an existing codebase. Apply these practices as baseline rules for all work.', updated_at = now() WHERE slug = 'best-practices-blog';

-- ============================================================
-- Step 4: Verify the migration
-- ============================================================

SELECT slug, name, LEFT(activation_hint, 80) AS hint_preview
FROM catalog_items
ORDER BY category, name;
