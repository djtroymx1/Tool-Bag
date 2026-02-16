# Tool Bag

Tool Bag is a Next.js application for browsing AI coding ecosystem tools (skills, MCP servers, workflows), selecting the right stack for a project, and exporting ready-to-use configuration files for Claude Code and Codex.

## Run Locally

1. Install dependencies:

```bash
npm install
```

2. Create `.env.local`:

```bash
NEXT_PUBLIC_SUPABASE_URL=https://<your-project-ref>.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=<your-anon-key>
```

3. Start the dev server:

```bash
npm run dev
```

4. Open `http://localhost:3000`.

## Deploy

Deploy on Vercel with Supabase as the data source:

1. Push this repository to GitHub.
2. Import the project into Vercel.
3. Configure environment variables in Vercel:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Deploy.

## Update Catalog Data

Catalog items are stored in Supabase (`catalog_items`).

1. Use Supabase Dashboard:
   - Open Table Editor.
   - Select `catalog_items`.
   - Insert or update rows.

2. Or use SQL:

```sql
insert into catalog_items (
  slug,
  name,
  category,
  source,
  stars,
  url,
  stack,
  description,
  claude_code_install,
  codex_install,
  mcp_config_claude,
  mcp_config_codex,
  platforms,
  priority,
  notes,
  last_verified_at
) values (
  'example-tool',
  'Example Tool',
  'Skills & Plugins',
  'Community',
  '--',
  'https://example.com',
  array['General'],
  'Example description',
  null,
  null,
  null,
  null,
  array['claude-code', 'codex'],
  'recommended',
  null,
  now()
);
```
