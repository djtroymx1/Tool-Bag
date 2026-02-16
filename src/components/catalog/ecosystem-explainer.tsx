"use client";

import { useState, useSyncExternalStore } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

const STORAGE_KEY = "explainer-collapsed";

function readCollapsedPreference(): boolean {
  if (typeof window === "undefined") {
    return true;
  }

  return localStorage.getItem(STORAGE_KEY) !== "false";
}

function Section({
  headline,
  children,
}: {
  headline: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <h3 className="text-sm font-semibold text-zinc-200">{headline}</h3>
      <div className="text-sm text-zinc-400 leading-relaxed space-y-3">
        {children}
      </div>
    </div>
  );
}

export function EcosystemExplainer() {
  const hydrated = useSyncExternalStore(
    () => () => {},
    () => true,
    () => false
  );
  const [collapsed, setCollapsed] = useState<boolean>(() =>
    readCollapsedPreference()
  );

  function toggle() {
    const next = !collapsed;
    setCollapsed(next);
    localStorage.setItem(STORAGE_KEY, String(next));
  }

  function gotIt() {
    setCollapsed(true);
    localStorage.setItem(STORAGE_KEY, "true");
  }

  if (!hydrated) {
    return (
      <div
        className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2.5 sm:px-6 min-h-[44px]"
        aria-hidden="true"
      />
    );
  }

  return (
    <div className="rounded-lg border border-zinc-800/50 bg-zinc-900/30 px-4 py-2.5 sm:px-6">
      {/* Collapsed header — always visible */}
      <button
        onClick={toggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <p className="text-sm text-zinc-400">
          New to AI-assisted development? Learn what skills, MCP servers, and
          tools do and why they matter.
        </p>
        <span className="flex shrink-0 items-center gap-1.5 text-xs text-emerald-400 hover:text-emerald-300 transition-colors">
          {collapsed ? "Learn more" : "Collapse"}
          <ChevronDown
            className={cn(
              "h-3.5 w-3.5 transition-transform duration-300",
              !collapsed && "rotate-180"
            )}
          />
        </span>
      </button>

      {/* Expanded content */}
      <div
        className={cn(
          "overflow-hidden transition-all duration-300",
          collapsed ? "max-h-0 opacity-0" : "max-h-[2000px] opacity-100 mt-5"
        )}
      >
        <div className="flex flex-col gap-5">
          <Section headline="Why This Matters">
            <p>
              When you use an AI coding agent like Claude Code or OpenAI Codex,
              you&apos;re working with a powerful tool that can write, debug, and
              refactor code. But out of the box, it doesn&apos;t know your
              project&apos;s conventions, your preferred libraries, your
              deployment pipeline, or how your team works. It&apos;s like hiring
              a brilliant developer who has never seen your codebase.
            </p>
            <p>
              Skills, MCP servers, and the other tools in this catalog solve that
              problem. They give your AI agent specific knowledge, access to
              external services, and structured workflows so it produces code
              that actually fits your project instead of generic output.
            </p>
          </Section>

          <div className="border-t border-zinc-800/50" />

          <Section headline="What Are Skills?">
            <p>
              A skill is a set of instructions packaged in a simple folder with a
              SKILL.md file. When your AI agent encounters a task that matches a
              skill&apos;s description, it reads those instructions and follows
              them. Think of it like giving a contractor a detailed spec sheet
              instead of saying &ldquo;build me a house.&rdquo;
            </p>
            <p>
              For example, a frontend-design skill teaches the agent to write
              polished, non-generic UI code. A TDD skill enforces test-driven
              development so the agent writes tests before implementation. A
              Supabase skill gives the agent deep knowledge of your database
              platform&apos;s patterns and best practices.
            </p>
            <p>
              Skills follow an open standard that works across Claude Code,
              Codex, Gemini CLI, Cursor, GitHub Copilot, and 40+ other
              platforms. Write once, use everywhere.
            </p>
          </Section>

          <div className="border-t border-zinc-800/50" />

          <Section headline="What Are MCP Servers?">
            <p>
              MCP stands for Model Context Protocol. An MCP server connects your
              AI agent to an external service, like your database, your GitHub
              repos, your deployment platform, or your error tracking system.
              Without MCP, you&apos;d have to copy and paste data between tools
              manually. With MCP, the agent can query your Supabase database,
              create a GitHub PR, or deploy to Vercel directly.
            </p>
            <p>
              For example, with the Supabase MCP server connected, you can tell
              your agent &ldquo;add a new column to the users table and update
              the TypeScript types&rdquo; and it will run the actual migration.
              Without it, the agent can only write the SQL and hope you run it
              yourself.
            </p>
          </Section>

          <div className="border-t border-zinc-800/50" />

          <Section headline="What This Catalog Does For You">
            <p>
              This catalog is a reference of every major skill, MCP server,
              multi-agent tool, testing pattern, and workflow tool available for
              Claude Code and Codex. Instead of searching GitHub and hoping you
              find what you need, you can browse and filter everything in one
              place.
            </p>
            <p>
              Pick the tools that match your project. Select your platform. Hit
              export. You get ready-to-paste config files that set up your entire
              development environment in seconds. No manual configuration, no
              guessing which tools work together.
            </p>
          </Section>

          <div className="border-t border-zinc-800/50" />

          <Section headline="Always Up to Date">
            <p>
              The AI coding tool ecosystem moves fast. New skills, MCP servers,
              and integrations ship every week. This catalog is actively
              maintained and updated as the ecosystem evolves. When a new tool
              launches, an existing one gets a major update, or something gets
              deprecated, it gets reflected here. Every item includes a
              &ldquo;last verified&rdquo; date so you know the information is
              current, not a snapshot from six months ago that nobody bothered to
              update.
            </p>
            <p>
              If you find something missing or outdated, reach out. This is a
              living reference built for developers who want to stay on top of
              what&apos;s available without having to chase down dozens of GitHub
              repos and changelogs themselves.
            </p>
          </Section>

          {/* Got it button */}
          <div className="flex justify-end pt-1">
            <button
              onClick={gotIt}
              className="text-xs font-medium text-emerald-400 hover:text-emerald-300 transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
