export interface StarterKit {
  id: string;
  name: string;
  description: string;
  icon: string;
  slugs: string[];
}

export const STARTER_KITS: StarterKit[] = [
  {
    id: "fullstack-next",
    name: "Full-Stack Next.js",
    description: "Complete setup for Next.js apps with Supabase, testing, and deployment",
    icon: "Rocket",
    slugs: [
      "context7-mcp",
      "supabase-mcp",
      "claude-test-runner",
      "code-review-skill",
      "sequential-thinking",
      "playwright-mcp",
    ],
  },
  {
    id: "api-backend",
    name: "API & Backend",
    description: "Build robust APIs with database access, testing, and monitoring",
    icon: "Server",
    slugs: [
      "postgres-mcp",
      "sequential-thinking",
      "claude-test-runner",
      "code-review-skill",
      "context7-mcp",
    ],
  },
  {
    id: "quality-first",
    name: "Quality & Testing",
    description: "Comprehensive testing, code review, and quality assurance tools",
    icon: "Shield",
    slugs: [
      "code-review-skill",
      "claude-test-runner",
      "playwright-mcp",
      "vitest-skill",
      "sequential-thinking",
    ],
  },
  {
    id: "rapid-prototype",
    name: "Rapid Prototyping",
    description: "Ship fast with AI-powered scaffolding and instant previews",
    icon: "Zap",
    slugs: [
      "context7-mcp",
      "sequential-thinking",
      "browser-tools-mcp",
      "figma-mcp",
    ],
  },
  {
    id: "devops-cicd",
    name: "DevOps & CI/CD",
    description: "Automate your pipeline with GitHub integration and deployment tools",
    icon: "GitBranch",
    slugs: [
      "github-mcp",
      "code-review-skill",
      "claude-test-runner",
      "linear-mcp",
    ],
  },
];
